import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { OpenAI } from 'openai';
import Account from '../models/account.js';
import Transaction from '../models/transaction.js';
import FailedTransaction from '../models/failedTransaction.js';
import { updateCreateAccount } from './updateCreateAccount.js';

import auth from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: 'uploads/' });

// Predefined classification system for Commonwealth Bank
const COMMONWEALTH_CATEGORIES = {
  Income: ['Salary', 'Bonus', 'Transfer', 'Repayment', 'Rental Income'],
  Expense: [
    'Groceries',
    'Dining',
    'Transport',
    'Utilities',
    'Rent/Mortgage',
    'Entertainment',
    'Shopping',
    'Insurance',
    'Fees',
  ],
  Transfer: ['Internal Transfer', 'External Transfer'],
};

// Commonwealth Bank specific keywords
const COMMONWEALTH_KEYWORDS = {
  Groceries: ['coles', 'woolworths', 'iga', 'aldi', 'supermarket'],
  Dining: ['maccas', 'dominos', 'restaurant', 'cafe', 'chicken'],
  Transport: ['uber', 'taxi', 'toll', 'fuel', 'bp'],
  Utilities: ['optus', 'telstra', 'agl', 'origin', 'energy'],
};

// Clean and parse JSON response from OpenAI
const cleanAndParseJSON = (jsonStr) => {
  try {
    // Remove Markdown code blocks if present
    const cleaned = jsonStr.replace(/^```json|```$/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON:', jsonStr);
    throw new Error(`Invalid JSON response: ${err.message}`);
  }
};

// Extract bank details from Commonwealth Bank statement
const extractBankDetails = async (text) => {
  const prompt = `Extract the following from this Commonwealth Bank statement:
  1. bankName
  2. accountNumber (from "Account number" field)
  3. bsb (from "BSB" field)
  4. closingBalance (last balance in transactions)
  5. statementDate (from "Dear..." line or use current date)

  Return PURE JSON (no Markdown, no explanations) like:
  {
    "bankName": "Name",
    "accountNumber": "12345678",
    "bsb": "000000",
    "closingBalance": 1000.50,
    "statementDate": "2025-04-01"
  }

  Statement text: ${text.slice(0, 5000)};`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const result = cleanAndParseJSON(response.choices[0].message.content);

    return {
      bankName: 'Commonwealth Bank',
      accountNumber: result.accountNumber?.replace(/\s+/g, '') || '',
      bsb: result.bsb || '062443',
      closingBalance: parseFloat(result.closingBalance) || 0,
      statementDate:
        result.statementDate || new Date().toISOString().split('T')[0],
      currency: 'AUD',
    };
  } catch (err) {
    console.error('Bank details extraction failed:', err);
    throw new Error('Could not extract bank details from statement');
  }
};

// Extract transactions from Commonwealth Bank statement
const extractTransactions = async (text) => {
  console.log('Starting transaction extraction...');

  // First clean the text and extract just the transaction section
  const transactionStart = text.indexOf('Date\nTransactionDebitCreditBalance');
  const transactionEnd = text.indexOf('Closing balance');
  const transactionText = text.slice(transactionStart, transactionEnd);
  const cleanedText = transactionText.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  console.log('Transaction text sample:', cleanedText.substring(0, 500));

  const prompt = `Extract ALL transactions from this Commonwealth Bank statement as a JSON array.
  Each transaction should include:
  - date (format: "DD MMM")
  - description (clean merchant names)
  - amount (negative for debits, positive for credits)
  - balance (current balance after transaction)

  Here is the transaction text to parse as JSON:
  ${cleanedText.substring(0, 10000)};`;

  try {
    console.log('Sending to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    console.log('OpenAI response received');
    const content = response.choices[0].message.content;
    // console.log('Raw OpenAI response:', content);

    // Clean and parse
    let jsonStr = content.replace(/^```json|```$/g, '').trim();
    let result = JSON.parse(jsonStr);

    // Normalize to array format
    let transactions = [];
    if (Array.isArray(result)) {
      transactions = result;
    } else if (result.transactions && Array.isArray(result.transactions)) {
      transactions = result.transactions;
    } else if (result.date && result.description) {
      // Single transaction object
      transactions = [result];
    } else {
      throw new Error('Unexpected response format from OpenAI');
    }

    if (!transactions.length) {
      throw new Error('No transactions found in response');
    }

    console.log(`Extracted ${transactions.length} transactions`);
    console.log('Sample transactions:', transactions.slice(0, 3));

    return transactions
      .map((tx) => ({
        date: tx.date || '',
        amount: parseFloat(tx.amount) || 0,
        description: tx.description || '',
        balance: parseFloat(tx.balance) || 0,
        isValid: !isNaN(parseFloat(tx.amount)) && tx.description,
      }))
      .filter((tx) => tx.isValid);
  } catch (err) {
    console.error('Extraction error:', err);

    // Try fallback parsing if AI extraction fails
    console.log('Attempting fallback parsing...');
    const fallbackTx = tryAlternativeParsing(cleanedText);
    if (fallbackTx && fallbackTx.length > 0) {
      console.log(`Fallback parsing found ${fallbackTx.length} transactions`);
      return fallbackTx;
    }

    throw new Error(`Transaction extraction failed: ${err.message}`);
  }
};

// Enhanced regex fallback parser
const tryAlternativeParsing = (text) => {
  const transactions = [];
  // Match date, description, amount, balance
  const regex =
    /(\d{1,2} \w{3})\s+(.*?)\s+(-?\$?\d+\.\d{2})\s+\$?(\d+\.\d{2})/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    transactions.push({
      date: match[1],
      description: match[2]
        .replace(/Card \w+\d+/, '')
        .replace(/Value Date:.*/, '')
        .trim(),
      amount: parseFloat(match[3].replace(/[^\d.-]/g, '')),
      balance: parseFloat(match[4].replace(/[^\d.-]/g, '')),
    });
  }

  return transactions;
};

// Categorize Commonwealth Bank transactions
const categorizeTransaction = async (description, amount) => {
  const prompt = `Categorize this Commonwealth Bank transaction:
  Description: "${description}"
  Amount: ${amount} AUD

  Return PURE JSON (no Markdown, no explanations):
  {
    "type": "Income|Expense|Transfer",
    "category": "specific_category",
    "isTransfer": boolean
  };`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const result = cleanAndParseJSON(response.choices[0].message.content);
    return {
      type: result.type || (amount > 0 ? 'Income' : 'Expense'),
      category: result.category || 'Uncategorized',
      isTransfer: result.isTransfer || false,
    };
  } catch (err) {
    console.error('Categorization failed:', err);
    return {
      type: amount > 0 ? 'Income' : 'Expense',
      category: 'Uncategorized',
      isTransfer: false,
    };
  }
};

// Account management
const getOrCreateAccount = async (userId, accountData) => {
  if (!accountData.accountNumber) {
    throw new Error('Account number is required');
  }

  const normalizedNumber = accountData.accountNumber.replace(/\s+/g, '');
  let account = await Account.findOne({
    userId,
    accountNumber: normalizedNumber,
    accountType: 'bank',
  });

  if (!account) {
    account = new Account({
      userId,
      name: `${accountData.bankName} Account`,
      accountType: 'bank',
      accountNumber: normalizedNumber,
      bsb: accountData.bsb,
      balance: accountData.closingBalance,
      currency: 'AUD',
      provider: accountData.bankName,
      isManual: false,
      notes: 'Auto-created from statement upload',
    });
    await account.save();
  } else if (accountData.closingBalance !== undefined) {
    account.balance = accountData.closingBalance;
    await account.save();
  }

  return account;
};

// Process transactions
const processTransactions = async (userId, transactions, accountId) => {
  const results = {
    success: [],
    failed: [],
    duplicates: [],
  };

  for (const tx of transactions) {
    try {
      // Validate transaction
      if (!tx.date || !tx.description || tx.amount === undefined) {
        throw new Error('Missing required fields');
      }

      // Check for duplicates
      const existing = await Transaction.findOne({
        userId,
        description: tx.description.trim(),
        amount: tx.amount,
        date: {
          $gte: new Date(new Date(tx.date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(tx.date).setHours(23, 59, 59, 999)),
        },
      });

      if (existing) {
        results.duplicates.push(tx);
        continue;
      }

      // Categorize transaction
      const category = await categorizeTransaction(tx.description, tx.amount);

      // console.log(category);

      if (category.isTransfer) {
        // const details = await extractTransferDetails(tx);
        // const isOutgoing = details.direction === 'outgoing';
        await updateCreateAccount(tx, category);
      }
      // Create transaction record
      const newTx = new Transaction({
        userId,
        type: category.type,
        amount: tx.amount,
        description: tx.description,
        fromAccountId: accountId,
        date: new Date(tx.date),
        category: category.category,
        isAutoCategorized: true,
        isFromUpload: true,
        metadata: {
          source: 'commbank-import',
          originalBalance: tx.balance,
        },
      });

      await newTx.save();
      results.success.push(newTx);
    } catch (err) {
      await FailedTransaction.create({
        userId,
        rawData: tx,
        error: err.message,
        status: 'pending_review',
      });
      results.failed.push(tx);
    }
  }

  return results;
};

// Main upload endpoint
router.post('/upload', auth, upload.single('statement'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log('Processing PDF file...');
    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    console.log('PDF parsed successfully');

    // Extract bank details
    console.log('Extracting bank details...');
    const bankDetails = await extractBankDetails(pdfData.text);
    console.log('Bank details extracted:', bankDetails);

    // Create or update account
    console.log('Getting/creating account...');
    const account = await getOrCreateAccount(req.user.id, bankDetails);
    console.log('Account ready:', account._id);

    // Extract transactions
    console.log('Extracting transactions...');
    let rawTransactions;
    try {
      rawTransactions = await extractTransactions(pdfData.text);
      console.log(`Extracted ${rawTransactions.length} transactions`);

      if (!rawTransactions.length) {
        console.log(
          'No transactions found via AI extraction, trying fallback...'
        );
        rawTransactions = tryAlternativeParsing(pdfData.text);
        if (!rawTransactions.length) {
          throw new Error('No transactions could be extracted from statement');
        }
        console.log(
          `Fallback parsing found ${rawTransactions.length} transactions`
        );
      }
    } catch (extractionError) {
      console.error(
        'Transaction extraction failed, trying fallback:',
        extractionError
      );
      rawTransactions = tryAlternativeParsing(pdfData.text);
      if (!rawTransactions.length) {
        throw new Error(
          'Failed to extract transactions: ' + extractionError.message
        );
      }
      console.log(
        `Fallback parsing found ${rawTransactions.length} transactions`
      );
    }

    // Process transactions
    console.log('Processing transactions...');
    const results = await processTransactions(
      req.user.id,
      rawTransactions,
      account._id
    );

    // Update account balance with last transaction
    if (rawTransactions.length > 0) {
      const lastTx = rawTransactions[rawTransactions.length - 1];
      account.balance = lastTx.balance;
      await account.save();
      console.log('Final account balance updated:', account.balance);
    }

    // Cleanup
    fs.unlinkSync(req.file.path);
    console.log('Temporary file removed');

    // Response
    res.status(201).json({
      message: 'Statement processed successfully',
      stats: {
        processed: results.success.length,
        failed: results.failed.length,
        duplicates: results.duplicates.length,
        newBalance: account.balance,
      },
      notes:
        results.failed.length > 0
          ? 'Some transactions failed processing and need review'
          : 'All transactions processed successfully',
    });
  } catch (err) {
    console.error('Upload failed:', err);
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
      console.log('Temporary file removed after error');
    }

    // More user-friendly error messages
    let errorMessage = err.message;
    if (err.message.includes('No transactions could be extracted')) {
      errorMessage =
        'Could not extract transactions from this statement. Please ensure it is a valid Commonwealth Bank statement.';
    } else if (err.message.includes('bank details')) {
      errorMessage =
        'Could not extract bank details from this statement. Please check the statement format.';
    }

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      suggestion: 'Try uploading a different statement or contact support',
    });
  }
});

export default router;

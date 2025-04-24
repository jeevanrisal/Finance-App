// routes/transactionRoute.js
import express from 'express';
import Transaction from '../models/transaction.js';
import Account from '../models/account.js';
import auth from '../middleware/auth.js';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GPT categorization
const categorizeWithGPT = async ({ description, amount }) => {
  try {
    const prompt = `Categorize this financial transaction:
Description: "${description}"
Amount: ${amount}
Respond only with a JSON object like: { "category": "...", "subCategory": "..." }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      category: parsed.category || 'Uncategorized',
      subCategory: parsed.subCategory || '',
      isAutoCategorized: true,
    };
  } catch (err) {
    console.error('GPT categorization failed:', err.message);
    return {
      category: 'Uncategorized',
      subCategory: '',
      isAutoCategorized: false,
    };
  }
};

// @route POST /api/transactions
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      amount,
      fromAccountId,
      toAccountId,
      description,
      notes,
      date,
      isFromUpload,
    } = req.body;

    const gptCategory = await categorizeWithGPT({ description, amount });

    const transaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      fromAccountId,
      toAccountId,
      description,
      notes,
      date,
      isFromUpload: isFromUpload || false,
      ...gptCategory,
    });

    await transaction.save();

    if (type === 'Expense' && fromAccountId) {
      await Account.findByIdAndUpdate(fromAccountId, {
        $inc: { balance: -amount },
      });
    } else if (type === 'Income' && toAccountId) {
      await Account.findByIdAndUpdate(toAccountId, {
        $inc: { balance: amount },
      });
    } else if (type === 'Transfer') {
      if (fromAccountId)
        await Account.findByIdAndUpdate(fromAccountId, {
          $inc: { balance: -amount },
        });
      if (toAccountId)
        await Account.findByIdAndUpdate(toAccountId, {
          $inc: { balance: amount },
        });
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/transactions
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, type, category, accountId, search } = req.query;

    const filters = { userId };

    if (type) filters.type = new RegExp(`^${type.trim()}$`, 'i');
    if (category) filters.category = category;
    if (accountId) {
      filters.$or = [{ fromAccountId: accountId }, { toAccountId: accountId }];
    }

    if (year || month) {
      const now = new Date();
      const y = parseInt(year) || now.getFullYear();
      const m = month ? parseInt(month) - 1 : 0;
      const startDate = new Date(y, m, 1);
      const endDate = month ? new Date(y, m + 1, 1) : new Date(y + 1, 0, 1);
      filters.date = { $gte: startDate, $lt: endDate };
    }

    if (search) {
      const keyword = new RegExp(search.trim(), 'i');
      filters.$or = [
        { type: keyword },
        { description: keyword },
        { category: keyword },
        { subCategory: keyword },
        { notes: keyword },
      ];
    }

    console.log('🧪 Final filters:', filters);
    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Transaction fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
});

export default router;

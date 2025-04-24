// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import userRoutes from './routers/userRoutes.js';
import accountRoutes from './routers/accountRoutes.js';
import transactionRoutes from './routers/transactionRouter.js';
import uploadRoutes from './routers/uploadRoute.js';
import summaryRoutes from './routers/summaryRoutes.js';
import duplicateRouter from './routers/transactionDuplicateRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transactions', uploadRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/transactions', duplicateRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// // routes/uploadRoute.js
// import express from 'express';
// import multer from 'multer';
// import csvParser from 'csv-parser';
// import fs from 'fs';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdfParse = require('pdf-parse');
// import { OpenAI } from 'openai';
// import Transaction from '../models/transaction.js';
// import Account from '../models/account.js';
// import auth from '../middleware/auth.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const upload = multer({ dest: 'uploads/' });

// const getOrCreateAccount = async (userId, accountNumber) => {
//   let account = await Account.findOne({ userId, accountNumber });
//   if (!account) {
//     account = new Account({
//       userId,
//       name: `Imported Bank Account`,
//       accountType: 'bank',
//       accountNumber,
//       balance: 0,
//       isManual: false,
//       notes: 'Auto-created from statement upload',
//     });
//     await account.save();
//   }
//   return account;
// };

// const batchCategorizeWithGPT = async (transactions) => {
//   const allowedTypes = ['Income', 'Expense', 'Transfer'];
//   const results = [];

//   for (let i = 0; i < transactions.length; i += 25) {
//     const chunk = transactions.slice(i, i + 25);
//     const prompt = `Categorize the following financial transactions. Respond with a JSON array where each item includes: type, category, subCategory. Use only one of the following values for type: Income, Expense, Transfer.

// Transactions:
// ${chunk
//   .map(
//     (t, j) => `${j + 1}. Description: "${t.description}", Amount: ${t.amount}`
//   )
//   .join('\n')}

// Respond only with JSON array.`;

//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.2,
//       });

//       const parsed = JSON.parse(response.choices[0].message.content);

//       for (const item of parsed) {
//         results.push({
//           type: allowedTypes.includes(item.type) ? item.type : 'Expense',
//           category: item.category || 'Uncategorized',
//           subCategory: item.subCategory || '',
//           isAutoCategorized: true,
//         });
//       }
//     } catch (err) {
//       console.error('Chunk categorization failed:', err.message);
//       chunk.forEach(() =>
//         results.push({
//           type: 'Expense',
//           category: 'Uncategorized',
//           subCategory: '',
//           isAutoCategorized: false,
//         })
//       );
//     }
//   }

//   return results;
// };

// const extractTransactionsFromPdf = async (pdfText) => {
//   const lines = pdfText.split('\n');
//   const datePattern = /^\d{2} \w{3}$/;
//   const accountNumberMatch = lines.find((line) => /\d{4} \d{8}/.test(line));
//   const accountNumber = accountNumberMatch
//     ? accountNumberMatch.replace(/\s+/g, '')
//     : 'UNKNOWN';

//   const transactions = [];
//   let current = [];

//   for (const line of lines) {
//     if (datePattern.test(line.trim())) {
//       if (current.length) transactions.push(current);
//       current = [line];
//     } else {
//       current.push(line);
//     }
//   }
//   if (current.length) transactions.push(current);

//   const formattedRows = transactions.map(
//     (t) =>
//       `Date: ${t[0]}, Description: ${t.slice(1).join(' ').trim()}, AccountNumber: ${accountNumber}`
//   );

//   const chunked = formattedRows.join('\n');

//   const prompt = `Extract all transactions as a JSON array. Each object should include: date, amount, description, accountNumber. Input:\n${chunked.slice(0, 12000)}`;

//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: prompt }],
//     temperature: 0.2,
//   });

//   const rawContent = response.choices[0].message.content.trim();
//   const jsonStr = rawContent.replace(/^```json|```$/g, '').trim();
//   return JSON.parse(jsonStr);
// };

// router.post('/upload', auth, upload.single('statement'), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const userId = req.user.id;
//     const transactions = [];
//     const skippedRows = [];
//     const duplicateRows = [];

//     if (req.file.mimetype === 'application/pdf') {
//       const buffer = fs.readFileSync(filePath);
//       const data = await pdfParse(buffer);
//       const extracted = await extractTransactionsFromPdf(data.text);

//       const filtered = extracted.filter((row) => {
//         const { date, amount, description, accountNumber } = row;
//         const cleanAmount = parseFloat(
//           String(amount).replace(/[^0-9.-]+/g, '')
//         );
//         const parsedDate = new Date(date);
//         const valid =
//           description &&
//           !isNaN(cleanAmount) &&
//           accountNumber &&
//           !isNaN(parsedDate);
//         if (!valid) skippedRows.push(row);
//         return valid;
//       });

//       const gptCategories = await batchCategorizeWithGPT(filtered);

//       for (let i = 0; i < filtered.length; i++) {
//         const { date, amount, description, accountNumber } = filtered[i];
//         const cleanAmount = parseFloat(
//           String(amount).replace(/[^0-9.-]+/g, '')
//         );
//         const parsedDate = new Date(date);
//         const gpt = gptCategories[i] || {};

//         const gptData = {
//           type: ['Income', 'Expense', 'Transfer'].includes(gpt.type)
//             ? gpt.type
//             : 'Expense',
//           category: gpt.category || 'Uncategorized',
//           subCategory: gpt.subCategory || '',
//           isAutoCategorized: gpt.isAutoCategorized ?? false,
//         };

//         const account = await getOrCreateAccount(userId, accountNumber);

//         const existing = await Transaction.findOne({
//           userId,
//           description: description.trim(),
//           amount: { $eq: cleanAmount },
//           date: {
//             $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
//             $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
//           },
//         });

//         if (existing) {
//           duplicateRows.push({ date, amount, description });
//           continue;
//         }

//         transactions.push({
//           userId,
//           amount: cleanAmount,
//           description,
//           fromAccountId: account._id,
//           date: parsedDate,
//           isFromUpload: true,
//           ...gptData,
//         });
//       }

//       await Transaction.insertMany(transactions);
//       fs.unlinkSync(filePath);
//       console.log(`Skipped rows (${skippedRows.length}):`, skippedRows);
//       console.log(`Duplicate rows (${duplicateRows.length}):`, duplicateRows);
//       return res.status(201).json({
//         message: `${transactions.length} PDF transactions saved.`,
//         skipped: skippedRows.length,
//         duplicates: duplicateRows.length,
//       });
//     } else if (
//       req.file.mimetype === 'text/csv' ||
//       req.file.originalname.endsWith('.csv')
//     ) {
//       const stream = fs.createReadStream(filePath).pipe(csvParser());
//       const processingPromises = [];

//       stream.on('data', (row) => {
//         const promise = (async () => {
//           const {
//             Date: date,
//             Amount: amount,
//             Description: description,
//             AccountNumber: accountNumber,
//           } = row;
//           const cleanAmount = parseFloat(
//             String(amount).replace(/[^0-9.-]+/g, '')
//           );
//           const parsedDate = new Date(date);
//           if (
//             !description ||
//             isNaN(cleanAmount) ||
//             !accountNumber ||
//             isNaN(parsedDate)
//           ) {
//             skippedRows.push(row);
//             return;
//           }

//           // Create new Date instances for the start and end of the day
//           const startOfDay = new Date(parsedDate);
//           startOfDay.setHours(0, 0, 0, 0);
//           const endOfDay = new Date(parsedDate);
//           endOfDay.setHours(23, 59, 59, 999);

//           // Batch call GPT for this single row (if desired, you could batch multiple rows too)
//           const gpt = (
//             await batchCategorizeWithGPT([{ description, amount: cleanAmount }])
//           )[0];

//           const gptData = {
//             type: ['Income', 'Expense', 'Transfer'].includes(gpt?.type)
//               ? gpt.type
//               : 'Expense',
//             category: gpt?.category || 'Uncategorized',
//             subCategory: gpt?.subCategory || '',
//             isAutoCategorized: gpt?.isAutoCategorized ?? false,
//           };

//           const account = await getOrCreateAccount(userId, accountNumber);

//           const existing = await Transaction.findOne({
//             userId,
//             description: description.trim(),
//             amount: { $eq: cleanAmount },
//             date: { $gte: startOfDay, $lt: endOfDay },
//           });

//           if (existing) {
//             duplicateRows.push({ date, amount, description });
//             return;
//           }

//           transactions.push({
//             userId,
//             amount: cleanAmount,
//             description,
//             fromAccountId: account._id,
//             date: parsedDate,
//             isFromUpload: true,
//             ...gptData,
//           });
//         })();
//         processingPromises.push(promise);
//       });

//       stream.on('end', async () => {
//         await Promise.all(processingPromises);
//         await Transaction.insertMany(transactions);
//         fs.unlinkSync(filePath);
//         console.log(`CSV skipped: ${skippedRows.length}`);
//         console.log(`CSV duplicates: ${duplicateRows.length}`);
//         res.status(201).json({
//           message: `${transactions.length} CSV transactions saved.`,
//           skipped: skippedRows.length,
//           duplicates: duplicateRows.length,
//         });
//       });
//     } else {
//       return res.status(400).json({ message: 'Unsupported file format.' });
//     }
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    accountType: {
      type: String,
      enum: [
        'bank',
        'wallet',
        'credit',
        'loan',
        'asset',
        'liability',
        'person',
      ],
      required: true,
    },
    provider: { type: String },
    balance: { type: Number, default: 0 },
    isManual: { type: Boolean, default: false },
    linkedTo: { type: String },
    notes: { type: String },

    // Unique identifiers for validation
    accountNumber: { type: String, unique: false }, // Only required for 'bank'
    cardNumber: { type: String, unique: false }, // Only required for 'credit'
    walletEmail: { type: String, unique: false }, // Only required for 'wallet'
  },
  { timestamps: true }
);

// Add compound indexes to prevent duplicate accounts per user
accountSchema.index(
  { userId: 1, accountNumber: 1 },
  { unique: true, partialFilterExpression: { accountType: 'bank' } }
);
accountSchema.index(
  { userId: 1, cardNumber: 1 },
  { unique: true, partialFilterExpression: { accountType: 'credit' } }
);
accountSchema.index(
  { userId: 1, walletEmail: 1 },
  { unique: true, partialFilterExpression: { accountType: 'wallet' } }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;

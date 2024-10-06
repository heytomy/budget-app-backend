import { Schema, model } from 'mongoose';

const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
}, { unique: true });

const Transaction = model('Transaction', transactionSchema);
export default Transaction;
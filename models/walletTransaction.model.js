const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TransactionDescription } = require('../utils/constants');

const schema = new Schema({
    wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet',index:true },
    description: { type: String, required: false},
    balance_from: { type: Number, required: true, default: 0 },
    balance_to: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
    created_at: { type: Date, default: Date.now, sparse: true },
    transactionType: { type: String,index:true ,
        enum : [
            TransactionDescription.Account_Creation,
            TransactionDescription.Debited,
            TransactionDescription.Credited,
            TransactionDescription.CreateAccount,
            TransactionDescription.Reverse,
            TransactionDescription.Close,
        ]}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Transaction', schema);
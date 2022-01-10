"use strict";

const { Wallet, WalletTransaction } = require('../models');
const { TransactionDescription } = require('../utils/constants');
const { saveData, getOneDoc, updateData } = require('../_helpers/dbQueryService');
const { roundUpToFixedPrecision } = require('../utils/common');
const mongoose = require("mongoose");

let services = {};
/**
 * @param body
 * @returns {Promise.<{status: number, body: *}>}
 */
services.createWallet = async function (body) {
    // Creating a new wallet
    let input = {
        user_name: body.name,
        amount: body.balance
    };

    let result = await saveData(Wallet, input, true);
    let output = {
        balance: result.amount,
        id: result._id,
        name: result.user_name,
        date: result.created_at

    }

    // Create a entry in transactions logs
    let transactionalLog = {
        wallet_id: result._id,
        balance_from: 0,
        balance_to: result.amount,
        amount: result.amount,
        transactionType: TransactionDescription.Account_Creation
    };

    let transactionResult = await saveData(WalletTransaction, transactionalLog, true)
    return {
        status: 200,
        body: output
    }
};

/**
 *
 * @param body
 * @returns {Promise.<*>}
 */
services.transact = async function (body) {

    // Fetching the wallet
    let walletDetails = await getOneDoc(Wallet, { _id: body.walletId }, { __v: 0 }, { lean: true }, true);
    if (walletDetails) {
        let options = {
            lean: true,
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };
        // Checking whether there is enough amount in wallet or not.
        if ((walletDetails.amount + body.amount) >= 0)  {
            // Update wallet with new amount
            let finalAmount = roundUpToFixedPrecision(walletDetails.amount + body.amount);
            let dataToUpdate = {
                $set: {
                    amount: finalAmount,
                    updated_at: Date.now()
                },
            };
            await updateData(Wallet, { _id: body.walletId }, dataToUpdate, options, true);

            // Create a entry in transactions logs
            let transactionalLog = {
                wallet_id: body.walletId,
                balance_from: walletDetails.amount,
                balance_to: finalAmount,
                amount: Math.abs(body.amount),
                transactionType: (body.amount > 0) ? TransactionDescription.Credited : TransactionDescription.Debited
            };

            let transactionResult = await saveData(WalletTransaction, transactionalLog, true);
            return {
                status: 200,
                body: body
            }

        }
        else {
            return {
                status: 404,
                body: "Insufficient funds"
            }
        }
    }

    return {
        status: 403,
        body: "Invalid Wallet id"
    }

};
/**
 *
 * @param body
 * @returns {Promise.<{status: number, body: *}>}
 */
services.fetchTransactions = async function (body) {
    // Aggregate query to fetch respective records
    let obj = {
        $and: [
            { wallet_id: { $eq: mongoose.Types.ObjectId(body.walletId) } },
        ],
    };
    let aggregate = [
        { $match: obj },
        {
            $project: {
                "_id" :1,
                "wallet_id" : 1,
                "balance_from" : 1,
                "balance_to" : 1,
                "amount" : 1,
                "transactionType" : 1,
                "created_at" : 1
            },
        },
        { $skip: body.skip },
        { $limit: body.limit },
        { $sort: { created_at: -1 } },
    ];


    let results = await WalletTransaction.aggregate(aggregate);

    return {
        status: 200,
        body: results
    }
};

/**
 *
 * @param body
 * @returns {Promise.<{status: number, body: *}>}
 */
services.walletDetails = async function (body) {
    // Fetching the wallet
    let walletDetails = await getOneDoc(Wallet, { _id: body.id }, { __v: 0 }, { lean: true }, true);

    return {
        status: 200,
        body: walletDetails
    }
};
module.exports = services;

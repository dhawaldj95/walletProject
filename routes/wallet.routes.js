`use strict`;

const Joi = require(`joi`);
Joi.objectId = require('joi-objectid')(Joi);

const { createWallet, transact, fetchTransactions, walletDetails } = require(`./../controllers/wallet.controllers`);
const { convertErrorIntoReadableForm } = require(`../utils/common`);

let Routes = [
    {
        method: `POST`,
        path: `/setup`,
        joiSchemaForSwagger: {
            body: {
                balance: Joi.string().required().description(`Username to login`),
                name: Joi.string().required()
            },
            description: `To create a new wallet`,
        },
        auth: false,
        failAction: convertErrorIntoReadableForm,
        handler: createWallet
    },
    {
        method: `POST`,
        path: `/transact/:walletId`,
        joiSchemaForSwagger: {
            params: {
                walletId: Joi.objectId().required().description(`Provide wallet Id`).label(`WalletID`)
            },
            body: {
                amount: Joi.number().required().description(`TransactionAmount`),
                description: Joi.string().required()
            },
            description: `To credit/debit amount in wallet`,
        },
        auth: false,
        failAction: convertErrorIntoReadableForm,
        handler: transact
    },
    {
        method: `GET`,
        path: `/transactions`,
        joiSchemaForSwagger: {
            query: {
                walletId: Joi.objectId().required().description(`Wallet ID`).label(`Wallet ID`),
                skip: Joi.number().optional().default(0).description(`Enter skip number`).label('Skip'),
                limit: Joi.number().optional().default(25).description(`Enter limit number`).label('Limit'),
            },
            description: `To get all the transaction details of a wallet`,

        },
        auth: true,
        failAction: convertErrorIntoReadableForm,
        handler: fetchTransactions
    },
    {
        method: `GET`,
        path: `/wallet`,
        joiSchemaForSwagger: {
            query: {
                id: Joi.objectId().required().description(`Wallet ID`).label(`Wallet ID`),
            },
            description: `To get current statistics of the wallet`,

        },
        auth: true,
        failAction: convertErrorIntoReadableForm,
        handler: walletDetails
    },

];

module.exports = Routes;

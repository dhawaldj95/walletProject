`use strict`;

const featureService = require('../services/wallet.services');

/**
 * Login API
 * @param body
 * @returns {Promise<{data, message, status}>}
 */
async function createWallet(body) {
    try {
        return await featureService.createWallet(body);
    } catch (error) {
        throw error;
    }
}

async function transact(body) {
    try {
        return await featureService.transact(body);
    } catch (error) {
        throw error;
    }
}

async function fetchTransactions(body) {
    try {
        return await featureService.fetchTransactions(body);
    } catch (error) {
        throw error;
    }
}

async function walletDetails(body) {
    try {
        return await featureService.walletDetails(body);
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createWallet,
    transact,
    fetchTransactions,
    walletDetails
};
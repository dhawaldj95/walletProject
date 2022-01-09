"use strict";

const { AppAccess } = require('../utils/constants')

const authenticator = async () => {

    return async (request, response, next) => {
        let token = (request.headers.authorization || '').split(" ");
        let path = request.originalUrl.split("/");
        try {
            return next();
        }
        catch (e) {
            return response.status(403).json({ "message": "Access Denied"});
        }
    };
}

module.exports = {
    authenticator
};

const Joi = require('joi');
const {ResponseStatusCode} = require('./constants');
const { authenticator } = require('../_helpers/authenticator');

let routeUtils = {};

/**function to create routes with validation in the express.**/
routeUtils.route = async (app, routes = []) => {
    routes.forEach(async route => {

        // /** set middleware array for each route **/
        let middlewares = [getValidatorMiddleware(route)];
        middlewares = await assignUserAuth(middlewares, route);

        /** Create api route **/
        app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route.handler, route.joiSchemaForSwagger));
    });

};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route
 */
let getValidatorMiddleware = route => {
    return (request, response, next) => {
        joiValidatorMethod(request, route).then((result) => {
            console.log("API triggered----", route.path)
            return next();
        }).catch((err) => {
            let error = (err);
            let responseObject = {status: 400, message: `${error.details.map(x => x.message).join(', ')}`};
            return response.status(responseObject.status).json(responseObject);
        });
    };
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} request
 * @param {*} route
 */
let joiValidatorMethod = async (request, route) => {
    console.log('request', request.body);
    let schema = {};
    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
        schema = Joi.object(route.joiSchemaForSwagger.params);
        let { error, value } = await schema.validate(request.params, options);
        if (error)
            throw error;
        else
            request.params = value;

    }
    if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
        schema = Joi.object(route.joiSchemaForSwagger.body);
        let { error, value } = await schema.validate(request.body, options);
        if (error) {
            console.log(error)
            throw error;
        } else {
            request.body = value;
        }
    }
    if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
        schema = Joi.object(route.joiSchemaForSwagger.query);
        let { error, value } = await schema.validate(request.query, options);
        if (error) {
            throw error;
        } else {
            request.query = value;
        }
    }
    if (route.joiSchemaForSwagger.headers && route.joiSchemaForSwagger.headers.authorization
        && Object.keys(route.joiSchemaForSwagger.headers).length) {
        schema = Joi.object(route.joiSchemaForSwagger.headers);
        let { error, value } = await schema.validate(request.headers, options);
        if (error) {
            console.log("Error----", error)
            throw error;
        } else {
            request.headers = value;
        }
    }
};

/**
 * Get route handler and handle the api response commonly
 * @param {*} handler
 * @param {*} JoiJSON
 */
let getHandlerMethod = (handler, JoiJSON) => {
    return async (request, response) => {
        if (((JoiJSON || {}).formData || {}).file) {
            try {
                let event = await selectFileEvent(((JoiJSON || {}).formData || {}).type);
                let result = await event(request, response);
                let responseData = {message: 'Success', status: ResponseStatusCode.Success, result};
                response.status(responseData.status || ResponseStatusCode.Success).json(responseData);
            } catch (exe) {
                response.status(exe.status).json(exe);
            }
        } else {
            let body = {
                ...(request.body || {}),
                ...(request.params || {}),
                ...(request.query || {}),
                user: ((request || {}).user || {}),
            };
            if(JoiJSON.responseObject) {
                body['response'] = response;
            }
            handler(body).then((result) => {
                if(!result) {
                    throw {status: ResponseStatusCode.BackgroundProcess, message: `BackgroundProcess`};
                }
                response.status(result.status).json(result);
            }).catch(async (err) => {
                console.log("-*************************", err);
                let code = (err || {}).code || 400;
                if ((!err.status && !err.code) && !err.status) {
                    err = {status: ResponseStatusCode.BadRequest, message: `Something went wrong`};
                    code = (err || {}).code || 400;
                }
                else if(code == 'UNKNOWN_CODE_PLEASE_REPORT'){
                    err = {status: ResponseStatusCode.BadRequest, message: `Something went wrong`};
                    code = 400;
                }
                err = await errorObj(err);

                /** Background process end code **/
                if(err.status === ResponseStatusCode.BackgroundProcess) return;
                response.status(err.status).json({...err, code});
            });
        }
    };
};

/**
 * Assign authentication function
 * @param {*} middlewares
 * @param {*} route
 * @returns {Promise<void>}
 */
const assignUserAuth = async (middlewares, route) => {
    if(route.auth) {
        middlewares.push(await authenticator());
    }
    return middlewares;
};

/**
 * Error message object
 * @param err
 * @returns {Promise<*>}
 */
const errorObj = async err => {
    let errMessage = (err || {}).message || (err || {}).errmsg || 'Something went wrong!';
    let statusCode = (err || {}).status || 0;
    err = {status: statusCode, message: errMessage};
    return err;
};

module.exports = routeUtils;

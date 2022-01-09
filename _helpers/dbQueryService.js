'use strict';
let dbQueries = {};

/**
 * Save data common function
 * @param model
 * @param dataToSave
 * @param willExecute
 * @returns {Promise<*>}
 */
dbQueries.saveData = async (model, dataToSave, willExecute) => {
    if(willExecute) {
        return await new model(dataToSave).save();
    }
    return null;
};

/**
 * Get data common function
 * @param model
 * @param criteria
 * @param projection
 * @param options
 * @param willExecute
 * @returns {Promise<*>}
 */
dbQueries.getOneDoc = async (model, criteria, projection, options, willExecute) => {
    if(willExecute) {
        return await model.findOne(criteria, projection, options);
    }
    return null;
};



/**
 * Get data common function
 * @param model
 * @param criteria
 * @param projection
 * @param options
 * @param willExecute
 * @returns {Promise<*>}
 */
dbQueries.getManyDoc = async (model, criteria, projection, options, willExecute) => {
    if(willExecute) {
        return await model.find(criteria, projection, options);
    }
    return null;
};

/**
 * Update data common function
 * @param model
 * @param criteria
 * @param dataToUpdate
 * @param options
 * @param willExecute
 * @returns {Promise<*>}
 */
dbQueries.updateData = async (model, criteria, dataToUpdate, options, willExecute) => {
    if(willExecute) {
        return await model.findOneAndUpdate(criteria, dataToUpdate, options);
    }
    return null;
};

/**
 * insert many
 * @param model
 * @param criteria
 * @param willExecute
 * @returns {Promise<void>}
 */
dbQueries.getCount = async (model, criteria, willExecute) => {
    if(willExecute) {
        return await model.count(criteria);
    }
    return null;
};

module.exports = dbQueries;

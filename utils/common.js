function roundUpToFixedPrecision(x) {
    return Number.parseFloat(x).toFixed(4);
}

/** Convert error to readable form **/
convertErrorIntoReadableForm = (error) => {
    let errorMessage = '';
    if (error.message.indexOf("[") > -1) {
        errorMessage = error.message.substr(error.message.indexOf("["));
    } else {
        errorMessage = error.message;
    }

    errorMessage = errorMessage.replace(/"/g, '');
    errorMessage = errorMessage.replace('[', '');
    errorMessage = errorMessage.replace(']', '');
    error.message = errorMessage;
    return error;
};

module.exports = {
    roundUpToFixedPrecision,
    convertErrorIntoReadableForm
}
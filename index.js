var util = require('util');


function defaultErrorHandler(err) {
    util.log(err);
}

function runChain(chain, index) {
    var chainIndex = index || 0,
        currentElem,
        currArgs = [],
        argIndex = 0;

    if (!chain || chain.length === 0) {
        return;
    }

    if (index >= chain.length) {
        return;
    }

    currentElem = chain[chainIndex];

    function checkErrorCallback(err) {

        var handler,
            msg;

        if (err) {
            // If error handler callback is provided, call it supplying 'err' object,
            // otherwise call the default handler
            handler = currentElem.errorHandler || exports.defaultErrorHandler;
            handler(err);
            return;
        }

        chainIndex += 1;
        runChain(chain, chainIndex);
    }

    // Add pre-defined arguments
    if (currentElem.args) {
        for (; argIndex < currentElem.args.length; argIndex++) {
            currArgs.push(currentElem.args[argIndex]);
        }
    }

    currArgs.push(checkErrorCallback);

    currentElem.target.apply(this, currArgs);
}


exports.runChain = runChain;
exports.defaultErrorHandler = defaultErrorHandler;

var util = require('util');


function defaultErrorHandler(err) {
    util.log(err);
}

function runChain(chain, index) {
    var chainIndex = index || 0,
        currRing,
        currArgs = [],
        argIndex = 0;

    if (!chain || chain.length === 0) {
        return;
    }

    if (index >= chain.length) {
        return;
    }

    currRing = chain[chainIndex];

    function checkErrorCallback(err) {

        var handler,
            msg;

        if (err) {
            // If error handler callback is provided, call it supplying 'err' object,
            // otherwise just output the errorMessage
            handler = currRing.errorHandler || exports.defaultErrorHandler;
            handler(err);
            return;
        }

        chainIndex += 1;
        runChain(chain, chainIndex);
    }

    if (currRing.args) {
        for (; argIndex < currRing.args.length; argIndex++) {
            currArgs.push(currRing.args[argIndex]);
        }
    }

    currArgs.push(checkErrorCallback);

    currRing.target.apply(this, currArgs);
}


exports.runChain = runChain;
exports.defaultErrorHandler = defaultErrorHandler;

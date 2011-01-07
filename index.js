var util = require('util');


function defaultErrorHandler(err) {
    util.log(err);
}

function runChain(chain, index) {
    var chainIndex = index || 0,
        currentElem,
        argIndex = 0,
        currentArgs = [];

    if (!chain || chain.length === 0) {
        return;
    }

    if (index >= chain.length) {
        return;
    }

    currentElem = chain[chainIndex];

    function checkErrorCallback(err) {

        var handler,
            msg,
            args,
            resultArgs,
            i = 0;

        if (err) {
            // If error handler callback is provided, call it supplying 'err' object,
            // otherwise call the default handler
            handler = currentElem.errorHandler || exports.defaultErrorHandler;
            handler(err);
            return;
        }

        chainIndex += 1;
        debugger;
        args = [chain, chainIndex];

        // If passResultToNextStep was specified, need to pass result of previous callback
        // to next function in chain, skipping the 'err' object
        if (currentElem.passResultToNextStep) {
            resultArgs = Array.prototype.splice.apply(arguments, [1, arguments.length-1]);
            for (; i < resultArgs.length; i++) {
                args.push(resultArgs[i]);
            }
        }

        runChain.apply(null, args);
    }

    if (arguments.length > 2) {
        // Looks like we were supplied agruments from previous call.
        // Let's take away 'chain' and 'chainIndex' arguments and pass it on further
        // down the call chain
        currentArgs = Array.prototype.splice.apply(arguments, [2, arguments.length-2]);
    } else {
        // No arguments from prevous call, just use pre-defined arguments, if any
        if (currentElem.args) {
            currentArgs = currentElem.args.slice();
        }
    }

    currentArgs.push(checkErrorCallback);
    currentElem.target.apply(this, currentArgs);
}


exports.runChain = runChain;
exports.defaultErrorHandler = defaultErrorHandler;

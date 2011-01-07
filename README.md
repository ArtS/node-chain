## Problem

As you probably have noticed during your node.js develeopment, it is really easy to get deep into callback mess.

Consider the following code:


    var fs = require('fs');

    fs.readFile('/etc/passwd',
        function(err, data) {
            if (err) {
                handleError(err);
                return;
            }

            fs.writeFile('myPwdCopy.txt',
                function(err) {
                    if (err) {
                        handleError(err);
                    }

                    fileCopiedCallback();
                }
            );
        }
    );

Here we just copied a file from one place to another, and yet we already have three levels of folding.


## Solution

Node-chain is perhaps a naive attempt to solve this problem.

Consider the solution:


    var fs = require('fs'),
        runChain = require('node-chain').runChain,
        chain = [

            // Step 1: call fs.readFile and pass the 'data' argument to
            // the next call in the chain
            {
                // Target function to call
                target: fs.readFile,

                // Arguments to pass to target function
                args: ['/etc/passwd'],

                // You can specify an error message using 'errorMessage'
                // or supply your own error handler using 'errorHandler'
                errorHandler: handleError,

                // Indication that we want all the arguments, suplied 
                // to the callback function to be passed to the next step
                passResultToNextStep: true
            },

            // Step 2: call fs.writeFile
            {
                target: fs.writeFile,
                errorMessage: 'Unable to write the file'
            }
        ];

    runChain(chain);

## Problem

As you probably have noticed during your node.js development, it is really easy to get deep into callback mess.
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

            // Step 1: call fs.readFile and pass the 'data' as argument
            {
                target: fs.readFile,
                args: ['/etc/passwd'],
                errorHandler: handleErrors,
                passResultToNextStep: true
            },

            // Step 2: call fs.writeFile
            {
                target: fs.writeFile,
                errorMessage: 'Unable to write the file'
            }
        ];

    runChain(chain);

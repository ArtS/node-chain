## Description

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

Node-chain is perhaps a naive attempt to solve this problem.

Consider the solution:


    var fs = require('fs'),
        runChain = require('node-chain').runChain,
        chain = [
            {
                target: fs.readFile,
                args: ['/etc/passwd'],
                errorHandler: handleError,
                passResultToNextStep: true
            },
            {
                target: fs.writeFile,
                errorMessage: 'Unable to write the file'
            }
        ];

    runChain(chain);

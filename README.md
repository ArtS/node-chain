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


This library is perhaps a naive attempt to solve the problem of callback chaining.

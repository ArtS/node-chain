## Description

This library is perhaps a naive attempt to solve the problem of callback chaining.
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
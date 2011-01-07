#!/usr/bin/env node

var c = require('./index'),
    chain,
    test_args,
    test_stack,
    test_error = '',
    ERROR_MESSAGE = 'error!!!';


function assertEquals(a, b) {
    if (a === b) {
        console.log('PASS');
    } else {
        console.log('FAIL');
    }
}


function assertArraysEqual(a, b) {
    var i = 0;

    if (a.length !== b.length) {
        console.log('FAIL');
        return;
    }

    for (; i < a.length; i++) {
        if (a[i] !== b[i]) {
            console.log('FAIL');
            return;
        }
    }

    console.log('PASS');
}

//
// 1. Chain with no elems
//

chain = [];
c.runChain(chain);

//
// 2. Test that all chained functions getting called in the proper order
//

test_args = [];
test_stack = [];

chain = [
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(1);
            callback(null);
        },
        args: [1, 2, 3]
    },
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(2);
            callback(null);
        },
        args: [4, 5, 6]
    }
];

c.runChain(chain);

assertArraysEqual(chain[0].args, test_args[0]);
assertArraysEqual(chain[1].args, test_args[1]);
assertArraysEqual(test_stack, [1, 2]);

//
// 3. Test that when error occurs, execution does not go further down the chain
//
test_args = [];
test_stack = [];

chain = [
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(1);
            callback(null);
        },
        args: [1, 2, 3]
    },
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(2);
            callback(ERROR_MESSAGE);
        },
        args: [4, 5, 6],
        errorHandler: function(err) {
            test_error = err;
        }
    },
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(3);
            callback(null);
        },
        args: [7, 8, 9]
    }
];

c.runChain(chain);

assertEquals(test_args.length, 2);
assertArraysEqual(chain[0].args, test_args[0]);
assertArraysEqual(chain[1].args, test_args[1]);
assertArraysEqual(test_stack, [1, 2]);
assertEquals(ERROR_MESSAGE, test_error);

//
// 4. Test that default error handler is called
//
test_args = [];
test_stack = [];
test_error = '';

c.defaultErrorHandler = function(err) {
    test_error = err;
}

chain = [
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(1);
            callback(null);
        },
        args: [1, 2, 3]
    },
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(2);
            callback(ERROR_MESSAGE);
        },
        args: [4, 5, 6]
    },
    {
        target: function(a, b, c, callback) {
            test_args.push([a, b, c]);
            test_stack.push(3);
            callback(null, a, b, c);
        },
        args: [7, 8, 9]
    }
];

c.runChain(chain);

assertEquals(test_args.length, 2);
assertArraysEqual(chain[0].args, test_args[0]);
assertArraysEqual(chain[1].args, test_args[1]);
assertArraysEqual(test_stack, [1, 2]);
assertEquals(ERROR_MESSAGE, test_error);


//
// 5. Test passing of callback results to the next function inthe chain
//
test_stack = [];
test_args = [];

chain = [
    {
        target: function(callback) {
            test_stack.push(1);
            callback(null, 1, 2, 3);
        },
        passResultToNextStep: true
    },
    {
        target: function(a, b, c) {
            test_stack.push(2);
            test_args.push([a, b, c]);
            //callback(null);
        }
    }
];

c.runChain(chain);

assertArraysEqual(test_stack, [1, 2]);
assertArraysEqual(test_args[0], [1, 2, 3]);

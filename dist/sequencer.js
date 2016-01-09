'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
function sequencer() {
  var pipeline = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var write = undefined;

  var results = [];

  results._last = function () {
    return results[results.length - 1];
  };

  return new _Promise(function (resolve, reject) {
    try {
      (function () {
        var cursor = 0;

        var run = function run() {
          try {
            if (pipeline[cursor]) {
              pipeline[cursor](write, results).then(function (result) {
                try {
                  cursor++;
                  results.push(result);
                  write = result;
                  run();
                } catch (error) {
                  reject(error);
                }
              })['catch'](reject);
            } else {
              resolve(results);
            }
          } catch (error) {
            reject(error);
          }
        };

        run();
      })();
    } catch (error) {
      reject(error);
    }
  });
}

sequencer.promisify = function (fn) {
  var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var that = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  return new _Promise(function (resolve, reject) {
    args.push(function (error) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (error) {
        reject(error);
      } else {
        resolve.apply(undefined, args);
      }
    });

    fn.apply(that, args);
  });
};

exports['default'] = sequencer;
module.exports = exports['default'];
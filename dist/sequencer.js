'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function sequencer() {
  for (var _len = arguments.length, pipeline = Array(_len), _key = 0; _key < _len; _key++) {
    pipeline[_key] = arguments[_key];
  }

  if (Array.isArray(pipeline[0])) {
    pipeline = pipeline[0];
  }

  var write = undefined;

  return new Promise(function (resolve, reject) {
    try {
      (function () {
        var cursor = 0;

        var run = function run() {
          try {
            if (pipeline[cursor]) {
              pipeline[cursor](write).then(function (result) {
                try {
                  cursor++;
                  write = result;
                  run();
                } catch (error) {
                  reject(error);
                }
              })['catch'](reject);
            } else {
              resolve(write);
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

  return new Promise(function (resolve, reject) {
    args.push(function (error) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
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
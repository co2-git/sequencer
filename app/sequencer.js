'use strict';

function sequencer (...pipeline) {

  if ( Array.isArray(pipeline[0]) ) {
    pipeline = pipeline[0];
  }

  let write;

  return new Promise((resolve, reject) => {
    try {
      let cursor = 0;

      let run = () => {
        try {
          if ( pipeline[cursor] ) {
            pipeline[cursor](write)
              .then(result => {
                try {
                  cursor ++;
                  write = result;
                  run();
                }
                catch ( error ) {
                  reject(error);
                }
              })
              .catch(reject);
          }
          else {
            resolve(write);
          }
        }
        catch ( error ) {
          reject(error);
        }
      };

      run();
    }
    catch ( error ) {
      reject(error);
    }
  });
}

sequencer.promisify = function (fn, args = [], that = null) {
  return new Promise((resolve, reject) => {
    args.push((error, ...args) => {
      if ( error ) {
        reject(error);
      }
      else {
        resolve(...args);
      }
    });

    fn.apply(that, args);
  });
}

export default sequencer;

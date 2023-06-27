const MAX_RETRY = 10;

export default () => {
  let counter = 0;
  return new Promise((resolve, reject) => {
    // Retry until the injected extensions loaded or reach timeout.
    const interval = setInterval(() => {
      if (window.injectedWeb3) {
        clearInterval(interval);
        if (window.injectedWeb3['polkadot-js']) {
          resolve(window.injectedWeb3['polkadot-js']);
        } else {
          reject(new Error('Unsupported extension.'));
        }
      }

      counter += 1;
      if (counter === MAX_RETRY) {
        clearInterval(interval);
        reject(new Error('Timeout.'));
      }
    }, 500);
  });
};

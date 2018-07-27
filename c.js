function sleep (ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function c () {
  console.log('c.js is imported');
  await sleep(4000);
  console.log('c.js running done');
  return {filename: 'c.js'};
}

module.exports = c;
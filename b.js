function sleep (ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function b () {
  console.log('b.js is imported');
  await sleep(3000);
  console.log('b.js running done');
  return {filename: 'b.js'};
}

module.exports = b;
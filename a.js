function sleep (ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function a () {
  console.log('a.js is imported');
  await sleep(2000);
  console.log('a.js running done');
  return {filename: 'a.js'};
}

module.exports = a;
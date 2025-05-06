const fs = require('node:fs/promises');

fs.appendFile('append.txt', 'I like Node.js very much\n')
  .then(() => console.log('Done'))
  .catch((err) => console.log(err));

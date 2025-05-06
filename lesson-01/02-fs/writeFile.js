const fs = require('node:fs/promises');

fs.writeFile('write.txt', 'Node.js is awesome platform')
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

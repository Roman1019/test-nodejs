// const fs = require('node:fs');
// console.log('Before');

// fs.readFile('read.txt', { encoding: 'utf-8' }, (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log(data);
// });
// console.log('After');

const fs = require('node:fs/promises');
console.log('Before');
fs.readFile('read.txt', { encoding: 'utf-8' })
  .then((data) => console.log(data))
  .catch((data) => console.log(data));
console.log('After');

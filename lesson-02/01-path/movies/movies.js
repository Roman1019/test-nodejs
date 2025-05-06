// const fs = require('node:fs/promises');
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function readMovies() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const filePath = path.join(dirname, 'movies.txt');
  console.log(filename);
  console.log(dirname);
  console.log(filePath);
  return fs.readFile(filePath, {
    encoding: 'utf-8',
  });
}

// module.exports = {
//   readMovies,
// };

import mongoose from 'mongoose';
import { getEnvVar } from './utils/getEnvVar.js';

function initDataBaseConnection() {
  return mongoose.connect(getEnvVar('MONGODB_URL'));
}
export { initDataBaseConnection };

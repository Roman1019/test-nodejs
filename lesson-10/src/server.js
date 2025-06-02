import 'dotenv/config';
import app from './app.js';

import { initDataBaseConnection } from './db.js';

async function bootstrap() {
  try {
    const PORT = 8090;
    await initDataBaseConnection();
    app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }
      console.log(`Serve ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();

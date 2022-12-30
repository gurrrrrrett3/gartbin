import { Options } from '@mikro-orm/core';
import { Paste } from './entities/paste.entity';

const config: Options = {
    entities: [
        Paste
    ],
    dbName: 'gartpaste',
    type: 'postgresql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    debug: true
  };

export default config;
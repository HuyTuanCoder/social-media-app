import dotenv from 'dotenv';

dotenv.config()

const port = process.env.PORT!;
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DB_NAME;

const config = {
  PORT: port,
  HOST: host,
  USER: user,
  PASSWORD: password,
  DATABASE: database,
}

export default config;

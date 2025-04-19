import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import config from '../utils/config';

const applyStoredProcedures = async (filePath: string) => {
  const connection = await mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
  });

  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    await connection.query(sql);
    console.log(`Successfully executed SQL file: ${filePath}`);
  } catch (error) {
    console.error(`Error executing SQL file: ${filePath}`, error);
  } finally {
    await connection.end();
  }
};

const filePath = path.join(__dirname, '../procedures/getTotalUsers.sql');
applyStoredProcedures(filePath);
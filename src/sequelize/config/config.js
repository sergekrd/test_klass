const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "host": process.env.POSTGRES_HOST,
    "port": Number(process.env.POSTGRES_PORT),
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "dialect": "postgres"
  },
  "test": {
    "host": process.env.POSTGRES_HOST,
    "port": Number(process.env.POSTGRES_PORT),
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "dialect": "postgres"
  },
  "production": {
    "host": process.env.POSTGRES_HOST,
    "port": Number(process.env.POSTGRES_PORT),
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "dialect": "postgres"
  }
};

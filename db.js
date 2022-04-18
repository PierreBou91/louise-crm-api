const Pool = require("pg").Pool;
require("dotenv").config();

// const pool = new Pool({
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   user: process.env.DB_USER,
//   port: process.env.DB_PORT,
//   password: process.env.PASSWORD,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

require('dotenv').config()

module.exports = {
    // mysql: {
    //   host: process.env.HOST,
    //   user: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE
    // },
    mysql: {
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME
    },
    secret: process.env.MY_SECRET
}
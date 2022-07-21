const Sequelize = require("sequelize");

//初始化MYSQL
const sequelize = new Sequelize({
  database: "charging_test",
  username: "admin",
  password: "$kyRaker803",
  dialect: "mysql",
  host: "mimicat-db.c4krmcy0gu08.ap-northeast-1.rds.amazonaws.com",
  port: 3306,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  //logging: console.log,
  // ssl: true,
  // dialectOptions: {
  //     ssl: {
  //         require: true,
  //     }
  // },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (e) {
    console.log("Unable to connect to the database:", e);
  }
})();

module.exports = sequelize;

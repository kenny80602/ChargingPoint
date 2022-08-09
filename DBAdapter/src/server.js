const express = require("express");
const indexRouter = require("./routers/api.js");
// const { User } = require('./mysql/model/user.js)'
const  Transaction  = require("./mysql/model/transaction.js");
const  Pole  = require("./mysql/model/pole.js");
const  Site  = require("./mysql/model/site.js");
const errorHandle = require("./middleware/errorHandler.js");

// //有個error的table須新增，處理近期異常事件和歷史異常紀錄，未處理關聯。
// await User.sync({ force: false }).then(() => console.log("user table created"));
(async() => {
  await Site.sync({ force: false }).then(() => console.log("site table created"));
  await Pole.sync({ force: false }).then(() => console.log("Pole table created"));
  await Transaction.sync({ force: false }).then(() =>
    console.log("Transaction table created")
  )})()


const app = express();
app.use(express.json());

app.use("/api/v1/", indexRouter);

app.use(errorHandle);
app.listen(4499, () => {
  console.log(`http://localhost:4499`);
});

module.exports = app
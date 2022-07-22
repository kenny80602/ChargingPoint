import express from "express";
import indexRouter from "./routers/api.js";
// import { User } from './mysql/model/user.js'
import { Transaction } from "./mysql/model/Transaction.js";
import { Pole } from "./mysql/model/pole.js";
import { Site } from "./mysql/model/site.js";
import errorHandle from "./middleware/errorHandler.js";

    


// //有個error的table須新增，處理近期異常事件和歷史異常紀錄，未處理關聯。
// await User.sync({ force: false }).then(() => console.log("user table created"));
await Site.sync({ force: false }).then(() => console.log("site table created"));
await Pole.sync({ force: false }).then(() => console.log("Pole table created"));
await Transaction.sync({ force: false }).then(() =>
  console.log("Transaction table created")
);


const app = express();
app.use(express.json());

app.use("/api/v1/", indexRouter);

app.use(errorHandle);
app.listen(4499, () => {
  console.log(`http://localhost:4499`);
});

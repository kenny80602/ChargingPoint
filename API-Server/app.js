import express from "express";
import cors from "cors";
import indexRouter from "./routes/chargingAPP.js";
import errorHandler from "./middleware/errorHandler.js";
import path, { dirname } from 'path';//https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 4999;

//跨來源資源共用（CORS）
app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use("/api/v2/", indexRouter);



app.get("/web", (req, res, next) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get("/web/poleState", (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/ConnectorStatus.html'));
});

app.get("/web/reservation", (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/reservation.html'));
});

app.get("/web/meterValue", (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/meterValue.html'));
});

app.get("/web/finishCharging", (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/finishCharging.html'));
});


app.use(errorHandler);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

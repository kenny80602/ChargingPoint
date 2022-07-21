import express from 'express'
import * as Controller from "../controllers/index.js";
import * as Services from "../services/index.js"

const router = express.Router();

router.get("/healthz", Controller.Healthz);

router.post('/reserveCharger/:siteId/:poleId/:connectorId',Services.reserveCharger)
router.post('/remoteStartTransaction/:poleId/:connectorId',Services.RemoteStartTransaction)
router.post('/remoteStopTransaction/:poleId/:connectorId',Services.RemoteStopTransaction)
export default router;

import  express  from "express";
import  * as chargingAppController from '../controllers/chargingAPP.controller.js'

const router = express.Router();



//site
router.get('/chargingApp/nearStation',chargingAppController.sitesLocationInfo);
router.get('/chargingApp/site/:siteId/poleStatusStatistics',chargingAppController.getConnectorStatus);
router.post('/site/remoteStartTransaction',chargingAppController.remoteStartTransaction)
router.post('/site/remoteStopTransaction', chargingAppController.remoteStopTransaction);


//transaction
router.get('/chargingApp/reserveCharger/transaction/:id/user',chargingAppController.getReservation);
router.get('/transactionInfo/transaction/:id',chargingAppController.transactionInfo);
router.post('/reservation', chargingAppController.addReservation)

//MeterValues
router.get('/meterValues/:transactionId', chargingAppController.meterValues);


//pole 
router.get('/chargingApp/siteId/:siteId/pole/:poleId/connector/:connectorId',chargingAppController.getPoleConnectorStatus);
// router.post('/api/v2/siteManagement/CharingStastics/siteId/:site/pole/:poleId/user',getChargeInfo);
// router.post('/api/v2/siteManagement/FinishStastics/siteId/:site/pole/:poleId/user',getFinishChargeInfo);
// router.post('/api/v2/siteManagement/unplugged/siteId/:site/pole/:poleId/user',unpluggedPoleStatus);

//connector
router.get('/chargingApp/siteId/:siteId/selectorConnector',chargingAppController.getSelectConnector)



export default router;




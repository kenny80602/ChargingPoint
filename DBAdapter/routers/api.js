const express = require('express')
const  apiController = require('../controllers/api.controller.js')

const router = express.Router()

// router.get('/user/:userId',apiController.getUserInfo);
router.get('/site/:siteId',apiController.siteInfo);
router.get('/site/:siteId/pole/:poleId',apiController.poleInfo);
router.get('/transaction/:transactionId',apiController.transactionInfo);





module.exports = router;
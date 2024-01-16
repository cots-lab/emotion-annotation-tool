const bodyParser = require("body-parser");
const express = require("express");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getMain);
router.post("/", mainController.postMain);

router.get("/help", mainController.getHelp);
router.get("/annotation", mainController.getAnnotation);
router.get("/arousal-annotation", mainController.getArousalAnnotation);
router.get("/valence-annotation", mainController.getValenceAnnotation);
router.get("/additional-annotation", mainController.getAdditionalAnnotations);
router.get("/form-end", mainController.getFromEnd);
router.get("/doserial", mainController.doSerial);
module.exports = router;

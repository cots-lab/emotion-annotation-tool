const bodyParser = require("body-parser");
const express = require("express");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getMain);

//COTS Tool
router.get("/cots-instruction", mainController.postMain);
router.get("/help", mainController.getHelp);
router.get("/annotation", mainController.getAnnotation);
router.get("/arousal-annotation", mainController.getArousalAnnotation);
router.get("/valence-annotation", mainController.getValenceAnnotation);
router.get("/additional-annotation", mainController.getAdditionalAnnotations);
router.get("/form-end", mainController.getFromEnd);
router.get("/doserial", mainController.doSerial);

//SAM Tool
router.post("/", mainController.samPostMain);
router.get("/sam-help", mainController.samGetHelp);
router.get("/sam-annotation", mainController.samGetAnnotation);
router.get("/sam-arousal-annotation", mainController.samGetArousalAnnotation);
router.get("/sam-valence-annotation", mainController.samGetValenceAnnotation);
router.get("/sam-additional-annotation", mainController.samGetAdditionalAnnotations);
router.get("/sam-form-end", mainController.samGetFromEnd);

module.exports = router;

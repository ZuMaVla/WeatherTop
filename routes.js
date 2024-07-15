import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { mainController } from "./controllers/main-controller.js";
import { stationController } from "./controllers/station-controller.js";

export const router = express.Router();

router.get("/", mainController.index);
router.get("/dashboard", dashboardController.index);
router.get("/about", aboutController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/station/:stationId", stationController.index);
router.post("/station/:stationId/addreport", stationController.addReport);
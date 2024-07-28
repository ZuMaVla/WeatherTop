import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { mainController } from "./controllers/main-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { accountsController } from './controllers/accounts-controller.js';

export const router = express.Router();

router.get("/", accountsController.index);
router.get("/", mainController.index);
router.get("/dashboard", dashboardController.index);
router.get("/about", aboutController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/station/:stationId", stationController.index);
router.post("/station/:stationId/addreport", stationController.addReport);
router.get("/station/:stationId/deletereport/:reportId", stationController.deleteReport);
router.get("/station/:stationId", stationController.index);
router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);
router.get("/userprofile/:userId", accountsController.profile);
router.post("/update/:userId", accountsController.updateProfile);
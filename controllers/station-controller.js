import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

export const stationController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stationToView = await stationStore.getStationById(request.params.stationId);
    const stationReports = await reportStore.getReportsByStationId(request.params.stationId);
    const currentWeatherCode = await WCCs.getWeatherByCode(stationReports[stationReports.length - 1].code);
    stationToView.reports = stationReports;
    const minT = stationStore.getParam(stationToView, "temperature", "min");
    const maxT = stationStore.getParam(stationToView, "temperature", "max");
    const minW = stationStore.getParam(stationToView, "windSpeed", "min");
    const maxW = stationStore.getParam(stationToView, "windSpeed", "max");
    const minP = stationStore.getParam(stationToView, "pressure", "min");
    const maxP = stationStore.getParam(stationToView, "pressure", "max");
    console.log(minT);
    const viewData = {
      userName: loggedInUser.firstName,
      station: stationToView,
      title: "Station View: " + stationToView.name,
      minTemp: minT,
      maxTemp: maxT,
      minWind: minW,
      maxWind: maxW,
      minPress: minP,
      maxPress: maxP,
      weatherCode: currentWeatherCode,
    };
    console.log("station-view rendering: " + stationToView.name + currentWeatherCode.description);
    response.render("station-view", viewData);
  },
  
  async addReport(request, response) {
    const stationToAddReportTo = await stationStore.getStationById(request.params.stationId);
    const newReport = {
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding report ${newReport}`);
    await reportStore.addReport(stationToAddReportTo._id, newReport);
    response.redirect("/station/" + stationToAddReportTo._id);
  },
  
  async deleteReport(request, response) {
    const stationToDeleteId = request.params.stationId;
    const reportToDeleteId = request.params.reportId;
    console.log(`Deleting Track ${reportToDeleteId} from Playlist ${stationToDeleteId}`);
    await reportStore.deleteReport(request.params.reportId);
    response.redirect("/station/" + stationToDeleteId);
  },
  
};
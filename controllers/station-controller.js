//import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { prepareSummary } from "../utils/implementation.js";

export const stationController = {
    
  async index(request, response) {
    const currentStation = await prepareSummary(request.params.stationId); 
    console.log('Current Station:', JSON.stringify(currentStation, null, 2));
    const loggedInUser = await accountsController.getLoggedInUser(request);
    
    const stationsToView = [currentStation];
    
    const viewData = {
      stations: stationsToView,
      userName: loggedInUser.firstName,
      title: currentStation.name, 
    };
    
//    console.log(`station-view rendering: ${currentStation.name}, ${currentStation.attributes.weatherCode.description}`);
    
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
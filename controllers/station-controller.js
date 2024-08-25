//import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { prepareSummary } from "../utils/implementation.js";
import dayjs from 'dayjs';

export const stationController = {
    
  async index(request, response) {
    const currentStation = await prepareSummary(request.params.stationId); 
    const loggedInUser = await accountsController.getLoggedInUser(request);
    
    const stationsToView = [currentStation];
    const lat = currentStation.latitude;
    const lon = currentStation.longitude;

    const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0aa8a56676edc13091118eace86a7726`
    console.log(weatherRequestUrl);
    
    const viewData = {
      stations: stationsToView,
      url: weatherRequestUrl,
      user: loggedInUser,
      title: currentStation.name, 
    };
    
    
    response.render("station-view", viewData);
  },
  
  async addReport(request, response) {
    const stationToAddReportTo = await stationStore.getStationById(request.params.stationId);
    const now = dayjs();

    const newReport = {
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: request.body.windDirection,
      pressure: Number(request.body.pressure),
      reportDate: now.format("YYYY/MM/DD HH:mm"),
    };
    console.log(`adding report ${newReport} at ${now.format('HH:mm:ss')} on ${now.format('DD/MM/YYYY')}.`);
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
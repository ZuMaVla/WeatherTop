import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { prepareSummary } from "../utils/implementation.js";
import dayjs from 'dayjs';
import axios from "axios";

export const stationController = {
    
  async index(request, response) {
    const currentStation = await prepareSummary(request.params.stationId); 
    const loggedInUser = await accountsController.getLoggedInUser(request);
    
    const stationsToView = [currentStation];
    const lat = currentStation.latitude;
    const lon = currentStation.longitude;
    const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0aa8a56676edc13091118eace86a7726`
    let report = {};
    
    if (request.query.dataRetrieved) {
      console.log("rendering new report");
       const result = await axios.get(weatherRequestUrl);
      if (result.status == 200) {
        const currentWeather = result.data;
        report.code = currentWeather.weather[0].id;
        report.temperature = currentWeather.main.temp;
        report.windSpeed = currentWeather.wind.speed;
        report.pressure = currentWeather.main.pressure;
        report.windDirection = currentWeather.wind.deg;
      }
      else {
        report.code = 100;
        report.temperature = 0;
        report.windSpeed = 0;
        report.pressure = 0;
        report.windDirection = 360;
      }
      console.log(report);
      
    }
    else {
      report.code = 100;
      report.temperature = 0;
      report.windSpeed = 0;
      report.pressure = 0;
      report.windDirection = 360;
    }
          
    const viewData = {
      stations: stationsToView,
      retrievedData: report,
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
    console.log(`Deleting report ${reportToDeleteId} from Station ${stationToDeleteId}`);
    await reportStore.deleteReport(request.params.reportId);
    response.redirect("/station/" + stationToDeleteId);
  },
  
};
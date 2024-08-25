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
    
    const lat = currentStation.latitude;
    const lon = currentStation.longitude;
    const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0aa8a56676edc13091118eace86a7726`
    let report = {};
    let wDir = 360;
    
    if (request.query.dataRetrieved) {
      console.log("rendering new report");
      const result = await axios.get(weatherRequestUrl);
      if (result.status == 200) {
        const currentWeather = result.data;
        report.code = currentWeather.weather[0].id;
        report.temperature = currentWeather.main.temp;
        report.windSpeed = currentWeather.wind.speed;
        report.pressure = currentWeather.main.pressure;
        wDir = currentWeather.wind.deg;
      }
      else {
        report.code = "100";
        report.temperature = 0;
        report.windSpeed = 0;
        report.pressure = 0;
        wDir = 360;
      }
      console.log(report);
      
    }
    else {
      console.log("Manual entering data...");
      report.code = "100";
      report.temperature = 0.0;
      report.windSpeed = 0.0;
      report.pressure = 0.0;
      wDir = 360;
    }

  let win;

  switch (true) {
    case (wDir >= 348.76 || wDir < 11.25):
      win = "N";
      break;
    case (wDir >= 11.26 && wDir < 33.75):
      win = "N/NE";
      break;
    case (wDir >= 33.76 && wDir < 56.25):
      win = "NE";
      break;
    case (wDir >= 56.26 && wDir < 78.75):
      win = "E/NE";
      break;
    case (wDir >= 78.76 && wDir < 101.25):
      win = "E";
      break;
    case (wDir >= 101.26 && wDir < 123.75):
      win = "E/SE";
      break;
    case (wDir >= 123.76 && wDir < 146.25):
      win = "SE";
      break;
    case (wDir >= 146.26 && wDir < 168.75):
      win = "S/SE";
      break;
    case (wDir >= 168.76 && wDir < 191.25):
      win = "S";
      break;
    case (wDir >= 191.26 && wDir < 213.75):
      win = "S/SW";
      break;
    case (wDir >= 213.76 && wDir < 236.25):
      win = "SW";
      break;
    case (wDir >= 236.26 && wDir < 258.75):
      win = "W/SW";
      break;
    case (wDir >= 258.76 && wDir < 281.25):
      win = "W";
      break;
    case (wDir >= 281.26 && wDir < 303.75):
      win = "W/NW";
      break;
    case (wDir >= 303.76 && wDir < 326.25):
      win = "NW";
      break;
    case (wDir >= 326.26 && wDir < 348.75):
      win = "N/NW";
      break;
    default:
      win = "Unknown";
  }
    
    currentStation.retrievedData = report;
    
    const stationsToView = [currentStation];

    const viewData = {
      stations: stationsToView,
      user: loggedInUser,
      title: currentStation.name, 
    };
    
    console.log(viewData.retrievedData);
    
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
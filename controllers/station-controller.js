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
    const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=0aa8a56676edc13091118eace86a7726`
    let report = {};
    let wDir = 360;
    
    if (request.query.dataRetrieved) {
      console.log("rendering new report using", weatherRequestUrl);
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
        report.code="";
        report.temperature;
        report.windSpeed;
        report.pressure;
        wDir = 360;
      }
      console.log(report);
      
    }
    else {
      console.log("Manual entering data...");
      report.code="";
      report.temperature;
      report.windSpeed;
      report.pressure;
      wDir = 360;
    }

  let winDirLabel = "N";

  switch (true) {
    case (wDir > 11.25 && wDir <= 33.75):
      winDirLabel = "N/NE";
      break;
    case (wDir > 33.75 && wDir <= 56.25):
      winDirLabel = "NE";
      break;
    case (wDir > 56.25 && wDir <= 78.75):
      winDirLabel = "E/NE";
      break;
    case (wDir > 78.75 && wDir <= 101.25):
      winDirLabel = "E";
      break;
    case (wDir > 101.25 && wDir <= 123.75):
      winDirLabel = "E/SE";
      break;
    case (wDir > 123.75 && wDir <= 146.25):
      winDirLabel = "SE";
      break;
    case (wDir > 146.25 && wDir <= 168.75):
      winDirLabel = "S/SE";
      break;
    case (wDir > 168.75 && wDir <= 191.25):
      winDirLabel = "S";
      break;
    case (wDir > 191.25 && wDir <= 213.75):
      winDirLabel = "S/SW";
      break;
    case (wDir > 213.75 && wDir <= 236.25):
      winDirLabel = "SW";
      break;
    case (wDir > 236.25 && wDir <= 258.75):
      winDirLabel = "W/SW";
      break;
    case (wDir > 258.75 && wDir <= 281.25):
      winDirLabel = "W";
      break;
    case (wDir > 281.25 && wDir <= 303.75):
      winDirLabel = "W/NW";
      break;
    case (wDir > 303.75 && wDir <= 326.25):
      winDirLabel = "NW";
      break;
    case (wDir > 326.25 && wDir <= 348.75):
      winDirLabel = "N/NW";
      break;
    default:
      winDirLabel = "N";
      break;  
  };
    
    currentStation.retrievedData = report;
    
    const stationsToView = [currentStation];

    const viewData = {
      windDirection: winDirLabel,
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
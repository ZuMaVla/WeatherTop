import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { prepareSummary } from "../utils/implementation.js";
import { prepareChartData } from "../utils/implementation.js";
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);                                        // plugins for dayjs to take into account handling daylight saving time (i.e. summer time)
const tz = "Europe/Dublin";                                

export const stationController = {
    
  async index(request, response) {
    const currentStation = await prepareSummary(request.params.stationId);         // preparing summary data for the current station
    const loggedInUser = await accountsController.getLoggedInUser(request);
    
    const lat = currentStation.latitude;
    const lon = currentStation.longitude;
    
    // composing url for weather request to https://openweathermap.org/
    const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=0aa8a56676edc13091118eace86a7726`
    
    
    let report = {};
    let wDir;                                                                      // declare wind direction variable
    

//************************************************ Functionality related to data retrieval from OpenWeather *******************************************    
    
    if (request.query.dataRetrieved && request.query.dataRetrieved === 'true') {   // checking if user requested a data retrieval from https://openweathermap.org/
      console.log("rendering new report using", weatherRequestUrl);
      const result = await axios.get(weatherRequestUrl);                           // attempt to retrieve weather data from https://openweathermap.org/ 
      if (result.status == 200) {                                                  // if OK interpret and read required data
        const currentWeather = result.data;
        report.code = currentWeather.weather[0].id;
        report.temperature = currentWeather.main.temp;
        report.windSpeed = currentWeather.wind.speed;
        report.pressure = currentWeather.main.pressure;
        wDir = currentWeather.wind.deg;
      }
      else {                                                                       // if not OK use no data 
        report.code="";
        report.temperature;
        report.windSpeed;
        report.pressure;
        wDir = 360;
      }
      console.log(report);
      
    }
    else {                                                                         // if data retrieved is not requested, also use no data
      console.log("Manual entering data...");
      report.code="";
      report.temperature;
      report.windSpeed;
      report.pressure;
      wDir = 360;
    }

    let winDirLabel;

    switch (true) {                                                                // Convertion of wind direction in degrees 
      case (wDir > 11.25 && wDir <= 33.75):                                        // to corresponding compass direction (e.g., N, NE, E)
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

    
//*************************************************** Functionality related to data plotting **************************************************
    
    let isChart = 'display: none;';                                        // to enable functionality of "Hide Chart" button
    let chartData = {                                                      // empty data for chart by default  
      xValues: [], 
      yValues: []
    };
    let xValues = chartData.xValues;
    let yValues = chartData.yValues;
    let dataLegend = '';
    let dataUnits = '';
    let rgb = '255, 255, 255';
    
    if (!request.query.chart || request.query.chart === 'none') {          // Nothing to do if chart is not requested  
      console.log("No chart requested");
    }
    else if (request.query.chart === 'temperature') {                      // Handling case when temperature chart is requested    
      console.log("Temperature chart requested");
      isChart = '';
      chartData = await prepareChartData(request.params.stationId);
      xValues = chartData.xValues;
      yValues = chartData.temperatureValues;
      dataLegend = 'Temperature';
      dataUnits = '°C';
      rgb = '180, 60, 84';                                                 // rgb scheme to match temperature pictogram in the station summary 
    }
    else if (request.query.chart === 'wind') {                             // Handling case when wind chart is requested 
      console.log("Wind speed chart requested");
      isChart = '';
      chartData = await prepareChartData(request.params.stationId);
      xValues = chartData.xValues;
      yValues = chartData.windValues;
      dataLegend = 'Wind speed';
      dataUnits = 'm/s';
      rgb = '7, 101, 255';                                                 // rgb scheme to match wind pictogram in the station summary
    }
    else if (request.query.chart === 'pressure') {                         // Handling case when pressure chart is requested
      console.log("Pressure chart requested");
      isChart = '';
      chartData = await prepareChartData(request.params.stationId);
      xValues = chartData.xValues;
      yValues = chartData.pressureValues;
      dataLegend = 'Pressure';
      dataUnits = 'hPa';
      rgb = '209, 227, 56';                                                // rgb scheme to match pressure pictogram in the station summary
    }
    else {
      console.log("Other chart requested");                                // Nothing to do if any other chart is requested 
    }
    
//*************************************************** Composing data for page rendering *******************************************************    
    
    const viewData = {
      windDirection: winDirLabel,
      stations: stationsToView,
      visibility: isChart,
      time: xValues,
      data: yValues,
      toDisplayData: dataLegend,
      toDisplayUnits: dataUnits,
      rgb: rgb,
      user: loggedInUser,
      title: currentStation.name
    };
    
    console.log(viewData.time, viewData.data);
    
    response.render("station-view", viewData);
    
  },
  
  
  async addReport(request, response) {
    const stationToAddReportTo = await stationStore.getStationById(request.params.stationId);
    const now = dayjs().tz(tz);                                            // modified use of dayjs to take into account time zone and daylught saving

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
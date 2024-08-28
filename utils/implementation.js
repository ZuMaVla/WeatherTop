import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);


export async function prepareSummary(stationId) {
  const stationToView = await stationStore.getStationById(stationId);
  const stationReports = await reportStore.getReportsByStationId(stationId);
  let currentWeatherCode = 0;
  if (stationReports.length > 0) {
    let temp = stationReports[stationReports.length - 1];
    currentWeatherCode = temp.code;
    if (stationReports.length > 1) {
      for (let i = stationReports.length - 2; i >= 0; i--) {
        if (dayjs(stationReports[i].reportDate).isAfter(dayjs(temp.reportDate))) {
          temp = stationReports[i];
          currentWeatherCode = temp.code;
        }
      }
    }
    console.log(currentWeatherCode);
  };
     
  stationToView.reports = stationReports;
  const minT = stationStore.getParam(stationToView, "temperature", "min");
  const maxT = stationStore.getParam(stationToView, "temperature", "max");
  const minW = stationStore.getParam(stationToView, "windSpeed", "min");
  const maxW = stationStore.getParam(stationToView, "windSpeed", "max");
  const minP = stationStore.getParam(stationToView, "pressure", "min");
  const maxP = stationStore.getParam(stationToView, "pressure", "max");
  currentWeatherCode = await WCCs.getWeatherByCode(currentWeatherCode);
  stationToView.attributes = {
    minTemp: minT,
    maxTemp: maxT,
    minWind: minW,
    maxWind: maxW,
    minPress: minP,
    maxPress: maxP,
    weatherCode: currentWeatherCode,
  };

  return stationToView;
};

export async function prepareChartData(stationId) {
  const stationToView = await stationStore.getStationById(stationId);
  const stationReports = await reportStore.getReportsByStationId(stationId);
  const now = dayjs();
  let time = [];
  let temperature = [];
  let wind = [];
  let pressure = [];
  let tmp;
  
  for (let i = 0; i < stationReports.length; i++) {
    tmp = dayjs(stationReports[i].reportDate)
    time.push(-dayjs.duration(now.diff(tmp)).asHours());    // negative values correspond to the past
    temperature.push(stationReports[i].temperature);
    wind.push(stationReports[i].windSpeed);
    pressure.push(stationReports[i].pressure);
  }
  const output = {
    xValues: time, 
    temperatureValues: temperature,
    windValues: wind,
    pressureValues: pressure,
  };
  console.log("Chart data prepared:", output);
  
  return output;
};



 
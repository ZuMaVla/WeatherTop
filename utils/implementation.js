import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";


export async function prepareSummary(stationId) {
  const stationToView = await stationStore.getStationById(stationId);
  const stationReports = await reportStore.getReportsByStationId(stationId);
  let currentWeatherCode = await WCCs.getWeatherByCode(100);
  if (stationReports.length > 0) {
    let temp = await WCCs.getWeatherByCode(stationReports[stationReports.length - 1]);
    currentWeatherCode = temp.code;
    if (stationReports.length > 1) {
      for (let i = stationReports.length - 2; i >= 0; i--) {
        if (stationReports[i].reportDate.isAfter(temp.reportDate)) {
          temp = stationReports[i];
          currentWeatherCode = temp.code;
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
 
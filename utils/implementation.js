import { WCCs } from "../models/WCC-db.js";
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";


export async function prepareSummary(stationId) {
    const stationToView = await stationStore.getStationById(stationId);
    const stationReports = await reportStore.getReportsByStationId(stationId);
    const currentWeatherCode = await WCCs.getWeatherByCode(stationReports[stationReports.length - 1].code);
    stationToView.reports = stationReports;
    const minT = stationStore.getParam(stationToView, "temperature", "min");
    const maxT = stationStore.getParam(stationToView, "temperature", "max");
    const minW = stationStore.getParam(stationToView, "windSpeed", "min");
    const maxW = stationStore.getParam(stationToView, "windSpeed", "max");
    const minP = stationStore.getParam(stationToView, "pressure", "min");
    const maxP = stationStore.getParam(stationToView, "pressure", "max");
    const summaryData = {
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
  return summaryData;
  }

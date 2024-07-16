import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";


export const stationController = {
  async index(request, response) {
    const stationToView = await stationStore.getStationById(request.params.stationId);
    const stationReports = await reportStore.getReportsByStationId(request.params.stationId);
    stationToView.reports = stationReports;
    const viewData = {
      station: stationToView,
      title: "Station View: " + stationToView.name,
    };
    console.log("station-view rendering: " + stationToView.name);
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
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";


export const stationController = {
  async index(request, response) {
    const stationToView = await stationStore.getStationById(request.params.stationId);
    const viewData = {
      station: stationToView,
      title: "Station View: " + stationToView.name,
    };
    console.log("station-view rendering: " + stationToView.name);
    response.render("station-view", viewData);
  },
  
  async addReport(request, response) {
    const stationToView = await stationStore.getStationById(request.params.stationId);
    const newReport = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`adding report ${newReport.title}`);
    await reportStore.addReport(report._id, newReport);
    response.redirect("/station/" + station._id);
  },
};
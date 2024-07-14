import { stationStore } from "../models/station-store.js";

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
  

};
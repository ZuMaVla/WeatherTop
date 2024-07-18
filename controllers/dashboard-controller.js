import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";

export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Station Dashboard",
      stations: await stationStore.getAllStations(),
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  
  async addStation(request, response) {
    const newStation = {
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

};

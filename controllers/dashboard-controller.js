import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { prepareSummary } from "../utils/implementation.js";



export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    let temp;
    userStations = await stationStore.getStationByUserId(loggedInUser._id);
    for (let i = 0; i < userStations.length - 1; i++) {
      temp = await prepareSummary(userStations[i]._id);
      userStations[i].attributes = temp.attributes;
    }
    
    
    const viewData = {
      title: "Station Dashboard",
      stations: userStations,
      userName: loggedInUser.firstName,
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  
  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

};

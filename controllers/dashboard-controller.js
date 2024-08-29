import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { prepareSummary } from "../utils/implementation.js";                        // importing own function 



export const dashboardController = {
  async index(request, response) {
    if (request.cookies.weathertop_user_token && request.cookies.weathertop_user_token.trim() !== "") {
      // The cookie is defined and not empty
      const loggedInUser = await accountsController.getLoggedInUser(request);
      const userStations = await stationStore.getStationByUserId(loggedInUser._id);

      let temp;
      for (let i = 0; i < userStations.length; i++) {                               // loop to pass through each station and prepare summary data
        temp = await prepareSummary(userStations[i]._id);

        userStations[i].attributes = temp.attributes;                               // data necessary for station's summary gets attached 
      };

      const viewData = {
        title: "Station Dashboard",
        user: loggedInUser,
        stations: userStations,                                                     // stations with prepared summary data are passed to dashboard-view render
      };
      console.log("dashboard rendering");
      response.render("dashboard-view", viewData);
    }
    else {                                                                          // The cookie is not defined or empty
      console.log("No user is logged in");
      response.redirect("/");                                                       // handling cases when dashboard is attempted to be accessed without login 
    }
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
  
  async deleteStation(request, response) {
    await stationStore.deleteStationById(request.params.stationId);                                  // deleting station itself

    console.log(`Station deleted: ${request.params.stationId}`);
    const deletedReports = await reportStore.deleteReportsByStationId(request.params.stationId);     // cascade deleting of its reports 
    console.log(`Reports deleted: ${deletedReports}`);
    response.redirect("/dashboard");
  },

};

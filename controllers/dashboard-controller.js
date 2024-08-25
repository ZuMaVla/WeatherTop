import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationController } from "./station-controller.js";
import { prepareSummary } from "../utils/implementation.js";



export const dashboardController = {
  async index(request, response) {
    try {
        if (request.cookies && request.cookies.weathertop_user_token && request.cookies.weathertop_user_token.trim() !== "") {
            // The cookie is defined and not empty
          const loggedInUser = await accountsController.getLoggedInUser(request);
          const userStations = await stationStore.getStationByUserId(loggedInUser._id);

          let temp;
          for (let i = 0; i < userStations.length; i++) {
            temp = await prepareSummary(userStations[i]._id);
            console.log('Current Station:', JSON.stringify(temp, null, 2));

            userStations[i].attributes = temp.attributes;
          };

          const viewData = {
            title: "Station Dashboard",
            stations: userStations,
            //userName: loggedInUser.firstName,
            user: loggedInUser,
          };
          console.log("dashboard rendering");
          response.render("dashboard-view", viewData);  
                 res.send('Cookie is valid');
        } else {
            // The cookie is either undefined or empty
            res.send('Cookie is not defined or empty');
        }
    } catch (error) {
        // Handle the exception
      console.log("No user is logged in");
      response.redirect("/");  
        console.error('An error occurred:', error.message);
        res.status(500).send('An error occurred while processing the request.');
    }

    
    if (cookies && cookies.weathertop_user_token && cookies.weathertop_user_token.trim() !== "") {
   }
    else {
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
    //const loggedInUser = await accountsController.getLoggedInUser(request);
    await stationStore.deleteStationById(request.params.stationId);

    console.log(`Station deleted: ${request.params.stationId}`);
    const deletedReports = await reportStore.deleteReportsByStationId(request.params.stationId);
    console.log(`Reports deleted: ${deletedReports}`);
    response.redirect("/dashboard");
  },
  

};

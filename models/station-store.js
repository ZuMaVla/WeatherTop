import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    let temp = await db.read().stations;
    station._id = v4();
    temp.push(station);
    
    users.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
    await db.write();
    return station;
  },

  async getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    return list;
  },
  
  async getStationByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },


  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
  
  getParam(station, param, comparison) {
    let temp;
    switch(comparison) {
      case "min":
        if (station.reports.length > 0) {
          let temp = station.reports[0][param];
          for (let i = 1; i < station.reports.length; i++) {
            if (station.reports[i][param] < temp) {
              temp = station.reports[i][param];
            }
          }
        return temp.toString();
        }
        else {
          return "n/a";
        }
        break;
      case "max":
        if (station.reports.length > 0) {
          temp = station.reports[0][param];
          for (let i = 1; i < station.reports.length; i++) {
            if (station.reports[i][param] > temp) {
              temp = station.reports[i][param];
            }
          }
        return temp.toString();
        }
        else {
          return "n/a";
        }
        break;
    }      
  },
};
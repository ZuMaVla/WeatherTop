import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
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
  
    getMinTemp(station) {
    if (station.reports.length > 0) {
      let minTemp = station.reports[0].temperature;
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].temperature < minTemp) {
          minTemp = station.reports[i].temperature;
        }
      }
    return minTemp.toString();
    }
    else {
      return "n/a";
    }
  },
};
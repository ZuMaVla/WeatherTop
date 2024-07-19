import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationId = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportById(id) {
    await db.read();
    const list = db.data.reports.find((report) => report._id === id);
    return list;
  },
  
  async getReportsByStationId(stnId) {
    await db.read();
    return db.data.reports.filter((report) => report.stationId === stnId);
  },
  
  async deleteReport(id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    console.log(index, id)
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },
  
  getMinTemp(station) {
    let minTemp = null;
    if (station.reports.length > 0) {
      minTemp = station.reports[0];
      for (let i = 1; i < station.reports.length; i++) {
        if (station.reports[i].duration < minTemp.duration) {
          minTemp = station.reports[i];
        }
      }
    }
    return minTemp;
  },
};

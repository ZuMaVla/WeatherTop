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
  
  async deleteReportsByStationId(stnId) {
    await db.read();
    let temp = db.data.reports.length;
                                          // retrieve reports station IDs of which are not equal that of the station that is being deleted
    db.data.reports = db.data.reports.filter((report) => report.stationId !== stnId); 
    await db.write();                     // these are exactly reports that should be left after deleting unwanted station's reports
    temp -= db.data.reports.length;       // the difference shows how many reports got deleted (for logs) 
    return temp;
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

};

import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(report) {
    await db.read();
    report._id = v4();
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportById(id) {
    await db.read();
    const list = db.data.reports.find((report) => report._id === id);
    return list;
  },

  async deleteReportById(id) {
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
};

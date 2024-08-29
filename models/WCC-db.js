import { initStore } from "../utils/store-utils.js";

const db = initStore("WCCs");

export const WCCs = {
  async getWeatherByCode(codeToRetrieve) {
    await db.read();
    let WCC = db.data.weatherCodes.find((weatherCode) => weatherCode.code === codeToRetrieve);
    if (!WCC) {
      WCC = db.data.weatherCodes.find((weatherCode) => weatherCode.code === 0);
    }
    return WCC;
  },
};

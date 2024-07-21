import { initStore } from "../utils/store-utils.js";

const db = initStore("WCCs");

export const WCCs = {
  async getWeatherByCode(codeToRetrieve) {
    await db.read();
    const WCC = db.data.weatherCodes.find((weatherCode) => weatherCode.code === codeToRetrieve);
    return WCC;
  },
};

import { initStore } from "../utils/store-utils.js";

const db = initStore("WCCs");                                        // reading data from json file containing detailed description of weather codes (WCCs.json)

export const WCCs = {
  async getWeatherByCode(codeToRetrieve) {
    await db.read();
    let WCC = db.data.weatherCodes.find((weatherCode) => weatherCode.code === codeToRetrieve);
    if (!WCC) {                                                      // if not valid weather code is passed then treat it as default one (weather undefined)
      WCC = db.data.weatherCodes.find((weatherCode) => weatherCode.code === 0);
    }
    return WCC;
  },
};

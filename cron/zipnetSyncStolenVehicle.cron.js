// zipnetSync.service.js

const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const ZIPNET_BASE_URL = "https://zipnet.delhipolice.gov.in";
const ZIPNET_URL =
  "https://zipnet.delhipolice.gov.in/VehiclesMobiles/GetMissingVehiclesData/";

// In-memory cookie jar
const cookieJar = new CookieJar();

// Axios client with cookie support
const client = wrapper(
  axios.create({
    jar: cookieJar,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0",
      "Referer": ZIPNET_BASE_URL,
      "Origin": ZIPNET_BASE_URL
    }
  })
);

let cookieLogged = false;

// Ensure ZIPNET session (cookie auto-created/refreshed)
async function ensureZipnetSession() {
  await client.get(ZIPNET_BASE_URL);
}

async function fetchZipnetData(start = 0, length = 10) {

  try {
    // 🔑 Ensure valid cookie/session
    await ensureZipnetSession();
    
    if (!cookieLogged) {
      const cookies = await cookieJar.getCookies(ZIPNET_BASE_URL);
      console.log("ZIPNET cookies:", cookies.map(c => c.key));
      cookieLogged = true;
    }

    // ⚠️ PAYLOAD IS 100% UNCHANGED
    const payload = new URLSearchParams({
      draw: 1,
      start: start,
      length: length,
      "search[value]": "",
      "search[regex]": false,
      searchFormJson: "{}",

      "columns[0][data]": "MissingVehiclesId",
      "columns[0][name]": "MissingVehiclesId",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,

      "columns[1][data]": "FIRDate",
      "columns[1][name]": "FIRDate",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,

      "columns[2][data]": "",
      "columns[2][name]": "",
      "columns[2][searchable]": true,
      "columns[2][orderable]": false,

      "columns[3][data]": "State",
      "columns[3][name]": "State",
      "columns[3][searchable]": true,
      "columns[3][orderable]": false,

      "columns[4][data]": "District",
      "columns[4][name]": "District",
      "columns[4][searchable]": true,
      "columns[4][orderable]": false,

      "columns[5][data]": "PoliceStation",
      "columns[5][name]": "PoliceStation",
      "columns[5][searchable]": true,
      "columns[5][orderable]": false,

      "columns[6][data]": "FIRNo",
      "columns[6][name]": "FIRNo",
      "columns[6][searchable]": true,
      "columns[6][orderable]": false,

      "columns[7][data]": "FIRDate",
      "columns[7][name]": "FIRDate",
      "columns[7][searchable]": true,
      "columns[7][orderable]": false,

      "columns[8][data]": "VehicleRegistrationNo",
      "columns[8][name]": "VehicleRegistrationNo",
      "columns[8][searchable]": true,
      "columns[8][orderable]": false,

      "columns[9][data]": "VehicleType",
      "columns[9][name]": "VehicleType",
      "columns[9][searchable]": true,
      "columns[9][orderable]": false,

      "columns[10][data]": "MissingStatus",
      "columns[10][name]": "MissingStatus",
      "columns[10][searchable]": true,
      "columns[10][orderable]": false,

      "order[0][column]": 1,
      "order[0][dir]": "desc"
    });

    const response = await client.post(ZIPNET_URL, payload.toString());

    const rows = response?.data?.data || [];

    console.log("ZIPNET rows fetched:", rows.length);

    return rows;

  } catch (err) {
    console.error("❌ ZIPNET Error:", err.message);
    return [];
  }
}

module.exports = { fetchZipnetData };

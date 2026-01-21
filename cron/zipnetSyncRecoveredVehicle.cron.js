const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const ZIPNET_BASE_URL = "https://zipnet.delhipolice.gov.in";

const ZIPNET_RECOVERED_URL =
  "https://zipnet.delhipolice.gov.in/VehiclesMobiles/GetUnclaimedSeizedVehiclesData";

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
    },
    timeout: 120000
  })
);

let cookieLogged = false;

// Ensure ZIPNET session
async function ensureZipnetSession() {
  await client.get(ZIPNET_BASE_URL);
}

async function fetchZipnetRecoveredData(start = 0, length = 100) {
  try {
    // 🔑 Ensure valid cookie/session
    await ensureZipnetSession();

    if (!cookieLogged) {
      const cookies = await cookieJar.getCookies(ZIPNET_BASE_URL);
      console.log("ZIPNET cookies:", cookies.map(c => c.key));
      cookieLogged = true;
    }

    // ⚠️ DataTables payload (recovered / unclaimed)
    const payload = new URLSearchParams({
      draw: 1,
      start: start,
      length: length,

      "search[value]": "",
      "search[regex]": false,
      searchFormJson: "{}",

      "columns[0][data]": "UnclaimedSeizedVehiclesId",
      "columns[0][name]": "UnclaimedSeizedVehiclesId",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,

      "columns[1][data]": "CreatedOn",
      "columns[1][name]": "CreatedOn",
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

      "columns[6][data]": "DDNo",
      "columns[6][name]": "DDNo",
      "columns[6][searchable]": true,
      "columns[6][orderable]": false,

      "columns[7][data]": "DD_Date",
      "columns[7][name]": "DD_Date",
      "columns[7][searchable]": true,
      "columns[7][orderable]": false,

      "columns[8][data]": "VehicleRegistrationNo",
      "columns[8][name]": "VehicleRegistrationNo",
      "columns[8][searchable]": true,
      "columns[8][orderable]": false,

      "columns[9][data]": "VehicleModel",
      "columns[9][name]": "VehicleModel",
      "columns[9][searchable]": true,
      "columns[9][orderable]": false,

      "columns[10][data]": "Status",
      "columns[10][name]": "Status",
      "columns[10][searchable]": true,
      "columns[10][orderable]": false,

      "order[0][column]": 1,
      "order[0][dir]": "desc"
    });

    const response = await client.post(
      ZIPNET_RECOVERED_URL,
      payload.toString()
    );

    const rows = response?.data?.data || [];

    console.log("ZIPNET recovered rows fetched:", rows.length);

    return rows;

  } catch (err) {
    console.error("❌ ZIPNET RECOVERED Error:", err.message);
    return [];
  }
}

module.exports = fetchZipnetRecoveredData;

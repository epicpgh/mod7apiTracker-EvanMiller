import { API_KEY } from "./secret";
// console.log(API_KEY);

const ipAddressEndpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=`;
const domainsEndpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=`;
// global variable for the map object
let map = null;

// =========== ELEMENTS ===================================
const searchInput = document.getElementById("ip-input");

const ipAddressSpan = document.getElementById("ip-address");
const locationSpan = document.getElementById("location");
const timezoneSpan = document.getElementById("timezone");
const ispSpan = document.getElementById("ISP");

function updateIpInfo(data){
  ipAddressSpan.textContent = data.ip;
  locationSpan.textContent = `${data.location.city} ${data.location.region} ${data.location.postalCode}`;
  timezoneSpan.textContent = `UTC ${data.location.timezone}`;
  ispSpan.textContent = data.isp;
}


// Runs as soon as the page content is loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // get the user ip address
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    console.log(ipData);

    const ip = ipData.ip;

    // get location info
    const locationResponse = await fetch(`${ipAddressEndpoint}${ip}`);
    const locationData = await locationResponse.json();
    console.log(locationData);

    // Display location info on the UI
    updateIpInfo(locationData);

    // Display map
    // map = L.map("map").locate({ setView: true, maxZoom: 16 });
    map = L.map("display-map").setView([locationData.location.lat, locationData.location.lng], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([locationData.location.lat, locationData.location.lng]).addTo(map);

    // console.log(map);
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
});

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputValue = searchInput.value.trim();
  if (!inputValue) return;

  const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(inputValue);
  const url = isIP 
    ? ipAddressEndpoint + inputValue 
    : domainsEndpoint + inputValue;

  try {
    const response = await fetch(url);
    const data = await response.json();

    updateIpInfo(data);

    map.setView([data.location.lat, data.location.lng], 13);
    L.marker([data.location.lat, data.location.lng]).addTo(map);
  } catch (error) {
    console.error("Error fetching IP/domain info:", error);
  }
});

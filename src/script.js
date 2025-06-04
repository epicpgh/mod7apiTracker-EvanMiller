import { API_KEY } from "./secret.js";




const ipAddressEndpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=`;
const domainsEndpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=`;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    const locationResponse = await fetch(
      `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ip}`
    );
    const locationData = await locationResponse.json();
    console.log("Location Data:", locationData);

    const map = L.map("map").locate({ setView: true, maxZoom: 16 });

    //const { lat, lng } = locationData.location;

    //const map = L.map("map").setView([lat, lng], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup("IP Location").openPopup();

  
    document.getElementById("ip").textContent = locationData.ip;
    document.getElementById("location").textContent = `${locationData.location.city}, ${locationData.location.region}`;
    document.getElementById("timezone").textContent = locationData.location.timezone;
    document.getElementById("isp").textContent = locationData.isp;
  } catch (error) {
    console.error("Failed to fetch IP data or load map:", error);
  }
});


// Initialize map
var map = L.map('map').setView([23.2599, 77.4126], 6); // Center MP

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Sample complaint data
let complaints = [
  { city: "Bhopal", authority: "Municipal Corporation", issue: "Potholes on Road", status: "ongoing", coords: [23.2599, 77.4126] },
  { city: "Indore", authority: "Electricity Dept", issue: "Power Outage", status: "resolved", coords: [22.7196, 75.8577] },
  { city: "Gwalior", authority: "Water Dept", issue: "Water Shortage", status: "ongoing", coords: [26.2183, 78.1828] },
  { city: "Shivpuri", authority: "Environment Dept", issue: "Illegal Dumping", status: "ongoing", coords: [25.4231, 77.6536] },
  { city: "Jabalpur", authority: "Police", issue: "Traffic Congestion", status: "resolved", coords: [23.1815, 79.9864] }
];

// Render complaints
function renderComplaints(filterCity = "", filterAuthority = "") {
  let feed = document.getElementById("news-feed");
  feed.innerHTML = "";

  let ongoing = 0, resolved = 0;

  complaints.forEach(c => {
    if ((filterCity && c.city !== filterCity) || (filterAuthority && c.authority !== filterAuthority)) {
      return;
    }

    // Count stats
    if (c.status === "ongoing") ongoing++;
    if (c.status === "resolved") resolved++;

    // Card
    let card = document.createElement("div");
    card.className = "complaint-card";
    card.innerHTML = `<h3>${c.issue}</h3>
                      <p>${c.city} - ${c.authority}</p>
                      <p>Status: <span class="status ${c.status}">${c.status}</span></p>`;
    feed.appendChild(card);
  });

  document.getElementById("ongoing-count").innerText = ongoing;
  document.getElementById("resolved-count").innerText = resolved;
}

// Render markers on map
function renderMarkers(filterCity = "", filterAuthority = "") {
  map.eachLayer(layer => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });

  complaints.forEach(c => {
    if ((filterCity && c.city !== filterCity) || (filterAuthority && c.authority !== filterAuthority)) {
      return;
    }
    L.circleMarker(c.coords, {
      color: c.status === "ongoing" ? "red" : "green",
      radius: 8
    }).addTo(map).bindPopup(`<b>${c.issue}</b><br>${c.city}<br>${c.authority}`);
  });
}

// Initial load
renderComplaints();
renderMarkers();

// Filters
document.getElementById("city-filter").addEventListener("change", (e) => {
  let city = e.target.value;
  let authority = document.getElementById("authority-filter").value;
  renderComplaints(city, authority);
  renderMarkers(city, authority);
});

document.getElementById("authority-filter").addEventListener("change", (e) => {
  let authority = e.target.value;
  let city = document.getElementById("city-filter").value;
  renderComplaints(city, authority);
  renderMarkers(city, authority);
});

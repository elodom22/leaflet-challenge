// Fetch the GeoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create the map
let myMap = L.map("map", {
center: [20, 0], // Center globally
zoom: 2,
});
// Add a tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; OpenStreetMap contributors, OpenTopoMap'
}).addTo(myMap);
function mapSize(magnitude) {
return magnitude ? magnitude * 4 : 1;
}
function mapColor(depth) {
return depth > 90 ? 'red' :
       depth > 70 ? 'orange' :
       depth > 50 ? 'yellow' :
       depth > 30 ? 'green' :
       depth > 10 ? 'blue' :
                    'purple';
}
// Fetch earthquake data
d3.json(url).then(data => {
try {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      return L.circleMarker(latlng, {
        radius: mapSize(magnitude),
        fillColor: mapColor(depth),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <h3>${feature.properties.title}</h3>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]} km</p>
        <p>Location: ${feature.properties.place}</p>
      `);
    },
  }).addTo(myMap);
} catch (error) {
  console.error("Error adding GeoJSON to the map:", error);
}
// Add legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [-10, 10, 30, 50, 70, 90];
  let colors = ["purple", "blue", "green", "yellow", "orange", "red"];
  div.innerHTML = "<h4>Depth (km)</h4>";
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? `&ndash;${depths[i + 1]}` : '+'}<br>`;
  }
  return div;
};
legend.addTo(myMap);
});

const tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonicUrl).then(data => {
  L.geoJson(data, {
    style: { color: "yellow", weight: 2 }
  }).addTo(myMap);
});
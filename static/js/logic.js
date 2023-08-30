console.log("logic.js");


var theMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var gray = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

let myMap = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });

  theMap.addTo(myMap); 

  let baseMaps = {
    "Gray Global": gray,
    "Light Global": theMap
  };

  let tectonicplates = new L.LayerGroup();
  let earthquakes = new L.LayerGroup();

  let overlays = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes
  };

  L
  .control
  .layers(baseMaps, overlays, { collapsed: false })
  .addTo(myMap);

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


  function getColor(magnitude) {
    if (magnitude > 90) {
      return "#ea2c2c";
    }
    if (magnitude > 70) {
      return "#ea822c";
    }
    if (magnitude > 50) {
      return "#ee9c00";
    }
    if (magnitude > 30) {
      return "#eecc00";
    }
    if (magnitude > 10) {
      return "#d4ee00";
    }
    return "#98ee00";
  }


  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

      style: styleInfo,

        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
          );
        }
    }).addTo(earthquakes);

  earthquakes.addTo(myMap);

  let legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [-10, 10, 30, 50, 70, 90];

    let colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"];

     for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + colors[i]
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);s


})


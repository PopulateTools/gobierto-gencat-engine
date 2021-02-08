import { max, min } from "d3-array";
import { nest } from 'd3-collection';
import { csv } from "d3-fetch";
import { geoMercator, geoPath, geoTransform } from "d3-geo";
import { scaleThreshold } from "d3-scale";
import { mouse, select, selectAll } from "d3-selection";
import { zoom } from "d3-zoom";
import mapboxgl from "mapbox-gl";
import * as dataGeoJson from "../vendor/countries.geo.json";

const d3 = {
  csv,
  min,
  max,
  geoPath,
  geoMercator,
  geoTransform,
  select,
  selectAll,
  scaleThreshold,
  zoom,
  nest,
  mouse
};

window.GobiertoPeople.GencatMapController = (function() {
  function GencatMapController() {}

  GencatMapController.prototype.index = function(options) {
    createMap(options);

    const toggle = document.querySelector(".js-toggle");
    toggle.addEventListener("click", (e) => {
      const openClassName = "is-open";
      const infoboxClassList = e.target.parentElement.classList;
      const iconClassList = e.target.firstElementChild.classList;

      if (infoboxClassList.contains(openClassName)) {
        infoboxClassList.remove(openClassName);
        iconClassList.toggle("fa-arrow-left");
        iconClassList.toggle("fa-arrow-right");
      } else {
        infoboxClassList.add(openClassName);
        iconClassList.toggle("fa-arrow-left");
        iconClassList.toggle("fa-arrow-right");
      }
    });
  };

  return GencatMapController;
})();

function createMap(options) {
  if ($("#map").length === 0) return;

  const { fromDate, toDate, mapboxToken, departmentId = "" } = options;

  let departmentCondition = departmentId;

  function convertDate(date) {
    let newDate = new Date(date);
    var monthNewDate = newDate.getUTCMonth() + 1;
    var dayNewDate = newDate.getUTCDate();
    var yearNewDate = newDate.getUTCFullYear();
    newDate = `${yearNewDate}-${monthNewDate}-${dayNewDate}`;

    return newDate;
  }

  let dateRangeConditions = [];

  if (fromDate !== "") {
    let newFromDate = convertDate(fromDate);
    dateRangeConditions.push(`start_date+>=+'${newFromDate}'`);
  }

  if (toDate !== "") {
    let newToDate = convertDate(toDate);
    dateRangeConditions.push(`end_date+<=+'${newToDate}'`);
  }

  if (dateRangeConditions.length)
    dateRangeConditions = `+AND+${dateRangeConditions.join("+AND+")}`;

  if (departmentCondition !== "") {
    departmentCondition = `+AND+department_id+=+${departmentId}`;
  }

  let dataGenCatTrips = '/api/v1/data/data.csv?sql=SELECT+*+FROM+trips+WHERE+country+is+not+null+AND+country+%21%3D+%27ES%27';

  dataGenCatTrips = `${dataGenCatTrips}${dateRangeConditions}${departmentCondition}`;

  mapboxgl.accessToken = mapboxToken;

  let dots;
  let featureElement;
  const buttonCloseTooltip = document.getElementById("tooltip--close");
  buttonCloseTooltip.addEventListener("click", closeTooltip);
  const geoJSON = dataGeoJson.default;
  const choropletScale = [
    "#ecda9a",
    "#efc47e",
    "#f3ad6a",
    "#f7945d",
    "#f97b57",
    "#f66356",
    "#ee4d5a",
  ];
  const dataTravels = new Map();
  const meetingNameOne = I18n.t(
    "gobierto_people.people.trips.trip.meeting_name.one"
  );
  const meetingNameOther = I18n.t(
    "gobierto_people.people.trips.trip.meeting_name.other"
  );
  const tripIn = I18n.t("gobierto_people.people.trips.trip.in");
  const tripBy = I18n.t("gobierto_people.people.trips.trip.by");
  var zoomInButton = document.getElementById("zoomIn");
  var zoomOutButton = document.getElementById("zoomOut");
  zoomInButton.addEventListener("click", zoomIn);
  zoomOutButton.addEventListener("click", zoomOut);

  const tooltip = d3.select(".map--tooltip");

  const tooltipText = d3.select(".map--tooltip-text");

  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v9",
    center: [-3.70379, 40.416775],
    zoom: 2.25,
    minZoom: 2.25,
    maxZoom: 16,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  let currentZoom = map.getZoom();

  map.addControl(new mapboxgl.NavigationControl());

  const container = map.getCanvasContainer();
  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "map--svg");

  d3.csv(dataGenCatTrips).then((data) => {
          // d3v5
      //
      const nest = d3
      .nest()
      .key(d => d.country)
      .entries(data);
          // d3v6
      //
    // const nest = Array.from(group(data, (d) => d.country), ([key, values]) => ({
    //   key,
    //   values,
    // }));

    nest.forEach(function(d) {
      dataTravels.set(d.key, +d.values.length);
    });

    data.forEach(function(d) {
      d.lat = +d.lat;
      d.lon = +d.lon;
    });

    const minValue = d3.min(nest, (d) => d.values.length);
    const maxValue = d3.max(nest, (d) => d.values.length);
    const domainScale = [
      minValue,
      maxValue / 12,
      maxValue / 10,
      maxValue / 7,
      maxValue / 5,
      maxValue / 3,
      maxValue,
    ];

    const colorScale = d3
      .scaleThreshold()
      .domain(domainScale)
      .range(choropletScale);

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    function renderChoropleth() {
      featureElement = svg
        .selectAll("path")
        .data(geoJSON.features)
        .enter()
        .append("path")
        .attr("class", "map--countries")
        .attr("fill", function(d) {
          d.travels = dataTravels.get(d.properties.alpha2);
          if (d.travels === undefined) {
            return "transparent";
          } else {
            return colorScale(d.travels);
          }
        })
        .attr("fill-opacity", "0.8")
        .attr("stroke", function(d) {
          if (d.travels === undefined) {
            return "transparent";
          } else {
            return "#fff";
          }
        })
        .style("pointer-events", function(d) {
          if (d.travels === undefined) {
            return "none";
          } else {
            return "auto";
          }
        })
        .on("click", showTooltipChoropleth);
    }

    function updateChroloplet() {
      featureElement.attr("d", path);
    }

    map.on("move", function() {
      updateChroloplet();
      updateDots();
      closeTooltip();
    });

    map.on("moveend", function() {
      updateChroloplet();
      updateDots();
    });

    map.on("zoom", function(e) {
      updateChroloplet();

      currentZoom = map.getZoom();

      if (currentZoom >= 4) {
        updateDots();
        d3.selectAll(".map--dots").style("visibility", "visible");

        d3.selectAll(".map--countries").style("visibility", "hidden");
      } else {
        d3.selectAll(".map--dots").style("visibility", "hidden");

        d3.selectAll(".map--countries").style("visibility", "visible");
      }
    });

    function renderDots() {
      dots = svg.selectAll("circle").data(data);

      dots
        .enter()
        .append("circle")
        .attr("class", "map--dots")
        .attr("r", radiusDots)
        .attr("cx", (d) => project([d.lon, d.lat]).x)
        .attr("cy", (d) => project([d.lon, d.lat]).y)
        .attr("fill", "#F05E6A")
        .attr("stroke", "#fff")
        .style("visibility", "hidden")
        .on("click", showTooltipDots);
    }

    function updateDots() {
      d3.selectAll(".map--dots")
        .attr("cx", (d) => project([d.lon, d.lat]).x)
        .attr("cy", (d) => project([d.lon, d.lat]).y);
    }

    //group cities by trips
    const groupBy = function(data, key) {
      return data.reduce(function(storage, item) {
        var group = item[key];
        storage[group] = storage[group] || [];
        storage[group].push(item);
        return storage;
      }, {});
    };

    const dataGroupByKey = groupBy(data, "city_name");

    const ValuesFromGroups = Object.values(dataGroupByKey);

    function radiusDots(d) {
      //Create a new property with the total of the trips group by cities
      for (let value of ValuesFromGroups) {
        if (value[0].city_name === d.city_name) {
          d.totalTrips = value.length;
        }
      }

      if (d.totalTrips < 4) {
        return 5;
      } else if (d.totalTrips < 8) {
        return 10;
      } else if (d.totalTrips < 12) {
        return 16;
      } else if (d.totalTrips < 18) {
        return 20;
      } else if (d.totalTrips > 18) {
        return 24;
      }
    }

    function project(d) {
      return map.project(new mapboxgl.LngLat(d[0], d[1]));
    }

    function projectPoint(lon, lat) {
      var point = map.project(new mapboxgl.LngLat(lon, lat));
      this.stream.point(point.x, point.y);
    }

    function showTooltipChoropleth(d) {
      const {
        travels,
        properties: { name },
      } = d;
      const [layerX, layerY] = d3.mouse(this);

      //Get the list of travellers
      const valueCountry = "country_name";
      const valuePerson = "person_name";
      const filterTravelersData = filterTravelers(
        name,
        valueCountry,
        valuePerson
      );
      const listTravelers = getListTravelers(filterTravelersData);

      tooltip
        .style("display", "block")
        .style("left", `${layerX - 50}px`)
        .style("top", `${layerY + 10}px`)
        .transition()
        .duration(200);

      const countTrips = travels > 1 ? meetingNameOther : meetingNameOne;
      tooltipText.html(
        `<h2>${travels} ${countTrips} ${tripIn} ${name} ${tripBy}:</h2><ul>${listTravelers}</ul>`
      );
    }

    function showTooltipDots(d) {
      const { city_name, totalTrips } = d;
      const [layerX, layerY] = d3.mouse(this);

      //Get the list of travellers
      const valueCountry = "city_name";
      const valuePerson = "person_name";
      const filterTravelersData = filterTravelers(
        city_name,
        valueCountry,
        valuePerson
      );
      const listTravelers = getListTravelers(filterTravelersData);

      tooltip
        .style("display", "block")
        .style("left", `${layerX - 50}px`)
        .style("top", `${layerY + 10}px`)
        .transition()
        .duration(200);

      const countTrips = totalTrips > 1 ? meetingNameOther : meetingNameOne;
      tooltipText.html(
        `<h2>${totalTrips} ${countTrips} ${tripIn} ${city_name} ${tripBy}:</h2><ul class="map--tooltip--list">${listTravelers}</ul>`
      );
    }

    function getListTravelers(data) {
      let arrayTravelers = "";
      for (let person of data) {
        const { person_name, person_slug } = person;
        let url = `/personas/${person_slug}/viajes-y-desplazamientos?start_date=${fromDate}`;
        arrayTravelers = `${arrayTravelers}<li class="map--tooltip--list-element"><a href='${url}'>${person_name}</a></li>`;
      }

      return arrayTravelers;
    }

    function filterTravelers(country, filterKey, value) {
      if (country === "United States of America") country = "United States";
      let filteredData = data.filter((d) => d[filterKey] === country);
      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
      }
      filteredData = getUniqueListBy(filteredData, value);
      return filteredData;
    }

    renderChoropleth();
    renderDots();
    updateChroloplet();
  });

  function zoomIn() {
    currentZoom = currentZoom + 1;
    map.setZoom(currentZoom);
  }

  function zoomOut() {
    currentZoom = currentZoom - 1;
    map.setZoom(currentZoom);
  }

  function closeTooltip() {
    tooltip.style("display", "none");
  }
}

window.GobiertoPeople.gencat_map_controller = new GobiertoPeople.GencatMapController();

import { csv, json } from 'd3-request'
import { min, max } from 'd3-array'
import { geoPath, geoMercator, geoTransform } from 'd3-geo'
import { select, selectAll, mouse, event } from 'd3-selection'
import { scaleThreshold } from 'd3-scale'
import { queue } from 'd3-queue'
import { nest, map } from 'd3-collection'
import * as topojson from "topojson-client";
import mapboxgl from 'mapbox-gl';

const d3 = { csv, json, min, max, geoPath, geoMercator, geoTransform, select, selectAll, scaleThreshold, queue, nest, map, mouse, event }

window.GobiertoPeople.GencatMapController = (function() {
  function GencatMapController() {}

  GencatMapController.prototype.index = function(options) {
    createMap(options)

    const toggle = document.querySelector(".js-toggle");
    toggle.addEventListener("click", e => {
      const openClassName = "is-open";
      const infoboxClassList = e.target.parentElement.classList;
      const iconClassList = e.target.firstElementChild.classList;

      if (infoboxClassList.contains(openClassName)) {
        infoboxClassList.remove(openClassName)
        iconClassList.toggle("fa-arrow-left")
        iconClassList.toggle("fa-arrow-right")
      } else {
        infoboxClassList.add(openClassName)
        iconClassList.toggle("fa-arrow-left")
        iconClassList.toggle("fa-arrow-right")
      }
    });
  }

  return GencatMapController;
})();


function createMap(options) {

  mapboxgl.accessToken = 'pk.eyJ1IjoiYmltdXgiLCJhIjoiY2swbmozcndlMDBjeDNuczNscTZzaXEwYyJ9.oMM71W-skMU6IN0XUZJzGQ';

  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v9",
    center: [-3.703790, 40.416775],
    zoom: 3,
    minZoom: 3,
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  map.addControl(new mapboxgl.NavigationControl());

  const container = map.getCanvasContainer()
  const svg = d3.select(container)
    .append("svg")
    .attr('class', 'map--svg')

  const dataGenCatTrips = 'https://gencat.gobify.net/api/v1/data/data.csv?sql=select%20*%20from%20trips'
  const URLTOPOJSON = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'

  const CHOROPLET_SCALE = ['#ecda9a', '#efc47e', '#f3ad6a', '#f7945d', '#f97b57', '#f66356', '#ee4d5a']
  const dataTravels = d3.map();

  const tooltip = d3
    .select(".map--container")
    .append("div")
    .attr("class", "map--tooltip");

  d3.csv(dataGenCatTrips, function(data) {
    const nest = d3
      .nest()
      .key(function(d) { return d.country_name })
      .entries(data);

    nest.forEach(function(d) {
      dataTravels.set(d.key, +d.values.length);
    })

    const minValue = d3.min(nest, d => d.values.length)
    const maxValue = d3.max(nest, d => d.values.length)
    const domainScale = [ minValue, (maxValue / 12), (maxValue / 10), (maxValue / 7), (maxValue / 5), (maxValue / 3), maxValue ]

    const colorScale = d3.scaleThreshold()
      .domain(domainScale)
      .range(CHOROPLET_SCALE);

    d3.json(URLTOPOJSON, function(data) {

      const transform = d3.geoTransform({point: projectPoint});
      const path = d3.geoPath().projection(transform);

      let dataTOPOJSON = data
      let featureElement = svg
        .selectAll("path")
        .data(dataTOPOJSON.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          d.travels = dataTravels.get(d.properties.name);
          if(d.travels === undefined) {
            return 'transparent'
          } else {
            return colorScale(d.travels);
          }
        })
        .attr("stroke", function (d) {
          if(d.travels === undefined) {
            return 'transparent'
          } else {
            return '#fff'
          }
        })
        .on("click", showTooltip);

      function update() {
        featureElement.attr("d", path);
      }

      map.on("viewreset", update);
      map.on("move", update);
      map.on("moveend", update);

      update()

      function project(d) {
        return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
      }

      function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
        this.stream.point(point.x, point.y);
      }

      function showTooltip(d) {

        /*TODO: filter csv with the name of country to obtain the list of travelers*/
        const mouse = d3.mouse(svg.node()).map(d => parseInt(d));
        tooltip
          .style("display", "block")
          .html(`<h2>Han viajado a ${d.properties.name} en ${d.travels} ocasiones</h2>`)
          .style('left', `${mouse[0]}px`)
          .style('top', `${mouse[1]}px`)
          .transition()
          .duration(200);
      }
    })
  })

 /* if ($('#map').length === 0) return;

    let fromDate = options.fromDate;
    let toDate = options.toDate;
    let departmentCondition = options.departmentId || "";
    let cartoDatabaseName = options.cartoDatabaseName;
    let dateRangeConditions = [];
    if(fromDate !== "")
      dateRangeConditions.push(`start_date >= '${fromDate}'`)
    if(toDate !== "")
      dateRangeConditions.push(`end_date <= '${toDate}'`)
    if(dateRangeConditions.length)
      dateRangeConditions = ` AND ${dateRangeConditions.join(' AND ')}`;
    if(departmentCondition !== "")
      departmentCondition = ` AND department_id = ${options.departmentId}`;

    $(document).ready(function() {
      let map = new L.Map('map', {
        center: [40.416775, -3.703790],
        zoom: 3,
        https: true,
        sql_api_template: 'https://gobierto.carto.com',
        cartodb_logo: false
      });
      map.zoomControl.setPosition('topright');
      map.scrollWheelZoom.disable();

      let choroplethCSS = `
#gobierto_gencat_trips { polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 1; line-opacity: 0.5; }
#gobierto_gencat_trips [ count > 24]  { polygon-fill: #B10026; }
#gobierto_gencat_trips [ count <= 24] { polygon-fill: #E31A1C; }
#gobierto_gencat_trips [ count <= 15] { polygon-fill: #FC4E2A; }
#gobierto_gencat_trips [ count <= 10] { polygon-fill: #FD8D3C; }
#gobierto_gencat_trips [ count <= 5]  { polygon-fill: #FEB24C; }
#gobierto_gencat_trips [ count <= 2]  { polygon-fill: #FED976; }
`;

      let bubbleCSS = `
#gobierto_gencat_trips { marker-fill: #EE4D5A; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; }
#gobierto_gencat_trips [ count > 18] { marker-width: 48; }
#gobierto_gencat_trips [ count < 18] { marker-width: 40; }
#gobierto_gencat_trips [ count < 12] { marker-width: 31; }
#gobierto_gencat_trips [ count < 8]  { marker-width: 20; }
#gobierto_gencat_trips [ count < 4]  { marker-width: 10; }
`;

      let choroplethSQL = `
SELECT country, country_name, count(*) as count, world_borders.the_geom as the_geom, world_borders.the_geom_webmercator,
array_to_string(array_agg(DISTINCT person_name), ',') as person_names, array_to_string(array_agg(DISTINCT person_slug), ',') as person_slugs
FROM ${cartoDatabaseName}
INNER JOIN world_borders ON world_borders.iso2 = country
WHERE country is not null AND country != 'ES'
${dateRangeConditions}
${departmentCondition}
GROUP BY country, country_name, world_borders.the_geom, world_borders.the_geom_webmercator
`;

      let bubbleSQL = `
SELECT count(*) as count, city_name, country_name, the_geom, the_geom_webmercator, array_to_string(array_agg(DISTINCT person_name), ',') as person_names,
array_to_string(array_agg(DISTINCT person_slug), ',') as person_slugs, array_to_string(array_agg(DISTINCT destination_name), ',') as destination_names
FROM ${cartoDatabaseName}
WHERE country is not null AND country != 'ES'
${dateRangeConditions}
${departmentCondition}
GROUP BY city_name, country_name, the_geom, the_geom_webmercator
ORDER by count DESC
`;

      let clorplethActive = true;

      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
      }).addTo(map);

      cartodb.createLayer(map, {
        user_name: 'gobierto',
        type: 'cartodb',
        https: true,
        cartodb_logo: false,
        sql_api_template: 'https://gobierto.carto.com',
        sublayers: [{
          sql: choroplethSQL,
          cartocss: choroplethCSS
        }, {
          sql: bubbleSQL,
          cartocss: bubbleCSS
        }]
      }, { https: true })
      .addTo(map)
      .done(function(layer) {
        layer.getSubLayer(1).hide();
        layer.getSubLayer(0).show();

        cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['country', 'country_name', 'count', 'person_names', 'person_slugs'],{
          infowindowTemplate: $('#infowindow_template_choroplethe').html(),
          templateType: 'mustache',
        }).model.set({
          sanitizeTemplate: function(inputHtml) {
            let $inputHtml = $(inputHtml);
            let names = $inputHtml.find('[data-person-names]').html().split(',');
            let slugs = $inputHtml.find('[data-person-slugs]').html().split(',');
            let html = "";
            names.forEach((name, i) => {
              html += `<li><a href="/personas/${slugs[i]}/viajes-y-desplazamientos?start_date=${fromDate}">${name}</a></li>`
            });

            $inputHtml.find('[data-person-names]').html(html);
            $inputHtml.find('[data-person-slugs]').html('');
            let count = $inputHtml.find('[data-count]').data('count');
            let countryName = $inputHtml.find('[data-country-name]').data('country-name');
            $inputHtml.find('p').html(`${count} ${I18n.t('gobierto_people.people.trips.trip.meeting_name', {count: count})} ${I18n.t('gobierto_people.people.trips.trip.in')} ${I18n.t('countries.'+countryName)} ${I18n.t('gobierto_people.people.trips.trip.by')}:`);
            return `<div class="cartodb-popup">${$inputHtml.html()}</div>`;
          }
        });

        cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(1), ['destination_names', 'country_name', 'count', 'person_names', 'person_slugs'],{
          infowindowTemplate: $('#infowindow_template_bubble').html(),
          templateType: 'mustache',
        }).model.set({
          sanitizeTemplate: function(inputHtml) {
            let $inputHtml = $(inputHtml);
            let names = $inputHtml.find('[data-person-names]').html().split(',');
            let slugs = $inputHtml.find('[data-person-slugs]').html().split(',');
            let html = "";
            names.forEach((name, i) => {
              html += `<li><a href="/personas/${slugs[i]}/viajes-y-desplazamientos?start_date=${fromDate}">${name}</a></li>`
            });

            $inputHtml.find('[data-person-names]').html(html);
            $inputHtml.find('[data-person-slugs]').html('');
            let count = $inputHtml.find('[data-count]').data('count');
            let cityName = $inputHtml.find('[data-city-name]').data('city-name');
            $inputHtml.find('p').html(`${count} ${I18n.t('gobierto_people.people.trips.trip.meeting_name', {count: count})} ${I18n.t('gobierto_people.people.trips.trip.in')} ${cityName} ${I18n.t('gobierto_people.people.trips.trip.by')}:`);
            return `<div class="cartodb-popup">${$inputHtml.html()}</div>`;
          }
        });

        map.on('zoomend', function() {
          if(map.getZoom() >= 4 && clorplethActive) {
            clorplethActive = false;
            layer.getSubLayer(0).hide();
            layer.getSubLayer(1).show();
          } else if(map.getZoom() <= 4 && !clorplethActive) {
            clorplethActive = true;
            layer.getSubLayer(1).hide();
            layer.getSubLayer(0).show();
          }
        });
      });
    });*/
}

window.GobiertoPeople.gencat_map_controller = new GobiertoPeople.GencatMapController;


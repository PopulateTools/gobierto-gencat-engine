window.GobiertoPeople.GencatMapController = (function() {
  function GencatMapController() {}

  GencatMapController.prototype.index = function(options) {
    if ($('#map').length === 0) return;

    let fromDate = options.fromDate;
    let toDate = options.toDate;
    let departmentCondition = options.departmentId || "";
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
        zoom: 3
      });
      map.scrollWheelZoom.disable();

      let choroplethCSS = `
#gobierto_gencat_trips { polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 1; line-opacity: 0.5; }
#gobierto_gencat_trips [ count <= 28] { polygon-fill: #B10026; }
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
FROM gobierto_gencat_trips
INNER JOIN world_borders ON world_borders.iso2 = country
WHERE country is not null
${dateRangeConditions}
${departmentCondition}
GROUP BY country, country_name, world_borders.the_geom, world_borders.the_geom_webmercator
`;

      let bubbleSQL = `
SELECT count(*) as count, city_name, country_name, the_geom, the_geom_webmercator, array_to_string(array_agg(DISTINCT person_name), ',') as person_names,
array_to_string(array_agg(DISTINCT person_slug), ',') as person_slugs, array_to_string(array_agg(DISTINCT destination_name), ',') as destination_names
FROM gobierto_gencat_trips
WHERE country is not null
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
        user_name: 'furilo',
        type: 'cartodb',
        https: true,
        sublayers: [{
          sql: choroplethSQL,
          cartocss: choroplethCSS
        }, {
          sql: bubbleSQL,
          cartocss: bubbleCSS
        }]
      })
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
    });
  }

  return GencatMapController;
})();

window.GobiertoPeople.gencat_map_controller = new GobiertoPeople.GencatMapController;

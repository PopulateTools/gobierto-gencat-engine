import './modules/gp_gencat_departments_controller.js'
import './modules/gp_gencat_interest_groups_controller.js'
import './modules/gp_gencat_welcome_controller.js'
import './modules/gp_gencat_common_controller.js'

$(document).on('turbolinks:load', function() {

var map = new L.Map('map', {
  center: [40.416775, -3.703790],
  zoom: 3
});

var cloroplethCSS = "\
#gobierto_gencat_trips{ polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 1; line-opacity: 0.5; }\
#gobierto_gencat_trips [ count <= 28] { polygon-fill: #B10026; } \
#gobierto_gencat_trips [ count <= 24] { polygon-fill: #E31A1C; } \
#gobierto_gencat_trips [ count <= 15] { polygon-fill: #FC4E2A; } \
#gobierto_gencat_trips [ count <= 10] { polygon-fill: #FD8D3C; } \
#gobierto_gencat_trips [ count <= 5] { polygon-fill: #FEB24C; } \
#gobierto_gencat_trips [ count <= 2] { polygon-fill: #FED976; } \
";
var bubbleCSS = "\
#gobierto_gencat_trips{ marker-fill: #EE4D5A; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } \
#gobierto_gencat_trips [ count > 18] { marker-width: 30;} \
#gobierto_gencat_trips [ count < 18] {marker-width: 25;}  \
#gobierto_gencat_trips [ count < 12] {marker-width: 20;}  \
#gobierto_gencat_trips [ count < 8] {marker-width: 15;}   \
#gobierto_gencat_trips [ count < 4] {marker-width: 10;}   \
";
var cloroplethSQL = "SELECT country, country_name, count(*) as count, world_borders.the_geom as the_geom, world_borders.the_geom_webmercator FROM gobierto_gencat_trips INNER JOIN world_borders ON world_borders.iso2 = country WHERE country is not null group by country, country_name, world_borders.the_geom, world_borders.the_geom_webmercator";
var bubbleSQL = "SELECT count(*) as count, city_name, country_name, the_geom, the_geom_webmercator FROM gobierto_gencat_trips WHERE country is not null group by city_name, country_name, the_geom, the_geom_webmercator order by count desc";
var markerSQL = "select * from gobierto_gencat_trips";
var clorplethActive = true;

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);


cartodb.createLayer(map, {
  user_name: 'furilo',
  type: 'cartodb',
  sublayers: [{
    sql: cloroplethSQL,
    cartocss: cloroplethCSS
  }]
})
.addTo(map) // add the layer to our map which already contains 1 sublayer
.done(function(layer) {
  cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['country', 'country_name', 'count'],{
    infowindowTemplate: $('#infowindow_template').html(),
    templateType: 'mustache'
  });

  map.on('zoomend', function() {
    if(map.getZoom() >= 4 && clorplethActive) {
      clorplethActive = false;
      layer.getSubLayer(0).setCartoCSS(bubbleCSS);
      layer.getSubLayer(0).setSQL(bubbleSQL);

      cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['city_name', 'country_name', 'count'],{
        infowindowTemplate: $('#infowindow_template_bubble').html(),
        templateType: 'mustache'
      });

    } else if(map.getZoom() <= 4 && !clorplethActive) {
      clorplethActive = true;
      layer.getSubLayer(0).setCartoCSS(cloroplethCSS);
      layer.getSubLayer(0).setSQL(cloroplethSQL);

      cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['country', 'count'],{
        infowindowTemplate: $('#infowindow_template').html(),
        templateType: 'mustache'
      });
    }
  });
});

});

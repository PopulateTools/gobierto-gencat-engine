window.GobiertoPeople.GencatMapController = (function() {

  function GencatMapController() {}

  GencatMapController.prototype.index = function(options) {
    $(document).ready(function() {

      var map = new L.Map('map', {
        center: [40.416775, -3.703790],
        zoom: 3
      });
      map.scrollWheelZoom.disable();

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
        },
        {
          sql: bubbleSQL,
          cartocss: bubbleCSS
        }]
      })
      .addTo(map)
      .done(function(layer) {
        layer.getSubLayer(1).hide();
        layer.getSubLayer(0).show();
        layer.getSubLayer(0).setInteraction(true);

        cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['country', 'country_name', 'count'],{
          infowindowTemplate: $('#infowindow_template').html(),
          templateType: 'mustache'
        });
        cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(1), ['city_name', 'country_name', 'count'],{
          infowindowTemplate: $('#infowindow_template_bubble').html(),
          templateType: 'mustache'
        });

        // TODO: replace infowindows by overlays
        // layer.leafletMap.viz.addOverlay({
        //   type: 'tooltip',
        //   layer: layer.getSubLayer(0),
        //   template: '{{country_name}}',
        //   position: 'bottom|right',
        //   fields: [{ country_name: 'country_name' }]
        // });

        // layer.leafletMap.viz.addOverlay({
        //   type: 'tooltip',
        //   layer: layer.getSubLayer(1),
        //   template: '{{city_name}}',
        //   position: 'bottom|right',
        //   fields: [{ city_name: 'city_name' }]
        // });

        map.on('zoomend', function() {
          if(map.getZoom() >= 4 && clorplethActive) {
            clorplethActive = false;
            layer.getSubLayer(0).hide();
            layer.getSubLayer(1).show();
            layer.getSubLayer(1).setInteraction(true);
          } else if(map.getZoom() <= 4 && !clorplethActive) {
            clorplethActive = true;
            layer.getSubLayer(1).hide();
            layer.getSubLayer(0).show();
            layer.getSubLayer(0).setInteraction(true);
          }
        });
      });

    });
  }

  return GencatMapController;
})();

window.GobiertoPeople.gencat_map_controller = new GobiertoPeople.GencatMapController;

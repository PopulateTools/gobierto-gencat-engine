function currentLocationMatches(suffix) {
  return $('#gobierto_people_' + suffix).length > 0
}

$(document).on('turbolinks:load', function() {

  window.GobiertoPeople.gencat_common_controller.load(commonControllerLoadArgs);

  window.GobiertoPeople.gencat_common_controller.updatePageHeader(
    commonControllerUpdatePageHeaderArgs
  );

  if (currentLocationMatches('welcome_index')) {
    window.GobiertoPeople.gencat_map_controller.index(mapControllerIndexParams);
    window.GobiertoPeople.gencat_welcome_controller.index(welcomeControllerIndexParams);
  }

});

function currentLocationMatches(controller_action) {
  return $("body.gobierto_people." + controller_action).length > 0
}

window.GobiertoPeople = {
  init: function() {}
};

$(document).on('turbolinks:load', function() {

  window.GobiertoPeople.gencat_common_controller.load(commonControllerLoadArgs);

  window.GobiertoPeople.gencat_common_controller.updatePageHeader({
    pageTitle: $("meta[name='page_title']").attr("content")
  });

  // The map goes last: it throws without WebGL or a Mapbox token, which would
  // stop the initialization of the rest of the page.
  if (currentLocationMatches('welcome_index')) {
    window.GobiertoPeople.gencat_welcome_controller.index(welcomeControllerIndexParams);
    window.GobiertoPeople.gencat_map_controller.index(mapControllerIndexParams);
  } else if (currentLocationMatches('interest_groups_index')) {
    window.GobiertoPeople.gencat_interest_groups_controller.index(interestGroupsIndexArgs);
  } else if (currentLocationMatches('interest_groups_show')) {
    window.GobiertoPeople.gencat_interest_groups_controller.show(interestGroupsShowArgs);
  } else if (currentLocationMatches('departments_index')) {
    window.GobiertoPeople.gencat_departments_controller.index(departmentsIndexArgs);
  } else if (currentLocationMatches('departments_show')) {
    window.GobiertoPeople.gencat_departments_controller.show(departmentsShowArgs);
    window.GobiertoPeople.gencat_map_controller.index(mapControllerIndexParams);
  }

  $(".llistat_xarxes_socials a").click(function(e) {
    e.preventDefault();
  });
});

function currentLocationMatches(controller_action) {
  return $("body.gobierto_people." + controller_action).length > 0
}

$(document).on('turbolinks:load', function() {

  window.GobiertoPeople.gencat_common_controller.load(commonControllerLoadArgs);

  window.GobiertoPeople.gencat_common_controller.updatePageHeader({
    pageTitle: $("meta[name='page_title']").attr("content")
  });

  if (currentLocationMatches('welcome_index')) {
    window.GobiertoPeople.gencat_map_controller.index(mapControllerIndexParams);
    window.GobiertoPeople.gencat_welcome_controller.index(welcomeControllerIndexParams);
  } else if (currentLocationMatches('interest_groups_index')) {
    window.GobiertoPeople.gencat_interest_groups_controller.index(interestGroupsIndexArgs);
  } else if (currentLocationMatches('interest_groups_show')) {
    window.GobiertoPeople.gencat_interest_groups_controller.show(interestGroupsShowArgs);
  } else if (currentLocationMatches('departments_index')) {
    window.GobiertoPeople.gencat_departments_controller.index(departmentsIndexArgs);
  } else if (currentLocationMatches('departments_show')) {
    window.GobiertoPeople.gencat_map_controller.index(mapControllerIndexParams);
    window.GobiertoPeople.gencat_departments_controller.show(departmentsShowArgs);
  }

  $(".llistat_xarxes_socials a").click(function(e) {
    e.preventDefault();
  });
});

import { _loadRowchart, _loadPunchcard } from './helpers.js'

window.GobiertoPeople.GencatInterestGroupsController = (function() {

  function GencatInterestGroupsController() {}

  GencatInterestGroupsController.prototype.show = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
      _loadPunchcard('#interest_group_people_events_punchcard', options.interest_group_people_events_punchcard_api_path)
    });
  };

  return GencatInterestGroupsController;
})();

window.GobiertoPeople.gencat_interest_groups_controller = new GobiertoPeople.GencatInterestGroupsController;

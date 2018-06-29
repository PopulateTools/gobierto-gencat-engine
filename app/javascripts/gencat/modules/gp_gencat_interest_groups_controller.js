import { _loadRowchart, _loadPunchcard, _reloadRowchart, setTooltipColor } from './helpers.js'

window.GobiertoPeople.GencatInterestGroupsController = (function() {

  function GencatInterestGroupsController() {}

  GencatInterestGroupsController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#interest_groups_events_rowchart', options.interest_groups_events_rowchart_api_path)
      _reloadRowchart('#interest_groups_events_rowchart', options.interest_groups_events_rowchart_api_path, 500)
    });
  };

  GencatInterestGroupsController.prototype.show = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
      _loadPunchcard('#interest_group_people_events_punchcard', options.interest_group_people_events_punchcard_api_path)

      // REVIEW: Waiting for render
      setTimeout(function () {
        setTooltipColor()
      }, 1000);
    });
  };

  return GencatInterestGroupsController;
})();

window.GobiertoPeople.gencat_interest_groups_controller = new GobiertoPeople.GencatInterestGroupsController;

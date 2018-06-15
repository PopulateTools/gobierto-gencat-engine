import { rowchart, punchcard } from 'visualizations'
import { d3 } from 'shared'

window.GobiertoPeople.GencatInterestGroupsController = (function() {

  function GencatInterestGroupsController() {}

  GencatInterestGroupsController.prototype.show = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
      _loadPunchcard('#interest_group_people_events_punchcard', options.interest_group_people_events_punchcard_api_path)
    });
  };

  function _loadRowchart(container, url) {
    $.getJSON(url, (data) => {
      data.sort((a, b) => a.value - b.value)
      rowchart(container, data);
    });
  }

  function _loadPunchcard(container, url) {
    $.getJSON(url, (data) => {
      var intervalLength = 3
      let opts = {
        title: 'Reunions per alt càrrec i mes',
        xTickFormat: (d, i, arr) => {
          let distanceFromEnd = arr.length - i - 1
          return ((distanceFromEnd % intervalLength) === 0) ? d3.timeFormat("%b %y")(d) : null
        }
      }
      punchcard(container, data, opts)
    });
  }
  return GencatInterestGroupsController;
})();

window.GobiertoPeople.gencat_interest_groups_controller = new GobiertoPeople.GencatInterestGroupsController;

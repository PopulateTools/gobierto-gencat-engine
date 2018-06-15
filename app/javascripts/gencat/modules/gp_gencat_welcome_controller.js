import { rowchart, punchcard } from 'visualizations'
import { d3 } from 'shared'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
      _loadRowchart('#interest_groups_events_rowchart', options.interest_groups_events_rowchart_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
      _loadPunchcard('#people_events_punchcard', options.department_people_events_punchcard_api_path);
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

  return GencatWelcomeController;
})();

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

import { rowchart, punchcard } from 'visualizations'
import { d3 } from 'shared'

window.GobiertoPeople.GencatDepartmentsController = (function() {

  function GencatDepartmentsController() {}

  GencatDepartmentsController.prototype.index = function() {
    _loadPunchcard();
  };

  function _loadPunchcard() {
    $(document).on('turbolinks:load', function() {

      $.getJSON("gobierto_people/api/v1/people", (data) => {
        data.sort((a, b) => a.value - b.value)
        rowchart("#people_events_rowchart", data);
      });

      $.getJSON("gobierto_people/api/v1/people?include_history=true&limit=14", (data) => {
        var intervalLength = 3
        let opts = {
          title: 'Reunions per alt càrrec i mes',
          xTickFormat: (d, i, arr) => {
            let distanceFromEnd = arr.length - i - 1
            return ((distanceFromEnd % intervalLength) === 0) ? d3.timeFormat("%b %y")(d) : null
          }
        }
        punchcard("#department_people_events_punchcard", data, opts)
      });

    });
  }

  return GencatDepartmentsController;
})();

window.GobiertoPeople.gencat_departments_controller = new GobiertoPeople.GencatDepartmentsController;

import { rowchart, punchcard } from 'visualizations'
import { d3 } from 'shared'

window.GobiertoPeople.GencatDepartmentsController = (function() {

  function GencatDepartmentsController() {}

  GencatDepartmentsController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_api_path)
    });
  }

  GencatDepartmentsController.prototype.show = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#department_people_events_rowchart', options.department_people_events_rowchart_api_path)
      _loadRowchart('#department_interest_groups_events_rowchart', options.department_interest_groups_rowchart_api_path)
      _loadPunchcard(
        '#department_people_events_punchcard',
        options.department_people_events_punchcard_api_path,
        I18n.t('gobierto_people.departments.show.punchcard_title')
      )
    });
  };

  function _loadRowchart(container, url) {
    $.getJSON(url, (data) => {
      data.sort((a, b) => a.value - b.value)
      rowchart(container, data);
    });
  }

  function _loadPunchcard(container, url, title) {
    $.getJSON(url, (data) => {
      var intervalLength = 3
      let opts = {
        title: title,
        xTickFormat: (d, i, arr) => {
          let distanceFromEnd = arr.length - i - 1
          return ((distanceFromEnd % intervalLength) === 0) ? d3.timeFormat("%b %y")(d) : null
        }
      }
      punchcard(container, data, opts)
    });
  }
  return GencatDepartmentsController;
})();

window.GobiertoPeople.gencat_departments_controller = new GobiertoPeople.GencatDepartmentsController;

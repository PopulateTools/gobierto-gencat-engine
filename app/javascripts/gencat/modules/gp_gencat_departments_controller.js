import { _loadRowchart, _loadPunchcard } from './helpers.js'

window.GobiertoPeople.GencatDepartmentsController = (function() {

  function GencatDepartmentsController() {}

  GencatDepartmentsController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#people_events_rowchart', options.people_events_api_path)
      _loadRowchart('#departments_events_rowchart', options.departments_events_api_path)
      _loadPunchcard('#department_people_events_punchcard', options.department_people_events_punchcard_api_path)
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

  return GencatDepartmentsController;
})();

window.GobiertoPeople.gencat_departments_controller = new GobiertoPeople.GencatDepartmentsController;

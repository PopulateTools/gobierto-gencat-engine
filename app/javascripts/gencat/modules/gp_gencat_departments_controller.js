import { _loadRowchart, _loadPunchcard, _reloadRowchart, setTooltipColor, setDatepickerFilters } from './helpers.js'

window.GobiertoPeople.GencatDepartmentsController = (function() {

  function GencatDepartmentsController() {}

  GencatDepartmentsController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#people_events_rowchart', options.people_events_api_path)
      _loadRowchart('#departments_events_rowchart', options.departments_events_api_path)

      _loadPunchcard('#department_people_events_punchcard', options.department_people_events_punchcard_api_path)

      _reloadRowchart('#departments_events_rowchart', options.departments_events_api_path, 10000)

      setDatepickerFilters()

      // REVIEW: Waiting for render
      setTimeout(function () {
        setTooltipColor()
      }, 1000);
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

      _reloadRowchart('#department_people_events_rowchart', options.department_people_events_rowchart_api_path, 10000)
      _reloadRowchart('#department_interest_groups_events_rowchart', options.department_interest_groups_rowchart_api_path, 10000)

      setDatepickerFilters()
      window.onload = appendFiltersEverywhere

      // REVIEW: Waiting for render
      setTimeout(function () {
        setTooltipColor()
      }, 1000);
    });
  };

  return GencatDepartmentsController;
})();

window.GobiertoPeople.gencat_departments_controller = new GobiertoPeople.GencatDepartmentsController;

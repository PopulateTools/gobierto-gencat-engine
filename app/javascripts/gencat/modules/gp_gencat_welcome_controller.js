import { _loadRowchart, _loadPunchcard, setTooltipColor, appendFiltersEverywhere } from './helpers.js'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function(options) {
    $(document).on('turbolinks:load', function() {
      _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
      _loadRowchart('#interest_groups_events_rowchart', options.interest_groups_events_rowchart_api_path)
      _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
      _loadPunchcard(
        '#people_events_punchcard',
        options.department_people_events_punchcard_api_path,
        I18n.t('gobierto_people.welcome.index.punchcard_title')
      );

      // REVIEW: Waiting for render
      setTimeout(function () {
        setTooltipColor()
      }, 1000);
    });
  };

  return GencatWelcomeController;
})();

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

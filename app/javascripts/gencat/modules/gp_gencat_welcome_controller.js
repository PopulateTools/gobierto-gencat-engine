import { rowchart, punchcard } from 'visualizations'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function() {
    _loadRowcharts();
  };

  function _loadRowcharts() {
    $(document).on('turbolinks:load', function() {

      $.getJSON("gobierto_people/api/v1/interest_groups", (data) => {
        data.sort((a, b) => a.value - b.value)
        rowchart("#interest_groups_events_rowchart", data);
      });

      $.getJSON("gobierto_people/api/v1/people", (data) => {
        data.sort((a, b) => a.value - b.value)
        rowchart("#people_events_rowchart", data);
      });

    });
  }

  return GencatWelcomeController;
})();

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

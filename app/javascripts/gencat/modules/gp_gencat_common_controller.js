import { setDatepickerFilters } from './helpers.js'

window.GobiertoPeople.GencatCommonController = (function() {

  function GencatCommonController() {}

  GencatCommonController.prototype.load = function(options) {
    $(document).on('turbolinks:load', function() {
      setDatepickerFilters(options.people_events_first_date);
    });
  };

  return GencatCommonController;
})();

window.GobiertoPeople.gencat_common_controller = new GobiertoPeople.GencatCommonController;
import { setDatepickerFilters } from './helpers.js'

window.GobiertoPeople.GencatCommonController = (function() {

  function GencatCommonController() {}

  GencatCommonController.prototype.load = function(options) {
    $(document).on('turbolinks:load', function() {
      setDatepickerFilters(options);
    });
  };

  GencatCommonController.prototype.updatePageHeader = function(options) {
    setPageTitle(options.pageTitle);
    loadBreadcrumb();
  };

  return GencatCommonController;
})();

function setPageTitle(pageTitle) {
  $("#impacteContainer h1").text(pageTitle);
}

function loadBreadcrumb() {
  // put custom breadcrumb items in place
  var $breadcrumbItems = $("#custom-breadcrumb-items").children();
  var $breadcrumb = $("#impacteContainer .breadcrumb");
  $breadcrumbItems.appendTo($breadcrumb);

  // remove link from root element if it's the current page
  var rootElementRegex = new RegExp("Agendas|Agendes");

  var $rootBreadcrumbItem = $breadcrumb.children().filter(function() {
    return rootElementRegex.test(this.innerHTML);
  });

  var $rootBreadcrumbItemAnchor = $($rootBreadcrumbItem.find("a")[0]);

  if (document.location.href == $rootBreadcrumbItemAnchor.attr("href")) {
    $rootBreadcrumbItem.replaceWith("<li>" + $rootBreadcrumbItemAnchor.text() + "</li>");
  }
}

window.GobiertoPeople.gencat_common_controller = new GobiertoPeople.GencatCommonController;

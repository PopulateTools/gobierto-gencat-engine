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

  // locate root element in breadcrumb and build its content
  var rootElementRegex = new RegExp("Agendas|Agendes");
  var $rootBreadcrumbItem = $breadcrumb.children().filter(function() {
    return rootElementRegex.test(this.innerHTML);
  });
  var rootBreadcrumbItemUrl = document.location.origin + '/cargos-y-agendas';
  var currentUrl = document.location.href.replace(/(\?|&)locale=(en|es|ca)/, '');
  var rootBreadcrumbItemText = $rootBreadcrumbItem[0].innerHTML;

  // insert link within breadcrumb root element only if we're on another page
  if (currentUrl.replace(/(\?|&)(start_date|end_date)=\d{4}-\d{2}-\d{2}/g, '') == rootBreadcrumbItemUrl) {
    $rootBreadcrumbItem.replaceWith('<li>' + rootBreadcrumbItemText + '</li>');
  } else {
    $rootBreadcrumbItem.replaceWith("<li><a href=\"" + rootUrlWithDateRange(rootBreadcrumbItemUrl, currentUrl) + "\" data-turbolinks=\"false\">" + rootBreadcrumbItemText + "</a></li>");
  }
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function rootUrlWithDateRange(baseUrl, currentUrl) {
  var startDate = getParameterByName('start_date', currentUrl);
  var endDate = getParameterByName('end_date', currentUrl);
  var urlWithParams = baseUrl;

  if (startDate && endDate) {
    urlWithParams += ('?end_date=' + endDate + '&start_date=' + startDate);
  } else if (startDate) {
    urlWithParams += ('?start_date=' + startDate);
  } else if (endDate) {
    urlWithParams += ('?end_date=' + endDate);
  }

  return urlWithParams;
}

window.GobiertoPeople.gencat_common_controller = new GobiertoPeople.GencatCommonController;

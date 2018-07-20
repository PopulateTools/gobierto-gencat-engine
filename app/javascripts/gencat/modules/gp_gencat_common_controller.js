import { setDatepickerFilters } from './helpers.js'

window.GobiertoPeople.GencatCommonController = (function() {

  function GencatCommonController() {}

  GencatCommonController.prototype.load = function(options) {
    setDatepickerFilters(options);
  };

  GencatCommonController.prototype.updatePageHeader = function(options) {
    setPageTitle(options.pageTitle);
    loadBreadcrumb();
    appendDateRangeToLocaleLinks();
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
  var appTitles = ['es', 'en', 'ca'].map(function(x) {
    return I18n.t("gobierto_people.shared.app_title", { locale: x })
  });
  var rootElementRegex = new RegExp(appTitles.join('|'));
  var $rootBreadcrumbItem = $breadcrumb.children().filter(function() {
    return rootElementRegex.test(this.innerHTML);
  });
  var rootBreadcrumbItemUrl = document.location.origin + '/cargos-y-agendas';
  var currentUrl = document.location.href.replace(/(\?|&)locale=(en|es|ca)/, '');

  // insert link within breadcrumb root element only if we're on another page
  if (currentUrl.replace(/(\?|&)(start_date|end_date)=\d{4}-\d{2}-\d{2}/g, '') == rootBreadcrumbItemUrl) {
    $rootBreadcrumbItem.replaceWith('<li>' + I18n.t("gobierto_people.shared.app_title") + '</li>');
  } else {
    $rootBreadcrumbItem.replaceWith("<li><a href=\"" + appendDateRangeParamsToUrl(rootBreadcrumbItemUrl, currentUrl) + "\" data-turbolinks=\"false\">" + I18n.t("gobierto_people.shared.app_title") + "</a></li>");
  }
}

function appendDateRangeToLocaleLinks() {
  $(".idioma li a").each(function(index) {
    this.href = appendDateRangeParamsToUrl(this.href, document.location.href);
  });
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

function appendDateRangeParamsToUrl(baseUrl, currentUrl) {
  var startDate = getParameterByName('start_date', currentUrl);
  var endDate = getParameterByName('end_date', currentUrl);
  var urlWithParams = baseUrl;

  if (startDate) {
    urlWithParams = appendUrlParam(urlWithParams, "start_date", startDate);
  }
  if (endDate) {
    urlWithParams = appendUrlParam(urlWithParams, "end_date", endDate);
  }

  return urlWithParams;
}

function appendUrlParam(url, paramName, paramValue) {
  var separator = (url.indexOf('?') > -1) ? '&' : '?';
  return (url + separator + paramName + '=' + paramValue);
}

window.GobiertoPeople.gencat_common_controller = new GobiertoPeople.GencatCommonController;

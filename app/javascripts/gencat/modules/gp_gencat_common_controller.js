import { setDatepickerFilters, appendUrlParam } from './helpers.js'

window.GobiertoPeople.GencatCommonController = (function() {

  function GencatCommonController() {}

  GencatCommonController.prototype.load = function(options) {
    setDatepickerFilters(options);

    const containerFixed = document.querySelectorAll('.js-container-fixed')
    if (containerFixed.length) {
      containerFixed.forEach(element => {
        const { offsetTop } = element;
        const originalNode = $(element).find("p")

        window.addEventListener("scroll", () => onScroll.call(this, element, offsetTop, originalNode))
      });
    }
  };

  GencatCommonController.prototype.updatePageHeader = function(options) {
    setPageTitle(options.pageTitle);
    loadBreadcrumb();
    appendDateRangeToLocaleLinks();
  };

  return GencatCommonController;
})();

function onScroll(element, offsetTop, node) {
  if (window.pageYOffset > offsetTop && !element.classList.contains("container-fixed")) {
    element.classList.add("container-fixed")
    $(element).find("p").replaceWith(`<p>${I18n.t("gobierto_people.shared.datepicker_fixed")}</p>`);
    $(element).children().wrapAll('<div class="container"><div class="row"></div></div>')
  } else if (window.pageYOffset < offsetTop && element.classList.contains("container-fixed")) {
    element.classList.remove("container-fixed")
    $(element).find("p").replaceWith(node)
    $(element).find("[class*='col-']").unwrap().unwrap()
  }
}

function setPageTitle(pageTitle) {
  $("#impacteContainer h1").text(pageTitle);
}

function loadBreadcrumb() {
  var appTitle = I18n.t("gobierto_people.shared.app_title");
  var $breadcrumb = $("#impacteContainer .breadcrumb");
  var $breadcrumbItems = $("#custom-breadcrumb-items").children();

  // put custom breadcrumb items in place
  $breadcrumbItems.appendTo($breadcrumb);

  // locate root element in breadcrumb and build its content
  var appTitles = ['es', 'en', 'ca'].map(function(x) {
    return I18n.t("gobierto_people.shared.app_title", { locale: x })
  });
  var rootElementRegex = new RegExp(appTitles.join('|'));
  var $rootBreadcrumbItem = $breadcrumb.children().filter(function() {
    return rootElementRegex.test(this.innerHTML.replace("’", "'"));
  });
  var rootBreadcrumbItemUrl = document.location.origin + '/cargos-y-agendas';
  var currentUrl = document.location.href.replace(/(\?|&)locale=(en|es|ca)/, '');

  // insert link within breadcrumb root element only if we're on another page
  if (currentUrl.replace(/(\?|&)(start_date|end_date)=\d{4}-\d{2}-\d{2}/g, '') == rootBreadcrumbItemUrl) {
    $rootBreadcrumbItem.replaceWith('<li>' + appTitle + '</li>');
  } else {
    $rootBreadcrumbItem.replaceWith("<li><a href=\"" + appendDateRangeParamsToUrl(rootBreadcrumbItemUrl, currentUrl) + "\" data-turbolinks=\"false\">" + appTitle + "</a></li>");
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

window.GobiertoPeople.gencat_common_controller = new GobiertoPeople.GencatCommonController;

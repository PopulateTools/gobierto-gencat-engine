import * as d3 from 'd3';
import { toArray } from 'lodash';
import { d3locale } from '../../lib/shared';
import { Punchcard, Rowchart } from '../../lib/visualizations';

function _loadRowchart(container, url) {
  $.getJSON(url, (data) => {
    let opts = {
      tooltipContainer: ".theme-gencat",
      tooltipContent: (d) =>
        d.value.toLocaleString() +
        (d.value === 1
          ? ` ${I18n.t("gobierto_people.shared.meetings_rowchart.tooltip_single")}`
          : ` ${I18n.t("gobierto_people.shared.meetings_rowchart.tooltip")}`),
    };

    data.sort((a, b) => a.value - b.value)
    new Rowchart(container, data, opts);

    // tweak axis
    $(container).find(".axis").removeAttr("font-size").removeAttr("font-family")
  });
}

function _loadPunchcard(container, url, title) {
  $.getJSON(url, (data) => {
    let opts = {
      title: title,
      tooltipContainer: ".theme-gencat",
      tooltipContent: (d) =>
        d.value.toLocaleString() +
        (d.value === 1
          ? ` ${I18n.t("gobierto_people.shared.meetings_punchcard.tooltip_single")}`
          : ` ${I18n.t("gobierto_people.shared.meetings_punchcard.tooltip")}`),
      xTickFormat: (d, i, arr) => {
        let intervalLength = arr.length > 12 ? 3 : arr.length > 5 ? 2 : 1;
        let distanceFromEnd = arr.length - i - 1;

        d3.timeFormatDefaultLocale(d3locale[I18n.locale]);
        return distanceFromEnd % intervalLength === 0 ? d3.timeFormat("%b %y")(d) : null;
      },
    };

    // tweak on small devices
    const breakpoint = 568
    if (window.matchMedia(`(max-width: ${breakpoint}px)`).matches || document.documentElement.clientWidth < breakpoint) {
      opts = { ...opts, width: breakpoint, gutter: 15 }
    }

    // data.reverse to show it as it was received
    // https://stackoverflow.com/questions/23849680/d3-y-scale-y-vs-height
    new Punchcard(container, data.reverse(), opts)

    // tweak axis
    $(container).find(".axis").removeAttr("font-size").removeAttr("font-family")
  });
}

function appendUrlParam(url, paramName, paramValue) {
  var separator = (url.indexOf('?') > -1) ? '&' : '?';
  return (url + separator + paramName + '=' + paramValue);
}

function getHTMLContent(data, template, emptyTemplate = I18n.t("gobierto_people.shared.noresults")) {
  return !data.length ? emptyTemplate : data.map((d) => template(d)).join("");
}

function lookUp(term, value) {
  if (!term) {
    return false
  }
  // IE11 polyfill for normalize
  if (!String.prototype.normalize) {
    return normalize(term).replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalize(value).replace(/[\u0300-\u036f]/g, "").toLowerCase())
  }

  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
  return term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
}

// special sort based on position property
function getSortingKey(value, keysToBeSorted = []) {
  for (let index = 0; index < keysToBeSorted.length; index++) {
    const element = keysToBeSorted[index];

    if (element.test(value)) {
      return index
    }
  }

  return keysToBeSorted.length
}

// issues
function setTooltipColor() {
  if (phantomJsDetected()) { return; }

  $(".graph-tooltip").each(function (e,r,t,y,u) {
    // get id chart from tooltip chart
    const chart = document.getElementById(this.id.split("-tooltip")[0])
    // look for its color-X dependency through its parents
    const classElement = chart.closest("[class*=color-]")
    // get color class name
    const className = toArray(classElement.classList).filter(c => c.includes("color-")).toString()
    // set it up to the related tooltip
    $(this).addClass(className)
  })
}

function _reloadRowchart(container, url, maxElements) {
  var $rowchartWrapper = $(container).closest('.js-rowchart-component');
  var container = container;

  // update `limit` URL parameter
  if (url.indexOf('limit=') > -1) {
    var url = url.replace(/limit=\d+/, 'limit=' + maxElements);
  } else if (url.indexOf('?') > -1) {
    var url = url + '&limit=' + maxElements;
  } else {
    var url = url + '?limit=' + maxElements;
  }

  $rowchartWrapper.find('.js-reload-rowchart-wrapper').find('a').click(function(e) {
    e.preventDefault();
    $rowchartWrapper.find('.box').removeAttr("style")
    $rowchartWrapper.find('.rowchart').empty();
    _loadRowchart(container, url);
    $rowchartWrapper.find('.js-reload-rowchart-wrapper').hide();
  });
}

function customFormat(date) {
  // YYYY-MM-DD
  return date.toISOString().split("T")[0]
};

function subtractMonths(date, months) {
  date.setMonth(date.getMonth() - months);
  return date;
};

function setDatepickerFilters(opts) {
  // parse opts
  const minDate = opts.people_events_first_date
  const startDate = opts.people_events_filter_start_date
  const endDate = opts.people_events_filter_end_date
  const $container = $('.js-datepicker-container')
  const $datepicker = $('#datepicker')
  const dp = $datepicker.datepicker({
    showEvent: 'none',
    multipleDatesSeparator: ' · ',
    range: true,
    language: I18n.locale,
    dateFormat: 'd M yyyy',
    autoClose: true,
    showOtherMonths: false,
    offset: -1,
    prevHtml: '<span class="ui-icon-circle-triangle-w"></span>',
    nextHtml: '<span class="ui-icon-circle-triangle-e"></span>',
    onSelect: function(fd, date) {
      // Update only if there's a range
      if (date.length !== 2) return

      let dates = date.map((i) => customFormat(i))

      if (URLSearchParams) {
        const params = new URLSearchParams(location.search);
        params.set('start_date', dates[0]);
        params.set('end_date', dates[1]);
        window.history.pushState({}, '', `${location.pathname}?${params}`);
      } else {
        // IE 10+
        updateQueryStringParam('start_date', dates[0])
        updateQueryStringParam('end_date', dates[1])
      }

      // Load new params
      location.assign(location.href)
    }
  }).data('datepicker')

  // Hack datepicker position
  const $datepickerwidget = $('#datepickers-container')
  $datepickerwidget.appendTo('.theme-gencat')
  $datepickerwidget.find('.datepicker').width($container.width() - 2)

  // init dates
  const from = new Date(startDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const to = endDate
    ? new Date(endDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : I18n.t("gobierto_people.shared.datepicker.today");
  $datepicker.val(`${from} · ${to}`)

  $datepicker.click(function (e) {
    $container.toggleClass('is-shown')
    e.stopPropagation()
  })
  $(window).click(function (e) {
    if ($container.hasClass('is-shown')) {
      $container.removeClass('is-shown')
    }
  })

  // onClick to display datepicker
  $('.datepicker-defaults a#range').click(function () {
    dp.show()
    $datepicker.focus()
    $datepicker.val('')
    $container.toggleClass('is-shown')
  })

  // onClick for default filters
  $('.datepicker-defaults a:not(#range)').click(function () {
    let date = undefined

    switch (this.id) {
      case '1m':
        date = subtractMonths(new Date(), 1)
        break;
      case '3m':
        date = subtractMonths(new Date(), 3)
        break;
      case '1y':
        date = subtractMonths(new Date(), 12)
        break;
      case 'all':
        date = minDate && new Date(minDate)
        break;
      default:
    }

    // format
    if (date) {
      date = customFormat(date)
    }

    if (!phantomJsDetected() && URLSearchParams) {
      const params = new URLSearchParams(location.search);
      (date) ? params.set('start_date', date) : params.delete('start_date')
      params.delete('end_date');
      window.history.pushState({}, '', `${location.pathname}?${params}`);
    } else {
      // IE 10+ || PhantomJS
      updateQueryStringParam("start_date", date)
      updateQueryStringParam("end_date", undefined)
    }

    // Load new params
    location.assign(location.href)
  })
}

// Fallback IE
const updateQueryStringParam = (key, value) => {
    let baseUrl = [location.protocol, '//', location.host, location.pathname].join('')
    let urlQueryString = document.location.search
    let newParam = key + '=' + value
    let params = '?' + newParam

    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        var updateRegex = new RegExp('([\?&])' + key + '[^&]*');
        var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

        if ( typeof value == 'undefined' || value == null || value == '' ) { // Remove param if value is empty
            params = urlQueryString.replace(removeRegex, "$1");
            params = params.replace( /[&;]$/, "" );

        } else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
            params = urlQueryString.replace(updateRegex, "$1" + newParam);

        } else { // Otherwise, add it to end of query string
            params = urlQueryString + '&' + newParam;
        }
    }

    // no parameter was set so we don't need the question mark
    params = params == '?' ? '' : params;

    window.history.pushState({}, "", baseUrl + params);
};

// Fallback IE
const normalize = str => {
  var from = "1234567890ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç ‘/&().!,'",
      to = "izeasgtogoAAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc_______",
      mapping = {};

  for (let i = 0, j = from.length; i < j; i++) {
    mapping[from.charAt(i)] = to.charAt(i);
  }

  var ret = [];
  for (let i = 0, j = str.length; i < j; i++) {
    var c = str.charAt(i);
    if (Object.prototype.hasOwnProperty.call(mapping, str.charAt(i))) {
      ret.push(mapping[c]);
    } else {
      ret.push(c);
    }
  }

  return ret.join('').toLowerCase();
}

function phantomJsDetected() {
  return (window.callPhantom || window._phantom);
}

export { _loadPunchcard, _loadRowchart, _reloadRowchart, appendUrlParam, getHTMLContent, getSortingKey, lookUp, subtractMonths, setDatepickerFilters, setTooltipColor };

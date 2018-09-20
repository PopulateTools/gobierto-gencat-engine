import { rowchart, punchcard } from 'visualizations'
import { d3, moment, d3locale } from 'shared'

function _loadRowchart(container, url) {
  $.getJSON(url, (data) => {
    let opts = {
      tooltipContainer: ".theme-gencat",
      tooltipContent: {
        eval: "d.value.toLocaleString() + ' " + I18n.t('gobierto_people.shared.open_data_footer.meetings') + "'"
      },
    }

    data.sort((a, b) => a.value - b.value)
    rowchart(container, data, opts);
  });
}

function _loadPunchcard(container, url, title) {
  $.getJSON(url, (data) => {
    let opts = {
      title: title,
      tooltipContainer: ".theme-gencat",
      tooltipContent: {
        eval: "d.value.toLocaleString() + ' " + I18n.t('gobierto_people.shared.open_data_footer.meetings') + "'"
      },
      xTickFormat: (d, i, arr) => {
        let intervalLength = (arr.length > 12) ? 3 : (arr.length > 5) ? 2 : 1
        let distanceFromEnd = arr.length - i - 1

        d3.timeFormatDefaultLocale(d3locale[I18n.locale])
        return ((distanceFromEnd % intervalLength) === 0) ? d3.timeFormat("%b %y")(d) : null
      }
    }

    // filter data up to 18m back
    let mostRecentDate = _.max(_.map(_.flatten(_.concat(_.map(data, 'value'))), 'key'))
    for (var i = 0; i < data.length; i++) {
      data[i].value = data[i].value.filter((i) => moment(i.key).isAfter(moment(mostRecentDate).subtract(18, 'months')))
    }

    // data.reverse to show it as it was received
    // https://stackoverflow.com/questions/23849680/d3-y-scale-y-vs-height
    punchcard(container, data.reverse(), opts)

    // tweak axis
    $(container).find(".axis").removeAttr("font-size").removeAttr("font-family")
  });
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
    const className = _.toArray(classElement.classList).filter(c => c.includes("color-")).toString()
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

function setDatepickerFilters(opts) {
  // parse opts
  const minDate = opts.people_events_first_date
  const startDate = opts.people_events_filter_start_date
  const endDate = opts.people_events_filter_end_date

  // Set locale to language site
  moment.locale(I18n.locale)

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

      let dates = date.map((i) => moment(i).format('YYYY-MM-DD'))

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
  // TODO: no inicializar si hay params en la queryString
  $datepicker.val(`${moment(startDate).format('D MMM YYYY')} · ${(endDate) ? moment(endDate).format('D MMM YYYY') : moment().calendar().split(' ')[0]}`)

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
    let params = window.location.search
    let date = undefined

    switch (this.id) {
      case '1m':
        date = moment().subtract(1, 'month')
        break;
      case '3m':
        date = moment().subtract(3, 'month')
        break;
      case '1y':
        date = moment().subtract(1, 'year')
        break;
      case 'all':
        date = moment(minDate)
        break;
      default:
    }

    // format
    if (date) {
      date = date.format('YYYY-MM-DD')
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

        if( typeof value == 'undefined' || value == null || value == '' ) { // Remove param if value is empty
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

function phantomJsDetected() {
  return (window.callPhantom || window._phantom);
}

export { _loadRowchart, _loadPunchcard, _reloadRowchart, setTooltipColor, setDatepickerFilters }

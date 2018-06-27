import { rowchart, punchcard } from 'visualizations'
import { d3, moment } from 'shared'

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
    var intervalLength = 3
    let opts = {
      title: title,
      tooltipContainer: ".theme-gencat",
      tooltipContent: {
        eval: "d.value.toLocaleString() + ' " + I18n.t('gobierto_people.shared.open_data_footer.meetings') + "'"
      },
      xTickFormat: (d, i, arr) => {
        let distanceFromEnd = arr.length - i - 1
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
  });
}

function setTooltipColor() {
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

  $rowchartWrapper.find('.js-reload-rowchart-wrapper').find('.show-more').click(function(e) {
    e.preventDefault();
    $rowchartWrapper.find('.box').removeAttr("style")
    $rowchartWrapper.find('.rowchart').empty();
    _loadRowchart(container, url);
    $rowchartWrapper.find('.js-reload-rowchart-wrapper').hide();
  });
}

function setDatepickerFilters() {
  // test if there is previous filter selected
  window.onload = function () {
    if (localStorage.getItem('filter-selected')) {
      $('.datepicker-container input').val(localStorage.getItem('filter-selected'))
    }
  }

  // onClick for default filters
  $('.datepicker-defaults a').click(function () {
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
        date = false
        break;
      default:
    }

    $('.datepicker-container input').val($(this).text())
    localStorage.setItem('filter-selected', $(this).text());

    // format
    if (date) {
      date = date.format('YYYY-MM-DD')
    }

    // update `start_date` URL parameter
    if (params.indexOf('start_date=') > -1) {
      params = params.replace(/start_date=[^\&]+/, `start_date=${date}`);
    } else if (params.indexOf('?') > -1) {
      params = `&start_date=${date}`;
    } else {
      params = `?start_date=${date}`;
    }

    window.location.search = params
  })
}

// const getParams = query => {
//   if (!query) {
//     return { };
//   }
//
//   return (/^[?#]/.test(query) ? query.slice(1) : query)
//     .split('&')
//     .reduce((params, param) => {
//       let [ key, value ] = param.split('=');
//       params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
//       return params;
//     }, { });
// };
//
// const updateAllLinks = (who, what) => {
//   $('a').each(function() {
//     let href = $(this).attr('href')
//
//     if (href && href.startsWith("/")) {
//     // if ((href) && (href.startsWith("/") || href.includes(window.location.host))) {
//       if (href.indexOf(`${who}=`) > -1) {
//         href += href.replace(/start_date=\d+/, `${who}=${what}`)
//       } else if (href.indexOf('?') > -1) {
//         href += `&${who}=${what}`
//       } else {
//         href += `?${who}=${what}`
//       }
//
//       $(this).attr('href', href);
//     }
//   });
// }
//
// function appendFiltersEverywhere(who, what) {
//   // update all links
//   let q = window.location.search
//   if (q) {
//     let qs = getParams(q)
//     for (var param in qs) {
//       updateAllLinks(param, qs[param])
//     }
//   }
// }

export { _loadRowchart, _loadPunchcard, _reloadRowchart, setTooltipColor, setDatepickerFilters }

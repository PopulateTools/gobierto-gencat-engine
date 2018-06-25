import { rowchart, punchcard } from 'visualizations'
import { d3, moment } from 'shared'

function _loadRowchart(container, url) {
  $.getJSON(url, (data) => {
    let opts = {
      tooltipContainer: ".theme-gencat"
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
      tooltipContainer: "theme-gencat",
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

    punchcard(container, data, opts)
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

export { _loadRowchart, _loadPunchcard, setTooltipColor }

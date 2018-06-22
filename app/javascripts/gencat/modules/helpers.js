import { rowchart, punchcard } from 'visualizations'
import { d3, moment } from 'shared'

function _loadRowchart(container, url) {
  $.getJSON(url, (data) => {
    data.sort((a, b) => a.value - b.value)
    rowchart(container, data);
  });
}

function _loadPunchcard(container, url, title) {
  $.getJSON(url, (data) => {
    var intervalLength = 3
    let opts = {
      title: title,
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

export { _loadRowchart, _loadPunchcard }

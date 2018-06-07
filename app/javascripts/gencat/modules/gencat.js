import { rowchart, punchcard } from 'visualizations'

$.getJSON("/rowchart.json", (data) => {

  // preprocess the data
  data.sort((a, b) => a.value - b.value)

  $(".rowchart").each((i, container) => {
    rowchart(`#${container.id}`, data)
  })
});

$.getJSON("/punchcard.json", (data) => {

  // preprocess data sample
  for (var i = 0; i < data.length; i++) {

    // reduce data, group by month
    let nest = d3.nest()
      .key(d => d3.timeMonth((new Date(d.key))))
      .rollup(d => _.sumBy(d, 'value'))
      .entries(data[i].value)
      .map(g => {
        g.key = d3.timeMonth(new Date(d3.timeFormat("%Y/%m/%d")(new Date(g.key))))
        return g
      })

    // update original data
    data[i].value = nest
  }

  // edit options
  let opts = {
    title: 'Reunions per alt càrrec i mes',
    xTickFormat: (d, i, arr) => ((arr.length + i) % 3) ? null : d3.timeFormat("%b %y")(d)
  }

  $(".punchcard").each((i, container) => {
    punchcard(`#${container.id}`, data, opts)
  })
});

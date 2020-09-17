import { getHTMLContent, appendUrlParam, lookUp } from './helpers.js'
import { Areachart } from 'lib/visualizations'
import { timeFormat } from 'd3-time-format'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function(options) {
    const inputSearch = document.querySelector(".js-search")
    setSearchBoxes(inputSearch, options.people_activities_api_path)

    const departmentBoxes = document.querySelector(".js-department-squares")
    setDepartmentBoxes(departmentBoxes, options.departments_events_rowchart_api_path)
  };

  return GencatWelcomeController;
})();

function setSearchBoxes(element, url) {
  // notice "name, position" are properties of the API response object
  const template = `
    <li>
      <div class="box--result" data-url="{{ url }}" data-name="{{ name }}">
        <strong>{{ name }}</strong>
        {{ filtered_positions_html }}
      </div>
    </li>
  `;

  const emptyTemplate = `<div class="box--result">${I18n.t("gobierto_people.shared.noresults")}</div>`;

  const $target = $(element).siblings(".js-search-target");
  const $button = $(element).siblings(".js-search-button");
  const activeClass = "is-active"

  let data = []

  const navigate = () => {
    if (element.value && element.url) {
      location.href = element.url
    }
  }

  element.value = ""; // reset searchbox

  // get initial data
  const endpoint = appendUrlParam(url, "limit", 1000)
  $.getJSON(endpoint, response => (data = response))

  // search on input type values
  element.addEventListener("input", e => {
    const { value } = e.target

    if (value.length) {
      const filterData = data.filter(d => lookUp(d.name, value) || lookUp(d.fitered_positions_str, value))

      // get DOM content
      const html = getHTMLContent(filterData, template, emptyTemplate)
      // enable list
      $target.addClass(activeClass)
      // clean previous content
      $target.children().remove()
      // add new content
      $target.append(`<ul>\n${html}</ul>\n`)

      // add the listeners once in DOM
      const $lis = $target.find("li");
      $lis.each((_, li) => li.addEventListener("click", e => {
        const { dataset: { name, url } } = e.target
        element.value = name
        element.url = url

        navigate()
      }));
    } else {
      $target.removeClass(activeClass) // hide list
    }
  })

  // open url if there's value set
  $button.on("click", navigate)

  // enable results on input focus
  element.addEventListener("focus", () => element.value.length ? $target.addClass(activeClass) : null)

  // postpone event to allow input event set the values, then disable results
  element.addEventListener("focusout", () => setTimeout(() => $target.removeClass(activeClass), 250))

  // allow keyboard interactions
  element.addEventListener("keydown", e => {
    if ([13, 38, 40].includes(e.keyCode)) {
      const results = $target.find("li > *").toArray()
      const anyActiveIndex = results.findIndex(res => res.classList.contains(activeClass))
      let index = anyActiveIndex !== -1 ? anyActiveIndex : 0;

      // arrow up, and down
      if (e.keyCode === 38 || e.keyCode === 40) {
        index = e.keyCode === 38 ? anyActiveIndex - 1 : e.keyCode === 40 ? anyActiveIndex + 1 : 0

        if (index < 0) {
          index = results.length - 1
        }

        if (index >= results.length) {
          index = 0
        }

        // remove all possible active class
        results.forEach(res => res.classList.remove(activeClass))
        // add active to the following item
        results[index].classList.add(activeClass)
      }

      // enter
      if (e.keyCode === 13) {
        const { dataset: { name, url } } = results[index]
        element.value = name
        element.url = url

        $target.removeClass(activeClass) // hide list

        navigate()
      }

    }
  })
}

function setDepartmentBoxes(element, url) {
  // notice that "key, value & properties" are properties of the API response object
  const template = `
    <div class="square" data-key="{{ key }}">
      <div class="square--inner">
        <div class="square--content">
          <div class="square--content-inner">
            <a href="{{ properties.url }}">
              <h1 class="square--title"><strong>{{ key }}</strong></h1>
            </a>
            <div class="square--subtitle">{{ value.reduce(function(a, b) { return a + b.value }, 0) }} {{ value.reduce(function(a, b) { return a + b.value }, 0) === 1 ? '${I18n.t("gobierto_people.welcome.index.meetings_box_title_single")}' : '${I18n.t("gobierto_people.welcome.index.meetings_box_title")}' }}</div>
            <div class="square--chart bottom"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const emptyTemplate = `<div class="col-md-12">${I18n.t("gobierto_people.shared.noresults")}</div>`;

  // get initial data
  const endpoint = appendUrlParam(appendUrlParam(url, "limit", 1000), "include_history", true)
  $.getJSON(endpoint, response => {
    const data = response

    data.sort((a, b) => a.key < b.key ? -1 : 1)

    // get DOM content
    const html = getHTMLContent(data, template, emptyTemplate)
    // add new content
    $(element).append(html)

    const squares = element.children
    squares.forEach((square, i) => {
      const { dataset: { key } } = square
      const squareData = data.find(d => d.key === key)

      const ctx = square.querySelector(".square--chart")
      const tooltip = d => {
        let date = (d.key || "").toLocaleDateString(I18n.locale, { year: 'numeric', month: 'long' }).replace(" de ", " ")
        date = date.charAt(0).toUpperCase() + date.slice(1)
        const text = d.value === 1 ? I18n.t("gobierto_people.welcome.index.meetings_box_title_single") : I18n.t("gobierto_people.welcome.index.meetings_box_title")
        return (`
          <div class="square--tooltip">
            <div>${date}</div>
            <div>${d.value || 0} ${text}</div>
          </div>
        `)
      };

      const parsedData = squareData.value.map(d => ({ ...d, key: new Date(d.key) }))

      new Areachart({
        ctx,
        data: parsedData,
        tooltip,
        circleSize: 2.5,
        minValue: -5,
        xTickFormat: (d, i, arr) => {
          const ticks = 3
          const intervalLength = Math.floor(arr.length / ticks)
          const distanceFromEnd = arr.length - i - 1

          // Never add first tick
          if (i === 0 && arr.length !== 1) return null
          // Always add ticks if very few
          if (arr.length < ticks) return timeFormat("%b %y")(d)
          // From last one, add ticks by interval
          if ((distanceFromEnd % intervalLength) === 0) return timeFormat("%b %y")(d)

          return null
        }
      })
    });
  })
}

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

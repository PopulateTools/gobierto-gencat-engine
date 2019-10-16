import { addListContent, appendUrlParam } from './helpers.js'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function(options) {
    const inputSearch = document.querySelector(".js-search")
    setSearchBoxes(inputSearch, options.people_events_rowchart_api_path)


    const departmentBoxes = document.querySelector(".js-department-squares")
    setDepartmentBoxes(options.departments_events_rowchart_api_path)

    // _loadRowchart('#departments_events_rowchart', options.departments_events_rowchart_api_path)
    // _loadRowchart('#interest_groups_events_rowchart', options.interest_groups_events_rowchart_api_path)
    // _loadRowchart('#people_events_rowchart', options.people_events_rowchart_api_path)
    // _loadPunchcard(
    //   '#people_events_punchcard',
    //   options.department_people_events_punchcard_api_path,
    //   I18n.t('gobierto_people.welcome.index.punchcard_title')
    // );

    // // REVIEW: Waiting for render
    // setTimeout(function () {
    //   setTooltipColor()
    // }, 1000);
  };

  return GencatWelcomeController;
})();

function setSearchBoxes(element, url) {
  const template = `<div class="box--result" data-url="{{ url }}" data-name="{{ name }}"><strong>{{ name }}</strong><span>{{ position }}</span></div>`;
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
      const filterData = data.filter(d => d.name.toLowerCase().includes(value.toLowerCase()))

      $target.addClass(activeClass) // display list

      addListContent($target, filterData, template, emptyTemplate)

      // add the listeners once is DOM
      const $lis = $target.find("li");
      $lis.each((_, li) => li.addEventListener("click", e => {
        const { dataset: { name, url } } = e.target
        element.value = name
        element.url = url
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
        navigate() // navigate before setting the url to avoid be redirected directly

        const { dataset: { name, url } } = results[index]
        el.value = name
        el.url = url

        $target.removeClass(activeClass) // hide list
      }

    }
  })
}

function setDepartmentBoxes(url) {
      const template = `
        <div class="square">
          <div class="square--inner">
            <div class="square--content">
              <div class="square--content-inner">
                <h1 class="square--title">{{ name }}</h1>
                <span class="square--subtitle">{{ count }} en total </span>
                <div class="square--chart bottom">--/\-</div>
              </div>
            </div>
          </div>
        </div>
      `

      let data = []

      // get initial data
      let endpoint = appendUrlParam(url, "limit", 1000)
      endpoint = appendUrlParam(url, "include_history", true)
      $.getJSON(endpoint, response => (data = response))
}

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

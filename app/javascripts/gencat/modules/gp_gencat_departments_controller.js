import { _loadRowchart, _loadPunchcard, _reloadRowchart, setTooltipColor, appendUrlParam, getHTMLContent, getSortingKey } from './helpers.js'

window.GobiertoPeople.GencatDepartmentsController = (function() {

  function GencatDepartmentsController() {}

  GencatDepartmentsController.prototype.index = function(options) {
    _loadRowchart('#people_events_rowchart', options.people_events_api_path)
    _loadRowchart('#departments_events_rowchart', options.departments_events_api_path)

    _loadPunchcard('#department_people_events_punchcard', options.department_people_events_punchcard_api_path, I18n.t('gobierto_people.departments.index.punchcard_title'))

    _reloadRowchart('#departments_events_rowchart', options.departments_events_api_path, 10000)
    _reloadRowchart('#people_events_rowchart', options.people_events_api_path, 10000)

    // REVIEW: Waiting for render
    setTimeout(function () {
      setTooltipColor()
    }, 1000);
  }

  GencatDepartmentsController.prototype.show = function(options) {
    const peopleBoxes = document.querySelector(".js-people-rectangles")
    setPeopleBoxes(peopleBoxes, options.department_people_events_rowchart_api_path)
  };

  return GencatDepartmentsController;
})();

function setPeopleBoxes(element, url) {
    // notice that "key, value & url" are properties of the API response object
    const template = `
      <div class="rectangle">
        <div class="rectangle--inner">
          <div class="rectangle--content">
            <div class="rectangle--content-inner">
              <a href="{{ url }}">
                <h1 class="rectangle--title"><strong>{{ name }}</strong></h1>
              </a>
              <div class="rectangle--subtitle">
                {{ position }}
              </div>
              <div class="rectangle--tooltip tipsit-n bottom" title="<div class='tooltip-content'>{{ filtered_positions_tooltip }}</div>">
                ${I18n.t("gobierto_people.shared.view_charges")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const emptyTemplate = `<div class="col-md-12">${I18n.t("gobierto_people.shared.noresults")}</div>`;

    // get initial data
    const endpoint = appendUrlParam(url, "limit", 1000)
    $.getJSON(endpoint, response => {
      const data = response

      const sortingKeys = [
        new RegExp(/\bconseller[a]?/, "i"),
        new RegExp(/\bviceconseller[a]?/, "i"),
        new RegExp(/\bsecret[a|à]ri[a]? general/, "i"),
        new RegExp(/\bsecret[a|à]ri[a]?/, "i"),
        new RegExp(/\bdirector[a]?/, "i"),
        new RegExp(/\bdelega? /, "i")
      ]
      data.sort((a, b) => getSortingKey(a.position, sortingKeys) - getSortingKey(b.position, sortingKeys))

      // get DOM content
      const html = getHTMLContent(data, template, emptyTemplate)
      // add new content
      $(element).append(html)
    })
}

window.GobiertoPeople.gencat_departments_controller = new GobiertoPeople.GencatDepartmentsController;

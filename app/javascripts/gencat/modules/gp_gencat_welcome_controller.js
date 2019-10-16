import { addListContent, appendUrlParam } from './helpers.js'

window.GobiertoPeople.GencatWelcomeController = (function() {

  function GencatWelcomeController() {}

  GencatWelcomeController.prototype.index = function(options) {
    const $inputs = $("input.js-search")
    const template = `<div class="box--result" data-url="{{ url }}" data-name="{{ name }}"><strong>{{ name }}</strong><span>{{ position }}</span></div>`;
    const emptyTemplate = `<div class="box--result">${I18n.t("gobierto_people.shared.noresults")}</div>`;

    let data = []
    $inputs.each((_, el) => {
      const $target = $(el).siblings(".js-search-target");
      const $button = $(el).siblings(".js-search-button");
      const activeClass = "is-active"

      const navigate = () => {
        if (el.value && el.url) {
          location.href = el.url
        }
      }

      el.value = ""; // reset searchbox

      // get initial data
      const endpoint = appendUrlParam(options.people_events_rowchart_api_path, "limit", 1000)
      $.getJSON(endpoint, response => (data = response))

      // search on input type values
      el.addEventListener("input", e => {
        const { value } = e.target

        if (value.length) {
          const filterData = data.filter(d => d.name.toLowerCase().includes(value.toLowerCase()))

          $target.addClass(activeClass) // display list

          addListContent($target, filterData, template, emptyTemplate)

          // add the listeners once is DOM
          const $lis = $target.find("li");
          $lis.each((_, li) => li.addEventListener("click", e => {
            const { dataset: { name, url } } = e.target
            el.value = name
            el.url = url
          }));
        } else {
          $target.removeClass(activeClass) // hide list
        }
      })

      // open url if there's value set
      $button.on("click", navigate)

      // enable results on input focus
      el.addEventListener("focus", () => el.value.length ? $target.addClass(activeClass) : null)
      
      // postpone event to allow input event set the values, then disable results
      el.addEventListener("focusout", () => setTimeout(() => $target.removeClass(activeClass), 250))

      // allow keyboard interactions
      el.addEventListener("keydown", (e) => {
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
    });

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

window.GobiertoPeople.gencat_welcome_controller = new GobiertoPeople.GencatWelcomeController;

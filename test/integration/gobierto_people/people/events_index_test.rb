# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class EventsIndexTest < ::Gencat::IntegrationTest

    def setup
      update_fixtures_to_match_gencat_data!
      super
    end

    def site
      @site ||= sites(:madrid)
    end

    def person
      @person ||= gobierto_people_people(:richard)
    end

    def event
      @event ||= gobierto_calendars_events(:richard_culture_department_event_google)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_past_events_path(person.slug, page: false)

        assert has_content? "#{person.name}'s agenda"
        assert has_content? event.title
      end
    end

  end
end

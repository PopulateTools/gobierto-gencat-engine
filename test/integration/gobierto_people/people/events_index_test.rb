# frozen_string_literal: true

require "test_helper"
require "support/event_helpers"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class EventsIndexTest < ::Gencat::IntegrationTest

    include ::EventHelpers

    def site
      @site ||= sites(:madrid)
    end

    def person
      @person ||= gobierto_people_people(:richard)
    end

    def page_title
      person.name
    end

    def test_index
      person.events.destroy_all
      event_1 = create_event(title: "Old", starts_at: 1.month.ago, interest_group: true)
      event_2 = create_event(title: "Very old", starts_at: 1.year.ago, interest_group: true)

      with_current_site(site) do
        visit gobierto_people_person_past_events_path(person.slug, page: false)

        assert title.include? page_title
        assert has_content? "#{person.name}'s agenda"

        assert has_content? event_1.title
        assert has_content? event_2.title

        assert ordered_elements(page, [event_1.title, event_2.title])
      end
    end

  end
end

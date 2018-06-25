# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class InterestGroupsIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_past_events_path(person.slug, page: false)

        assert has_selector?("h1", text: "Interest groups")
        assert has_content? "Interest groups with most meetings"
      end
    end

  end
end

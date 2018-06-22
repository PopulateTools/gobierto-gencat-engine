# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class TripsIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def person
      @person ||= gobierto_people_people(:richard)
    end

    def recent_trip
      @recent_trip ||= gobierto_people_trips(:richard_multiple_destinations_recent)
    end

    def old_trip
      @old_trip ||= gobierto_people_trips(:richard_single_destination_old)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_trips_path(person.slug)

        assert has_content? "Trips made by #{person.name}"

        assert has_content? recent_trip.title
        assert has_content? old_trip.title

        assert ordered_elements(page, [recent_trip.title, old_trip.title])
      end
    end

  end
end

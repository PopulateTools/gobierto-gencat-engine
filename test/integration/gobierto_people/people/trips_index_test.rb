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

    def trip
      @trip ||= gobierto_people_trips(:richard_multiple_destinations)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_trips_path(person.slug)

        assert has_content? "Trips made by #{person.name}"
        assert has_content? trip.title
      end
    end

  end
end

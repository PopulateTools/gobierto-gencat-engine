# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class GiftsIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def person
      @person ||= gobierto_people_people(:richard)
    end

    def gift
      @gift ||= gobierto_people_gifts(:encyclopedia)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_gifts_path(person.slug)

        assert has_content? "Gifts received by #{person.name}"
        assert has_content? gift.name
      end
    end

  end
end

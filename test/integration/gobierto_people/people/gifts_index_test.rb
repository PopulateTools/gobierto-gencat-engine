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

    def recent_gift
      @recent_gift ||= gobierto_people_gifts(:concert_ticket_recent)
    end

    def old_gift
      @old_gift ||= gobierto_people_gifts(:concert_ticket_old)
    end

    def page_title
      person.name
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_gifts_path(person.slug)

        assert title.include? page_title
        assert has_content? "Gifts received by #{person.name}"

        assert has_content? recent_gift.name
        assert has_content? old_gift.name

        assert ordered_elements(page, [recent_gift.name, old_gift.name])
      end
    end

  end
end

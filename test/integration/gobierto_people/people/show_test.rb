# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  module People
    class Gencat::ShowTest < ::Gencat::IntegrationTest

      def site
        @site ||= sites(:madrid)
      end

      def person
        @person ||= gobierto_people_people(:richard)
      end

      def invitation
        @invitation ||= gobierto_people_invitations(:richard_paris_invitation_recent)
      end

      def event
        @event ||= gobierto_calendars_events(:richard_published)
      end

      def trip
        @trip ||= gobierto_people_trips(:richard_multiple_destinations_recent)
      end

      def gift
        @gift ||= gobierto_people_gifts(:encyclopedia)
      end

      def page_title
        person.name
      end

      def test_show
        update_fixtures_to_match_gencat_data!
        event.update_attributes!(starts_at: 1.minute.ago)

        with_current_site(site) do
          visit gobierto_people_person_path(person.slug)

          assert title.include? page_title

          assert has_content? "Last meetings"
          assert has_content? event.title

          assert has_content? "Last trips"
          assert has_content? trip.original_destinations_attribute

          assert has_content? "Last invitations"
          assert has_content? invitation.title

          assert has_content? "Last gifts"
          assert has_content? gift.name
        end
      end

      def test_show_when_no_data
        [person.events, person.trips, person.invitations, person.received_gifts].each(&:destroy_all)

        with_current_site(site) do
          visit gobierto_people_person_path(person.slug)

          assert title.include? page_title

          assert has_no_content? "Last meetings"
          assert has_no_content? "Last trips"
          assert has_no_content? "Last invitations"
          assert has_no_content? "Last gifts"

          assert has_content? "There is no data in the given dates"
        end
      end

    end
  end
end

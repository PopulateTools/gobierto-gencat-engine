# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    class WelcomeIndexTest < ::Gencat::IntegrationTest

      attr_accessor(
        :site,
        :gift,
        :invitation,
        :department,
        :interest_group,
        :person
      )

      def setup
        update_fixtures_to_match_gencat_data!
        super
        @site = sites(:madrid)
        @gift = gobierto_people_gifts(:aperol_spritz)
        @invitation = gobierto_people_invitations(:richard_paris_invitation_recent)
        @department = gobierto_people_departments(:justice_department)
        @interest_group = gobierto_people_interest_groups(:google)
        @person = gobierto_people_people(:richard)
      end

      def site_attendances_to_events_with_department
        site.event_attendances.where(event: site.events.with_department)
      end

      def interest_groups_counter
        site.interest_groups.count
      end

      def people_box_counter
        (site.event_attendances.map(&:person_id) +
         site.trips.map(&:person_id) +
         site.gifts.map(&:person_id) +
         site.invitations.map(&:person_id)).uniq.count
      end

      def meetings_box_counter
        site.event_attendances.with_department.count
      end

      def page_title
        "Public management activity derived from the Code of Conduct"
      end

      def app_breadcrumb_title
        "Public management activity viewer"
      end

      def test_welcome_index
        with(js: true, site: site) do
          visit gobierto_people_root_path

          assert title.include? page_title

          # Summary boxes

          within "#meetings-box" do
            assert has_content? "#{meetings_box_counter}\nMeetings registered"
          end

          within "#interest-groups-box" do
            assert has_content? "#{interest_groups_counter}\nInterest groups\nwith meetings in the period"
          end

          within "#people-box" do
            assert has_content? "#{people_box_counter}\nOfficials\nwith registered activity"
          end

          ## Skip flaky test
          ## # Departments

          ## within("[data-key=\"Immigration department\"]") do
          ##   assert has_content? "Immigration department"
          ##   assert has_content? "3 Meetings registered"
          ##   assert all("svg").any?
          ## end

          # Map

          assert map_loaded?

          # Gifts and invitations

          within "#gifts-wrapper" do
            assert_equal "Gifts", find("#gifts-wrapper section strong").text
            assert has_link? gift.name
            assert has_link? gift.person.name
            assert has_link? "View all the gifts"
          end

          within "#invitations-wrapper" do
            assert_equal "Invitations", find("#invitations-wrapper section strong").text
            assert has_link? invitation.title
            assert has_link? invitation.person.name
            assert has_link? "View all the invitations"
          end
        end
      end

      def test_people_search_box
        with(js: true, site: site) do
          visit gobierto_people_root_path

          sleep 2
          find(".js-search").send_keys(person.name)

          assert find(".box--result", visible: false)["innerHTML"].include?(person.name)
          assert find(".box--result", visible: false)["innerHTML"].include?(person.charge(Date.current))
          assert find(".box--result", visible: false)['data-url'].include? gobierto_people_person_path(person.slug)
        end
      end

      def test_datepicker
        with(js: true, site: site) do
          visit gobierto_people_root_path

          assert find(".datepicker-container")["class"].exclude? "is-shown"

          find("#datepicker").click

          assert find(".datepicker-container")["class"].include? "is-shown"

          all(".js-datepicker-container a").find { |a| a.text == "Last month" }.click

          expected_path = gobierto_people_root_path(start_date: 1.month.ago.strftime("%F"))

          assert current_url.include? expected_path

          assert_equal page_title, header_title
          assert_equal app_breadcrumb_title, breadcrumb_last_item_text
        end
      end

    end
  end
end

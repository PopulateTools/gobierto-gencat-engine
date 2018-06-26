# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class WelcomeIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def departments_box_counter
      site.event_attendances.joins(:event).where("#{GobiertoCalendars::Event.table_name}.department_id is not null").count
    end

    def interest_groups_counter
      site.interest_groups.count
    end

    def people_box_counter
      site.event_attendances.joins(:event).where("#{GobiertoCalendars::Event.table_name}.department_id is not null").select(:person_id).distinct.count
    end

    def gift
      @gift ||= gobierto_people_gifts(:aperol_spritz)
    end

    def invitation
      @invitation ||= gobierto_people_invitations(:richard_paris_invitation_recent)
    end

    def setup
      update_fixtures_to_match_gencat_data!
      super
    end

    def test_welcome_index
      with_current_site(site) do
        visit gobierto_people_root_path

        within "#departments-box" do
          assert has_content? departments_box_counter
          assert has_content? "Departments with most meetings"
        end

        within "#interest-groups-box" do
          assert has_content? interest_groups_counter
          assert has_content? "Interest groups with most meetings"
        end

        within "#people-box" do
          assert has_content? people_box_counter
          assert has_content? "Officials with most meetings"
        end

        within "#gifts-wrapper" do
          assert_equal "Gifts", find("section strong").text
          assert has_link? gift.name
          assert has_link? gift.person.name
        end

        within "#invitations-wrapper" do
          assert_equal "Invitations", find("section strong").text
          assert has_link? invitation.title
          assert has_link? invitation.person.name
        end
      end
    end

  end
end

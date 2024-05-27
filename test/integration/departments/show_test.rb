# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module Departments
      class ShowTest < ::Gencat::IntegrationTest

        attr_accessor(
          :site,
          :department,
          :interest_group,
          :person
        )

        def setup
          super
          @site = sites(:madrid)
          @department = gobierto_people_departments(:tourism_department_very_old)
          @interest_group = gobierto_people_interest_groups(:pepsi)
          @person = gobierto_people_people(:tamara)
        end

        def page_title
          department.name
        end

        def test_show
          with(js: true, site: site) do
            visit gobierto_people_department_path(department)

            assert_equal page_title, header_title

            # Summary boxes

            within all(".box")[0] do
              assert has_content? "6\nMeetings registered\nwith interest groups"
            end

            within all(".box")[1] do
              assert has_content? "2\nInterest groups"
            end

            within all(".box")[2] do
              assert has_content? "2\nofficials in this department"
            end

            # People

            within ".js-people-rectangles" do
              assert has_content? person.name
              assert has_content? person.charge
            end

            # Map

            assert map_loaded?

            within("#map-chart") do
              assert has_content? "1\ndisplacement"
              assert has_content? "1\ndestination"
            end

            # Gifts and invitations

            assert has_content? "Aperol Spritz bottle"
            assert has_no_content? "Recent concert ticket"
            assert has_content? "Important conference in London"
            assert has_no_content? "Recent important congress in Paris"
          end
        end

      end
    end
  end
end

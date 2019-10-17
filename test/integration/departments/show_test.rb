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
          @department = gobierto_people_departments(:justice_department)
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
            assert_equal page_title, breadcrumb_last_item_text

            within all(".box")[0] do
              assert has_content? "4\nRegistered meetings with interest groups"
            end

            within all(".box")[1] do
              assert has_content? "2\ninterest groups\nhave met with this department"
            end

            within all(".box")[2] do
              assert has_content? "2\nofficials in this department\nwith meetings registered"
            end

            # TODO: ensure people are listed

            assert map_loaded?

            assert has_content? "Aperol Spritz bottle"
            assert has_content? "Recent important congress in Paris"
          end
        end

      end
    end
  end
end

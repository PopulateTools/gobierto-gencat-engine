# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module Departments
      class ShowTest < ::Gencat::IntegrationTest

        def site
          @site ||= sites(:madrid)
        end

        def department
          @department ||= gobierto_people_departments(:justice_department)
        end

        def page_title
          department.name
        end

        def test_show
          with_javascript do
            with_current_site(site) do
              visit gobierto_people_department_path(department)

              assert_equal page_title, header_title
              assert_equal page_title, breadcrumb_last_item_text
            end
          end
        end

      end
    end
  end
end

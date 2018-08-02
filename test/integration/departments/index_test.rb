# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module Departments
      class IndexTest < ::Gencat::IntegrationTest

        def site
          @site ||= sites(:madrid)
        end

        def page_title
          "Departments"
        end

        def department
          @department = gobierto_people_departments(:justice_department)
        end

        def person
          @person ||= gobierto_people_people(:richard)
        end

        def test_index
          with_javascript do
            with_current_site(site) do
              visit gobierto_people_departments_path

              assert_equal page_title, header_title
              assert_equal page_title, breadcrumb_last_item_text

              assert has_svg_link?(department.to_url(start_date: DEFAULT_DATE_FILTER_START))
              assert has_svg_link?(person.to_url(start_date: DEFAULT_DATE_FILTER_START))
            end
          end
        end

      end
    end
  end
end

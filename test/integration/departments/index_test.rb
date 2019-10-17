# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module Departments
      class IndexTest < ::Gencat::IntegrationTest

        attr_accessor(
          :site,
          :department,
          :person
        )

        def setup
          super
          @site = sites(:madrid)
          @department = gobierto_people_departments(:justice_department)
          @person = gobierto_people_people(:richard)
        end

        def page_title
          "Departments"
        end

        def test_index
          with(js: true, site: site) do
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

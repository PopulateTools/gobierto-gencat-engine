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

        def interest_group
          @interest_group ||= gobierto_people_interest_groups(:pepsi)
        end

        def person
          @person ||= gobierto_people_people(:tamara)
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

              assert has_svg_link?(person.to_url)
              assert has_svg_link?(interest_group.to_url)
            end
          end
        end

      end
    end
  end
end

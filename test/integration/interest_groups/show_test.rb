# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module InterestGroups
      class ShowTest < ::Gencat::IntegrationTest

        def site
          @site ||= sites(:madrid)
        end

        def interest_group
          @interest_group ||= gobierto_people_interest_groups(:google)
        end

        def department
          @department = gobierto_people_departments(:culture_department)
        end

        def person
          @person ||= gobierto_people_people(:richard)
        end

        def page_title
          interest_group.name
        end

        def test_show
          with_javascript do
            with_current_site(site) do
              visit gobierto_people_interest_group_path(interest_group)

              assert_equal page_title, header_title
              assert_equal page_title, breadcrumb_last_item_text

              assert has_svg_link?(department.to_url)
              assert has_svg_link?(person.to_url)
              assert has_content? "Inscription status in interest groups registry: #{interest_group.status}"
            end
          end
        end

      end
    end
  end
end

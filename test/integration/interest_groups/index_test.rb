# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module InterestGroups
      class IndexTest < ::Gencat::IntegrationTest

        def site
          @site ||= sites(:madrid)
        end

        def page_title
          "Interest Groups"
        end

        def test_index
          with_javascript do
            with_current_site(site) do
              visit gobierto_people_interest_groups_path

              assert_equal page_title, header_title
              assert_equal page_title, breadcrumb_last_item_text

              assert has_no_content? "There is no data for the selected dates"
            end
          end
        end

        def test_index_when_no_data
          site.events.destroy_all

          with_current_site(site) do
            visit gobierto_people_interest_groups_path

            assert title.include? page_title
            assert has_content? "There is no data for the selected dates"
          end
        end

      end
    end
  end
end

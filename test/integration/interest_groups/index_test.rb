# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module InterestGroups
      class IndexTest < ::Gencat::IntegrationTest

        attr_accessor :site, :interest_group

        def setup
          super
          @site = sites(:madrid)
          @interest_group = gobierto_people_interest_groups(:google)
        end

        def page_title
          "Interest Groups"
        end

        def test_index
          with(js: true, site: site) do
            visit gobierto_people_interest_groups_path

            assert_equal page_title, header_title
            assert_equal page_title, breadcrumb_last_item_text

            assert has_svg_link?(interest_group.to_url(start_date: DEFAULT_DATE_FILTER_START))
            assert has_no_content? "There is no data for the selected dates"
          end
        end

        def test_index_when_no_data
          site.events.destroy_all

          with(js: true, site: site) do
            visit gobierto_people_interest_groups_path

            assert title.include? page_title
            assert has_content? "There is no data for the selected dates"
          end
        end

      end
    end
  end
end

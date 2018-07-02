# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  module InterestGroups
    class ShowTest < ::Gencat::IntegrationTest

      def site
        @site ||= sites(:madrid)
      end

      def interest_group
        @interest_group ||= gobierto_people_interest_groups(:google)
      end

      def test_show
        with_current_site(site) do
          visit gobierto_people_interest_group_path(interest_group)

          assert has_selector?("h3", text: interest_group.name)
        end
      end

    end
  end
end

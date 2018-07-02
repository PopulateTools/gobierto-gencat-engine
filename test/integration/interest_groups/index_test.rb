# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class InterestGroupsIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_interest_groups_path

        assert has_content? "Any organization that meets"
        assert has_content? "Interest groups with most meetings"
      end
    end

  end
end

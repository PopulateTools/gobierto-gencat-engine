# frozen_string_literal: true

module Gencat
  class IntegrationTest < ActionDispatch::IntegrationTest

    def reference_site
      @reference_site ||= sites(:madrid)
    end

    def reference_interest_group
      @reference_interest_group ||= gobierto_people_interest_groups(:google)
    end

    def setup
      modified_configuration_data = reference_site.configuration_data.merge(
        "engine_overrides" => ["gobierto-gencat-engine"]
      )

      reference_site.update_attribute(
        :configuration_data,
        modified_configuration_data
      )

      super
    end

    def update_fixtures_to_match_gencat_data!
      # events always have an interest group associated
      ::GobiertoCalendars::Event.where(interest_group: nil).update_all(
        interest_group_id: reference_interest_group.id
      )
      # events are always past
      ::GobiertoCalendars::Event.upcoming.update_all(
        starts_at: 1.month.ago,
        ends_at: 1.month.ago + 1.hour
      )
    end

  end
end

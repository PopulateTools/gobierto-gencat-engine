# frozen_string_literal: true

require "support/gobierto_people/submodules_helper"

module Gencat
  class IntegrationTest < ActionDispatch::IntegrationTest

    include ::GobiertoPeople::SubmodulesHelper

    def reference_site
      @reference_site ||= sites(:madrid)
    end

    def reference_interest_group
      @reference_interest_group ||= gobierto_people_interest_groups(:google)
    end

    def setup
      enable_submodules!
      reference_site.configuration.engine_overrides = ["gobierto-gencat-engine"]
      reference_site.save!
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

    def enable_submodules!
      enable_submodule(reference_site, :gifts)
      enable_submodule(reference_site, :trips)
      enable_submodule(reference_site, :invitations)
    end

  end
end

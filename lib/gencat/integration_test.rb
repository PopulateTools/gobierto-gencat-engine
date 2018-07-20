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
      markup = File.read(Rails.root.join(
        "vendor",
        "gobierto_engines",
        "gobierto-gencat-engine",
        "test",
        "seeds",
        "application_layout.html.erb"
      ))

      reference_site.site_templates.create!(
        template_id: ActiveRecord::FixtureSet.identify(:application_layout),
        markup: markup
      )

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
      enable_submodule(reference_site, :interest_groups)
    end

    def breadcrumb_last_item_text
      all(".breadcrumb li").last.text
    end

    def header_title
      find("#impacteContainer h1").text
    end

  end
end

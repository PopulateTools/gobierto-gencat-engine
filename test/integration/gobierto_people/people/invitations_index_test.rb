# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  class InvitationsIndexTest < ::Gencat::IntegrationTest

    def site
      @site ||= sites(:madrid)
    end

    def person
      @person ||= gobierto_people_people(:richard)
    end

    def invitation
      @invitation ||= gobierto_people_invitations(:richard_paris_invitation)
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_invitations_path(person.slug)

        assert has_content? "Invitations received by #{person.name}"
        assert has_content? invitation.title
      end
    end

  end
end

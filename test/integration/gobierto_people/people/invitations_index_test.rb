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

    def recent_invitation
      @recent_invitation ||= gobierto_people_invitations(:richard_paris_invitation_recent)
    end

    def old_invitation
      @old_invitation ||= gobierto_people_invitations(:richard_paris_invitation_old)
    end

    def page_title
      person.name
    end

    def test_index
      with_current_site(site) do
        visit gobierto_people_person_invitations_path(person.slug)

        assert title.include? page_title
        assert has_content? "Invitations received by #{person.name}"

        assert has_content? recent_invitation.title
        assert has_content? old_invitation.title

        assert ordered_elements(page, [recent_invitation.title, old_invitation.title])
      end
    end

  end
end

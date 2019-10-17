# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module People
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

        def breadcrumb_current_item
          "Invitations"
        end

        def test_index
          with(js: true, site: site) do
            visit gobierto_people_person_invitations_path(person.slug)

            assert_equal page_title, header_title
            assert_equal breadcrumb_current_item, breadcrumb_last_item_text
            assert has_content? "Invitations received by #{person.name}"

            assert has_content? recent_invitation.title
            assert has_content? old_invitation.title

            assert ordered_elements(page, [recent_invitation.title, old_invitation.title])
          end
        end

        def test_index_when_no_invitations
          person.invitations.destroy_all

          with(js: true, site: site) do
            visit gobierto_people_person_invitations_path(person.slug)

            assert_equal page_title, header_title
            assert_equal breadcrumb_current_item, breadcrumb_last_item_text
            assert has_content? "There are no invitations in the given dates"
          end
        end

      end
    end
  end
end

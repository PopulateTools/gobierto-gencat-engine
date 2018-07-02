# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module GobiertoPeople
  module Departments
    class IndexTest < ::Gencat::IntegrationTest

      def site
        @site ||= sites(:madrid)
      end

      def test_index
        with_current_site(site) do
          visit gobierto_people_departments_path

          assert has_content? "Any organization that meets with an official must register as an interest group"
        end
      end

    end
  end
end

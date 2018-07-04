# frozen_string_literal: true

require "test_helper"
require "#{Rails.root}/vendor/gobierto_engines/gobierto-gencat-engine/lib/gencat/integration_test"

module Gencat
  module GobiertoPeople
    module Departments
      class IndexTest < ::Gencat::IntegrationTest

        def site
          @site ||= sites(:madrid)
        end

        def page_title
          "Departments"
        end

        def test_index
          with_current_site(site) do
            visit gobierto_people_departments_path

            assert title.include? page_title
          end
        end

      end
    end
  end
end

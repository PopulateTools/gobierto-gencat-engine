# frozen_string_literal: true

begin
  require 'rails/railtie'
rescue LoadError
else
  class GobiertoGencatEngine
    class Railtie < Rails::Railtie
      Rails.application.config.tap do |conf|
        conf.assets.paths += [File.join(File.dirname(__FILE__), "../../app/assets/stylesheets")]
        conf.engine_sass_config_overrides += ["themes/conf/_theme-gencat-conf"]
        conf.engine_sass_theme_dependencies += ["themes/_theme-gencat"]
      end
    end
  end
end

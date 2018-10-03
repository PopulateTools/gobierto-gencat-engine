# frozen_string_literal: true

begin
  require 'rails/railtie'
rescue LoadError
else
  class GobiertoGencatEngine
    class Railtie < Rails::Railtie
      base_path = File.join(File.dirname(__FILE__), "../..")
      Rails.application.config.tap do |conf|
        conf.assets.paths += [File.join(base_path, "app/assets/stylesheets"), File.join(base_path, "app/assets/images")]
        conf.i18n.load_path += Dir[File.join(base_path, 'config', 'locales', '**', '*.{rb,yml}')]
        conf.engine_sass_config_overrides += ["themes/conf/_theme-gencat-conf"]
        conf.engine_sass_theme_dependencies += ["themes/_theme-gencat"]
      end
    end
  end
end

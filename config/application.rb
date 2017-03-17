require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module TestReact
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.react.server_renderer_options = {
      files: ["react-server.js", "alt_init.js", "routes_init.js", "prerender.js"], # files to load for prerendering
      replay_console: true,                 # if true, console.* will be replayed client-side
    }
     
    #reactjs
    config.react.addons = true
  end
end

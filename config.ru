Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

require "bundler/setup"
Bundler.require(:default)

run Rack::Jekyll.new(:destination => '_site')
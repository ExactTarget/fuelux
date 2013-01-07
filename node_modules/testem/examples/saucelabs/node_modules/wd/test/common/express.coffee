express = require 'express'

class Express
  start: ->
    @app = express()
    @app.use(express.static(__dirname + '/assets'));
    @server = @app.listen 8181
  stop: ->
    @server.close()

exports.Express = Express

YUI.add('server', function(Y) {
    
    /**
    * Provides the `--server` server option for YUIDoc
    * @class Server
    * @module yuidoc
    */
    var Server = {
        /**
        * Cache for external mixed in data.
        * @property _externalData
        * @private
        * @type Object
        */
        _externalData: null,
        /**
        * Middleware to parse the API docs per request
        * @method parse
        * @param {Request} req Express request object
        * @param {Response} res Express response object
        * @param {Function} next Express next callback
        */
        parse: function(req, res, next) {
            var json = (new Y.YUIDoc(Server.options)).run();
            Server.options = Y.Project.mix(json, Server.options);
            Server.builder = new Y.DocBuilder(Server.options, json);
            if (Server._externalData) {
                Server.options.externalData = Server._externalData;
                Server.builder._mixExternal();
            }
            next();
        },
        /**
        * Create the routes used to serve YUIDoc files dynamically
        * @method routes
        */
        routes: function() {
            var app = Server.app;

            app.get('/', Server.parse, function(req, res) {
                Server.home(req, res);
            });
            app.get('/api.js', function(req, res) {
                Server.builder.renderAPIMeta(function(js) {
                    res.contentType('.js');
                    res.send(js);
                });
            });


            app.get('/classes/:class.html', Server.parse, function(req, res) {
                Server.clazz(req, res);
            });

            app.get('/modules/:module.html', Server.parse, function(req, res) {
                Server.module(req, res);
            });

            app.get('/files/:file.html', Server.parse, function(req, res) {
                Server.files(req, res);
            });
            
            //These routes are special catch routes..

            app.get('//api.js', function(req, res) {
                res.redirect('/api.js');
            });
            app.get('//classes/:class.html', Server.parse, function(req, res) {
                Server.clazz(req, res);
            });

            app.get('//modules/:module.html', Server.parse, function(req, res) {
                Server.module(req, res);
            });

            app.get('//files/:file.html', Server.parse, function(req, res) {
                Server.files(req, res);
            });

        },
        /**
        * `/files` endpoint
        * @method files
        * @param {Request} req Express request object
        * @param {Response} res Express response object
        */
        files: function(req, res) {
            var fileName = req.params.file;
            var data;
            Object.keys(Server.builder.data.files).forEach(function(file) {
                if (fileName === Server.builder.filterFileName(file)) {
                    data = Server.builder.data.files[file];
                }
            });
            Y.log('Serving /files/' + data.name, 'info', 'server');

            Server.builder.renderFile(function(html) {
                res.send(html);
            }, data, (req.xhr ? 'xhr' : 'main'));
        },
        /**
        * `/classes` endpoint
        * @method clazz
        * @param {Request} req Express request object
        * @param {Response} res Express response object
        */
        clazz: function(req, res) {
            var className = req.params['class'];
            Y.log('Serving /classes/' + className + '.html', 'info', 'server');
            Server.builder.renderClass(function(html) {
                res.send(html);
            }, Server.builder.data.classes[className], (req.xhr ? 'xhr' : 'main'));
        },
        /**
        * `/modules` endpoint
        * @method modules
        * @param {Request} req Express request object
        * @param {Response} res Express response object
        */
        module: function(req, res) {
            var modName = req.params.module;
            Y.log('Serving /modules/' + modName + '.html', 'info', 'server');
            Server.builder.renderModule(function(html) {
                res.send(html);
            }, Server.builder.data.modules[modName], (req.xhr ? 'xhr' : 'main'));
        },
        /**
        * `/` endpoint
        * @method home
        * @param {Request} req Express request object
        * @param {Response} res Express response object
        */
        home: function(req, res) {
            Y.log('Serving index.html', 'info', 'server');
            Server.builder.renderIndex(function(html) {
                res.send(html);
            });
        },
        /**
        * Creates the Express server and prep's YUI for serving
        * @method init
        */
        init: function() {
            var express = require('express'),
                path = require('path');


            Server.app = express.createServer();
            var stat = path.join(__dirname, '../', 'themes', 'default');
            Server.app.use(express.static(stat));
            Server.routes();
            Server.app.listen(Server.options.port);

            Y.log('Starting server: http:/'+'/127.0.0.1:' + Server.options.port, 'info', 'server');
        },
        /**
        * Start the server with the supplied options.
        * @method start
        * @param {Object} options Server options
        */
        start: function(options) {
            options = Y.Project.init(options);
            Server.options = options;
            
            Server.options.cacheTemplates = false; //Don't cache the Handlebars templates
            Server.options.writeJSON = false; //Don't write the JSON file out

            Y.config.logExclude.yuidoc = true;
            Y.config.logExclude.docparser = true;
            Y.config.logExclude.builder = true;

            if (Server.options.external) {
                Y.log('Fetching external data, this may take a minute', 'warn', 'server');
                var json = (new Y.YUIDoc(Server.options)).run();
                Server.options = Y.Project.mix(json, Server.options);
                var builder = new Y.DocBuilder(Server.options, json);
                builder.mixExternal(function() {
                    Y.log('External data fetched, launching server..', 'info', 'server');
                    Server._externalData = builder.options.externalData;
                    Server.init();
                });

            } else {
                Server.init();
            }
        }
    };

    Y.Server = Server;
});

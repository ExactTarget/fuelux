// Mustache integration with express
// Thanks to <http://bitdrift.com/post/2376383378/using-mustache-templates-in-express>

var Mustache = require('mustache')

module.exports = {
    compile: function (source, options) {
        if (typeof source == 'string') {
            return function(options) {
                options.locals = options.locals || {};
                options.partials = options.partials || {};
                if (options.body) // for express.js > v1.0
                    options.locals.body = options.body;
                return Mustache.to_html(
                    source, options.locals, options.partials);
            };
        } else {
            return source;
        }
    },
    render: function (template, options) {
        template = this.compile(template, options);
        return template(options);
    }
};
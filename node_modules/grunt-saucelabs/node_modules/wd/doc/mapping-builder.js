var isFull = process.argv[2] === "full";

var fs = require("fs"),
    mu = require('mu2'),
    _ = require('underscore');

mu.root = __dirname;

var jsonWireFull = JSON.parse(fs.readFileSync('doc/jsonwire-full.json').toString());
var jsonDocs = [
  JSON.parse(fs.readFileSync('tmp/webdriver-dox.json').toString()),
  JSON.parse(fs.readFileSync('tmp/element-dox.json').toString())
];

var resMapping = [];

// main mapping
_(jsonWireFull).each(function (jw_v, jw_k) {
  var current = {
    jsonWire: { 
      key: jw_k,
      method: jw_k.split(' ')[0],
      path: jw_k.split(' ')[1],
      url: "http://code.google.com/p/selenium/wiki/JsonWireProtocol#" + jw_k.replace(/\s/g, '_'),
      desc: jw_v
    },
    wd_doc: []
  };
  _(jsonDocs).each(function (jsonDoc) {
    _(jsonDoc).each(function (wd_v) {
      if( _(wd_v.tags).filter(function (t) {
         return (t.type === 'jsonWire') && (t.string === jw_k);
      }).length > 0){
        var orderTag = _(wd_v.tags).filter(function (t) {
          return t.type === 'docOrder';
        });
        var order = 1000000;
        if (orderTag.length > 0){
         order =  parseInt(orderTag[0].string, 10); 
        }         
        var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
          return l !== '';
        }).map(function (l) {
            return {line: l};
        });
        current.wd_doc.push({
          'desc': desc,
          'order': order
        });
      }
    });
  });
  current.wd_doc = _(current.wd_doc).sortBy(function (docItem) {
    return docItem.order;
  });
  current.wd_doc0 = current.wd_doc.length === 0; 
  current.wd_doc1 = current.wd_doc.length === 1? current.wd_doc : null;
  current.wd_docN = current.wd_doc.length > 1? current.wd_doc: null;

  if(isFull || (current.wd_doc.length > 0)){
    resMapping.push(current); 
  }
});

// extra section
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    if(_(wd_v.tags).filter(function (t) {
       return t.type === 'jsonWire';
    }).length === 0){
      current = {
        extra: true,
        wd_doc: []
      };
      var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
        return  l !== '';
      }).map(function (l) {
        return {line: l};
      });
      current.wd_doc.push({ 'desc': desc });
      current.wd_doc1 = current.wd_doc;
      resMapping.push(current);
    }
  });  
});


// missing section, looking for errors
_(jsonDocs).each(function (jsonDoc) {
  _(jsonDoc).each(function (wd_v) {
    _(_(wd_v.tags).filter(function (t) {
       return t.type === 'jsonWire';
    })).each(function (t) {
      tag = t.string;
      if(!jsonWireFull[tag]){
        current = {
          missing: { 
            key:tag
          },
          wd_doc: []
        };
        var desc = _(wd_v.description.full.split('\n')).filter(function (l) {
          return  l !== '';
        }).map(function (l) {
          return {line: l};
        });
        current.wd_doc.push({desc: desc});
        current.wd_doc1 = current.wd_doc;
        resMapping.push(current);
      } 
    });
  });  
});

var output = '';
mu.compileAndRender( 'mapping-template.htm', {mapping: resMapping})
  .on('data', function (data) {
    output += data.toString();
  })
  .on('end', function () {
    _(output.split('\n')).each(function (line) {
      line = line.trim();
      if(line !== '' ){
        process.stdout.write(line + '\n');
      }
    });
  });


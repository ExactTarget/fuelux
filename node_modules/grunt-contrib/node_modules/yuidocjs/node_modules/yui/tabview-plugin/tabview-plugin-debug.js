/*
YUI 3.6.0pr3 (build 1)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('tabview-plugin', function(Y) {

function TabviewPlugin() {
    TabviewPlugin.superclass.constructor.apply(this, arguments);
};

TabviewPlugin.NAME = 'tabviewPlugin';
TabviewPlugin.NS = 'tabs';

Y.extend(TabviewPlugin, Y.TabviewBase);

Y.namespace('Plugin');
Y.Plugin.Tabview = TabviewPlugin;


}, '3.6.0pr3' ,{requires:['tabview-base']});

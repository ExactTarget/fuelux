/*
 * Fuel UX Combobox
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(function(require) {

    var $ = require('jquery');

    // COMBOBOX CONSTRUCTOR AND PROTOTYPE

    var Combobox = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.combobox.defaults, options);
        this.$element.on('click', 'a', $.proxy(this.itemclicked, this));
        this.$element.on('change', 'input', $.proxy(this.inputchanged, this));
        this.$input = this.$element.find('input');
        this.$button = this.$element.find('.btn');

        // custom case-insensitive match expression
        $.extend($.expr[':'], {
            match: function(elem, index, match) {
                var matchtext = (match && 3 in match) ? match[3] : '';
                return ((elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase() === matchtext.toLowerCase());
            }
        });

        // set default selection
        this.setDefaultSelection();
    };

    Combobox.prototype = {

        constructor: Combobox,

        select: function (val) {
            this.$input.val(val).change();
            return this;
        },

        selectedItem: function() {
            var item = this.$selectedItem;
            var data = {};

            if (item) {
                var txt = this.$selectedItem.text();
                data = $.extend({ text: txt }, this.$selectedItem.data());
            }
            else {
                data = { text:this.$input.val()};
            }

            return data;
        },

        selectByText: function(text) {
            var selector = 'li:match(' + text + ')';
            this.selectBySelector(selector);
        },

        selectByValue: function(value) {
            var selector = 'li[data-value=' + value + ']';
            this.selectBySelector(selector);
        },

        selectByIndex: function(index) {
            // zero-based index
            var selector = 'li:eq(' + index + ')';
            this.selectBySelector(selector);
        },

        selectBySelector: function(selector) {
            var $item = this.$element.find(selector);

            if (typeof $item[0] !== 'undefined') {
                this.$selectedItem = $item;
                this.$input.val(this.$selectedItem.text());
            }
            else {
                this.$selectedItem = null;
            }
        },

        setDefaultSelection: function() {
            var selector = 'li[data-selected=true]:first';
            var item = this.$element.find(selector);
            if(item.length === 0) {
                // select first item
                this.selectByIndex(0);
            }
            else {
                // select by data-attribute
                this.selectBySelector(selector);
                item.removeData('selected');
                item.removeAttr('data-selected');
            }
        },

        enable: function() {
            this.$input.removeAttr('disabled');
            this.$button.removeClass('disabled');
        },

        disable: function() {
            this.$input.attr('disabled', true);
            this.$button.addClass('disabled');
        },

        itemclicked: function (e) {
            this.$selectedItem = $(e.target).parent();
            this.$input.val(this.$selectedItem.text());

            // pass object including text and any data-attributes
            // to onchange event
            var data = this.selectedItem();

            // trigger changed event
            this.$element.trigger('changed', data);

            e.preventDefault();
        },

        inputchanged: function(e) {
            var val = $(e.target).val();
            this.selectByText(val);

            // find match based on input
            // if no match, pass the input value
            var data = this.selectedItem();
            if(data.text.length === 0) {
                data = { text: val };
            }

            // trigger changed event
            this.$element.trigger('changed', data);

        }

    };


    // COMBOBOX PLUGIN DEFINITION

    $.fn.combobox = function (option, value) {
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('combobox');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('combobox', (data = new Combobox(this, options)));
            if (typeof option === 'string') methodReturn = data[option](value);
        });

        return (methodReturn === undefined) ? $set : methodReturn;
    };

    $.fn.combobox.defaults = {};

    $.fn.combobox.Constructor = Combobox;


    // COMBOBOX DATA-API

    $(function () {

        $(window).on('load', function () {
            $('.combobox').each(function () {
                var $this = $(this);
                if ($this.data('combobox')) return;
                $this.combobox($this.data());
            });
        });

        $('body').on('mousedown.combobox.data-api', '.combobox', function (e) {
            var $this = $(this);
            if ($this.data('combobox')) return;
            $this.combobox($this.data());
        });
    });

});

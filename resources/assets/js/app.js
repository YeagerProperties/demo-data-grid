/*
 * Cartalyst Quickstart
 * Copyright 2017 Cartalyst LLC. All Rights Reserved.
 *
 * Provides helpers for various sections of the application.
 *
 */

var Quickstart;

;(function (window, document, $, undefined) {
    'use strict';

    Quickstart = Quickstart || {
        App: {},
        Cache: {},
    };

    // Cache common selectors
    Quickstart.Cache.$win  = $(window);
    Quickstart.Cache.$body = $(document.body);

    // Initialize functions
    Quickstart.App.init = function () {
        Quickstart.App
            .foundation()
            .listeners()
            .wrapCodeBlocks()
            .initHighlightJs()
            .initClipboard()
            .addClasses()
        ;
    };

    // Add Listeners
	Quickstart.App.listeners = function()
	{
        Quickstart.Cache.$body
			.on('mouseover', '.js-quickstart-preview:not(code .js-quickstart-preview)', Quickstart.App.previewAttributes)
            .on('mouseenter', 'option.js-quickstart-preview:not(code .js-quickstart-preview)', Quickstart.App.previewAttributes)
        ;

		return this;
	};

    // Initialize Foundation 6
    Quickstart.App.foundation = function ()
    {
        Quickstart.Cache.$body.foundation();

        return this;
    }

    // Show preview of data-grid attributes from element on hover.
    Quickstart.App.previewAttributes = function (event) {

        var target = $(event.target);
        var tag = target.closest('.js-quickstart-preview').prop('tagName').toLowerCase();
        var attributes = target.closest('.js-quickstart-preview').data();

        // find all data-grid attributes
        var filteredAttributes = _.forEach(attributes, function(val, key) {
            if (key.substr(0, 4) === 'grid') {
                return {key: val};
            }
        });

        var newAttributes = [];

        _.each(filteredAttributes, function(val, key) {
            key = 'data-' + _.snakeCase(key).replace(/_/g, '-');

            newAttributes.push(key + '="' + val + '"');
        });

        // create new element from target and newAttributes
        var element = '<' + tag + ' ' + newAttributes.join(' ') + '></' + tag + '>';

        //update preview area with code example.
        $('.preview > div').fadeIn();
        $('.preview pre code').text(element);

        return this;
    };

    // Create code blocks generated from markdown.
    Quickstart.App.wrapCodeBlocks = function () {
        $('.article--tutorial h5').each(function () {
            $(this)
                .addClass('source_code__header')
                .next('p')
                .addClass('source_code__block')
                .wrapInner('<pre></pre>')
            ;

            $(this).next().addBack().wrapAll('<div class="source_code"></div>');
        });

        // Add Actions
        $('.source_code').each(function () {
            var el = $(this);
            var slug = Quickstart.App.slugify(el.children('.source_code__header').html());

            $(this).append('<nav class="source_code__actions"></nav>');

            // Add the copy to clipboard button
            el
                .find('.source_code__actions')
                .append('<button class="small button" data-copy-text data-clipboard-target="#'+slug+'"><i class="material-icons">content_cut</i></button>')
            ;

            el.find('.source_code__block > pre > code').attr('id', slug);
        });

        return this;
    };

    // Syntax highlighting for code blocks.
    Quickstart.App.initHighlightJs = function () {

        hljs.initHighlightingOnLoad();

        return this;
    };

    // Readability for examples, add framework, app specific classes here.
    Quickstart.App.addClasses = function () {
        if ($('[data-example]').length) {

            // What example is being displayed
            var type = $('[data-example]').data('example');

            switch(type) {
                case 'crops':

                    // Filters
                    $('[data-grid-filter]').addClass('js-quickstart-preview');

                    // Layouts
                    $('[data-grid-switch-layout]').addClass('js-quickstart-preview');

                    // Search Form
                    $('.search form > div').addClass('mdl-textfield mdl-js-textfield');
                    $('.search form > div input').addClass('mdl-textfield__input');
                    $('.search form > div label').addClass('mdl-textfield__label');

                    // Table
                    $('th').addClass('js-quickstart-preview');

                    // Applied filters
                    $('[data-grid-layout="filters"]').on('dg:layout_rendered', function() {
                        $(this).find('button').addClass('js-quickstart-preview');
                    });

                    // Pagination
                    $('[data-grid-layout="pagination"]').on('dg:layout_rendered', function() {
                        $(this).find('button').addClass('js-quickstart-preview');
                    });

                    break;
                case 'apricots':

                    // Group Filters
                    $('[data-grid-group] > button').addClass('js-quickstart-preview');

                    break;
                default:
                    // Default
                ;
            }
        };

        return this;
    };

    // Initializes the Clipboard.js
    Quickstart.App.initClipboard = function () {
        var clipboard = new Clipboard('[data-copy-text]');

        clipboard.on('success', function (e) {
            e.clearSelection();

            // Show success notice
            $('.source_code__actions').prepend('<span class="action__message">Copied!</span>')

            $('.action__message').fadeOut(2500, function () {
                $(this).remove();
            });
        });

        clipboard.on('error', function (e) {
            // Show fallback tooltip
            $('.source_code__actions').prepend('<span class="action__message">'+Quickstart.App.fallbackMessage()+'</span>')

            $('.action__message').fadeOut(4500, function () {
                $(this).remove();
            });
        });

        return this;
    };

    // Slugifies the given string
    Quickstart.App.slugify = function (str) {
        if (str === undefined) return;

        return str
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .toLowerCase()
            .replace(/\s/g,'-')
        ;
    };

    Quickstart.App.fallbackMessage = function () {
        var message = '';

        if(/iPhone|iPad/i.test(navigator.userAgent)) {
            message = 'No support :(';
        }
        else if (/Mac/i.test(navigator.userAgent)) {
            message = 'Press ⌘-C to copy';
        }
        else {
            message = 'Press Ctrl-C to copy';
        }

        return message;
    };

    // Job done, lets run
    Quickstart.App.init();

})(window, document, jQuery);

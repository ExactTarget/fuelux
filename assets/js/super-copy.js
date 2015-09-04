
$(function() {
    var COPY_PROMPT_TEXT = 'copy';
    var KEYSTROKE_TEXT = '⌘ + c (ctrl + c)';

    var selectCode = function($el) {
        var doc = document;
        var code = $el.parent().find('code')[0];

        if (doc.body.createcodeRange) {
            var range = document.body.createcodeRange();
            range.moveToElementcode(code);
            range.select();
        }
        else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(code);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    var $copyPrompt = $('<div>')
        .text(COPY_PROMPT_TEXT)
        .addClass('super-copy small')
        ;

    var applySuperCopy = function($currentCode) {
        $currentCode.parent()
            .css('position', 'relative')
            .append($copyPrompt.clone()
                    .click(function() {
                        onCopyClick($(this));
                    })
                   )
            ;
    }

    var onCopyClick = function($currentPrompt) {
        selectCode($currentPrompt);
        $currentPrompt.text(KEYSTROKE_TEXT);

        setTimeout(function() {
            $currentPrompt.text(COPY_PROMPT_TEXT);
        }, 3000);
    };

    $('.highlight code').each(function() {
        applySuperCopy($(this));
    });
});

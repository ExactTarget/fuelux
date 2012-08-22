#!/bin/sh

rm -rf lib/bootstrap

volo add -nostamp bootstrap

volo amdify lib/bootstrap/js/bootstrap-transition.js depends=jquery
volo amdify lib/bootstrap/js/bootstrap-affix.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-alert.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-button.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-carousel.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-collapse.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-dropdown.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-modal.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-popover.js depends=bootstrap/bootstrap-transition,bootstrap/bootstrap-tooltip
volo amdify lib/bootstrap/js/bootstrap-scrollspy.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-tab.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-tooltip.js depends=bootstrap/bootstrap-transition
volo amdify lib/bootstrap/js/bootstrap-typeahead.js depends=bootstrap/bootstrap-transition


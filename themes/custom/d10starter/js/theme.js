(function ($, Drupal) {
    Drupal.behaviors.DefaultProgram = {
      attach: function (context, settings) {
        if(!$('body').hasClass('program-selected')) {
            var select_name = 'tfa_5';
            var $node = $('article.node--type-program');
            if ($node.length) {
                var id = $node.data('program-id');
                var $program_selector = $('form [name="' + select_name + '"]');
                if ($program_selector.length) {
                var $opt = $program_selector.find('option:contains(' + id + ')');
                if ($opt.length) {
                    $opt.attr('selected', 'selected');
                    // Try to disable navigate-away warning.
                    $(window).off('beforeunload');
                }
                else {
                    console.log('FA: unable to preselect ' + id);
                }
                }
                else {
                console.log('FA: ' + select_name + ' not found');
                }
            }

            $('body').addClass('program-selected');
        }
      }
    };
  })(jQuery, Drupal);
/* eslint-disable */

const setUpEmsi = () => {
  (function ($) {
    var fetch_location_name, get_cookie, msa, set_cookie, update_career_data;

    set_cookie = function (name, value, days) {
      var date, expires;
      if (days) {
        date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toGMTString();
      } else {
        expires = '';
      }
      return (document.cookie = name + '=' + value + expires + '; path=/');
    };

    get_cookie = function (name) {
      var c, ca, i, nameEQ;
      nameEQ = name + '=';
      ca = document.cookie.split(';');
      i = 0;
      while (i < ca.length) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
        i++;
      }
      return null;
    };

    if (get_cookie('oduonline-location')) {
      msa = get_cookie('oduonline-location');
    } else {
      msa = 47260;
    }

    fetch_location_name = function (msa) {
      return $.ajax({
        url: '/emsi_cache/location/lookup/name/' + msa,
        dataType: 'json',
        type: 'GET',
        success: function (result) {
          $('#location-name').html(result.label).addClass('location-selected');
          $('input#location-msa').val('');
          return true;
        },
      });
    };

    update_career_data = function (msa) {
      if (!parseInt(msa)) {
        msa = 47260;
      }
      set_cookie('oduonline-location', msa, 1);
      $.ajax({
        url:
          '/emsi_cache/career_data/program/' +
          $('#emsi-careers').data('program') +
          '/' +
          msa,
        dataType: 'json',
        type: 'GET',
        beforeSend: function () {
          $('#location-name').html('loading...');
          return $('#emsi-careers').html(
            '<div class="emsi-loading">Fetching job data...</div>'
          );
        },
        success: function (result) {
          var markup;
          fetch_location_name(msa);
          markup =
            '<table class="striped"><thead><tr class=""><th>Job Title</th><th>Avg. Annual Salary</th><th>Average Annual Openings</th></tr></thead>';
          markup += '<tbody>';
          $.each(result, function (index, value) {
            if (!result[index]['title']) {
              return;
            }
            return (markup +=
              '<tr><td>' +
              result[index]['title'] +
              '</td><td>$' +
              result[index]['median-earnings']
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
              '</td><td>' +
              result[index]['annual-openings'] +
              '</td></tr>');
          });
          markup += '</tbody></table>';
          $('#emsi-careers').html(markup);
          return true;
        },
      });
      return true;
    };

    $('input#location-msa').autocomplete({
      source: function (request, response) {
        $.ajax({
          url: '/emsi_cache/location/lookup/name/' + request.term,
          dataType: 'json',
          success: function (data) {
            var error_html = '';
            console.log(data);
            if (data.length == 0) {
              error_html =
                'No locations found. Make sure you search for a city or region name.';
            }
            $('.location-error').html(error_html);
            response(data);
          },
        });
      },
      minLength: 2,
      select: function (event, ui) {
        $('input#location-msa').attr('placeholder', '');
        set_cookie('oduonline-location', ui.item.value);
        update_career_data(ui.item.value);
      },
    });

    $(document).on('submit', 'form#location-changer', function (e) {
      return e.preventDefault();
    });

    update_career_data(get_cookie('oduonline-location'));
  })(jQuery);
};

if (!window.IS_STORYBOOK) setUpEmsi();

export default setUpEmsi;

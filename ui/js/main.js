/**
 * Hydra Main App
 * --------------
 */
var caps = true, ctrl = false;


$(document).ready(function () {

  function prompt(keyCode, char) {
    if (keyCode !== -1) {
      char = String.fromCharCode(keyCode);
    }
    var $p = $('#prompt'),
      $pt = $p.text();
    if (keyCode == 17) {
      ctrl = !ctrl;
      $('#kbd').toggleClass('ctrl');
    } else if (keyCode === 16 || keyCode === 20) {
      caps = !caps;
      $('#kbd').toggleClass('caps');
    } else if (keyCode == 8) {
     $pt = $pt.slice(0, -1);
    } else if (keyCode == 13) {
      console.log($pt);
      if($pt.toLowerCase()=='loc'){
        getGPSLocation();
      } else {
        $('#out').html('');
      }
      $pt = '';
    } else {
      $pt = $pt + (caps ? char : char.toLowerCase());
    }
    console.log('caps: ' + caps + ' code: ' + keyCode + ' char: [' + char + ']');
    $p.text($pt);
  }

  $(document)
    .on("keydown", function (e) {
      if (!e) e = window.event;
      if (navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
        e.stopPropagation();
      } else {
        e.returnValue = false;
      }
      return false;
    })
    .on("keyup", function (e) {
      prompt(e.keyCode);
      e.preventDefault();
      return false;
  });
  $('#kbd td')
    .on('touchstart mousedown', function (e) {
      e.preventDefault().stopImmediatePropagation();
      $(this).addClass('dn')
    })
    .on('touchend touchcancel mouseup', function (e) {
      e.preventDefault();
      var $k = $(this),
        c = $k.data('c'),
        t = (!ctrl ? $('span:first', $k).text() : $('span:last', $k).text());
      if (c === undefined) c = -1;
      $k.removeClass('dn');
      prompt(c, t);
      return false;
    });
});
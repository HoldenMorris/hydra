/**
 * Hydra Main App
 * --------------
 */
var caps = true, ctrl = false;
var snd = new Audio("/ui/snd/click.wav");

$(document).ready(function () {

  offset = $('#kbd').offset();
  $('#out').css('max-height',(offset.top-75));

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
      switch($pt.toLowerCase()) {
          case 'loc':
            getGPSLocation(function(pos,err){
              if(err){
                $('#out').append('<p>'+err+'</p>');
              } else {
                $('#out').append('<p>Latitude: '+pos.coords.latitude +'<br/>Longitude: ' +pos.coords.longitude+'</p>');
              }
            });
            break;
          case 'clr':
            $('#out').html('');
            break;
          default:
            $('#out').append('<p>'+$pt+'</p>');
      }
      var out = $('#out');
      var height = out[0].scrollHeight;
      out.scrollTop(height);
      $pt = '';
    } else {
      $pt = $pt + (caps ? char : char.toLowerCase());
    }
    //console.log('caps: ' + caps + ' code: ' + keyCode + ' char: [' + char + ']');
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
      snd.play();
      if(typeof e != "undefined"){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      $(this).addClass('dn')
    })
    .on('touchend touchcancel mouseup', function (e) {
      if(typeof e != "undefined"){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      var $k = $(this),
        c = $k.data('c'),
        t = (!ctrl ? $('span:first', $k).text() : $('span:last', $k).text());
      if (c === undefined) c = -1;
      $k.removeClass('dn');
      prompt(c, t);
      return false;
    });
});
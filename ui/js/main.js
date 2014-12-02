/**
 * Hydra Main App
 * --------------
 */
var caps = false, shift = false, ctrl = false;
var snd = new Audio("/ui/snd/click.wav");

$(document).ready(function () {

  offset = $('#kbd').offset();
  $('#out').css('max-height',(offset.top-75));

  function prompt(shiftKey, ctrlKey, keyCode, char) {

    console.log( 'caps: '+caps+' shift: '+shiftKey+' ctrl: '+ctrlKey+' keyCode: '+keyCode+' char: '+char );

    if (keyCode !== -1) {
      if(keyCode>=32 && keyCode<=126){
        char = String.fromCharCode(keyCode);
      } else {
        char = '';
      }
    }
    var $p = $('#prompt'),
        inp = $p.text();
    switch(keyCode) {
      case 8:
        inp = inp.slice(0, -1);
        break;
      case 13:
        switch(inp.toLowerCase()) {
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
              $.post( "api", {cmd:inp}, function( data ) {
                $('#out').append('<p>'+data.msg+'</p>');
              });
        }
        var out = $('#out');
        var height = out[0].scrollHeight;
        out.scrollTop(height);
        inp = '';
        break;
      case 17:
        ctrl = !ctrl;
        $('#kbd').toggleClass('ctrl');
        break;
      case 20:
        caps = !caps;
        $('#kbd').toggleClass('caps');
        break;
      default:
        inp = inp + (caps||shiftKey ? char : char.toLowerCase());
    }
    $p.text(inp);
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
      console.log('keyup');
      var keyCode = e.keyCode ? e.keyCode : e.which;
      var shiftKey = e.shiftKey ? e.shiftKey : ((keyCode == 16) ? true : false);
      var ctrlKey = e.ctrlKey ? e.ctrlKey : ((keyCode == 20) ? true : false);
      //caps = ( ( ( keyCode >= 65 && keyCode <= 90 ) && !shiftKey ) || ( ( keyCode >= 97 && keyCode <= 122 ) && shiftKey ) );
      prompt( shiftKey, ctrlKey, keyCode);
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
      prompt( shift, ctrl, c, t);
      return false;
    });

//  ke = jQuery.Event("keyup");
//  ke.which = 88; // key value of x
//  console.log(ke);
//  $(document).trigger(ke);

});
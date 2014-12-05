/**
 * Hydra Main App
 * --------------
 */
var caps=false, shift=false, ctrl=false, dx=0, dy=0, tsx=0, tsy=0, touched=false;

var snd = new Howl({
  urls: ['/ui/snd/click.mp3']
});

$(document).ready(function () {

  kbd_offset = $('#kbd').offset();
  $('#out').css('max-height',(kbd_offset.top-75));

  //kbd_position = $('#kbd').position();
  //console.log(kbd_position);

  function prompt(shiftKey, ctrlKey, keyCode, char) {

    //console.log( 'caps: '+caps+' shift: '+shiftKey+' ctrl: '+ctrlKey+' keyCode: '+keyCode+' char: '+char );

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
              $('#out').append('<p>Getting GPS data...</p>');
              $('#out').append('<i class="fa fa-spinner fa-spin"></i>');
              getGPSLocation(function(pos,err){
                $("#out i:last-child").remove();
                if(typeof pos != 'undefined'){
                  //console.log(pos);
                  $('#out').append('<p>'+pos.constructor.name+'</p>');
                }
                if(err){
                  //console.log(err);
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
              $('#out').append('<i class="fa fa-spinner fa-spin"></i>');
              $.post( "api", {cmd:inp}, function( data ) {
                $("#out i:last-child").remove();
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
      //console.log('keyup');
      var keyCode = e.keyCode ? e.keyCode : e.which;
      var shiftKey = e.shiftKey ? e.shiftKey : ((keyCode == 16) ? true : false);
      var ctrlKey = e.ctrlKey ? e.ctrlKey : ((keyCode == 20) ? true : false);
      //caps = ( ( ( keyCode >= 65 && keyCode <= 90 ) && !shiftKey ) || ( ( keyCode >= 97 && keyCode <= 122 ) && shiftKey ) );
      prompt( shiftKey, ctrlKey, keyCode);
      e.preventDefault();
      return false;
    });;

  $('#container')
    .on('touchstart mousedown',function(e){
      touched=true;
      var elm = $(this).offset(), x=0, y=0;
      if (e.originalEvent.constructor.name == 'MouseEvent'){
        var mouse = e.originalEvent;
        x = mouse.x;
        y = mouse.y;
      } else {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
      }
      x = x - elm.left;
      y = y - elm.top;
      if(x < $(this).width() && x > 0){
        if(y < $(this).height() && y > 0){
          tsy = y;
          tsx = x;
        }
      }
      if(typeof e != "undefined"){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    })
    .on('touchend mouseup',function(e){
      touched=false;
      $('#kbd td').removeClass('dn');
    })
    .on('touchmove mousemove',function(e){
      if(touched){
        var elm = $(this).offset(), x=0, y=0;
        if (e.originalEvent.constructor.name == 'MouseEvent'){
          var mouse = e.originalEvent;
          x = mouse.x;
          y = mouse.y;
        } else {
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          x = touch.pageX;
          y = touch.pageY;
        }
        x = x - elm.left;
        y = y - elm.top;
        if(x < $(this).width() && x > 0){
          if(y < $(this).height() && y > 0){
            dx = tsx-x;
            dy = tsy-y;
            $('#status').text( (dx>0?'<':'>')+' ' + Math.abs(Math.round(dx))+' '+(dy<0?'v':'^')+' '+Math.abs(Math.round(dy)));
          }
        }
      }
    });

  $('#kbd td')
    .on('touchstart mousedown', function (e) {
      if($(this).hasClass('func')){
        $('#kbd').removeClass('off').css('bottom','0px');
        kbd_offset = $('#kbd').offset();
        $('#out').css('max-height',(kbd_offset.top-75));
      } else {
        snd.play();
        $(this).addClass('dn');
      }
    })
    .on('touchend touchcancel mouseup', function (e) {
      touched=false;
      var $k = $(this);
      if(Math.abs(dy)>50){
        console.log(dy);
        var $kbd = $('#kbd');
        if(dy<0){
          var kh = $kbd.height()-$('tr.title',$kbd).height();
          $kbd.css('bottom','-'+kh+'px').addClass('off');
          //kbd_position = $('#kbd').position();
          //console.log(kbd_position);
          //$('#out').css('max-height',(kbd_offset.top-75));
        }
        dx = 0;
        dy = 0;
      } else {
        if(typeof e != "undefined"){
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        var c = $k.data('c'),
            t = (!ctrl ? $('span:first', $k).text() : $('span:last', $k).text());
        if (c === undefined) c = -1;
        prompt( shift, ctrl, c, t);
      }
      $('#kbd td').removeClass('dn');
      return false;
    });

//ke = jQuery.Event("keyup");
//ke.which = 88; // key value of x
//console.log(ke);
//$(document).trigger(ke);

});
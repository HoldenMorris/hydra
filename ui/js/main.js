/**
 * Hydra Main App
 * --------------
 */

var key=false, caps=false, shift=false, ctrl=false, keycodeD, keycodeP=false, dx=0, dy=0, tsx=0, tsy=0, touched=false, buffer_max=100;

var snd = new Howl({
  urls: ['/ui/snd/click.mp3']
});

$(document).ready(function () {

  kbd_offset = $('#kbd').offset();
  $('#out').css('max-height',(kbd_offset.top-75));

  function prompt(key) {
    var $p = $('#prompt'),
        inp = $p.text();
    switch(key.toUpperCase()) {
      case 'CTRL':
      case 'CAPS':
      case 'SHIFT':
      case 'HOME':
      case 'DOWN':
      case 'UP':
      case 'LEFT':
      case 'RIGHT':
      case 'END':
      case 'PGUP':
      case 'PGDN':
      case 'SHIFT':
      case false:
        // ignore some
        break;
      case 'SPACE':
        inp = inp +' ';
        break;
      case 'BACKSP':
        inp = inp.slice(0, -1);
        break;
      case 'ENTER':
        var out = $('#out');
        // prune out old lines if more than buffer
        var buffer = $('p',out).length;
        $('#status').text('Buffer: '+buffer );
        if(buffer>buffer_max){
          $('p',out).slice(0,buffer-buffer_max).remove();
        }
        switch(inp.toLowerCase()) {
            case 'loc':
              out.append('<p>Getting GPS data...</p>');
              out.append('<i class="fa fa-spinner fa-spin"></i>');
              getGPSLocation(function(pos,err){
                $("i:last-child",out).remove();
                if(typeof pos != 'undefined'){
                  //console.log(pos);
                  out.append('<p>'+pos.constructor.name+'</p>');
                }
                if(err){
                  //console.log(err);
                  out.append('<p>'+err+'</p>');
                } else {
                  out.append('<p>Latitude: '+pos.coords.latitude +'<br/>Longitude: ' +pos.coords.longitude+'</p>');
                }
              });
              break;
            case 'clr':
              out.empty();
              $('#video1').hide();
              $("#snap1").hide();
              break;
            case 'vid':
              out.empty();
              var hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
              if (hasGetUserMedia) {
                // Good to go!
                navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                var video = document.querySelector('video');
                var canvas = document.querySelector('canvas');
                var ctx = canvas.getContext('2d');
                $(video).show();
                $("#snap1").show();
                var localMediaStream = null;
                if (navigator.getUserMedia) {
                  var constraints = {
                    audio: false,
                    video: {
  //                      mandatory: {
  //                        width: { min: 640 },
  //                        height: { min: 480 }
  //                      },
                      optional: [
                        { width: 650 },
                        { width: { min: 650 }},
                        { frameRate: 60 },
                        { width: { max: 800 }},
                        { facingMode: "user" }
                      ]
                    }
                   };
                  navigator.getUserMedia(
                    constraints,
                    function(stream) {
                      video.src = window.URL.createObjectURL(stream);
                      localMediaStream = stream;
                      var csize = setTimeout(function() {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        $("#snap1").height = video.videoHeight;
                        $("#snap1").width = video.videoWidth;
                      }, 100);
                      $(video).on('snapshot',function(){
                        console.log('snapshot');
                        if (localMediaStream) {
                          ctx.drawImage(video,0,0);
                          ctx.font="30px Verdana";
                          ctx.fillText("Hello World!",10,50);
                          // "image/webp" works in Chrome.
                          // Other browsers will fall back to image/png.
                          var tmp = canvas.toDataURL('image/webp');
                          //console.log(tmp);
                          $('#snap1').attr('src',tmp);
                        }
                      });
                      video.addEventListener("playing", function () {
                          setTimeout(function () {
                              console.log("Stream dimensions: " + video.videoWidth + "x" + video.videoHeight);
                              console.log($(video));
                          }, 500);
                      });
                    },
                    function(error){
                      out.append('<p>'+error.name+'</p>');
                    }
                  );
                } else {
                  video.src = 'some-fallback-video.webm'; // fallback.
                }
              } else {
                out.append('getUserMedia() is not supported in your browser');
              }
              break;
            default:
              out.append('<i class="fa fa-spinner fa-spin"></i>');
              $.post( "api", {cmd:inp}, function( data ) {
                $("i:last-child",out).remove();
                out.append('<p>'+data.msg+'</p>');
              });
        }
        out.animate({scrollTop:out.height()}, 'slow');
        inp = '';
        break;
      default:
        inp = inp + key;
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
      keycodeD = (e.keyCode ? e.keyCode : e.which);
      if(keycodeD==8) return false;
    })
    .on("keypress", function (e) {
      if (!e) e = window.event;
      keycodeP = (e.keyCode ? e.keyCode : e.which);
      return false;
    })
    .on("keyup", function (e) {
      key = false;

      if(keycodeP){
        key = String.fromCharCode(keycodeP);
      }

      if(keycodeD){
        switch(keycodeD) {
          case 8:
            key = 'BACKSP';
            break;
          case 9:
            key = 'TAB';
            break;
          case 13:
            key = 'ENTER';
            break;
          case 16:
            key = 'SHIFT';
            break;
          case 17:
            key = 'CTRL';
            break;
          case 27:
            key = 'ESC';
            break;
          case 32:
            key = 'SPACE';
            break;
          case 33:
            key = 'PGUP';
            break;
          case 34:
            key = 'PGDN';
            break;
          case 35:
            key = 'END';
            break;
          case 36:
            key = 'HOME';
            break;
          case 37:
            key = 'LEFT';
            break;
          case 38:
            key = 'UP';
            break;
          case 39:
            key = 'RIGHT';
            break;
          case 40:
            key = 'DOWN';
            break;
        }
      }

      //caps = ( ( ( keyCode >= 65 && keyCode <= 90 ) && !shiftKey ) || ( ( keyCode >= 97 && keyCode <= 122 ) && shiftKey ) );

      prompt(key);

      console.log('KBD KEY: '+key );
      keycodeD = keycodeP = false;
      e.preventDefault();
      return false;
    });

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
      console.log('LIFT!');
      console.log(e.target.id);
      if(e.target.id=='video1'){
        $('#'+e.target.id).trigger('snapshot');
      };
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
        if (c) {
          key = c;
        } else {
          key = t;
        }
        switch(key){
          case 'CTRL':
           ctrl = !ctrl;
           $('#kbd').toggleClass('ctrl');
           break;
         case 'CAPS':
           caps = !caps;
           $('#kbd').toggleClass('caps');
           break;
         case 'SHIFT':
           shift = !shift;
           $('#kbd').toggleClass('caps');
           break;
        }
        key = (caps||shift) ? key : key.toLowerCase();
        //console.log('VRT KEY:'+ key);
        prompt(key);
        key = false;
      }
      $('#kbd td').removeClass('dn');
      return false;
    });

});
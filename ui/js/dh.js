/**
 * Diffie Hellman and Xxtea
 */
$(document).ready(function () {

  var mod = str2bigInt(dh.mod, 16),
      gen = str2bigInt(dh.gen, 16),
      A = str2bigInt(dh.A, 16),
      b = str2bigInt(rnd(4), 16),
      b_sec = bigInt2str(powMod(A, b, mod), 16),
      B = powMod(gen, b, mod),
      private_key = '';

  function rnd(l) {
    console.log(dh.rnd);
    var result = "";
    for (var i = 0; i < l; i++) {
      result += dh.rnd.charAt(Math.floor(Math.random() * dh.rnd.length))
    }
    dh.rnd=SparkMD5.hashBinary(dh.rnd);
    return result
  }

  function cvrt(str) {
    var s = atob(str), result = [];
    for (var i = 0; i < s.length; i++) {
      result[i] = s.charCodeAt(i)
    }
    return result
  }

  $('#lsGet').click(function(){
    if(typeof(Storage) !== "undefined") {
      private_key = localStorage.getItem("private_key");
    } else {
      private_key = 'Sorry! No Web Storage support..';
    }
    $('#out').append('Get private key:\n'+private_key+'\n');
  });

  $('#lsSet').click(function(){
    if(typeof(Storage) !== "undefined") {
      var regex = '.{1,32}(\\s|$)|.{32}|.+$';
      private_key = rnd(256).match( RegExp(regex, 'g') ).join('\n');
      localStorage.setItem("private_key",private_key);
      private_key = localStorage.getItem("private_key");
    }
    $('#out').append('Set private key:\n'+private_key+'\n');
  });

  $('#lsExp').click(function(){
    private_key = '# Hydra Terminal Private Key\n# Exported: '+new Date().getTime()+'\n\n'+private_key;
    saveFile('private.key',private_key);
    $('#out').append('Exp private key:\n'+private_key+'\n');
  });

  $('#lsInp').change(function(e){
    loadFile(e,function(content){
      private_key = content;
      if(typeof(Storage) !== "undefined") {
        var re = /^\s|\s*[#;\/\/].*[\n\r]/gm;
        var save = private_key.replace(re, '').replace(/[\n\r]+$/, '');
        localStorage.setItem("private_key",save);
      }
      $('#out').append('Inp private key:\n'+private_key+'\n');
    });
    return false;
  });

  $('#dh').click(function(){
    $.get("dh/" + bigInt2str(B, 16), function (a_sec) {
      if (a_sec === b_sec) {
        var str = "Hello Client! 你好，中国！",
            encrypt_data = xxtea.encrypt(xxtea.toBytes(str), xxtea.toBytes(b_sec)),
            send = (btoa(String.fromCharCode.apply(String, encrypt_data)));
        $('#out').append('send: ' + str + '\n');
        $.post("xxtea", {data: send}, function (reply) {
          reply = cvrt(reply);
          var decrypt_data = xxtea.toString(xxtea.decrypt(reply, xxtea.toBytes(b_sec)));
          $('#out').append('reply: ' + decrypt_data + '\n')
        })
      } else {
        $('#out').append('DH fail')
      }
    });
  });

  /**
   * Init
   */
  if(typeof(Storage) !== "undefined") {
    private_key = localStorage.getItem("private_key");
  }


});
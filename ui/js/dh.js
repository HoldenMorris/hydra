/**
 * Diffie Hellman and Xxtea
 */
$(document).ready(function () {

  var mod = str2bigInt(dh.mod, 16),
      gen = str2bigInt(dh.gen, 16),
      A = str2bigInt(dh.A, 16),
      b = str2bigInt(rnd(), 16),
      b_sec = bigInt2str(powMod(A, b, mod), 16),
      B = powMod(gen, b, mod);

  $.get("dh/" + bigInt2str(B, 16), function (a_sec) {
    if (a_sec === b_sec) {
      var str = "Hello Client! 你好，中国！",
          encrypt_data = xxtea.encrypt(xxtea.toBytes(str), xxtea.toBytes(b_sec)),
          send = (btoa(String.fromCharCode.apply(String, encrypt_data)));
      $('#out').append('send: ' + send + '\n');
      $.post("xxtea", {data: send}, function (reply) {
        reply = cvrt(reply);
        var decrypt_data = xxtea.toString(xxtea.decrypt(reply, xxtea.toBytes(b_sec)));
        $('#out').append('reply: ' + decrypt_data + '\n')
      })
    } else {
      $('#out').append('DH fail')
    }
  });

  function rnd() {
    var result = "";
    for (var i = 0; i < 4; i++) {
      result += dh.rnd.charAt(Math.floor(Math.random() * dh.rnd.length))
    }
    return result
  }

  function cvrt(str) {
    var s = atob(str), result = [];
    for (var i = 0; i < s.length; i++) {
      result[i] = s.charCodeAt(i)
    }
    return result
  }
});
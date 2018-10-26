$(document).ready(function () {
  var regexp = {
    regexp: {
      MOBILE: /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/,
      VCCODE: /^\d{4}$/,
      PASSWORD: /^\S{6,20}$/,
    }
  };
  var COUNTNUM = 60;
  var countdown = COUNTNUM;

  function settime(obj) {
    if (countdown <= 0) {
      $(obj).text('获取验证码');
      countdown = COUNTNUM;
      return;
    } else {
      $(obj).text('重新发送(' + countdown + ')');
      countdown--;
    }
    setTimeout(function () {
      settime(obj)
    }, 1000)
  }

  $('#getCode').click(function (e, v) {
    var v = $('#mobile').val();
    if (countdown == COUNTNUM && regexp.regexp.MOBILE.test(v)) {
      settime(this);
      $.post('/vccode', {
        mobile: v
      }, function (data) {
        if (!data || data.code !== 0) {
          weui.alert('短信没有发成功，请联系管理员');
        }
      });
    } else if (countdown > 0 && countdown < COUNTNUM) {
      weui.toast('已经发送,请留意短信', 1500);
    }
    return false;
  });

  weui.form.checkIfBlur('#form', regexp);

  $('#submitBtn').click(function () {
    weui.form.validate('#form', function (error) {
      if (!error) {
        var loading = weui.loading('提交中...');
        $.post('/register', $('#form').serializeArray(), function (data) {
          loading.hide();
          if (data.code === 0) {
            weui.alert('恭喜您，注册成功！现在去下载APP！', function () {
              window.location.href = '<%- appurl%>';
            });
          } else {
            weui.alert(data.message);
          }
        });
      }
    }, regexp);
  });
});

(function ($) {
  var qrcode = {
    code: "",
    lastTime: null,
    nextTime: null,
    lastCode: null,
    nextCode: null,
    listenerObj: null,
    show: function () {},
    on_key_press: function () {
      var that = this;
      this.listenerObj.keypress(function (e) {
        if (window.event) {
          // IE
          that.nextCode = e.keyCode;
        } else if (e.which) {
          // Netscape/Firefox/Opera
          that.nextCode = e.which;
        }
        if (that.nextCode === 13) {
          if (that.code.length < 3) return; // 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有

          that.show(that.code);
          that.code = "";
          that.lastCode = "";
          that.lastTime = "";
          return;
        }
        that.nextTime = new Date().getTime();
        if (!that.lastTime && !that.lastCode) {
          that.code += e.key;
        }

        if (
          that.lastCode &&
          that.lastTime &&
          that.nextTime - that.lastTime > 30
        ) {
          // 当扫码前有keypress事件时,防止首字缺失
          that.code = e.key;
        } else if (that.lastCode && that.lastTime) {
          that.code += e.key;
        }
        that.lastCode = that.nextCode;
        that.lastTime = that.nextTime;
      });
    },
    startListen: function (listenerObj, settings) {
      for (var member in settings) {
        if (typeof qrcode[member] !== "undefined") {
          qrcode[member] = settings[member];
        }
      }
      qrcode.listenerObj = listenerObj;
      this.on_key_press();
    },
  };
  $.fn.startListen = function (options) {
    var settings = $.extend({}, options);
    qrcode.startListen(this, settings);
  };
})(jQuery);

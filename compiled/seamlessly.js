(function() {
  var Client, win,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  win = this;

  Client = (function() {

    function Client(options) {
      this.onLoad = __bind(this.onLoad, this);
      this.options = options;
      this.init();
    }

    Client.prototype.init = function() {
      this.fetchContainer();
      this.build();
      return this.listen();
    };

    Client.prototype.fetchContainer = function() {
      if (typeof this.options.el === 'string') {
        return this.container = document.querySelectorAll(this.options.el)[0];
      } else {
        return this.container = this.options.el;
      }
    };

    Client.prototype.build = function() {
      this.iframe = document.createElement('iframe');
      this.iframe.setAttribute('src', this.options.src);
      this.iframe.setAttribute('seamless', 'seamless');
      this.iframe.setAttribute('allowtransparency', true);
      this.iframe.setAttribute('frameborder', 0);
      this.iframe.setAttribute('scrolling', 'no');
      this.iframe.setAttribute('horizontalscrolling', 'no');
      this.iframe.setAttribute('verticalscrolling', 'no');
      this.iframe.setAttribute('role', 'application');
      this.iframe.setAttribute('width', '100%');
      this.iframe.addEventListener('load', this.onLoad);
      return this.container.appendChild(this.iframe);
    };

    Client.prototype.publish = function(event, msg) {
      return this.iframe.contentWindow.postMessage([event, msg], '*');
    };

    Client.prototype.listen = function() {
      var _this = this;
      return win.addEventListener('message', function(e) {
        var data, event;
        event = e.data[0];
        data = e.data[1];
        switch (event) {
          case 'setHeight':
            return _this.setHeight(data);
        }
      });
    };

    Client.prototype.setHeight = function(height) {
      console.log('set height');
      return this.iframe.setAttribute('height', height);
    };

    Client.prototype.onLoad = function() {
      this.setReferrer();
      return this.copyCss();
    };

    Client.prototype.setReferrer = function() {
      return this.publish('referrer', win.location.href);
    };

    Client.prototype.copyCss = function() {
      var rule, sheet, _i, _len, _ref, _results;
      _ref = document.styleSheets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sheet = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = sheet.rules;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            rule = _ref1[_j];
            _results1.push(this.publish('css', rule.cssText));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Client;

  })();

  this.Seamlessly = function(options) {
    return new Client(options);
  };

}).call(this);

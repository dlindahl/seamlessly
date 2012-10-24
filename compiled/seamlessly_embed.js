(function() {
  var Embed, debounce, win,
    __slice = [].slice,
    _this = this;

  win = this;

  debounce = function(func, threshold, execAsap) {
    var timeout;
    timeout = null;
    return function() {
      var args, delayed, obj;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      obj = this;
      delayed = function() {
        if (!execAsap) {
          func.apply(obj, args);
        }
        return timeout = null;
      };
      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }
      return timeout = setTimeout(delayed, threshold || 100);
    };
  };

  Embed = {
    init: function() {
      this.subscribeToMessages();
      this.listenForChanges();
      return this.publishSize();
    },
    publish: function(evt, msg) {
      return win.parent.postMessage([evt, msg], '*');
    },
    publishSize: debounce((function() {
      return Embed.publish('setHeight', document.querySelector('html').offsetHeight);
    }), 50),
    listenForChanges: function() {
      var config, observer, target;
      target = document.querySelector('html');
      observer = new WebKitMutationObserver(this.onMutation);
      config = {
        attributes: true,
        childList: true,
        characterData: true
      };
      return observer.observe(target, config);
    },
    subscribeToMessages: function() {
      return win.addEventListener('message', this.onMessage, false);
    },
    onMessage: function(e) {
      var data, eventName, fn;
      eventName = e.data[0];
      eventName = eventName[0].toUpperCase() + eventName.slice(1);
      data = e.data[1];
      fn = Embed["on" + eventName];
      if (fn) {
        return fn.call(Embed, data);
      }
    },
    onMutation: function() {
      return _this.resize();
    },
    onReferrer: function(data) {
      var base;
      base = document.createElement('base');
      base.setAttribute('href', data);
      base.setAttribute('target', '_parent');
      return document.getElementsByTagName('head')[0].appendChild(base);
    },
    onCss: function(data) {
      var style;
      style = document.createElement('style');
      style.innerHTML = data;
      document.getElementsByTagName('head')[0].appendChild(style);
      return this.publishSize();
    }
  };

  Embed.init();

}).call(this);

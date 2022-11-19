(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WebMonitor = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  /**
   * A method to send data.
   * @param url API url
   * @param key report key
   * @param value report value
   * @param type blob type
   */
  function reportEvent(url, key, value, type) {
    var data = {
      key: key,
      value: value
    };
    var blobData = new Blob([JSON.stringify(data)], {
      type: type ? type : 'application/x-www-form-urlencoded'
    });
    navigator.sendBeacon(url, blobData);
  }

  function createJsErrorMonitor(url) {
    window.addEventListener('error', function (e) {
      var message = e.message,
        type = e.type,
        lineno = e.lineno,
        colno = e.colno,
        error = e.error;
      reportEvent(url, type, {
        message: message,
        lineno: lineno,
        colno: colno,
        stack: error.stack
      });
    });
    window.addEventListener('unhandledrejection', function (e) {
      reportEvent(url, e.type, {
        reason: e.reason
      });
    });
  }

  function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var prefix = 'data-event';
  var DomMonitor = /*#__PURE__*/function () {
    function DomMonitor(url, domConfig) {
      _classCallCheck(this, DomMonitor);
      this.url = url;
      this.domConfig = Object.assign(this.normalizeDomConfig(), domConfig);
      this.eventMonitor();
      this.visibilityMonitor();
    }
    _createClass(DomMonitor, [{
      key: "normalizeDomConfig",
      value: function normalizeDomConfig() {
        return {
          visibility: true,
          root: null,
          threshold: 0.2,
          event: true,
          eventListeners: ['click']
        };
      }
    }, {
      key: "eventMonitor",
      value: function eventMonitor() {
        var _this = this;
        if (this.domConfig.event === false) return;
        var root = this.domConfig.root;
        if (!root) return;
        this.domConfig.eventListeners.forEach(function (eventType) {
          root.addEventListener(eventType, function (e) {
            var target = e.target;
            if (!target.hasAttribute("".concat(prefix, "-").concat(eventType))) return;
            var value = target.getAttribute("".concat(prefix, "-").concat(eventType)) || '';
            reportEvent(_this.url, eventType, value);
          }, {
            capture: true
          });
        });
      }
    }, {
      key: "visibilityMonitor",
      value: function visibilityMonitor() {
        var _this2 = this;
        var _this$domConfig = this.domConfig,
          root = _this$domConfig.root,
          threshold = _this$domConfig.threshold;
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            var intersectionRatio = entry.intersectionRatio,
              target = entry.target;
            if (!target.hasAttribute('data-expose')) return;
            if (intersectionRatio >= threshold) {
              var value = target.getAttribute('data-expose') || '';
              reportEvent(_this2.url, 'expose', value);
            }
          });
        }, {
          root: root,
          threshold: threshold
        });
        this.traverseNode(root, observer);
      }
    }, {
      key: "traverseNode",
      value: function traverseNode(root, observer) {
        if (!root) return;
        var _iterator = _createForOfIteratorHelper$1(root.children),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var node = _step.value;
            if (node.hasAttribute('data-expose')) {
              observer.observe(node);
            }
            if (node.children.length) {
              this.traverseNode(node, observer);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }]);
    return DomMonitor;
  }();

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var loadedResources = [];
  /** When performace API is not supported by browser */
  var isFirstLoad = true;
  var loadedErrors = [];
  var loadedStyleSheets = [];
  var loadedScripts = [];
  var loadedImages = [];
  /** */
  var reportUrl = '';
  function createResourceMonitor(url) {
    reportUrl = url;
    listenOnResourceLoadFailed();
    if (window.performance) {
      resourcePerfWatch();
    } else {
      listenOnload();
    }
  }
  function resourcePerfWatch() {
    var entries = performance.getEntriesByType('resource');
    // filter sendBeacon requests because it's used to post data only so we could ignore.
    loadedResources = entries.filter(function (entry) {
      return entry.initiatorType !== 'beacon';
    });
    // loadedResources.forEach(entry => {
    //   console.log('first resource loads entry', entry)
    // })
    // clear resource information on page first load 
    performance.clearResourceTimings();
    // monitor subsequent resource loading information
    // this API cannot distinguish the status is success or not when resource is loaded, 
    // thus we've to manually filter the failed loadings by listening error.
    var perfObserver = new PerformanceObserver(function (list) {
      var _list = list.getEntries();
      loadedResources = _list.filter(function (entry) {
        return entry.initiatorType !== 'beacon';
      });
      // loadedResources.forEach(entry => {
      //   console.log('daynamic loaded resource', entry)
      // })
    });

    perfObserver.observe({
      entryTypes: ['resource']
    });
  }
  function listenOnload() {
    document.onreadystatechange = function (e) {
      if (document.readyState === 'complete') {
        var target = e.target;
        var styleSheets = target.styleSheets,
          scripts = target.scripts,
          images = target.images;
        var _iterator = _createForOfIteratorHelper(styleSheets),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            if (item.href) {
              loadedStyleSheets.push(item);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var _iterator2 = _createForOfIteratorHelper(scripts),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _item = _step2.value;
            if (_item.src) {
              loadedScripts.push(_item);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var _iterator3 = _createForOfIteratorHelper(images),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _item2 = _step3.value;
            if (_item2.src) {
              loadedImages.push(_item2);
            }
          }
          // first load
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        loadedErrors.forEach(function (e) {
          var target = e.target;
          var url = (target || HTMLImageElement).src || target.href;
          filterFailedResources(e.target, e.type, url);
        });
        isFirstLoad = false;
      }
    };
  }
  function filterFailedResources(target, type, url) {
    target instanceof HTMLLinkElement && loadedStyleSheets.forEach(function (resource) {
      if (resource.href === url) {
        reportEvent(reportUrl, type, {
          target: target.tagName.toLowerCase(),
          url: url
        });
      }
    });
    target instanceof HTMLScriptElement && loadedScripts.forEach(function (resource) {
      if (resource.src === url) {
        reportEvent(reportUrl, type, {
          target: target.tagName.toLowerCase(),
          url: url
        });
      }
    });
    target instanceof HTMLImageElement && loadedImages.forEach(function (resource) {
      if (resource.src === url) {
        reportEvent(reportUrl, type, {
          target: target.tagName.toLowerCase(),
          url: url
        });
      }
    });
  }
  function listenOnResourceLoadFailed() {
    window.addEventListener('error', function (e) {
      // filter js error
      var target = e.target;
      var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
      if (!isElementTarget) return false;
      var url = (target || HTMLImageElement).src || target.href;
      if (window.performance) {
        loadedResources.forEach(function (resource) {
          if (resource.name === url) {
            reportEvent(reportUrl, e.type, {
              target: resource.initiatorType,
              url: url
            });
          }
        });
        loadedResources = [];
      } else {
        if (isFirstLoad) {
          loadedErrors.push(e);
        } else {
          reportEvent(reportUrl, e.type, {
            target: e.target.tagName.toLowerCase(),
            url: url
          });
        }
      }
    }, {
      capture: true
    });
  }

  var WebMonitor = /*#__PURE__*/function () {
    function WebMonitor(config) {
      _classCallCheck(this, WebMonitor);
      this.config = Object.assign(this.normalizeConfig(), config);
      window.$monitorConfig = this.config;
      var _this$config = this.config,
        url = _this$config.url,
        jsError = _this$config.jsError,
        resource = _this$config.resource;
      jsError && createJsErrorMonitor(url);
      resource && createResourceMonitor(url);
    }
    _createClass(WebMonitor, [{
      key: "normalizeConfig",
      value: function normalizeConfig() {
        return {
          domMonitor: false,
          jsError: true,
          resource: true,
          url: ''
        };
      }
      /**
       * Create a DOM observer
       */
    }, {
      key: "createDOMMonitor",
      value: function createDOMMonitor(domConfig) {
        new DomMonitor(this.config.url, domConfig);
        return this;
      }
    }]);
    return WebMonitor;
  }();

  return WebMonitor;

}));

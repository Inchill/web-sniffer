(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WebSniffer = {}));
})(this, (function (exports) { 'use strict';

  function createJsErrorWatcher(onReport) {
    if (typeof onReport !== 'function') return;
    window.addEventListener('error', function (e) {
      var data = {
        type: e.type,
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      };
      try {
        onReport(data);
      } catch (_a) {
        // Do nothing.
      }
    });
    window.addEventListener('unhandledrejection', function (e) {
      var data = {
        reason: e.reason
      };
      try {
        onReport(data);
      } catch (_a) {
        // Do nothing.
      }
    });
  }

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

  function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var eventPrefix = 'data-event';
  var exposePrefix = 'data-expose';
  var DomWatcher = /*#__PURE__*/function () {
    function DomWatcher(domConfig, onReport) {
      _classCallCheck(this, DomWatcher);
      this.domConfig = Object.assign(this.normalizeDomConfig(), domConfig);
      this.onReport = onReport;
      this.domConfig.visibility && this.visibilityWatcher();
      this.domConfig.event && this.eventWatcher();
    }
    _createClass(DomWatcher, [{
      key: "normalizeDomConfig",
      value: function normalizeDomConfig() {
        return {
          visibility: false,
          root: document.documentElement,
          threshold: 0.2,
          event: false,
          eventListeners: ['click']
        };
      }
    }, {
      key: "eventWatcher",
      value: function eventWatcher() {
        var _this = this;
        var root = this.domConfig.root;
        if (!root || !(root instanceof HTMLElement)) return;
        this.domConfig.eventListeners.forEach(function (eventType) {
          root.addEventListener(eventType, function (e) {
            var target = e.target;
            if (!target.hasAttribute("".concat(eventPrefix))) return;
            var value = target.getAttribute("".concat(eventPrefix)) || '';
            var data = {
              key: eventType,
              value: value
            };
            try {
              _this.onReport(data);
            } catch (_a) {
              // Do nothing.
            }
          }, {
            capture: true
          });
        });
      }
    }, {
      key: "visibilityWatcher",
      value: function visibilityWatcher() {
        var _this2 = this;
        var _this$domConfig = this.domConfig,
          root = _this$domConfig.root,
          threshold = _this$domConfig.threshold;
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            var intersectionRatio = entry.intersectionRatio,
              target = entry.target;
            if (!target.hasAttribute("".concat(exposePrefix))) return;
            if (intersectionRatio >= threshold) {
              var value = target.getAttribute("".concat(exposePrefix)) || '';
              var data = {
                key: 'expose',
                value: value
              };
              try {
                _this2.onReport(data);
              } catch (_a) {
                // Do nothing.
              }
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
            if (node.hasAttribute("".concat(exposePrefix))) {
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
    return DomWatcher;
  }();
  /**
   *
   * @param domConfig A specific dom configuration.
   * @param onReport A dom visibility change and event report callback function.
   * @returns A domWatcher instance.
   */
  function createDomWatcher(domConfig, onReport) {
    return new DomWatcher(domConfig, onReport);
  }

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
  var onReportFn;
  function createResourceWatcher(onReport) {
    onReportFn = onReport;
    onResourceLoadFailed();
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
        var data = {
          tagName: target.tagName.toLowerCase(),
          url: url
        };
        try {
          onReportFn(data);
        } catch (_a) {
          // Do nothing.
        }
      }
    });
    target instanceof HTMLScriptElement && loadedScripts.forEach(function (resource) {
      if (resource.src === url) {
        var data = {
          tagName: target.tagName.toLowerCase(),
          url: url
        };
        try {
          onReportFn(data);
        } catch (_a) {
          // Do nothing.
        }
      }
    });
    target instanceof HTMLImageElement && loadedImages.forEach(function (resource) {
      if (resource.src === url) {
        var data = {
          tagName: target.tagName.toLowerCase(),
          url: url
        };
        try {
          onReportFn(data);
        } catch (_a) {
          // Do nothing.
        }
      }
    });
  }
  function onResourceLoadFailed() {
    window.addEventListener('error', function (e) {
      // filter js error
      var target = e.target;
      var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement || target instanceof HTMLVideoElement || target instanceof HTMLSourceElement || target instanceof HTMLAudioElement;
      if (!isElementTarget) return false;
      var url = (target || HTMLImageElement || HTMLVideoElement || HTMLSourceElement || HTMLAudioElement).src || target.href;
      if (window.performance) {
        loadedResources.forEach(function (resource) {
          if (resource.name === url) {
            var data = {
              tagName: resource.initiatorType,
              url: url
            };
            try {
              onReportFn(data);
            } catch (_a) {
              // Do nothing.
            }
          }
        });
        loadedResources = [];
      } else {
        if (isFirstLoad) {
          loadedErrors.push(e);
        } else {
          var data = {
            tagName: e.target.tagName.toLowerCase(),
            url: url
          };
          try {
            onReportFn(data);
          } catch (_a) {
            // Do nothing.
          }
        }
      }
    }, {
      capture: true
    });
  }

  function createRouteWatcher(onReport) {
    window.onhashchange = function (hash) {
      var oldURL = hash.oldURL,
        newURL = hash.newURL;
      onReport({
        oldURL: oldURL,
        newURL: newURL
      });
    };
    onEvents(['pushState', 'replaceState'], onReport);
    window.history.pushState = createHistoryEvent('pushState');
    window.history.replaceState = createHistoryEvent('replaceState');
  }
  function createHistoryEvent(type) {
    var origin = history[type];
    return function () {
      // eslint-disable-next-line prefer-rest-params
      var res = origin.apply(this, arguments);
      var event = new Event(type);
      window.dispatchEvent(event);
      return res;
    };
  }
  function onEvents(events, onReport) {
    events.forEach(function (event) {
      window.addEventListener(event, function (evt) {
        var target = evt.target;
        var _target$location = target.location,
          href = _target$location.href,
          origin = _target$location.origin;
        onReport({
          newURL: href,
          oldURL: origin
        });
      });
    });
  }

  exports.createDomWatcher = createDomWatcher;
  exports.createJsErrorWatcher = createJsErrorWatcher;
  exports.createResourceWatcher = createResourceWatcher;
  exports.createRouteWatcher = createRouteWatcher;

}));

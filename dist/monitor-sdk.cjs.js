"use strict";

function t(t, e, o, i) {
    const n = {
        key: e,
        value: o
    }, r = new Blob([ JSON.stringify(n) ], {
        type: i || "application/x-www-form-urlencoded"
    });
    navigator.sendBeacon(t, r);
}

class e {
    constructor(t, e) {
        this.url = t, this.domConfig = Object.assign(this.normalizeDomConfig(), e), this.eventMonitor(), 
        this.visibilityMonitor();
    }
    normalizeDomConfig() {
        return {
            visibility: !0,
            root: null,
            threshold: .2,
            event: !0,
            eventListeners: [ "click" ]
        };
    }
    eventMonitor() {
        if (!1 === this.domConfig.event) {
            return;
        }
        const {root: e} = this.domConfig;
        e && this.domConfig.eventListeners.forEach((o => {
            e.addEventListener(o, (e => {
                const i = e.target.getAttribute("data-click") || "";
                t(this.url, o, i);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: e, threshold: o} = this.domConfig, i = new IntersectionObserver((e => {
            e.forEach((e => {
                const {intersectionRatio: i, target: n} = e;
                if (n.hasAttribute("data-expose") && i >= o) {
                    const e = n.getAttribute("data-expose") || "";
                    t(this.url, "expose", e);
                }
            }));
        }), {
            root: e,
            threshold: o
        });
        this.traverseNode(e, i);
    }
    traverseNode(t, e) {
        if (t) {
            for (const o of t.children) {
                o.hasAttribute("data-expose") && e.observe(o), o.children.length && this.traverseNode(o, e);
            }
        }
    }
}

module.exports = class {
    constructor(e) {
        this.config = Object.assign(this.normalizeConfig(), e), window.$monitorConfig = this.config;
        const {url: o, jsError: i, resource: n} = this.config;
        i && function(e) {
            window.addEventListener("error", (o => {
                const {message: i, type: n, lineno: r, colno: s, error: c} = o;
                t(e, n, {
                    message: i,
                    lineno: r,
                    colno: s,
                    stack: c.stack
                });
            })), window.addEventListener("unhandledrejection", (o => {
                t(e, o.type, {
                    reason: o.reason
                });
            }));
        }(o);
    }
    normalizeConfig() {
        return {
            domMonitor: !1,
            jsError: !0,
            resource: !0,
            url: ""
        };
    }
    createDOMMonitor(t) {
        return new e(this.config.url, t), this;
    }
};

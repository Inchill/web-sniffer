"use strict";

function e(e, o, t, r) {
    const n = {
        key: o,
        value: t
    }, i = new Blob([ JSON.stringify(n) ], {
        type: r || "application/x-www-form-urlencoded"
    });
    navigator.sendBeacon(e, i);
}

class o {
    constructor(e, o) {
        this.url = e, this.domConfig = Object.assign(this.normalizeDomConfig(), o), this.eventMonitor(), 
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
        const {root: o} = this.domConfig;
        o && this.domConfig.eventListeners.forEach((t => {
            o.addEventListener(t, (o => {
                const r = o.target.getAttribute("data-click") || "";
                e(this.url, t, r);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: o, threshold: t} = this.domConfig, r = new IntersectionObserver((o => {
            o.forEach((o => {
                const {intersectionRatio: r, target: n} = o;
                if (n.hasAttribute("data-expose") && r >= t) {
                    const o = n.getAttribute("data-expose") || "";
                    e(this.url, "expose", o);
                }
            }));
        }), {
            root: o,
            threshold: t
        });
        this.traverseNode(o, r);
    }
    traverseNode(e, o) {
        if (e) {
            for (const t of e.children) {
                t.hasAttribute("data-expose") && o.observe(t), t.children.length && this.traverseNode(t, o);
            }
        }
    }
}

function t() {
    window.performance ? r() : window.onload = e => {
        console.log(e);
    };
}

function r() {
    new PerformanceObserver((e => {})).observe({
        entryTypes: [ "resource" ]
    });
    let e = performance.getEntriesByType("resource");
    e = e.filter((e => "beacon" !== e.initiatorType));
    for (const o of e) {
        console.log("entry", o);
    }
    performance.clearResourceTimings(), setTimeout(r, 2e3);
}

module.exports = class {
    constructor(o) {
        this.config = Object.assign(this.normalizeConfig(), o), window.$monitorConfig = this.config;
        const {url: r, jsError: n, resource: i} = this.config;
        n && function(o) {
            window.addEventListener("error", (t => {
                const {message: r, type: n, lineno: i, colno: s, error: c} = t;
                e(o, n, {
                    message: r,
                    lineno: i,
                    colno: s,
                    stack: c.stack
                });
            })), window.addEventListener("unhandledrejection", (t => {
                e(o, t.type, {
                    reason: t.reason
                });
            }));
        }(r), i && t();
    }
    normalizeConfig() {
        return {
            domMonitor: !1,
            jsError: !0,
            resource: !0,
            url: ""
        };
    }
    createDOMMonitor(e) {
        return new o(this.config.url, e), this;
    }
};

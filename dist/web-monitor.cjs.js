"use strict";

function e(e, t, o, n) {
    const r = {
        key: t,
        value: o
    }, i = new Blob([ JSON.stringify(r) ], {
        type: n || "application/x-www-form-urlencoded"
    });
    navigator.sendBeacon(e, i);
}

class t {
    constructor(e, t) {
        this.url = e, this.domConfig = Object.assign(this.normalizeDomConfig(), t), this.eventMonitor(), 
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
        const {root: t} = this.domConfig;
        t && this.domConfig.eventListeners.forEach((o => {
            t.addEventListener(o, (t => {
                const n = t.target.getAttribute("data-click") || "";
                e(this.url, o, n);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: o} = this.domConfig, n = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: n, target: r} = t;
                if (r.hasAttribute("data-expose") && n >= o) {
                    const t = r.getAttribute("data-expose") || "";
                    e(this.url, "expose", t);
                }
            }));
        }), {
            root: t,
            threshold: o
        });
        this.traverseNode(t, n);
    }
    traverseNode(e, t) {
        if (e) {
            for (const o of e.children) {
                o.hasAttribute("data-expose") && t.observe(o), o.children.length && this.traverseNode(o, t);
            }
        }
    }
}

let o = [], n = "";

function r(t) {
    n = t, window.addEventListener("error", (t => {
        let r = t.target;
        if (!(r instanceof HTMLScriptElement || r instanceof HTMLLinkElement || r instanceof HTMLImageElement)) {
            return !1;
        }
        const i = (r || HTMLImageElement).src || r.href;
        o.forEach((o => {
            o.name === i && e(n, t.type, {
                target: o.initiatorType,
                url: i
            });
        })), o = [];
    }), {
        capture: !0
    }), window.performance ? function() {
        let e = performance.getEntriesByType("resource");
        o = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            let t = e.getEntries();
            o = t.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : window.addEventListener("load", (e => {
        console.log(e);
    }));
}

module.exports = class {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), window.$monitorConfig = this.config;
        const {url: o, jsError: n, resource: i} = this.config;
        n && function(t) {
            window.addEventListener("error", (o => {
                const {message: n, type: r, lineno: i, colno: s, error: a} = o;
                e(t, r, {
                    message: n,
                    lineno: i,
                    colno: s,
                    stack: a.stack
                });
            })), window.addEventListener("unhandledrejection", (o => {
                e(t, o.type, {
                    reason: o.reason
                });
            }));
        }(o), i && r(o);
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
        return new t(this.config.url, e), this;
    }
};

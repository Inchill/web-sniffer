"use strict";

function e(e, t, o, r) {
    const n = {
        key: t,
        value: o
    }, i = new Blob([ JSON.stringify(n) ], {
        type: r || "application/x-www-form-urlencoded"
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
                const r = t.target.getAttribute("data-click") || "";
                e(this.url, o, r);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: o} = this.domConfig, r = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: r, target: n} = t;
                if (n.hasAttribute("data-expose") && r >= o) {
                    const t = n.getAttribute("data-expose") || "";
                    e(this.url, "expose", t);
                }
            }));
        }), {
            root: t,
            threshold: o
        });
        this.traverseNode(t, r);
    }
    traverseNode(e, t) {
        if (e) {
            for (const o of e.children) {
                o.hasAttribute("data-expose") && t.observe(o), o.children.length && this.traverseNode(o, t);
            }
        }
    }
}

let o = [], r = "";

function n(t) {
    r = t, window.addEventListener("error", (t => {
        let n = t.target;
        if (!(n instanceof HTMLScriptElement || n instanceof HTMLLinkElement || n instanceof HTMLImageElement)) {
            return !1;
        }
        console.log("error", t);
        const i = n.src || n.src || n.href;
        o.forEach((o => {
            o.name === i && e(r, t.type, {
                target: o.initiatorType,
                url: i
            });
        })), o = [];
    }), {
        capture: !0
    }), window.performance ? function() {
        let e = performance.getEntriesByType("resource");
        o = e.filter((e => "beacon" !== e.initiatorType)), o.forEach((e => {
            console.log("first resource loads entry", e);
        })), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            let t = e.getEntries();
            o = t.filter((e => "beacon" !== e.initiatorType)), o.forEach((e => {
                console.table(e);
            }));
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
        const {url: o, jsError: r, resource: i} = this.config;
        r && function(t) {
            window.addEventListener("error", (o => {
                const {message: r, type: n, lineno: i, colno: s, error: c} = o;
                e(t, n, {
                    message: r,
                    lineno: i,
                    colno: s,
                    stack: c.stack
                });
            })), window.addEventListener("unhandledrejection", (o => {
                e(t, o.type, {
                    reason: o.reason
                });
            }));
        }(o), i && n(o);
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

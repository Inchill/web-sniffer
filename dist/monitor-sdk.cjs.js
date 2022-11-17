"use strict";

function o(o, t, e, i) {
    const n = {
        key: t,
        value: e
    }, r = new Blob([ JSON.stringify(n) ], {
        type: i || "application/x-www-form-urlencoded"
    });
    navigator.sendBeacon(o, r);
}

module.exports = class {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), this.domConfig = this.normalizeDomConfig(), 
        window.$monitorConfig = this.config;
        const {url: e, jsError: i} = this.config;
        i && function(t) {
            window.addEventListener("error", (e => {
                const {message: i, type: n, lineno: r, colno: s, error: a} = e;
                o(t, n, {
                    message: i,
                    lineno: r,
                    colno: s,
                    stack: a.stack
                });
            })), window.addEventListener("unhandledrejection", (e => {
                o(t, e.type, {
                    reason: e.reason
                });
            }));
        }(e);
    }
    normalizeConfig() {
        return {
            domMonitor: !1,
            jsError: !0,
            resource: !0,
            url: ""
        };
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
    createDOMMonitor(o) {
        if (!1 !== this.config.domMonitor) {
            return this.domConfig = Object.assign(this.domConfig, o), this.eventMonitor(), this.visibilityMonitor(), 
            this;
        }
    }
    eventMonitor() {
        if (!1 === this.domConfig.event) {
            return;
        }
        const {root: o} = this.domConfig;
        o && this.domConfig.eventListeners.forEach((t => {
            o.addEventListener(t, (o => {
                o.target.getAttribute("data-click");
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: o, threshold: t} = this.domConfig, e = new IntersectionObserver((o => {
            o.forEach((o => {
                const {intersectionRatio: t, target: e} = o;
                e.hasAttribute("data-expose");
            }));
        }), {
            root: o,
            threshold: t
        });
        this.traverseNode(o, e);
    }
    traverseNode(o, t) {
        if (o) {
            for (const e of o.children) {
                e.hasAttribute("data-expose") && t.observe(e), e.children.length && this.traverseNode(e, t);
            }
        }
    }
};

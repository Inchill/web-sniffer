"use strict";

module.exports = class {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), this.domConfig = this.normalizeDomConfig(), 
        window.$monitorConfig = this.config;
    }
    normalizeConfig() {
        return {
            domMonitor: !1
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
    reportEvent(t, o, e) {
        const i = this.config.sendUrl, n = {
            key: t,
            value: o
        }, r = new Blob([ JSON.stringify(n) ], {
            type: e || "application/x-www-form-urlencoded"
        });
        navigator.sendBeacon(i, r);
    }
    createDOMMonitor(t) {
        !1 !== this.config.domMonitor && (this.domConfig = Object.assign(this.domConfig, t), 
        this.eventMonitor(), this.visibilityMonitor());
    }
    eventMonitor() {
        !1 !== this.domConfig.event && this.domConfig.eventListeners.forEach((t => {
            window.document.body.addEventListener(t, (o => {
                const e = o.target.getAttribute("data-click");
                this.reportEvent(t, e);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: o} = this.domConfig, e = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: e, target: i} = t;
                i.hasAttribute("data-expose") && e >= o && this.reportEvent("expose", i.getAttribute("data-expose"));
            }));
        }), {
            root: t,
            threshold: o
        });
        this.traverseNode(t, e);
    }
    traverseNode(t, o) {
        if (t) {
            for (const e of t.children) {
                e.hasAttribute("data-expose") && o.observe(e), e.children.length && this.traverseNode(e, o);
            }
        }
    }
};

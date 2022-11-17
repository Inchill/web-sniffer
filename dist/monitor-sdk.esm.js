class t {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), this.domConfig = this.normalizeDomConfig(), 
        window.$monitorConfig = this.config, this.config.jsError && this.createJsErrorMonitor();
    }
    normalizeConfig() {
        return {
            domMonitor: !1,
            jsError: !1
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
    reportEvent(t, e, o) {
        const i = this.config.sendUrl, r = {
            key: t,
            value: e
        }, n = new Blob([ JSON.stringify(r) ], {
            type: o || "application/x-www-form-urlencoded"
        });
        navigator.sendBeacon(i, n);
    }
    createDOMMonitor(t) {
        if (!1 !== this.config.domMonitor) {
            return this.domConfig = Object.assign(this.domConfig, t), this.eventMonitor(), this.visibilityMonitor(), 
            this;
        }
    }
    eventMonitor() {
        if (!1 === this.domConfig.event) {
            return;
        }
        const {root: t} = this.domConfig;
        t && this.domConfig.eventListeners.forEach((e => {
            t.addEventListener(e, (t => {
                const o = t.target.getAttribute("data-click");
                this.reportEvent(e, o);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: e} = this.domConfig, o = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: o, target: i} = t;
                i.hasAttribute("data-expose") && o >= e && this.reportEvent("expose", i.getAttribute("data-expose"));
            }));
        }), {
            root: t,
            threshold: e
        });
        this.traverseNode(t, o);
    }
    traverseNode(t, e) {
        if (t) {
            for (const o of t.children) {
                o.hasAttribute("data-expose") && e.observe(o), o.children.length && this.traverseNode(o, e);
            }
        }
    }
    createJsErrorMonitor() {
        window.addEventListener("error", (t => {
            const {message: e, type: o, lineno: i, colno: r, error: n} = t;
            this.reportEvent(o, {
                message: e,
                lineno: i,
                colno: r,
                stack: n.stack
            });
        })), window.addEventListener("unhandledrejection", (t => {
            this.reportEvent(t.type, {
                reason: t.reason
            });
        }));
    }
}

export { t as default };

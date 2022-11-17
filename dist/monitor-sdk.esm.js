function e(e, o, t, n) {
    const r = {
        key: o,
        value: t
    }, i = new Blob([ JSON.stringify(r) ], {
        type: n || "application/x-www-form-urlencoded"
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
                const n = o.target.getAttribute("data-click") || "";
                e(this.url, t, n);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: o, threshold: t} = this.domConfig, n = new IntersectionObserver((o => {
            o.forEach((o => {
                const {intersectionRatio: n, target: r} = o;
                if (r.hasAttribute("data-expose") && n >= t) {
                    const o = r.getAttribute("data-expose") || "";
                    e(this.url, "expose", o);
                }
            }));
        }), {
            root: o,
            threshold: t
        });
        this.traverseNode(o, n);
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
    window.performance ? n() : window.onload = e => {
        console.log(e);
    };
}

function n() {
    new PerformanceObserver((e => {})).observe({
        entryTypes: [ "resource" ]
    });
    let e = performance.getEntriesByType("resource");
    e = e.filter((e => "beacon" !== e.initiatorType));
    for (const o of e) {
        console.log("entry", o);
    }
    performance.clearResourceTimings(), setTimeout(n, 2e3);
}

class r {
    constructor(o) {
        this.config = Object.assign(this.normalizeConfig(), o), window.$monitorConfig = this.config;
        const {url: n, jsError: r, resource: i} = this.config;
        r && function(o) {
            window.addEventListener("error", (t => {
                const {message: n, type: r, lineno: i, colno: s, error: c} = t;
                e(o, r, {
                    message: n,
                    lineno: i,
                    colno: s,
                    stack: c.stack
                });
            })), window.addEventListener("unhandledrejection", (t => {
                e(o, t.type, {
                    reason: t.reason
                });
            }));
        }(n), i && t();
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
}

export { r as default };

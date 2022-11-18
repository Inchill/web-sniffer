function e(e, t, n, o) {
    const r = {
        key: t,
        value: n
    }, i = new Blob([ JSON.stringify(r) ], {
        type: o || "application/x-www-form-urlencoded"
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
        t && this.domConfig.eventListeners.forEach((n => {
            t.addEventListener(n, (t => {
                const o = t.target;
                if (!o.hasAttribute(`data-event-${n}`)) {
                    return;
                }
                const r = o.getAttribute(`data-event-${n}`) || "";
                e(this.url, n, r);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: n} = this.domConfig, o = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: o, target: r} = t;
                if (r.hasAttribute("data-expose") && o >= n) {
                    const t = r.getAttribute("data-expose") || "";
                    e(this.url, "expose", t);
                }
            }));
        }), {
            root: t,
            threshold: n
        });
        this.traverseNode(t, o);
    }
    traverseNode(e, t) {
        if (e) {
            for (const n of e.children) {
                n.hasAttribute("data-expose") && t.observe(n), n.children.length && this.traverseNode(n, t);
            }
        }
    }
}

let n = [], o = "";

function r(t) {
    o = t, window.addEventListener("error", (t => {
        let r = t.target;
        if (!(r instanceof HTMLScriptElement || r instanceof HTMLLinkElement || r instanceof HTMLImageElement)) {
            return !1;
        }
        const i = (r || HTMLImageElement).src || r.href;
        n.forEach((n => {
            n.name === i && e(o, t.type, {
                target: n.initiatorType,
                url: i
            });
        })), n = [];
    }), {
        capture: !0
    }), window.performance ? function() {
        let e = performance.getEntriesByType("resource");
        n = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            let t = e.getEntries();
            n = t.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : window.addEventListener("load", (e => {
        console.log(e);
    }));
}

class i {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), window.$monitorConfig = this.config;
        const {url: n, jsError: o, resource: i} = this.config;
        o && function(t) {
            window.addEventListener("error", (n => {
                const {message: o, type: r, lineno: i, colno: s, error: a} = n;
                e(t, r, {
                    message: o,
                    lineno: i,
                    colno: s,
                    stack: a.stack
                });
            })), window.addEventListener("unhandledrejection", (n => {
                e(t, n.type, {
                    reason: n.reason
                });
            }));
        }(n), i && r(n);
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
}

export { i as default };

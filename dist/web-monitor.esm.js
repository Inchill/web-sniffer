function e(e, t, r, o) {
    const n = {
        key: t,
        value: r
    }, i = new Blob([ JSON.stringify(n) ], {
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
        t && this.domConfig.eventListeners.forEach((r => {
            t.addEventListener(r, (t => {
                const o = t.target;
                if (!o.hasAttribute(`data-event-${r}`)) {
                    return;
                }
                const n = o.getAttribute(`data-event-${r}`) || "";
                e(this.url, r, n);
            }), {
                capture: !0
            });
        }));
    }
    visibilityMonitor() {
        const {root: t, threshold: r} = this.domConfig, o = new IntersectionObserver((t => {
            t.forEach((t => {
                const {intersectionRatio: o, target: n} = t;
                if (n.hasAttribute("data-expose") && o >= r) {
                    const t = n.getAttribute("data-expose") || "";
                    e(this.url, "expose", t);
                }
            }));
        }), {
            root: t,
            threshold: r
        });
        this.traverseNode(t, o);
    }
    traverseNode(e, t) {
        if (e) {
            for (const r of e.children) {
                r.hasAttribute("data-expose") && t.observe(r), r.children.length && this.traverseNode(r, t);
            }
        }
    }
}

let r = [], o = !0, n = [], i = [], s = [], a = [], c = "";

function f(t) {
    c = t, window.addEventListener("error", (t => {
        let i = t.target;
        if (!(i instanceof HTMLScriptElement || i instanceof HTMLLinkElement || i instanceof HTMLImageElement)) {
            return !1;
        }
        const s = (i || HTMLImageElement).src || i.href;
        window.performance ? (r.forEach((r => {
            r.name === s && e(c, t.type, {
                target: r.initiatorType,
                url: s
            });
        })), r = []) : o ? n.push(t) : e(c, t.type, {
            target: t.target.tagName.toLowerCase(),
            url: s
        });
    }), {
        capture: !0
    }), window.performance ? function() {
        let e = performance.getEntriesByType("resource");
        r = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            let t = e.getEntries();
            r = t.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : document.onreadystatechange = t => {
        if ("complete" === document.readyState) {
            const r = t.target, {styleSheets: f, scripts: l, images: h} = r;
            for (const e of f) {
                e.href && i.push(e);
            }
            for (const e of l) {
                e.src && s.push(e);
            }
            for (const e of h) {
                e.src && a.push(e);
            }
            n.forEach((t => {
                const r = t.target, o = (r || HTMLImageElement).src || r.href;
                !function(t, r, o) {
                    t instanceof HTMLLinkElement && i.forEach((n => {
                        n.href === o && e(c, r, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    })), t instanceof HTMLScriptElement && s.forEach((n => {
                        n.src === o && e(c, r, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    })), t instanceof HTMLImageElement && a.forEach((n => {
                        n.src === o && e(c, r, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    }));
                }(t.target, t.type, o);
            })), o = !1;
        }
    };
}

class l {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), window.$monitorConfig = this.config;
        const {url: r, jsError: o, resource: n} = this.config;
        o && function(t) {
            window.addEventListener("error", (r => {
                const {message: o, type: n, lineno: i, colno: s, error: a} = r;
                e(t, n, {
                    message: o,
                    lineno: i,
                    colno: s,
                    stack: a.stack
                });
            })), window.addEventListener("unhandledrejection", (r => {
                e(t, r.type, {
                    reason: r.reason
                });
            }));
        }(r), n && f(r);
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

export { l as default };

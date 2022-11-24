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
                const r = t.target;
                if (!r.hasAttribute(`data-event-${o}`)) {
                    return;
                }
                const n = r.getAttribute(`data-event-${o}`) || "";
                e(this.url, o, n);
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

let o = [], r = !0, n = [], i = [], s = [], a = [], c = "";

function f(t) {
    c = t, window.addEventListener("error", (t => {
        let i = t.target;
        if (!(i instanceof HTMLScriptElement || i instanceof HTMLLinkElement || i instanceof HTMLImageElement || i instanceof HTMLVideoElement || i instanceof HTMLSourceElement || i instanceof HTMLAudioElement)) {
            return !1;
        }
        const s = (i || HTMLImageElement || HTMLVideoElement || HTMLSourceElement || HTMLAudioElement).src || i.href;
        window.performance ? (o.forEach((o => {
            o.name === s && e(c, t.type, {
                target: o.initiatorType,
                url: s
            });
        })), o = []) : r ? n.push(t) : e(c, t.type, {
            target: t.target.tagName.toLowerCase(),
            url: s
        });
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
    }() : document.onreadystatechange = t => {
        if ("complete" === document.readyState) {
            const o = t.target, {styleSheets: f, scripts: l, images: u} = o;
            for (const e of f) {
                e.href && i.push(e);
            }
            for (const e of l) {
                e.src && s.push(e);
            }
            for (const e of u) {
                e.src && a.push(e);
            }
            n.forEach((t => {
                const o = t.target, r = (o || HTMLImageElement).src || o.href;
                !function(t, o, r) {
                    t instanceof HTMLLinkElement && i.forEach((n => {
                        n.href === r && e(c, o, {
                            target: t.tagName.toLowerCase(),
                            url: r
                        });
                    })), t instanceof HTMLScriptElement && s.forEach((n => {
                        n.src === r && e(c, o, {
                            target: t.tagName.toLowerCase(),
                            url: r
                        });
                    })), t instanceof HTMLImageElement && a.forEach((n => {
                        n.src === r && e(c, o, {
                            target: t.tagName.toLowerCase(),
                            url: r
                        });
                    }));
                }(t.target, t.type, r);
            })), r = !1;
        }
    };
}

class l {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), window.$monitorConfig = this.config;
        const {url: o, jsError: r, resource: n} = this.config;
        r && function(t) {
            window.addEventListener("error", (o => {
                const {message: r, type: n, lineno: i, colno: s, error: a} = o;
                e(t, n, {
                    message: r,
                    lineno: i,
                    colno: s,
                    stack: a.stack
                });
            })), window.addEventListener("unhandledrejection", (o => {
                e(t, o.type, {
                    reason: o.reason
                });
            }));
        }(o), n && f(o);
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

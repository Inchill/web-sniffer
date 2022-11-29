"use strict";

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
        this.url = e, this.domConfig = Object.assign(this.normalizeDomConfig(), t), this.eventWatcher(), 
        this.visibilityWatcher();
    }
    normalizeDomConfig() {
        return {
            visibility: !0,
            root: document.documentElement,
            threshold: .2,
            event: !0,
            eventListeners: [ "click" ]
        };
    }
    eventWatcher() {
        if (!1 === this.domConfig.event) {
            return;
        }
        const {root: t} = this.domConfig;
        t && this.domConfig.eventListeners.forEach((n => {
            t.addEventListener(n, (t => {
                const o = t.target;
                if (!o.hasAttribute("data-event")) {
                    return;
                }
                const r = o.getAttribute("data-event") || "";
                e(this.url, n, r);
            }), {
                capture: !0
            });
        }));
    }
    visibilityWatcher() {
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

let n = [], o = !0;

const r = [], i = [], s = [], a = [];

let c = "";

function f(t) {
    c = t, window.addEventListener("error", (t => {
        const i = t.target;
        if (!(i instanceof HTMLScriptElement || i instanceof HTMLLinkElement || i instanceof HTMLImageElement || i instanceof HTMLVideoElement || i instanceof HTMLSourceElement || i instanceof HTMLAudioElement)) {
            return !1;
        }
        const s = (i || HTMLImageElement || HTMLVideoElement || HTMLSourceElement || HTMLAudioElement).src || i.href;
        window.performance ? (n.forEach((n => {
            n.name === s && e(c, t.type, {
                target: n.initiatorType,
                url: s
            });
        })), n = []) : o ? r.push(t) : e(c, t.type, {
            target: t.target.tagName.toLowerCase(),
            url: s
        });
    }), {
        capture: !0
    }), window.performance ? function() {
        const e = performance.getEntriesByType("resource");
        n = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            const t = e.getEntries();
            n = t.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : document.onreadystatechange = t => {
        if ("complete" === document.readyState) {
            const n = t.target, {styleSheets: f, scripts: h, images: l} = n;
            for (const e of f) {
                e.href && i.push(e);
            }
            for (const e of h) {
                e.src && s.push(e);
            }
            for (const e of l) {
                e.src && a.push(e);
            }
            r.forEach((t => {
                const n = t.target, o = (n || HTMLImageElement).src || n.href;
                !function(t, n, o) {
                    t instanceof HTMLLinkElement && i.forEach((r => {
                        r.href === o && e(c, n, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    })), t instanceof HTMLScriptElement && s.forEach((r => {
                        r.src === o && e(c, n, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    })), t instanceof HTMLImageElement && a.forEach((r => {
                        r.src === o && e(c, n, {
                            target: t.tagName.toLowerCase(),
                            url: o
                        });
                    }));
                }(t.target, t.type, o);
            })), o = !1;
        }
    };
}

function h(t) {
    window.onhashchange = function(n) {
        const {type: o, oldURL: r, newURL: i} = n;
        e(t, o, {
            oldURL: r,
            newURL: i
        });
    }, function(t, n) {
        t.forEach((t => {
            window.addEventListener(t, (t => {
                const o = t.target, {href: r, origin: i} = o.location;
                e(n, t.type, {
                    href: r,
                    origin: i
                });
            }));
        }));
    }([ "pushState", "replaceState" ], t), window.history.pushState = l("pushState"), 
    window.history.replaceState = l("replaceState");
}

function l(e) {
    const t = history[e];
    return function() {
        const n = t.apply(this, arguments), o = new Event(e);
        return window.dispatchEvent(o), n;
    };
}

module.exports = class {
    constructor(t) {
        this.config = Object.assign(this.normalizeConfig(), t), window.$snifferConfig = this.config;
        const {url: n, jsError: o, resource: r, route: i} = this.config;
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
        }(n), r && f(n), i && h(n);
    }
    normalizeConfig() {
        return {
            url: "",
            jsError: !0,
            resource: !0,
            route: !0
        };
    }
    createDomWatcher(e) {
        return new t(this.config.url, e), this;
    }
};

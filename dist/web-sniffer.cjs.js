"use strict";

class e {
    constructor(e, t) {
        this.domConfig = Object.assign(this.normalizeDomConfig(), e), this.onReport = t, 
        this.domConfig.visibility && this.visibilityWatcher(), this.domConfig.event && this.eventWatcher();
    }
    normalizeDomConfig() {
        return {
            visibility: !1,
            root: document.documentElement,
            threshold: .2,
            event: !1,
            eventListeners: [ "click" ]
        };
    }
    eventWatcher() {
        const {root: e} = this.domConfig;
        e && e instanceof HTMLElement && this.domConfig.eventListeners.forEach((t => {
            e.addEventListener(t, (e => {
                const n = e.target;
                if (!n.hasAttribute("data-event")) {
                    return;
                }
                const o = n.getAttribute("data-event") || "", r = {
                    key: t,
                    value: o
                };
                try {
                    this.onReport(r);
                } catch (e) {}
            }), {
                capture: !0
            });
        }));
    }
    visibilityWatcher() {
        const {root: e, threshold: t} = this.domConfig, n = new IntersectionObserver((e => {
            e.forEach((e => {
                const {intersectionRatio: n, target: o} = e;
                if (o.hasAttribute("data-expose") && n >= t) {
                    const e = {
                        key: "expose",
                        value: o.getAttribute("data-expose") || ""
                    };
                    try {
                        this.onReport(e);
                    } catch (e) {}
                }
            }));
        }), {
            root: e,
            threshold: t
        });
        this.traverseNode(e, n);
    }
    traverseNode(e, t) {
        if (e) {
            for (const n of e.children) {
                n.hasAttribute("data-expose") && t.observe(n), n.children.length && this.traverseNode(n, t);
            }
        }
    }
}

let t = [], n = !0;

const o = [], r = [], a = [], i = [];

let s;

function c(e) {
    const t = history[e];
    return function() {
        const n = t.apply(this, arguments), o = new Event(e);
        return window.dispatchEvent(o), n;
    };
}

exports.createDomWatcher = function(t, n) {
    return new e(t, n);
}, exports.createJsErrorWatcher = function(e) {
    "function" == typeof e && (window.addEventListener("error", (t => {
        const n = {
            type: t.type,
            message: t.message,
            filename: t.filename,
            lineno: t.lineno,
            colno: t.colno
        };
        try {
            e(n);
        } catch (e) {}
    })), window.addEventListener("unhandledrejection", (t => {
        const n = {
            reason: t.reason
        };
        try {
            e(n);
        } catch (e) {}
    })));
}, exports.createResourceWatcher = function(e) {
    s = e, window.addEventListener("error", (e => {
        const r = e.target;
        if (!(r instanceof HTMLScriptElement || r instanceof HTMLLinkElement || r instanceof HTMLImageElement || r instanceof HTMLVideoElement || r instanceof HTMLSourceElement || r instanceof HTMLAudioElement)) {
            return !1;
        }
        const a = (r || HTMLImageElement || HTMLVideoElement || HTMLSourceElement || HTMLAudioElement).src || r.href;
        if (window.performance) {
            t.forEach((e => {
                if (e.name === a) {
                    const t = {
                        tagName: e.initiatorType,
                        url: a
                    };
                    try {
                        s(t);
                    } catch (e) {}
                }
            })), t = [];
        } else if (n) {
            o.push(e);
        } else {
            const t = {
                tagName: e.target.tagName.toLowerCase(),
                url: a
            };
            try {
                s(t);
            } catch (e) {}
        }
    }), {
        capture: !0
    }), window.performance ? function() {
        const e = performance.getEntriesByType("resource");
        t = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            const n = e.getEntries();
            t = n.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : document.onreadystatechange = e => {
        if ("complete" === document.readyState) {
            const t = e.target, {styleSheets: c, scripts: h, images: f} = t;
            for (const e of c) {
                e.href && r.push(e);
            }
            for (const e of h) {
                e.src && a.push(e);
            }
            for (const e of f) {
                e.src && i.push(e);
            }
            o.forEach((e => {
                const t = e.target, n = (t || HTMLImageElement).src || t.href;
                !function(e, t, n) {
                    e instanceof HTMLLinkElement && r.forEach((t => {
                        if (t.href === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                s(t);
                            } catch (e) {}
                        }
                    })), e instanceof HTMLScriptElement && a.forEach((t => {
                        if (t.src === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                s(t);
                            } catch (e) {}
                        }
                    })), e instanceof HTMLImageElement && i.forEach((t => {
                        if (t.src === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                s(t);
                            } catch (e) {}
                        }
                    }));
                }(e.target, e.type, n);
            })), n = !1;
        }
    };
}, exports.createRouteWatcher = function(e) {
    window.onhashchange = function(t) {
        const {oldURL: n, newURL: o} = t;
        e({
            oldURL: n,
            newURL: o
        });
    }, function(e, t) {
        e.forEach((e => {
            window.addEventListener(e, (e => {
                const n = e.target, {href: o, origin: r} = n.location;
                t({
                    newURL: o,
                    oldURL: r
                });
            }));
        }));
    }([ "pushState", "replaceState" ], e), window.history.pushState = c("pushState"), 
    window.history.replaceState = c("replaceState");
};

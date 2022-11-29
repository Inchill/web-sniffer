function e(e) {
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
}

class t {
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

function n(e, n) {
    return new t(e, n);
}

let o = [], r = !0;

const i = [], a = [], s = [], c = [];

let f;

function h(e) {
    f = e, window.addEventListener("error", (e => {
        const t = e.target;
        if (!(t instanceof HTMLScriptElement || t instanceof HTMLLinkElement || t instanceof HTMLImageElement || t instanceof HTMLVideoElement || t instanceof HTMLSourceElement || t instanceof HTMLAudioElement)) {
            return !1;
        }
        const n = (t || HTMLImageElement || HTMLVideoElement || HTMLSourceElement || HTMLAudioElement).src || t.href;
        if (window.performance) {
            o.forEach((e => {
                if (e.name === n) {
                    const t = {
                        tagName: e.initiatorType,
                        url: n
                    };
                    try {
                        f(t);
                    } catch (e) {}
                }
            })), o = [];
        } else if (r) {
            i.push(e);
        } else {
            const t = {
                tagName: e.target.tagName.toLowerCase(),
                url: n
            };
            try {
                f(t);
            } catch (e) {}
        }
    }), {
        capture: !0
    }), window.performance ? function() {
        const e = performance.getEntriesByType("resource");
        o = e.filter((e => "beacon" !== e.initiatorType)), performance.clearResourceTimings();
        new PerformanceObserver((e => {
            const t = e.getEntries();
            o = t.filter((e => "beacon" !== e.initiatorType));
        })).observe({
            entryTypes: [ "resource" ]
        });
    }() : document.onreadystatechange = e => {
        if ("complete" === document.readyState) {
            const t = e.target, {styleSheets: n, scripts: o, images: h} = t;
            for (const e of n) {
                e.href && a.push(e);
            }
            for (const e of o) {
                e.src && s.push(e);
            }
            for (const e of h) {
                e.src && c.push(e);
            }
            i.forEach((e => {
                const t = e.target, n = (t || HTMLImageElement).src || t.href;
                !function(e, t, n) {
                    e instanceof HTMLLinkElement && a.forEach((t => {
                        if (t.href === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                f(t);
                            } catch (e) {}
                        }
                    })), e instanceof HTMLScriptElement && s.forEach((t => {
                        if (t.src === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                f(t);
                            } catch (e) {}
                        }
                    })), e instanceof HTMLImageElement && c.forEach((t => {
                        if (t.src === n) {
                            const t = {
                                tagName: e.tagName.toLowerCase(),
                                url: n
                            };
                            try {
                                f(t);
                            } catch (e) {}
                        }
                    }));
                }(e.target, e.type, n);
            })), r = !1;
        }
    };
}

function l(e) {
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
    }([ "pushState", "replaceState" ], e), window.history.pushState = m("pushState"), 
    window.history.replaceState = m("replaceState");
}

function m(e) {
    const t = history[e];
    return function() {
        const n = t.apply(this, arguments), o = new Event(e);
        return window.dispatchEvent(o), n;
    };
}

export { n as createDomWatcher, e as createJsErrorWatcher, h as createResourceWatcher, l as createRouteWatcher };

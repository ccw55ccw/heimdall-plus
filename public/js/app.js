var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t
} : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
};
!function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {
    }

    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var n = this._events = this._events || {}, i = n[t] = n[t] || [];
            return -1 == i.indexOf(e) && i.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var n = this._onceEvents = this._onceEvents || {};
            return (n[t] = n[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var n = this._events && this._events[t];
        if (n && n.length) {
            var i = n.indexOf(e);
            return -1 != i && n.splice(i, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var n = this._events && this._events[t];
        if (n && n.length) {
            var i = 0, o = n[i];
            e = e || [];
            for (var s = this._onceEvents && this._onceEvents[t]; o;) {
                var r = s && s[o];
                r && (this.off(t, o), delete s[o]), o.apply(this, e), i += r ? 0 : 1, o = n[i]
            }
            return this
        }
    }, t
}), function (t, e) {
    "function" == typeof define && define.amd ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function (n) {
        return e(t, n)
    }) : "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = e(t, require("ev-emitter")) : t.Unipointer = e(t, t.EvEmitter)
}(window, function (t, e) {
    function n() {
    }

    function i() {
    }

    var o = i.prototype = Object.create(e.prototype);
    o.bindStartEvent = function (t) {
        this._bindStartEvent(t, !0)
    }, o.unbindStartEvent = function (t) {
        this._bindStartEvent(t, !1)
    }, o._bindStartEvent = function (e, n) {
        n = void 0 === n || !!n;
        var i = n ? "addEventListener" : "removeEventListener";
        t.navigator.pointerEnabled ? e[i]("pointerdown", this) : t.navigator.msPointerEnabled ? e[i]("MSPointerDown", this) : (e[i]("mousedown", this), e[i]("touchstart", this))
    }, o.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, o.getTouch = function (t) {
        for (var e = 0; e < t.length; e++) {
            var n = t[e];
            if (n.identifier == this.pointerIdentifier) return n
        }
    }, o.onmousedown = function (t) {
        var e = t.button;
        e && 0 !== e && 1 !== e || this._pointerDown(t, t)
    }, o.ontouchstart = function (t) {
        this._pointerDown(t, t.changedTouches[0])
    }, o.onMSPointerDown = o.onpointerdown = function (t) {
        this._pointerDown(t, t)
    }, o._pointerDown = function (t, e) {
        this.isPointerDown || (this.isPointerDown = !0, this.pointerIdentifier = void 0 !== e.pointerId ? e.pointerId : e.identifier, this.pointerDown(t, e))
    }, o.pointerDown = function (t, e) {
        this._bindPostStartEvents(t), this.emitEvent("pointerDown", [t, e])
    };
    var s = {
        mousedown: ["mousemove", "mouseup"],
        touchstart: ["touchmove", "touchend", "touchcancel"],
        pointerdown: ["pointermove", "pointerup", "pointercancel"],
        MSPointerDown: ["MSPointerMove", "MSPointerUp", "MSPointerCancel"]
    };
    return o._bindPostStartEvents = function (e) {
        if (e) {
            var n = s[e.type];
            n.forEach(function (e) {
                t.addEventListener(e, this)
            }, this), this._boundPointerEvents = n
        }
    }, o._unbindPostStartEvents = function () {
        this._boundPointerEvents && (this._boundPointerEvents.forEach(function (e) {
            t.removeEventListener(e, this)
        }, this), delete this._boundPointerEvents)
    }, o.onmousemove = function (t) {
        this._pointerMove(t, t)
    }, o.onMSPointerMove = o.onpointermove = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerMove(t, t)
    }, o.ontouchmove = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerMove(t, e)
    }, o._pointerMove = function (t, e) {
        this.pointerMove(t, e)
    }, o.pointerMove = function (t, e) {
        this.emitEvent("pointerMove", [t, e])
    }, o.onmouseup = function (t) {
        this._pointerUp(t, t)
    }, o.onMSPointerUp = o.onpointerup = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerUp(t, t)
    }, o.ontouchend = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerUp(t, e)
    }, o._pointerUp = function (t, e) {
        this._pointerDone(), this.pointerUp(t, e)
    }, o.pointerUp = function (t, e) {
        this.emitEvent("pointerUp", [t, e])
    }, o._pointerDone = function () {
        this.isPointerDown = !1, delete this.pointerIdentifier, this._unbindPostStartEvents(), this.pointerDone()
    }, o.pointerDone = n, o.onMSPointerCancel = o.onpointercancel = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerCancel(t, t)
    }, o.ontouchcancel = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerCancel(t, e)
    }, o._pointerCancel = function (t, e) {
        this._pointerDone(), this.pointerCancel(t, e)
    }, o.pointerCancel = function (t, e) {
        this.emitEvent("pointerCancel", [t, e])
    }, i.getPointerPoint = function (t) {
        return {x: t.pageX, y: t.pageY}
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter", "unipointer/unipointer"], function (n, i) {
        return e(t, n, i)
    }) : "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = e(t, require("ev-emitter"), require("unipointer")) : t.Huebee = e(t, t.EvEmitter, t.Unipointer)
}(window, function (t, e, n) {
    function i(t, e) {
        if (!(t = a(t))) throw"Bad element for Huebee: " + t;
        this.anchor = t, this.options = {}, this.option(i.defaults), this.option(e), this.create()
    }

    function o() {
        for (var t = document.querySelectorAll("[data-huebee]"), e = 0; e < t.length; e++) {
            var n, o = t[e], s = o.getAttribute("data-huebee");
            try {
                n = s && JSON.parse(s)
            } catch (t) {
                w && w.error("Error parsing data-huebee on " + o.className + ": " + t);
                continue
            }
            new i(o, n)
        }
    }

    function s(t) {
        _.clearRect(0, 0, 1, 1), _.fillStyle = "#010203", _.fillStyle = t, _.fillRect(0, 0, 1, 1);
        var e = _.getImageData(0, 0, 1, 1).data;
        if (e = [e[0], e[1], e[2], e[3]], "1,2,3,255" != e.join(",")) {
            var n = u.apply(this, e);
            return {color: t.trim(), hue: n[0], sat: n[1], lum: n[2]}
        }
    }

    function r(t, e) {
        for (var n in e) t[n] = e[n];
        return t
    }

    function a(t) {
        return "string" == typeof t && (t = document.querySelector(t)), t
    }

    function h(t, e, n) {
        return d(c(t, e, n))
    }

    function c(t, e, n) {
        var i, o, s = (1 - Math.abs(2 * n - 1)) * e, r = t / 60, a = s * (1 - Math.abs(r % 2 - 1));
        switch (Math.floor(r)) {
            case 0:
                i = [s, a, 0];
                break;
            case 1:
                i = [a, s, 0];
                break;
            case 2:
                i = [0, s, a];
                break;
            case 3:
                i = [0, a, s];
                break;
            case 4:
                i = [a, 0, s];
                break;
            case 5:
                i = [s, 0, a];
                break;
            default:
                i = [0, 0, 0]
        }
        return o = n - s / 2, i = i.map(function (t) {
            return t + o
        })
    }

    function u(t, e, n) {
        t /= 255, e /= 255, n /= 255;
        var i, o = Math.max(t, e, n), s = Math.min(t, e, n), r = o - s, a = .5 * (o + s),
            h = 0 === r ? 0 : r / (1 - Math.abs(2 * a - 1));
        return 0 === r ? i = 0 : o === t ? i = (e - n) / r % 6 : o === e ? i = (n - t) / r + 2 : o === n && (i = (t - e) / r + 4), [60 * i, parseFloat(h), parseFloat(a)]
    }

    function d(t) {
        return "#" + t.map(function (t) {
            t = Math.round(255 * t);
            var e = t.toString(16).toUpperCase();
            return e = e.length < 2 ? "0" + e : e
        }).join("")
    }

    function l(t) {
        return "#" + t[1] + t[3] + t[5]
    }

    i.defaults = {hues: 12, hue0: 0, shades: 5, saturations: 3, notation: "shortHex", setText: !0, setBGColor: !0};
    var f = i.prototype = Object.create(e.prototype);
    f.option = function (t) {
        this.options = r(this.options, t)
    };
    var p = 0, v = {};
    f.create = function () {
        function t(t) {
            t.target == i && t.preventDefault()
        }

        var e = this.guid = ++p;
        this.anchor.huebeeGUID = e, v[e] = this, this.setBGElems = this.getSetElems(this.options.setBGColor), this.setTextElems = this.getSetElems(this.options.setText), this.outsideCloseIt = this.outsideClose.bind(this), this.onDocKeydown = this.docKeydown.bind(this), this.closeIt = this.close.bind(this), this.openIt = this.open.bind(this), this.onElemTransitionend = this.elemTransitionend.bind(this), this.isInputAnchor = "INPUT" == this.anchor.nodeName, this.options.staticOpen || (this.anchor.addEventListener("click", this.openIt), this.anchor.addEventListener("focus", this.openIt)), this.isInputAnchor && this.anchor.addEventListener("input", this.inputInput.bind(this));
        var n = this.element = document.createElement("div");
        n.className = "huebee ", n.className += this.options.staticOpen ? "is-static-open " : "is-hidden ", n.className += this.options.className || "";
        var i = this.container = document.createElement("div");
        if (i.className = "huebee__container", i.addEventListener("mousedown", t), i.addEventListener("touchstart", t), this.createCanvas(), this.cursor = document.createElement("div"), this.cursor.className = "huebee__cursor is-hidden", i.appendChild(this.cursor), this.createCloseButton(), n.appendChild(i), !this.options.staticOpen) {
            var o = getComputedStyle(this.anchor.parentNode);
            "relative" != o.position && "absolute" != o.position && (this.anchor.parentNode.style.position = "relative")
        }
        var s = this.options.hues, r = this.options.customColors, a = r && r.length;
        this.satY = a ? Math.ceil(a / s) + 1 : 0, this.updateColors(), this.setAnchorColor(), this.options.staticOpen && this.open()
    }, f.getSetElems = function (t) {
        return !0 === t ? [this.anchor] : "string" == typeof t ? document.querySelectorAll(t) : void 0
    }, f.createCanvas = function () {
        var t = this.canvas = document.createElement("canvas");
        t.className = "huebee__canvas", this.ctx = t.getContext("2d");
        var e = this.canvasPointer = new n;
        e._bindStartEvent(t), e.on("pointerDown", this.canvasPointerDown.bind(this)), e.on("pointerMove", this.canvasPointerMove.bind(this)), this.container.appendChild(t)
    };
    var m = "http://www.w3.org/2000/svg";
    f.createCloseButton = function () {
        if (!this.options.staticOpen) {
            var t = document.createElementNS(m, "svg");
            t.setAttribute("class", "huebee__close-button"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("width", "24"), t.setAttribute("height", "24");
            var e = document.createElementNS(m, "path");
            e.setAttribute("d", "M 7,7 L 17,17 M 17,7 L 7,17"), e.setAttribute("class", "huebee__close-button__x"), t.appendChild(e), t.addEventListener("click", this.closeIt), this.container.appendChild(t)
        }
    }, f.updateColors = function () {
        this.swatches = {}, this.colorGrid = {}, this.updateColorModer();
        var t = this.options.shades, e = this.options.saturations, n = this.options.hues, i = this.options.customColors;
        if (i && i.length) {
            var o = 0;
            i.forEach(function (t) {
                var e = o % n, i = Math.floor(o / n), r = s(t);
                r && (this.addSwatch(r, e, i), o++)
            }.bind(this))
        }
        for (var r = 0; r < e; r++) {
            var a = 1 - r / e, h = t * r + this.satY;
            this.updateSaturationGrid(r, a, h)
        }
        for (r = 0; r < t + 2; r++) {
            var c = 1 - r / (t + 1), u = this.colorModer(0, 0, c), d = s(u);
            this.addSwatch(d, n + 1, r)
        }
    }, f.updateSaturationGrid = function (t, e, n) {
        for (var i = this.options.shades, o = this.options.hues, r = this.options.hue0, a = 0; a < i; a++) for (var h = 0; h < o; h++) {
            var c = Math.round(360 * h / o + r) % 360, u = 1 - (a + 1) / (i + 1), d = this.colorModer(c, e, u),
                l = s(d), f = a + n;
            this.addSwatch(l, h, f)
        }
    }, f.addSwatch = function (t, e, n) {
        this.swatches[e + "," + n] = t, this.colorGrid[t.color.toUpperCase()] = {x: e, y: n}
    };
    var b = {
        hsl: function (t, e, n) {
            return e = Math.round(100 * e), n = Math.round(100 * n), "hsl(" + t + ", " + e + "%, " + n + "%)"
        }, hex: h, shortHex: function (t, e, n) {
            return l(h(t, e, n))
        }
    };
    f.updateColorModer = function () {
        this.colorModer = b[this.options.notation] || b.shortHex
    }, f.renderColors = function () {
        var t = 2 * this.gridSize;
        for (var e in this.swatches) {
            var n = this.swatches[e], i = e.split(","), o = i[0], s = i[1];
            this.ctx.fillStyle = n.color, this.ctx.fillRect(o * t, s * t, t, t)
        }
    }, f.setAnchorColor = function () {
        this.isInputAnchor && this.setColor(this.anchor.value)
    };
    var g = document.documentElement;
    f.open = function () {
        if (!this.isOpen) {
            var t = this.anchor, e = this.element;
            this.options.staticOpen || (e.style.left = t.offsetLeft + "px", e.style.top = t.offsetTop + t.offsetHeight + "px"), this.bindOpenEvents(!0), e.removeEventListener("transitionend", this.onElemTransitionend), t.parentNode.insertBefore(e, t.nextSibling);
            var n = getComputedStyle(e).transitionDuration;
            this.hasTransition = n && "none" != n && parseFloat(n), this.isOpen = !0, this.updateSizes(), this.renderColors(), this.setAnchorColor(), e.offsetHeight, e.classList.remove("is-hidden")
        }
    }, f.bindOpenEvents = function (t) {
        if (!this.options.staticOpen) {
            var e = (t ? "add" : "remove") + "EventListener";
            g[e]("mousedown", this.outsideCloseIt), g[e]("touchstart", this.outsideCloseIt), document[e]("focusin", this.outsideCloseIt), document[e]("keydown", this.onDocKeydown), this.anchor[e]("blur", this.closeIt)
        }
    }, f.updateSizes = function () {
        var t = this.options.hues, e = this.options.shades, n = this.options.saturations;
        this.cursorBorder = parseInt(getComputedStyle(this.cursor).borderTopWidth, 10), this.gridSize = Math.round(this.cursor.offsetWidth - 2 * this.cursorBorder), this.canvasOffset = {
            x: this.canvas.offsetLeft,
            y: this.canvas.offsetTop
        };
        var i = Math.max(e * n + this.satY, e + 2), o = this.gridSize * (t + 2);
        this.canvas.width = 2 * o, this.canvas.style.width = o + "px", this.canvas.height = this.gridSize * i * 2
    }, f.outsideClose = function (t) {
        var e = this.anchor.contains(t.target), n = this.element.contains(t.target);
        e || n || this.close()
    };
    var y = {13: !0, 27: !0};
    f.docKeydown = function (t) {
        y[t.keyCode] && this.close()
    };
    var E = "string" == typeof g.style.transform;
    f.close = function () {
        this.isOpen && (E && this.hasTransition ? this.element.addEventListener("transitionend", this.onElemTransitionend) : this.remove(), this.element.classList.add("is-hidden"), this.bindOpenEvents(!1), this.isOpen = !1)
    }, f.remove = function () {
        var t = this.element.parentNode;
        t.contains(this.element) && t.removeChild(this.element)
    }, f.elemTransitionend = function (t) {
        t.target == this.element && (this.element.removeEventListener("transitionend", this.onElemTransitionend), this.remove())
    }, f.inputInput = function () {
        this.setColor(this.anchor.value)
    }, f.canvasPointerDown = function (t, e) {
        t.preventDefault(), this.updateOffset(), this.canvasPointerChange(e)
    }, f.updateOffset = function () {
        var e = this.canvas.getBoundingClientRect();
        this.offset = {x: e.left + t.pageXOffset, y: e.top + t.pageYOffset}
    }, f.canvasPointerMove = function (t, e) {
        this.canvasPointerChange(e)
    }, f.canvasPointerChange = function (t) {
        var e = Math.round(t.pageX - this.offset.x), n = Math.round(t.pageY - this.offset.y), i = this.gridSize,
            o = Math.floor(e / i), s = Math.floor(n / i), r = this.swatches[o + "," + s];
        this.setSwatch(r)
    }, f.setColor = function (t) {
        var e = s(t);
        this.setSwatch(e)
    }, f.setSwatch = function (t) {
        var e = t && t.color;
        if (t) {
            var n = e == this.color;
            this.color = e, this.hue = t.hue, this.sat = t.sat, this.lum = t.lum;
            var i = this.lum - .15 * Math.cos((this.hue + 70) / 180 * Math.PI);
            this.isLight = i > .5;
            var o = this.colorGrid[e.toUpperCase()];
            this.updateCursor(o), this.setTexts(), this.setBackgrounds(), n || this.emitEvent("change", [e, t.hue, t.sat, t.lum])
        }
    }, f.setTexts = function () {
        if (this.setTextElems) for (var t = 0; t < this.setTextElems.length; t++) {
            var e = this.setTextElems[t], n = "INPUT" == e.nodeName ? "value" : "textContent";
            e[n] = this.color
        }
    }, f.setBackgrounds = function () {
        if (this.setBGElems) for (var t = this.isLight ? "#222" : "white", e = 0; e < this.setBGElems.length; e++) {
            var n = this.setBGElems[e];
            n.style.backgroundColor = this.color, n.style.color = t
        }
    }, f.updateCursor = function (t) {
        if (this.isOpen) {
            var e = t ? "remove" : "add";
            if (this.cursor.classList[e]("is-hidden"), t) {
                var n = this.gridSize, i = this.canvasOffset, o = this.cursorBorder;
                this.cursor.style.left = t.x * n + i.x - o + "px", this.cursor.style.top = t.y * n + i.y - o + "px"
            }
        }
    };
    var w = t.console, C = document.readyState;
    "complete" == C || "interactive" == C ? o() : document.addEventListener("DOMContentLoaded", o), i.data = function (t) {
        t = a(t);
        var e = t && t.huebeeGUID;
        return e && v[e]
    };
    var S = document.createElement("canvas");
    S.width = S.height = 1;
    var _ = S.getContext("2d");
    return i
}), $.when($.ready).then(function () {
    function t() {
        var t = !0, e = !1, n = void 0;
        try {
            for (var i, o = r[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                var s = i.value;
                window.clearTimeout(s)
            }
        } catch (t) {
            e = !0, n = t
        } finally {
            try {
                !t && o.return && o.return()
            } finally {
                if (e) throw n
            }
        }
    }

    function e() {
        var t = !0, e = !1, n = void 0;
        try {
            for (var i, o = a[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                (0, i.value)()
            }
        } catch (t) {
            e = !0, n = t
        } finally {
            try {
                !t && o.return && o.return()
            } finally {
                if (e) throw n
            }
        }
    }

    function n(t) {
        if (t.files && t.files[0]) {
            var e = new FileReader;
            e.onload = function (t) {
                $("#appimage img").attr("src", t.target.result)
            }, e.readAsDataURL(t.files[0])
        }
    }

    var i = (document.querySelector("base") || {}).href;
    $(".message-container").length && setTimeout(function () {
        $(".message-container").fadeOut()
    }, 3500);
    var o, s;
    void 0 !== document.hidden ? (o = "hidden", s = "visibilitychange") : void 0 !== document.msHidden ? (o = "msHidden", s = "msvisibilitychange") : void 0 !== document.webkitHidden && (o = "webkitHidden", s = "webkitvisibilitychange");
    var r = [], a = [], h = $(".livestats-container");
    h.length > 0 && (void 0 === document.addEventListener || void 0 === o ? console.log("This browser does not support visibilityChange") : document.addEventListener(s, function () {
        document[o] ? t() : e()
    }, !1), h.each(function (t) {
        var e = $(this).data("id"), n = $(this).data("dataonly"), o = 1 == n ? 2e4 : 1e3, s = $(this), h = 5e3,
            c = function n() {
                $.ajax({
                    url: i + "/get_stats/" + e, dataType: "json", success: function (t) {
                        s.html(t.html), "active" == t.status ? h = o : h < 3e4 && (h += 2e3)
                    }, complete: function () {
                        r[t] = window.setTimeout(n, h)
                    }
                })
            };
        a[t] = c, c()
    })), $("#upload").change(function () {
        n(this)
    }), $("#sortable").sortable({
        stop: function (t, e) {
            var n = $("#sortable").sortable("toArray", {attribute: "data-id"});
            $.post(i + "/order", {order: n})
        }
    }), $("#sortable").sortable("disable"), $("#app").on("click", "#config-button", function (t) {
        t.preventDefault();
        var e = $("#app"), n = e.hasClass("header");
        e.toggleClass("header"), n ? ($(".add-item").hide(), $(".item-edit").hide(), $("#app").removeClass("sidebar"), $("#sortable").sortable("disable")) : ($("#sortable").sortable("enable"), setTimeout(function () {
            $(".add-item").fadeIn(), $(".item-edit").fadeIn()
        }, 350))
    }).on("click", "#add-item, #pin-item", function (t) {
        t.preventDefault();
        var e = $("#app");
        e.hasClass("sidebar");
        e.toggleClass("sidebar")
    }).on("click", ".close-sidenav", function (t) {
        t.preventDefault(), $("#app").removeClass("sidebar")
    }).on("click", "#test_config", function (t) {
        t.preventDefault();
        var e = $("#create input[name=url]").val(), n = $('#create input[name="config[override_url]"]').val();
        n.length && "" != n && (e = n);
        var o = {};
        o.url = e, $(".config-item").each(function (t) {
            var e = $(this).data("config");
            o[e] = $(this).val()
        }), $.post(i + "/test_config", {data: o}, function (t) {
            alert(t)
        })
    }), $("#pinlist").on("click", "a", function (t) {
        t.preventDefault();
        var e = $(this), n = e.data("id"), o = e.data("tag");
        $.get(i + "/items/pintoggle/" + n + "/true/" + o, function (t) {
            var n = $(t).filter("#sortable").html();
            $("#sortable").html(n), e.toggleClass("active")
        })
    })
});

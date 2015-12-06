"use strict";

function setData(e, t, r, a) {
    if (e && e.properties.parent) {
        var o = a.provinces[e.properties.parent.properties.id].c[e.properties.id];
        o.n = e.properties.name, t.setData(o), r.setData(o.r)
    } else if (e) {
        var o = a.provinces[e.properties.id];
        t.setData(o), r.setData(o.r)
    } else t.setData(a), r.setData(a.r)
}
var colors = {
        "JxSí": "67, 154, 131",
        "CatSíqueesPot": "162, 13, 115",
        "C's": "255, 74, 27",
        PP: "24, 188, 204",
        PSC: "205, 2, 0",
        CUP: "255, 192, 27",
        GANEMOS: "87, 120, 241",
        "unio.cat": "18, 82, 182",
        PACMA: "87, 120, 41",
        "PIRATA.CAT/XDT": "30, 30, 30",
        "RECORTES CERO-ELS VERDS": "161, 205, 58",
        Others: "170, 170, 170",
        Otros: "170, 170, 170",
        CiU: "67, 154, 131",
        "PSC-PSOE": "205, 2, 0",
        "ERC-Cat Sí": "67, 154, 131",
        "ICV-EUiA": "18, 82, 182",
        "CUP-Alt.Esq.": "255, 192, 27"
    },
    fillOpacity = function(e) {
        var t = Math.min(e, 40) / 40;
        return t
    },
    lightenColor = function(e, t) {
        e || (e = colors.Otros);
        var r = e.split(","),
            a = fillOpacity(t);
        for (var o in r) r[o] = Number(r[o]) + (255 - r[o]) * (1 - a);
        return "rgb(" + Math.round(r[0]) + ", " + Math.round(r[1]) + "," + Math.round(r[2]) + ")"
    };
$(document).ready(function() {
    var e = $(window).innerWidth() <= 480,
        t = "maps/map.json";
    e && (t = "maps/map-lite.json"), queue().defer(d3.json, t).defer(d3.json, "data/results.json").await(function(t, r, a) {
        var o = Table({
                name: "js-results"
            }),
            n = Stack({
                name: "stack",
                data: a.r,
                fillCallback: function(e, t) {
                    return void 0 != colors[e.n] ? "rgb(" + colors[e.n] + ")" : "rgb(" + colors.Others + ")"
                }
            }, window, document, jQuery, d3);
        n.init(), o.setData(a), n.setData(a.r);
        var i = $(".map").innerWidth(),
            s = .8 * i,
            p = 15 * i,
            c = d3.geo.transverseMercator().rotate([-2.3, -41.7]).translate([i / 2 + 50, s / 2 - 30 + 13e3 / s]).scale(p),
            l = {
                element: ".map",
                topojson: r,
                name: "provincias",
                zoomScaleFactor: .7,
                fillCallback: function(e, t) {
                    if (!e.properties.color) {
                        var r;
                        e && e.properties.parent ? a.provinces[e.properties.parent.properties.id].c[e.properties.id] && a.provinces[e.properties.parent.properties.id].c[e.properties.id].r && (r = a.provinces[e.properties.parent.properties.id].c[e.properties.id].r[0]) : e ? a.provinces[e.properties.id].r && (r = a.provinces[e.properties.id].r[0]) : r = a.r[0], r && colors[r.n] && r.p ? e.properties.color = lightenColor(colors[r.n], r.p) : e.properties.color = lightenColor(colors.Others, 40)
                    }
                    return e.properties.color
                },
                selectCallback: function(e) {
                    setData(e, o, n, a)
                },
                projection: c,
                height: s,
                enableMeshes: !e
            },
            u = new DoubleZoomableCanvasMap(l);
        u.init(), $(".js-zoomOut").click(function() {
            u.zoomOut()
        });
        var d = {
                a: /[àá]/gi,
                e: /[èé]/gi,
                i: /[ìí]/gi,
                u: /[ü]/gi,
                n: /[ñ]/gi
            },
            h = function(e) {
                return $.each(d, function(t, r) {
                    e = e.replace(r, t)
                }), e
            },
            m = [],
            f = u.settings().levelFeatures,
            v = u.settings().features.features;
        for (var g in v) {
            var C = f[v[g].properties.name].features;
            for (var y in C) {
                var D = {
                    index: y,
                    name: C[y].properties.name,
                    parentname: C[y].properties.parent.properties.name
                };
                m.push(D)
            }
        }
        var w = (new Date, new Bloodhound({
            datumTokenizer: function(e) {
                return Bloodhound.tokenizers.whitespace(h(e.name))
            },
            queryTokenizer: function(e) {
                return Bloodhound.tokenizers.whitespace(h(e))
            },
            local: m,
            sorter: function(e, t) {
                return e.name.length >= t.name.length ? 1 : -1
            }
        }));
        $(".map-searchBar").typeahead({
            highlight: !0,
            autoselect: !0
        }, {
            name: "cities",
            displayKey: function(e) {
                return e.name + " (" + e.parentname + ")"
            },
            source: w.ttAdapter(),
            limit: 8
        }), $(".twitter-typeahead").bind("typeahead:select", function(e, t) {
            var r = u.settings().levelFeatures[t.parentname].features[t.index];
            u.zoomIn(r), setData(r, o, n, a), $(".typeahead").typeahead("close")
        }), $(".twitter-typeahead").on("keydown", function(e) {
            13 == e.which ? w.search($(".tt-input", this).typeahead("val"), function(e) {
                if (console.log(e), e[0]) {
                    var t = u.settings().levelFeatures[e[0].parentname].features[e[0].index];
                    u.zoomIn(t), setData(t, o, n, a)
                }
            }) : 27 == e.which && u.zoomOut()
        }), $(".loadingSvg").hide(), $(".u-hiddenStartup").css("visibility", "visible")
    })
});
"use strict";
var StaticMap, ZoomableMap, StaticCanvasMap, ZoomableCanvasMap, DoubleZoomableCanvasMap;
! function() {
    StaticMap = function(e) {
        function t() {
            var e = d3.select(o.element).append("svg").attr("width", o.width).attr("height", o.height);
            e.append("rect").attr("class", "map-background").attr("width", o.width).attr("height", o.height);
            e.append("g").attr("class", "map-polygonGroup").style("stroke-width", o.strokeWidth + "px").selectAll("path").data(i.features).enter().append("path").attr("class", "map-polygon").attr("d", n).style("fill", o.fillCallback);
            this.init = function() {}
        }
        var o = jQuery.extend({
                strokeWidth: 1.5,
                height: 200,
                width: $(e.element).innerWidth(),
                zoomScaleFactor: .9
            }, e),
            i = topojson.feature(o.topojson, o.topojson.objects[e.name]);
        if (e.projection) var n = d3.geo.path().projection(a = e.projection);
        else {
            var r = d3.geo.bounds(i),
                a = d3.geo.mercator().scale(1).center([(r[1][0] + r[0][0]) / 2, (r[1][1] + r[0][1]) / 2]),
                n = d3.geo.path().projection(a),
                s = n.bounds(i),
                l = s[1][0] - s[0][0],
                h = s[1][1] - s[0][1],
                c = .9 * (o.width / l);
            o.height = h * o.width / l, a.scale(c).translate([o.width / 2, o.height / 2])
        }
        $(this).height(o.height), this.init = t, this.features = function() {
            return i
        }, this.path = function() {
            return n
        }, this.settings = function() {
            return o
        }
    }, StaticCanvasMap = function(e) {
        function t() {
            var e = d3.select(o.element).append("canvas"),
                t = e.node().getContext("2d"),
                a = window.devicePixelRatio || 1,
                s = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
            n = a / s, r = 1 / o.projection.scale(), e.attr("width", o.width * n), e.attr("height", o.height * n), e.style("width", o.width + "px"), e.style("height", o.height + "px"), t.lineJoin = "round", t.lineCap = "round", h.context(t), t.clearRect(0, 0, o.width * n, o.height * n), t.save(), t.scale(n, n);
            for (var l in i.features) {
                var c = o.fillCallback(i.features[l], l);
                t.beginPath(), h(i.features[l]), t.fillStyle = c, t.fill()
            }
            t.restore(), this.init = function() {}
        }
        topojson.presimplify(e.topojson);
        var o = jQuery.extend({
                strokeWidth: 1.5,
                height: 200,
                width: $(e.element).innerWidth(),
                zoomScaleFactor: .9
            }, e),
            i = topojson.feature(o.topojson, o.topojson.objects[e.name]),
            n = 1,
            r = 0,
            a = d3.geo.clipExtent().extent([
                [-o.width, -o.height],
                [o.width, o.height]
            ]),
            s = d3.geo.transform({
                point: function(e, t, o) {
                    o >= r && this.stream.point(e, t)
                }
            });
        if (e.projection) var l = e.projection,
            h = d3.geo.path().projection({
                stream: function(e) {
                    return s.stream(a.stream(l.stream(e)))
                }
            });
        else {
            var c = d3.geo.bounds(i),
                l = d3.geo.mercator().scale(1).center([(c[1][0] + c[0][0]) / 2, (c[1][1] + c[0][1]) / 2]),
                h = d3.geo.path().projection({
                    stream: function(e) {
                        return s.stream(a.stream(l.stream(e)))
                    }
                }),
                u = h.bounds(i),
                p = u[1][0] - u[0][0],
                d = u[1][1] - u[0][1],
                f = .9 * (o.width / p);
            o.height = d * o.width / p, l.scale(f).translate([o.width / 2, o.height / 2])
        }
        o.projection = l, $(this).height(o.height), this.init = t, this.features = function() {
            return i
        }, this.path = function() {
            return h
        }, this.settings = function() {
            return o
        }, this.context = function() {
            return context
        }, this.ratio = function() {
            return n
        }
    }, ZoomableMap = function(e) {
        function t() {
            a.init();
            var t = d3.select(e.element + " svg");
            r = t.select(".map-polygonGroup"), t.select(".map-background").on("click", o), t.selectAll(".map-polygon").on("click", i).on("mouseover", function(e, t) {
                d3.select(this).style("stroke", "black")
            }).on("mouseout", function(e, t) {
                d3.select(this).style("stroke", "unset")
            })
        }

        function o() {
            n = void 0, r.transition().duration(500).style("stroke-width", s.strokeWidth + "px").attr("transform", ""), s.selectCallback(void 0)
        }

        function i(e) {
            if (n == e || void 0 == e) return void o();
            n = e;
            var t = a.path().bounds(e),
                i = t[1][0] - t[0][0],
                l = t[1][1] - t[0][1],
                h = (t[0][0] + t[1][0]) / 2,
                c = (t[0][1] + t[1][1]) / 2,
                u = s.zoomScaleFactor / Math.max(i / s.width, l / s.height),
                p = [s.width / 2 - u * h, s.height / 2 - u * c],
                d = Math.max(.01, s.strokeWidth / u);
            r.transition().duration(500).attr("transform", "translate(" + p + ")scale(" + u + ")").style("stroke-width", d + "px"), s.selectCallback(n)
        }
        var n, r, a = new StaticMap(e),
            s = $.extend({
                selectCallback: function(e) {}
            }, a.parameters());
        this.init = t, this.zoomOut = o, this.settings = function() {
            return s
        }
    }, ZoomableCanvasMap = function(e) {
        function t(t) {
            return topojson.mesh(c.topojson, c.topojson.objects[e.name], function(e, o) {
                return e !== o && (e.properties.name == t.properties.name || o.properties.name == t.properties.name)
            })
        }

        function o(e) {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: c.projection.invert(e)
                }
            }
        }

        function i(e) {
            return [e[0] / v - b[0], e[1] / v - b[1]]
        }

        function n() {
            var e = d3.select(c.element).append("canvas").on("click", a).on("mousemove", r);
            g = e.node().getContext("2d");
            var t = window.devicePixelRatio || 1,
                o = g.webkitBackingStorePixelRatio || g.mozBackingStorePixelRatio || g.msBackingStorePixelRatio || g.oBackingStorePixelRatio || g.backingStorePixelRatio || 1;
            p = t / o, e.attr("width", c.width * p), e.attr("height", c.height * p), e.style("width", c.width + "px"), e.style("height", c.height + "px"), g.lineJoin = "round", g.lineCap = "round", x.context(g), s()
        }

        function r() {
            var e = o(i(d3.mouse(this))),
                n = u.features;
            for (var r in n)
                if (turf.inside(e, n[r])) return void(n[r] != k && n[r] != j ? (k = n[r], k.mesh || (k.mesh = t(n[r])), s()) : n[r] != k && (k = null, s()));
            k = null, s()
        }

        function a() {
            var e = o(i(d3.mouse(this))),
                t = u.features;
            for (var n in t)
                if (turf.inside(e, t[n]) && t[n] != j) return void h(t[n]);
            l()
        }

        function s() {
            d = 1 / c.projection.scale() / v, g.clearRect(0, 0, c.width * p, c.height * p), g.save(), g.scale(p * v, p * v), g.translate(b[0], b[1]), g.lineWidth = c.strokeWidth / v;
            for (var e in u.features) g.beginPath(), x(u.features[e]), g.fillStyle = c.fillCallback(u.features[e], e), g.fill();
            j && j.mesh && (g.beginPath(), x(j.mesh), g.fillStyle = "black", g.stroke()), k && k.mesh && (g.beginPath(), x(k.mesh), g.fillStyle = "black", g.stroke()), g.restore()
        }

        function l() {
            j = null, d3.transition().duration(300).ease("linear").tween("zoom", function() {
                var e = d3.interpolateNumber(v, 1),
                    t = d3.interpolateArray(b, [0, 0]),
                    o = v;
                return function(i) {
                    v = e(i);
                    var n = t(i);
                    b = [n[0] * o / e(i), n[1] * o / e(i)], s()
                }
            })
        }

        function h(e) {
            j = e, j.mesh || (j.mesh = t(e));
            var o = x.bounds(e),
                i = o[1][0] - o[0][0],
                n = o[1][1] - o[0][1],
                r = (o[0][0] + o[1][0]) / 2,
                a = (o[0][1] + o[1][1]) / 2,
                l = c.zoomScaleFactor * Math.min(c.width / i, c.height / n),
                h = [-r + c.width / l / 2, -a + c.height / l / 2];
            d3.transition().duration(300).ease("circle").tween("zoom", function() {
                var e = d3.interpolateNumber(v, l),
                    t = d3.interpolateArray(b, h),
                    o = b;
                return function(i) {
                    var n = t(i);
                    v = e(i), b = [o[0] + (n[0] - o[0]) * l / e(i), o[1] + (n[1] - o[1]) * l / e(i)], s()
                }
            })
        }
        topojson.presimplify(e.topojson);
        var c = jQuery.extend({
                strokeWidth: 1,
                height: 200,
                width: $(e.element).innerWidth(),
                zoomScaleFactor: .9,
                selectCallback: function(e) {}
            }, e),
            u = topojson.feature(c.topojson, c.topojson.objects[c.name]),
            p = 1,
            d = 0,
            f = d3.geo.clipExtent().extent([
                [-c.width / 2, -c.height / 2],
                [c.width / 2, c.height / 2]
            ]),
            m = d3.geo.transform({
                point: function(e, t, o) {
                    o >= d && this.stream.point(e, t)
                }
            }),
            g = null,
            v = 1,
            b = [0, 0],
            j = null,
            k = null;
        if (e.projection) var w = e.projection,
            x = d3.geo.path().projection({
                stream: function(e) {
                    return m.stream(f.stream(w.stream(e)))
                }
            });
        else {
            var y = d3.geo.bounds(u),
                w = d3.geo.mercator().scale(1).center([(y[1][0] + y[0][0]) / 2, (y[1][1] + y[0][1]) / 2]),
                x = d3.geo.path().projection({
                    stream: function(e) {
                        return m.stream(f.stream(w.stream(e)))
                    }
                }),
                S = x.bounds(u),
                C = S[1][0] - S[0][0],
                P = S[1][1] - S[0][1],
                F = .9 * (c.width / C);
            console.log(S), console.log(y), c.height = P * c.width / C, w.scale(F).translate([c.width / 2, c.height / 2])
        }
        c.projection = w, $(this).height(c.height), this.init = n, this.zoomOut = l, this.settings = function() {
            return c
        }
    }, DoubleZoomableCanvasMap = function(e) {
        function t(t) {
            return c.enableMeshes ? t.properties.parent ? topojson.mesh(c.topojson, c.topojson.objects[t.properties.parent.properties.name], function(e, o) {
                return e !== o && (e.properties.name == t.properties.name || o.properties.name == t.properties.name)
            }) : topojson.mesh(c.topojson, c.topojson.objects[e.name], function(e, o) {
                return e !== o && (e.properties.name == t.properties.name || o.properties.name == t.properties.name)
            }) : null
        }

        function o(e) {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: e
                }
            }
        }

        function i(e) {
            return [e[0] / g - v[0], e[1] / g - v[1]]
        }

        function n() {
            var e = d3.select(c.element).append("canvas").on("click", a).on("mousemove", r);
            m = e.node().getContext("2d");
            var t = window.devicePixelRatio || 1,
                o = m.webkitBackingStorePixelRatio || m.mozBackingStorePixelRatio || m.msBackingStorePixelRatio || m.oBackingStorePixelRatio || m.backingStorePixelRatio || 1;
            u = t / o, e.attr("width", c.width * u), e.attr("height", c.height * u), e.style("width", c.width + "px"), e.style("height", c.height + "px"), m.lineJoin = "round", m.lineCap = "round", y.context(m), c.features.lookupTree = rbush(4);
            for (var i in c.features.features) {
                var n = c.features.features[i].properties.name,
                    l = topojson.feature(c.topojson, c.topojson.objects[n]),
                    h = y.bounds(c.features.features[i]);
                c.features.lookupTree.insert([h[0][0].toFixed(0), h[0][1].toFixed(0), h[1][0].toFixed(0), h[1][1].toFixed(0), c.features.features[i]]), l.lookupTree = rbush(300);
                var p = [];
                for (var d in l.features) {
                    var f = y.bounds(l.features[d]);
                    p.push([f[0][0].toFixed(0), f[0][1].toFixed(0), f[1][0].toFixed(0), f[1][1].toFixed(0), l.features[d]]), l.features[d].properties.parent = c.features.features[i]
                }
                l.lookupTree.load(p), c.levelFeatures[n] = l
            }
            s()
        }

        function r() {
            if (w) {
                var e = i(d3.mouse(this)),
                    n = o(c.projection.invert(e));
                if (b) {
                    var r = c.levelFeatures[b.properties.name].lookupTree.search([e[0], e[1], e[0], e[1]]);
                    for (var a in r)
                        if (turf.inside(n, r[a][4])) return void(r[a][4] != k && (k = r[a][4], k.mesh || (k.mesh = t(r[a][4])), s()))
                } else {
                    var l = c.features.features;
                    for (var a in l)
                        if (turf.inside(n, l[a])) return void(l[a] != k && (k = l[a], k.mesh || (k.mesh = t(l[a])), s()))
                }
                k = null, s()
            }
        }

        function a() {
            var e = i(d3.mouse(this)),
                t = o(c.projection.invert(e)),
                n = c.features.features;
            for (var r in n)
                if (turf.inside(t, n[r])) {
                    if (n[r] != b) h(n[r]), c.selectCallback(n[r]);
                    else {
                        var a = c.levelFeatures[b.properties.name].lookupTree.search([e[0], e[1], e[0], e[1]]);
                        for (var s in a)
                            if (turf.inside(t, a[s][4])) return void(j != a[s][4] ? (h(a[s][4]), c.selectCallback(a[s][4])) : (h(n[r]), c.selectCallback(n[r])))
                    }
                    return
                }
            l()
        }

        function s() {
            m.clearRect(0, 0, c.width * u, c.height * u), m.save(), m.scale(u * g, u * g), m.translate(v[0], v[1]), m.lineWidth = c.strokeWidth / g;
            var e = i([0, 0]),
                t = i([c.width, c.height]),
                o = [Math.min(e[0], t[0]), Math.min(e[1], t[1]), Math.max(e[0], t[0]), Math.max(e[1], t[1])],
                n = c.features.lookupTree.search(o);
            for (var r in n) n[r][4] == b && j || (m.beginPath(), y(n[r][4]), m.fillStyle = c.fillCallback(n[r][4], r), m.fill());
            if (b) {
                var n = c.levelFeatures[b.properties.name].lookupTree.search(o);
                for (var r in n) m.beginPath(), y(n[r][4]), m.fillStyle = c.fillCallback(n[r][4], r), m.fill()
            }
            m.beginPath(), b && b.mesh && y(b.mesh), j && j.mesh && y(j.mesh), k && k.mesh && y(k.mesh), m.fillStyle = "black", m.stroke(), m.restore()
        }

        function l() {
            w = !1;
            var e = 1,
                t = [0, 0];
            if (j) {
                var o = y.bounds(b),
                    i = o[1][0] - o[0][0],
                    n = o[1][1] - o[0][1],
                    r = (o[0][0] + o[1][0]) / 2,
                    a = (o[0][1] + o[1][1]) / 2;
                e = c.zoomScaleFactor * Math.min(c.width / i, c.height / n), t = [-r + c.width / e / 2, -a + c.height / e / 2]
            } else b = null;
            j = null, d3.transition().duration(300).ease("linear").tween("zoom", function() {
                var o = d3.interpolateNumber(g, e),
                    i = d3.interpolateArray(v, t),
                    n = v;
                return p = 1 / e / c.projection.scale() / 4,
                    function(t) {
                        g = o(t);
                        var r = i(t);
                        v = [n[0] + (r[0] - n[0]) * e / o(t), n[1] + (r[1] - n[1]) * e / o(t)], s()
                    }
            }).each("end", function() {
                w = !0
            }), b ? c.selectCallback(b) : c.selectCallback(null)
        }

        function h(e) {
            w = !1, e.properties.parent ? (j = e, j.mesh || (j.mesh = t(e)), b = e.properties.parent, b.mesh || (b.mesh = t(e.properties.parent))) : (b = e, b.mesh || (b.mesh = t(e)), j = null);
            var o = y.bounds(e),
                i = o[1][0] - o[0][0],
                n = o[1][1] - o[0][1],
                r = (o[0][0] + o[1][0]) / 2,
                a = (o[0][1] + o[1][1]) / 2,
                l = c.zoomScaleFactor * Math.min(c.width / i, c.height / n),
                h = [-r + c.width / l / 2, -a + c.height / l / 2];
            d3.transition().duration(300).ease("circle").tween("zoom", function() {
                var e = d3.interpolateNumber(g, l),
                    t = d3.interpolateArray(v, h),
                    o = v;
                return function(i) {
                    var n = t(i);
                    g = e(i), v = [o[0] + (n[0] - o[0]) * l / e(i), o[1] + (n[1] - o[1]) * l / e(i)], s()
                }
            }).each("end", function() {
                w = !0, p = 1 / g / c.projection.scale() / 4, s()
            })
        }
        topojson.presimplify(e.topojson);
        var c = jQuery.extend({
                strokeWidth: 1,
                height: 200,
                width: $(e.element).innerWidth(),
                zoomScaleFactor: .9,
                selectCallback: function(e) {},
                features: topojson.feature(e.topojson, e.topojson.objects[e.name]),
                levelFeatures: {},
                enableMeshes: !0
            }, e),
            u = 1,
            p = 1e-4,
            d = d3.geo.clipExtent().extent([
                [-c.width / 2, -c.height / 2],
                [c.width / 2, c.height / 2]
            ]),
            f = d3.geo.transform({
                point: function(e, t, o) {
                    o >= p && e >= 0 && t >= 0 && e < c.width && t < c.height && this.stream.point(e, t)
                }
            }),
            m = null,
            g = 1,
            v = [0, 0],
            b = null,
            j = null,
            k = null,
            w = !0;
        if (e.projection) var x = e.projection,
            y = d3.geo.path().projection({
                stream: function(e) {
                    return f.stream(x.stream(e))
                }
            });
        else {
            var S = d3.geo.bounds(c.features),
                x = d3.geo.mercator().scale(1).center([(S[1][0] + S[0][0]) / 2, (S[1][1] + S[0][1]) / 2]),
                y = d3.geo.path().projection({
                    stream: function(e) {
                        return f.stream(d.stream(x.stream(e)))
                    }
                }),
                C = y.bounds(c.features),
                P = C[1][0] - C[0][0],
                F = C[1][1] - C[0][1],
                M = .9 * (c.width / P);
            c.height = F * c.width / P, x.scale(M).translate([c.width / 2, c.height / 2])
        }
        c.projection = x, $(this).height(c.height), this.init = n, this.zoomOut = l, this.zoomIn = h, this.settings = function() {
            return c
        }
    }
}();
"use strict";
var Stack = function(t) {
    function e(t) {
        if (t.s) {
            var e = c(t.s) - 20,
                a = t.n.length + t.s.toString().length + 2,
                n = e / a;
            return n > 14 ? 1 === t.s ? t.n + ": " + t.s + " escaño" : t.n + ": " + t.s + " escaños" : n > 8 ? t.n + ": " + t.s : n > 10 ? 1 === t.s ? t.s + " escaño" : t.s + " escaños" : e > 10 ? t.s : ""
        }
        var e = c(t.p) - 20,
            a = t.n.length + t.p.toFixed(1).toString().length + 2,
            n = e / a;
        return n > 9 ? t.n + ": " + t.p.toFixed(1) + " %" : n > 2 ? t.p.toFixed(1) + " %" : ""
    }

    function a(t) {
        if (!t) return void d3.select(".stacked").classed("u-displayNone", !0);
        d3.select(".stacked").classed("u-displayNone", !1), i = [];
        var e = !1;
        t && t[0].s && (e = !0);
        var a = [],
            s = [];
        for (var d in t) {
            var c = t[d];
            (!e || c.s) && ("JxSí" == c.n || "CUP" == c.n || "CatSíqueesPot" == c.n || "unio.cat" == c ? a.push(c) : s.push(c))
        }
        s.reverse(), i = a.concat(s), l = 0;
        var o = d3.sum(t, function(t) {
            return t.s
        });
        for (var d in i) i[d].added = l, e && 135 == o ? (l += i[d].s, $(".markLabel, .markTriangle").removeClass("u-displayNone")) : e && 135 !== o ? (l += i[d].s, $(".markLabel, .markTriangle").addClass("u-displayNone")) : l += i[d].p;
        u ? n() : r()
    }

    function n() {
        var a = d.selectAll("rect").data(i, name);
        c = d3.scale.linear().domain([0, l]).range([0, o]), a.attr("fill", t.fillCallback).attr("x", function(t) {
            return c(t.added)
        }).attr("width", function(t) {
            return c(t.s ? t.s : t.p)
        }), a.exit().remove(), a.enter().append("rect").attr("fill", t.fillCallback).attr("y", function(t) {
            return 0
        }).attr("x", function(t) {
            return c(t.added)
        }).attr("height", f).attr("width", function(t) {
            return c(t.s ? t.s : t.p)
        }).attr("class", function(t) {
            return t.n
        });
        var n = d.selectAll("text").data(i);
        n.attr("x", function(t) {
            return c(t.added) + 10
        }).text(e), n.exit().remove(), n.enter().append("text").attr("x", function(t) {
            return c(t.added) + 10
        }).attr("y", f / 2).attr("dy", ".3em").attr("class", "stack-text").attr("text-anchor", "start").text(e)
    }

    function r() {
        u = !0, c = d3.scale.linear().domain([0, l]).range([0, o]), d = d3.select("#" + t.name).append("svg").attr("width", o).attr("height", f).append("g"), d.selectAll("rect").data(i).enter().append("rect").attr("fill", t.fillCallback).attr("y", function(t) {
            return 0
        }).attr("x", function(t) {
            return c(t.added)
        }).attr("height", f).attr("width", function(t) {
            return c(t.s ? t.s : t.p)
        }).attr("class", function(t) {
            return t.n
        }), d.selectAll("text").data(i).enter().append("text").attr("x", function(t) {
            return c(t.added) + 10
        }).attr("y", f / 2).attr("dy", ".3em").attr("class", "stack-text").attr("text-anchor", "start").text(e)
    }

    function s() {
        a(t.data)
    }
    var i, d, c, l, u = !1,
        o = $("#" + t.name).innerWidth(),
        f = $("#" + t.name).height();
    return {
        init: s,
        setData: a
    }
};
"use strict";
var twitterUrl = "https://twitter.com/intent/tweet?text=",
    Table = function(t) {
        function a(t) {
            return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }

        function l(t) {
            return t.toFixed(1).replace(".", ",")
        }

        function s(s) {
            e = s.r, i = s.n, n = s.e, r = s.p, e || (i += " (datos no disponibles)");
            var c = "<h3 class='tableHeader'>" + i + "<div class='pull-right'> <a href='https://es.wikipedia.org/wiki/" + i + "'><span class='fa fa-globe u-smallIcon u-colorizeBlack'/></a> <a class='js-twitterButton' href='#'><span class='fa fa-twitter u-smallIcon u-colorizeBlack'/></a></div></h3><h5>";
            n && (c = c + "<small class='u-uppercaseText u-colorizeBlack'>Escrutado: <span class='u-accentMark'>" + l(n) + "%</span></small>"), r && (c = c + "&nbsp; / &nbsp;<small class='u-uppercaseText u-colorizeBlack'>Participación: <span class='u-accentMark'>" + l(r) + "%</span></small>"), c += "</h5><table class=\"table table-hover\"><tr class='tableBackground'><th>Partido</th><th class='u-alignRight'>Votos</th><th class='u-alignRight'>Porcentaje</th>";
            var o = e && void 0 != e[0].s;
            if (o) {
                var d = t.seatsTitle;
                d || (d = "Escaños"), c = c + "<th class='u-alignRight'>" + d + "</th>"
            }
            c += "</tr>";
            for (var u in e) {
                var h = e[u];
                c = c + "<tr><td class='col-md-6 u-smallPadding'><div class='colorPill' style='background-color:rgb(" + colors[h.n] + ")'></div>" + h.n + "</td><td class='u-alignRight col-md-2 u-smallPadding'>" + a(h.v) + "</td><td class='u-alignRight col-md-2 u-smallPadding'>" + l(h.p) + "%</td>", o && (c = c + "<td class='u-alignRight col-md-2 u-smallPadding'>" + (h.s ? h.s : "") + "</td>"), c += "</tr>"
            }
            c += "</table>", $("." + t.name).html(c)
        }
        var e, i, n, r;
        return $("body").on("click", ".js-twitterButton", function(t) {
            $(this).attr("class").split(" ");
            if (e && $.inArray(!1)) {
                var a = e && void 0 != e[0].s;
                if (a) var l = i + ": " + e[0].n + " " + e[0].s + " escaños";
                else var l = i + ": " + e[0].n + " " + e[0].p.toFixed(1) + "%25";
                var s = l,
                    r = "";
                n && (r = ". Escrutado el " + n + "%25."), r += " Más información en elespanol.com %2327S";
                var c = 1;
                if (a)
                    for (; s.length + r.length < 140 && c < e.length;) l = s, s = l + ", " + e[c].n + " " + e[c].s, c += 1;
                else
                    for (; s.length + r.length < 140 && c < e.length;) l = s, s = l + ", " + e[c].n + " " + e[c].p.toFixed(1) + "%25", c += 1;
                window.location = twitterUrl + l + r
            }
            t.preventDefault()
        }), {
            setData: s
        }
    };
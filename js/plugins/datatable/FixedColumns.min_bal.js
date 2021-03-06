/**
 * @summary     FixedColumns
 * @description Freeze columns in place on a scrolling DataTable
 * @file        dataTables.fixedColumns.js
 * @version     2.5.0.dev
 * @author      Allan Jardine (www.sprymedia.co.uk)
 * @license     GPL v2 or BSD 3 point style
 * @contact     www.sprymedia.co.uk/contact
 *
 * @copyright Copyright 2010-2013 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 */
/* Global scope for FixedColumns - legacy and undocumented. Please use
 * $.fn.dataTable.FixedColumns
 */
var FixedColumns; (function(e, t, n, r) {
    FixedColumns = function(e, t) {
        var n = this;
        if (!this instanceof FixedColumns) {
            alert("FixedColumns warning: FixedColumns must be initialised with the 'new' keyword.");
            return
        }
        typeof t == "undefined" && (t = {});
        e.oApi._fnCamelToHungarian && e.oApi._fnCamelToHungarian(FixedColumns.defaults, t);
        this.s = {
            dt: e.fnSettings(),
            iTableColumns: e.fnSettings().aoColumns.length,
            aiOuterWidths: [],
            aiInnerWidths: []
        };
        this.dom = {
            scroller: null,
            header: null,
            body: null,
            footer: null,
            grid: {
                wrapper: null,
                dt: null,
                left: {
                    wrapper: null,
                    head: null,
                    body: null,
                    foot: null
                },
                right: {
                    wrapper: null,
                    head: null,
                    body: null,
                    foot: null
                }
            },
            clone: {
                left: {
                    header: null,
                    body: null,
                    footer: null
                },
                right: {
                    header: null,
                    body: null,
                    footer: null
                }
            }
        };
        this.s.dt.oFixedColumns = this;
        this.s.dt._bInitComplete ? this._fnConstruct(t) : this.s.dt.oApi._fnCallbackReg(this.s.dt, "aoInitComplete", 
        function() {
            n._fnConstruct(t)
        },
        "FixedColumns")
    };
    FixedColumns.prototype = {
        fnUpdate: function() {
            this._fnDraw(!0)
        },
        fnRedrawLayout: function() {
            this._fnColCalc();
            this._fnGridLayout();
            this.fnUpdate()
        },
        fnRecalculateHeight: function(e) {
            delete e._DTTC_iHeight;
            e.style.height = "auto"
        },
        fnSetRowHeight: function(e, t) {
            e.style.height = t + "px"
        },
        _fnConstruct: function(t) {
            var r,
            i,
            s,
            o = this;
            if (typeof this.s.dt.oInstance.fnVersionCheck != "function" || this.s.dt.oInstance.fnVersionCheck("1.8.0") !== !0) {
                alert("FixedColumns " + FixedColumns.VERSION + " required DataTables 1.8.0 or later. " + "Please upgrade your DataTables installation");
                return
            }
            if (this.s.dt.oScroll.sX === "") {
                this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "FixedColumns is not needed (no x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for column fixing when scrolling is not enabled");
                return
            }
            this.s = n.extend(!0, this.s, FixedColumns.defaults, t);
            this.dom.grid.dt = n(this.s.dt.nTable).parents("div.dataTables_scroll")[0];
            this.dom.scroller = n("div.dataTables_scrollBody", this.dom.grid.dt)[0];
            this._fnColCalc();
            this._fnGridSetup();
            n(this.dom.scroller).scroll(function() {
                o.s.iLeftColumns > 0 && (o.dom.grid.left.liner.scrollTop = o.dom.scroller.scrollTop);
                o.s.iRightColumns > 0 && (o.dom.grid.right.liner.scrollTop = o.dom.scroller.scrollTop)
            });
            if (o.s.iLeftColumns > 0) {
                n(o.dom.grid.left.liner).scroll(function() {
                    o.dom.scroller.scrollTop = o.dom.grid.left.liner.scrollTop;
                    o.s.iRightColumns > 0 && (o.dom.grid.right.liner.scrollTop = o.dom.grid.left.liner.scrollTop)
                });
                n(o.dom.grid.left.liner).bind("mousewheel", 
                function(e) {
                    var t = e.originalEvent.wheelDeltaX / 3;
                    o.dom.scroller.scrollLeft -= t
                })
            }
            if (o.s.iRightColumns > 0) {
                n(o.dom.grid.right.liner).scroll(function() {
                    o.dom.scroller.scrollTop = o.dom.grid.right.liner.scrollTop;
                    o.s.iLeftColumns > 0 && (o.dom.grid.left.liner.scrollTop = o.dom.grid.right.liner.scrollTop)
                });
                n(o.dom.grid.right.liner).bind("mousewheel", 
                function(e) {
                    var t = e.originalEvent.wheelDeltaX / 3;
                    o.dom.scroller.scrollLeft -= t
                })
            }
            n(e).resize(function() {
                o._fnGridLayout.call(o)
            });
            var u = !0;
            this.s.dt.aoDrawCallback = [{
                fn: function() {
                    o._fnDraw.call(o, u);
                    o._fnGridLayout(o);
                    u = !1
                },
                sName: "FixedColumns"
            }].concat(this.s.dt.aoDrawCallback);
            this._fnGridLayout();
            this.s.dt.oInstance.fnDraw(!1)
        },
        _fnColCalc: function() {
            var e = this,
            t = n(this.dom.grid.dt).width(),
            r = 0,
            i = 0;
            this.s.aiInnerWidths = [];
            n("tbody>tr:eq(0)>td, tbody>tr:eq(0)>th", this.s.dt.nTable).each(function(t) {
                e.s.aiInnerWidths.push(n(this).width());
                var s = n(this).outerWidth();
                e.s.aiOuterWidths.push(s);
                t < e.s.iLeftColumns && (r += s);
                e.s.iTableColumns - e.s.iRightColumns <= t && (i += s)
            });
            this.s.iLeftWidth = this.s.sLeftWidth == "fixed" ? r: r / t * 100;
            this.s.iRightWidth = this.s.sRightWidth == "fixed" ? i: i / t * 100
        },
        _fnGridSetup: function() {
            var e = this,
            t = this._fnDTOverflow(),
            r;
            this.dom.body = this.s.dt.nTable;
            this.dom.header = this.s.dt.nTHead.parentNode;
            this.dom.header.parentNode.parentNode.style.position = "relative";
            var i = n('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;"><div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;"><div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div><div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;"><div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div></div><div class="DTFC_RightWrapper" style="position:absolute; top:0; left:0;"><div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div><div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;"><div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div></div></div>')[0],
            s = i.childNodes[0],
            o = i.childNodes[1];
            this.dom.grid.dt.parentNode.insertBefore(i, this.dom.grid.dt);
            i.appendChild(this.dom.grid.dt);
            this.dom.grid.wrapper = i;
            if (this.s.iLeftColumns > 0) {
                this.dom.grid.left.wrapper = s;
                this.dom.grid.left.head = s.childNodes[0];
                this.dom.grid.left.body = s.childNodes[1];
                this.dom.grid.left.liner = n("div.DTFC_LeftBodyLiner", i)[0];
                i.appendChild(s)
            }
            if (this.s.iRightColumns > 0) {
                this.dom.grid.right.wrapper = o;
                this.dom.grid.right.head = o.childNodes[0];
                this.dom.grid.right.body = o.childNodes[1];
                this.dom.grid.right.liner = n("div.DTFC_RightBodyLiner", i)[0];
                r = n("div.DTFC_RightHeadBlocker", i)[0];
                r.style.width = t.bar + "px";
                r.style.right = -t.bar + "px";
                this.dom.grid.right.headBlock = r;
                r = n("div.DTFC_RightFootBlocker", i)[0];
                r.style.width = t.bar + "px";
                r.style.right = -t.bar + "px";
                this.dom.grid.right.footBlock = r;
                i.appendChild(o)
            }
            if (this.s.dt.nTFoot) {
                this.dom.footer = this.s.dt.nTFoot.parentNode;
                this.s.iLeftColumns > 0 && (this.dom.grid.left.foot = s.childNodes[2]);
                this.s.iRightColumns > 0 && (this.dom.grid.right.foot = o.childNodes[2])
            }
        },
        _fnGridLayout: function() {
            var e = this.dom.grid,
            t = n(e.wrapper).width(),
            r = n(this.s.dt.nTable.parentNode).height(),
            i = n(this.s.dt.nTable.parentNode.parentNode).height(),
            s,
            o,
            u,
            a = this._fnDTOverflow();
            this.s.sLeftWidth == "fixed" ? s = this.s.iLeftWidth: s = this.s.iLeftWidth / 100 * t;
            this.s.sRightWidth == "fixed" ? u = this.s.iRightWidth: u = this.s.iRightWidth / 100 * t;
            a.x && (r -= a.bar);
            e.wrapper.style.height = i + "px";
            if (this.s.iLeftColumns > 0) {
                e.left.wrapper.style.width = s + "px";
				e.left.wrapper.style.height = (i -a.bar) + "px";
                e.left.body.style.height = r + "px";
                e.left.foot && (e.left.foot.style.top = (a.x ? a.bar: 0) + "px");
                e.left.liner.style.width = s + a.bar + "px";
                e.left.liner.style.height = r + "px"
           }
            if (this.s.iRightColumns > 0) {
                o = t - u;
                a.y && (o -= a.bar);
                e.right.wrapper.style.width = u + "px";
                e.right.wrapper.style.left = o + "px";
                e.right.wrapper.style.height = i + "px";
                e.right.body.style.height = r + "px";
                e.right.foot && (e.right.foot.style.top = (a.x ? a.bar: 0) + "px");
                e.right.liner.style.width = u + a.bar + "px";
                e.right.liner.style.height = r + "px";
                e.right.headBlock.style.display = a.x ? "block": "none";
                e.right.footBlock.style.display = a.x ? "block": "none"
            }
        },
        _fnDTOverflow: function() {
            var e = this.s.dt.nTable,
            t = e.parentNode,
            n = {
                x: !1,
                y: !1,
                bar: this.s.dt.oScroll.iBarWidth
            };
            e.offsetWidth > t.offsetWidth && (n.x = !0);
            e.offsetHeight > t.offsetHeight && (n.y = !0);
            return n
        },
        _fnDraw: function(e) {
            this._fnCloneLeft(e);
            this._fnCloneRight(e);
            this.s.fnDrawCallback !== null && this.s.fnDrawCallback.call(this, this.dom.clone.left, this.dom.clone.right);
            n(this).trigger("draw", {
                leftClone: this.dom.clone.left,
                rightClone: this.dom.clone.right
            })
        },
        _fnCloneRight: function(e) {
            if (this.s.iRightColumns <= 0) return;
            var t = this,
            n,
            r,
            i = [];
            for (n = this.s.iTableColumns - this.s.iRightColumns; n < this.s.iTableColumns; n++) i.push(n);
            this._fnClone(this.dom.clone.right, this.dom.grid.right, i, e)
        },
        _fnCloneLeft: function(e) {
            if (this.s.iLeftColumns <= 0) return;
            var t = this,
            n,
            r,
            i = [];
            for (n = 0; n < this.s.iLeftColumns; n++) i.push(n);
            this._fnClone(this.dom.clone.left, this.dom.grid.left, i, e)
        },
        _fnCopyLayout: function(e, t) {
            var r = [],
            i = [],
            s = [];
            for (var o = 0, u = e.length; o < u; o++) {
                var a = [];
                a.nTr = n(e[o].nTr).clone(!0)[0];
                for (var f = 0, l = this.s.iTableColumns; f < l; f++) {
                    if (n.inArray(f, t) === -1) continue;
                    var c = n.inArray(e[o][f].cell, s);
                    if (c === -1) {
                        var h = n(e[o][f].cell).clone(!0)[0];
                        i.push(h);
                        s.push(e[o][f].cell);
                        a.push({
                            cell: h,
                            unique: e[o][f].unique
                        })
                    } else a.push({
                        cell: i[c],
                        unique: e[o][f].unique
                    })
                }
                r.push(a)
            }
            return r
        },
        _fnClone: function(e, t, r, i) {
            var s = this,
            o,
            u,
            a,
            f,
            l,
            c,
            h,
            p,
            d,
            v,
            m,
            g;
            if (i) {
                e.header !== null && e.header.parentNode.removeChild(e.header);
                e.header = n(this.dom.header).clone(!0)[0];
                e.header.className += " DTFC_Cloned";
                e.header.style.width = "100%";
                t.head.appendChild(e.header);
                v = this._fnCopyLayout(this.s.dt.aoHeader, r);
                m = n(">thead", e.header);
                m.empty();
                for (o = 0, u = v.length; o < u; o++) m[0].appendChild(v[o].nTr);
                this.s.dt.oApi._fnDrawHead(this.s.dt, v, !0)
            } else {
                v = this._fnCopyLayout(this.s.dt.aoHeader, r);
                g = [];
                this.s.dt.oApi._fnDetectHeader(g, n(">thead", e.header)[0]);
                for (o = 0, u = v.length; o < u; o++) for (a = 0, f = v[o].length; a < f; a++) {
                    g[o][a].cell.className = v[o][a].cell.className;
                    n("span.DataTables_sort_icon", g[o][a].cell).each(function() {
                        this.className = n("span.DataTables_sort_icon", v[o][a].cell)[0].className
                    })
                }
            }
            this._fnEqualiseHeights("thead", this.dom.header, e.header);
            this.s.sHeightMatch == "auto" && n(">tbody>tr", s.dom.body).css("height", "auto");
            if (e.body !== null) {
                e.body.parentNode.removeChild(e.body);
                e.body = null
            }
            e.body = n(this.dom.body).clone(!0)[0];
            e.body.className += " DTFC_Cloned";
            e.body.style.paddingBottom = this.s.dt.oScroll.iBarWidth + "px";
            e.body.style.marginBottom = this.s.dt.oScroll.iBarWidth * 2 + "px";
            e.body.getAttribute("id") !== null && e.body.removeAttribute("id");
            n(">thead>tr", e.body).empty();
            n(">tfoot", e.body).remove();
            var y = n("tbody", e.body)[0];
            n(y).empty();
            if (this.s.dt.aiDisplay.length > 0) {
                var b = n(">thead>tr", e.body)[0];
                for (d = 0; d < r.length; d++) {
                    h = r[d];
                    p = n(this.s.dt.aoColumns[h].nTh).clone(!0)[0];
                    p.innerHTML = "";
                    var w = p.style;
                    w.paddingTop = "0";
                    w.paddingBottom = "0";
                    w.borderTopWidth = "0";
                    w.borderBottomWidth = "0";
                    w.height = 0;
                    w.width = s.s.aiInnerWidths[h] + "px";
                    b.appendChild(p)
                }
                n(">tbody>tr", s.dom.body).each(function(e) {
                    var t = this.cloneNode(!1),
                    i = s.s.dt.oFeatures.bServerSide === !1 ? s.s.dt.aiDisplay[s.s.dt._iDisplayStart + e] : e;
                    for (d = 0; d < r.length; d++) {
                        var o = s.s.dt.oApi._fnGetTdNodes(s.s.dt, i);
                        h = r[d];
                        if (o.length > 0) {
                            p = n(o[h]).clone(!0)[0];
                            t.appendChild(p)
                        }
                    }
                    y.appendChild(t)
                })
            } else n(">tbody>tr", s.dom.body).each(function(e) {
                p = this.cloneNode(!0);
                p.className += " DTFC_NoData";
                n("td", p).html("");
                y.appendChild(p)
            });
            e.body.style.width = "100%";
//            e.body.style.margin = "0";
//            e.body.style.padding = "0";
            i && typeof this.s.dt.oScroller != "undefined" && t.liner.appendChild(this.s.dt.oScroller.dom.force.cloneNode(!0));
            t.liner.appendChild(e.body);
            this._fnEqualiseHeights("tbody", s.dom.body, e.body);
            if (this.s.dt.nTFoot !== null) {
                if (i) {
                    e.footer !== null && e.footer.parentNode.removeChild(e.footer);
                    e.footer = n(this.dom.footer).clone(!0)[0];
                    e.footer.className += " DTFC_Cloned";
                    e.footer.style.width = "100%";
                    t.foot.appendChild(e.footer);
                    v = this._fnCopyLayout(this.s.dt.aoFooter, r);
                    var E = n(">tfoot", e.footer);
                    E.empty();
                    for (o = 0, u = v.length; o < u; o++) E[0].appendChild(v[o].nTr);
                    this.s.dt.oApi._fnDrawHead(this.s.dt, v, !0)
                } else {
                    v = this._fnCopyLayout(this.s.dt.aoFooter, r);
                    var S = [];
                    this.s.dt.oApi._fnDetectHeader(S, n(">tfoot", e.footer)[0]);
                    for (o = 0, u = v.length; o < u; o++) for (a = 0, f = v[o].length; a < f; a++) S[o][a].cell.className = v[o][a].cell.className
                }
                this._fnEqualiseHeights("tfoot", this.dom.footer, e.footer)
            }
            var x = this.s.dt.oApi._fnGetUniqueThs(this.s.dt, n(">thead", e.header)[0]);
            n(x).each(function(e) {
                h = r[e];
                this.style.width = s.s.aiInnerWidths[h] + "px"
            });
            if (s.s.dt.nTFoot !== null) {
                x = this.s.dt.oApi._fnGetUniqueThs(this.s.dt, n(">tfoot", e.footer)[0]);
                n(x).each(function(e) {
                    h = r[e];
                    this.style.width = s.s.aiInnerWidths[h] + "px"
                })
            }
        },
        _fnGetTrNodes: function(e) {
            var t = [];
            for (var n = 0, r = e.childNodes.length; n < r; n++) e.childNodes[n].nodeName.toUpperCase() == "TR" && t.push(e.childNodes[n]);
            return t
        },
        _fnEqualiseHeights: function(e, t, r) {
            if (this.s.sHeightMatch == "none" && e !== "thead" && e !== "tfoot") return;
            var i = this,
            s,
            o,
            u,
            a,
            f,
            l,
            c = t.getElementsByTagName(e)[0],
            h = r.getElementsByTagName(e)[0],
            p = n(">" + e + ">tr:eq(0)", t).children(":first"),
            d = p.outerHeight() - p.height(),
            v = this._fnGetTrNodes(c),
            m = this._fnGetTrNodes(h);
            for (s = 0, o = m.length; s < o; s++) {
                f = v[s].offsetHeight;
                l = m[s].offsetHeight;
                u = l > f ? l: f;
                this.s.sHeightMatch == "semiauto" && (v[s]._DTTC_iHeight = u);
                m[s].style.height = u + "px";
                v[s].style.height = u + "px"
            }
        }
    };
    FixedColumns.defaults = {
        iLeftColumns: 1,
        iRightColumns: 0,
        fnDrawCallback: null,
        sLeftWidth: "fixed",
        iLeftWidth: null,
        sRightWidth: "fixed",
        iRightWidth: null,
        sHeightMatch: "semiauto"
    };
    FixedColumns.prototype.CLASS = "FixedColumns";
    FixedColumns.VERSION = "2.5.0.dev";
    n.fn.dataTable.FixedColumns = FixedColumns
})(window, document, jQuery);
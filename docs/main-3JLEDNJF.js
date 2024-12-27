var vy = Object.defineProperty,
  Dy = Object.defineProperties;
var wy = Object.getOwnPropertyDescriptors;
var xi = Object.getOwnPropertySymbols;
var ld = Object.prototype.hasOwnProperty,
  ud = Object.prototype.propertyIsEnumerable;
var cd = (t, e, n) =>
    e in t
      ? vy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  v = (t, e) => {
    for (var n in (e ||= {})) ld.call(e, n) && cd(t, n, e[n]);
    if (xi) for (var n of xi(e)) ud.call(e, n) && cd(t, n, e[n]);
    return t;
  },
  se = (t, e) => Dy(t, wy(e));
var Ni = (t, e) => {
  var n = {};
  for (var r in t) ld.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && xi)
    for (var r of xi(t)) e.indexOf(r) < 0 && ud.call(t, r) && (n[r] = t[r]);
  return n;
};
var Ri = (t, e, n) =>
  new Promise((r, i) => {
    var o = (c) => {
        try {
          a(n.next(c));
        } catch (l) {
          i(l);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (l) {
          i(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(o, s));
    a((n = n.apply(t, e)).next());
  });
var dd = null;
var oa = 1,
  fd = Symbol("SIGNAL");
function q(t) {
  let e = dd;
  return (dd = t), e;
}
var hd = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ey(t) {
  if (!(ca(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === oa)) {
    if (!t.producerMustRecompute(t) && !sa(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = oa);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = oa);
  }
}
function pd(t) {
  return t && (t.nextProducerIndex = 0), q(t);
}
function gd(t, e) {
  if (
    (q(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (ca(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        aa(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function sa(t) {
  Oi(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (Ey(n), r !== n.version)) return !0;
  }
  return !1;
}
function md(t) {
  if ((Oi(t), ca(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      aa(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function aa(t, e) {
  if ((by(t), Oi(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      aa(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Oi(i), (i.producerIndexOfThis[r] = e);
  }
}
function ca(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Oi(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function by(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Cy() {
  throw new Error();
}
var Iy = Cy;
function yd(t) {
  Iy = t;
}
function N(t) {
  return typeof t == "function";
}
function Mn(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Pi = Mn(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function mr(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var ce = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let o of n) o.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (N(r))
        try {
          r();
        } catch (o) {
          e = o instanceof Pi ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            vd(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Pi ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Pi(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) vd(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && mr(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && mr(n, e), e instanceof t && e._removeParent(this);
  }
};
ce.EMPTY = (() => {
  let t = new ce();
  return (t.closed = !0), t;
})();
var la = ce.EMPTY;
function Fi(t) {
  return (
    t instanceof ce ||
    (t && "closed" in t && N(t.remove) && N(t.add) && N(t.unsubscribe))
  );
}
function vd(t) {
  N(t) ? t() : t.unsubscribe();
}
var Ze = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var _n = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = _n;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = _n;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function ki(t) {
  _n.setTimeout(() => {
    let { onUnhandledError: e } = Ze;
    if (e) e(t);
    else throw t;
  });
}
function yr() {}
var Dd = ua("C", void 0, void 0);
function wd(t) {
  return ua("E", void 0, t);
}
function Ed(t) {
  return ua("N", t, void 0);
}
function ua(t, e, n) {
  return { kind: t, value: e, error: n };
}
var tn = null;
function An(t) {
  if (Ze.useDeprecatedSynchronousErrorHandling) {
    let e = !tn;
    if ((e && (tn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = tn;
      if (((tn = null), n)) throw r;
    }
  } else t();
}
function bd(t) {
  Ze.useDeprecatedSynchronousErrorHandling &&
    tn &&
    ((tn.errorThrown = !0), (tn.error = t));
}
var nn = class extends ce {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Fi(e) && e.add(this))
          : (this.destination = My);
    }
    static create(e, n, r) {
      return new xn(e, n, r);
    }
    next(e) {
      this.isStopped ? fa(Ed(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? fa(wd(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? fa(Dd, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Sy = Function.prototype.bind;
function da(t, e) {
  return Sy.call(t, e);
}
var ha = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          Li(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          Li(r);
        }
      else Li(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          Li(n);
        }
    }
  },
  xn = class extends nn {
    constructor(e, n, r) {
      super();
      let i;
      if (N(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && Ze.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && da(e.next, o),
              error: e.error && da(e.error, o),
              complete: e.complete && da(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new ha(i);
    }
  };
function Li(t) {
  Ze.useDeprecatedSynchronousErrorHandling ? bd(t) : ki(t);
}
function Ty(t) {
  throw t;
}
function fa(t, e) {
  let { onStoppedNotification: n } = Ze;
  n && _n.setTimeout(() => n(t, e));
}
var My = { closed: !0, next: yr, error: Ty, complete: yr };
var Nn = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function _e(t) {
  return t;
}
function pa(...t) {
  return ga(t);
}
function ga(t) {
  return t.length === 0
    ? _e
    : t.length === 1
    ? t[0]
    : function (n) {
        return t.reduce((r, i) => i(r), n);
      };
}
var U = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let o = Ay(n) ? n : new xn(n, r, i);
      return (
        An(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Cd(r)),
        new r((i, o) => {
          let s = new xn({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Nn]() {
      return this;
    }
    pipe(...n) {
      return ga(n)(this);
    }
    toPromise(n) {
      return (
        (n = Cd(n)),
        new n((r, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Cd(t) {
  var e;
  return (e = t ?? Ze.Promise) !== null && e !== void 0 ? e : Promise;
}
function _y(t) {
  return t && N(t.next) && N(t.error) && N(t.complete);
}
function Ay(t) {
  return (t && t instanceof nn) || (_y(t) && Fi(t));
}
function ma(t) {
  return N(t?.lift);
}
function j(t) {
  return (e) => {
    if (ma(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function V(t, e, n, r, i) {
  return new ya(t, e, n, r, i);
}
var ya = class extends nn {
  constructor(e, n, r, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Rn() {
  return j((t, e) => {
    let n = null;
    t._refCount++;
    let r = V(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        o = n;
      (n = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var On = class extends U {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ma(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new ce();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          V(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = ce.EMPTY));
    }
    return e;
  }
  refCount() {
    return Rn()(this);
  }
};
var Id = Mn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var we = (() => {
    class t extends U {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new ji(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Id();
      }
      next(n) {
        An(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        An(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        An(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: o } = this;
        return r || i
          ? la
          : ((this.currentObservers = null),
            o.push(n),
            new ce(() => {
              (this.currentObservers = null), mr(o, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this;
        r ? n.error(i) : o && n.complete();
      }
      asObservable() {
        let n = new U();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new ji(e, n)), t;
  })(),
  ji = class extends we {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : la;
    }
  };
var ge = class extends we {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Ae = new U((t) => t.complete());
function Sd(t) {
  return t && N(t.schedule);
}
function Td(t) {
  return t[t.length - 1];
}
function Md(t) {
  return N(Td(t)) ? t.pop() : void 0;
}
function kt(t) {
  return Sd(Td(t)) ? t.pop() : void 0;
}
function Ad(t, e, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? o(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
}
function _d(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function rn(t) {
  return this instanceof rn ? ((this.v = t), this) : new rn(t);
}
function xd(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    a("next"),
    a("throw"),
    a("return", s),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(h) {
    return function (p) {
      return Promise.resolve(p).then(h, d);
    };
  }
  function a(h, p) {
    r[h] &&
      ((i[h] = function (y) {
        return new Promise(function (A, M) {
          o.push([h, y, A, M]) > 1 || c(h, y);
        });
      }),
      p && (i[h] = p(i[h])));
  }
  function c(h, p) {
    try {
      l(r[h](p));
    } catch (y) {
      f(o[0][3], y);
    }
  }
  function l(h) {
    h.value instanceof rn
      ? Promise.resolve(h.value.v).then(u, d)
      : f(o[0][2], h);
  }
  function u(h) {
    c("next", h);
  }
  function d(h) {
    c("throw", h);
  }
  function f(h, p) {
    h(p), o.shift(), o.length && c(o[0][0], o[0][1]);
  }
}
function Nd(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof _d == "function" ? _d(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var Vi = (t) => t && typeof t.length == "number" && typeof t != "function";
function $i(t) {
  return N(t?.then);
}
function Bi(t) {
  return N(t[Nn]);
}
function Ui(t) {
  return Symbol.asyncIterator && N(t?.[Symbol.asyncIterator]);
}
function Hi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function xy() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var zi = xy();
function qi(t) {
  return N(t?.[zi]);
}
function Gi(t) {
  return xd(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield rn(n.read());
        if (i) return yield rn(void 0);
        yield yield rn(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Wi(t) {
  return N(t?.getReader);
}
function he(t) {
  if (t instanceof U) return t;
  if (t != null) {
    if (Bi(t)) return Ny(t);
    if (Vi(t)) return Ry(t);
    if ($i(t)) return Oy(t);
    if (Ui(t)) return Rd(t);
    if (qi(t)) return Py(t);
    if (Wi(t)) return Fy(t);
  }
  throw Hi(t);
}
function Ny(t) {
  return new U((e) => {
    let n = t[Nn]();
    if (N(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Ry(t) {
  return new U((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function Oy(t) {
  return new U((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, ki);
  });
}
function Py(t) {
  return new U((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function Rd(t) {
  return new U((e) => {
    ky(t, e).catch((n) => e.error(n));
  });
}
function Fy(t) {
  return Rd(Gi(t));
}
function ky(t, e) {
  var n, r, i, o;
  return Ad(this, void 0, void 0, function* () {
    try {
      for (n = Nd(t); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Ee(t, e, n, r = 0, i = !1) {
  let o = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(o), !i)) return o;
}
function Qi(t, e = 0) {
  return j((n, r) => {
    n.subscribe(
      V(
        r,
        (i) => Ee(r, t, () => r.next(i), e),
        () => Ee(r, t, () => r.complete(), e),
        (i) => Ee(r, t, () => r.error(i), e)
      )
    );
  });
}
function Ki(t, e = 0) {
  return j((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function Od(t, e) {
  return he(t).pipe(Ki(e), Qi(e));
}
function Pd(t, e) {
  return he(t).pipe(Ki(e), Qi(e));
}
function Fd(t, e) {
  return new U((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function kd(t, e) {
  return new U((n) => {
    let r;
    return (
      Ee(n, e, () => {
        (r = t[zi]()),
          Ee(
            n,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              o ? n.complete() : n.next(i);
            },
            0,
            !0
          );
      }),
      () => N(r?.return) && r.return()
    );
  });
}
function Yi(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new U((n) => {
    Ee(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      Ee(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Ld(t, e) {
  return Yi(Gi(t), e);
}
function jd(t, e) {
  if (t != null) {
    if (Bi(t)) return Od(t, e);
    if (Vi(t)) return Fd(t, e);
    if ($i(t)) return Pd(t, e);
    if (Ui(t)) return Yi(t, e);
    if (qi(t)) return kd(t, e);
    if (Wi(t)) return Ld(t, e);
  }
  throw Hi(t);
}
function re(t, e) {
  return e ? jd(t, e) : he(t);
}
function _(...t) {
  let e = kt(t);
  return re(t, e);
}
function Pn(t, e) {
  let n = N(t) ? t : () => t,
    r = (i) => i.error(n());
  return new U(e ? (i) => e.schedule(r, 0, i) : r);
}
function va(t) {
  return !!t && (t instanceof U || (N(t.lift) && N(t.subscribe)));
}
var Ct = Mn(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function L(t, e) {
  return j((n, r) => {
    let i = 0;
    n.subscribe(
      V(r, (o) => {
        r.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: Ly } = Array;
function jy(t, e) {
  return Ly(e) ? t(...e) : t(e);
}
function Vd(t) {
  return L((e) => jy(t, e));
}
var { isArray: Vy } = Array,
  { getPrototypeOf: $y, prototype: By, keys: Uy } = Object;
function $d(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Vy(e)) return { args: e, keys: null };
    if (Hy(e)) {
      let n = Uy(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function Hy(t) {
  return t && typeof t == "object" && $y(t) === By;
}
function Bd(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function vr(...t) {
  let e = kt(t),
    n = Md(t),
    { args: r, keys: i } = $d(t);
  if (r.length === 0) return re([], e);
  let o = new U(zy(r, e, i ? (s) => Bd(i, s) : _e));
  return n ? o.pipe(Vd(n)) : o;
}
function zy(t, e, n = _e) {
  return (r) => {
    Ud(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          Ud(
            e,
            () => {
              let l = re(t[c], e),
                u = !1;
              l.subscribe(
                V(
                  r,
                  (d) => {
                    (o[c] = d), u || ((u = !0), a--), a || r.next(n(o.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function Ud(t, e, n) {
  t ? Ee(n, t, e) : e();
}
function Hd(t, e, n, r, i, o, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    f = () => {
      d && !c.length && !l && e.complete();
    },
    h = (y) => (l < r ? p(y) : c.push(y)),
    p = (y) => {
      o && e.next(y), l++;
      let A = !1;
      he(n(y, u++)).subscribe(
        V(
          e,
          (M) => {
            i?.(M), o ? h(M) : e.next(M);
          },
          () => {
            A = !0;
          },
          void 0,
          () => {
            if (A)
              try {
                for (l--; c.length && l < r; ) {
                  let M = c.shift();
                  s ? Ee(e, s, () => p(M)) : p(M);
                }
                f();
              } catch (M) {
                e.error(M);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      V(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function ae(t, e, n = 1 / 0) {
  return N(e)
    ? ae((r, i) => L((o, s) => e(r, o, i, s))(he(t(r, i))), n)
    : (typeof e == "number" && (n = e), j((r, i) => Hd(r, i, t, n)));
}
function Fn(t = 1 / 0) {
  return ae(_e, t);
}
function zd() {
  return Fn(1);
}
function kn(...t) {
  return zd()(re(t, kt(t)));
}
function Zi(t) {
  return new U((e) => {
    he(t()).subscribe(e);
  });
}
function xe(t, e) {
  return j((n, r) => {
    let i = 0;
    n.subscribe(V(r, (o) => t.call(e, o, i++) && r.next(o)));
  });
}
function Lt(t) {
  return j((e, n) => {
    let r = null,
      i = !1,
      o;
    (r = e.subscribe(
      V(n, void 0, void 0, (s) => {
        (o = he(t(s, Lt(t)(e)))),
          r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
      })
    )),
      i && (r.unsubscribe(), (r = null), o.subscribe(n));
  });
}
function qd(t, e, n, r, i) {
  return (o, s) => {
    let a = n,
      c = e,
      l = 0;
    o.subscribe(
      V(
        s,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), r && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function jt(t, e) {
  return N(e) ? ae(t, e, 1) : ae(t, 1);
}
function Vt(t) {
  return j((e, n) => {
    let r = !1;
    e.subscribe(
      V(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(t), n.complete();
        }
      )
    );
  });
}
function It(t) {
  return t <= 0
    ? () => Ae
    : j((e, n) => {
        let r = 0;
        e.subscribe(
          V(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          })
        );
      });
}
function Da(t) {
  return L(() => t);
}
function Xi(t = qy) {
  return j((e, n) => {
    let r = !1;
    e.subscribe(
      V(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t()))
      )
    );
  });
}
function qy() {
  return new Ct();
}
function Ln(t) {
  return j((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Xe(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? xe((i, o) => t(i, o, r)) : _e,
      It(1),
      n ? Vt(e) : Xi(() => new Ct())
    );
}
function jn(t) {
  return t <= 0
    ? () => Ae
    : j((e, n) => {
        let r = [];
        e.subscribe(
          V(
            n,
            (i) => {
              r.push(i), t < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function wa(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? xe((i, o) => t(i, o, r)) : _e,
      jn(1),
      n ? Vt(e) : Xi(() => new Ct())
    );
}
function Ea(t, e) {
  return j(qd(t, e, arguments.length >= 2, !0));
}
function ba(...t) {
  let e = kt(t);
  return j((n, r) => {
    (e ? kn(t, n, e) : kn(t, n)).subscribe(r);
  });
}
function Ne(t, e) {
  return j((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      V(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = o++;
          he(t(c, u)).subscribe(
            (i = V(
              r,
              (d) => r.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Ca(t) {
  return j((e, n) => {
    he(t).subscribe(V(n, () => n.complete(), yr)), !n.closed && e.subscribe(n);
  });
}
function le(t, e, n) {
  let r = N(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? j((i, o) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        i.subscribe(
          V(
            o,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                o.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                o.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : _e;
}
var Rf = "https://g.co/ng/security#xss",
  m = class extends Error {
    constructor(e, n) {
      super(Oo(e, n)), (this.code = e);
    }
  };
function Oo(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function Pr(t) {
  return { toString: t }.toString();
}
var Ji = "__parameters__";
function Gy(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Of(t, e, n) {
  return Pr(() => {
    let r = Gy(e);
    function i(...o) {
      if (this instanceof i) return r.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(Ji)
          ? c[Ji]
          : Object.defineProperty(c, Ji, { value: [] })[Ji];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), c;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var Re = globalThis;
function K(t) {
  for (let e in t) if (t[e] === K) return e;
  throw Error("Could not find renamed property on target object.");
}
function be(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(be).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function Gd(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Wy = K({ __forward_ref__: K });
function Pf(t) {
  return (
    (t.__forward_ref__ = Pf),
    (t.toString = function () {
      return be(this());
    }),
    t
  );
}
function ze(t) {
  return Ff(t) ? t() : t;
}
function Ff(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Wy) && t.__forward_ref__ === Pf
  );
}
function w(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function We(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Po(t) {
  return Wd(t, Lf) || Wd(t, jf);
}
function kf(t) {
  return Po(t) !== null;
}
function Wd(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function Qy(t) {
  let e = t && (t[Lf] || t[jf]);
  return e || null;
}
function Qd(t) {
  return t && (t.hasOwnProperty(Kd) || t.hasOwnProperty(Ky)) ? t[Kd] : null;
}
var Lf = K({ ɵprov: K }),
  Kd = K({ ɵinj: K }),
  jf = K({ ngInjectableDef: K }),
  Ky = K({ ngInjectorDef: K }),
  S = class {
    constructor(e, n) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = w({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Vf(t) {
  return t && !!t.ɵproviders;
}
var Yy = K({ ɵcmp: K }),
  Zy = K({ ɵdir: K }),
  Xy = K({ ɵpipe: K }),
  Jy = K({ ɵmod: K }),
  lo = K({ ɵfac: K }),
  wr = K({ __NG_ELEMENT_ID__: K }),
  Yd = K({ __NG_ENV_ID__: K });
function Fo(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function ev(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Fo(t);
}
function tv(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new m(-200, t);
}
function Sc(t, e) {
  throw new m(-201, !1);
}
var O = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(O || {}),
  ja;
function $f() {
  return ja;
}
function He(t) {
  let e = ja;
  return (ja = t), e;
}
function Bf(t, e, n) {
  let r = Po(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & O.Optional) return null;
  if (e !== void 0) return e;
  Sc(t, "Injector");
}
var nv = {},
  br = nv,
  Va = "__NG_DI_FLAG__",
  uo = "ngTempTokenPath",
  rv = "ngTokenPath",
  iv = /\n/gm,
  ov = "\u0275",
  Zd = "__source",
  Hn;
function sv() {
  return Hn;
}
function $t(t) {
  let e = Hn;
  return (Hn = t), e;
}
function av(t, e = O.Default) {
  if (Hn === void 0) throw new m(-203, !1);
  return Hn === null
    ? Bf(t, void 0, e)
    : Hn.get(t, e & O.Optional ? null : void 0, e);
}
function E(t, e = O.Default) {
  return ($f() || av)(ze(t), e);
}
function g(t, e = O.Default) {
  return E(t, ko(e));
}
function ko(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function $a(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = ze(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new m(900, !1);
      let i,
        o = O.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = cv(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(E(i, o));
    } else e.push(E(r));
  }
  return e;
}
function Uf(t, e) {
  return (t[Va] = e), (t.prototype[Va] = e), t;
}
function cv(t) {
  return t[Va];
}
function lv(t, e, n, r) {
  let i = t[uo];
  throw (
    (e[Zd] && i.unshift(e[Zd]),
    (t.message = uv(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[rv] = i),
    (t[uo] = null),
    t)
  );
}
function uv(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == ov
      ? t.slice(2)
      : t;
  let i = be(e);
  if (Array.isArray(e)) i = e.map(be).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : be(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    iv,
    `
  `
  )}`;
}
var Lo = Uf(Of("Optional"), 8);
var Tc = Uf(Of("SkipSelf"), 4);
function qn(t, e) {
  let n = t.hasOwnProperty(lo);
  return n ? t[lo] : null;
}
function Mc(t, e) {
  t.forEach((n) => (Array.isArray(n) ? Mc(n, e) : e(n)));
}
function Hf(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function fo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function dv(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function fv(t, e, n) {
  let r = Fr(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), dv(t, r, e, n)), r;
}
function Ia(t, e) {
  let n = Fr(t, e);
  if (n >= 0) return t[n | 1];
}
function Fr(t, e) {
  return hv(t, e, 1);
}
function hv(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = t[o << n];
    if (e === s) return o << n;
    s > e ? (i = o) : (r = o + 1);
  }
  return ~(i << n);
}
var Cr = {},
  qe = [],
  sn = new S(""),
  zf = new S("", -1),
  qf = new S(""),
  ho = class {
    get(e, n = br) {
      if (n === br) {
        let r = new Error(`NullInjectorError: No provider for ${be(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Gf = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Gf || {}),
  dt = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(dt || {}),
  Tt = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(Tt || {});
function pv(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === r || t.charCodeAt(i + o) <= 32) return i;
    }
    n = i + 1;
  }
}
function Ba(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let o = n[r++],
        s = n[r++],
        a = n[r++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = n[++r];
      mv(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
    }
  }
  return r;
}
function gv(t) {
  return t === 3 || t === 4 || t === 6;
}
function mv(t) {
  return t.charCodeAt(0) === 64;
}
function _c(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? Xd(t, n, i, null, e[++r])
              : Xd(t, n, i, null, null));
      }
    }
  return t;
}
function Xd(t, e, n, r, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (r === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, r !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, n),
    r !== null && t.splice(o++, 0, r),
    i !== null && t.splice(o++, 0, i);
}
var Wf = "ng-template";
function yv(t, e, n, r) {
  let i = 0;
  if (r) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && pv(e[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Ac(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == "string"; )
      if (o.toLowerCase() === n) return !0;
  }
  return !1;
}
function Ac(t) {
  return t.type === 4 && t.value !== Wf;
}
function vv(t, e, n) {
  let r = t.type === 4 && !n ? Wf : t.value;
  return e === r;
}
function Dv(t, e, n) {
  let r = 4,
    i = t.attrs,
    o = i !== null ? bv(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !Je(r) && !Je(c)) return !1;
      if (s && Je(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !vv(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (Je(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (i === null || !yv(t, i, c, n)) {
          if (Je(r)) return !1;
          s = !0;
        }
      } else {
        let l = e[++a],
          u = wv(c, i, Ac(t), n);
        if (u === -1) {
          if (Je(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > o ? (d = "") : (d = i[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (Je(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return Je(r) || s;
}
function Je(t) {
  return (t & 1) === 0;
}
function wv(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return Cv(e, t);
}
function Ev(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (Dv(t, e[r], n)) return !0;
  return !1;
}
function bv(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (gv(n)) return e;
  }
  return t.length;
}
function Cv(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == "number") return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function Jd(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function Iv(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    o = !1;
  for (; n < t.length; ) {
    let s = t[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + s) : r & 4 && (i += " " + s);
    else
      i !== "" && !Je(s) && ((e += Jd(o, i)), (i = "")),
        (r = s),
        (o = o || !Je(r));
    n++;
  }
  return i !== "" && (e += Jd(o, i)), e;
}
function Sv(t) {
  return t.map(Iv).join(",");
}
function Tv(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++r]) : i === 8 && n.push(o);
    else {
      if (!Je(i)) break;
      i = o;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function ie(t) {
  return Pr(() => {
    let e = Xf(t),
      n = se(v({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Gf.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || dt.Emulated,
        styles: t.styles || qe,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Jf(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = tf(r, !1)), (n.pipeDefs = tf(r, !0)), (n.id = Av(n)), n
    );
  });
}
function Mv(t) {
  return Ut(t) || Qf(t);
}
function _v(t) {
  return t !== null;
}
function Qe(t) {
  return Pr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || qe,
    declarations: t.declarations || qe,
    imports: t.imports || qe,
    exports: t.exports || qe,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function ef(t, e) {
  if (t == null) return Cr;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        o,
        s,
        a = Tt.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((n[o] = a !== Tt.None ? [r, a] : r), (e[o] = s)) : (n[o] = r);
    }
  return n;
}
function hn(t) {
  return Pr(() => {
    let e = Xf(t);
    return Jf(e), e;
  });
}
function Ut(t) {
  return t[Yy] || null;
}
function Qf(t) {
  return t[Zy] || null;
}
function Kf(t) {
  return t[Xy] || null;
}
function Yf(t) {
  let e = Ut(t) || Qf(t) || Kf(t);
  return e !== null ? e.standalone : !1;
}
function Zf(t, e) {
  let n = t[Jy] || null;
  if (!n && e === !0)
    throw new Error(`Type ${be(t)} does not have '\u0275mod' property.`);
  return n;
}
function Xf(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Cr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || qe,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ef(t.inputs, e),
    outputs: ef(t.outputs),
    debugInfo: null,
  };
}
function Jf(t) {
  t.features?.forEach((e) => e(t));
}
function tf(t, e) {
  if (!t) return null;
  let n = e ? Kf : Mv;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(_v);
}
function Av(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
function kr(t) {
  return { ɵproviders: t };
}
function xv(...t) {
  return { ɵproviders: eh(!0, t), ɵfromNgModule: !0 };
}
function eh(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    Mc(e, (s) => {
      let a = s;
      Ua(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && th(i, o),
    n
  );
}
function th(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    xc(i, (o) => {
      e(o, r);
    });
  }
}
function Ua(t, e, n, r) {
  if (((t = ze(t)), !t)) return !1;
  let i = null,
    o = Qd(t),
    s = !o && Ut(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Qd(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (s) {
    if (a) return !1;
    if ((r.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) Ua(l, e, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let l;
      try {
        Mc(o.imports, (u) => {
          Ua(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && th(l, e);
    }
    if (!a) {
      let l = qn(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: qe }, i),
        e({ provide: qf, useValue: i, multi: !0 }, i),
        e({ provide: sn, useValue: () => E(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      xc(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function xc(t, e) {
  for (let n of t)
    Vf(n) && (n = n.ɵproviders), Array.isArray(n) ? xc(n, e) : e(n);
}
var Nv = K({ provide: String, useValue: K });
function nh(t) {
  return t !== null && typeof t == "object" && Nv in t;
}
function Rv(t) {
  return !!(t && t.useExisting);
}
function Ov(t) {
  return !!(t && t.useFactory);
}
function Ha(t) {
  return typeof t == "function";
}
var jo = new S(""),
  io = {},
  Pv = {},
  Sa;
function Nc() {
  return Sa === void 0 && (Sa = new ho()), Sa;
}
var Ce = class {},
  Ir = class extends Ce {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        qa(e, (s) => this.processProvider(s)),
        this.records.set(zf, Vn(void 0, this)),
        i.has("environment") && this.records.set(Ce, Vn(void 0, this));
      let o = this.records.get(jo);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(qf, qe, O.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = q(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          q(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = $t(this),
        r = He(void 0),
        i;
      try {
        return e();
      } finally {
        $t(n), He(r);
      }
    }
    get(e, n = br, r = O.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Yd))) return e[Yd](this);
      r = ko(r);
      let i,
        o = $t(this),
        s = He(void 0);
      try {
        if (!(r & O.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = $v(e) && Po(e);
            l && this.injectableDefInScope(l)
              ? (c = Vn(za(e), io))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & O.Self ? Nc() : this.parent;
        return (n = r & O.Optional && n === br ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[uo] = a[uo] || []).unshift(be(e)), o)) throw a;
          return lv(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        He(s), $t(o);
      }
    }
    resolveInjectorInitializers() {
      let e = q(null),
        n = $t(this),
        r = He(void 0),
        i;
      try {
        let o = this.get(sn, qe, O.Self);
        for (let s of o) s();
      } finally {
        $t(n), He(r), q(e);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(be(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new m(205, !1);
    }
    processProvider(e) {
      e = ze(e);
      let n = Ha(e) ? e : ze(e && e.provide),
        r = kv(e);
      if (!Ha(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = Vn(void 0, io, !0)),
          (i.factory = () => $a(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      let r = q(null);
      try {
        return (
          n.value === io && ((n.value = Pv), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Vv(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        q(r);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = ze(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function za(t) {
  let e = Po(t),
    n = e !== null ? e.factory : qn(t);
  if (n !== null) return n;
  if (t instanceof S) throw new m(204, !1);
  if (t instanceof Function) return Fv(t);
  throw new m(204, !1);
}
function Fv(t) {
  if (t.length > 0) throw new m(204, !1);
  let n = Qy(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function kv(t) {
  if (nh(t)) return Vn(void 0, t.useValue);
  {
    let e = Lv(t);
    return Vn(e, io);
  }
}
function Lv(t, e, n) {
  let r;
  if (Ha(t)) {
    let i = ze(t);
    return qn(i) || za(i);
  } else if (nh(t)) r = () => ze(t.useValue);
  else if (Ov(t)) r = () => t.useFactory(...$a(t.deps || []));
  else if (Rv(t)) r = () => E(ze(t.useExisting));
  else {
    let i = ze(t && (t.useClass || t.provide));
    if (jv(t)) r = () => new i(...$a(t.deps));
    else return qn(i) || za(i);
  }
  return r;
}
function Vn(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function jv(t) {
  return !!t.deps;
}
function Vv(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function $v(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof S);
}
function qa(t, e) {
  for (let n of t)
    Array.isArray(n) ? qa(n, e) : n && Vf(n) ? qa(n.ɵproviders, e) : e(n);
}
function ht(t, e) {
  t instanceof Ir && t.assertNotDestroyed();
  let n,
    r = $t(t),
    i = He(void 0);
  try {
    return e();
  } finally {
    $t(r), He(i);
  }
}
function rh() {
  return $f() !== void 0 || sv() != null;
}
function Bv(t) {
  if (!rh()) throw new m(-203, !1);
}
function Uv(t) {
  let e = Re.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Hv(t) {
  return typeof t == "function";
}
var Pe = 0,
  k = 1,
  x = 2,
  ye = 3,
  et = 4,
  it = 5,
  tt = 6,
  Sr = 7,
  Mt = 8,
  Gn = 9,
  nt = 10,
  Z = 11,
  Tr = 12,
  nf = 13,
  Lr = 14,
  Ge = 15,
  Vo = 16,
  $n = 17,
  Wn = 18,
  $o = 19,
  ih = 20,
  Bt = 21,
  Ta = 22,
  an = 23,
  Fe = 25,
  oh = 1,
  Mr = 6,
  _t = 7,
  po = 8,
  go = 9,
  Oe = 10,
  Rc = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(Rc || {});
function St(t) {
  return Array.isArray(t) && typeof t[oh] == "object";
}
function pt(t) {
  return Array.isArray(t) && t[oh] === !0;
}
function sh(t) {
  return (t.flags & 4) !== 0;
}
function jr(t) {
  return t.componentOffset > -1;
}
function Oc(t) {
  return (t.flags & 1) === 1;
}
function Vr(t) {
  return !!t.template;
}
function ah(t) {
  return (t[x] & 512) !== 0;
}
var Ga = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ch(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function Bo() {
  return lh;
}
function lh(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = qv), zv;
}
Bo.ngInherit = !0;
function zv() {
  let t = dh(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === Cr) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function qv(t, e, n, r, i) {
  let o = this.declaredInputs[r],
    s = dh(t) || Gv(t, { previous: Cr, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[o];
  (a[o] = new Ga(l && l.currentValue, n, c === Cr)), ch(t, e, i, n);
}
var uh = "__ngSimpleChanges__";
function dh(t) {
  return t[uh] || null;
}
function Gv(t, e) {
  return (t[uh] = e);
}
var rf = null;
var lt = function (t, e, n) {
    rf?.(t, e, n);
  },
  Wv = "svg",
  Qv = "math",
  Kv = !1;
function Yv() {
  return Kv;
}
function rt(t) {
  for (; Array.isArray(t); ) t = t[Pe];
  return t;
}
function fh(t, e) {
  return rt(e[t]);
}
function ke(t, e) {
  return rt(e[t.index]);
}
function hh(t, e) {
  return t.data[e];
}
function zt(t, e) {
  let n = e[t];
  return St(n) ? n : n[Pe];
}
function Pc(t) {
  return (t[x] & 128) === 128;
}
function Zv(t) {
  return pt(t[ye]);
}
function mo(t, e) {
  return e == null ? null : t[e];
}
function ph(t) {
  t[$n] = 0;
}
function Xv(t) {
  t[x] & 1024 || ((t[x] |= 1024), Pc(t) && _r(t));
}
function Fc(t) {
  return !!(t[x] & 9216 || t[an]?.dirty);
}
function Wa(t) {
  t[nt].changeDetectionScheduler?.notify(1),
    Fc(t)
      ? _r(t)
      : t[x] & 64 &&
        (Yv()
          ? ((t[x] |= 1024), _r(t))
          : t[nt].changeDetectionScheduler?.notify());
}
function _r(t) {
  t[nt].changeDetectionScheduler?.notify();
  let e = Ar(t);
  for (; e !== null && !(e[x] & 8192 || ((e[x] |= 8192), !Pc(e))); ) e = Ar(e);
}
function gh(t, e) {
  if ((t[x] & 256) === 256) throw new m(911, !1);
  t[Bt] === null && (t[Bt] = []), t[Bt].push(e);
}
function Jv(t, e) {
  if (t[Bt] === null) return;
  let n = t[Bt].indexOf(e);
  n !== -1 && t[Bt].splice(n, 1);
}
function Ar(t) {
  let e = t[ye];
  return pt(e) ? e[ye] : e;
}
var $ = { lFrame: bh(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function eD() {
  return $.lFrame.elementDepthCount;
}
function tD() {
  $.lFrame.elementDepthCount++;
}
function nD() {
  $.lFrame.elementDepthCount--;
}
function mh() {
  return $.bindingsEnabled;
}
function $r() {
  return $.skipHydrationRootTNode !== null;
}
function rD(t) {
  return $.skipHydrationRootTNode === t;
}
function iD(t) {
  $.skipHydrationRootTNode = t;
}
function oD() {
  $.skipHydrationRootTNode = null;
}
function ee() {
  return $.lFrame.lView;
}
function gt() {
  return $.lFrame.tView;
}
function ot() {
  let t = yh();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function yh() {
  return $.lFrame.currentTNode;
}
function sD() {
  let t = $.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Br(t, e) {
  let n = $.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function vh() {
  return $.lFrame.isParent;
}
function aD() {
  $.lFrame.isParent = !1;
}
function cD() {
  let t = $.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function lD(t) {
  return ($.lFrame.bindingIndex = t);
}
function kc() {
  return $.lFrame.bindingIndex++;
}
function uD(t) {
  let e = $.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function dD() {
  return $.lFrame.inI18n;
}
function fD(t, e) {
  let n = $.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), Qa(e);
}
function hD() {
  return $.lFrame.currentDirectiveIndex;
}
function Qa(t) {
  $.lFrame.currentDirectiveIndex = t;
}
function pD(t) {
  let e = $.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function Dh(t) {
  $.lFrame.currentQueryIndex = t;
}
function gD(t) {
  let e = t[k];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[it] : null;
}
function wh(t, e, n) {
  if (n & O.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(n & O.Host); )
      if (((i = gD(o)), i === null || ((o = o[Lr]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let r = ($.lFrame = Eh());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Lc(t) {
  let e = Eh(),
    n = t[k];
  ($.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function Eh() {
  let t = $.lFrame,
    e = t === null ? null : t.child;
  return e === null ? bh(t) : e;
}
function bh(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Ch() {
  let t = $.lFrame;
  return ($.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Ih = Ch;
function jc() {
  let t = Ch();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Zn() {
  return $.lFrame.selectedIndex;
}
function cn(t) {
  $.lFrame.selectedIndex = t;
}
function Vc() {
  let t = $.lFrame;
  return hh(t.tView, t.selectedIndex);
}
function Sh() {
  return $.lFrame.currentNamespace;
}
var Th = !0;
function $c() {
  return Th;
}
function mt(t) {
  Th = t;
}
function mD(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (r) {
    let s = lh(e);
    (n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o));
}
function Bc(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let o = t.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = o;
    s && (t.contentHooks ??= []).push(-n, s),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      l &&
        ((t.viewHooks ??= []).push(n, l), (t.viewCheckHooks ??= []).push(n, l)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function oo(t, e, n) {
  Mh(t, e, 3, n);
}
function so(t, e, n, r) {
  (t[x] & 3) === n && Mh(t, e, n, r);
}
function Ma(t, e) {
  let n = t[x];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[x] = n));
}
function Mh(t, e, n, r) {
  let i = r !== void 0 ? t[$n] & 65535 : 0,
    o = r ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[$n] += 65536),
        (a < o || o == -1) &&
          (yD(t, n, e, c), (t[$n] = (t[$n] & 4294901760) + c + 2)),
        c++;
}
function of(t, e) {
  lt(4, t, e);
  let n = q(null);
  try {
    e.call(t);
  } finally {
    q(n), lt(5, t, e);
  }
}
function yD(t, e, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = t[s];
  i
    ? t[x] >> 14 < t[$n] >> 16 &&
      (t[x] & 3) === e &&
      ((t[x] += 16384), of(a, o))
    : of(a, o);
}
var zn = -1,
  xr = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function vD(t) {
  return t instanceof xr;
}
function DD(t) {
  return (t.flags & 8) !== 0;
}
function wD(t) {
  return (t.flags & 16) !== 0;
}
function _h(t) {
  return t !== zn;
}
function yo(t) {
  return t & 32767;
}
function ED(t) {
  return t >> 16;
}
function vo(t, e) {
  let n = ED(t),
    r = e;
  for (; n > 0; ) (r = r[Lr]), n--;
  return r;
}
var Ka = !0;
function sf(t) {
  let e = Ka;
  return (Ka = t), e;
}
var bD = 256,
  Ah = bD - 1,
  xh = 5,
  CD = 0,
  ut = {};
function ID(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(wr) && (r = n[wr]),
    r == null && (r = n[wr] = CD++);
  let i = r & Ah,
    o = 1 << i;
  e.data[t + (i >> xh)] |= o;
}
function Nh(t, e) {
  let n = Rh(t, e);
  if (n !== -1) return n;
  let r = e[k];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    _a(r.data, t),
    _a(e, null),
    _a(r.blueprint, null));
  let i = Uc(t, e),
    o = t.injectorIndex;
  if (_h(i)) {
    let s = yo(i),
      a = vo(i, e),
      c = a[k].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function _a(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Rh(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Uc(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = Lh(i)), r === null)) return zn;
    if ((n++, (i = i[Lr]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return zn;
}
function SD(t, e, n) {
  ID(t, e, n);
}
function Oh(t, e, n) {
  if (n & O.Optional || t !== void 0) return t;
  Sc(e, "NodeInjector");
}
function Ph(t, e, n, r) {
  if (
    (n & O.Optional && r === void 0 && (r = null), !(n & (O.Self | O.Host)))
  ) {
    let i = t[Gn],
      o = He(void 0);
    try {
      return i ? i.get(e, r, n & O.Optional) : Bf(e, r, n & O.Optional);
    } finally {
      He(o);
    }
  }
  return Oh(r, e, n);
}
function Fh(t, e, n, r = O.Default, i) {
  if (t !== null) {
    if (e[x] & 2048 && !(r & O.Self)) {
      let s = xD(t, e, n, r, ut);
      if (s !== ut) return s;
    }
    let o = kh(t, e, n, r, ut);
    if (o !== ut) return o;
  }
  return Ph(e, n, r, i);
}
function kh(t, e, n, r, i) {
  let o = _D(n);
  if (typeof o == "function") {
    if (!wh(e, t, r)) return r & O.Host ? Oh(i, n, r) : Ph(e, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & O.Optional))) Sc(n);
      else return s;
    } finally {
      Ih();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Rh(t, e),
      c = zn,
      l = r & O.Host ? e[Ge][it] : null;
    for (
      (a === -1 || r & O.SkipSelf) &&
      ((c = a === -1 ? Uc(t, e) : e[a + 8]),
      c === zn || !cf(r, !1)
        ? (a = -1)
        : ((s = e[k]), (a = yo(c)), (e = vo(c, e))));
      a !== -1;

    ) {
      let u = e[k];
      if (af(o, a, u.data)) {
        let d = TD(a, e, n, s, r, l);
        if (d !== ut) return d;
      }
      (c = e[a + 8]),
        c !== zn && cf(r, e[k].data[a + 8] === l) && af(o, a, e)
          ? ((s = u), (a = yo(c)), (e = vo(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function TD(t, e, n, r, i, o) {
  let s = e[k],
    a = s.data[t + 8],
    c = r == null ? jr(a) && Ka : r != s && (a.type & 3) !== 0,
    l = i & O.Host && o === a,
    u = MD(a, s, n, c, l);
  return u !== null ? Nr(e, s, u, a) : ut;
}
function MD(t, e, n, r, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = o >> 20,
    d = r ? a : a + u,
    f = i ? a + u : l;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < c && n === p) || (h >= c && p.type === n)) return h;
  }
  if (i) {
    let h = s[c];
    if (h && Vr(h) && h.type === n) return c;
  }
  return null;
}
function Nr(t, e, n, r) {
  let i = t[n],
    o = e.data;
  if (vD(i)) {
    let s = i;
    s.resolving && tv(ev(o[n]));
    let a = sf(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? He(s.injectImpl) : null,
      u = wh(t, r, O.Default);
    try {
      (i = t[n] = s.factory(void 0, o, t, r)),
        e.firstCreatePass && n >= r.directiveStart && mD(n, o[n], e);
    } finally {
      l !== null && He(l), sf(a), (s.resolving = !1), Ih();
    }
  }
  return i;
}
function _D(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(wr) ? t[wr] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Ah : AD) : e;
}
function af(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> xh)] & r);
}
function cf(t, e) {
  return !(t & O.Self) && !(t & O.Host && e);
}
var on = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return Fh(this._tNode, this._lView, e, ko(r), n);
  }
};
function AD() {
  return new on(ot(), ee());
}
function Hc(t) {
  return Pr(() => {
    let e = t.prototype.constructor,
      n = e[lo] || Ya(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let o = i[lo] || Ya(i);
      if (o && o !== n) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Ya(t) {
  return Ff(t)
    ? () => {
        let e = Ya(ze(t));
        return e && e();
      }
    : qn(t);
}
function xD(t, e, n, r, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[x] & 2048 && !(s[x] & 512); ) {
    let a = kh(o, s, n, r | O.Self, ut);
    if (a !== ut) return a;
    let c = o.parent;
    if (!c) {
      let l = s[ih];
      if (l) {
        let u = l.get(n, ut, r);
        if (u !== ut) return u;
      }
      (c = Lh(s)), (s = s[Lr]);
    }
    o = c;
  }
  return i;
}
function Lh(t) {
  let e = t[k],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[it] : null;
}
function lf(t, e = null, n = null, r) {
  let i = jh(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function jh(t, e = null, n = null, r, i = new Set()) {
  let o = [n || qe, xv(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : be(t))),
    new Ir(o, e || Nc(), r || null, i)
  );
}
var st = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return lf({ name: "" }, i, r, "");
      {
        let o = r.name ?? "";
        return lf({ name: o }, r.parent, r.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = br),
    (e.NULL = new ho()),
    (e.ɵprov = w({ token: e, providedIn: "any", factory: () => E(zf) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ND = "ngOriginalError";
function Aa(t) {
  return t[ND];
}
var ft = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && Aa(e);
      for (; n && Aa(n); ) n = Aa(n);
      return n || null;
    }
  },
  Vh = new S("", {
    providedIn: "root",
    factory: () => g(ft).handleError.bind(void 0),
  }),
  zc = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = RD), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  Za = class extends zc {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return gh(this._lView, e), () => Jv(this._lView, e);
    }
  };
function RD() {
  return new Za(ee());
}
function OD() {
  return Uo(ot(), ee());
}
function Uo(t, e) {
  return new pn(ke(t, e));
}
var pn = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = OD;
  let t = e;
  return t;
})();
var Xa = class extends we {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      rh() && (this.destroyRef = g(zc, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let n = q(null);
    try {
      super.next(e);
    } finally {
      q(n);
    }
  }
  subscribe(e, n, r) {
    let i = e,
      o = n || (() => null),
      s = r;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = xa(o)), i && (i = xa(i)), s && (s = xa(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof ce && e.add(a), a;
  }
};
function xa(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var me = Xa;
var PD = "ngSkipHydration",
  FD = "ngskiphydration";
function $h(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let n = 0; n < e.length; n += 2) {
    let r = e[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === FD) return !0;
  }
  return !1;
}
function Bh(t) {
  console.log(t);
  return t.hasAttribute(PD);
}
function Do(t) {
  return (t.flags & 128) === 128;
}
function kD(t) {
  if (Do(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if (Do(t) || $h(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var Uh = new Map(),
  LD = 0;
function jD() {
  return LD++;
}
function VD(t) {
  Uh.set(t[$o], t);
}
function $D(t) {
  Uh.delete(t[$o]);
}
var uf = "__ngContext__";
function ln(t, e) {
  St(e) ? ((t[uf] = e[$o]), VD(e)) : (t[uf] = e);
}
function Hh(t) {
  return qh(t[Tr]);
}
function zh(t) {
  return qh(t[et]);
}
function qh(t) {
  for (; t !== null && !pt(t); ) t = t[et];
  return t;
}
var Ja;
function Gh(t) {
  Ja = t;
}
function Ho() {
  if (Ja !== void 0) return Ja;
  if (typeof document < "u") return document;
  throw new m(210, !1);
}
var Ur = new S("", { providedIn: "root", factory: () => BD }),
  BD = "ng",
  qc = new S(""),
  oe = new S("", { providedIn: "platform", factory: () => "unknown" });
var Gc = new S(""),
  Wc = new S("", {
    providedIn: "root",
    factory: () =>
      Ho().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function UD() {
  let t = new gn();
  return g(oe) === "browser" && (t.store = HD(Ho(), g(Ur))), t;
}
var gn = (() => {
  let e = class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    get(r, i) {
      return this.store[r] !== void 0 ? this.store[r] : i;
    }
    set(r, i) {
      this.store[r] = i;
    }
    remove(r) {
      delete this.store[r];
    }
    hasKey(r) {
      return this.store.hasOwnProperty(r);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(r, i) {
      this.onSerializeCallbacks[r] = i;
    }
    toJson() {
      for (let r in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(r))
          try {
            this.store[r] = this.onSerializeCallbacks[r]();
          } catch (i) {
            console.warn("Exception in onSerialize callback: ", i);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: UD });
  let t = e;
  return t;
})();
function HD(t, e) {
  let n = t.getElementById(e + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + e, r);
    }
  return {};
}
var Wh = "h",
  Qh = "b",
  ec = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(ec || {}),
  zD = "e",
  qD = "t",
  Qc = "c",
  Kh = "x",
  wo = "r",
  GD = "i",
  WD = "n",
  QD = "d",
  KD = "__nghData__",
  Yh = KD,
  Na = "ngh",
  YD = "nghm",
  Zh = () => null;
function ZD(t, e, n = !1) {
  let r = t.getAttribute(Na);
  if (r == null) return null;
  let [i, o] = r.split("|");
  if (((r = n ? o : i), !r)) return null;
  let s = o ? `|${o}` : "",
    a = n ? i : s,
    c = {};
  if (r !== "") {
    let u = e.get(gn, null, { optional: !0 });
    u !== null && (c = u.get(Yh, [])[Number(r)]);
  }
  let l = { data: c, firstChild: t.firstChild ?? null };
  return (
    n && ((l.firstChild = t), zo(l, 0, t.nextSibling)),
    a ? t.setAttribute(Na, a) : t.removeAttribute(Na),
    l
  );
}
function XD() {
  Zh = ZD;
}
function Kc(t, e, n = !1) {
  return Zh(t, e, n);
}
function JD(t) {
  let e = t._lView;
  return e[k].type === 2 ? null : (ah(e) && (e = e[Fe]), e);
}
function ew(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function tw(t) {
  let e = Ho(),
    n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(o) {
        let s = ew(o);
        return s === "ngetn" || s === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    i = [];
  for (; (r = n.nextNode()); ) i.push(r);
  for (let o of i)
    o.textContent === "ngetn"
      ? o.replaceWith(e.createTextNode(""))
      : o.remove();
}
function zo(t, e, n) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = n);
}
function tc(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function nw(t, e) {
  let n = t.data,
    r = n[zD]?.[e] ?? null;
  return r === null && n[Qc]?.[e] && (r = Yc(t, e)), r;
}
function Xh(t, e) {
  return t.data[Qc]?.[e] ?? null;
}
function Yc(t, e) {
  let n = Xh(t, e) ?? [],
    r = 0;
  for (let i of n) r += i[wo] * (i[Kh] ?? 1);
  return r;
}
function qo(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let n = t.data[QD];
    t.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var eo = new S(""),
  Jh = !1,
  ep = new S("", { providedIn: "root", factory: () => Jh }),
  rw = new S("");
var Eo = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Rf})`;
  }
};
function Go(t) {
  return t instanceof Eo ? t.changingThisBreaksApplicationSecurity : t;
}
function tp(t, e) {
  let n = iw(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${Rf})`);
  }
  return n === e;
}
function iw(t) {
  return (t instanceof Eo && t.getTypeName()) || null;
}
var ow = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function np(t) {
  return (t = String(t)), t.match(ow) ? t : "unsafe:" + t;
}
var Zc = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Zc || {});
function rp(t) {
  let e = sw();
  return e ? e.sanitize(Zc.URL, t) || "" : tp(t, "URL") ? Go(t) : np(Fo(t));
}
function sw() {
  let t = ee();
  return t && t[nt].sanitizer;
}
var aw = /^>|^->|<!--|-->|--!>|<!-$/g,
  cw = /(<|>)/g,
  lw = "\u200B$1\u200B";
function uw(t) {
  return t.replace(aw, (e) => e.replace(cw, lw));
}
function dw(t) {
  return t.ownerDocument.body;
}
function ip(t) {
  return t instanceof Function ? t() : t;
}
function Dr(t) {
  return (t ?? g(st)).get(oe) === "browser";
}
var At = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(At || {}),
  fw;
function Xc(t, e) {
  return fw(t, e);
}
function Bn(t, e, n, r, i) {
  if (r != null) {
    let o,
      s = !1;
    pt(r) ? (o = r) : St(r) && ((s = !0), (r = r[Pe]));
    let a = rt(r);
    t === 0 && n !== null
      ? i == null
        ? cp(e, n, a)
        : bo(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? bo(e, n, a, i || null, !0)
      : t === 2
      ? rl(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && Aw(e, t, o, n, i);
  }
}
function Jc(t, e) {
  return t.createText(e);
}
function hw(t, e, n) {
  t.setValue(e, n);
}
function el(t, e) {
  return t.createComment(uw(e));
}
function Wo(t, e, n) {
  return t.createElement(e, n);
}
function pw(t, e) {
  op(t, e), (e[Pe] = null), (e[it] = null);
}
function gw(t, e, n, r, i, o) {
  (r[Pe] = i), (r[it] = e), Qo(t, r, n, 1, i, o);
}
function op(t, e) {
  e[nt].changeDetectionScheduler?.notify(1), Qo(t, e, e[Z], 2, null, null);
}
function mw(t) {
  let e = t[Tr];
  if (!e) return Ra(t[k], t);
  for (; e; ) {
    let n = null;
    if (St(e)) n = e[Tr];
    else {
      let r = e[Oe];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[et] && e !== t; ) St(e) && Ra(e[k], e), (e = e[ye]);
      e === null && (e = t), St(e) && Ra(e[k], e), (n = e && e[et]);
    }
    e = n;
  }
}
function yw(t, e, n, r) {
  let i = Oe + r,
    o = n.length;
  r > 0 && (n[i - 1][et] = e),
    r < o - Oe
      ? ((e[et] = n[i]), Hf(n, Oe + r, e))
      : (n.push(e), (e[et] = null)),
    (e[ye] = n);
  let s = e[Vo];
  s !== null && n !== s && vw(s, e);
  let a = e[Wn];
  a !== null && a.insertView(t), Wa(e), (e[x] |= 128);
}
function vw(t, e) {
  let n = t[go],
    i = e[ye][ye][Ge];
  e[Ge] !== i && (t[x] |= Rc.HasTransplantedViews),
    n === null ? (t[go] = [e]) : n.push(e);
}
function sp(t, e) {
  let n = t[go],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function nc(t, e) {
  if (t.length <= Oe) return;
  let n = Oe + e,
    r = t[n];
  if (r) {
    let i = r[Vo];
    i !== null && i !== t && sp(i, r), e > 0 && (t[n - 1][et] = r[et]);
    let o = fo(t, Oe + e);
    pw(r[k], r);
    let s = o[Wn];
    s !== null && s.detachView(o[k]),
      (r[ye] = null),
      (r[et] = null),
      (r[x] &= -129);
  }
  return r;
}
function ap(t, e) {
  if (!(e[x] & 256)) {
    let n = e[Z];
    n.destroyNode && Qo(t, e, n, 3, null, null), mw(e);
  }
}
function Ra(t, e) {
  if (e[x] & 256) return;
  let n = q(null);
  try {
    (e[x] &= -129),
      (e[x] |= 256),
      e[an] && md(e[an]),
      ww(t, e),
      Dw(t, e),
      e[k].type === 1 && e[Z].destroy();
    let r = e[Vo];
    if (r !== null && pt(e[ye])) {
      r !== e[ye] && sp(r, e);
      let i = e[Wn];
      i !== null && i.detachView(t);
    }
    $D(e);
  } finally {
    q(n);
  }
}
function Dw(t, e) {
  let n = t.cleanup,
    r = e[Sr];
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == "string") {
        let s = n[o + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
      } else {
        let s = r[n[o + 1]];
        n[o].call(s);
      }
  r !== null && (e[Sr] = null);
  let i = e[Bt];
  if (i !== null) {
    e[Bt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function ww(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof xr)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            lt(4, a, c);
            try {
              c.call(a);
            } finally {
              lt(5, a, c);
            }
          }
        else {
          lt(4, i, o);
          try {
            o.call(i);
          } finally {
            lt(5, i, o);
          }
        }
      }
    }
}
function Ew(t, e, n) {
  return bw(t, e.parent, n);
}
function bw(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[Pe];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: o } = t.data[r.directiveStart + i];
      if (o === dt.None || o === dt.Emulated) return null;
    }
    return ke(r, n);
  }
}
function bo(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function cp(t, e, n) {
  t.appendChild(e, n);
}
function df(t, e, n, r, i) {
  r !== null ? bo(t, e, n, r, i) : cp(t, e, n);
}
function Cw(t, e, n, r) {
  t.removeChild(e, n, r);
}
function tl(t, e) {
  return t.parentNode(e);
}
function Iw(t, e) {
  return t.nextSibling(e);
}
function Sw(t, e, n) {
  return Mw(t, e, n);
}
function Tw(t, e, n) {
  return t.type & 40 ? ke(t, n) : null;
}
var Mw = Tw,
  ff;
function nl(t, e, n, r) {
  let i = Ew(t, r, e),
    o = e[Z],
    s = r.parent || e[it],
    a = Sw(s, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) df(o, i, n[c], a, !1);
    else df(o, i, n, a, !1);
  ff !== void 0 && ff(o, r, e, n, i);
}
function ao(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return ke(e, t);
    if (n & 4) return rc(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return ao(t, r);
      {
        let i = t[e.index];
        return pt(i) ? rc(-1, i) : rt(i);
      }
    } else {
      if (n & 32) return Xc(e, t)() || rt(t[e.index]);
      {
        let r = lp(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Ar(t[Ge]);
          return ao(i, r);
        } else return ao(t, e.next);
      }
    }
  }
  return null;
}
function lp(t, e) {
  if (e !== null) {
    let r = t[Ge][it],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function rc(t, e) {
  let n = Oe + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[k].firstChild;
    if (i !== null) return ao(r, i);
  }
  return e[_t];
}
function rl(t, e, n) {
  let r = tl(t, e);
  r && Cw(t, r, e, n);
}
function up(t) {
  t.textContent = "";
}
function il(t, e, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (s && e === 0 && (a && ln(rt(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) il(t, e, n.child, r, i, o, !1), Bn(e, t, i, a, o);
      else if (c & 32) {
        let l = Xc(n, r),
          u;
        for (; (u = l()); ) Bn(e, t, i, u, o);
        Bn(e, t, i, a, o);
      } else c & 16 ? _w(t, e, r, n, i, o) : Bn(e, t, i, a, o);
    n = s ? n.projectionNext : n.next;
  }
}
function Qo(t, e, n, r, i, o) {
  il(n, r, t.firstChild, e, i, o, !1);
}
function _w(t, e, n, r, i, o) {
  let s = n[Ge],
    c = s[it].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Bn(e, t, i, u, o);
    }
  else {
    let l = c,
      u = s[ye];
    Do(r) && (l.flags |= 128), il(t, e, l, u, i, o, !0);
  }
}
function Aw(t, e, n, r, i) {
  let o = n[_t],
    s = rt(n);
  o !== s && Bn(e, t, r, o, i);
  for (let a = Oe; a < n.length; a++) {
    let c = n[a];
    Qo(c[k], c, t, e, r, o);
  }
}
function xw(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let o = r.indexOf("-") === -1 ? void 0 : At.DashCase;
    i == null
      ? t.removeStyle(n, r, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= At.Important)),
        t.setStyle(n, r, i, o));
  }
}
function Nw(t, e, n) {
  t.setAttribute(e, "style", n);
}
function dp(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function fp(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  r !== null && Ba(t, e, r),
    i !== null && dp(t, e, i),
    o !== null && Nw(t, e, o);
}
var qt = {};
function Le(t = 1) {
  hp(gt(), ee(), Zn() + t, !1);
}
function hp(t, e, n, r) {
  if (!r)
    if ((e[x] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && oo(e, o, n);
    } else {
      let o = t.preOrderHooks;
      o !== null && so(e, o, 0, n);
    }
  cn(n);
}
function X(t, e = O.Default) {
  let n = ee();
  if (n === null) return E(t, e);
  let r = ot();
  return Fh(r, n, ze(t), e);
}
function pp() {
  let t = "invalid";
  throw new Error(t);
}
function gp(t, e, n, r, i, o) {
  let s = q(null);
  try {
    let a = null;
    i & Tt.SignalBased && (a = e[r][fd]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & Tt.HasDecoratorInputTransform &&
        (o = t.inputTransforms[r].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, n, r) : ch(e, a, r, o);
  } finally {
    q(s);
  }
}
function Rw(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) cn(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          fD(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      cn(-1);
    }
}
function Ko(t, e, n, r, i, o, s, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[Pe] = i),
    (d[x] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[x] & 2048)) && (d[x] |= 2048),
    ph(d),
    (d[ye] = d[Lr] = t),
    (d[Mt] = n),
    (d[nt] = s || (t && t[nt])),
    (d[Z] = a || (t && t[Z])),
    (d[Gn] = c || (t && t[Gn]) || null),
    (d[it] = o),
    (d[$o] = jD()),
    (d[tt] = u),
    (d[ih] = l),
    (d[Ge] = e.type == 2 ? t[Ge] : d),
    d
  );
}
function Yo(t, e, n, r, i) {
  let o = t.data[e];
  if (o === null) (o = Ow(t, e, n, r, i)), dD() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = n), (o.value = r), (o.attrs = i);
    let s = sD();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Br(o, !0), o;
}
function Ow(t, e, n, r, i) {
  let o = yh(),
    s = vh(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = Vw(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function mp(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let o = 0; o < n; o++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function yp(t, e, n, r, i) {
  let o = Zn(),
    s = r & 2;
  try {
    cn(-1), s && e.length > Fe && hp(t, e, Fe, !1), lt(s ? 2 : 0, i), n(r, i);
  } finally {
    cn(o), lt(s ? 3 : 1, i);
  }
}
function vp(t, e, n) {
  if (sh(e)) {
    let r = q(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      q(r);
    }
  }
}
function Dp(t, e, n) {
  mh() && (qw(t, e, n, ke(n, e)), (n.flags & 64) === 64 && Tp(t, e, n));
}
function wp(t, e, n = ke) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function Ep(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = ol(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function ol(t, e, n, r, i, o, s, a, c, l, u) {
  let d = Fe + r,
    f = d + i,
    h = Pw(d, f),
    p = typeof l == "function" ? l() : l;
  return (h[k] = {
    type: t,
    blueprint: h,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Pw(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : qt);
  return n;
}
function Fw(t, e, n, r) {
  let o = r.get(ep, Jh) || n === dt.ShadowDom,
    s = t.selectRootElement(e, o);
  return kw(s), s;
}
function kw(t) {
  bp(t);
}
var bp = () => null;
function Lw(t) {
  Bh(t) ? up(t) : tw(t);
}
function jw() {
  bp = Lw;
}
function Vw(t, e, n, r, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    $r() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function hf(t, e, n, r, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    r ??= {};
    let a,
      c = Tt.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let l = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      l = i[o];
    }
    t === 0 ? pf(r, n, l, a, c) : pf(r, n, l, a);
  }
  return r;
}
function pf(t, e, n, r, i) {
  let o;
  t.hasOwnProperty(n) ? (o = t[n]).push(e, r) : (o = t[n] = [e, r]),
    i !== void 0 && o.push(i);
}
function $w(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = o[u],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (c = hf(0, d.inputs, u, c, h)), (l = hf(1, d.outputs, u, l, p));
    let y = c !== null && s !== null && !Ac(e) ? nE(c, u, s) : null;
    a.push(y);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function Bw(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function Cp(t, e, n, r, i, o, s, a) {
  let c = ke(e, n),
    l = e.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (sl(t, n, u, r, i), jr(e) && Uw(n, e.index))
    : e.type & 3
    ? ((r = Bw(r)),
      (i = s != null ? s(i, e.value || "", r) : i),
      o.setProperty(c, r, i))
    : e.type & 12;
}
function Uw(t, e) {
  let n = zt(e, t);
  n[x] & 16 || (n[x] |= 64);
}
function Ip(t, e, n, r) {
  if (mh()) {
    let i = r === null ? null : { "": -1 },
      o = Ww(t, n),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Sp(t, e, n, s, i, a),
      i && Qw(n, r, i);
  }
  n.mergedAttrs = _c(n.mergedAttrs, n.attrs);
}
function Sp(t, e, n, r, i, o) {
  for (let l = 0; l < r.length; l++) SD(Nh(n, e), t, r[l].type);
  Yw(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = mp(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = _c(n.mergedAttrs, u.hostAttrs)),
      Zw(t, n, e, c, u),
      Kw(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  $w(t, n, o);
}
function Hw(t, e, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    zw(s) != a && s.push(a), s.push(n, r, o);
  }
}
function zw(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function qw(t, e, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd;
  jr(n) && Xw(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Nh(n, e),
    ln(r, e);
  let s = n.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = Nr(e, t, a, n);
    if ((ln(l, e), s !== null && tE(e, a - i, l, c, n, s), Vr(c))) {
      let u = zt(n.index, e);
      u[Mt] = Nr(e, t, a, n);
    }
  }
}
function Tp(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = hD();
  try {
    cn(o);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      Qa(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Gw(c, l);
    }
  } finally {
    cn(-1), Qa(s);
  }
}
function Gw(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Ww(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      if (Ev(e, s.selectors, !1))
        if ((r || (r = []), Vr(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s);
            let c = a.length;
            ic(t, e, c);
          } else r.unshift(s), ic(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
    }
  return r === null ? null : [r, i];
}
function ic(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function Qw(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = n[e[i + 1]];
      if (o == null) throw new m(-301, !1);
      r.push(e[i], o);
    }
  }
}
function Kw(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    Vr(e) && (n[""] = t);
  }
}
function Yw(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function Zw(t, e, n, r, i) {
  t.data[r] = i;
  let o = i.factory || (i.factory = qn(i.type, !0)),
    s = new xr(o, Vr(i), X);
  (t.blueprint[r] = s), (n[r] = s), Hw(t, e, r, mp(t, n, i.hostVars, qt), i);
}
function Xw(t, e, n) {
  let r = ke(e, t),
    i = Ep(n),
    o = t[nt].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Zo(
    t,
    Ko(t, i, null, s, r, e, null, o.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function Jw(t, e, n, r, i, o) {
  let s = ke(t, e);
  eE(e[Z], s, o, t.value, n, r, i);
}
function eE(t, e, n, r, i, o, s) {
  if (o == null) t.removeAttribute(e, i, n);
  else {
    let a = s == null ? Fo(o) : s(o, r || "", i);
    t.setAttribute(e, i, a, n);
  }
}
function tE(t, e, n, r, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++],
        d = s[a++];
      gp(r, n, c, l, u, d);
    }
}
function nE(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      r === null && (r = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          r.push(o, s[a + 1], s[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function Mp(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function _p(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = q(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Dh(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      q(r);
    }
  }
}
function Zo(t, e) {
  return t[Tr] ? (t[nf][et] = e) : (t[Tr] = e), (t[nf] = e), e;
}
function oc(t, e, n) {
  Dh(0);
  let r = q(null);
  try {
    e(t, n);
  } finally {
    q(r);
  }
}
function rE(t) {
  return t[Sr] || (t[Sr] = []);
}
function iE(t) {
  return t.cleanup || (t.cleanup = []);
}
function Ap(t, e) {
  let n = t[Gn],
    r = n ? n.get(ft, null) : null;
  r && r.handleError(e);
}
function sl(t, e, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      c = n[o++],
      l = e[s],
      u = t.data[s];
    gp(u, l, r, a, c, i);
  }
}
function oE(t, e, n) {
  let r = fh(e, t);
  hw(t[Z], r, n);
}
function sE(t, e) {
  let n = zt(e, t),
    r = n[k];
  aE(r, n);
  let i = n[Pe];
  i !== null && n[tt] === null && (n[tt] = Kc(i, n[Gn])), al(r, n, n[Mt]);
}
function aE(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function al(t, e, n) {
  Lc(e);
  try {
    let r = t.viewQuery;
    r !== null && oc(1, r, n);
    let i = t.template;
    i !== null && yp(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[Wn]?.finishViewCreation(t),
      t.staticContentQueries && _p(t, e),
      t.staticViewQueries && oc(2, t.viewQuery, n);
    let o = t.components;
    o !== null && cE(e, o);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[x] &= -5), jc();
  }
}
function cE(t, e) {
  for (let n = 0; n < e.length; n++) sE(t, e[n]);
}
function lE(t, e, n, r) {
  let i = q(null);
  try {
    let o = e.tView,
      a = t[x] & 4096 ? 4096 : 16,
      c = Ko(
        t,
        o,
        n,
        a,
        null,
        e,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      l = t[e.index];
    c[Vo] = l;
    let u = t[Wn];
    return u !== null && (c[Wn] = u.createEmbeddedView(o)), al(o, c, n), c;
  } finally {
    q(i);
  }
}
function gf(t, e) {
  return !e || e.firstChild === null || Do(t);
}
function uE(t, e, n, r = !0) {
  let i = e[k];
  if ((yw(i, e, t, n), r)) {
    let s = rc(n, t),
      a = e[Z],
      c = tl(a, t[_t]);
    c !== null && gw(i, t[it], a, e, c, s);
  }
  let o = e[tt];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Co(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let o = e[n.index];
    o !== null && r.push(rt(o)), pt(o) && dE(o, r);
    let s = n.type;
    if (s & 8) Co(t, e, n.child, r);
    else if (s & 32) {
      let a = Xc(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = lp(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Ar(e[Ge]);
        Co(c[k], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function dE(t, e) {
  for (let n = Oe; n < t.length; n++) {
    let r = t[n],
      i = r[k].firstChild;
    i !== null && Co(r[k], r, i, e);
  }
  t[_t] !== t[Pe] && e.push(t[_t]);
}
var xp = [];
function fE(t) {
  return t[an] ?? hE(t);
}
function hE(t) {
  let e = xp.pop() ?? Object.create(gE);
  return (e.lView = t), e;
}
function pE(t) {
  t.lView[an] !== t && ((t.lView = null), xp.push(t));
}
var gE = se(v({}, hd), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      _r(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[an] = this;
    },
  }),
  Np = 100;
function Rp(t, e = !0, n = 0) {
  let r = t[nt],
    i = r.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    mE(t, n);
  } catch (s) {
    throw (e && Ap(t, s), s);
  } finally {
    o || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function mE(t, e) {
  sc(t, e);
  let n = 0;
  for (; Fc(t); ) {
    if (n === Np) throw new m(103, !1);
    n++, sc(t, 1);
  }
}
function yE(t, e, n, r) {
  let i = e[x];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[nt].inlineEffectRunner?.flush(), Lc(e);
  let s = null,
    a = null;
  !o && vE(t) && ((a = fE(e)), (s = pd(a)));
  try {
    ph(e), lD(t.bindingStartIndex), n !== null && yp(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && oo(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && so(e, d, 0, null), Ma(e, 0);
      }
    if ((DE(e), Op(e, 0), t.contentQueries !== null && _p(t, e), !o))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && oo(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && so(e, d, 1), Ma(e, 1);
      }
    Rw(t, e);
    let l = t.components;
    l !== null && Fp(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && oc(2, u, r), !o))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && oo(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && so(e, d, 2), Ma(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Ta])) {
      for (let d of e[Ta]) d();
      e[Ta] = null;
    }
    o || (e[x] &= -73);
  } catch (c) {
    throw (_r(e), c);
  } finally {
    a !== null && (gd(a, s), pE(a)), jc();
  }
}
function vE(t) {
  return t.type !== 2;
}
function Op(t, e) {
  for (let n = Hh(t); n !== null; n = zh(n))
    for (let r = Oe; r < n.length; r++) {
      let i = n[r];
      Pp(i, e);
    }
}
function DE(t) {
  for (let e = Hh(t); e !== null; e = zh(e)) {
    if (!(e[x] & Rc.HasTransplantedViews)) continue;
    let n = e[go];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[ye];
      Xv(i);
    }
  }
}
function wE(t, e, n) {
  let r = zt(e, t);
  Pp(r, n);
}
function Pp(t, e) {
  Pc(t) && sc(t, e);
}
function sc(t, e) {
  let r = t[k],
    i = t[x],
    o = t[an],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && sa(o))),
    o && (o.dirty = !1),
    (t[x] &= -9217),
    s)
  )
    yE(r, t, r.template, t[Mt]);
  else if (i & 8192) {
    Op(t, 1);
    let a = r.components;
    a !== null && Fp(t, a, 1);
  }
}
function Fp(t, e, n) {
  for (let r = 0; r < e.length; r++) wE(t, e[r], n);
}
function cl(t) {
  for (t[nt].changeDetectionScheduler?.notify(); t; ) {
    t[x] |= 64;
    let e = Ar(t);
    if (ah(t) && !e) return t;
    t = e;
  }
  return null;
}
var un = class {
    get rootNodes() {
      let e = this._lView,
        n = e[k];
      return Co(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Mt];
    }
    set context(e) {
      this._lView[Mt] = e;
    }
    get destroyed() {
      return (this._lView[x] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ye];
        if (pt(e)) {
          let n = e[po],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (nc(e, r), fo(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      ap(this._lView[k], this._lView);
    }
    onDestroy(e) {
      gh(this._lView, e);
    }
    markForCheck() {
      cl(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[x] &= -129;
    }
    reattach() {
      Wa(this._lView), (this._lView[x] |= 128);
    }
    detectChanges() {
      (this._lView[x] |= 1024), Rp(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new m(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), op(this._lView[k], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new m(902, !1);
      (this._appRef = e), Wa(this._lView);
    }
  },
  ll = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = CE;
    let t = e;
    return t;
  })(),
  EE = ll,
  bE = class extends EE {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n);
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = lE(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new un(i);
    }
  };
function CE() {
  return IE(ot(), ee());
}
function IE(t, e) {
  return t.type & 4 ? new bE(e, t, Uo(t, e)) : null;
}
function kp(t) {
  let e = t[Mr] ?? [],
    r = t[ye][Z];
  for (let i of e) SE(i, r);
  t[Mr] = qe;
}
function SE(t, e) {
  let n = 0,
    r = t.firstChild;
  if (r) {
    let i = t.data[wo];
    for (; n < i; ) {
      let o = r.nextSibling;
      rl(e, r, !1), (r = o), n++;
    }
  }
}
function Lp(t) {
  kp(t);
  for (let e = Oe; e < t.length; e++) Io(t[e]);
}
function TE(t) {
  let e = t[tt]?.i18nNodes;
  if (e) {
    let n = t[Z];
    for (let r of e.values()) rl(n, r, !1);
    t[tt].i18nNodes = void 0;
  }
}
function Io(t) {
  TE(t);
  let e = t[k];
  for (let n = Fe; n < e.bindingStartIndex; n++)
    if (pt(t[n])) {
      let r = t[n];
      Lp(r);
    } else St(t[n]) && Io(t[n]);
}
function ME(t) {
  let e = t._views;
  for (let n of e) {
    let r = JD(n);
    if (r !== null && r[Pe] !== null)
      if (St(r)) Io(r);
      else {
        let i = r[Pe];
        Io(i), Lp(r);
      }
  }
}
var _E = new RegExp(`^(\\d+)*(${Qh}|${Wh})*(.*)`);
function AE(t) {
  let e = t.match(_E),
    [n, r, i, o] = e,
    s = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of o.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [s, ...a];
}
function xE(t) {
  return !t.prev && t.parent?.type === 8;
}
function Oa(t) {
  return t.index - Fe;
}
function NE(t, e) {
  let n = t.i18nNodes;
  if (n) {
    let r = n.get(e);
    return r && n.delete(e), r;
  }
  return null;
}
function Xo(t, e, n, r) {
  let i = Oa(r),
    o = NE(t, i);
  if (!o) {
    let s = t.data[WD];
    if (s?.[i]) o = OE(s[i], n);
    else if (e.firstChild === r) o = t.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (xE(r)) {
        let l = Oa(r.parent);
        o = tc(t, l);
      } else {
        let l = ke(c, n);
        if (a) o = l.firstChild;
        else {
          let u = Oa(c),
            d = tc(t, u);
          if (c.type === 2 && d) {
            let h = Yc(t, u) + 1;
            o = Jo(h, d);
          } else o = l.nextSibling;
        }
      }
    }
  }
  return o;
}
function Jo(t, e) {
  let n = e;
  for (let r = 0; r < t; r++) n = n.nextSibling;
  return n;
}
function RE(t, e) {
  let n = t;
  for (let r = 0; r < e.length; r += 2) {
    let i = e[r],
      o = e[r + 1];
    for (let s = 0; s < o; s++)
      switch (i) {
        case ec.FirstChild:
          n = n.firstChild;
          break;
        case ec.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function OE(t, e) {
  let [n, ...r] = AE(t),
    i;
  if (n === Wh) i = e[Ge][Pe];
  else if (n === Qh) i = dw(e[Ge][Pe]);
  else {
    let o = Number(n);
    i = rt(e[o + Fe]);
  }
  return RE(i, r);
}
function PE(t, e) {
  let n = [];
  for (let r of e)
    for (let i = 0; i < (r[Kh] ?? 1); i++) {
      let o = { data: r, firstChild: null };
      r[wo] > 0 && ((o.firstChild = t), (t = Jo(r[wo], t))), n.push(o);
    }
  return [t, n];
}
var jp = () => null;
function FE(t, e) {
  let n = t[Mr];
  return !e || n === null || n.length === 0
    ? null
    : n[0].data[GD] === e
    ? n.shift()
    : (kp(t), null);
}
function kE() {
  jp = FE;
}
function mf(t, e) {
  return jp(t, e);
}
var Qn = class {},
  ac = class {},
  So = class {};
function LE(t) {
  let e = Error(`No component factory found for ${be(t)}.`);
  return (e[jE] = t), e;
}
var jE = "ngComponent";
var cc = class {
    resolveComponentFactory(e) {
      throw LE(e);
    }
  },
  es = (() => {
    let e = class e {};
    e.NULL = new cc();
    let t = e;
    return t;
  })(),
  dn = class {},
  ts = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => VE();
    let t = e;
    return t;
  })();
function VE() {
  let t = ee(),
    e = ot(),
    n = zt(e.index, t);
  return (St(n) ? n : t)[Z];
}
var $E = (() => {
    let e = class e {};
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Pa = {};
var yf = new Set();
function Gt(t) {
  yf.has(t) ||
    (yf.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function vf(...t) {}
function BE() {
  let t = typeof Re.requestAnimationFrame == "function",
    e = Re[t ? "requestAnimationFrame" : "setTimeout"],
    n = Re[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var G = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new me(!1)),
        (this.onMicrotaskEmpty = new me(!1)),
        (this.onStable = new me(!1)),
        (this.onError = new me(!1)),
        typeof Zone > "u")
      )
        throw new m(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = BE().nativeRequestAnimationFrame),
        zE(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new m(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new m(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, UE, vf, vf);
      try {
        return o.runTask(s, n, r);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  UE = {};
function ul(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function HE(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Re,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                lc(t),
                (t.isCheckStableRunning = !0),
                ul(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    lc(t));
}
function zE(t) {
  let e = () => {
    HE(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (qE(a)) return n.invokeTask(i, o, s, a);
      try {
        return Df(t), n.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          wf(t);
      }
    },
    onInvoke: (n, r, i, o, s, a, c) => {
      try {
        return Df(t), n.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), wf(t);
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), lc(t), ul(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function lc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Df(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function wf(t) {
  t._nesting--, ul(t);
}
var uc = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new me()),
      (this.onMicrotaskEmpty = new me()),
      (this.onStable = new me()),
      (this.onError = new me());
  }
  run(e, n, r) {
    return e.apply(n, r);
  }
  runGuarded(e, n, r) {
    return e.apply(n, r);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, n, r, i) {
    return e.apply(n, r);
  }
};
function qE(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function GE(t = "zone.js", e) {
  return t === "noop" ? new uc() : t === "zone.js" ? new G(e) : t;
}
var Un = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Un || {}),
  WE = { destroy() {} };
function ns(t, e) {
  !e && Bv(ns);
  let n = e?.injector ?? g(st);
  if (!Dr(n)) return WE;
  Gt("NgAfterNextRender");
  let r = n.get(dl),
    i = (r.handler ??= new fc()),
    o = e?.phase ?? Un.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = n.get(zc).onDestroy(s),
    c = ht(
      n,
      () =>
        new dc(o, () => {
          s(), t();
        })
    );
  return i.register(c), { destroy: s };
}
var dc = class {
    constructor(e, n) {
      (this.phase = e),
        (this.callbackFn = n),
        (this.zone = g(G)),
        (this.errorHandler = g(ft, { optional: !0 })),
        g(Qn, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  fc = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Un.EarlyRead]: new Set(),
          [Un.Write]: new Set(),
          [Un.MixedReadWrite]: new Set(),
          [Un.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let n of e) n.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  dl = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let r = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of r) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function hc(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = Gd(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        r = Gd(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var To = class extends es {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = Ut(e);
    return new Kn(n, this.ngModule);
  }
};
function Ef(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function QE(t) {
  let e = t.toLowerCase();
  return e === "svg" ? Wv : e === "math" ? Qv : null;
}
var pc = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = ko(r);
      let i = this.injector.get(e, Pa, r);
      return i !== Pa || n === Pa ? i : this.parentInjector.get(e, n, r);
    }
  },
  Kn = class extends So {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = Ef(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return Ef(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = Sv(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      let o = q(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Ce ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new pc(e, s) : e,
          c = a.get(dn, null);
        if (c === null) throw new m(407, !1);
        let l = a.get($E, null),
          u = a.get(dl, null),
          d = a.get(Qn, null),
          f = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: d,
          },
          h = c.createRenderer(null, this.componentDef),
          p = this.componentDef.selectors[0][0] || "div",
          y = r
            ? Fw(h, r, this.componentDef.encapsulation, a)
            : Wo(h, p, QE(p)),
          A = 512;
        this.componentDef.signals
          ? (A |= 4096)
          : this.componentDef.onPush || (A |= 16);
        let M = null;
        y !== null && (M = Kc(y, a, !0));
        let H = ol(0, null, null, 1, 0, null, null, null, null, null, null),
          z = Ko(null, H, null, A, null, null, f, h, a, null, M);
        Lc(z);
        let Q, Te;
        try {
          let te = this.componentDef,
            ne,
            de = null;
          te.findHostDirectiveDefs
            ? ((ne = []),
              (de = new Map()),
              te.findHostDirectiveDefs(te, ne, de),
              ne.push(te))
            : (ne = [te]);
          let bt = KE(z, y),
            Pt = YE(bt, y, te, ne, z, f, h);
          (Te = hh(H, Fe)),
            y && JE(h, te, y, r),
            n !== void 0 && eb(Te, this.ngContentSelectors, n),
            (Q = XE(Pt, te, ne, de, z, [tb])),
            al(H, z, null);
        } finally {
          jc();
        }
        return new gc(this.componentType, Q, Uo(Te, z), z, Te);
      } finally {
        q(o);
      }
    }
  },
  gc = class extends ac {
    constructor(e, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new un(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let o = this._rootLView;
        sl(o[k], o, i, e, n), this.previousInputValues.set(e, n);
        let s = zt(this._tNode.index, o);
        cl(s);
      }
    }
    get injector() {
      return new on(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function KE(t, e) {
  let n = t[k],
    r = Fe;
  return (t[r] = e), Yo(n, r, 2, "#host", null);
}
function YE(t, e, n, r, i, o, s) {
  let a = i[k];
  ZE(r, t, e, s);
  let c = null;
  e !== null && (c = Kc(e, i[Gn]));
  let l = o.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Ko(i, Ep(n), null, u, i[t.index], t, o, l, null, null, c);
  return (
    a.firstCreatePass && ic(a, t, r.length - 1), Zo(i, d), (i[t.index] = d)
  );
}
function ZE(t, e, n, r) {
  for (let i of t) e.mergedAttrs = _c(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (hc(e, e.mergedAttrs, !0), n !== null && fp(r, n, e));
}
function XE(t, e, n, r, i, o) {
  let s = ot(),
    a = i[k],
    c = ke(s, i);
  Sp(a, i, s, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = s.directiveStart + u,
      f = Nr(i, a, d, s);
    ln(f, i);
  }
  Tp(a, i, s), c && ln(c, i);
  let l = Nr(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Mt] = i[Mt] = l), o !== null)) for (let u of o) u(l, e);
  return vp(a, s, i), l;
}
function JE(t, e, n, r) {
  if (r) Ba(t, n, ["ng-version", "17.3.11"]);
  else {
    let { attrs: i, classes: o } = Tv(e.selectors[0]);
    i && Ba(t, n, i), o && o.length > 0 && dp(t, n, o.join(" "));
  }
}
function eb(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = n[i];
    r.push(o != null ? Array.from(o) : null);
  }
}
function tb() {
  let t = ot();
  Bc(ee()[k], t);
}
var Hr = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = nb;
  let t = e;
  return t;
})();
function nb() {
  let t = ot();
  return ib(t, ee());
}
var rb = Hr,
  Vp = class extends rb {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Uo(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new on(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Uc(this._hostTNode, this._hostLView);
      if (_h(e)) {
        let n = vo(e, this._hostLView),
          r = yo(e),
          i = n[k].data[r + 8];
        return new on(i, n);
      } else return new on(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = bf(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - Oe;
    }
    createEmbeddedView(e, n, r) {
      let i, o;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector));
      let s = mf(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, o, s);
      return this.insertImpl(a, i, gf(this._hostTNode, s)), a;
    }
    createComponent(e, n, r, i, o) {
      let s = e && !Hv(e),
        a;
      if (s) a = n;
      else {
        let p = n || {};
        (a = p.index),
          (r = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let c = s ? e : new Kn(Ut(e)),
        l = r || this.parentInjector;
      if (!o && c.ngModule == null) {
        let y = (s ? l : this.parentInjector).get(Ce, null);
        y && (o = y);
      }
      let u = Ut(c.componentType ?? {}),
        d = mf(this._lContainer, u?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(l, i, f, o);
      return this.insertImpl(h.hostView, a, gf(this._hostTNode, d)), h;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (Zv(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ye],
            l = new Vp(c, c[it], c[ye]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return uE(s, i, o, r), e.attachToViewContainerRef(), Hf(Fa(s), o, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = bf(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = nc(this._lContainer, n);
      r && (fo(Fa(this._lContainer), n), ap(r[k], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = nc(this._lContainer, n);
      return r && fo(Fa(this._lContainer), n) != null ? new un(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function bf(t) {
  return t[po];
}
function Fa(t) {
  return t[po] || (t[po] = []);
}
function ib(t, e) {
  let n,
    r = e[t.index];
  return (
    pt(r) ? (n = r) : ((n = Mp(r, e, null, t)), (e[t.index] = n), Zo(e, n)),
    $p(n, e, t, r),
    new Vp(n, t, e)
  );
}
function ob(t, e) {
  let n = t[Z],
    r = n.createComment(""),
    i = ke(e, t),
    o = tl(n, i);
  return bo(n, o, r, Iw(n, i), !1), r;
}
var $p = Bp,
  fl = () => !1;
function sb(t, e, n) {
  return fl(t, e, n);
}
function Bp(t, e, n, r) {
  if (t[_t]) return;
  let i;
  n.type & 8 ? (i = rt(r)) : (i = ob(e, n)), (t[_t] = i);
}
function ab(t, e, n) {
  if (t[_t] && t[Mr]) return !0;
  let r = n[tt],
    i = e.index - Fe;
  if (!r || kD(e) || qo(r, i)) return !1;
  let s = tc(r, i),
    a = r.data[Qc]?.[i],
    [c, l] = PE(s, a);
  return (t[_t] = c), (t[Mr] = l), !0;
}
function cb(t, e, n, r) {
  fl(t, n, e) || Bp(t, e, n, r);
}
function lb() {
  ($p = cb), (fl = ab);
}
function ub(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let o = n.get(i);
    if (!o) {
      let s = t(i);
      n.set(i, (o = s.then(pb)));
    }
    return o;
  }
  return (
    Mo.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          r(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              r(d).then((h) => {
                (a[l + f] = h),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => gb(o));
      e.push(c);
    }),
    fb(),
    Promise.all(e).then(() => {})
  );
}
var Mo = new Map(),
  db = new Set();
function fb() {
  let t = Mo;
  return (Mo = new Map()), t;
}
function hb() {
  return Mo.size === 0;
}
function pb(t) {
  return typeof t == "string" ? t : t.text();
}
function gb(t) {
  db.delete(t);
}
var Ht = class {},
  Rr = class {};
var _o = class extends Ht {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new To(this));
      let i = Zf(e);
      (this._bootstrapComponents = ip(i.bootstrap)),
        (this._r3Injector = jh(
          e,
          n,
          [
            { provide: Ht, useValue: this },
            { provide: es, useValue: this.componentFactoryResolver },
            ...r,
          ],
          be(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Ao = class extends Rr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new _o(this.moduleType, e, []);
    }
  };
function mb(t, e, n) {
  return new _o(t, e, n);
}
var mc = class extends Ht {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new To(this)),
      (this.instance = null);
    let n = new Ir(
      [
        ...e.providers,
        { provide: Ht, useValue: this },
        { provide: es, useValue: this.componentFactoryResolver },
      ],
      e.parent || Nc(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function rs(t, e, n = null) {
  return new mc({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var zr = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ge(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Up(t) {
  return vb(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function yb(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function vb(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function Db(t, e, n) {
  return (t[e] = n);
}
function qr(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function Gr(t) {
  return (t.flags & 32) === 32;
}
function wb(t, e, n, r, i, o, s, a, c) {
  let l = e.consts,
    u = Yo(e, t, 4, s || null, mo(l, a));
  Ip(e, n, u, mo(l, c)), Bc(e, u);
  let d = (u.tView = ol(
    2,
    u,
    r,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    l,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))),
    u
  );
}
function Wr(t, e, n, r, i, o, s, a) {
  let c = ee(),
    l = gt(),
    u = t + Fe,
    d = l.firstCreatePass ? wb(u, l, c, e, n, r, i, o, s) : l.data[u];
  Br(d, !1);
  let f = Hp(l, c, d, t);
  $c() && nl(l, c, f, d), ln(f, c);
  let h = Mp(f, c, f, d);
  return (
    (c[u] = h),
    Zo(c, h),
    sb(h, d, c),
    Oc(d) && Dp(l, c, d),
    s != null && wp(c, d, a),
    Wr
  );
}
var Hp = zp;
function zp(t, e, n, r) {
  return mt(!0), e[Z].createComment("");
}
function Eb(t, e, n, r) {
  let i = e[tt],
    o = !i || $r() || Gr(n) || qo(i, r);
  if ((mt(o), o)) return zp(t, e, n, r);
  let s = i.data[qD]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let a = Xo(i, t, e, n);
  zo(i, r, a);
  let c = Yc(i, r);
  return Jo(c, a);
}
function bb() {
  Hp = Eb;
}
function is(t, e, n, r) {
  let i = ee(),
    o = kc();
  if (qr(i, o, e)) {
    let s = gt(),
      a = Vc();
    Jw(a, i, t, e, n, r);
  }
  return is;
}
function qp(t, e, n, r) {
  return qr(t, kc(), n) ? e + Fo(n) + r : qt;
}
function to(t, e) {
  return (t << 17) | (e << 2);
}
function fn(t) {
  return (t >> 17) & 32767;
}
function Cb(t) {
  return (t & 2) == 2;
}
function Ib(t, e) {
  return (t & 131071) | (e << 17);
}
function yc(t) {
  return t | 2;
}
function Yn(t) {
  return (t & 131068) >> 2;
}
function ka(t, e) {
  return (t & -131069) | (e << 2);
}
function Sb(t) {
  return (t & 1) === 1;
}
function vc(t) {
  return t | 1;
}
function Tb(t, e, n, r, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = fn(s),
    c = Yn(s);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Fr(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let f = fn(t[a + 1]);
      (t[r + 1] = to(f, a)),
        f !== 0 && (t[f + 1] = ka(t[f + 1], r)),
        (t[a + 1] = Ib(t[a + 1], r));
    } else
      (t[r + 1] = to(a, 0)), a !== 0 && (t[a + 1] = ka(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = to(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = ka(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = yc(t[r + 1])),
    Cf(t, u, r, !0),
    Cf(t, u, r, !1),
    Mb(e, u, t, r, o),
    (s = to(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function Mb(t, e, n, r, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Fr(o, e) >= 0 &&
    (n[r + 1] = vc(n[r + 1]));
}
function Cf(t, e, n, r) {
  let i = t[n + 1],
    o = e === null,
    s = r ? fn(i) : Yn(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      l = t[s + 1];
    _b(c, e) && ((a = !0), (t[s + 1] = r ? vc(l) : yc(l))),
      (s = r ? fn(l) : Yn(l));
  }
  a && (t[n + 1] = r ? yc(i) : vc(i));
}
function _b(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Fr(t, e) >= 0
    : !1;
}
function Ie(t, e, n) {
  let r = ee(),
    i = kc();
  if (qr(r, i, e)) {
    let o = gt(),
      s = Vc();
    Cp(o, s, r, t, e, r[Z], n, !1);
  }
  return Ie;
}
function If(t, e, n, r, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  sl(t, n, o[s], s, r);
}
function os(t, e, n) {
  return Ab(t, e, n, !1), os;
}
function Ab(t, e, n, r) {
  let i = ee(),
    o = gt(),
    s = uD(2);
  if ((o.firstUpdatePass && Nb(o, t, s, r), e !== qt && qr(i, s, e))) {
    let a = o.data[Zn()];
    kb(o, a, i, i[Z], t, (i[s + 1] = Lb(e, n)), r, s);
  }
}
function xb(t, e) {
  return e >= t.expandoStartIndex;
}
function Nb(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let o = i[Zn()],
      s = xb(t, n);
    jb(o, r) && e === null && !s && (e = !1),
      (e = Rb(i, o, e, r)),
      Tb(i, o, e, n, s, r);
  }
}
function Rb(t, e, n, r) {
  let i = pD(t),
    o = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = La(null, t, e, n, r)), (n = Or(n, e.attrs, r)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((n = La(i, t, e, n, r)), o === null)) {
        let c = Ob(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = La(null, t, e, c[1], r)),
          (c = Or(c, e.attrs, r)),
          Pb(t, e, r, c));
      } else o = Fb(t, e, r);
  }
  return (
    o !== void 0 && (r ? (e.residualClasses = o) : (e.residualStyles = o)), n
  );
}
function Ob(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (Yn(r) !== 0) return t[fn(r)];
}
function Pb(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[fn(i)] = r;
}
function Fb(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    r = Or(r, s, n);
  }
  return Or(r, e.attrs, n);
}
function La(t, e, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = e[a]), (r = Or(r, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function Or(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          fv(t, s, n ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function kb(t, e, n, r, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = Sb(l) ? Sf(c, e, n, i, Yn(l), s) : void 0;
  if (!xo(u)) {
    xo(o) || (Cb(l) && (o = Sf(c, null, n, i, a, s)));
    let d = fh(Zn(), n);
    xw(r, s, d, i, o);
  }
}
function Sf(t, e, n, r, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      f = n[i + 1];
    f === qt && (f = d ? qe : void 0);
    let h = d ? Ia(f, r) : u === r ? f : void 0;
    if ((l && !xo(h) && (h = Ia(c, r)), xo(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? fn(p) : Yn(p);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = Ia(c, r));
  }
  return a;
}
function xo(t) {
  return t !== void 0;
}
function Lb(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = be(Go(t)))),
    t
  );
}
function jb(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function Vb(t, e, n, r, i, o) {
  let s = e.consts,
    a = mo(s, i),
    c = Yo(e, t, 2, r, a);
  return (
    Ip(e, n, c, mo(s, o)),
    c.attrs !== null && hc(c, c.attrs, !1),
    c.mergedAttrs !== null && hc(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function C(t, e, n, r) {
  let i = ee(),
    o = gt(),
    s = Fe + t,
    a = i[Z],
    c = o.firstCreatePass ? Vb(s, o, i, e, n, r) : o.data[s],
    l = Gp(o, i, c, a, e, t);
  i[s] = l;
  let u = Oc(c);
  return (
    Br(c, !0),
    fp(a, l, c),
    !Gr(c) && $c() && nl(o, i, l, c),
    eD() === 0 && ln(l, i),
    tD(),
    u && (Dp(o, i, c), vp(o, c, i)),
    r !== null && wp(i, c),
    C
  );
}
function T() {
  let t = ot();
  vh() ? aD() : ((t = t.parent), Br(t, !1));
  let e = t;
  rD(e) && oD(), nD();
  let n = gt();
  return (
    n.firstCreatePass && (Bc(n, t), sh(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      DD(e) &&
      If(n, e, ee(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      wD(e) &&
      If(n, e, ee(), e.stylesWithoutHost, !1),
    T
  );
}
function Y(t, e, n, r) {
  return C(t, e, n, r), T(), Y;
}
var Gp = (t, e, n, r, i, o) => (mt(!0), Wo(r, i, Sh()));
function $b(t, e, n, r, i, o) {
  let s = e[tt],
    a = !s || $r() || Gr(n) || qo(s, o);
  if ((mt(a), a)) return Wo(r, i, Sh());
  let c = Xo(s, t, e, n);
  return (
    Xh(s, o) && zo(s, o, c.nextSibling),
    s && ($h(n) || Bh(c)) && jr(n) && (iD(n), up(c)),
    c
  );
}
function Bb() {
  Gp = $b;
}
var Ub = (t, e, n, r) => (mt(!0), el(e[Z], ""));
function Hb(t, e, n, r) {
  let i,
    o = e[tt],
    s = !o || $r() || Gr(n);
  if ((mt(s), s)) return el(e[Z], "");
  let a = Xo(o, t, e, n),
    c = nw(o, r);
  return zo(o, r, a), (i = Jo(c, a)), i;
}
function zb() {
  Ub = Hb;
}
var No = "en-US";
var qb = No;
function Gb(t) {
  typeof t == "string" && (qb = t.toLowerCase().replace(/_/g, "-"));
}
function Wp(t, e, n) {
  let r = t[Z];
  switch (n) {
    case Node.COMMENT_NODE:
      return el(r, e);
    case Node.TEXT_NODE:
      return Jc(r, e);
    case Node.ELEMENT_NODE:
      return Wo(r, e, null);
  }
}
var Wb = (t, e, n, r) => (mt(!0), Wp(t, n, r));
function Qb(t, e, n, r) {
  return mt(!0), Wp(t, n, r);
}
function Kb() {
  Wb = Qb;
}
function Xn(t, e, n, r) {
  let i = ee(),
    o = gt(),
    s = ot();
  return Zb(o, i, i[Z], s, t, e, r), Xn;
}
function Yb(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = e[Sr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Zb(t, e, n, r, i, o, s) {
  let a = Oc(r),
    l = t.firstCreatePass && iE(t),
    u = e[Mt],
    d = rE(e),
    f = !0;
  if (r.type & 3 || s) {
    let y = ke(r, e),
      A = s ? s(y) : y,
      M = d.length,
      H = s ? (Q) => s(rt(Q[r.index])) : r.index,
      z = null;
    if ((!s && a && (z = Yb(t, e, i, r.index)), z !== null)) {
      let Q = z.__ngLastListenerFn__ || z;
      (Q.__ngNextListenerFn__ = o), (z.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Mf(r, e, u, o, !1);
      let Q = n.listen(A, i, o);
      d.push(o, Q), l && l.push(i, H, M, M + 1);
    }
  } else o = Mf(r, e, u, o, !1);
  let h = r.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let y = p.length;
    if (y)
      for (let A = 0; A < y; A += 2) {
        let M = p[A],
          H = p[A + 1],
          Te = e[M][H].subscribe(o),
          te = d.length;
        d.push(o, Te), l && l.push(i, r.index, te, -(te + 1));
      }
  }
}
function Tf(t, e, n, r) {
  let i = q(null);
  try {
    return lt(6, e, n), n(r) !== !1;
  } catch (o) {
    return Ap(t, o), !1;
  } finally {
    lt(7, e, n), q(i);
  }
}
function Mf(t, e, n, r, i) {
  return function o(s) {
    if (s === Function) return r;
    let a = t.componentOffset > -1 ? zt(t.index, e) : e;
    cl(a);
    let c = Tf(e, n, r, s),
      l = o.__ngNextListenerFn__;
    for (; l; ) (c = Tf(e, n, l, s) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function hl(t, e, n) {
  return ss(t, "", e, "", n), hl;
}
function ss(t, e, n, r, i) {
  let o = ee(),
    s = qp(o, e, n, r);
  if (s !== qt) {
    let a = gt(),
      c = Vc();
    Cp(a, c, o, t, s, o[Z], i, !1);
  }
  return ss;
}
function P(t, e = "") {
  let n = ee(),
    r = gt(),
    i = t + Fe,
    o = r.firstCreatePass ? Yo(r, i, 1, e, null) : r.data[i],
    s = Qp(r, n, o, e, t);
  (n[i] = s), $c() && nl(r, n, s, o), Br(o, !1);
}
var Qp = (t, e, n, r, i) => (mt(!0), Jc(e[Z], r));
function Xb(t, e, n, r, i) {
  let o = e[tt],
    s = !o || $r() || Gr(n) || qo(o, i);
  return mt(s), s ? Jc(e[Z], r) : Xo(o, t, e, n);
}
function Jb() {
  Qp = Xb;
}
function pl(t) {
  return as("", t, ""), pl;
}
function as(t, e, n) {
  let r = ee(),
    i = qp(r, t, e, n);
  return i !== qt && oE(r, Zn(), i), as;
}
var eC = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = eh(!1, r.type),
          o =
            i.length > 0
              ? rs([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, o);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = w({
    token: e,
    providedIn: "environment",
    factory: () => new e(E(Ce)),
  });
  let t = e;
  return t;
})();
function Kp(t) {
  Gt("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(eC).getOrCreateStandaloneInjector(t));
}
function Jn(t, e, n, r) {
  return nC(ee(), cD(), t, e, n, r);
}
function tC(t, e) {
  let n = t[e];
  return n === qt ? void 0 : n;
}
function nC(t, e, n, r, i, o) {
  let s = e + n;
  return qr(t, s, i) ? Db(t, s + 1, o ? r.call(o, i) : r(i)) : tC(t, s + 1);
}
var no = null;
function rC(t) {
  (no !== null &&
    (t.defaultEncapsulation !== no.defaultEncapsulation ||
      t.preserveWhitespaces !== no.preserveWhitespaces)) ||
    (no = t);
}
var cs = (() => {
  let e = class e {
    log(r) {
      console.log(r);
    }
    warn(r) {
      console.warn(r);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var gl = new S(""),
  Qr = new S(""),
  ls = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          ml || (iC(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                G.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb();
            }
          });
        else {
          let r = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(r) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              r();
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: s, updateCb: o });
      }
      whenStable(r, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(r, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(G), E(us), E(Qr));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  us = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, i) {
        this._applications.set(r, i);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, i = !0) {
        return ml?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function iC(t) {
  ml = t;
}
var ml;
function Kr(t) {
  return !!t && typeof t.then == "function";
}
function Yp(t) {
  return !!t && typeof t.subscribe == "function";
}
var ds = new S(""),
  Zp = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = g(ds, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let o of this.appInits) {
          let s = o();
          if (Kr(s)) r.push(s);
          else if (Yp(s)) {
            let a = new Promise((c, l) => {
              s.subscribe({ complete: c, error: l });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  er = new S("");
function oC() {
  yd(() => {
    throw new m(600, !1);
  });
}
function sC(t) {
  return t.isBoundToModule;
}
function aC(t, e, n) {
  try {
    let r = n();
    return Kr(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function Xp(t, e) {
  return Array.isArray(e) ? e.reduce(Xp, t) : v(v({}, t), e);
}
var xt = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = g(Vh)),
        (this.afterRenderEffectManager = g(dl)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new we()),
        (this.afterTick = new we()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = g(zr).hasPendingTasks.pipe(L((r) => !r))),
        (this._injector = g(Ce));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let o = r instanceof So;
      if (!this._injector.get(Zp).done) {
        let h = !o && Yf(r),
          p = !1;
        throw new m(405, p);
      }
      let a;
      o ? (a = r) : (a = this._injector.get(es).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = sC(a) ? void 0 : this._injector.get(Ht),
        l = i || a.selector,
        u = a.create(st.NULL, [], l, c),
        d = u.location.nativeElement,
        f = u.injector.get(gl, null);
      return (
        f?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            co(this.components, u),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new m(101, !1);
      let i = q(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), q(i);
      }
    }
    detectChangesInAttachedViews(r) {
      let i = 0,
        o = this.afterRenderEffectManager;
      for (;;) {
        if (i === Np) throw new m(103, !1);
        if (r) {
          let s = i === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            cC(a, s, c);
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Dc(s)
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Dc(s)
            )))
        )
          break;
      }
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      co(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(er, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => co(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new m(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function co(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var ro;
function yl(t) {
  ro ??= new WeakMap();
  let e = ro.get(t);
  if (e) return e;
  let n = t.isStable
    .pipe(Xe((r) => r))
    .toPromise()
    .then(() => {});
  return ro.set(t, n), t.onDestroy(() => ro?.delete(t)), n;
}
function cC(t, e, n) {
  (!e && !Dc(t)) || lC(t, n, e);
}
function Dc(t) {
  return Fc(t);
}
function lC(t, e, n) {
  let r;
  n ? ((r = 0), (t[x] |= 1024)) : t[x] & 64 ? (r = 0) : (r = 1), Rp(t, e, r);
}
var wc = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  fs = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new Ao(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          o = Zf(r),
          s = ip(o.declarations).reduce((a, c) => {
            let l = Ut(c);
            return l && a.push(new Kn(l)), a;
          }, []);
        return new wc(i, s);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  uC = new S("");
function dC(t, e, n) {
  let r = new Ao(n);
  return Promise.resolve(r);
}
function _f(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var fC = (() => {
  let e = class e {
    constructor() {
      (this.zone = g(G)), (this.applicationRef = g(xt));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function hC(t) {
  return [
    { provide: G, useFactory: t },
    {
      provide: sn,
      multi: !0,
      useFactory: () => {
        let e = g(fC, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: sn,
      multi: !0,
      useFactory: () => {
        let e = g(mC);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Vh, useFactory: pC },
  ];
}
function pC() {
  let t = g(G),
    e = g(ft);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function gC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var mC = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new ce()),
        (this.initialized = !1),
        (this.zone = g(G)),
        (this.pendingTasks = g(zr));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              G.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            G.assertInAngularZone(), (r ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function yC() {
  return (typeof $localize < "u" && $localize.locale) || No;
}
var vl = new S("", {
  providedIn: "root",
  factory: () => g(vl, O.Optional | O.SkipSelf) || yC(),
});
var Jp = new S(""),
  eg = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let o = GE(
          i?.ngZone,
          gC({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = mb(
              r.moduleType,
              this.injector,
              hC(() => o)
            ),
            a = s.injector.get(ft, null);
          return (
            o.runOutsideAngular(() => {
              let c = o.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              s.onDestroy(() => {
                co(this._modules, s), c.unsubscribe();
              });
            }),
            aC(a, o, () => {
              let c = s.injector.get(Zp);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = s.injector.get(vl, No);
                  return Gb(l || No), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let o = Xp({}, i);
        return dC(this.injector, o, r).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(xt);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(i);
        else throw new m(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new m(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let r = this._injector.get(Jp, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(st));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Er = null,
  tg = new S("");
function vC(t) {
  if (Er && !Er.get(tg, !1)) throw new m(400, !1);
  oC(), (Er = t);
  let e = t.get(eg);
  return EC(t), e;
}
function Dl(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new S(r);
  return (o = []) => {
    let s = ng();
    if (!s || s.injector.get(tg, !1)) {
      let a = [...n, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : vC(DC(a, r));
    }
    return wC(i);
  };
}
function DC(t = [], e) {
  return st.create({
    name: e,
    providers: [
      { provide: jo, useValue: "platform" },
      { provide: Jp, useValue: new Set([() => (Er = null)]) },
      ...t,
    ],
  });
}
function wC(t) {
  let e = ng();
  if (!e) throw new m(401, !1);
  return e;
}
function ng() {
  return Er?.get(eg) ?? null;
}
function EC(t) {
  t.get(qc, null)?.forEach((n) => n());
}
var mn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = bC;
  let t = e;
  return t;
})();
function bC(t) {
  return CC(ot(), ee(), (t & 16) === 16);
}
function CC(t, e, n) {
  if (jr(t) && !n) {
    let r = zt(t.index, e);
    return new un(r, r);
  } else if (t.type & 47) {
    let r = e[Ge];
    return new un(r, e);
  }
  return null;
}
var Ec = class {
    constructor() {}
    supports(e) {
      return Up(e);
    }
    create(e) {
      return new bc(e);
    }
  },
  IC = (t, e) => e,
  bc = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || IC);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        o = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < Af(r, i, o)) ? n : r,
          a = Af(s, i, o),
          c = s.currentIndex;
        if (s === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let l = a - i,
            u = c - i;
          if (l != u) {
            for (let f = 0; f < l; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                p = h + f;
              u <= p && p < l && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = u - l;
          }
        }
        a !== c && e(s, a, c);
      }
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachMovedItem(e) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    forEachIdentityChange(e) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        e(n);
    }
    diff(e) {
      if ((e == null && (e = []), !Up(e))) throw new m(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, o, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, o, s, a)),
                Object.is(n.item, o) || this._addIdentityChange(n, o)),
            (n = n._next);
      } else
        (i = 0),
          yb(e, (a) => {
            (s = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, i)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(n), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, n, r, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Cc(n, r), o, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let n = e._next;
        this._addToRemovals(this._unlink(e)), (e = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, n, r),
        this._addToMoves(e, r),
        e
      );
    }
    _moveAfter(e, n, r) {
      return (
        this._unlink(e), this._insertAfter(e, n, r), this._addToMoves(e, r), e
      );
    }
    _addAfter(e, n, r) {
      return (
        this._insertAfter(e, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, n, r) {
      let i = n === null ? this._itHead : n._next;
      return (
        (e._next = i),
        (e._prev = n),
        i === null ? (this._itTail = e) : (i._prev = e),
        n === null ? (this._itHead = e) : (n._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Ro()),
        this._linkedRecords.put(e),
        (e.currentIndex = r),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let n = e._prev,
        r = e._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        e
      );
    }
    _addToMoves(e, n) {
      return (
        e.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Ro()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, n) {
      return (
        (e.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Cc = class {
    constructor(e, n) {
      (this.item = e),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Ic = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, e))
          return r;
      return null;
    }
    remove(e) {
      let n = e._prevDup,
        r = e._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  Ro = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new Ic()), this.map.set(n, r)), r.add(e);
    }
    get(e, n) {
      let r = e,
        i = this.map.get(r);
      return i ? i.get(e, n) : null;
    }
    remove(e) {
      let n = e.trackById;
      return this.map.get(n).remove(e) && this.map.delete(n), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Af(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
function xf() {
  return new wl([new Ec()]);
}
var wl = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let o = i.factories.slice();
        r = r.concat(o);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || xf()),
        deps: [[e, new Tc(), new Lo()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i != null) return i;
      throw new m(901, !1);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: xf });
  let t = e;
  return t;
})();
var rg = Dl(null, "core", []),
  ig = (() => {
    let e = class e {
      constructor(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(xt));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })();
var Nf = !1,
  SC = !1;
function TC() {
  Nf || ((Nf = !0), XD(), Bb(), Jb(), zb(), bb(), lb(), kE(), jw(), Kb());
}
function MC(t, e) {
  return yl(t);
}
function og() {
  return kr([
    {
      provide: eo,
      useFactory: () => {
        let t = !0;
        return (
          Dr() && (t = !!g(gn, { optional: !0 })?.get(Yh, null)),
          t && Gt("NgHydration"),
          t
        );
      },
    },
    {
      provide: sn,
      useValue: () => {
        (SC = !!g(rw, { optional: !0 })), Dr() && g(eo) && (_C(), TC());
      },
      multi: !0,
    },
    { provide: ep, useFactory: () => Dr() && g(eo) },
    {
      provide: er,
      useFactory: () => {
        if (Dr() && g(eo)) {
          let t = g(xt),
            e = g(st);
          return () => {
            MC(t, e).then(() => {
              ME(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function _C() {
  let t = Ho(),
    e;
  for (let n of t.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === YD) {
      e = n;
      break;
    }
  if (!e) throw new m(-507, !1);
}
function sg(t) {
  let e = Ut(t);
  if (!e) return null;
  let n = new Kn(e);
  return {
    get selector() {
      return n.selector;
    },
    get type() {
      return n.componentType;
    },
    get inputs() {
      return n.inputs;
    },
    get outputs() {
      return n.outputs;
    },
    get ngContentSelectors() {
      return n.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var fg = null;
function yn() {
  return fg;
}
function hg(t) {
  fg ??= t;
}
var hs = class {};
var ve = new S(""),
  Sl = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(RC), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  pg = new S(""),
  RC = (() => {
    let e = class e extends Sl {
      constructor() {
        super(),
          (this._doc = g(ve)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return yn().getBaseHref(this._doc);
      }
      onPopState(r) {
        let i = yn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", r, !1),
          () => i.removeEventListener("popstate", r)
        );
      }
      onHashChange(r) {
        let i = yn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", r, !1),
          () => i.removeEventListener("hashchange", r)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(r) {
        this._location.pathname = r;
      }
      pushState(r, i, o) {
        this._history.pushState(r, i, o);
      }
      replaceState(r, i, o) {
        this._history.replaceState(r, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(r = 0) {
        this._history.go(r);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function Tl(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function ag(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function Nt(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var vn = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(Ml), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  gg = new S(""),
  Ml = (() => {
    let e = class e extends vn {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            g(ve).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return Tl(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + Nt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && r ? `${i}${o}` : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Nt(s));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Nt(s));
        this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Sl), E(gg, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  mg = (() => {
    let e = class e extends vn {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(r = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(r) {
        let i = Tl(this._baseHref, r);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Nt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Nt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Sl), E(gg, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  tr = (() => {
    let e = class e {
      constructor(r) {
        (this._subject = new me()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = r);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = FC(ag(cg(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(r = !1) {
        return this.normalize(this._locationStrategy.path(r));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(r, i = "") {
        return this.path() == this.normalize(r + Nt(i));
      }
      normalize(r) {
        return e.stripTrailingSlash(PC(this._basePath, cg(r)));
      }
      prepareExternalUrl(r) {
        return (
          r && r[0] !== "/" && (r = "/" + r),
          this._locationStrategy.prepareExternalUrl(r)
        );
      }
      go(r, i = "", o = null) {
        this._locationStrategy.pushState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Nt(i)), o);
      }
      replaceState(r, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Nt(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(r = 0) {
        this._locationStrategy.historyGo?.(r);
      }
      onUrlChange(r) {
        return (
          this._urlChangeListeners.push(r),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(r);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(r = "", i) {
        this._urlChangeListeners.forEach((o) => o(r, i));
      }
      subscribe(r, i, o) {
        return this._subject.subscribe({ next: r, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = Nt),
      (e.joinWithSlash = Tl),
      (e.stripTrailingSlash = ag),
      (e.ɵfac = function (i) {
        return new (i || e)(E(vn));
      }),
      (e.ɵprov = w({ token: e, factory: () => OC(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function OC() {
  return new tr(E(vn));
}
function PC(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function cg(t) {
  return t.replace(/\/index.html$/, "");
}
function FC(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function _l(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, o] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var El = /\s+/,
  lg = [],
  nr = (() => {
    let e = class e {
      constructor(r, i) {
        (this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = lg),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(El) : lg;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(El) : r;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let r = this.rawClass;
        if (Array.isArray(r) || r instanceof Set)
          for (let i of r) this._updateState(i, !0);
        else if (r != null)
          for (let i of Object.keys(r)) this._updateState(i, !!r[i]);
        this._applyStateDiff();
      }
      _updateState(r, i) {
        let o = this.stateMap.get(r);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            o = r[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(r, i) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(El).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(pn), X(ts));
    }),
      (e.ɵdir = hn({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [Tt.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var bl = class {
    constructor(e, n, r, i) {
      (this.$implicit = e),
        (this.ngForOf = n),
        (this.index = r),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  yg = (() => {
    let e = class e {
      set ngForOf(r) {
        (this._ngForOf = r), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(r) {
        this._trackByFn = r;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(r, i, o) {
        (this._viewContainer = r),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(r) {
        r && (this._template = r);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let r = this._ngForOf;
          if (!this._differ && r)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(r).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let r = this._differ.diff(this._ngForOf);
          r && this._applyChanges(r);
        }
      }
      _applyChanges(r) {
        let i = this._viewContainer;
        r.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new bl(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = i.get(s);
            i.move(c, a), ug(c, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let c = i.get(o).context;
          (c.index = o), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          ug(s, o);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(Hr), X(ll), X(wl));
    }),
      (e.ɵdir = hn({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function ug(t, e) {
  t.context.$implicit = e.item;
}
var vg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })(),
  Al = "browser",
  kC = "server";
function Se(t) {
  return t === Al;
}
function Yr(t) {
  return t === kC;
}
var Dg = (() => {
    let e = class e {};
    e.ɵprov = w({
      token: e,
      providedIn: "root",
      factory: () => (Se(g(oe)) ? new Cl(g(ve), window) : new Il()),
    });
    let t = e;
    return t;
  })(),
  Cl = class {
    constructor(e, n) {
      (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let n = LC(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(r - o[0], i - o[1]);
    }
  };
function LC(t, e) {
  let n = t.getElementById(e) || t.getElementsByName(e)[0];
  if (n) return n;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var Il = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  ps = class {};
var ms = class t {
  constructor(e) {
    (this.normalizedNames = new Map()),
      (this.lazyUpdate = null),
      e
        ? typeof e == "string"
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                e
                  .split(
                    `
`
                  )
                  .forEach((n) => {
                    let r = n.indexOf(":");
                    if (r > 0) {
                      let i = n.slice(0, r),
                        o = i.toLowerCase(),
                        s = n.slice(r + 1).trim();
                      this.maybeSetNormalizedName(i, o),
                        this.headers.has(o)
                          ? this.headers.get(o).push(s)
                          : this.headers.set(o, [s]);
                    }
                  });
            })
          : typeof Headers < "u" && e instanceof Headers
          ? ((this.headers = new Map()),
            e.forEach((n, r) => {
              this.setHeaderEntries(r, n);
            }))
          : (this.lazyInit = () => {
              (this.headers = new Map()),
                Object.entries(e).forEach(([n, r]) => {
                  this.setHeaderEntries(n, r);
                });
            })
        : (this.headers = new Map());
  }
  has(e) {
    return this.init(), this.headers.has(e.toLowerCase());
  }
  get(e) {
    this.init();
    let n = this.headers.get(e.toLowerCase());
    return n && n.length > 0 ? n[0] : null;
  }
  keys() {
    return this.init(), Array.from(this.normalizedNames.values());
  }
  getAll(e) {
    return this.init(), this.headers.get(e.toLowerCase()) || null;
  }
  append(e, n) {
    return this.clone({ name: e, value: n, op: "a" });
  }
  set(e, n) {
    return this.clone({ name: e, value: n, op: "s" });
  }
  delete(e, n) {
    return this.clone({ name: e, value: n, op: "d" });
  }
  maybeSetNormalizedName(e, n) {
    this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
  }
  init() {
    this.lazyInit &&
      (this.lazyInit instanceof t
        ? this.copyFrom(this.lazyInit)
        : this.lazyInit(),
      (this.lazyInit = null),
      this.lazyUpdate &&
        (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
        (this.lazyUpdate = null)));
  }
  copyFrom(e) {
    e.init(),
      Array.from(e.headers.keys()).forEach((n) => {
        this.headers.set(n, e.headers.get(n)),
          this.normalizedNames.set(n, e.normalizedNames.get(n));
      });
  }
  clone(e) {
    let n = new t();
    return (
      (n.lazyInit =
        this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
      (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
      n
    );
  }
  applyUpdate(e) {
    let n = e.name.toLowerCase();
    switch (e.op) {
      case "a":
      case "s":
        let r = e.value;
        if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
        this.maybeSetNormalizedName(e.name, n);
        let i = (e.op === "a" ? this.headers.get(n) : void 0) || [];
        i.push(...r), this.headers.set(n, i);
        break;
      case "d":
        let o = e.value;
        if (!o) this.headers.delete(n), this.normalizedNames.delete(n);
        else {
          let s = this.headers.get(n);
          if (!s) return;
          (s = s.filter((a) => o.indexOf(a) === -1)),
            s.length === 0
              ? (this.headers.delete(n), this.normalizedNames.delete(n))
              : this.headers.set(n, s);
        }
        break;
    }
  }
  setHeaderEntries(e, n) {
    let r = (Array.isArray(n) ? n : [n]).map((o) => o.toString()),
      i = e.toLowerCase();
    this.headers.set(i, r), this.maybeSetNormalizedName(e, i);
  }
  forEach(e) {
    this.init(),
      Array.from(this.normalizedNames.keys()).forEach((n) =>
        e(this.normalizedNames.get(n), this.headers.get(n))
      );
  }
};
var Mg = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Mg || {}),
  Nl = class {
    constructor(e, n = _g.Ok, r = "OK") {
      (this.headers = e.headers || new ms()),
        (this.status = e.status !== void 0 ? e.status : n),
        (this.statusText = e.statusText || r),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var ys = class t extends Nl {
  constructor(e = {}) {
    super(e),
      (this.type = Mg.Response),
      (this.body = e.body !== void 0 ? e.body : null);
  }
  clone(e = {}) {
    return new t({
      body: e.body !== void 0 ? e.body : this.body,
      headers: e.headers || this.headers,
      status: e.status !== void 0 ? e.status : this.status,
      statusText: e.statusText || this.statusText,
      url: e.url || this.url || void 0,
    });
  }
};
var _g = (function (t) {
  return (
    (t[(t.Continue = 100)] = "Continue"),
    (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
    (t[(t.Processing = 102)] = "Processing"),
    (t[(t.EarlyHints = 103)] = "EarlyHints"),
    (t[(t.Ok = 200)] = "Ok"),
    (t[(t.Created = 201)] = "Created"),
    (t[(t.Accepted = 202)] = "Accepted"),
    (t[(t.NonAuthoritativeInformation = 203)] = "NonAuthoritativeInformation"),
    (t[(t.NoContent = 204)] = "NoContent"),
    (t[(t.ResetContent = 205)] = "ResetContent"),
    (t[(t.PartialContent = 206)] = "PartialContent"),
    (t[(t.MultiStatus = 207)] = "MultiStatus"),
    (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
    (t[(t.ImUsed = 226)] = "ImUsed"),
    (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
    (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
    (t[(t.Found = 302)] = "Found"),
    (t[(t.SeeOther = 303)] = "SeeOther"),
    (t[(t.NotModified = 304)] = "NotModified"),
    (t[(t.UseProxy = 305)] = "UseProxy"),
    (t[(t.Unused = 306)] = "Unused"),
    (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
    (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
    (t[(t.BadRequest = 400)] = "BadRequest"),
    (t[(t.Unauthorized = 401)] = "Unauthorized"),
    (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
    (t[(t.Forbidden = 403)] = "Forbidden"),
    (t[(t.NotFound = 404)] = "NotFound"),
    (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
    (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
    (t[(t.ProxyAuthenticationRequired = 407)] = "ProxyAuthenticationRequired"),
    (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
    (t[(t.Conflict = 409)] = "Conflict"),
    (t[(t.Gone = 410)] = "Gone"),
    (t[(t.LengthRequired = 411)] = "LengthRequired"),
    (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
    (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
    (t[(t.UriTooLong = 414)] = "UriTooLong"),
    (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
    (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
    (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
    (t[(t.ImATeapot = 418)] = "ImATeapot"),
    (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
    (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
    (t[(t.Locked = 423)] = "Locked"),
    (t[(t.FailedDependency = 424)] = "FailedDependency"),
    (t[(t.TooEarly = 425)] = "TooEarly"),
    (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
    (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
    (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
    (t[(t.RequestHeaderFieldsTooLarge = 431)] = "RequestHeaderFieldsTooLarge"),
    (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
    (t[(t.InternalServerError = 500)] = "InternalServerError"),
    (t[(t.NotImplemented = 501)] = "NotImplemented"),
    (t[(t.BadGateway = 502)] = "BadGateway"),
    (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
    (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
    (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
    (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
    (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
    (t[(t.LoopDetected = 508)] = "LoopDetected"),
    (t[(t.NotExtended = 510)] = "NotExtended"),
    (t[(t.NetworkAuthenticationRequired = 511)] =
      "NetworkAuthenticationRequired"),
    t
  );
})(_g || {});
var VC = new S("");
var wg = "b",
  Eg = "h",
  bg = "s",
  Cg = "st",
  Ig = "u",
  Sg = "rt",
  gs = new S(""),
  $C = ["GET", "HEAD"];
function BC(t, e) {
  let d = g(gs),
    { isCacheActive: n } = d,
    r = Ni(d, ["isCacheActive"]),
    { transferCache: i, method: o } = t;
  if (
    !n ||
    (o === "POST" && !r.includePostRequests && !i) ||
    (o !== "POST" && !$C.includes(o)) ||
    i === !1 ||
    r.filter?.(t) === !1
  )
    return e(t);
  let s = g(gn),
    a = HC(t),
    c = s.get(a, null),
    l = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (l = i.includeHeaders), c)) {
    let { [wg]: f, [Sg]: h, [Eg]: p, [bg]: y, [Cg]: A, [Ig]: M } = c,
      H = f;
    switch (h) {
      case "arraybuffer":
        H = new TextEncoder().encode(f).buffer;
        break;
      case "blob":
        H = new Blob([f]);
        break;
    }
    let z = new ms(p);
    return _(new ys({ body: H, headers: z, status: y, statusText: A, url: M }));
  }
  let u = Yr(g(oe));
  return e(t).pipe(
    le((f) => {
      f instanceof ys &&
        u &&
        s.set(a, {
          [wg]: f.body,
          [Eg]: UC(f.headers, l),
          [bg]: f.status,
          [Cg]: f.statusText,
          [Ig]: f.url || "",
          [Sg]: t.responseType,
        });
    })
  );
}
function UC(t, e) {
  if (!e) return {};
  let n = {};
  for (let r of e) {
    let i = t.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function Tg(t) {
  return [...t.keys()]
    .sort()
    .map((e) => `${e}=${t.getAll(e)}`)
    .join("&");
}
function HC(t) {
  let { params: e, method: n, responseType: r, url: i } = t,
    o = Tg(e),
    s = t.serializeBody();
  s instanceof URLSearchParams ? (s = Tg(s)) : typeof s != "string" && (s = "");
  let a = [n, r, i, s, o].join("|"),
    c = zC(a);
  return c;
}
function zC(t) {
  let e = 0;
  for (let n of t) e = (Math.imul(31, e) + n.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function Ag(t) {
  return [
    {
      provide: gs,
      useFactory: () => (
        Gt("NgHttpTransferCache"), v({ isCacheActive: !0 }, t)
      ),
    },
    { provide: VC, useValue: BC, multi: !0, deps: [gn, gs] },
    {
      provide: er,
      multi: !0,
      useFactory: () => {
        let e = g(xt),
          n = g(gs);
        return () => {
          yl(e).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var Pl = class extends hs {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Fl = class t extends Pl {
    static makeCurrent() {
      hg(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? window
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let n = qC();
      return n == null ? null : GC(n);
    }
    resetBaseElement() {
      Zr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return _l(document.cookie, e);
    }
  },
  Zr = null;
function qC() {
  return (
    (Zr = Zr || document.querySelector("base")),
    Zr ? Zr.getAttribute("href") : null
  );
}
function GC(t) {
  return new URL(t, document.baseURI).pathname;
}
var kl = class {
    addToWindow(e) {
      (Re.getAngularTestability = (r, i = !0) => {
        let o = e.findTestabilityInTree(r, i);
        if (o == null) throw new m(5103, !1);
        return o;
      }),
        (Re.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (Re.getAllAngularRootElements = () => e.getAllRootElements());
      let n = (r) => {
        let i = Re.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && r();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      Re.frameworkStabilizers || (Re.frameworkStabilizers = []),
        Re.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(e, n, r) {
      if (n == null) return null;
      let i = e.getTestability(n);
      return (
        i ??
        (r
          ? yn().isShadowRoot(n)
            ? this.findTestabilityInTree(e, n.host, !0)
            : this.findTestabilityInTree(e, n.parentElement, !0)
          : null)
      );
    }
  },
  WC = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ll = new S(""),
  Rg = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, o) {
        return this._findPluginFor(i).addEventListener(r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(r))), !i))
          throw new m(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Ll), E(G));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  vs = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Rl = "ng-app-id",
  Og = (() => {
    let e = class e {
      constructor(r, i, o, s = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Yr(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((o) => o.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Rl}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let o = this.styleRef;
        if (o.has(r)) {
          let s = o.get(r);
          return (s.usage += i), s.usage;
        }
        return o.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(Rl), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Rl, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let o = this.getStyleElement(r, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(ve), E(Ur), E(Wc, 8), E(oe));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ol = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  $l = /%COMP%/g,
  Pg = "%COMP%",
  QC = `_nghost-${Pg}`,
  KC = `_ngcontent-${Pg}`,
  YC = !0,
  ZC = new S("", { providedIn: "root", factory: () => YC });
function XC(t) {
  return KC.replace($l, t);
}
function JC(t) {
  return QC.replace($l, t);
}
function Fg(t, e) {
  return e.map((n) => n.replace($l, t));
}
var Ds = (() => {
    let e = class e {
      constructor(r, i, o, s, a, c, l, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Yr(c)),
          (this.defaultRenderer = new Xr(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === dt.ShadowDom &&
          (i = se(v({}, i), { encapsulation: dt.Emulated }));
        let o = this.getOrCreateRenderer(r, i);
        return (
          o instanceof ws
            ? o.applyToHost(r)
            : o instanceof Jr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(r, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case dt.Emulated:
              s = new ws(l, u, i, this.appId, d, a, c, f);
              break;
            case dt.ShadowDom:
              return new jl(l, u, r, i, a, c, this.nonce, f);
            default:
              s = new Jr(l, u, i, d, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        E(Rg),
        E(Og),
        E(Ur),
        E(ZC),
        E(ve),
        E(oe),
        E(G),
        E(Wc)
      );
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Xr = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(Ol[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (xg(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (xg(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new m(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let o = Ol[i];
        o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Ol[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (At.DashCase | At.Important)
        ? e.style.setProperty(n, r, i & At.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & At.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == "string" &&
        ((e = yn().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function xg(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var jl = class extends Xr {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = Fg(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Jr = class extends Xr {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? Fg(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ws = class extends Jr {
    constructor(e, n, r, i, o, s, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, o, s, a, c, l),
        (this.contentAttr = XC(l)),
        (this.hostAttr = JC(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  e0 = (() => {
    let e = class e extends vs {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, o) {
        return (
          r.addEventListener(i, o, !1), () => this.removeEventListener(r, i, o)
        );
      }
      removeEventListener(r, i, o) {
        return r.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(ve));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ng = ["alt", "control", "meta", "shift"],
  t0 = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  n0 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  r0 = (() => {
    let e = class e extends vs {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => yn().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          Ng.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = o), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(r, i) {
        let o = t0[r.key] || r.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = r.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Ng.forEach((a) => {
                if (a !== o) {
                  let c = n0[a];
                  c(r) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(r, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, r) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(ve));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function i0() {
  Fl.makeCurrent();
}
function o0() {
  return new ft();
}
function s0() {
  return Gh(document), document;
}
var a0 = [
    { provide: oe, useValue: Al },
    { provide: qc, useValue: i0, multi: !0 },
    { provide: ve, useFactory: s0, deps: [] },
  ],
  kg = Dl(rg, "browser", a0),
  c0 = new S(""),
  l0 = [
    { provide: Qr, useClass: kl, deps: [] },
    { provide: gl, useClass: ls, deps: [G, us, Qr] },
    { provide: ls, useClass: ls, deps: [G, us, Qr] },
  ],
  u0 = [
    { provide: jo, useValue: "root" },
    { provide: ft, useFactory: o0, deps: [] },
    { provide: Ll, useClass: e0, multi: !0, deps: [ve, G, oe] },
    { provide: Ll, useClass: r0, multi: !0, deps: [ve] },
    Ds,
    Og,
    Rg,
    { provide: dn, useExisting: Ds },
    { provide: ps, useClass: WC, deps: [] },
    [],
  ],
  Bl = (() => {
    let e = class e {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: e, providers: [{ provide: Ur, useValue: r.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(c0, 12));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({ providers: [...u0, ...l0], imports: [vg, ig] }));
    let t = e;
    return t;
  })();
var Lg = (() => {
  let e = class e {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ve));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Vl = (function (t) {
  return (
    (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    t
  );
})(Vl || {});
function jg(...t) {
  let e = [],
    n = new Set(),
    r = n.has(Vl.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: o } of t) n.add(o), i.length && e.push(i);
  return kr([[], og(), n.has(Vl.NoHttpTransferCache) || r ? [] : Ag({}), e]);
}
var R = "primary",
  pi = Symbol("RouteTitle"),
  Gl = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function ar(t) {
  return new Gl(t);
}
function d0(t, e, n) {
  let r = n.path.split("/");
  if (
    r.length > t.length ||
    (n.pathMatch === "full" && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < r.length; o++) {
    let s = r[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function f0(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!yt(t[n], e[n])) return !1;
  return !0;
}
function yt(t, e) {
  let n = t ? Wl(t) : void 0,
    r = e ? Wl(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let o = 0; o < n.length; o++)
    if (((i = n[o]), !Qg(t[i], e[i]))) return !1;
  return !0;
}
function Wl(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Qg(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, o) => r[o] === i);
  } else return t === e;
}
function Kg(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Yt(t) {
  return va(t) ? t : Kr(t) ? re(Promise.resolve(t)) : _(t);
}
var h0 = { exact: Zg, subset: Xg },
  Yg = { exact: p0, subset: g0, ignored: () => !0 };
function $g(t, e, n) {
  return (
    h0[n.paths](t.root, e.root, n.matrixParams) &&
    Yg[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function p0(t, e) {
  return yt(t, e);
}
function Zg(t, e, n) {
  if (
    !wn(t.segments, e.segments) ||
    !Cs(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !Zg(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function g0(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => Qg(t[n], e[n]))
  );
}
function Xg(t, e, n) {
  return Jg(t, e, e.segments, n);
}
function Jg(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!wn(i, n) || e.hasChildren() || !Cs(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!wn(t.segments, n) || !Cs(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !Xg(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      o = n.slice(t.segments.length);
    return !wn(t.segments, i) || !Cs(t.segments, i, r) || !t.children[R]
      ? !1
      : Jg(t.children[R], e, o, r);
  }
}
function Cs(t, e, n) {
  return e.every((r, i) => Yg[n](t[i].parameters, r.parameters));
}
var Wt = class {
    constructor(e = new W([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= ar(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return v0.serialize(this);
    }
  },
  W = class {
    constructor(e, n) {
      (this.segments = e),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Is(this);
    }
  },
  Dn = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= ar(this.parameters)), this._parameterMap;
    }
    toString() {
      return tm(this);
    }
  };
function m0(t, e) {
  return wn(t, e) && t.every((n, r) => yt(n.parameters, e[r].parameters));
}
function wn(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function y0(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === R && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== R && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var gi = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => new si(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  si = class {
    parse(e) {
      let n = new Kl(e);
      return new Wt(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(e) {
      let n = `/${ei(e.root, !0)}`,
        r = E0(e.queryParams),
        i = typeof e.fragment == "string" ? `#${D0(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  v0 = new si();
function Is(t) {
  return t.segments.map((e) => tm(e)).join("/");
}
function ei(t, e) {
  if (!t.hasChildren()) return Is(t);
  if (e) {
    let n = t.children[R] ? ei(t.children[R], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== R && r.push(`${i}:${ei(o, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = y0(t, (r, i) =>
      i === R ? [ei(t.children[R], !1)] : [`${i}:${ei(r, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[R] != null
      ? `${Is(t)}/${n[0]}`
      : `${Is(t)}/(${n.join("//")})`;
  }
}
function em(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Es(t) {
  return em(t).replace(/%3B/gi, ";");
}
function D0(t) {
  return encodeURI(t);
}
function Ql(t) {
  return em(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Ss(t) {
  return decodeURIComponent(t);
}
function Bg(t) {
  return Ss(t.replace(/\+/g, "%20"));
}
function tm(t) {
  return `${Ql(t.path)}${w0(t.parameters)}`;
}
function w0(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${Ql(e)}=${Ql(n)}`)
    .join("");
}
function E0(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${Es(n)}=${Es(i)}`).join("&")
        : `${Es(n)}=${Es(r)}`
    )
    .filter((n) => n);
  return e.length ? `?${e.join("&")}` : "";
}
var b0 = /^[^\/()?;#]+/;
function Ul(t) {
  let e = t.match(b0);
  return e ? e[0] : "";
}
var C0 = /^[^\/()?;=#]+/;
function I0(t) {
  let e = t.match(C0);
  return e ? e[0] : "";
}
var S0 = /^[^=?&#]+/;
function T0(t) {
  let e = t.match(S0);
  return e ? e[0] : "";
}
var M0 = /^[^&#]+/;
function _0(t) {
  let e = t.match(M0);
  return e ? e[0] : "";
}
var Kl = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new W([], {})
        : new W([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (e.length > 0 || Object.keys(n).length > 0) && (r[R] = new W(e, n)),
      r
    );
  }
  parseSegment() {
    let e = Ul(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new m(4009, !1);
    return this.capture(e), new Dn(Ss(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = I0(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = Ul(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Ss(n)] = Ss(r);
  }
  parseQueryParam(e) {
    let n = T0(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = _0(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let i = Bg(n),
      o = Bg(r);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = Ul(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new m(4010, !1);
      let o;
      r.indexOf(":") > -1
        ? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = R);
      let s = this.parseChildren();
      (n[o] = Object.keys(s).length === 1 ? s[R] : new W([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new m(4011, !1);
  }
};
function nm(t) {
  return t.segments.length > 0 ? new W([], { [R]: t }) : t;
}
function rm(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let o = rm(i);
    if (r === R && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
  }
  let n = new W(t.segments, e);
  return A0(n);
}
function A0(t) {
  if (t.numberOfChildren === 1 && t.children[R]) {
    let e = t.children[R];
    return new W(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function cr(t) {
  return t instanceof Wt;
}
function x0(t, e, n = null, r = null) {
  let i = im(t);
  return om(i, e, n, r);
}
function im(t) {
  let e;
  function n(o) {
    let s = {};
    for (let c of o.children) {
      let l = n(c);
      s[c.outlet] = l;
    }
    let a = new W(o.url, s);
    return o === t && (e = a), a;
  }
  let r = n(t.root),
    i = nm(r);
  return e ?? i;
}
function om(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Hl(i, i, i, n, r);
  let o = N0(e);
  if (o.toRoot()) return Hl(i, i, new W([], {}), n, r);
  let s = R0(o, i, t),
    a = s.processChildren
      ? ri(s.segmentGroup, s.index, o.commands)
      : am(s.segmentGroup, s.index, o.commands);
  return Hl(i, s.segmentGroup, a, n, r);
}
function Ts(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function ai(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Hl(t, e, n, r, i) {
  let o = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  t === e ? (s = n) : (s = sm(t, e, n));
  let a = nm(rm(s));
  return new Wt(a, o, i);
}
function sm(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (r[i] = n) : (r[i] = sm(o, e, n));
    }),
    new W(t.segments, r)
  );
}
var Ms = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && Ts(r[0]))
    )
      throw new m(4003, !1);
    let i = r.find(ai);
    if (i && i !== Kg(r)) throw new m(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function N0(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Ms(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (n = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Ms(n, e, r);
}
var or = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function R0(t, e, n) {
  if (t.isAbsolute) return new or(e, !0, 0);
  if (!n) return new or(e, !1, NaN);
  if (n.parent === null) return new or(n, !0, 0);
  let r = Ts(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return O0(n, i, t.numberOfDoubleDots);
}
function O0(t, e, n) {
  let r = t,
    i = e,
    o = n;
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new m(4005, !1);
    i = r.segments.length;
  }
  return new or(r, !1, i - o);
}
function P0(t) {
  return ai(t[0]) ? t[0].outlets : { [R]: t };
}
function am(t, e, n) {
  if (((t ??= new W([], {})), t.segments.length === 0 && t.hasChildren()))
    return ri(t, e, n);
  let r = F0(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let o = new W(t.segments.slice(0, r.pathIndex), {});
    return (
      (o.children[R] = new W(t.segments.slice(r.pathIndex), t.children)),
      ri(o, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new W(t.segments, {})
      : r.match && !t.hasChildren()
      ? Yl(t, e, n)
      : r.match
      ? ri(t, 0, i)
      : Yl(t, e, n);
}
function ri(t, e, n) {
  if (n.length === 0) return new W(t.segments, {});
  {
    let r = P0(n),
      i = {};
    if (
      Object.keys(r).some((o) => o !== R) &&
      t.children[R] &&
      t.numberOfChildren === 1 &&
      t.children[R].segments.length === 0
    ) {
      let o = ri(t.children[R], e, n);
      return new W(t.segments, o.children);
    }
    return (
      Object.entries(r).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = am(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        r[o] === void 0 && (i[o] = s);
      }),
      new W(t.segments, i)
    );
  }
}
function F0(t, e, n) {
  let r = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return o;
    let s = t.segments[i],
      a = n[r];
    if (ai(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!Hg(c, l, s)) return o;
      r += 2;
    } else {
      if (!Hg(c, {}, s)) return o;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function Yl(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (ai(o)) {
      let c = k0(o.outlets);
      return new W(r, c);
    }
    if (i === 0 && Ts(n[0])) {
      let c = t.segments[e];
      r.push(new Dn(c.path, Ug(n[0]))), i++;
      continue;
    }
    let s = ai(o) ? o.outlets[R] : `${o}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    s && a && Ts(a)
      ? (r.push(new Dn(s, Ug(a))), (i += 2))
      : (r.push(new Dn(s, {})), i++);
  }
  return new W(r, {});
}
function k0(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = Yl(new W([], {}), 0, r));
    }),
    e
  );
}
function Ug(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function Hg(t, e, n) {
  return t == n.path && yt(e, n.parameters);
}
var ii = "imperative",
  pe = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(pe || {}),
  Ke = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  lr = class extends Ke {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = pe.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Rt = class extends Ke {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = pe.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ve = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Ve || {}),
  _s = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(_s || {}),
  Qt = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = pe.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Kt = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = pe.NavigationSkipped);
    }
  },
  ci = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = pe.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  As = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pe.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Zl = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pe.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Xl = class extends Ke {
    constructor(e, n, r, i, o) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = pe.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Jl = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pe.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  eu = class extends Ke {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pe.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  tu = class {
    constructor(e) {
      (this.route = e), (this.type = pe.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  nu = class {
    constructor(e) {
      (this.route = e), (this.type = pe.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  ru = class {
    constructor(e) {
      (this.snapshot = e), (this.type = pe.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  iu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = pe.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ou = class {
    constructor(e) {
      (this.snapshot = e), (this.type = pe.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  su = class {
    constructor(e) {
      (this.snapshot = e), (this.type = pe.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  xs = class {
    constructor(e, n, r) {
      (this.routerEvent = e),
        (this.position = n),
        (this.anchor = r),
        (this.type = pe.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  li = class {},
  ui = class {
    constructor(e) {
      this.url = e;
    }
  };
var au = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new mi()),
        (this.attachRef = null);
    }
  },
  mi = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let o = this.getOrCreateContext(r);
        (o.outlet = i), this.contexts.set(r, o);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new au()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ns = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let n = this.pathFromRoot(e);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(e) {
      let n = cu(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = cu(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = lu(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return lu(e, this._root).map((n) => n.value);
    }
  };
function cu(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = cu(t, n);
    if (r) return r;
  }
  return null;
}
function lu(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = lu(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var je = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function ir(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var Rs = class extends Ns {
  constructor(e, n) {
    super(e), (this.snapshot = n), Du(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function cm(t) {
  let e = L0(t),
    n = new ge([new Dn("", {})]),
    r = new ge({}),
    i = new ge({}),
    o = new ge({}),
    s = new ge(""),
    a = new ur(n, r, o, s, i, R, t, e.root);
  return (a.snapshot = e.root), new Rs(new je(a, []), e);
}
function L0(t) {
  let e = {},
    n = {},
    r = {},
    i = "",
    o = new di([], e, r, i, n, R, t, null, {});
  return new Os("", new je(o, []));
}
var ur = class {
  constructor(e, n, r, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(L((l) => l[pi])) ?? _(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(L((e) => ar(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(L((e) => ar(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function vu(t, e, n = "emptyOnly") {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: v(v({}, e.params), t.params),
          data: v(v({}, e.data), t.data),
          resolve: v(v(v(v({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: v({}, t.params),
          data: v({}, t.data),
          resolve: v(v({}, t.data), t._resolvedData ?? {}),
        }),
    i && um(i) && (r.resolve[pi] = i.title),
    r
  );
}
var di = class {
    get title() {
      return this.data?.[pi];
    }
    constructor(e, n, r, i, o, s, a, c, l) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= ar(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= ar(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  Os = class extends Ns {
    constructor(e, n) {
      super(n), (this.url = e), Du(this, n);
    }
    toString() {
      return lm(this._root);
    }
  };
function Du(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => Du(t, n));
}
function lm(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(lm).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function zl(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      yt(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      yt(e.params, n.params) || t.paramsSubject.next(n.params),
      f0(e.url, n.url) || t.urlSubject.next(n.url),
      yt(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function uu(t, e) {
  let n = yt(t.params, e.params) && m0(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || uu(t.parent, e.parent));
}
function um(t) {
  return typeof t.title == "string" || t.title === null;
}
var j0 = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = R),
          (this.activateEvents = new me()),
          (this.deactivateEvents = new me()),
          (this.attachEvents = new me()),
          (this.detachEvents = new me()),
          (this.parentContexts = g(mi)),
          (this.location = g(Hr)),
          (this.changeDetector = g(mn)),
          (this.environmentInjector = g(Ce)),
          (this.inputBinder = g(js, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: o } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new m(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new m(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new m(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new m(4013, !1);
        this._activatedRoute = r;
        let o = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new du(r, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = hn({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Bo],
      }));
    let t = e;
    return t;
  })(),
  du = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === ur
        ? this.route
        : e === mi
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  js = new S(""),
  zg = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(r) {
        this.unsubscribeFromRouteData(r), this.subscribeToRouteData(r);
      }
      unsubscribeFromRouteData(r) {
        this.outletDataSubscriptions.get(r)?.unsubscribe(),
          this.outletDataSubscriptions.delete(r);
      }
      subscribeToRouteData(r) {
        let { activatedRoute: i } = r,
          o = vr([i.queryParams, i.params, i.data])
            .pipe(
              Ne(
                ([s, a, c], l) => (
                  (c = v(v(v({}, s), a), c)),
                  l === 0 ? _(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !r.isActivated ||
                !r.activatedComponentRef ||
                r.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              let a = sg(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              for (let { templateName: c } of a.inputs)
                r.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(r, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function V0(t, e, n) {
  let r = fi(t, e._root, n ? n._root : void 0);
  return new Rs(r, e);
}
function fi(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = $0(t, e, n);
    return new je(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => fi(t, a))),
          s
        );
      }
    }
    let r = B0(e.value),
      i = e.children.map((o) => fi(t, o));
    return new je(r, i);
  }
}
function $0(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return fi(t, r, i);
    return fi(t, r);
  });
}
function B0(t) {
  return new ur(
    new ge(t.url),
    new ge(t.params),
    new ge(t.queryParams),
    new ge(t.fragment),
    new ge(t.data),
    t.outlet,
    t.component,
    t
  );
}
var dm = "ngNavigationCancelingError";
function fm(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = cr(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = hm(!1, Ve.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function hm(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ""}`);
  return (n[dm] = !0), (n.cancellationCode = e), n;
}
function U0(t) {
  return pm(t) && cr(t.url);
}
function pm(t) {
  return !!t && t[dm];
}
var H0 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Kp],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && Y(0, "router-outlet");
      },
      dependencies: [j0],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function z0(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = rs(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function wu(t) {
  let e = t.children && t.children.map(wu),
    n = e ? se(v({}, t), { children: e }) : v({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== R &&
      (n.component = H0),
    n
  );
}
function vt(t) {
  return t.outlet || R;
}
function q0(t, e) {
  let n = t.filter((r) => vt(r) === e);
  return n.push(...t.filter((r) => vt(r) !== e)), n;
}
function yi(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var G0 = (t, e, n, r) =>
    L(
      (i) => (
        new fu(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      )
    ),
  fu = class {
    constructor(e, n, r, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        zl(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = ir(n);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], r), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if (i === o)
        if (i.component) {
          let s = r.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, n, s.children);
        } else this.deactivateChildRoutes(e, n, r);
      else o && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(e, n) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, n)
        : this.deactivateRouteAndOutlet(e, n);
    }
    detachAndStoreRouteSubtree(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = ir(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = ir(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = ir(n);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], r),
          this.forwardEvent(new su(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new iu(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if ((zl(i), i === o))
        if (i.component) {
          let s = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, s.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let s = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            zl(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = yi(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  Ps = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  sr = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function W0(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return ti(r, i, n, [r.value]);
}
function Q0(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function fr(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !kf(t) ? t : e.get(t)) : r;
}
function ti(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = ir(e);
  return (
    t.children.forEach((s) => {
      K0(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => oi(a, n.getContext(s), i)),
    i
  );
}
function K0(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = Y0(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Ps(r))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? ti(t, e, a ? a.children : null, r, i) : ti(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new sr(a.outlet.component, s));
  } else
    s && oi(e, a, i),
      i.canActivateChecks.push(new Ps(r)),
      o.component
        ? ti(t, null, a ? a.children : null, r, i)
        : ti(t, null, n, r, i);
  return i;
}
function Y0(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !wn(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !wn(t.url, e.url) || !yt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !uu(t, e) || !yt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !uu(t, e);
  }
}
function oi(t, e, n) {
  let r = ir(t),
    i = t.value;
  Object.entries(r).forEach(([o, s]) => {
    i.component
      ? e
        ? oi(s, e.children.getContext(o), n)
        : oi(s, null, n)
      : oi(s, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new sr(e.outlet.component, i))
        : n.canDeactivateChecks.push(new sr(null, i))
      : n.canDeactivateChecks.push(new sr(null, i));
}
function vi(t) {
  return typeof t == "function";
}
function Z0(t) {
  return typeof t == "boolean";
}
function X0(t) {
  return t && vi(t.canLoad);
}
function J0(t) {
  return t && vi(t.canActivate);
}
function eI(t) {
  return t && vi(t.canActivateChild);
}
function tI(t) {
  return t && vi(t.canDeactivate);
}
function nI(t) {
  return t && vi(t.canMatch);
}
function gm(t) {
  return t instanceof Ct || t?.name === "EmptyError";
}
var bs = Symbol("INITIAL_VALUE");
function dr() {
  return Ne((t) =>
    vr(t.map((e) => e.pipe(It(1), ba(bs)))).pipe(
      L((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === bs) return bs;
            if (n === !1 || n instanceof Wt) return n;
          }
        return !0;
      }),
      xe((e) => e !== bs),
      It(1)
    )
  );
}
function rI(t, e) {
  return ae((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && o.length === 0
      ? _(se(v({}, n), { guardsResult: !0 }))
      : iI(s, r, i, t).pipe(
          ae((a) => (a && Z0(a) ? oI(r, o, t, e) : _(a))),
          L((a) => se(v({}, n), { guardsResult: a }))
        );
  });
}
function iI(t, e, n, r) {
  return re(t).pipe(
    ae((i) => uI(i.component, i.route, n, e, r)),
    Xe((i) => i !== !0, !0)
  );
}
function oI(t, e, n, r) {
  return re(e).pipe(
    jt((i) =>
      kn(
        aI(i.route.parent, r),
        sI(i.route, r),
        lI(t, i.path, n),
        cI(t, i.route, n)
      )
    ),
    Xe((i) => i !== !0, !0)
  );
}
function sI(t, e) {
  return t !== null && e && e(new ou(t)), _(!0);
}
function aI(t, e) {
  return t !== null && e && e(new ru(t)), _(!0);
}
function cI(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return _(!0);
  let i = r.map((o) =>
    Zi(() => {
      let s = yi(e) ?? n,
        a = fr(o, s),
        c = J0(a) ? a.canActivate(e, t) : ht(s, () => a(e, t));
      return Yt(c).pipe(Xe());
    })
  );
  return _(i).pipe(dr());
}
function lI(t, e, n) {
  let r = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => Q0(s))
      .filter((s) => s !== null)
      .map((s) =>
        Zi(() => {
          let a = s.guards.map((c) => {
            let l = yi(s.node) ?? n,
              u = fr(c, l),
              d = eI(u) ? u.canActivateChild(r, t) : ht(l, () => u(r, t));
            return Yt(d).pipe(Xe());
          });
          return _(a).pipe(dr());
        })
      );
  return _(o).pipe(dr());
}
function uI(t, e, n, r, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return _(!0);
  let s = o.map((a) => {
    let c = yi(e) ?? i,
      l = fr(a, c),
      u = tI(l) ? l.canDeactivate(t, e, n, r) : ht(c, () => l(t, e, n, r));
    return Yt(u).pipe(Xe());
  });
  return _(s).pipe(dr());
}
function dI(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = fr(s, t),
      c = X0(a) ? a.canLoad(e, n) : ht(t, () => a(e, n));
    return Yt(c);
  });
  return _(o).pipe(dr(), mm(r));
}
function mm(t) {
  return pa(
    le((e) => {
      if (cr(e)) throw fm(t, e);
    }),
    L((e) => e === !0)
  );
}
function fI(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = fr(s, t),
      c = nI(a) ? a.canMatch(e, n) : ht(t, () => a(e, n));
    return Yt(c);
  });
  return _(o).pipe(dr(), mm(r));
}
var hi = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Fs = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function rr(t) {
  return Pn(new hi(t));
}
function hI(t) {
  return Pn(new m(4e3, !1));
}
function pI(t) {
  return Pn(hm(!1, Ve.GuardRejected));
}
var hu = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return _(r);
        if (i.numberOfChildren > 1 || !i.children[R]) return hI(e.redirectTo);
        i = i.children[R];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r
      );
      if (n.startsWith("/")) throw new Fs(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let o = this.createSegmentGroup(e, n.root, r, i);
      return new Wt(
        o,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            r[i] = n[a];
          } else r[i] = o;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let o = this.createSegments(e, n.segments, r, i),
        s = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, r, i);
        }),
        new W(o, s)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, r)
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new m(4001, !1);
      return i;
    }
    findOrReturn(e, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === e.path) return n.splice(r), i;
        r++;
      }
      return e;
    }
  },
  pu = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function gI(t, e, n, r, i) {
  let o = Eu(t, e, n);
  return o.matched
    ? ((r = z0(e, r)),
      fI(r, e, n, i).pipe(L((s) => (s === !0 ? o : v({}, pu)))))
    : _(o);
}
function Eu(t, e, n) {
  if (e.path === "**") return mI(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? v({}, pu)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || d0)(n, t, e);
  if (!i) return v({}, pu);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? v(v({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function mI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Kg(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function qg(t, e, n, r) {
  return n.length > 0 && DI(t, n, r)
    ? {
        segmentGroup: new W(e, vI(r, new W(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && wI(t, n, r)
    ? {
        segmentGroup: new W(t.segments, yI(t, n, r, t.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new W(t.segments, t.children), slicedSegments: n };
}
function yI(t, e, n, r) {
  let i = {};
  for (let o of n)
    if (Vs(t, e, o) && !r[vt(o)]) {
      let s = new W([], {});
      i[vt(o)] = s;
    }
  return v(v({}, r), i);
}
function vI(t, e) {
  let n = {};
  n[R] = e;
  for (let r of t)
    if (r.path === "" && vt(r) !== R) {
      let i = new W([], {});
      n[vt(r)] = i;
    }
  return n;
}
function DI(t, e, n) {
  return n.some((r) => Vs(t, e, r) && vt(r) !== R);
}
function wI(t, e, n) {
  return n.some((r) => Vs(t, e, r));
}
function Vs(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function EI(t, e, n, r) {
  return vt(t) !== r && (r === R || !Vs(e, n, t)) ? !1 : Eu(e, t, n).matched;
}
function bI(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var gu = class {};
function CI(t, e, n, r, i, o, s = "emptyOnly") {
  return new mu(t, e, n, r, i, s, o).recognize();
}
var II = 31,
  mu = class {
    constructor(e, n, r, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new hu(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new m(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = qg(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        L((n) => {
          let r = new di(
              [],
              Object.freeze({}),
              Object.freeze(v({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              R,
              this.rootComponentType,
              null,
              {}
            ),
            i = new je(r, n),
            o = new Os("", i),
            s = x0(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, R).pipe(
        Lt((r) => {
          if (r instanceof Fs)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof hi ? this.noMatchError(r) : r;
        })
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = vu(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            L((o) => (o instanceof je ? [o] : []))
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let o of Object.keys(r.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return re(i).pipe(
        jt((o) => {
          let s = r.children[o],
            a = q0(n, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Ea((o, s) => (o.push(...s), o)),
        Vt(null),
        wa(),
        ae((o) => {
          if (o === null) return rr(r);
          let s = ym(o);
          return SI(s), _(s);
        })
      );
    }
    processSegment(e, n, r, i, o, s) {
      return re(n).pipe(
        jt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            o,
            s
          ).pipe(
            Lt((c) => {
              if (c instanceof hi) return _(null);
              throw c;
            })
          )
        ),
        Xe((a) => !!a),
        Lt((a) => {
          if (gm(a)) return bI(r, i, o) ? _(new gu()) : rr(r);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, n, r, i, o, s, a) {
      return EI(r, i, o, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, o, s)
          : rr(i)
        : rr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = Eu(n, i, o);
      if (!a) return rr(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > II && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(ae((f) => this.processSegment(e, r, n, f.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, o) {
      let s = gI(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        s.pipe(
          Ne((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  Ne(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new di(
                        u,
                        f,
                        Object.freeze(v({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        MI(r),
                        vt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        _I(r)
                      ),
                      { segmentGroup: p, slicedSegments: y } = qg(n, u, d, c);
                    if (y.length === 0 && p.hasChildren())
                      return this.processChildren(l, c, p).pipe(
                        L((M) => (M === null ? null : new je(h, M)))
                      );
                    if (c.length === 0 && y.length === 0)
                      return _(new je(h, []));
                    let A = vt(r) === o;
                    return this.processSegment(l, c, p, y, A ? R : o, !0).pipe(
                      L((M) => new je(h, M instanceof je ? [M] : []))
                    );
                  })
                ))
              : rr(n)
          )
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? _({ routes: n.children, injector: e })
        : n.loadChildren
        ? n._loadedRoutes !== void 0
          ? _({ routes: n._loadedRoutes, injector: n._loadedInjector })
          : dI(e, n, r, this.urlSerializer).pipe(
              ae((i) =>
                i
                  ? this.configLoader.loadChildren(e, n).pipe(
                      le((o) => {
                        (n._loadedRoutes = o.routes),
                          (n._loadedInjector = o.injector);
                      })
                    )
                  : pI(n)
              )
            )
        : _({ routes: [], injector: e });
    }
  };
function SI(t) {
  t.sort((e, n) =>
    e.value.outlet === R
      ? -1
      : n.value.outlet === R
      ? 1
      : e.value.outlet.localeCompare(n.value.outlet)
  );
}
function TI(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function ym(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!TI(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = ym(r.children);
    e.push(new je(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function MI(t) {
  return t.data || {};
}
function _I(t) {
  return t.resolve || {};
}
function AI(t, e, n, r, i, o) {
  return ae((s) =>
    CI(t, e, n, r, s.extractedUrl, i, o).pipe(
      L(({ state: a, tree: c }) =>
        se(v({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function xI(t, e) {
  return ae((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return _(n);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of vm(c)) s.add(l);
    let a = 0;
    return re(s).pipe(
      jt((c) =>
        o.has(c)
          ? NI(c, r, t, e)
          : ((c.data = vu(c, c.parent, t).resolve), _(void 0))
      ),
      le(() => a++),
      jn(1),
      ae((c) => (a === s.size ? _(n) : Ae))
    );
  });
}
function vm(t) {
  let e = t.children.map((n) => vm(n)).flat();
  return [t, ...e];
}
function NI(t, e, n, r) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !um(i) && (o[pi] = i.title),
    RI(o, t, e, r).pipe(
      L(
        (s) => (
          (t._resolvedData = s), (t.data = vu(t, t.parent, n).resolve), null
        )
      )
    )
  );
}
function RI(t, e, n, r) {
  let i = Wl(t);
  if (i.length === 0) return _({});
  let o = {};
  return re(i).pipe(
    ae((s) =>
      OI(t[s], e, n, r).pipe(
        Xe(),
        le((a) => {
          o[s] = a;
        })
      )
    ),
    jn(1),
    Da(o),
    Lt((s) => (gm(s) ? Ae : Pn(s)))
  );
}
function OI(t, e, n, r) {
  let i = yi(e) ?? r,
    o = fr(t, i),
    s = o.resolve ? o.resolve(e, n) : ht(i, () => o(e, n));
  return Yt(s);
}
function ql(t) {
  return Ne((e) => {
    let n = t(e);
    return n ? re(n).pipe(L(() => e)) : _(e);
  });
}
var Dm = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          o = r.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === R));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[pi];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(PI), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  PI = (() => {
    let e = class e extends Dm {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Lg));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Di = new S("", { providedIn: "root", factory: () => ({}) }),
  ks = new S(""),
  bu = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = g(fs));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return _(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Yt(r.loadComponent()).pipe(
            L(wm),
            le((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            Ln(() => {
              this.componentLoaders.delete(r);
            })
          ),
          o = new On(i, () => new we()).pipe(Rn());
        return this.componentLoaders.set(r, o), o;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return _({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = FI(i, this.compiler, r, this.onLoadEndListener).pipe(
            Ln(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new On(s, () => new we()).pipe(Rn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function FI(t, e, n, r) {
  return Yt(t.loadChildren()).pipe(
    L(wm),
    ae((i) =>
      i instanceof Rr || Array.isArray(i) ? _(i) : re(e.compileModuleAsync(i))
    ),
    L((i) => {
      r && r(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(n).injector),
            (s = o.get(ks, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(wu), injector: o }
      );
    })
  );
}
function kI(t) {
  return t && typeof t == "object" && "default" in t;
}
function wm(t) {
  return kI(t) ? t.default : t;
}
var Cu = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(LI), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  LI = (() => {
    let e = class e {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, i) {
        return r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Em = new S(""),
  bm = new S("");
function jI(t, e, n) {
  let r = t.get(bm),
    i = t.get(ve);
  return t.get(G).runOutsideAngular(() => {
    if (!i.startViewTransition || r.skipNextTransition)
      return (r.skipNextTransition = !1), new Promise((l) => setTimeout(l));
    let o,
      s = new Promise((l) => {
        o = l;
      }),
      a = i.startViewTransition(() => (o(), VI(t))),
      { onViewTransitionCreated: c } = r;
    return c && ht(t, () => c({ transition: a, from: e, to: n })), s;
  });
}
function VI(t) {
  return new Promise((e) => {
    ns(e, { injector: t });
  });
}
var Iu = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new we()),
        (this.transitionAbortSubject = new we()),
        (this.configLoader = g(bu)),
        (this.environmentInjector = g(Ce)),
        (this.urlSerializer = g(gi)),
        (this.rootContexts = g(mi)),
        (this.location = g(tr)),
        (this.inputBindingEnabled = g(js, { optional: !0 }) !== null),
        (this.titleStrategy = g(Dm)),
        (this.options = g(Di, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = g(Cu)),
        (this.createViewTransition = g(Em, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => _(void 0)),
        (this.rootComponentType = null);
      let r = (o) => this.events.next(new tu(o)),
        i = (o) => this.events.next(new nu(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(
        se(v(v({}, this.transitions.value), r), { id: i })
      );
    }
    setupNavigations(r, i, o) {
      return (
        (this.transitions = new ge({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: ii,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          xe((s) => s.id !== 0),
          L((s) =>
            se(v({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Ne((s) => {
            let a = !1,
              c = !1;
            return _(s).pipe(
              Ne((l) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Ve.SupersededByNewNavigation
                    ),
                    Ae
                  );
                (this.currentTransition = s),
                  (this.currentNavigation = {
                    id: l.id,
                    initialUrl: l.rawUrl,
                    extractedUrl: l.extractedUrl,
                    trigger: l.source,
                    extras: l.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? se(v({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let u =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = l.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                if (!u && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new Kt(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        f,
                        _s.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    Ae
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return _(l).pipe(
                    Ne((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new lr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? Ae
                          : Promise.resolve(f)
                      );
                    }),
                    AI(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    le((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = se(
                          v({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new As(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: p,
                      restoredState: y,
                      extras: A,
                    } = l,
                    M = new lr(f, this.urlSerializer.serialize(h), p, y);
                  this.events.next(M);
                  let H = cm(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      se(v({}, l), {
                        targetSnapshot: H,
                        urlAfterRedirects: h,
                        extras: se(v({}, A), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    _(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new Kt(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        f,
                        _s.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    Ae
                  );
                }
              }),
              le((l) => {
                let u = new Zl(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(u);
              }),
              L(
                (l) => (
                  (this.currentTransition = s =
                    se(v({}, l), {
                      guards: W0(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              rI(this.environmentInjector, (l) => this.events.next(l)),
              le((l) => {
                if (((s.guardsResult = l.guardsResult), cr(l.guardsResult)))
                  throw fm(this.urlSerializer, l.guardsResult);
                let u = new Xl(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(u);
              }),
              xe((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Ve.GuardRejected),
                    !1)
              ),
              ql((l) => {
                if (l.guards.canActivateChecks.length)
                  return _(l).pipe(
                    le((u) => {
                      let d = new Jl(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Ne((u) => {
                      let d = !1;
                      return _(u).pipe(
                        xI(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        le({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                "",
                                Ve.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    le((u) => {
                      let d = new eu(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              ql((l) => {
                let u = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        le((h) => {
                          d.component = h;
                        }),
                        L(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...u(h));
                  return f;
                };
                return vr(u(l.targetSnapshot.root)).pipe(Vt(null), It(1));
              }),
              ql(() => this.afterPreactivation()),
              Ne(() => {
                let { currentSnapshot: l, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root
                  );
                return d ? re(d).pipe(L(() => s)) : _(s);
              }),
              L((l) => {
                let u = V0(
                  r.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    se(v({}, l), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  s
                );
              }),
              le(() => {
                this.events.next(new li());
              }),
              G0(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              It(1),
              le({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Rt(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Ca(
                this.transitionAbortSubject.pipe(
                  le((l) => {
                    throw l;
                  })
                )
              ),
              Ln(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Ve.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              Lt((l) => {
                if (((c = !0), pm(l)))
                  this.events.next(
                    new Qt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    U0(l) ? this.events.next(new ui(l.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new ci(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(r.errorHandler(l));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(u);
                  }
                }
                return Ae;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(r, i, o) {
      let s = new Qt(r.id, this.urlSerializer.serialize(r.extractedUrl), i, o);
      this.events.next(s), r.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function $I(t) {
  return t !== ii;
}
var BI = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(UI), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  yu = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, n) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, n) {
      return e.routeConfig === n.routeConfig;
    }
  },
  UI = (() => {
    let e = class e extends yu {};
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = Hc(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Cm = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(HI), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  HI = (() => {
    let e = class e extends Cm {
      constructor() {
        super(...arguments),
          (this.location = g(tr)),
          (this.urlSerializer = g(gi)),
          (this.options = g(Di, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = g(Cu)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Wt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = cm(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && r(i.url, i.state);
        });
      }
      handleRouterEvent(r, i) {
        if (r instanceof lr) this.stateMemento = this.createStateMemento();
        else if (r instanceof Kt) this.rawUrlTree = i.initialUrl;
        else if (r instanceof As) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          r instanceof li
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Qt &&
              (r.code === Ve.GuardRejected || r.code === Ve.NoDataFromResolver)
            ? this.restoreHistory(i)
            : r instanceof ci
            ? this.restoreHistory(i, !0)
            : r instanceof Rt &&
              ((this.lastSuccessfulId = r.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let o = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = v(v({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = v(
            v({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r };
      }
    };
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = Hc(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ni = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(ni || {});
function Im(t, e) {
  t.events
    .pipe(
      xe(
        (n) =>
          n instanceof Rt ||
          n instanceof Qt ||
          n instanceof ci ||
          n instanceof Kt
      ),
      L((n) =>
        n instanceof Rt || n instanceof Kt
          ? ni.COMPLETE
          : (
              n instanceof Qt
                ? n.code === Ve.Redirect ||
                  n.code === Ve.SupersededByNewNavigation
                : !1
            )
          ? ni.REDIRECTING
          : ni.FAILED
      ),
      xe((n) => n !== ni.REDIRECTING),
      It(1)
    )
    .subscribe(() => {
      e();
    });
}
function zI(t) {
  throw t;
}
var qI = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  GI = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  En = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = g(cs)),
          (this.stateManager = g(Cm)),
          (this.options = g(Di, { optional: !0 }) || {}),
          (this.pendingTasks = g(zr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = g(Iu)),
          (this.urlSerializer = g(gi)),
          (this.location = g(tr)),
          (this.urlHandlingStrategy = g(Cu)),
          (this._events = new we()),
          (this.errorHandler = this.options.errorHandler || zI),
          (this.navigated = !1),
          (this.routeReuseStrategy = g(BI)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = g(ks, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!g(js, { optional: !0 })),
          (this.eventsSubscription = new ce()),
          (this.isNgZoneEnabled = g(G) instanceof G && G.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Qt &&
                  i.code !== Ve.Redirect &&
                  i.code !== Ve.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Rt) this.navigated = !0;
              else if (i instanceof ui) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || $I(o.source),
                  };
                this.scheduleNavigation(a, ii, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            QI(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              ii,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(r, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let l = v({}, o);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (s.state = l);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(wu)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = v(v({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = im(h);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (f = this.currentUrlTree.root);
        }
        return om(f, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let o = cr(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, ii, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return WI(r), this.navigateByUrl(this.createUrlTree(r, i), i);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(r, i) {
        let o;
        if (
          (i === !0 ? (o = v({}, qI)) : i === !1 ? (o = v({}, GI)) : (o = i),
          cr(r))
        )
          return $g(this.currentUrlTree, r, o);
        let s = this.parseUrl(r);
        return $g(this.currentUrlTree, s, o);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(r, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((f, h) => {
              (c = f), (l = h);
            }));
        let d = this.pendingTasks.add();
        return (
          Im(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: s,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function WI(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new m(4008, !1);
}
function QI(t) {
  return !(t instanceof li) && !(t instanceof ui);
}
var Ls = class {};
var KI = (() => {
    let e = class e {
      constructor(r, i, o, s, a) {
        (this.router = r),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            xe((r) => r instanceof Rt),
            jt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(r, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = rs(s.providers, r, `Route: ${s.path}`));
          let a = s._injector ?? r,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return re(o).pipe(Fn());
      }
      preloadConfig(r, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(r, i))
            : (o = _(null));
          let s = o.pipe(
            ae((a) =>
              a === null
                ? _(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? r, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return re([s, a]).pipe(Fn());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(En), E(fs), E(Ce), E(Ls), E(bu));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Sm = new S(""),
  YI = (() => {
    let e = class e {
      constructor(r, i, o, s, a = {}) {
        (this.urlSerializer = r),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (this.environmentInjector = g(Ce)),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof lr
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = r.navigationTrigger),
              (this.restoredId = r.restoredState
                ? r.restoredState.navigationId
                : 0))
            : r instanceof Rt
            ? ((this.lastId = r.id),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.urlAfterRedirects).fragment
              ))
            : r instanceof Kt &&
              r.code === _s.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof xs &&
            (r.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(r.position)
              : r.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(r.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(r, i) {
        this.zone.runOutsideAngular(() =>
          Ri(this, null, function* () {
            yield new Promise((o) => {
              setTimeout(() => {
                o();
              }),
                ns(
                  () => {
                    o();
                  },
                  { injector: this.environmentInjector }
                );
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new xs(
                    r,
                    this.lastSource === "popstate"
                      ? this.store[this.restoredId]
                      : null,
                    i
                  )
                );
              });
          })
        );
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      pp();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function ZI(t) {
  return t.routerState.root;
}
function wi(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function XI() {
  let t = g(st);
  return (e) => {
    let n = t.get(xt);
    if (e !== n.components[0]) return;
    let r = t.get(En),
      i = t.get(Tm);
    t.get(Su) === 1 && r.initialNavigation(),
      t.get(Mm, null, O.Optional)?.setUpPreloading(),
      t.get(Sm, null, O.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Tm = new S("", { factory: () => new we() }),
  Su = new S("", { providedIn: "root", factory: () => 1 });
function JI() {
  return wi(2, [
    { provide: Su, useValue: 0 },
    {
      provide: ds,
      multi: !0,
      deps: [st],
      useFactory: (e) => {
        let n = e.get(pg, Promise.resolve());
        return () =>
          n.then(
            () =>
              new Promise((r) => {
                let i = e.get(En),
                  o = e.get(Tm);
                Im(i, () => {
                  r(!0);
                }),
                  (e.get(Iu).afterPreactivation = () => (
                    r(!0), o.closed ? _(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function eS() {
  return wi(3, [
    {
      provide: ds,
      multi: !0,
      useFactory: () => {
        let e = g(En);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Su, useValue: 2 },
  ]);
}
var Mm = new S("");
function tS(t) {
  return wi(0, [
    { provide: Mm, useExisting: KI },
    { provide: Ls, useExisting: t },
  ]);
}
function nS() {
  return wi(8, [zg, { provide: js, useExisting: zg }]);
}
function rS(t) {
  let e = [
    { provide: Em, useValue: jI },
    {
      provide: bm,
      useValue: v({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return wi(9, e);
}
var Gg = new S("ROUTER_FORROOT_GUARD"),
  iS = [
    tr,
    { provide: gi, useClass: si },
    En,
    mi,
    { provide: ur, useFactory: ZI, deps: [En] },
    bu,
    [],
  ],
  Tu = (() => {
    let e = class e {
      constructor(r) {}
      static forRoot(r, i) {
        return {
          ngModule: e,
          providers: [
            iS,
            [],
            { provide: ks, multi: !0, useValue: r },
            { provide: Gg, useFactory: cS, deps: [[En, new Lo(), new Tc()]] },
            { provide: Di, useValue: i || {} },
            i?.useHash ? sS() : aS(),
            oS(),
            i?.preloadingStrategy ? tS(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? lS(i) : [],
            i?.bindToComponentInputs ? nS().ɵproviders : [],
            i?.enableViewTransitions ? rS().ɵproviders : [],
            uS(),
          ],
        };
      }
      static forChild(r) {
        return {
          ngModule: e,
          providers: [{ provide: ks, multi: !0, useValue: r }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Gg, 8));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })();
function oS() {
  return {
    provide: Sm,
    useFactory: () => {
      let t = g(Dg),
        e = g(G),
        n = g(Di),
        r = g(Iu),
        i = g(gi);
      return (
        n.scrollOffset && t.setOffset(n.scrollOffset), new YI(i, r, t, e, n)
      );
    },
  };
}
function sS() {
  return { provide: vn, useClass: mg };
}
function aS() {
  return { provide: vn, useClass: Ml };
}
function cS(t) {
  return "guarded";
}
function lS(t) {
  return [
    t.initialNavigation === "disabled" ? eS().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? JI().ɵproviders : [],
  ];
}
var Wg = new S("");
function uS() {
  return [
    { provide: Wg, useFactory: XI },
    { provide: er, multi: !0, useExisting: Wg },
  ];
}
var dS = [],
  _m = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({ imports: [Tu.forRoot(dS), Tu] }));
    let t = e;
    return t;
  })();
var Dt = (() => {
  let e = class e {
    constructor(r, i) {
      (this.platformId = r),
        (this.ngZone = i),
        (this.isVisible = !1),
        (this.isSticky = !1);
    }
    onAppear() {
      (this.isVisible = !0), console.log("service" + this.isVisible);
    }
    open(r) {
      Se(this.platformId)
        ? window.open(r, "_blank")
        : console.warn("Attempted to open a URL on the server side.");
    }
    updateSticky(r) {
      (this.isSticky = r >= 600), console.log("Sticky status:", this.isSticky);
    }
    onScroll() {
      return new U((r) => {
        if (Se(this.platformId)) {
          let i = (o) => this.ngZone.run(() => r.next(o));
          return (
            this.ngZone.runOutsideAngular(() => {
              window.addEventListener("scroll", i);
            }),
            () => {
              window.removeEventListener("scroll", i);
            }
          );
        } else return r.next(null), () => {};
      });
    }
    onResize() {
      return new U((r) => {
        if (Se(this.platformId)) {
          let i = (o) => this.ngZone.run(() => r.next(o));
          return (
            this.ngZone.runOutsideAngular(() => {
              window.addEventListener("resize", i);
            }),
            () => {
              window.removeEventListener("resize", i);
            }
          );
        } else return r.next(null), () => {};
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(oe), E(G));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var fS = (t) => ({ sticky: t }),
  Am = (() => {
    let e = class e {
      constructor(r, i) {
        (this.platformId = r), (this.portfolioServ = i), (this.isSticky = !1);
      }
      ngOnInit() {
        Se(this.platformId) &&
          (this.scrollSubscription = this.portfolioServ
            .onScroll()
            .subscribe(() => {
              let r =
                window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
              this.portfolioServ.updateSticky(r),
                (this.isSticky = this.portfolioServ.isSticky);
            }));
      }
      ngOnDestroy() {
        this.scrollSubscription && this.scrollSubscription.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(oe), X(Dt));
    }),
      (e.ɵcmp = ie({
        type: e,
        selectors: [["app-navbar"]],
        decls: 17,
        vars: 3,
        consts: [
          [
            1,
            "navbar",
            "navbar-expand-lg",
            "navbar-dark",
            "bg-darkblue-main",
            3,
            "ngClass",
          ],
          [1, "container-fluid"],
          ["href", "#", 1, "margin-left-70", "logo", "d-inline-block"],
          [
            "src",
            "assets/logo/sn-logo-zip-file (1)/png/logo-no-background.png",
            "alt",
            "Logo con una finestra browser contenente un piccolo ingranaggio e parentesi angolari, e al di sotto le iniziali sn",
          ],
          [
            "type",
            "button",
            "data-bs-toggle",
            "collapse",
            "data-bs-target",
            "#navbarSupportedContent",
            "aria-controls",
            "navbarSupportedContent",
            "aria-expanded",
            "false",
            "aria-label",
            "Toggle navigation",
            1,
            "navbar-toggler",
          ],
          [1, "navbar-toggler-icon"],
          [
            "id",
            "navbarSupportedContent",
            1,
            "collapse",
            "navbar-collapse",
            "me-md-5",
            "fs-4to5",
          ],
          [
            1,
            "navbar-nav",
            "mt-2",
            "mt-lg-0",
            "ms-auto",
            "mx-5",
            "text-dark",
            "rounded",
          ],
          [
            1,
            "nav-item",
            "px-3",
            "rounded-start",
            "bg-light-green",
            "border-end-blue",
          ],
          ["href", "#skills", 1, "nav-link"],
          [1, "nav-item", "px-3", "bg-light-green", "border-end-blue"],
          ["href", "#projects", 1, "nav-link"],
          [
            1,
            "nav-item",
            "px-3",
            "bg-light-green",
            "border-end-blue",
            "rounded-end",
          ],
          ["href", "#cv", 1, "nav-link"],
        ],
        template: function (i, o) {
          i & 1 &&
            (C(0, "nav", 0)(1, "div", 1)(2, "a", 2),
            Y(3, "img", 3),
            T(),
            C(4, "button", 4),
            Y(5, "span", 5),
            T(),
            C(6, "div", 6)(7, "ul", 7)(8, "li", 8)(9, "a", 9),
            P(10, "Skills"),
            T()(),
            C(11, "li", 10)(12, "a", 11),
            P(13, "Projects"),
            T()(),
            C(14, "li", 12)(15, "a", 13),
            P(16, "Curriculum"),
            T()()()()()()),
            i & 2 && Ie("ngClass", Jn(1, fS, o.isSticky));
        },
        dependencies: [nr],
        styles: [
          "nav[_ngcontent-%COMP%]{padding:1.5rem 0 0}.sticky[_ngcontent-%COMP%]{position:sticky;top:0;left:0;width:100%;opacity:1;z-index:1000;background-color:#030f1896;box-shadow:0 4px 6px #0000001a;transition:all .5s ease-in-out;animation:_ngcontent-%COMP%_opacity .5s;padding:1.5rem 0}@keyframes _ngcontent-%COMP%_opacity{0%{opacity:0}to{opacity:1}}.sticky[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{transform:scale(.8);transition:transform .5s ease-in-out}.nav-item[_ngcontent-%COMP%]{transform:all .3s}nav[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%]{color:var(--darkblue-palette)}.nav-item[_ngcontent-%COMP%]:hover, .nav-item[_ngcontent-%COMP%]:active{background-color:transparent;cursor:pointer;box-shadow:#a0faa333 0 0 24px,#a0faa333 0 0 39px,#a0faa333 0 0 60px}.nav-item[_ngcontent-%COMP%]:hover   .nav-link[_ngcontent-%COMP%]{color:var(--light-green);text-decoration:none}.fw-600[_ngcontent-%COMP%]{font-weight:600;letter-spacing:1.2px}.fs-4to5[_ngcontent-%COMP%]{font-size:1.3rem}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:43px;height:auto}@media (min-width: 62em){.collapse[_ngcontent-%COMP%]{display:flex;justify-content:center}}@media (max-width: 62em){.container-fluid[_ngcontent-%COMP%]{position:relative}.navbar-collapse[_ngcontent-%COMP%]{position:absolute;top:-12px;right:35px}.nav-item[_ngcontent-%COMP%]{border:solid .2px var(--darkblue-palette)!important;border-radius:0%!important}.navbar-toggler[_ngcontent-%COMP%]{border:1px solid var(--light-green);color:var(--light-green)}.navbar-toggler[_ngcontent-%COMP%]:active{border:1.5px solid var(--light-green);color:var(--light-green)}.navbar-toggler-icon[_ngcontent-%COMP%]{color:var(--light-green)}}@media (max-width: 36em){.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:30px;margin-right:auto}}",
        ],
      }));
    let t = e;
    return t;
  })();
var xm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-hero"]],
      decls: 13,
      vars: 0,
      consts: [
        [
          1,
          "bg-darkblue-main",
          "heightHero",
          "d-flex",
          "align-items-center",
          "justify-content-center",
        ],
        [1, "row", "heroContent"],
        [1, "col-12", "col-md-5"],
        [1, "name", "pb-2", "mb-4"],
        [1, "sub"],
        [1, "sub", "pb-5"],
        [1, "col-9", "col-md-4", "mx-2"],
        [
          "src",
          "assets/laptop-2298286_640 2- Copia.png",
          "alt",
          "Disegno con un laptop, una lampada e un cactus",
          1,
          "imgHero",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "section", 0)(1, "div")(2, "div", 1)(3, "div", 2)(4, "h1", 3),
          P(5, "Stefania Neri"),
          T(),
          C(6, "div")(7, "h1", 4),
          P(8, "Junior Full Stack Developer"),
          T(),
          C(9, "h1", 5),
          P(10, "QA Tester"),
          T()()(),
          C(11, "div", 6),
          Y(12, "img", 7),
          T()()()());
      },
      styles: [
        ".heightHero[_ngcontent-%COMP%]{height:calc(100vh - 77.31px)}.heroContent[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-around;border:2px solid var(--light-green);padding:8rem;border-radius:3%;background-image:linear-gradient(180deg,var(--darkblue-palette),#154755)}.name[_ngcontent-%COMP%]{font-size:4.6rem;color:var(--light-green)}.sub[_ngcontent-%COMP%]{font-size:2rem;color:#a0faa3c4}.imgHero[_ngcontent-%COMP%]{height:auto;width:100%}@media (max-width: 87.5em){.name[_ngcontent-%COMP%]{font-size:4.5rem}.sub[_ngcontent-%COMP%]{font-size:2.5rem}}@media (max-width: 62em){.name[_ngcontent-%COMP%]{font-size:3.5rem}.sub[_ngcontent-%COMP%]{font-size:1.7rem}}@media (max-width: 48em){.name[_ngcontent-%COMP%]{text-align:center;margin-top:2rem}.sub[_ngcontent-%COMP%]{text-align:center}.imgHero[_ngcontent-%COMP%]{padding-bottom:2rem}}@media (max-width: 36em){.heightHero[_ngcontent-%COMP%]{height:auto}.heroContent[_ngcontent-%COMP%]{justify-content:center}.imgHero[_ngcontent-%COMP%]{padding-bottom:2rem}}",
      ],
    }));
  let t = e;
  return t;
})();
var Nm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-skill"]],
      inputs: { skill: "skill" },
      decls: 8,
      vars: 7,
      consts: [
        [
          1,
          "card",
          "effectUp",
          "effectGlimmer",
          "rounded",
          "border-light-green",
          "bg-darkblue-main",
          "text-white",
        ],
        [1, "card-body", "pt-1", "pb-2", "pt-md-4", "pb-md-3", "text-center"],
        ["height", "70", "width", "70", 3, "src", "alt"],
        ["id", "linguaggio", 1, "card-title", "pt-md-2", "pb-md-3"],
        ["aria-labelledby", "linguaggio", 1, "progress", "prgparent"],
        [
          "role",
          "progressbar",
          "aria-valuemin",
          "0",
          "aria-valuemax",
          "100",
          1,
          "progress-bar",
          "pgbar",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "div", 0)(1, "div", 1),
          Y(2, "img", 2),
          C(3, "div")(4, "h5", 3),
          P(5),
          T(),
          C(6, "div", 4),
          Y(7, "div", 5),
          T()()()()),
          i & 2 &&
            (Le(2),
            hl("src", o.skill.src, rp),
            ss("alt", "", o.skill.linguaggio, " logo"),
            Le(3),
            pl(o.skill.linguaggio),
            Le(2),
            os("width", o.skill.progress, "%"),
            is("aria-valuenow", o.skill.progress));
      },
      styles: [
        ".prgparent[_ngcontent-%COMP%]{background-color:#0a1623;border-radius:0;border:1px solid var(--light-green)}.pgbar[_ngcontent-%COMP%]{background-color:var(--light-green);box-shadow:#a0faa333 0 0 24px,#a0faa333 0 0 39px,#a0faa333 0 0 60px}@media (max-width: 36em){.card-body[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:stretch}.prgparent[_ngcontent-%COMP%]{width:100%}.border-light-green[_ngcontent-%COMP%]{border:1px solid var(--light-green)}}",
      ],
    }));
  let t = e;
  return t;
})();
var Rm = (() => {
  let e = class e {
    constructor(r, i, o) {
      (this.element = r),
        (this.platformId = i),
        (this.portfolioServ = o),
        (this.appear = new me());
    }
    saveDimensions() {
      typeof window < "u" &&
        ((this.elementPos = this.getOffsetTop(this.element.nativeElement)),
        (this.elementHeight = this.element.nativeElement.offsetHeight),
        (this.windowHeight = window.innerHeight));
    }
    saveScrollPos() {
      typeof window < "u" && (this.scrollPos = window.scrollY);
    }
    getOffsetTop(r) {
      let i = r.offsetTop || 0;
      return r.offsetParent && (i += this.getOffsetTop(r.offsetParent)), i;
    }
    checkVisibility() {
      this.isVisible() &&
        (this.saveDimensions(),
        this.isVisible() && (this.unsubscribe(), this.appear.emit(null)));
    }
    isVisible() {
      return this.scrollPos + this.windowHeight >= this.elementPos;
    }
    subscribeToScroll() {
      Se(this.platformId) &&
        (this.subscriptionScroll = this.portfolioServ
          .onScroll()
          .subscribe((r) => {
            console.log("Scroll position:", r), this.checkVisibility();
          }));
    }
    subscribeToResize() {
      Se(this.platformId) &&
        (this.subscriptionResize = this.portfolioServ
          .onResize()
          .subscribe(() => {
            this.checkVisibility();
          }));
    }
    unsubscribe() {
      this.subscriptionScroll && this.subscriptionScroll.unsubscribe(),
        this.subscriptionResize && this.subscriptionResize.unsubscribe();
    }
    ngAfterViewInit() {
      this.subscribeToScroll(), this.subscribeToResize();
    }
    ngOnDestroy() {
      this.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X(pn), X(oe), X(Dt));
  }),
    (e.ɵdir = hn({
      type: e,
      selectors: [["", "appear", ""]],
      outputs: { appear: "appear" },
    }));
  let t = e;
  return t;
})();
var yS = (t) => ({ "slide-in": t });
function vS(t, e) {
  if ((t & 1 && Y(0, "app-skill", 10), t & 2)) {
    let n = e.$implicit;
    Ie("skill", n);
  }
}
function DS(t, e) {
  if ((t & 1 && Y(0, "app-skill", 10), t & 2)) {
    let n = e.$implicit;
    Ie("skill", n);
  }
}
function wS(t, e) {
  if ((t & 1 && Y(0, "app-skill", 11), t & 2)) {
    let n = e.$implicit;
    Ie("skill", n);
  }
}
var Om = (() => {
  let e = class e {
    constructor(r, i) {
      (this.portfolioServ = r),
        (this.cdr = i),
        (this.isVisible = !1),
        (this.listaSkillFE = [
          {
            linguaggio: "HTML5",
            src: "https://img.icons8.com/plasticine/200/html-5.png",
            progress: "85",
          },
          {
            linguaggio: "CSS3",
            src: "https://img.icons8.com/plasticine/200/css3.png",
            progress: "70",
          },
          {
            linguaggio: "JavaScript",
            src: "https://img.icons8.com/fluency/96/javascript.png",
            progress: "60",
          },
          {
            linguaggio: "Bootstrap",
            src: "https://img.icons8.com/color/96/bootstrap--v2.png",
            progress: "65",
          },
          {
            linguaggio: "Angular",
            src: "https://img.icons8.com/fluency/96/angularjs.png",
            progress: "40",
          },
        ]),
        (this.listaSkillBE = [
          {
            linguaggio: "Java",
            src: "https://img.icons8.com/nolan/100/java-coffee-cup-logo.png",
            progress: "38",
          },
          {
            linguaggio: "Spring Boot",
            src: "https://img.icons8.com/color/96/spring-logo.png",
            progress: "37",
          },
          {
            linguaggio: "MySQL",
            src: "https://img.icons8.com/external-those-icons-flat-those-icons/96/external-MySQL-programming-and-development-those-icons-flat-those-icons.png",
            progress: "40",
          },
        ]),
        (this.listaSkillTesting = [
          { linguaggio: "Appium", src: "", progress: "85" },
          { linguaggio: "Gherkin", src: "", progress: "85" },
          { linguaggio: "Cucumber", src: "", progress: "85" },
        ]),
        (this.listaSkillMisc = [
          {
            linguaggio: "Git",
            src: "https://img.icons8.com/nolan/100/git.png",
            progress: "40",
          },
          {
            linguaggio: "Npm",
            src: "https://img.icons8.com/color/96/npm.png",
            progress: "40",
          },
        ]);
    }
    onAppear() {
      this.portfolioServ.onAppear();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X(Dt), X(mn));
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-skills"]],
      decls: 17,
      vars: 6,
      consts: [
        ["id", "skills", 1, "py-5", "bg-skill", "border-se-green"],
        [1, "container", 3, "appear", "ngClass"],
        [1, "text-center", "pt-md-5", "mb-2", "skillsTitle"],
        [1, "mt-md-5", "text-center", "subTitle"],
        [
          "role",
          "list",
          1,
          "row",
          "pb-4",
          "d-flex",
          "justify-content-center",
          "align-items-center",
        ],
        [
          "role",
          "listitem",
          "class",
          "col-8 col-sm-4 col-lg-2 mt-4 mt-md-5 mx-1 ",
          3,
          "skill",
          4,
          "ngFor",
          "ngForOf",
        ],
        [1, "mt-5", "text-center", "subTitle"],
        [
          "role",
          "listitem",
          "class",
          "col-8 col-sm-4 col-lg-2 mt-4 mt-md-5 mx-1",
          3,
          "skill",
          4,
          "ngFor",
          "ngForOf",
        ],
        [
          "role",
          "list",
          1,
          "row",
          "pb-5",
          "d-flex",
          "justify-content-center",
          "align-items-center",
        ],
        [
          "role",
          "listitem",
          "class",
          "col-6 col-sm-4 col-lg-2 my-4 my-md-5 mx-1",
          3,
          "skill",
          4,
          "ngFor",
          "ngForOf",
        ],
        [
          "role",
          "listitem",
          1,
          "col-8",
          "col-sm-4",
          "col-lg-2",
          "mt-4",
          "mt-md-5",
          "mx-1",
          3,
          "skill",
        ],
        [
          "role",
          "listitem",
          1,
          "col-6",
          "col-sm-4",
          "col-lg-2",
          "my-4",
          "my-md-5",
          "mx-1",
          3,
          "skill",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "section", 0)(1, "div", 1),
          Xn("appear", function () {
            return o.onAppear();
          }),
          C(2, "div", 2)(3, "h1"),
          P(4, "Skills"),
          T()(),
          C(5, "h2", 3),
          P(6, "Frontend"),
          T(),
          C(7, "div", 4),
          Wr(8, vS, 1, 1, "app-skill", 5),
          T(),
          C(9, "h2", 6),
          P(10, "Backend"),
          T(),
          C(11, "div", 4),
          Wr(12, DS, 1, 1, "app-skill", 7),
          T(),
          C(13, "h2", 6),
          P(14, "Miscellaneous"),
          T(),
          C(15, "div", 8),
          Wr(16, wS, 1, 1, "app-skill", 9),
          T()()()),
          i & 2 &&
            (Le(),
            Ie("ngClass", Jn(4, yS, o.isVisible)),
            Le(7),
            Ie("ngForOf", o.listaSkillFE),
            Le(4),
            Ie("ngForOf", o.listaSkillBE),
            Le(4),
            Ie("ngForOf", o.listaSkillMisc));
      },
      dependencies: [nr, yg, Nm, Rm],
      styles: [
        ".bg-skill[_ngcontent-%COMP%]{background-color:#051d2c}.container[_ngcontent-%COMP%]   .slide-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideIn 4s forwards}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(120%)!important;opacity:0}to{transform:translate(0)!important;opacity:1}}@media (max-width: 36em){.subTitle[_ngcontent-%COMP%]{font-size:1.7rem;margin-top:1rem}.row[_ngcontent-%COMP%]{margin:0}}",
      ],
    }));
  let t = e;
  return t;
})();
var Pm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-projects"]],
      decls: 35,
      vars: 0,
      consts: [
        ["id", "projects", 1, "py-5", "bg-prj", "border-setop-green"],
        [1, "container"],
        [1, "text-center", "pb-md-4", "pt-md-5", "mb-2"],
        [1, "row", "pb-5"],
        [1, "col-12", "px-md-5", "d-flex", "justify-content-center"],
        [1, "card", "my-5", "effectGlimmerHover", "effectGlimmer"],
        [
          "src",
          "assets/pexels-donaldtong94-109669.jpg",
          "alt",
          "Vista di un teatro dal punto di vista di uno spettatore",
          "loading",
          "lazy",
          1,
          "card-img-top",
        ],
        [1, "card-body", "p-4", "bg-lightgreen-gradient"],
        [1, "card-title", "fs-3", "pb-2"],
        [1, "fs-5"],
        [1, "card-text", "fs-4"],
        ["href", "#"],
        [1, "fs-4", "mb-0"],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h1"),
          P(4, "Projects"),
          T()(),
          C(5, "div", 3)(6, "div", 4)(7, "div", 5),
          Y(8, "img", 6),
          C(9, "div", 7)(10, "h4", 8),
          P(11, "Theater Box Office"),
          T(),
          C(12, "p", 9),
          P(
            13,
            "As part of a simulated project I created a platform that offers a catalog of shows available for booking. Users must log in to select and book a show, then are redirected to a page for payment and ticket purchase confirmation. User registrations and purchased tickets are stored in the fictional theater company\u2019s database."
          ),
          T(),
          C(14, "p", 10),
          P(15, "Source code: "),
          C(16, "a", 11),
          P(17, "Theater Box Office repository"),
          T()(),
          C(18, "p", 12),
          P(19, "Made with:"),
          T(),
          C(20, "ul")(21, "li"),
          P(22, "Java"),
          T(),
          C(23, "li"),
          P(24, "SpringBoot"),
          T(),
          C(25, "li"),
          P(26, "Hibernate"),
          T(),
          C(27, "li"),
          P(28, "MySQL"),
          T(),
          C(29, "li"),
          P(30, "JavaScript"),
          T(),
          C(31, "li"),
          P(32, "HTML"),
          T(),
          C(33, "li"),
          P(34, "CSS"),
          T()()()()()()()());
      },
      styles: [
        ".bg-prj[_ngcontent-%COMP%]{background-color:#031017}.card[_ngcontent-%COMP%]{max-width:60%}@media (max-width: 36em){.card[_ngcontent-%COMP%]{width:100%}}",
      ],
    }));
  let t = e;
  return t;
})();
var Fm = (() => {
  let e = class e {
    constructor(r, i) {
      (this.platformId = r),
        (this.portfolioServ = i),
        (this.urlCV = "assets/CV Stefania Neri.pdf");
    }
    openCV() {
      Se(this.platformId) &&
        (console.log("Open cv ts:", this.urlCV),
        this.portfolioServ.open(this.urlCV));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X(oe), X(Dt));
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-curriculum"]],
      decls: 6,
      vars: 0,
      consts: [
        [1, "bg-lightgreen-gradient-cv", "border-tb-orange"],
        ["id", "cv", 1, "container", "py-5", "text-center"],
        [1, "dark-text", "pb-3", "pt-5"],
        [1, "btn-cv", "rounded", "px-4", "py-4", "fs-3", "mb-5", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "div", 0)(1, "div", 1)(2, "h2", 2),
          P(3, "Curriculum"),
          T(),
          C(4, "button", 3),
          Xn("click", function () {
            return o.openCV();
          }),
          P(5, " Get my CV for more info "),
          T()()());
      },
      styles: [
        ".btn-cv[_ngcontent-%COMP%]{border:1px solid var(--sand-palette);background-color:var(--darkblue-palette);color:var(--light-green);transition:all .7s}.bg-lightgreen-gradient-cv[_ngcontent-%COMP%]{background-image:linear-gradient(180deg,#a0faa3e4,#e1f4e1d2)}.btn-cv[_ngcontent-%COMP%]:hover, .btn-cv[_ngcontent-%COMP%]:active{background-image:linear-gradient(180deg,#8df390,#d4f6d5da);color:var(--darkblue-palette);font-weight:600;border-color:var(--darkgreen);box-shadow:#a0faa395 0 0 60px,#a0faa395 0 0 60px,#a0faa395 0 0 60px;transition:all .3s}@media (max-width: 36em){.btn-cv[_ngcontent-%COMP%]{box-shadow:#030f1800 0 0 24px,#030f1800 0 0 39px,#030f1833 0 0 60px}}",
      ],
    }));
  let t = e;
  return t;
})();
var km = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-contacts"]],
      decls: 0,
      vars: 0,
      template: function (i, o) {},
    }));
  let t = e;
  return t;
})();
var Lm = (() => {
  let e = class e {
    constructor() {
      this.currentDate = new Date();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-footer"]],
      decls: 17,
      vars: 1,
      consts: [
        [
          1,
          "mt-auto",
          "bg-darkblue-main",
          "text-center",
          "custom-shadow",
          "py-4",
          "d-flex",
        ],
        [1, "container", "d-flex", "flex-column", "align-items-center"],
        [1, "fs-3", "py-2"],
        [1, "py-2"],
        ["href", "mailto:stefania.neri.92@gmail.com"],
        [1, "d-flex", "align-items-center"],
        ["name", "location-outline", 1, "me-1"],
        [1, "d-flex", "text-center", "justify-content-center", "mt-2", "py-3"],
        [
          "href",
          "https://www.linkedin.com/in/stefania-neri/",
          "target",
          "_blank",
          "aria-label",
          "Visita il profilo Linkedin",
          1,
          "bg-light-green",
          "rounded-3",
          "effectGlimmerHoverIcons",
        ],
        [
          "width",
          "40",
          "height",
          "40",
          "src",
          "https://img.icons8.com/ios/50/linkedin.png",
          "alt",
          "Linkedin icon",
        ],
        [
          "href",
          "https://github.com/StefaniaNeri",
          "target",
          "_blank",
          "aria-label",
          "Visita il profilo Github",
          1,
          "bg-light-green",
          "rounded-3",
          "mx-2",
          "effectGlimmerHoverIcons",
        ],
        [
          "width",
          "40",
          "height",
          "40",
          "src",
          "https://img.icons8.com/ios/50/github--v1.png",
          "alt",
          "Github icon",
        ],
        [
          "href",
          "https://www.instagram.com/stefanianeri7/",
          "target",
          "_blank",
          "aria-label",
          "Visita il profilo Instagram",
          1,
          "bg-light-green",
          "rounded-3",
          "effectGlimmerHoverIcons",
        ],
        [
          "width",
          "40",
          "height",
          "40",
          "src",
          "https://img.icons8.com/ios/50/instagram-new--v1.png",
          "alt",
          "Instagram icon",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "footer", 0)(1, "div", 1)(2, "div", 2),
          P(3),
          T(),
          C(4, "div", 3)(5, "a", 4),
          P(6, "stefania.neri.92@gmail.com"),
          T()(),
          C(7, "div", 5),
          Y(8, "ion-icon", 6),
          P(9, " Torino, Italy "),
          T(),
          C(10, "div", 7)(11, "a", 8),
          Y(12, "img", 9),
          T(),
          C(13, "a", 10),
          Y(14, "img", 11),
          T(),
          C(15, "a", 12),
          Y(16, "img", 13),
          T()()()()),
          i & 2 &&
            (Le(3), as("\xA9 ", o.currentDate.getFullYear(), " Stefania Neri"));
      },
      styles: [
        ".custom-shadow[_ngcontent-%COMP%]{box-shadow:0 -3px 9px #00000f80}ion-icon[_ngcontent-%COMP%]{color:var(--light-green)}",
      ],
    }));
  let t = e;
  return t;
})();
var jm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ie({
      type: e,
      selectors: [["app-about-me"]],
      decls: 0,
      vars: 0,
      template: function (i, o) {},
      styles: [
        ".bg-about[_ngcontent-%COMP%]{background-color:var(--sand-palette)}",
      ],
    }));
  let t = e;
  return t;
})();
var MS = (t) => ({ "back-to-top": t }),
  Vm = (() => {
    let e = class e {
      constructor(r, i) {
        (this.platformId = r),
          (this.portfolioServ = i),
          (this.titleParent = "sn"),
          (this.isVisible = !1),
          (this.isSticky = !1);
      }
      onAppear() {
        (this.isVisible = !0), console.log("Visible: " + this.isVisible);
      }
      ngOnInit() {
        Se(this.platformId) &&
          (this.scrollSubscription = this.portfolioServ
            .onScroll()
            .subscribe(() => {
              let r =
                window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
              this.portfolioServ.updateSticky(r),
                (this.isSticky = this.portfolioServ.isSticky);
            }));
      }
      ngOnDestroy() {
        this.scrollSubscription && this.scrollSubscription.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(oe), X(Dt));
    }),
      (e.ɵcmp = ie({
        type: e,
        selectors: [["app-root"]],
        decls: 11,
        vars: 4,
        consts: [
          [3, "titleSN"],
          ["href", "#", 3, "ngClass"],
          [1, "material-icons"],
        ],
        template: function (i, o) {
          i & 1 &&
            (Y(0, "app-navbar", 0)(1, "app-hero")(2, "app-skills")(
              3,
              "app-projects"
            )(4, "app-curriculum")(5, "app-about-me")(6, "app-contacts"),
            C(7, "a", 1)(8, "span", 2),
            P(9, " keyboard_arrow_up "),
            T()(),
            Y(10, "app-footer")),
            i & 2 &&
              (Ie("titleSN", o.titleParent),
              Le(7),
              Ie("ngClass", Jn(2, MS, o.isSticky)));
        },
        dependencies: [nr, Am, xm, Om, Pm, Fm, km, Lm, jm],
        styles: [
          ".slide-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideIn 4s forwards}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(120%)!important;opacity:0}to{transform:translate(0)!important;opacity:1}}",
        ],
      }));
    let t = e;
    return t;
  })();
var F = (function (t) {
    return (
      (t[(t.State = 0)] = "State"),
      (t[(t.Transition = 1)] = "Transition"),
      (t[(t.Sequence = 2)] = "Sequence"),
      (t[(t.Group = 3)] = "Group"),
      (t[(t.Animate = 4)] = "Animate"),
      (t[(t.Keyframes = 5)] = "Keyframes"),
      (t[(t.Style = 6)] = "Style"),
      (t[(t.Trigger = 7)] = "Trigger"),
      (t[(t.Reference = 8)] = "Reference"),
      (t[(t.AnimateChild = 9)] = "AnimateChild"),
      (t[(t.AnimateRef = 10)] = "AnimateRef"),
      (t[(t.Query = 11)] = "Query"),
      (t[(t.Stagger = 12)] = "Stagger"),
      t
    );
  })(F || {}),
  wt = "*";
function $m(t, e = null) {
  return { type: F.Sequence, steps: t, options: e };
}
function Mu(t) {
  return { type: F.Style, styles: t, offset: null };
}
var Zt = class {
    constructor(e = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  bi = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let n = 0,
        r = 0,
        i = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++n == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++r == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++i == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let n = e * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  $s = "!";
function Bm(t) {
  return new m(3e3, !1);
}
function _S() {
  return new m(3100, !1);
}
function AS() {
  return new m(3101, !1);
}
function xS(t) {
  return new m(3001, !1);
}
function NS(t) {
  return new m(3003, !1);
}
function RS(t) {
  return new m(3004, !1);
}
function OS(t, e) {
  return new m(3005, !1);
}
function PS() {
  return new m(3006, !1);
}
function FS() {
  return new m(3007, !1);
}
function kS(t, e) {
  return new m(3008, !1);
}
function LS(t) {
  return new m(3002, !1);
}
function jS(t, e, n, r, i) {
  return new m(3010, !1);
}
function VS() {
  return new m(3011, !1);
}
function $S() {
  return new m(3012, !1);
}
function BS() {
  return new m(3200, !1);
}
function US() {
  return new m(3202, !1);
}
function HS() {
  return new m(3013, !1);
}
function zS(t) {
  return new m(3014, !1);
}
function qS(t) {
  return new m(3015, !1);
}
function GS(t) {
  return new m(3016, !1);
}
function WS(t, e) {
  return new m(3404, !1);
}
function QS(t) {
  return new m(3502, !1);
}
function KS(t) {
  return new m(3503, !1);
}
function YS() {
  return new m(3300, !1);
}
function ZS(t) {
  return new m(3504, !1);
}
function XS(t) {
  return new m(3301, !1);
}
function JS(t, e) {
  return new m(3302, !1);
}
function eT(t) {
  return new m(3303, !1);
}
function tT(t, e) {
  return new m(3400, !1);
}
function nT(t) {
  return new m(3401, !1);
}
function rT(t) {
  return new m(3402, !1);
}
function iT(t, e) {
  return new m(3505, !1);
}
function Xt(t) {
  switch (t.length) {
    case 0:
      return new Zt();
    case 1:
      return t[0];
    default:
      return new bi(t);
  }
}
function ty(t, e, n = new Map(), r = new Map()) {
  let i = [],
    o = [],
    s = -1,
    a = null;
  if (
    (e.forEach((c) => {
      let l = c.get("offset"),
        u = l == s,
        d = (u && a) || new Map();
      c.forEach((f, h) => {
        let p = h,
          y = f;
        if (h !== "offset")
          switch (((p = t.normalizePropertyName(p, i)), y)) {
            case $s:
              y = n.get(h);
              break;
            case wt:
              y = r.get(h);
              break;
            default:
              y = t.normalizeStyleValue(h, p, y, i);
              break;
          }
        d.set(p, y);
      }),
        u || o.push(d),
        (a = d),
        (s = l);
    }),
    i.length)
  )
    throw QS(i);
  return o;
}
function Yu(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && _u(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && _u(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && _u(n, "destroy", t)));
      break;
  }
}
function _u(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    o = Zu(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i
    ),
    s = t._data;
  return s != null && (o._data = s), o;
}
function Zu(t, e, n, r, i = "", o = 0, s) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: o,
    disabled: !!s,
  };
}
function Be(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function Um(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var oT = typeof document > "u" ? null : document.documentElement;
function Xu(t) {
  let e = t.parentNode || t.host || null;
  return e === oT ? null : e;
}
function sT(t) {
  return t.substring(1, 6) == "ebkit";
}
var bn = null,
  Hm = !1;
function aT(t) {
  bn ||
    ((bn = cT() || {}), (Hm = bn.style ? "WebkitAppearance" in bn.style : !1));
  let e = !0;
  return (
    bn.style &&
      !sT(t) &&
      ((e = t in bn.style),
      !e &&
        Hm &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in bn.style)),
    e
  );
}
function cT() {
  return typeof document < "u" ? document.body : null;
}
function ny(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = Xu(e);
  }
  return !1;
}
function ry(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var Ju = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return aT(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return ny(r, i);
      }
      getParentElement(r) {
        return Xu(r);
      }
      query(r, i, o) {
        return ry(r, i, o);
      }
      computeStyle(r, i, o) {
        return o || "";
      }
      animate(r, i, o, s, a, c = [], l) {
        return new Zt(o, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  rd = class rd {};
rd.NOOP = new Ju();
var Sn = rd,
  Tn = class {};
var lT = 1e3,
  iy = "{{",
  uT = "}}",
  oy = "ng-enter",
  Pu = "ng-leave",
  Bs = "ng-trigger",
  Gs = ".ng-trigger",
  zm = "ng-animating",
  Fu = ".ng-animating";
function Ot(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : ku(parseFloat(e[1]), e[2]);
}
function ku(t, e) {
  switch (e) {
    case "s":
      return t * lT;
    default:
      return t;
  }
}
function Ws(t, e, n) {
  return t.hasOwnProperty("duration") ? t : dT(t, e, n);
}
function dT(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    o = 0,
    s = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(Bm(t)), { duration: 0, delay: 0, easing: "" };
    i = ku(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (o = ku(parseFloat(c), a[4]));
    let l = a[5];
    l && (s = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(_S()), (a = !0)),
      o < 0 && (e.push(AS()), (a = !0)),
      a && e.splice(c, 0, Bm(t));
  }
  return { duration: i, delay: o, easing: s };
}
function fT(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function Et(t, e, n) {
  e.forEach((r, i) => {
    let o = ed(i);
    n && !n.has(i) && n.set(i, t.style[o]), (t.style[o] = r);
  });
}
function In(t, e) {
  e.forEach((n, r) => {
    let i = ed(r);
    t.style[i] = "";
  });
}
function Ci(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : $m(t)) : t;
}
function hT(t, e, n) {
  let r = e.params || {},
    i = sy(t);
  i.length &&
    i.forEach((o) => {
      r.hasOwnProperty(o) || n.push(xS(o));
    });
}
var Lu = new RegExp(`${iy}\\s*(.+?)\\s*${uT}`, "g");
function sy(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = Lu.exec(t)); ) e.push(n[1]);
    Lu.lastIndex = 0;
  }
  return e;
}
function Si(t, e, n) {
  let r = `${t}`,
    i = r.replace(Lu, (o, s) => {
      let a = e[s];
      return a == null && (n.push(NS(s)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
var pT = /-+([a-z0-9])/g;
function ed(t) {
  return t.replace(pT, (...e) => e[1].toUpperCase());
}
function gT(t, e) {
  return t === 0 || e === 0;
}
function mT(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((o, s) => {
        r.has(s) || i.push(s), r.set(s, o);
      }),
      i.length)
    )
      for (let o = 1; o < e.length; o++) {
        let s = e[o];
        i.forEach((a) => s.set(a, td(t, a)));
      }
  }
  return e;
}
function $e(t, e, n) {
  switch (e.type) {
    case F.Trigger:
      return t.visitTrigger(e, n);
    case F.State:
      return t.visitState(e, n);
    case F.Transition:
      return t.visitTransition(e, n);
    case F.Sequence:
      return t.visitSequence(e, n);
    case F.Group:
      return t.visitGroup(e, n);
    case F.Animate:
      return t.visitAnimate(e, n);
    case F.Keyframes:
      return t.visitKeyframes(e, n);
    case F.Style:
      return t.visitStyle(e, n);
    case F.Reference:
      return t.visitReference(e, n);
    case F.AnimateChild:
      return t.visitAnimateChild(e, n);
    case F.AnimateRef:
      return t.visitAnimateRef(e, n);
    case F.Query:
      return t.visitQuery(e, n);
    case F.Stagger:
      return t.visitStagger(e, n);
    default:
      throw RS(e.type);
  }
}
function td(t, e) {
  return window.getComputedStyle(t)[e];
}
var yT = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  Qs = class extends Tn {
    normalizePropertyName(e, n) {
      return ed(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let o = "",
        s = r.toString().trim();
      if (yT.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") o = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(OS(e, r));
        }
      return s + o;
    }
  };
var Ks = "*";
function vT(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => DT(r, n, e))
      : n.push(t),
    n
  );
}
function DT(t, e, n) {
  if (t[0] == ":") {
    let c = wT(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(qS(t)), e;
  let i = r[1],
    o = r[2],
    s = r[3];
  e.push(qm(i, s));
  let a = i == Ks && s == Ks;
  o[0] == "<" && !a && e.push(qm(s, i));
}
function wT(t, e) {
  switch (t) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ":decrement":
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return e.push(GS(t)), "* => *";
  }
}
var Us = new Set(["true", "1"]),
  Hs = new Set(["false", "0"]);
function qm(t, e) {
  let n = Us.has(t) || Hs.has(t),
    r = Us.has(e) || Hs.has(e);
  return (i, o) => {
    let s = t == Ks || t == i,
      a = e == Ks || e == o;
    return (
      !s && n && typeof i == "boolean" && (s = i ? Us.has(t) : Hs.has(t)),
      !a && r && typeof o == "boolean" && (a = o ? Us.has(e) : Hs.has(e)),
      s && a
    );
  };
}
var ay = ":self",
  ET = new RegExp(`s*${ay}s*,?`, "g");
function cy(t, e, n, r) {
  return new ju(t).build(e, n, r);
}
var Gm = "",
  ju = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new Vu(n);
      return this._resetContextStyleTimingState(i), $e(this, Ci(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = Gm),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(Gm, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        o = [],
        s = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(PS()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == F.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), o.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == F.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), s.push(c);
          } else n.errors.push(FS());
        }),
        {
          type: F.Trigger,
          name: e.name,
          states: o,
          transitions: s,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, n) {
      let r = this.visitStyle(e.styles, n),
        i = (e.options && e.options.params) || null;
      if (r.containsDynamicStyles) {
        let o = new Set(),
          s = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((c) => {
              sy(c).forEach((l) => {
                s.hasOwnProperty(l) || o.add(l);
              });
            });
        }),
          o.size && n.errors.push(kS(e.name, [...o.values()]));
      }
      return {
        type: F.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = $e(this, Ci(e.animation), n),
        i = vT(e.expr, n.errors);
      return {
        type: F.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: Cn(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: F.Sequence,
        steps: e.steps.map((r) => $e(this, r, n)),
        options: Cn(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        o = e.steps.map((s) => {
          n.currentTime = r;
          let a = $e(this, s, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i), { type: F.Group, steps: o, options: Cn(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = ST(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        o = e.styles ? e.styles : Mu({});
      if (o.type == F.Keyframes) i = this.visitKeyframes(o, n);
      else {
        let s = e.styles,
          a = !1;
        if (!s) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (s = Mu(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(s, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: F.Animate, timings: r, style: i, options: null }
      );
    }
    visitStyle(e, n) {
      let r = this._makeStyleAst(e, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(e, n) {
      let r = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == "string"
          ? a === wt
            ? r.push(a)
            : n.errors.push(LS(a))
          : r.push(new Map(Object.entries(a)));
      let o = !1,
        s = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((s = a.get("easing")), a.delete("easing")), !o)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(iy) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: F.Style,
          styles: r,
          easing: s,
          offset: e.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        o = n.currentTime;
      r && o > 0 && (o -= r.duration + r.delay),
        e.styles.forEach((s) => {
          typeof s != "string" &&
            s.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (o != i &&
                  o >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(jS(c, u.startTime, u.endTime, o, i)),
                  (d = !1)),
                (o = u.startTime)),
                d && l.set(c, { startTime: o, endTime: i }),
                n.options && hT(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: F.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(VS()), r;
      let i = 1,
        o = 0,
        s = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((M) => {
          let H = this._makeStyleAst(M, n),
            z = H.offset != null ? H.offset : IT(H.styles),
            Q = 0;
          return (
            z != null && (o++, (Q = H.offset = z)),
            (c = c || Q < 0 || Q > 1),
            (a = a || Q < l),
            (l = Q),
            s.push(Q),
            H
          );
        });
      c && n.errors.push($S()), a && n.errors.push(BS());
      let d = e.steps.length,
        f = 0;
      o > 0 && o < d ? n.errors.push(US()) : o == 0 && (f = i / (d - 1));
      let h = d - 1,
        p = n.currentTime,
        y = n.currentAnimateTimings,
        A = y.duration;
      return (
        u.forEach((M, H) => {
          let z = f > 0 ? (H == h ? 1 : f * H) : s[H],
            Q = z * A;
          (n.currentTime = p + y.delay + Q),
            (y.duration = Q),
            this._validateStyleAst(M, n),
            (M.offset = z),
            r.styles.push(M);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: F.Reference,
        animation: $e(this, Ci(e.animation), n),
        options: Cn(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: F.AnimateChild, options: Cn(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: F.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: Cn(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [o, s] = bT(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + o : o),
        Be(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = $e(this, Ci(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: F.Query,
          selector: o,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: s,
          animation: a,
          originalSelector: e.selector,
          options: Cn(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(HS());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : Ws(e.timings, n.errors, !0);
      return {
        type: F.Stagger,
        animation: $e(this, Ci(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function bT(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == ay);
  return (
    e && (t = t.replace(ET, "")),
    (t = t
      .replace(/@\*/g, Gs)
      .replace(/@\w+/g, (n) => Gs + "-" + n.slice(1))
      .replace(/:animating/g, Fu)),
    [t, e]
  );
}
function CT(t) {
  return t ? v({}, t) : null;
}
var Vu = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function IT(t) {
  if (typeof t == "string") return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((n) => {
      if (n instanceof Map && n.has("offset")) {
        let r = n;
        (e = parseFloat(r.get("offset"))), r.delete("offset");
      }
    });
  else if (t instanceof Map && t.has("offset")) {
    let n = t;
    (e = parseFloat(n.get("offset"))), n.delete("offset");
  }
  return e;
}
function ST(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let o = Ws(t, e).duration;
    return Au(o, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
    let o = Au(0, 0, "");
    return (o.dynamic = !0), (o.strValue = n), o;
  }
  let i = Ws(n, e);
  return Au(i.duration, i.delay, i.easing);
}
function Cn(t) {
  return (
    t ? ((t = v({}, t)), t.params && (t.params = CT(t.params))) : (t = {}), t
  );
}
function Au(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function nd(t, e, n, r, i, o, s = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: o,
    totalTime: i + o,
    easing: s,
    subTimeline: a,
  };
}
var Ti = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, n) {
      let r = this._map.get(e);
      r || this._map.set(e, (r = [])), r.push(...n);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  TT = 1,
  MT = ":enter",
  _T = new RegExp(MT, "g"),
  AT = ":leave",
  xT = new RegExp(AT, "g");
function ly(t, e, n, r, i, o = new Map(), s = new Map(), a, c, l = []) {
  return new $u().buildKeyframes(t, e, n, r, i, o, s, a, c, l);
}
var $u = class {
    buildKeyframes(e, n, r, i, o, s, a, c, l, u = []) {
      l = l || new Ti();
      let d = new Bu(e, n, l, i, o, u, []);
      d.options = c;
      let f = c.delay ? Ot(c.delay) : 0;
      d.currentTimeline.delayNextStep(f),
        d.currentTimeline.setStyles([s], null, d.errors, c),
        $e(this, r, d);
      let h = d.timelines.filter((p) => p.containsAnimation());
      if (h.length && a.size) {
        let p;
        for (let y = h.length - 1; y >= 0; y--) {
          let A = h[y];
          if (A.element === n) {
            p = A;
            break;
          }
        }
        p &&
          !p.allowOnlyTimelineStyles() &&
          p.setStyles([a], null, d.errors, c);
      }
      return h.length
        ? h.map((p) => p.buildKeyframes())
        : [nd(n, [], [], [], 0, f, "", !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          o = n.currentTimeline.currentTime,
          s = this._visitSubInstructions(r, i, i.options);
        o != s && n.transformIntoNewTimeline(s);
      }
      n.previousNode = e;
    }
    visitAnimateRef(e, n) {
      let r = n.createSubContext(e.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], n, r),
        this.visitReference(e.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = e);
    }
    _applyAnimationRefDelays(e, n, r) {
      for (let i of e) {
        let o = i?.delay;
        if (o) {
          let s =
            typeof o == "number" ? o : Ot(Si(o, i?.params ?? {}, n.errors));
          r.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let o = n.currentTimeline.currentTime,
        s = r.duration != null ? Ot(r.duration) : null,
        a = r.delay != null ? Ot(r.delay) : null;
      return (
        s !== 0 &&
          e.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, s, a);
            o = Math.max(o, l.duration + l.delay);
          }),
        o
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        $e(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        o = e.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((i = n.createSubContext(o)),
        i.transformIntoNewTimeline(),
        o.delay != null)
      ) {
        i.previousNode.type == F.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = Ys));
        let s = Ot(o.delay);
        i.delayNextStep(s);
      }
      e.steps.length &&
        (e.steps.forEach((s) => $e(this, s, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        o = e.options && e.options.delay ? Ot(e.options.delay) : 0;
      e.steps.forEach((s) => {
        let a = n.createSubContext(e.options);
        o && a.delayNextStep(o),
          $e(this, s, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? Si(r, n.params, n.errors) : r;
        return Ws(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let o = e.style;
      o.type == F.Keyframes
        ? this.visitKeyframes(o, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(o, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let o = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(o)
        : r.setStyles(e.styles, o, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        o = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * o),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + o),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        o = i.delay ? Ot(i.delay) : 0;
      o &&
        (n.previousNode.type === F.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Ys));
      let s = r,
        a = n.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          n.errors
        );
      n.currentQueryTotal = a.length;
      let c = null;
      a.forEach((l, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(e.options, l);
        o && d.delayNextStep(o),
          l === n.element && (c = d.currentTimeline),
          $e(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let f = d.currentTimeline.currentTime;
        s = Math.max(s, f);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(s),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        o = e.timings,
        s = Math.abs(o.duration),
        a = s * (n.currentQueryTotal - 1),
        c = s * n.currentQueryIndex;
      switch (o.duration < 0 ? "reverse" : o.easing) {
        case "reverse":
          c = a - c;
          break;
        case "full":
          c = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      c && u.delayNextStep(c);
      let d = u.currentTime;
      $e(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  Ys = {},
  Bu = class t {
    constructor(e, n, r, i, o, s, a, c) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = Ys),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new Zs(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = Ot(r.duration)),
        r.delay != null && (i.delay = Ot(r.delay));
      let o = r.params;
      if (o) {
        let s = i.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!n || !s.hasOwnProperty(a)) && (s[a] = Si(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (e.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, n, r) {
      let i = n || this.element,
        o = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0)
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(e),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = Ys),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, n, r) {
      let i = {
          duration: n ?? e.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
          easing: "",
        },
        o = new Uu(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe
        );
      return this.timelines.push(o), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, o, s) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(_T, "." + this._enterClassName)),
          (e = e.replace(xT, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !o && a.length == 0 && s.push(zS(n)), a;
    }
  },
  Zs = class t {
    constructor(e, n, r, i) {
      (this._driver = e),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + e),
          n && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, n) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          n || this.currentTime,
          this._elementTimelineStylesLookup
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += TT), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, n) {
      this._localTimelineStyles.set(e, n),
        this._globalTimelineStyles.set(e, n),
        this._styleSummary.set(e, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set("easing", e);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || wt), this._currentKeyframe.set(n, wt);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let o = (i && i.params) || {},
        s = NT(e, this._globalTimelineStyles);
      for (let [a, c] of s) {
        let l = Si(c, o, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? wt),
          this._updateStyle(a, l);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, n) => {
          this._currentKeyframe.set(n, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, n] of this._localTimelineStyles)
        this._pendingStyles.set(e, n), this._updateStyle(e, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let n in this._currentKeyframe) e.push(n);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, c) => {
        let l = new Map([...this._backFill, ...a]);
        l.forEach((u, d) => {
          u === $s ? e.add(d) : u === wt && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let o = [...e.values()],
        s = [...n.values()];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return nd(
        this.element,
        i,
        o,
        s,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  Uu = class extends Zs {
    constructor(e, n, r, i, o, s, a = !1) {
      super(e, n, s.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let o = [],
          s = r + n,
          a = n / s,
          c = new Map(e[0]);
        c.set("offset", 0), o.push(c);
        let l = new Map(e[0]);
        l.set("offset", Wm(a)), o.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let f = new Map(e[d]),
            h = f.get("offset"),
            p = n + h * r;
          f.set("offset", Wm(p / s)), o.push(f);
        }
        (r = s), (n = 0), (i = ""), (e = o);
      }
      return nd(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0
      );
    }
  };
function Wm(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function NT(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r ??= e.keys();
        for (let o of r) n.set(o, wt);
      } else for (let [o, s] of i) n.set(o, s);
    }),
    n
  );
}
function Qm(t, e, n, r, i, o, s, a, c, l, u, d, f) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: o,
    toState: r,
    toStyles: s,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: f,
  };
}
var xu = {},
  Xs = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return RT(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, o, s, a, c, l, u) {
      let d = [],
        f = (this.ast.options && this.ast.options.params) || xu,
        h = (a && a.params) || xu,
        p = this.buildStyles(r, h, d),
        y = (c && c.params) || xu,
        A = this.buildStyles(i, y, d),
        M = new Set(),
        H = new Map(),
        z = new Map(),
        Q = i === "void",
        Te = { params: uy(y, f), delay: this.ast.options?.delay },
        te = u ? [] : ly(e, n, this.ast.animation, o, s, p, A, Te, l, d),
        ne = 0;
      return (
        te.forEach((de) => {
          ne = Math.max(de.duration + de.delay, ne);
        }),
        d.length
          ? Qm(n, this._triggerName, r, i, Q, p, A, [], [], H, z, ne, d)
          : (te.forEach((de) => {
              let bt = de.element,
                Pt = Be(H, bt, new Set());
              de.preStyleProps.forEach((Jt) => Pt.add(Jt));
              let id = Be(z, bt, new Set());
              de.postStyleProps.forEach((Jt) => id.add(Jt)),
                bt !== n && M.add(bt);
            }),
            Qm(
              n,
              this._triggerName,
              r,
              i,
              Q,
              p,
              A,
              te,
              [...M.values()],
              H,
              z,
              ne
            ))
      );
    }
  };
function RT(t, e, n, r, i) {
  return t.some((o) => o(e, n, r, i));
}
function uy(t, e) {
  let n = v({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var Hu = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = uy(e, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != "string" &&
          o.forEach((s, a) => {
            s && (s = Si(s, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (s = this.normalizer.normalizeStyleValue(a, c, s, n)), r.set(a, s);
          });
      }),
      r
    );
  }
};
function OT(t, e, n) {
  return new zu(t, e, n);
}
var zu = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let o = (i.options && i.options.params) || {};
        this.states.set(i.name, new Hu(i.style, o, r));
      }),
      Km(this.states, "true", "1"),
      Km(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new Xs(e, i, this.states));
      }),
      (this.fallbackTransition = PT(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((s) => s.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function PT(t, e, n) {
  let r = [(s, a) => !0],
    i = { type: F.Sequence, steps: [], options: null },
    o = {
      type: F.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Xs(t, o, e);
}
function Km(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var FT = new Ti(),
  qu = class {
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, n) {
      let r = [],
        i = [],
        o = cy(this._driver, n, r, i);
      if (r.length) throw KS(r);
      i.length && void 0, this._animations.set(e, o);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        o = ty(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, o, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        o = this._animations.get(e),
        s,
        a = new Map();
      if (
        (o
          ? ((s = ly(
              this._driver,
              n,
              o,
              oy,
              Pu,
              new Map(),
              new Map(),
              r,
              FT,
              i
            )),
            s.forEach((u) => {
              let d = Be(a, u.element, new Map());
              u.postStyleProps.forEach((f) => d.set(f, null));
            }))
          : (i.push(YS()), (s = [])),
        i.length)
      )
        throw ZS(i);
      a.forEach((u, d) => {
        u.forEach((f, h) => {
          u.set(h, this._driver.computeStyle(d, h, wt));
        });
      });
      let c = s.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = Xt(c);
      return (
        this._playersById.set(e, l),
        l.onDestroy(() => this.destroy(e)),
        this.players.push(l),
        l
      );
    }
    destroy(e) {
      let n = this._getPlayer(e);
      n.destroy(), this._playersById.delete(e);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(e) {
      let n = this._playersById.get(e);
      if (!n) throw XS(e);
      return n;
    }
    listen(e, n, r, i) {
      let o = Zu(n, "", "", "");
      return Yu(this._getPlayer(e), r, o, i), () => {};
    }
    command(e, n, r, i) {
      if (r == "register") {
        this.register(e, i[0]);
        return;
      }
      if (r == "create") {
        let s = i[0] || {};
        this.create(e, n, s);
        return;
      }
      let o = this._getPlayer(e);
      switch (r) {
        case "play":
          o.play();
          break;
        case "pause":
          o.pause();
          break;
        case "reset":
          o.reset();
          break;
        case "restart":
          o.restart();
          break;
        case "finish":
          o.finish();
          break;
        case "init":
          o.init();
          break;
        case "setPosition":
          o.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  Ym = "ng-animate-queued",
  kT = ".ng-animate-queued",
  Nu = "ng-animate-disabled",
  LT = ".ng-animate-disabled",
  jT = "ng-star-inserted",
  VT = ".ng-star-inserted",
  $T = [],
  dy = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  BT = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  at = "__ng_removed",
  Mi = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = HT(i)), r)) {
        let o = e,
          { value: s } = o,
          a = Ni(o, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let n = e.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  Ii = "void",
  Ru = new Mi(Ii),
  Gu = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Ye(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw JS(r, n);
      if (r == null || r.length == 0) throw eT(n);
      if (!zT(r)) throw tT(r, n);
      let o = Be(this._elementListeners, e, []),
        s = { name: n, phase: r, callback: i };
      o.push(s);
      let a = Be(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (Ye(e, Bs), Ye(e, Bs + "-" + n), a.set(n, Ru)),
        () => {
          this._engine.afterFlush(() => {
            let c = o.indexOf(s);
            c >= 0 && o.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw nT(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let o = this._getTrigger(n),
        s = new _i(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Ye(e, Bs),
        Ye(e, Bs + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new Mi(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = Ru),
        !(l.value === Ii) && c.value === l.value)
      ) {
        if (!WT(c.params, l.params)) {
          let y = [],
            A = o.matchStyles(c.value, c.params, y),
            M = o.matchStyles(l.value, l.params, y);
          y.length
            ? this._engine.reportError(y)
            : this._engine.afterFlush(() => {
                In(e, A), Et(e, M);
              });
        }
        return;
      }
      let f = Be(this._engine.playersByElement, e, []);
      f.forEach((y) => {
        y.namespaceId == this.id &&
          y.triggerName == n &&
          y.queued &&
          y.destroy();
      });
      let h = o.matchTransition(c.value, l.value, e, l.params),
        p = !1;
      if (!h) {
        if (!i) return;
        (h = o.fallbackTransition), (p = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: h,
          fromState: c,
          toState: l,
          player: s,
          isFallbackTransition: p,
        }),
        p ||
          (Ye(e, Ym),
          s.onStart(() => {
            hr(e, Ym);
          })),
        s.onDone(() => {
          let y = this.players.indexOf(s);
          y >= 0 && this.players.splice(y, 1);
          let A = this._engine.playersByElement.get(e);
          if (A) {
            let M = A.indexOf(s);
            M >= 0 && A.splice(M, 1);
          }
        }),
        this.players.push(s),
        f.push(s),
        s
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((n) => n.delete(e)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != e)
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let n = this._engine.playersByElement.get(e);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, n) {
      let r = this._engine.driver.query(e, Gs, !0);
      r.forEach((i) => {
        if (i[at]) return;
        let o = this._engine.fetchNamespacesByElement(i);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i))
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let o = this._engine.statesByElement.get(e),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((c, l) => {
            if ((s.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(e, l, Ii, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, s),
            r && Xt(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let n = this._elementListeners.get(e),
        r = this._engine.statesByElement.get(e);
      if (n && r) {
        let i = new Set();
        n.forEach((o) => {
          let s = o.name;
          if (i.has(s)) return;
          i.add(s);
          let c = this._triggers.get(s).fallbackTransition,
            l = r.get(s) || Ru,
            u = new Mi(Ii),
            d = new _i(this.id, s, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: s,
              transition: c,
              fromState: l,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, n) {
      let r = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
        this.triggerLeaveAnimation(e, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let o = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (o && o.length) i = !0;
        else {
          let s = e;
          for (; (s = s.parentNode); )
            if (r.statesByElement.get(s)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let o = e[at];
        (!o || o === dy) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      Ye(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let o = r.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = Zu(
                  o,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value
                );
                (c._data = e), Yu(r.player, a.phase, c, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let o = r.transition.ast.depCount,
            s = i.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(r.element, i.element)
            ? 1
            : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  Wu = class {
    _onRemovalComplete(e, n) {
      this.onRemovalComplete(e, n);
    }
    constructor(e, n, r, i) {
      (this.bodyNode = e),
        (this.driver = n),
        (this._normalizer = r),
        (this.scheduler = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (o, s) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && e.push(r);
          });
        }),
        e
      );
    }
    createNamespace(e, n) {
      let r = new Gu(e, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[e] = r)
      );
    }
    _balanceNamespaceList(e, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, e), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || r.unshift(e);
      } else r.push(e);
      return i.set(n, e), e;
    }
    register(e, n) {
      let r = this._namespaceLookup[e];
      return r || (r = this.createNamespace(e, n)), r;
    }
    registerTrigger(e, n, r) {
      let i = this._namespaceLookup[e];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(e, n) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let n = new Set(),
        r = this.statesByElement.get(e);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let o = this._fetchNamespace(i.namespaceId);
            o && n.add(o);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (zs(n)) {
        let o = this._fetchNamespace(e);
        if (o) return o.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!zs(n)) return;
      let o = n[at];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(n);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (e) {
        let s = this._fetchNamespace(e);
        s && s.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Ye(e, Nu))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), hr(e, Nu));
    }
    removeNode(e, n, r) {
      if (zs(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let o = this.namespacesByHostElement.get(n);
        o && o.id !== e && o.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, o) {
      this.collectedLeaveElements.push(n),
        (n[at] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(e, n, r, i, o) {
      return zs(n) ? this._fetchNamespace(e).listen(n, r, i, o) : () => {};
    }
    _buildInstruction(e, n, r, i, o) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        r,
        i,
        e.fromState.options,
        e.toState.options,
        n,
        o
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, Gs, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Fu, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(e) {
      let n = this.playersByElement.get(e);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let n = this.playersByQueriedElement.get(e);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return Xt(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[at];
      if (n && n.setForRemoval) {
        if (((e[at] = dy), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(Nu) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, LT, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(e = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i)
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          Ye(i, jT);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, e);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? Xt(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw rT(e);
    }
    _flushAnimations(e, n) {
      let r = new Ti(),
        i = [],
        o = new Map(),
        s = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((D) => {
        u.add(D);
        let b = this.driver.query(D, kT, !0);
        for (let I = 0; I < b.length; I++) u.add(b[I]);
      });
      let d = this.bodyNode,
        f = Array.from(this.statesByElement.keys()),
        h = Jm(f, this.collectedEnterElements),
        p = new Map(),
        y = 0;
      h.forEach((D, b) => {
        let I = oy + y++;
        p.set(b, I), D.forEach((B) => Ye(B, I));
      });
      let A = [],
        M = new Set(),
        H = new Set();
      for (let D = 0; D < this.collectedLeaveElements.length; D++) {
        let b = this.collectedLeaveElements[D],
          I = b[at];
        I &&
          I.setForRemoval &&
          (A.push(b),
          M.add(b),
          I.hasAnimation
            ? this.driver.query(b, VT, !0).forEach((B) => M.add(B))
            : H.add(b));
      }
      let z = new Map(),
        Q = Jm(f, Array.from(M));
      Q.forEach((D, b) => {
        let I = Pu + y++;
        z.set(b, I), D.forEach((B) => Ye(B, I));
      }),
        e.push(() => {
          h.forEach((D, b) => {
            let I = p.get(b);
            D.forEach((B) => hr(B, I));
          }),
            Q.forEach((D, b) => {
              let I = z.get(b);
              D.forEach((B) => hr(B, I));
            }),
            A.forEach((D) => {
              this.processLeaveNode(D);
            });
        });
      let Te = [],
        te = [];
      for (let D = this._namespaceList.length - 1; D >= 0; D--)
        this._namespaceList[D].drainQueuedTransitions(n).forEach((I) => {
          let B = I.player,
            fe = I.element;
          if ((Te.push(B), this.collectedEnterElements.length)) {
            let De = fe[at];
            if (De && De.setForMove) {
              if (
                De.previousTriggersValues &&
                De.previousTriggersValues.has(I.triggerName)
              ) {
                let en = De.previousTriggersValues.get(I.triggerName),
                  Ue = this.statesByElement.get(I.element);
                if (Ue && Ue.has(I.triggerName)) {
                  let Ai = Ue.get(I.triggerName);
                  (Ai.value = en), Ue.set(I.triggerName, Ai);
                }
              }
              B.destroy();
              return;
            }
          }
          let ct = !d || !this.driver.containsElement(d, fe),
            Me = z.get(fe),
            Ft = p.get(fe),
            J = this._buildInstruction(I, r, Ft, Me, ct);
          if (J.errors && J.errors.length) {
            te.push(J);
            return;
          }
          if (ct) {
            B.onStart(() => In(fe, J.fromStyles)),
              B.onDestroy(() => Et(fe, J.toStyles)),
              i.push(B);
            return;
          }
          if (I.isFallbackTransition) {
            B.onStart(() => In(fe, J.fromStyles)),
              B.onDestroy(() => Et(fe, J.toStyles)),
              i.push(B);
            return;
          }
          let ad = [];
          J.timelines.forEach((De) => {
            (De.stretchStartingKeyframe = !0),
              this.disabledNodes.has(De.element) || ad.push(De);
          }),
            (J.timelines = ad),
            r.append(fe, J.timelines);
          let yy = { instruction: J, player: B, element: fe };
          s.push(yy),
            J.queriedElements.forEach((De) => Be(a, De, []).push(B)),
            J.preStyleProps.forEach((De, en) => {
              if (De.size) {
                let Ue = c.get(en);
                Ue || c.set(en, (Ue = new Set())),
                  De.forEach((Ai, ia) => Ue.add(ia));
              }
            }),
            J.postStyleProps.forEach((De, en) => {
              let Ue = l.get(en);
              Ue || l.set(en, (Ue = new Set())),
                De.forEach((Ai, ia) => Ue.add(ia));
            });
        });
      if (te.length) {
        let D = [];
        te.forEach((b) => {
          D.push(iT(b.triggerName, b.errors));
        }),
          Te.forEach((b) => b.destroy()),
          this.reportError(D);
      }
      let ne = new Map(),
        de = new Map();
      s.forEach((D) => {
        let b = D.element;
        r.has(b) &&
          (de.set(b, b),
          this._beforeAnimationBuild(D.player.namespaceId, D.instruction, ne));
      }),
        i.forEach((D) => {
          let b = D.element;
          this._getPreviousPlayers(
            b,
            !1,
            D.namespaceId,
            D.triggerName,
            null
          ).forEach((B) => {
            Be(ne, b, []).push(B), B.destroy();
          });
        });
      let bt = A.filter((D) => ey(D, c, l)),
        Pt = new Map();
      Xm(Pt, this.driver, H, l, wt).forEach((D) => {
        ey(D, c, l) && bt.push(D);
      });
      let Jt = new Map();
      h.forEach((D, b) => {
        Xm(Jt, this.driver, new Set(D), c, $s);
      }),
        bt.forEach((D) => {
          let b = Pt.get(D),
            I = Jt.get(D);
          Pt.set(
            D,
            new Map([...(b?.entries() ?? []), ...(I?.entries() ?? [])])
          );
        });
      let ra = [],
        od = [],
        sd = {};
      s.forEach((D) => {
        let { element: b, player: I, instruction: B } = D;
        if (r.has(b)) {
          if (u.has(b)) {
            I.onDestroy(() => Et(b, B.toStyles)),
              (I.disabled = !0),
              I.overrideTotalTime(B.totalTime),
              i.push(I);
            return;
          }
          let fe = sd;
          if (de.size > 1) {
            let Me = b,
              Ft = [];
            for (; (Me = Me.parentNode); ) {
              let J = de.get(Me);
              if (J) {
                fe = J;
                break;
              }
              Ft.push(Me);
            }
            Ft.forEach((J) => de.set(J, fe));
          }
          let ct = this._buildAnimation(I.namespaceId, B, ne, o, Jt, Pt);
          if ((I.setRealPlayer(ct), fe === sd)) ra.push(I);
          else {
            let Me = this.playersByElement.get(fe);
            Me && Me.length && (I.parentPlayer = Xt(Me)), i.push(I);
          }
        } else
          In(b, B.fromStyles),
            I.onDestroy(() => Et(b, B.toStyles)),
            od.push(I),
            u.has(b) && i.push(I);
      }),
        od.forEach((D) => {
          let b = o.get(D.element);
          if (b && b.length) {
            let I = Xt(b);
            D.setRealPlayer(I);
          }
        }),
        i.forEach((D) => {
          D.parentPlayer ? D.syncPlayerEvents(D.parentPlayer) : D.destroy();
        });
      for (let D = 0; D < A.length; D++) {
        let b = A[D],
          I = b[at];
        if ((hr(b, Pu), I && I.hasAnimation)) continue;
        let B = [];
        if (a.size) {
          let ct = a.get(b);
          ct && ct.length && B.push(...ct);
          let Me = this.driver.query(b, Fu, !0);
          for (let Ft = 0; Ft < Me.length; Ft++) {
            let J = a.get(Me[Ft]);
            J && J.length && B.push(...J);
          }
        }
        let fe = B.filter((ct) => !ct.destroyed);
        fe.length ? qT(this, b, fe) : this.processLeaveNode(b);
      }
      return (
        (A.length = 0),
        ra.forEach((D) => {
          this.players.push(D),
            D.onDone(() => {
              D.destroy();
              let b = this.players.indexOf(D);
              this.players.splice(b, 1);
            }),
            D.play();
        }),
        ra
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, o) {
      let s = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let c = !o || o == Ii;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || s.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (s = s.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
          )),
        s
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        o = n.element,
        s = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== o,
          d = Be(r, l, []);
        this._getPreviousPlayers(l, u, s, a, n.toState).forEach((h) => {
          let p = h.getRealPlayer();
          p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
        });
      }
      In(o, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, o, s) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        f = n.timelines.map((p) => {
          let y = p.element;
          u.add(y);
          let A = y[at];
          if (A && A.removedBeforeQueried) return new Zt(p.duration, p.delay);
          let M = y !== c,
            H = GT((r.get(y) || $T).map((ne) => ne.getRealPlayer())).filter(
              (ne) => {
                let de = ne;
                return de.element ? de.element === y : !1;
              }
            ),
            z = o.get(y),
            Q = s.get(y),
            Te = ty(this._normalizer, p.keyframes, z, Q),
            te = this._buildPlayer(p, Te, H);
          if ((p.subTimeline && i && d.add(y), M)) {
            let ne = new _i(e, a, y);
            ne.setRealPlayer(te), l.push(ne);
          }
          return te;
        });
      l.forEach((p) => {
        Be(this.playersByQueriedElement, p.element, []).push(p),
          p.onDone(() => UT(this.playersByQueriedElement, p.element, p));
      }),
        u.forEach((p) => Ye(p, zm));
      let h = Xt(f);
      return (
        h.onDestroy(() => {
          u.forEach((p) => hr(p, zm)), Et(c, n.toStyles);
        }),
        d.forEach((p) => {
          Be(i, p, []).push(h);
        }),
        h
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new Zt(e.duration, e.delay);
    }
  },
  _i = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new Zt()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => Yu(e, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let n = this._player;
      n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, n) {
      Be(this._queuedCallbacks, e, []).push(n);
    }
    onDone(e) {
      this.queued && this._queueEvent("done", e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent("start", e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(e);
    }
  };
function UT(t, e, n) {
  let r = t.get(e);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && t.delete(e);
  }
  return r;
}
function HT(t) {
  return t ?? null;
}
function zs(t) {
  return t && t.nodeType === 1;
}
function zT(t) {
  return t == "start" || t == "done";
}
function Zm(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function Xm(t, e, n, r, i) {
  let o = [];
  n.forEach((c) => o.push(Zm(c)));
  let s = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let f = e.computeStyle(l, d, i);
      u.set(d, f), (!f || f.length == 0) && ((l[at] = BT), s.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => Zm(c, o[a++])), s;
}
function Jm(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    o = new Map();
  function s(a) {
    if (!a) return r;
    let c = o.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = s(l)), o.set(a, c), c;
  }
  return (
    e.forEach((a) => {
      let c = s(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function Ye(t, e) {
  t.classList?.add(e);
}
function hr(t, e) {
  t.classList?.remove(e);
}
function qT(t, e, n) {
  Xt(n).onDone(() => t.processLeaveNode(e));
}
function GT(t) {
  let e = [];
  return fy(t, e), e;
}
function fy(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof bi ? fy(r.players, e) : e.push(r);
  }
}
function WT(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let o = n[i];
    if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
function ey(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((o) => i.add(o)) : e.set(t, r), n.delete(t), !0;
}
var gr = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (o, s) => {}),
      (this._transitionEngine = new Wu(e.body, n, r, i)),
      (this._timelineEngine = new qu(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (o, s) =>
        this.onRemovalComplete(o, s));
  }
  registerTrigger(e, n, r, i, o) {
    let s = e + "-" + i,
      a = this._triggerCache[s];
    if (!a) {
      let c = [],
        l = [],
        u = cy(this._driver, o, c, l);
      if (c.length) throw WS(i, c);
      l.length && void 0,
        (a = OT(i, u, this._normalizer)),
        (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(e, n) {
    this._transitionEngine.register(e, n);
  }
  destroy(e, n) {
    this._transitionEngine.destroy(e, n);
  }
  onInsert(e, n, r, i) {
    this._transitionEngine.insertNode(e, n, r, i);
  }
  onRemove(e, n, r) {
    this._transitionEngine.removeNode(e, n, r);
  }
  disableAnimations(e, n) {
    this._transitionEngine.markElementAsDisabled(e, n);
  }
  process(e, n, r, i) {
    if (r.charAt(0) == "@") {
      let [o, s] = Um(r),
        a = i;
      this._timelineEngine.command(o, n, s, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, o) {
    if (r.charAt(0) == "@") {
      let [s, a] = Um(r);
      return this._timelineEngine.listen(s, n, a, o);
    }
    return this._transitionEngine.listen(e, n, r, i, o);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function QT(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = Ou(e[0])), e.length > 1 && (r = Ou(e[e.length - 1])))
      : e instanceof Map && (n = Ou(e)),
    n || r ? new Qu(t, n, r) : null
  );
}
var pr = class pr {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = pr.initialStylesByElement.get(e);
    i || pr.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        Et(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (Et(this._element, this._initialStyles),
        this._endStyles &&
          (Et(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (pr.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (In(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (In(this._element, this._endStyles), (this._endStyles = null)),
        Et(this._element, this._initialStyles),
        (this._state = 3));
  }
};
pr.initialStylesByElement = new WeakMap();
var Qu = pr;
function Ou(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      KT(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function KT(t) {
  return t === "display" || t === "position";
}
var Js = class {
    constructor(e, n, r, i) {
      (this.element = e),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener("finish", n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let n = [];
      return (
        e.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(e, n, r) {
      return e.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== "offset" && e.set(i, this._finished ? r : td(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  ea = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, n) {
      return !1;
    }
    containsElement(e, n) {
      return ny(e, n);
    }
    getParentElement(e) {
      return Xu(e);
    }
    query(e, n, r) {
      return ry(e, n, r);
    }
    computeStyle(e, n, r) {
      return td(e, n);
    }
    animate(e, n, r, i, o, s = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      o && (c.easing = o);
      let l = new Map(),
        u = s.filter((h) => h instanceof Js);
      gT(r, i) &&
        u.forEach((h) => {
          h.currentSnapshot.forEach((p, y) => l.set(y, p));
        });
      let d = fT(n).map((h) => new Map(h));
      d = mT(e, d, l);
      let f = QT(e, d);
      return new Js(e, d, c, f);
    }
  };
var qs = "@",
  hy = "@.disabled",
  ta = class {
    constructor(e, n, r, i) {
      (this.namespaceId = e),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, n) {
      return this.delegate.createElement(e, n);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, n) {
      this.delegate.appendChild(e, n),
        this.engine.onInsert(this.namespaceId, n, e, !1);
    }
    insertBefore(e, n, r, i = !0) {
      this.delegate.insertBefore(e, n, r),
        this.engine.onInsert(this.namespaceId, n, e, i);
    }
    removeChild(e, n, r) {
      this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(e, n) {
      return this.delegate.selectRootElement(e, n);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, n, r, i) {
      this.delegate.setAttribute(e, n, r, i);
    }
    removeAttribute(e, n, r) {
      this.delegate.removeAttribute(e, n, r);
    }
    addClass(e, n) {
      this.delegate.addClass(e, n);
    }
    removeClass(e, n) {
      this.delegate.removeClass(e, n);
    }
    setStyle(e, n, r, i) {
      this.delegate.setStyle(e, n, r, i);
    }
    removeStyle(e, n, r) {
      this.delegate.removeStyle(e, n, r);
    }
    setProperty(e, n, r) {
      n.charAt(0) == qs && n == hy
        ? this.disableAnimations(e, !!r)
        : this.delegate.setProperty(e, n, r);
    }
    setValue(e, n) {
      this.delegate.setValue(e, n);
    }
    listen(e, n, r) {
      return this.delegate.listen(e, n, r);
    }
    disableAnimations(e, n) {
      this.engine.disableAnimations(e, n);
    }
  },
  Ku = class extends ta {
    constructor(e, n, r, i, o) {
      super(n, r, i, o), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == qs
        ? n.charAt(1) == "." && n == hy
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == qs) {
        let i = YT(e),
          o = n.slice(1),
          s = "";
        return (
          o.charAt(0) != qs && ([o, s] = ZT(o)),
          this.engine.listen(this.namespaceId, i, o, s, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function YT(t) {
  switch (t) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return t;
  }
}
function ZT(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var na = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, o) => {
        let s = o?.parentNode(i);
        s && o.removeChild(s, i);
      });
  }
  createRenderer(e, n) {
    let r = "",
      i = this.delegate.createRenderer(e, n);
    if (!e || !n?.data?.animation) {
      let l = this._rendererCache,
        u = l.get(i);
      if (!u) {
        let d = () => l.delete(i);
        (u = new ta(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let o = n.id,
      s = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(s, e);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(o, s, e, l.name, l);
    };
    return n.data.animation.forEach(a), new Ku(this, s, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, n, r) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var JT = (() => {
  let e = class e extends gr {
    constructor(r, i, o) {
      super(r, i, o, g(Qn, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ve), E(Sn), E(Tn));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function eM() {
  return new Qs();
}
function tM(t, e, n) {
  return new na(t, e, n);
}
var py = [
    { provide: Tn, useFactory: eM },
    { provide: gr, useClass: JT },
    { provide: dn, useFactory: tM, deps: [Ds, gr, G] },
  ],
  nM = [
    { provide: Sn, useFactory: () => new ea() },
    { provide: Gc, useValue: "BrowserAnimations" },
    ...py,
  ],
  YP = [
    { provide: Sn, useClass: Ju },
    { provide: Gc, useValue: "NoopAnimations" },
    ...py,
  ];
function gy() {
  return Gt("NgEagerAnimations"), [...nM];
}
var my = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Qe({ type: e, bootstrap: [Vm] })),
    (e.ɵinj = We({ providers: [jg(), gy()], imports: [Bl, _m] }));
  let t = e;
  return t;
})();
kg()
  .bootstrapModule(my)
  .catch((t) => console.error(t));

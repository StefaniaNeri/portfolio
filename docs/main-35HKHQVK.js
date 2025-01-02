var ky = Object.defineProperty,
  Ly = Object.defineProperties;
var jy = Object.getOwnPropertyDescriptors;
var Pi = Object.getOwnPropertySymbols;
var Cd = Object.prototype.hasOwnProperty,
  Id = Object.prototype.propertyIsEnumerable;
var bd = (t, e, n) =>
    e in t
      ? ky(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  v = (t, e) => {
    for (var n in (e ||= {})) Cd.call(e, n) && bd(t, n, e[n]);
    if (Pi) for (var n of Pi(e)) Id.call(e, n) && bd(t, n, e[n]);
    return t;
  },
  se = (t, e) => Ly(t, jy(e));
var Fi = (t, e) => {
  var n = {};
  for (var r in t) Cd.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Pi)
    for (var r of Pi(t)) e.indexOf(r) < 0 && Id.call(t, r) && (n[r] = t[r]);
  return n;
};
var ki = (t, e, n) =>
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
var Sd = null;
var la = 1,
  Md = Symbol("SIGNAL");
function q(t) {
  let e = Sd;
  return (Sd = t), e;
}
var Td = {
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
function Vy(t) {
  if (!(fa(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === la)) {
    if (!t.producerMustRecompute(t) && !ua(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = la);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = la);
  }
}
function _d(t) {
  return t && (t.nextProducerIndex = 0), q(t);
}
function Ad(t, e) {
  if (
    (q(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (fa(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        da(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function ua(t) {
  Li(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (Vy(n), r !== n.version)) return !0;
  }
  return !1;
}
function xd(t) {
  if ((Li(t), fa(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      da(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function da(t, e) {
  if (($y(t), Li(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      da(t.producerNode[r], t.producerIndexOfThis[r]);
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
    Li(i), (i.producerIndexOfThis[r] = e);
  }
}
function fa(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Li(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function $y(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function By() {
  throw new Error();
}
var Uy = By;
function Nd(t) {
  Uy = t;
}
function N(t) {
  return typeof t == "function";
}
function An(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var ji = An(
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
function Er(t, e) {
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
          e = o instanceof ji ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Rd(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof ji ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new ji(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) Rd(e);
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
    n === e ? (this._parentage = null) : Array.isArray(n) && Er(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && Er(n, e), e instanceof t && e._removeParent(this);
  }
};
ce.EMPTY = (() => {
  let t = new ce();
  return (t.closed = !0), t;
})();
var ha = ce.EMPTY;
function Vi(t) {
  return (
    t instanceof ce ||
    (t && "closed" in t && N(t.remove) && N(t.add) && N(t.unsubscribe))
  );
}
function Rd(t) {
  N(t) ? t() : t.unsubscribe();
}
var Xe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var xn = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = xn;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = xn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function $i(t) {
  xn.setTimeout(() => {
    let { onUnhandledError: e } = Xe;
    if (e) e(t);
    else throw t;
  });
}
function br() {}
var Od = pa("C", void 0, void 0);
function Pd(t) {
  return pa("E", void 0, t);
}
function Fd(t) {
  return pa("N", t, void 0);
}
function pa(t, e, n) {
  return { kind: t, value: e, error: n };
}
var rn = null;
function Nn(t) {
  if (Xe.useDeprecatedSynchronousErrorHandling) {
    let e = !rn;
    if ((e && (rn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = rn;
      if (((rn = null), n)) throw r;
    }
  } else t();
}
function kd(t) {
  Xe.useDeprecatedSynchronousErrorHandling &&
    rn &&
    ((rn.errorThrown = !0), (rn.error = t));
}
var on = class extends ce {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Vi(e) && e.add(this))
          : (this.destination = qy);
    }
    static create(e, n, r) {
      return new Rn(e, n, r);
    }
    next(e) {
      this.isStopped ? ma(Fd(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? ma(Pd(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? ma(Od, this) : ((this.isStopped = !0), this._complete());
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
  Hy = Function.prototype.bind;
function ga(t, e) {
  return Hy.call(t, e);
}
var ya = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          Bi(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          Bi(r);
        }
      else Bi(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          Bi(n);
        }
    }
  },
  Rn = class extends on {
    constructor(e, n, r) {
      super();
      let i;
      if (N(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && Xe.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && ga(e.next, o),
              error: e.error && ga(e.error, o),
              complete: e.complete && ga(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new ya(i);
    }
  };
function Bi(t) {
  Xe.useDeprecatedSynchronousErrorHandling ? kd(t) : $i(t);
}
function zy(t) {
  throw t;
}
function ma(t, e) {
  let { onStoppedNotification: n } = Xe;
  n && xn.setTimeout(() => n(t, e));
}
var qy = { closed: !0, next: br, error: zy, complete: br };
var On = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Ae(t) {
  return t;
}
function va(...t) {
  return Da(t);
}
function Da(t) {
  return t.length === 0
    ? Ae
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
      let o = Wy(n) ? n : new Rn(n, r, i);
      return (
        Nn(() => {
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
        (r = Ld(r)),
        new r((i, o) => {
          let s = new Rn({
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
    [On]() {
      return this;
    }
    pipe(...n) {
      return Da(n)(this);
    }
    toPromise(n) {
      return (
        (n = Ld(n)),
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
function Ld(t) {
  var e;
  return (e = t ?? Xe.Promise) !== null && e !== void 0 ? e : Promise;
}
function Gy(t) {
  return t && N(t.next) && N(t.error) && N(t.complete);
}
function Wy(t) {
  return (t && t instanceof on) || (Gy(t) && Vi(t));
}
function wa(t) {
  return N(t?.lift);
}
function V(t) {
  return (e) => {
    if (wa(e))
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
function $(t, e, n, r, i) {
  return new Ea(t, e, n, r, i);
}
var Ea = class extends on {
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
function Pn() {
  return V((t, e) => {
    let n = null;
    t._refCount++;
    let r = $(e, void 0, void 0, void 0, () => {
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
var Fn = class extends U {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      wa(e) && (this.lift = e.lift);
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
          $(
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
    return Pn()(this);
  }
};
var jd = An(
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
        let r = new Ui(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new jd();
      }
      next(n) {
        Nn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Nn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Nn(() => {
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
          ? ha
          : ((this.currentObservers = null),
            o.push(n),
            new ce(() => {
              (this.currentObservers = null), Er(o, n);
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
    return (t.create = (e, n) => new Ui(e, n)), t;
  })(),
  Ui = class extends we {
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
        : ha;
    }
  };
var ye = class extends we {
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
var xe = new U((t) => t.complete());
function Vd(t) {
  return t && N(t.schedule);
}
function $d(t) {
  return t[t.length - 1];
}
function Bd(t) {
  return N($d(t)) ? t.pop() : void 0;
}
function jt(t) {
  return Vd($d(t)) ? t.pop() : void 0;
}
function Hd(t, e, n, r) {
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
function Ud(t) {
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
function sn(t) {
  return this instanceof sn ? ((this.v = t), this) : new sn(t);
}
function zd(t, e, n) {
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
        return new Promise(function (x, T) {
          o.push([h, y, x, T]) > 1 || c(h, y);
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
    h.value instanceof sn
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
function qd(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof Ud == "function" ? Ud(t) : t[Symbol.iterator]()),
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
var Hi = (t) => t && typeof t.length == "number" && typeof t != "function";
function zi(t) {
  return N(t?.then);
}
function qi(t) {
  return N(t[On]);
}
function Gi(t) {
  return Symbol.asyncIterator && N(t?.[Symbol.asyncIterator]);
}
function Wi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Qy() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Qi = Qy();
function Ki(t) {
  return N(t?.[Qi]);
}
function Yi(t) {
  return zd(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield sn(n.read());
        if (i) return yield sn(void 0);
        yield yield sn(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Zi(t) {
  return N(t?.getReader);
}
function he(t) {
  if (t instanceof U) return t;
  if (t != null) {
    if (qi(t)) return Ky(t);
    if (Hi(t)) return Yy(t);
    if (zi(t)) return Zy(t);
    if (Gi(t)) return Gd(t);
    if (Ki(t)) return Xy(t);
    if (Zi(t)) return Jy(t);
  }
  throw Wi(t);
}
function Ky(t) {
  return new U((e) => {
    let n = t[On]();
    if (N(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Yy(t) {
  return new U((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function Zy(t) {
  return new U((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, $i);
  });
}
function Xy(t) {
  return new U((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function Gd(t) {
  return new U((e) => {
    ev(t, e).catch((n) => e.error(n));
  });
}
function Jy(t) {
  return Gd(Yi(t));
}
function ev(t, e) {
  var n, r, i, o;
  return Hd(this, void 0, void 0, function* () {
    try {
      for (n = qd(t); (r = yield n.next()), !r.done; ) {
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
function Xi(t, e = 0) {
  return V((n, r) => {
    n.subscribe(
      $(
        r,
        (i) => Ee(r, t, () => r.next(i), e),
        () => Ee(r, t, () => r.complete(), e),
        (i) => Ee(r, t, () => r.error(i), e)
      )
    );
  });
}
function Ji(t, e = 0) {
  return V((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function Wd(t, e) {
  return he(t).pipe(Ji(e), Xi(e));
}
function Qd(t, e) {
  return he(t).pipe(Ji(e), Xi(e));
}
function Kd(t, e) {
  return new U((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function Yd(t, e) {
  return new U((n) => {
    let r;
    return (
      Ee(n, e, () => {
        (r = t[Qi]()),
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
function eo(t, e) {
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
function Zd(t, e) {
  return eo(Yi(t), e);
}
function Xd(t, e) {
  if (t != null) {
    if (qi(t)) return Wd(t, e);
    if (Hi(t)) return Kd(t, e);
    if (zi(t)) return Qd(t, e);
    if (Gi(t)) return eo(t, e);
    if (Ki(t)) return Yd(t, e);
    if (Zi(t)) return Zd(t, e);
  }
  throw Wi(t);
}
function ie(t, e) {
  return e ? Xd(t, e) : he(t);
}
function _(...t) {
  let e = jt(t);
  return ie(t, e);
}
function kn(t, e) {
  let n = N(t) ? t : () => t,
    r = (i) => i.error(n());
  return new U(e ? (i) => e.schedule(r, 0, i) : r);
}
function ba(t) {
  return !!t && (t instanceof U || (N(t.lift) && N(t.subscribe)));
}
var It = An(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function L(t, e) {
  return V((n, r) => {
    let i = 0;
    n.subscribe(
      $(r, (o) => {
        r.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: tv } = Array;
function nv(t, e) {
  return tv(e) ? t(...e) : t(e);
}
function Jd(t) {
  return L((e) => nv(t, e));
}
var { isArray: rv } = Array,
  { getPrototypeOf: iv, prototype: ov, keys: sv } = Object;
function ef(t) {
  if (t.length === 1) {
    let e = t[0];
    if (rv(e)) return { args: e, keys: null };
    if (av(e)) {
      let n = sv(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function av(t) {
  return t && typeof t == "object" && iv(t) === ov;
}
function tf(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function Cr(...t) {
  let e = jt(t),
    n = Bd(t),
    { args: r, keys: i } = ef(t);
  if (r.length === 0) return ie([], e);
  let o = new U(cv(r, e, i ? (s) => tf(i, s) : Ae));
  return n ? o.pipe(Jd(n)) : o;
}
function cv(t, e, n = Ae) {
  return (r) => {
    nf(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          nf(
            e,
            () => {
              let l = ie(t[c], e),
                u = !1;
              l.subscribe(
                $(
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
function nf(t, e, n) {
  t ? Ee(n, t, e) : e();
}
function rf(t, e, n, r, i, o, s, a) {
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
      let x = !1;
      he(n(y, u++)).subscribe(
        $(
          e,
          (T) => {
            i?.(T), o ? h(T) : e.next(T);
          },
          () => {
            x = !0;
          },
          void 0,
          () => {
            if (x)
              try {
                for (l--; c.length && l < r; ) {
                  let T = c.shift();
                  s ? Ee(e, s, () => p(T)) : p(T);
                }
                f();
              } catch (T) {
                e.error(T);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      $(e, h, () => {
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
    : (typeof e == "number" && (n = e), V((r, i) => rf(r, i, t, n)));
}
function Ln(t = 1 / 0) {
  return ae(Ae, t);
}
function of() {
  return Ln(1);
}
function jn(...t) {
  return of()(ie(t, jt(t)));
}
function to(t) {
  return new U((e) => {
    he(t()).subscribe(e);
  });
}
function Ne(t, e) {
  return V((n, r) => {
    let i = 0;
    n.subscribe($(r, (o) => t.call(e, o, i++) && r.next(o)));
  });
}
function Vt(t) {
  return V((e, n) => {
    let r = null,
      i = !1,
      o;
    (r = e.subscribe(
      $(n, void 0, void 0, (s) => {
        (o = he(t(s, Vt(t)(e)))),
          r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
      })
    )),
      i && (r.unsubscribe(), (r = null), o.subscribe(n));
  });
}
function sf(t, e, n, r, i) {
  return (o, s) => {
    let a = n,
      c = e,
      l = 0;
    o.subscribe(
      $(
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
function $t(t, e) {
  return N(e) ? ae(t, e, 1) : ae(t, 1);
}
function Bt(t) {
  return V((e, n) => {
    let r = !1;
    e.subscribe(
      $(
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
function St(t) {
  return t <= 0
    ? () => xe
    : V((e, n) => {
        let r = 0;
        e.subscribe(
          $(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          })
        );
      });
}
function Ca(t) {
  return L(() => t);
}
function no(t = lv) {
  return V((e, n) => {
    let r = !1;
    e.subscribe(
      $(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t()))
      )
    );
  });
}
function lv() {
  return new It();
}
function Vn(t) {
  return V((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Je(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? Ne((i, o) => t(i, o, r)) : Ae,
      St(1),
      n ? Bt(e) : no(() => new It())
    );
}
function $n(t) {
  return t <= 0
    ? () => xe
    : V((e, n) => {
        let r = [];
        e.subscribe(
          $(
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
function Ia(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? Ne((i, o) => t(i, o, r)) : Ae,
      $n(1),
      n ? Bt(e) : no(() => new It())
    );
}
function Sa(t, e) {
  return V(sf(t, e, arguments.length >= 2, !0));
}
function Ma(...t) {
  let e = jt(t);
  return V((n, r) => {
    (e ? jn(t, n, e) : jn(t, n)).subscribe(r);
  });
}
function Re(t, e) {
  return V((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      $(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = o++;
          he(t(c, u)).subscribe(
            (i = $(
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
function Ta(t) {
  return V((e, n) => {
    he(t).subscribe($(n, () => n.complete(), br)), !n.closed && e.subscribe(n);
  });
}
function le(t, e, n) {
  let r = N(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? V((i, o) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        i.subscribe(
          $(
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
    : Ae;
}
var Gf = "https://g.co/ng/security#xss",
  m = class extends Error {
    constructor(e, n) {
      super(Lo(e, n)), (this.code = e);
    }
  };
function Lo(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function jr(t) {
  return { toString: t }.toString();
}
var ro = "__parameters__";
function uv(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Wf(t, e, n) {
  return jr(() => {
    let r = uv(e);
    function i(...o) {
      if (this instanceof i) return r.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(ro)
          ? c[ro]
          : Object.defineProperty(c, ro, { value: [] })[ro];
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
var Oe = globalThis;
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
function af(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var dv = K({ __forward_ref__: K });
function Qf(t) {
  return (
    (t.__forward_ref__ = Qf),
    (t.toString = function () {
      return be(this());
    }),
    t
  );
}
function ze(t) {
  return Kf(t) ? t() : t;
}
function Kf(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(dv) && t.__forward_ref__ === Qf
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
function jo(t) {
  return cf(t, Zf) || cf(t, Xf);
}
function Yf(t) {
  return jo(t) !== null;
}
function cf(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function fv(t) {
  let e = t && (t[Zf] || t[Xf]);
  return e || null;
}
function lf(t) {
  return t && (t.hasOwnProperty(uf) || t.hasOwnProperty(hv)) ? t[uf] : null;
}
var Zf = K({ ɵprov: K }),
  uf = K({ ɵinj: K }),
  Xf = K({ ngInjectableDef: K }),
  hv = K({ ngInjectorDef: K }),
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
function Jf(t) {
  return t && !!t.ɵproviders;
}
var pv = K({ ɵcmp: K }),
  gv = K({ ɵdir: K }),
  mv = K({ ɵpipe: K }),
  yv = K({ ɵmod: K }),
  go = K({ ɵfac: K }),
  Sr = K({ __NG_ELEMENT_ID__: K }),
  df = K({ __NG_ENV_ID__: K });
function Vo(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function vv(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Vo(t);
}
function Dv(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new m(-200, t);
}
function kc(t, e) {
  throw new m(-201, !1);
}
var P = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(P || {}),
  Ua;
function eh() {
  return Ua;
}
function He(t) {
  let e = Ua;
  return (Ua = t), e;
}
function th(t, e, n) {
  let r = jo(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & P.Optional) return null;
  if (e !== void 0) return e;
  kc(t, "Injector");
}
var wv = {},
  Tr = wv,
  Ha = "__NG_DI_FLAG__",
  mo = "ngTempTokenPath",
  Ev = "ngTokenPath",
  bv = /\n/gm,
  Cv = "\u0275",
  ff = "__source",
  qn;
function Iv() {
  return qn;
}
function Ut(t) {
  let e = qn;
  return (qn = t), e;
}
function Sv(t, e = P.Default) {
  if (qn === void 0) throw new m(-203, !1);
  return qn === null
    ? th(t, void 0, e)
    : qn.get(t, e & P.Optional ? null : void 0, e);
}
function E(t, e = P.Default) {
  return (eh() || Sv)(ze(t), e);
}
function g(t, e = P.Default) {
  return E(t, $o(e));
}
function $o(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function za(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = ze(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new m(900, !1);
      let i,
        o = P.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Mv(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(E(i, o));
    } else e.push(E(r));
  }
  return e;
}
function nh(t, e) {
  return (t[Ha] = e), (t.prototype[Ha] = e), t;
}
function Mv(t) {
  return t[Ha];
}
function Tv(t, e, n, r) {
  let i = t[mo];
  throw (
    (e[ff] && i.unshift(e[ff]),
    (t.message = _v(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[Ev] = i),
    (t[mo] = null),
    t)
  );
}
function _v(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Cv
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
    bv,
    `
  `
  )}`;
}
var Bo = nh(Wf("Optional"), 8);
var Lc = nh(Wf("SkipSelf"), 4);
function Wn(t, e) {
  let n = t.hasOwnProperty(go);
  return n ? t[go] : null;
}
function Av(t, e, n) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; r++) {
    let i = t[r],
      o = e[r];
    if ((n && ((i = n(i)), (o = n(o))), o !== i)) return !1;
  }
  return !0;
}
function xv(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function jc(t, e) {
  t.forEach((n) => (Array.isArray(n) ? jc(n, e) : e(n)));
}
function rh(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function yo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Nv(t, e, n, r) {
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
function Rv(t, e, n) {
  let r = Vr(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), Nv(t, r, e, n)), r;
}
function _a(t, e) {
  let n = Vr(t, e);
  if (n >= 0) return t[n | 1];
}
function Vr(t, e) {
  return Ov(t, e, 1);
}
function Ov(t, e, n) {
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
var _r = {},
  qe = [],
  cn = new S(""),
  ih = new S("", -1),
  oh = new S(""),
  vo = class {
    get(e, n = Tr) {
      if (n === Tr) {
        let r = new Error(`NullInjectorError: No provider for ${be(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  sh = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(sh || {}),
  ft = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(ft || {}),
  Tt = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(Tt || {});
function Pv(t, e, n) {
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
function qa(t, e, n) {
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
      kv(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
    }
  }
  return r;
}
function Fv(t) {
  return t === 3 || t === 4 || t === 6;
}
function kv(t) {
  return t.charCodeAt(0) === 64;
}
function Vc(t, e) {
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
              ? hf(t, n, i, null, e[++r])
              : hf(t, n, i, null, null));
      }
    }
  return t;
}
function hf(t, e, n, r, i) {
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
var ah = "ng-template";
function Lv(t, e, n, r) {
  let i = 0;
  if (r) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && Pv(e[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if ($c(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == "string"; )
      if (o.toLowerCase() === n) return !0;
  }
  return !1;
}
function $c(t) {
  return t.type === 4 && t.value !== ah;
}
function jv(t, e, n) {
  let r = t.type === 4 && !n ? ah : t.value;
  return e === r;
}
function Vv(t, e, n) {
  let r = 4,
    i = t.attrs,
    o = i !== null ? Uv(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !et(r) && !et(c)) return !1;
      if (s && et(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !jv(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (et(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (i === null || !Lv(t, i, c, n)) {
          if (et(r)) return !1;
          s = !0;
        }
      } else {
        let l = e[++a],
          u = $v(c, i, $c(t), n);
        if (u === -1) {
          if (et(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > o ? (d = "") : (d = i[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (et(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return et(r) || s;
}
function et(t) {
  return (t & 1) === 0;
}
function $v(t, e, n, r) {
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
  } else return Hv(e, t);
}
function Bv(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (Vv(t, e[r], n)) return !0;
  return !1;
}
function Uv(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (Fv(n)) return e;
  }
  return t.length;
}
function Hv(t, e) {
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
function pf(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function zv(t) {
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
      i !== "" && !et(s) && ((e += pf(o, i)), (i = "")),
        (r = s),
        (o = o || !et(r));
    n++;
  }
  return i !== "" && (e += pf(o, i)), e;
}
function qv(t) {
  return t.map(zv).join(",");
}
function Gv(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++r]) : i === 8 && n.push(o);
    else {
      if (!et(i)) break;
      i = o;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function oe(t) {
  return jr(() => {
    let e = fh(t),
      n = se(v({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === sh.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || ft.Emulated,
        styles: t.styles || qe,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    hh(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = mf(r, !1)), (n.pipeDefs = mf(r, !0)), (n.id = Kv(n)), n
    );
  });
}
function Wv(t) {
  return zt(t) || ch(t);
}
function Qv(t) {
  return t !== null;
}
function Qe(t) {
  return jr(() => ({
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
function gf(t, e) {
  if (t == null) return _r;
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
function gn(t) {
  return jr(() => {
    let e = fh(t);
    return hh(e), e;
  });
}
function zt(t) {
  return t[pv] || null;
}
function ch(t) {
  return t[gv] || null;
}
function lh(t) {
  return t[mv] || null;
}
function uh(t) {
  let e = zt(t) || ch(t) || lh(t);
  return e !== null ? e.standalone : !1;
}
function dh(t, e) {
  let n = t[yv] || null;
  if (!n && e === !0)
    throw new Error(`Type ${be(t)} does not have '\u0275mod' property.`);
  return n;
}
function fh(t) {
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
    inputConfig: t.inputs || _r,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || qe,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: gf(t.inputs, e),
    outputs: gf(t.outputs),
    debugInfo: null,
  };
}
function hh(t) {
  t.features?.forEach((e) => e(t));
}
function mf(t, e) {
  if (!t) return null;
  let n = e ? lh : Wv;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(Qv);
}
function Kv(t) {
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
function $r(t) {
  return { ɵproviders: t };
}
function Yv(...t) {
  return { ɵproviders: ph(!0, t), ɵfromNgModule: !0 };
}
function ph(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    jc(e, (s) => {
      let a = s;
      Ga(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && gh(i, o),
    n
  );
}
function gh(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    Bc(i, (o) => {
      e(o, r);
    });
  }
}
function Ga(t, e, n, r) {
  if (((t = ze(t)), !t)) return !1;
  let i = null,
    o = lf(t),
    s = !o && zt(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = lf(c)), o)) i = c;
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
      for (let l of c) Ga(l, e, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let l;
      try {
        jc(o.imports, (u) => {
          Ga(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && gh(l, e);
    }
    if (!a) {
      let l = Wn(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: qe }, i),
        e({ provide: oh, useValue: i, multi: !0 }, i),
        e({ provide: cn, useValue: () => E(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      Bc(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Bc(t, e) {
  for (let n of t)
    Jf(n) && (n = n.ɵproviders), Array.isArray(n) ? Bc(n, e) : e(n);
}
var Zv = K({ provide: String, useValue: K });
function mh(t) {
  return t !== null && typeof t == "object" && Zv in t;
}
function Xv(t) {
  return !!(t && t.useExisting);
}
function Jv(t) {
  return !!(t && t.useFactory);
}
function Wa(t) {
  return typeof t == "function";
}
var Uo = new S(""),
  co = {},
  eD = {},
  Aa;
function Uc() {
  return Aa === void 0 && (Aa = new vo()), Aa;
}
var Ie = class {},
  Ar = class extends Ie {
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
        Ka(e, (s) => this.processProvider(s)),
        this.records.set(ih, Bn(void 0, this)),
        i.has("environment") && this.records.set(Ie, Bn(void 0, this));
      let o = this.records.get(Uo);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(oh, qe, P.Self)));
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
      let n = Ut(this),
        r = He(void 0),
        i;
      try {
        return e();
      } finally {
        Ut(n), He(r);
      }
    }
    get(e, n = Tr, r = P.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(df))) return e[df](this);
      r = $o(r);
      let i,
        o = Ut(this),
        s = He(void 0);
      try {
        if (!(r & P.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = sD(e) && jo(e);
            l && this.injectableDefInScope(l)
              ? (c = Bn(Qa(e), co))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & P.Self ? Uc() : this.parent;
        return (n = r & P.Optional && n === Tr ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[mo] = a[mo] || []).unshift(be(e)), o)) throw a;
          return Tv(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        He(s), Ut(o);
      }
    }
    resolveInjectorInitializers() {
      let e = q(null),
        n = Ut(this),
        r = He(void 0),
        i;
      try {
        let o = this.get(cn, qe, P.Self);
        for (let s of o) s();
      } finally {
        Ut(n), He(r), q(e);
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
      let n = Wa(e) ? e : ze(e && e.provide),
        r = nD(e);
      if (!Wa(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = Bn(void 0, co, !0)),
          (i.factory = () => za(i.multi)),
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
          n.value === co && ((n.value = eD), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            oD(n.value) &&
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
function Qa(t) {
  let e = jo(t),
    n = e !== null ? e.factory : Wn(t);
  if (n !== null) return n;
  if (t instanceof S) throw new m(204, !1);
  if (t instanceof Function) return tD(t);
  throw new m(204, !1);
}
function tD(t) {
  if (t.length > 0) throw new m(204, !1);
  let n = fv(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function nD(t) {
  if (mh(t)) return Bn(void 0, t.useValue);
  {
    let e = rD(t);
    return Bn(e, co);
  }
}
function rD(t, e, n) {
  let r;
  if (Wa(t)) {
    let i = ze(t);
    return Wn(i) || Qa(i);
  } else if (mh(t)) r = () => ze(t.useValue);
  else if (Jv(t)) r = () => t.useFactory(...za(t.deps || []));
  else if (Xv(t)) r = () => E(ze(t.useExisting));
  else {
    let i = ze(t && (t.useClass || t.provide));
    if (iD(t)) r = () => new i(...za(t.deps));
    else return Wn(i) || Qa(i);
  }
  return r;
}
function Bn(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function iD(t) {
  return !!t.deps;
}
function oD(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function sD(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof S);
}
function Ka(t, e) {
  for (let n of t)
    Array.isArray(n) ? Ka(n, e) : n && Jf(n) ? Ka(n.ɵproviders, e) : e(n);
}
function pt(t, e) {
  t instanceof Ar && t.assertNotDestroyed();
  let n,
    r = Ut(t),
    i = He(void 0);
  try {
    return e();
  } finally {
    Ut(r), He(i);
  }
}
function yh() {
  return eh() !== void 0 || Iv() != null;
}
function aD(t) {
  if (!yh()) throw new m(-203, !1);
}
function cD(t) {
  let e = Oe.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function lD(t) {
  return typeof t == "function";
}
var Pe = 0,
  O = 1,
  A = 2,
  ge = 3,
  tt = 4,
  ot = 5,
  nt = 6,
  xr = 7,
  _t = 8,
  Qn = 9,
  rt = 10,
  J = 11,
  Nr = 12,
  yf = 13,
  Br = 14,
  Ge = 15,
  Ur = 16,
  Un = 17,
  At = 18,
  Ho = 19,
  vh = 20,
  Ht = 21,
  xa = 22,
  ln = 23,
  Fe = 25,
  Dh = 1,
  Rr = 6,
  xt = 7,
  Do = 8,
  Kn = 9,
  Ce = 10,
  Hc = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(Hc || {});
function Mt(t) {
  return Array.isArray(t) && typeof t[Dh] == "object";
}
function gt(t) {
  return Array.isArray(t) && t[Dh] === !0;
}
function wh(t) {
  return (t.flags & 4) !== 0;
}
function Hr(t) {
  return t.componentOffset > -1;
}
function zc(t) {
  return (t.flags & 1) === 1;
}
function zr(t) {
  return !!t.template;
}
function Eh(t) {
  return (t[A] & 512) !== 0;
}
var Ya = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function bh(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function zo() {
  return Ch;
}
function Ch(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = dD), uD;
}
zo.ngInherit = !0;
function uD() {
  let t = Sh(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === _r) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function dD(t, e, n, r, i) {
  let o = this.declaredInputs[r],
    s = Sh(t) || fD(t, { previous: _r, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[o];
  (a[o] = new Ya(l && l.currentValue, n, c === _r)), bh(t, e, i, n);
}
var Ih = "__ngSimpleChanges__";
function Sh(t) {
  return t[Ih] || null;
}
function fD(t, e) {
  return (t[Ih] = e);
}
var vf = null;
var ut = function (t, e, n) {
    vf?.(t, e, n);
  },
  hD = "svg",
  pD = "math",
  gD = !1;
function mD() {
  return gD;
}
function it(t) {
  for (; Array.isArray(t); ) t = t[Pe];
  return t;
}
function Mh(t, e) {
  return it(e[t]);
}
function ke(t, e) {
  return it(e[t.index]);
}
function Th(t, e) {
  return t.data[e];
}
function Gt(t, e) {
  let n = e[t];
  return Mt(n) ? n : n[Pe];
}
function yD(t) {
  return (t[A] & 4) === 4;
}
function qc(t) {
  return (t[A] & 128) === 128;
}
function vD(t) {
  return gt(t[ge]);
}
function wo(t, e) {
  return e == null ? null : t[e];
}
function _h(t) {
  t[Un] = 0;
}
function DD(t) {
  t[A] & 1024 || ((t[A] |= 1024), qc(t) && Or(t));
}
function Gc(t) {
  return !!(t[A] & 9216 || t[ln]?.dirty);
}
function Za(t) {
  t[rt].changeDetectionScheduler?.notify(1),
    Gc(t)
      ? Or(t)
      : t[A] & 64 &&
        (mD()
          ? ((t[A] |= 1024), Or(t))
          : t[rt].changeDetectionScheduler?.notify());
}
function Or(t) {
  t[rt].changeDetectionScheduler?.notify();
  let e = Pr(t);
  for (; e !== null && !(e[A] & 8192 || ((e[A] |= 8192), !qc(e))); ) e = Pr(e);
}
function Ah(t, e) {
  if ((t[A] & 256) === 256) throw new m(911, !1);
  t[Ht] === null && (t[Ht] = []), t[Ht].push(e);
}
function wD(t, e) {
  if (t[Ht] === null) return;
  let n = t[Ht].indexOf(e);
  n !== -1 && t[Ht].splice(n, 1);
}
function Pr(t) {
  let e = t[ge];
  return gt(e) ? e[ge] : e;
}
var j = { lFrame: kh(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function ED() {
  return j.lFrame.elementDepthCount;
}
function bD() {
  j.lFrame.elementDepthCount++;
}
function CD() {
  j.lFrame.elementDepthCount--;
}
function xh() {
  return j.bindingsEnabled;
}
function qr() {
  return j.skipHydrationRootTNode !== null;
}
function ID(t) {
  return j.skipHydrationRootTNode === t;
}
function SD(t) {
  j.skipHydrationRootTNode = t;
}
function MD() {
  j.skipHydrationRootTNode = null;
}
function Y() {
  return j.lFrame.lView;
}
function Ke() {
  return j.lFrame.tView;
}
function st() {
  let t = Nh();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Nh() {
  return j.lFrame.currentTNode;
}
function TD() {
  let t = j.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Gr(t, e) {
  let n = j.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function Rh() {
  return j.lFrame.isParent;
}
function _D() {
  j.lFrame.isParent = !1;
}
function AD() {
  let t = j.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function xD(t) {
  return (j.lFrame.bindingIndex = t);
}
function Wc() {
  return j.lFrame.bindingIndex++;
}
function ND(t) {
  let e = j.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function RD() {
  return j.lFrame.inI18n;
}
function OD(t, e) {
  let n = j.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), Xa(e);
}
function PD() {
  return j.lFrame.currentDirectiveIndex;
}
function Xa(t) {
  j.lFrame.currentDirectiveIndex = t;
}
function FD(t) {
  let e = j.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function Oh() {
  return j.lFrame.currentQueryIndex;
}
function Qc(t) {
  j.lFrame.currentQueryIndex = t;
}
function kD(t) {
  let e = t[O];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[ot] : null;
}
function Ph(t, e, n) {
  if (n & P.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(n & P.Host); )
      if (((i = kD(o)), i === null || ((o = o[Br]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let r = (j.lFrame = Fh());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Kc(t) {
  let e = Fh(),
    n = t[O];
  (j.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function Fh() {
  let t = j.lFrame,
    e = t === null ? null : t.child;
  return e === null ? kh(t) : e;
}
function kh(t) {
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
function Lh() {
  let t = j.lFrame;
  return (j.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var jh = Lh;
function Yc() {
  let t = Lh();
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
function tr() {
  return j.lFrame.selectedIndex;
}
function un(t) {
  j.lFrame.selectedIndex = t;
}
function Zc() {
  let t = j.lFrame;
  return Th(t.tView, t.selectedIndex);
}
function Vh() {
  return j.lFrame.currentNamespace;
}
var $h = !0;
function Xc() {
  return $h;
}
function mt(t) {
  $h = t;
}
function LD(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (r) {
    let s = Ch(e);
    (n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o));
}
function Jc(t, e) {
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
function lo(t, e, n) {
  Bh(t, e, 3, n);
}
function uo(t, e, n, r) {
  (t[A] & 3) === n && Bh(t, e, n, r);
}
function Na(t, e) {
  let n = t[A];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[A] = n));
}
function Bh(t, e, n, r) {
  let i = r !== void 0 ? t[Un] & 65535 : 0,
    o = r ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[Un] += 65536),
        (a < o || o == -1) &&
          (jD(t, n, e, c), (t[Un] = (t[Un] & 4294901760) + c + 2)),
        c++;
}
function Df(t, e) {
  ut(4, t, e);
  let n = q(null);
  try {
    e.call(t);
  } finally {
    q(n), ut(5, t, e);
  }
}
function jD(t, e, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = t[s];
  i
    ? t[A] >> 14 < t[Un] >> 16 &&
      (t[A] & 3) === e &&
      ((t[A] += 16384), Df(a, o))
    : Df(a, o);
}
var Gn = -1,
  Fr = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function VD(t) {
  return t instanceof Fr;
}
function $D(t) {
  return (t.flags & 8) !== 0;
}
function BD(t) {
  return (t.flags & 16) !== 0;
}
function Uh(t) {
  return t !== Gn;
}
function Eo(t) {
  return t & 32767;
}
function UD(t) {
  return t >> 16;
}
function bo(t, e) {
  let n = UD(t),
    r = e;
  for (; n > 0; ) (r = r[Br]), n--;
  return r;
}
var Ja = !0;
function wf(t) {
  let e = Ja;
  return (Ja = t), e;
}
var HD = 256,
  Hh = HD - 1,
  zh = 5,
  zD = 0,
  dt = {};
function qD(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Sr) && (r = n[Sr]),
    r == null && (r = n[Sr] = zD++);
  let i = r & Hh,
    o = 1 << i;
  e.data[t + (i >> zh)] |= o;
}
function qh(t, e) {
  let n = Gh(t, e);
  if (n !== -1) return n;
  let r = e[O];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Ra(r.data, t),
    Ra(e, null),
    Ra(r.blueprint, null));
  let i = el(t, e),
    o = t.injectorIndex;
  if (Uh(i)) {
    let s = Eo(i),
      a = bo(i, e),
      c = a[O].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function Ra(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Gh(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function el(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = Zh(i)), r === null)) return Gn;
    if ((n++, (i = i[Br]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Gn;
}
function GD(t, e, n) {
  qD(t, e, n);
}
function Wh(t, e, n) {
  if (n & P.Optional || t !== void 0) return t;
  kc(e, "NodeInjector");
}
function Qh(t, e, n, r) {
  if (
    (n & P.Optional && r === void 0 && (r = null), !(n & (P.Self | P.Host)))
  ) {
    let i = t[Qn],
      o = He(void 0);
    try {
      return i ? i.get(e, r, n & P.Optional) : th(e, r, n & P.Optional);
    } finally {
      He(o);
    }
  }
  return Wh(r, e, n);
}
function Kh(t, e, n, r = P.Default, i) {
  if (t !== null) {
    if (e[A] & 2048 && !(r & P.Self)) {
      let s = YD(t, e, n, r, dt);
      if (s !== dt) return s;
    }
    let o = Yh(t, e, n, r, dt);
    if (o !== dt) return o;
  }
  return Qh(e, n, r, i);
}
function Yh(t, e, n, r, i) {
  let o = QD(n);
  if (typeof o == "function") {
    if (!Ph(e, t, r)) return r & P.Host ? Wh(i, n, r) : Qh(e, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & P.Optional))) kc(n);
      else return s;
    } finally {
      jh();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Gh(t, e),
      c = Gn,
      l = r & P.Host ? e[Ge][ot] : null;
    for (
      (a === -1 || r & P.SkipSelf) &&
      ((c = a === -1 ? el(t, e) : e[a + 8]),
      c === Gn || !bf(r, !1)
        ? (a = -1)
        : ((s = e[O]), (a = Eo(c)), (e = bo(c, e))));
      a !== -1;

    ) {
      let u = e[O];
      if (Ef(o, a, u.data)) {
        let d = WD(a, e, n, s, r, l);
        if (d !== dt) return d;
      }
      (c = e[a + 8]),
        c !== Gn && bf(r, e[O].data[a + 8] === l) && Ef(o, a, e)
          ? ((s = u), (a = Eo(c)), (e = bo(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function WD(t, e, n, r, i, o) {
  let s = e[O],
    a = s.data[t + 8],
    c = r == null ? Hr(a) && Ja : r != s && (a.type & 3) !== 0,
    l = i & P.Host && o === a,
    u = fo(a, s, n, c, l);
  return u !== null ? Yn(e, s, u, a) : dt;
}
function fo(t, e, n, r, i) {
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
    if (h && zr(h) && h.type === n) return c;
  }
  return null;
}
function Yn(t, e, n, r) {
  let i = t[n],
    o = e.data;
  if (VD(i)) {
    let s = i;
    s.resolving && Dv(vv(o[n]));
    let a = wf(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? He(s.injectImpl) : null,
      u = Ph(t, r, P.Default);
    try {
      (i = t[n] = s.factory(void 0, o, t, r)),
        e.firstCreatePass && n >= r.directiveStart && LD(n, o[n], e);
    } finally {
      l !== null && He(l), wf(a), (s.resolving = !1), jh();
    }
  }
  return i;
}
function QD(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Sr) ? t[Sr] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Hh : KD) : e;
}
function Ef(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> zh)] & r);
}
function bf(t, e) {
  return !(t & P.Self) && !(t & P.Host && e);
}
var an = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return Kh(this._tNode, this._lView, e, $o(r), n);
  }
};
function KD() {
  return new an(st(), Y());
}
function tl(t) {
  return jr(() => {
    let e = t.prototype.constructor,
      n = e[go] || ec(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let o = i[go] || ec(i);
      if (o && o !== n) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function ec(t) {
  return Kf(t)
    ? () => {
        let e = ec(ze(t));
        return e && e();
      }
    : Wn(t);
}
function YD(t, e, n, r, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[A] & 2048 && !(s[A] & 512); ) {
    let a = Yh(o, s, n, r | P.Self, dt);
    if (a !== dt) return a;
    let c = o.parent;
    if (!c) {
      let l = s[vh];
      if (l) {
        let u = l.get(n, dt, r);
        if (u !== dt) return u;
      }
      (c = Zh(s)), (s = s[Br]);
    }
    o = c;
  }
  return i;
}
function Zh(t) {
  let e = t[O],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[ot] : null;
}
function Cf(t, e = null, n = null, r) {
  let i = Xh(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function Xh(t, e = null, n = null, r, i = new Set()) {
  let o = [n || qe, Yv(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : be(t))),
    new Ar(o, e || Uc(), r || null, i)
  );
}
var at = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Cf({ name: "" }, i, r, "");
      {
        let o = r.name ?? "";
        return Cf({ name: o }, r.parent, r.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Tr),
    (e.NULL = new vo()),
    (e.ɵprov = w({ token: e, providedIn: "any", factory: () => E(ih) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ZD = "ngOriginalError";
function Oa(t) {
  return t[ZD];
}
var ht = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && Oa(e);
      for (; n && Oa(n); ) n = Oa(n);
      return n || null;
    }
  },
  Jh = new S("", {
    providedIn: "root",
    factory: () => g(ht).handleError.bind(void 0),
  }),
  nl = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = XD), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  tc = class extends nl {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return Ah(this._lView, e), () => wD(this._lView, e);
    }
  };
function XD() {
  return new tc(Y());
}
function JD() {
  return nr(st(), Y());
}
function nr(t, e) {
  return new yt(ke(t, e));
}
var yt = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = JD;
  let t = e;
  return t;
})();
function ew(t) {
  return t instanceof yt ? t.nativeElement : t;
}
var nc = class extends we {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      yh() && (this.destroyRef = g(nl, { optional: !0 }) ?? void 0);
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
    this.__isAsync && ((o = Pa(o)), i && (i = Pa(i)), s && (s = Pa(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof ce && e.add(a), a;
  }
};
function Pa(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var pe = nc;
function tw() {
  return this._results[Symbol.iterator]();
}
var rc = class t {
    get changes() {
      return (this._changes ??= new pe());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._onDirty = void 0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let n = t.prototype;
      n[Symbol.iterator] || (n[Symbol.iterator] = tw);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, n) {
      return this._results.reduce(e, n);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, n) {
      this.dirty = !1;
      let r = xv(e);
      (this._changesDetected = !Av(this._results, r, n)) &&
        ((this._results = r),
        (this.length = r.length),
        (this.last = r[this.length - 1]),
        (this.first = r[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    onDirty(e) {
      this._onDirty = e;
    }
    setDirty() {
      (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  nw = "ngSkipHydration",
  rw = "ngskiphydration";
function ep(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let n = 0; n < e.length; n += 2) {
    let r = e[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === rw) return !0;
  }
  return !1;
}
function tp(t) {
  console.log(t);
  return t.hasAttribute(nw);
}
function Co(t) {
  return (t.flags & 128) === 128;
}
function iw(t) {
  if (Co(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if (Co(t) || ep(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var np = new Map(),
  ow = 0;
function sw() {
  return ow++;
}
function aw(t) {
  np.set(t[Ho], t);
}
function cw(t) {
  np.delete(t[Ho]);
}
var If = "__ngContext__";
function dn(t, e) {
  Mt(e) ? ((t[If] = e[Ho]), aw(e)) : (t[If] = e);
}
function rp(t) {
  return op(t[Nr]);
}
function ip(t) {
  return op(t[tt]);
}
function op(t) {
  for (; t !== null && !gt(t); ) t = t[tt];
  return t;
}
var ic;
function sp(t) {
  ic = t;
}
function qo() {
  if (ic !== void 0) return ic;
  if (typeof document < "u") return document;
  throw new m(210, !1);
}
var Wr = new S("", { providedIn: "root", factory: () => lw }),
  lw = "ng",
  rl = new S(""),
  te = new S("", { providedIn: "platform", factory: () => "unknown" });
var il = new S(""),
  ol = new S("", {
    providedIn: "root",
    factory: () =>
      qo().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function uw() {
  let t = new mn();
  return g(te) === "browser" && (t.store = dw(qo(), g(Wr))), t;
}
var mn = (() => {
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
  e.ɵprov = w({ token: e, providedIn: "root", factory: uw });
  let t = e;
  return t;
})();
function dw(t, e) {
  let n = t.getElementById(e + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + e, r);
    }
  return {};
}
var ap = "h",
  cp = "b",
  oc = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(oc || {}),
  fw = "e",
  hw = "t",
  sl = "c",
  lp = "x",
  Io = "r",
  pw = "i",
  gw = "n",
  mw = "d",
  yw = "__nghData__",
  up = yw,
  Fa = "ngh",
  vw = "nghm",
  dp = () => null;
function Dw(t, e, n = !1) {
  let r = t.getAttribute(Fa);
  if (r == null) return null;
  let [i, o] = r.split("|");
  if (((r = n ? o : i), !r)) return null;
  let s = o ? `|${o}` : "",
    a = n ? i : s,
    c = {};
  if (r !== "") {
    let u = e.get(mn, null, { optional: !0 });
    u !== null && (c = u.get(up, [])[Number(r)]);
  }
  let l = { data: c, firstChild: t.firstChild ?? null };
  return (
    n && ((l.firstChild = t), Go(l, 0, t.nextSibling)),
    a ? t.setAttribute(Fa, a) : t.removeAttribute(Fa),
    l
  );
}
function ww() {
  dp = Dw;
}
function al(t, e, n = !1) {
  return dp(t, e, n);
}
function Ew(t) {
  let e = t._lView;
  return e[O].type === 2 ? null : (Eh(e) && (e = e[Fe]), e);
}
function bw(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function Cw(t) {
  let e = qo(),
    n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(o) {
        let s = bw(o);
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
function Go(t, e, n) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = n);
}
function sc(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function Iw(t, e) {
  let n = t.data,
    r = n[fw]?.[e] ?? null;
  return r === null && n[sl]?.[e] && (r = cl(t, e)), r;
}
function fp(t, e) {
  return t.data[sl]?.[e] ?? null;
}
function cl(t, e) {
  let n = fp(t, e) ?? [],
    r = 0;
  for (let i of n) r += i[Io] * (i[lp] ?? 1);
  return r;
}
function Wo(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let n = t.data[mw];
    t.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var io = new S(""),
  hp = !1,
  pp = new S("", { providedIn: "root", factory: () => hp }),
  Sw = new S("");
var So = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Gf})`;
  }
};
function Qo(t) {
  return t instanceof So ? t.changingThisBreaksApplicationSecurity : t;
}
function gp(t, e) {
  let n = Mw(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${Gf})`);
  }
  return n === e;
}
function Mw(t) {
  return (t instanceof So && t.getTypeName()) || null;
}
var Tw = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function mp(t) {
  return (t = String(t)), t.match(Tw) ? t : "unsafe:" + t;
}
var ll = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(ll || {});
function yp(t) {
  let e = _w();
  return e ? e.sanitize(ll.URL, t) || "" : gp(t, "URL") ? Qo(t) : mp(Vo(t));
}
function _w() {
  let t = Y();
  return t && t[rt].sanitizer;
}
var Aw = /^>|^->|<!--|-->|--!>|<!-$/g,
  xw = /(<|>)/g,
  Nw = "\u200B$1\u200B";
function Rw(t) {
  return t.replace(Aw, (e) => e.replace(xw, Nw));
}
function Ow(t) {
  return t.ownerDocument.body;
}
function vp(t) {
  return t instanceof Function ? t() : t;
}
function Ir(t) {
  return (t ?? g(at)).get(te) === "browser";
}
var Nt = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(Nt || {}),
  Pw;
function ul(t, e) {
  return Pw(t, e);
}
function Hn(t, e, n, r, i) {
  if (r != null) {
    let o,
      s = !1;
    gt(r) ? (o = r) : Mt(r) && ((s = !0), (r = r[Pe]));
    let a = it(r);
    t === 0 && n !== null
      ? i == null
        ? bp(e, n, a)
        : Mo(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? Mo(e, n, a, i || null, !0)
      : t === 2
      ? gl(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && Zw(e, t, o, n, i);
  }
}
function dl(t, e) {
  return t.createText(e);
}
function Fw(t, e, n) {
  t.setValue(e, n);
}
function fl(t, e) {
  return t.createComment(Rw(e));
}
function Ko(t, e, n) {
  return t.createElement(e, n);
}
function kw(t, e) {
  Dp(t, e), (e[Pe] = null), (e[ot] = null);
}
function Lw(t, e, n, r, i, o) {
  (r[Pe] = i), (r[ot] = e), Yo(t, r, n, 1, i, o);
}
function Dp(t, e) {
  e[rt].changeDetectionScheduler?.notify(1), Yo(t, e, e[J], 2, null, null);
}
function jw(t) {
  let e = t[Nr];
  if (!e) return ka(t[O], t);
  for (; e; ) {
    let n = null;
    if (Mt(e)) n = e[Nr];
    else {
      let r = e[Ce];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[tt] && e !== t; ) Mt(e) && ka(e[O], e), (e = e[ge]);
      e === null && (e = t), Mt(e) && ka(e[O], e), (n = e && e[tt]);
    }
    e = n;
  }
}
function Vw(t, e, n, r) {
  let i = Ce + r,
    o = n.length;
  r > 0 && (n[i - 1][tt] = e),
    r < o - Ce
      ? ((e[tt] = n[i]), rh(n, Ce + r, e))
      : (n.push(e), (e[tt] = null)),
    (e[ge] = n);
  let s = e[Ur];
  s !== null && n !== s && $w(s, e);
  let a = e[At];
  a !== null && a.insertView(t), Za(e), (e[A] |= 128);
}
function $w(t, e) {
  let n = t[Kn],
    i = e[ge][ge][Ge];
  e[Ge] !== i && (t[A] |= Hc.HasTransplantedViews),
    n === null ? (t[Kn] = [e]) : n.push(e);
}
function wp(t, e) {
  let n = t[Kn],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function ac(t, e) {
  if (t.length <= Ce) return;
  let n = Ce + e,
    r = t[n];
  if (r) {
    let i = r[Ur];
    i !== null && i !== t && wp(i, r), e > 0 && (t[n - 1][tt] = r[tt]);
    let o = yo(t, Ce + e);
    kw(r[O], r);
    let s = o[At];
    s !== null && s.detachView(o[O]),
      (r[ge] = null),
      (r[tt] = null),
      (r[A] &= -129);
  }
  return r;
}
function Ep(t, e) {
  if (!(e[A] & 256)) {
    let n = e[J];
    n.destroyNode && Yo(t, e, n, 3, null, null), jw(e);
  }
}
function ka(t, e) {
  if (e[A] & 256) return;
  let n = q(null);
  try {
    (e[A] &= -129),
      (e[A] |= 256),
      e[ln] && xd(e[ln]),
      Uw(t, e),
      Bw(t, e),
      e[O].type === 1 && e[J].destroy();
    let r = e[Ur];
    if (r !== null && gt(e[ge])) {
      r !== e[ge] && wp(r, e);
      let i = e[At];
      i !== null && i.detachView(t);
    }
    cw(e);
  } finally {
    q(n);
  }
}
function Bw(t, e) {
  let n = t.cleanup,
    r = e[xr];
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == "string") {
        let s = n[o + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
      } else {
        let s = r[n[o + 1]];
        n[o].call(s);
      }
  r !== null && (e[xr] = null);
  let i = e[Ht];
  if (i !== null) {
    e[Ht] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Uw(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof Fr)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            ut(4, a, c);
            try {
              c.call(a);
            } finally {
              ut(5, a, c);
            }
          }
        else {
          ut(4, i, o);
          try {
            o.call(i);
          } finally {
            ut(5, i, o);
          }
        }
      }
    }
}
function Hw(t, e, n) {
  return zw(t, e.parent, n);
}
function zw(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[Pe];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: o } = t.data[r.directiveStart + i];
      if (o === ft.None || o === ft.Emulated) return null;
    }
    return ke(r, n);
  }
}
function Mo(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function bp(t, e, n) {
  t.appendChild(e, n);
}
function Sf(t, e, n, r, i) {
  r !== null ? Mo(t, e, n, r, i) : bp(t, e, n);
}
function qw(t, e, n, r) {
  t.removeChild(e, n, r);
}
function hl(t, e) {
  return t.parentNode(e);
}
function Gw(t, e) {
  return t.nextSibling(e);
}
function Ww(t, e, n) {
  return Kw(t, e, n);
}
function Qw(t, e, n) {
  return t.type & 40 ? ke(t, n) : null;
}
var Kw = Qw,
  Mf;
function pl(t, e, n, r) {
  let i = Hw(t, r, e),
    o = e[J],
    s = r.parent || e[ot],
    a = Ww(s, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Sf(o, i, n[c], a, !1);
    else Sf(o, i, n, a, !1);
  Mf !== void 0 && Mf(o, r, e, n, i);
}
function ho(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return ke(e, t);
    if (n & 4) return cc(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return ho(t, r);
      {
        let i = t[e.index];
        return gt(i) ? cc(-1, i) : it(i);
      }
    } else {
      if (n & 32) return ul(e, t)() || it(t[e.index]);
      {
        let r = Cp(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Pr(t[Ge]);
          return ho(i, r);
        } else return ho(t, e.next);
      }
    }
  }
  return null;
}
function Cp(t, e) {
  if (e !== null) {
    let r = t[Ge][ot],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function cc(t, e) {
  let n = Ce + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[O].firstChild;
    if (i !== null) return ho(r, i);
  }
  return e[xt];
}
function gl(t, e, n) {
  let r = hl(t, e);
  r && qw(t, r, e, n);
}
function Ip(t) {
  t.textContent = "";
}
function ml(t, e, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (s && e === 0 && (a && dn(it(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) ml(t, e, n.child, r, i, o, !1), Hn(e, t, i, a, o);
      else if (c & 32) {
        let l = ul(n, r),
          u;
        for (; (u = l()); ) Hn(e, t, i, u, o);
        Hn(e, t, i, a, o);
      } else c & 16 ? Yw(t, e, r, n, i, o) : Hn(e, t, i, a, o);
    n = s ? n.projectionNext : n.next;
  }
}
function Yo(t, e, n, r, i, o) {
  ml(n, r, t.firstChild, e, i, o, !1);
}
function Yw(t, e, n, r, i, o) {
  let s = n[Ge],
    c = s[ot].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Hn(e, t, i, u, o);
    }
  else {
    let l = c,
      u = s[ge];
    Co(r) && (l.flags |= 128), ml(t, e, l, u, i, o, !0);
  }
}
function Zw(t, e, n, r, i) {
  let o = n[xt],
    s = it(n);
  o !== s && Hn(e, t, r, o, i);
  for (let a = Ce; a < n.length; a++) {
    let c = n[a];
    Yo(c[O], c, t, e, r, o);
  }
}
function Xw(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let o = r.indexOf("-") === -1 ? void 0 : Nt.DashCase;
    i == null
      ? t.removeStyle(n, r, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= Nt.Important)),
        t.setStyle(n, r, i, o));
  }
}
function Jw(t, e, n) {
  t.setAttribute(e, "style", n);
}
function Sp(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function Mp(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  r !== null && qa(t, e, r),
    i !== null && Sp(t, e, i),
    o !== null && Jw(t, e, o);
}
var Wt = {};
function Le(t = 1) {
  Tp(Ke(), Y(), tr() + t, !1);
}
function Tp(t, e, n, r) {
  if (!r)
    if ((e[A] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && lo(e, o, n);
    } else {
      let o = t.preOrderHooks;
      o !== null && uo(e, o, 0, n);
    }
  un(n);
}
function Z(t, e = P.Default) {
  let n = Y();
  if (n === null) return E(t, e);
  let r = st();
  return Kh(r, n, ze(t), e);
}
function _p() {
  let t = "invalid";
  throw new Error(t);
}
function Ap(t, e, n, r, i, o) {
  let s = q(null);
  try {
    let a = null;
    i & Tt.SignalBased && (a = e[r][Md]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & Tt.HasDecoratorInputTransform &&
        (o = t.inputTransforms[r].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, n, r) : bh(e, a, r, o);
  } finally {
    q(s);
  }
}
function eE(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) un(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          OD(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      un(-1);
    }
}
function Zo(t, e, n, r, i, o, s, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[Pe] = i),
    (d[A] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[A] & 2048)) && (d[A] |= 2048),
    _h(d),
    (d[ge] = d[Br] = t),
    (d[_t] = n),
    (d[rt] = s || (t && t[rt])),
    (d[J] = a || (t && t[J])),
    (d[Qn] = c || (t && t[Qn]) || null),
    (d[ot] = o),
    (d[Ho] = sw()),
    (d[nt] = u),
    (d[vh] = l),
    (d[Ge] = e.type == 2 ? t[Ge] : d),
    d
  );
}
function Xo(t, e, n, r, i) {
  let o = t.data[e];
  if (o === null) (o = tE(t, e, n, r, i)), RD() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = n), (o.value = r), (o.attrs = i);
    let s = TD();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Gr(o, !0), o;
}
function tE(t, e, n, r, i) {
  let o = Nh(),
    s = Rh(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = cE(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function xp(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let o = 0; o < n; o++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function Np(t, e, n, r, i) {
  let o = tr(),
    s = r & 2;
  try {
    un(-1), s && e.length > Fe && Tp(t, e, Fe, !1), ut(s ? 2 : 0, i), n(r, i);
  } finally {
    un(o), ut(s ? 3 : 1, i);
  }
}
function Rp(t, e, n) {
  if (wh(e)) {
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
function Op(t, e, n) {
  xh() && (pE(t, e, n, ke(n, e)), (n.flags & 64) === 64 && $p(t, e, n));
}
function Pp(t, e, n = ke) {
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
function Fp(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = yl(
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
function yl(t, e, n, r, i, o, s, a, c, l, u) {
  let d = Fe + r,
    f = d + i,
    h = nE(d, f),
    p = typeof l == "function" ? l() : l;
  return (h[O] = {
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
function nE(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : Wt);
  return n;
}
function rE(t, e, n, r) {
  let o = r.get(pp, hp) || n === ft.ShadowDom,
    s = t.selectRootElement(e, o);
  return iE(s), s;
}
function iE(t) {
  kp(t);
}
var kp = () => null;
function oE(t) {
  tp(t) ? Ip(t) : Cw(t);
}
function sE() {
  kp = oE;
}
function aE(t, e, n, r) {
  let i = Hp(e);
  i.push(n), t.firstCreatePass && zp(t).push(r, i.length - 1);
}
function cE(t, e, n, r, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    qr() && (a |= 128),
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
function Tf(t, e, n, r, i) {
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
    t === 0 ? _f(r, n, l, a, c) : _f(r, n, l, a);
  }
  return r;
}
function _f(t, e, n, r, i) {
  let o;
  t.hasOwnProperty(n) ? (o = t[n]).push(e, r) : (o = t[n] = [e, r]),
    i !== void 0 && o.push(i);
}
function lE(t, e, n) {
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
    (c = Tf(0, d.inputs, u, c, h)), (l = Tf(1, d.outputs, u, l, p));
    let y = c !== null && s !== null && !$c(e) ? SE(c, u, s) : null;
    a.push(y);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function uE(t) {
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
function Lp(t, e, n, r, i, o, s, a) {
  let c = ke(e, n),
    l = e.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (vl(t, n, u, r, i), Hr(e) && dE(n, e.index))
    : e.type & 3
    ? ((r = uE(r)),
      (i = s != null ? s(i, e.value || "", r) : i),
      o.setProperty(c, r, i))
    : e.type & 12;
}
function dE(t, e) {
  let n = Gt(e, t);
  n[A] & 16 || (n[A] |= 64);
}
function jp(t, e, n, r) {
  if (xh()) {
    let i = r === null ? null : { "": -1 },
      o = mE(t, n),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Vp(t, e, n, s, i, a),
      i && yE(n, r, i);
  }
  n.mergedAttrs = Vc(n.mergedAttrs, n.attrs);
}
function Vp(t, e, n, r, i, o) {
  for (let l = 0; l < r.length; l++) GD(qh(n, e), t, r[l].type);
  DE(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = xp(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = Vc(n.mergedAttrs, u.hostAttrs)),
      wE(t, n, e, c, u),
      vE(c, u, i),
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
  lE(t, n, o);
}
function fE(t, e, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    hE(s) != a && s.push(a), s.push(n, r, o);
  }
}
function hE(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function pE(t, e, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd;
  Hr(n) && EE(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || qh(n, e),
    dn(r, e);
  let s = n.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = Yn(e, t, a, n);
    if ((dn(l, e), s !== null && IE(e, a - i, l, c, n, s), zr(c))) {
      let u = Gt(n.index, e);
      u[_t] = Yn(e, t, a, n);
    }
  }
}
function $p(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = PD();
  try {
    un(o);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      Xa(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          gE(c, l);
    }
  } finally {
    un(-1), Xa(s);
  }
}
function gE(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function mE(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      if (Bv(e, s.selectors, !1))
        if ((r || (r = []), zr(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s);
            let c = a.length;
            lc(t, e, c);
          } else r.unshift(s), lc(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
    }
  return r === null ? null : [r, i];
}
function lc(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function yE(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = n[e[i + 1]];
      if (o == null) throw new m(-301, !1);
      r.push(e[i], o);
    }
  }
}
function vE(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    zr(e) && (n[""] = t);
  }
}
function DE(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function wE(t, e, n, r, i) {
  t.data[r] = i;
  let o = i.factory || (i.factory = Wn(i.type, !0)),
    s = new Fr(o, zr(i), Z);
  (t.blueprint[r] = s), (n[r] = s), fE(t, e, r, xp(t, n, i.hostVars, Wt), i);
}
function EE(t, e, n) {
  let r = ke(e, t),
    i = Fp(n),
    o = t[rt].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Jo(
    t,
    Zo(t, i, null, s, r, e, null, o.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function bE(t, e, n, r, i, o) {
  let s = ke(t, e);
  CE(e[J], s, o, t.value, n, r, i);
}
function CE(t, e, n, r, i, o, s) {
  if (o == null) t.removeAttribute(e, i, n);
  else {
    let a = s == null ? Vo(o) : s(o, r || "", i);
    t.setAttribute(e, i, a, n);
  }
}
function IE(t, e, n, r, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++],
        d = s[a++];
      Ap(r, n, c, l, u, d);
    }
}
function SE(t, e, n) {
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
function Bp(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function Up(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = q(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Qc(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      q(r);
    }
  }
}
function Jo(t, e) {
  return t[Nr] ? (t[yf][tt] = e) : (t[Nr] = e), (t[yf] = e), e;
}
function uc(t, e, n) {
  Qc(0);
  let r = q(null);
  try {
    e(t, n);
  } finally {
    q(r);
  }
}
function Hp(t) {
  return t[xr] || (t[xr] = []);
}
function zp(t) {
  return t.cleanup || (t.cleanup = []);
}
function qp(t, e) {
  let n = t[Qn],
    r = n ? n.get(ht, null) : null;
  r && r.handleError(e);
}
function vl(t, e, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      c = n[o++],
      l = e[s],
      u = t.data[s];
    Ap(u, l, r, a, c, i);
  }
}
function ME(t, e, n) {
  let r = Mh(e, t);
  Fw(t[J], r, n);
}
function TE(t, e) {
  let n = Gt(e, t),
    r = n[O];
  _E(r, n);
  let i = n[Pe];
  i !== null && n[nt] === null && (n[nt] = al(i, n[Qn])), Dl(r, n, n[_t]);
}
function _E(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function Dl(t, e, n) {
  Kc(e);
  try {
    let r = t.viewQuery;
    r !== null && uc(1, r, n);
    let i = t.template;
    i !== null && Np(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[At]?.finishViewCreation(t),
      t.staticContentQueries && Up(t, e),
      t.staticViewQueries && uc(2, t.viewQuery, n);
    let o = t.components;
    o !== null && AE(e, o);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[A] &= -5), Yc();
  }
}
function AE(t, e) {
  for (let n = 0; n < e.length; n++) TE(t, e[n]);
}
function xE(t, e, n, r) {
  let i = q(null);
  try {
    let o = e.tView,
      a = t[A] & 4096 ? 4096 : 16,
      c = Zo(
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
    c[Ur] = l;
    let u = t[At];
    return u !== null && (c[At] = u.createEmbeddedView(o)), Dl(o, c, n), c;
  } finally {
    q(i);
  }
}
function Af(t, e) {
  return !e || e.firstChild === null || Co(t);
}
function NE(t, e, n, r = !0) {
  let i = e[O];
  if ((Vw(i, e, t, n), r)) {
    let s = cc(n, t),
      a = e[J],
      c = hl(a, t[xt]);
    c !== null && Lw(i, t[ot], a, e, c, s);
  }
  let o = e[nt];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function To(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let o = e[n.index];
    o !== null && r.push(it(o)), gt(o) && RE(o, r);
    let s = n.type;
    if (s & 8) To(t, e, n.child, r);
    else if (s & 32) {
      let a = ul(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Cp(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Pr(e[Ge]);
        To(c[O], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function RE(t, e) {
  for (let n = Ce; n < t.length; n++) {
    let r = t[n],
      i = r[O].firstChild;
    i !== null && To(r[O], r, i, e);
  }
  t[xt] !== t[Pe] && e.push(t[xt]);
}
var Gp = [];
function OE(t) {
  return t[ln] ?? PE(t);
}
function PE(t) {
  let e = Gp.pop() ?? Object.create(kE);
  return (e.lView = t), e;
}
function FE(t) {
  t.lView[ln] !== t && ((t.lView = null), Gp.push(t));
}
var kE = se(v({}, Td), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      Or(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[ln] = this;
    },
  }),
  Wp = 100;
function Qp(t, e = !0, n = 0) {
  let r = t[rt],
    i = r.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    LE(t, n);
  } catch (s) {
    throw (e && qp(t, s), s);
  } finally {
    o || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function LE(t, e) {
  dc(t, e);
  let n = 0;
  for (; Gc(t); ) {
    if (n === Wp) throw new m(103, !1);
    n++, dc(t, 1);
  }
}
function jE(t, e, n, r) {
  let i = e[A];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[rt].inlineEffectRunner?.flush(), Kc(e);
  let s = null,
    a = null;
  !o && VE(t) && ((a = OE(e)), (s = _d(a)));
  try {
    _h(e), xD(t.bindingStartIndex), n !== null && Np(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && lo(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && uo(e, d, 0, null), Na(e, 0);
      }
    if (($E(e), Kp(e, 0), t.contentQueries !== null && Up(t, e), !o))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && lo(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && uo(e, d, 1), Na(e, 1);
      }
    eE(t, e);
    let l = t.components;
    l !== null && Zp(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && uc(2, u, r), !o))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && lo(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && uo(e, d, 2), Na(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[xa])) {
      for (let d of e[xa]) d();
      e[xa] = null;
    }
    o || (e[A] &= -73);
  } catch (c) {
    throw (Or(e), c);
  } finally {
    a !== null && (Ad(a, s), FE(a)), Yc();
  }
}
function VE(t) {
  return t.type !== 2;
}
function Kp(t, e) {
  for (let n = rp(t); n !== null; n = ip(n))
    for (let r = Ce; r < n.length; r++) {
      let i = n[r];
      Yp(i, e);
    }
}
function $E(t) {
  for (let e = rp(t); e !== null; e = ip(e)) {
    if (!(e[A] & Hc.HasTransplantedViews)) continue;
    let n = e[Kn];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[ge];
      DD(i);
    }
  }
}
function BE(t, e, n) {
  let r = Gt(e, t);
  Yp(r, n);
}
function Yp(t, e) {
  qc(t) && dc(t, e);
}
function dc(t, e) {
  let r = t[O],
    i = t[A],
    o = t[ln],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && ua(o))),
    o && (o.dirty = !1),
    (t[A] &= -9217),
    s)
  )
    jE(r, t, r.template, t[_t]);
  else if (i & 8192) {
    Kp(t, 1);
    let a = r.components;
    a !== null && Zp(t, a, 1);
  }
}
function Zp(t, e, n) {
  for (let r = 0; r < e.length; r++) BE(t, e[r], n);
}
function wl(t) {
  for (t[rt].changeDetectionScheduler?.notify(); t; ) {
    t[A] |= 64;
    let e = Pr(t);
    if (Eh(t) && !e) return t;
    t = e;
  }
  return null;
}
var fn = class {
    get rootNodes() {
      let e = this._lView,
        n = e[O];
      return To(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[_t];
    }
    set context(e) {
      this._lView[_t] = e;
    }
    get destroyed() {
      return (this._lView[A] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ge];
        if (gt(e)) {
          let n = e[Do],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (ac(e, r), yo(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Ep(this._lView[O], this._lView);
    }
    onDestroy(e) {
      Ah(this._lView, e);
    }
    markForCheck() {
      wl(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[A] &= -129;
    }
    reattach() {
      Za(this._lView), (this._lView[A] |= 128);
    }
    detectChanges() {
      (this._lView[A] |= 1024), Qp(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new m(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Dp(this._lView[O], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new m(902, !1);
      (this._appRef = e), Za(this._lView);
    }
  },
  Zn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = zE;
    let t = e;
    return t;
  })(),
  UE = Zn,
  HE = class extends UE {
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
      let i = xE(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new fn(i);
    }
  };
function zE() {
  return El(st(), Y());
}
function El(t, e) {
  return t.type & 4 ? new HE(e, t, nr(t, e)) : null;
}
function Xp(t) {
  let e = t[Rr] ?? [],
    r = t[ge][J];
  for (let i of e) qE(i, r);
  t[Rr] = qe;
}
function qE(t, e) {
  let n = 0,
    r = t.firstChild;
  if (r) {
    let i = t.data[Io];
    for (; n < i; ) {
      let o = r.nextSibling;
      gl(e, r, !1), (r = o), n++;
    }
  }
}
function Jp(t) {
  Xp(t);
  for (let e = Ce; e < t.length; e++) _o(t[e]);
}
function GE(t) {
  let e = t[nt]?.i18nNodes;
  if (e) {
    let n = t[J];
    for (let r of e.values()) gl(n, r, !1);
    t[nt].i18nNodes = void 0;
  }
}
function _o(t) {
  GE(t);
  let e = t[O];
  for (let n = Fe; n < e.bindingStartIndex; n++)
    if (gt(t[n])) {
      let r = t[n];
      Jp(r);
    } else Mt(t[n]) && _o(t[n]);
}
function WE(t) {
  let e = t._views;
  for (let n of e) {
    let r = Ew(n);
    if (r !== null && r[Pe] !== null)
      if (Mt(r)) _o(r);
      else {
        let i = r[Pe];
        _o(i), Jp(r);
      }
  }
}
var QE = new RegExp(`^(\\d+)*(${cp}|${ap})*(.*)`);
function KE(t) {
  let e = t.match(QE),
    [n, r, i, o] = e,
    s = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of o.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [s, ...a];
}
function YE(t) {
  return !t.prev && t.parent?.type === 8;
}
function La(t) {
  return t.index - Fe;
}
function ZE(t, e) {
  let n = t.i18nNodes;
  if (n) {
    let r = n.get(e);
    return r && n.delete(e), r;
  }
  return null;
}
function es(t, e, n, r) {
  let i = La(r),
    o = ZE(t, i);
  if (!o) {
    let s = t.data[gw];
    if (s?.[i]) o = JE(s[i], n);
    else if (e.firstChild === r) o = t.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (YE(r)) {
        let l = La(r.parent);
        o = sc(t, l);
      } else {
        let l = ke(c, n);
        if (a) o = l.firstChild;
        else {
          let u = La(c),
            d = sc(t, u);
          if (c.type === 2 && d) {
            let h = cl(t, u) + 1;
            o = ts(h, d);
          } else o = l.nextSibling;
        }
      }
    }
  }
  return o;
}
function ts(t, e) {
  let n = e;
  for (let r = 0; r < t; r++) n = n.nextSibling;
  return n;
}
function XE(t, e) {
  let n = t;
  for (let r = 0; r < e.length; r += 2) {
    let i = e[r],
      o = e[r + 1];
    for (let s = 0; s < o; s++)
      switch (i) {
        case oc.FirstChild:
          n = n.firstChild;
          break;
        case oc.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function JE(t, e) {
  let [n, ...r] = KE(t),
    i;
  if (n === ap) i = e[Ge][Pe];
  else if (n === cp) i = Ow(e[Ge][Pe]);
  else {
    let o = Number(n);
    i = it(e[o + Fe]);
  }
  return XE(i, r);
}
function eb(t, e) {
  let n = [];
  for (let r of e)
    for (let i = 0; i < (r[lp] ?? 1); i++) {
      let o = { data: r, firstChild: null };
      r[Io] > 0 && ((o.firstChild = t), (t = ts(r[Io], t))), n.push(o);
    }
  return [t, n];
}
var eg = () => null;
function tb(t, e) {
  let n = t[Rr];
  return !e || n === null || n.length === 0
    ? null
    : n[0].data[pw] === e
    ? n.shift()
    : (Xp(t), null);
}
function nb() {
  eg = tb;
}
function xf(t, e) {
  return eg(t, e);
}
var Xn = class {},
  fc = class {},
  Ao = class {};
function rb(t) {
  let e = Error(`No component factory found for ${be(t)}.`);
  return (e[ib] = t), e;
}
var ib = "ngComponent";
var hc = class {
    resolveComponentFactory(e) {
      throw rb(e);
    }
  },
  ns = (() => {
    let e = class e {};
    e.NULL = new hc();
    let t = e;
    return t;
  })(),
  hn = class {},
  rs = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => ob();
    let t = e;
    return t;
  })();
function ob() {
  let t = Y(),
    e = st(),
    n = Gt(e.index, t);
  return (Mt(n) ? n : t)[J];
}
var sb = (() => {
    let e = class e {};
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  ja = {};
var Nf = new Set();
function Qt(t) {
  Nf.has(t) ||
    (Nf.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function Rf(...t) {}
function ab() {
  let t = typeof Oe.requestAnimationFrame == "function",
    e = Oe[t ? "requestAnimationFrame" : "setTimeout"],
    n = Oe[t ? "cancelAnimationFrame" : "clearTimeout"];
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
        (this.onUnstable = new pe(!1)),
        (this.onMicrotaskEmpty = new pe(!1)),
        (this.onStable = new pe(!1)),
        (this.onError = new pe(!1)),
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
        (i.nativeRequestAnimationFrame = ab().nativeRequestAnimationFrame),
        ub(i);
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
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, cb, Rf, Rf);
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
  cb = {};
function bl(t) {
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
function lb(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Oe,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                pc(t),
                (t.isCheckStableRunning = !0),
                bl(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    pc(t));
}
function ub(t) {
  let e = () => {
    lb(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (db(a)) return n.invokeTask(i, o, s, a);
      try {
        return Of(t), n.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Pf(t);
      }
    },
    onInvoke: (n, r, i, o, s, a, c) => {
      try {
        return Of(t), n.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Pf(t);
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), pc(t), bl(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function pc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Of(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Pf(t) {
  t._nesting--, bl(t);
}
var gc = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new pe()),
      (this.onMicrotaskEmpty = new pe()),
      (this.onStable = new pe()),
      (this.onError = new pe());
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
function db(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function fb(t = "zone.js", e) {
  return t === "noop" ? new gc() : t === "zone.js" ? new G(e) : t;
}
var zn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(zn || {}),
  hb = { destroy() {} };
function is(t, e) {
  !e && aD(is);
  let n = e?.injector ?? g(at);
  if (!Ir(n)) return hb;
  Qt("NgAfterNextRender");
  let r = n.get(Cl),
    i = (r.handler ??= new yc()),
    o = e?.phase ?? zn.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = n.get(nl).onDestroy(s),
    c = pt(
      n,
      () =>
        new mc(o, () => {
          s(), t();
        })
    );
  return i.register(c), { destroy: s };
}
var mc = class {
    constructor(e, n) {
      (this.phase = e),
        (this.callbackFn = n),
        (this.zone = g(G)),
        (this.errorHandler = g(ht, { optional: !0 })),
        g(Xn, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  yc = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [zn.EarlyRead]: new Set(),
          [zn.Write]: new Set(),
          [zn.MixedReadWrite]: new Set(),
          [zn.Read]: new Set(),
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
  Cl = (() => {
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
function vc(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = af(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        r = af(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var xo = class extends ns {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = zt(e);
    return new Jn(n, this.ngModule);
  }
};
function Ff(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function pb(t) {
  let e = t.toLowerCase();
  return e === "svg" ? hD : e === "math" ? pD : null;
}
var Dc = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = $o(r);
      let i = this.injector.get(e, ja, r);
      return i !== ja || n === ja ? i : this.parentInjector.get(e, n, r);
    }
  },
  Jn = class extends Ao {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = Ff(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return Ff(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = qv(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      let o = q(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Ie ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Dc(e, s) : e,
          c = a.get(hn, null);
        if (c === null) throw new m(407, !1);
        let l = a.get(sb, null),
          u = a.get(Cl, null),
          d = a.get(Xn, null),
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
            ? rE(h, r, this.componentDef.encapsulation, a)
            : Ko(h, p, pb(p)),
          x = 512;
        this.componentDef.signals
          ? (x |= 4096)
          : this.componentDef.onPush || (x |= 16);
        let T = null;
        y !== null && (T = al(y, a, !0));
        let H = yl(0, null, null, 1, 0, null, null, null, null, null, null),
          z = Zo(null, H, null, x, null, null, f, h, a, null, T);
        Kc(z);
        let Q, Te;
        try {
          let ne = this.componentDef,
            re,
            de = null;
          ne.findHostDirectiveDefs
            ? ((re = []),
              (de = new Map()),
              ne.findHostDirectiveDefs(ne, re, de),
              re.push(ne))
            : (re = [ne]);
          let Ct = gb(z, y),
            kt = mb(Ct, y, ne, re, z, f, h);
          (Te = Th(H, Fe)),
            y && Db(h, ne, y, r),
            n !== void 0 && wb(Te, this.ngContentSelectors, n),
            (Q = vb(kt, ne, re, de, z, [Eb])),
            Dl(H, z, null);
        } finally {
          Yc();
        }
        return new wc(this.componentType, Q, nr(Te, z), z, Te);
      } finally {
        q(o);
      }
    }
  },
  wc = class extends fc {
    constructor(e, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new fn(i, void 0, !1)),
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
        vl(o[O], o, i, e, n), this.previousInputValues.set(e, n);
        let s = Gt(this._tNode.index, o);
        wl(s);
      }
    }
    get injector() {
      return new an(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function gb(t, e) {
  let n = t[O],
    r = Fe;
  return (t[r] = e), Xo(n, r, 2, "#host", null);
}
function mb(t, e, n, r, i, o, s) {
  let a = i[O];
  yb(r, t, e, s);
  let c = null;
  e !== null && (c = al(e, i[Qn]));
  let l = o.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Zo(i, Fp(n), null, u, i[t.index], t, o, l, null, null, c);
  return (
    a.firstCreatePass && lc(a, t, r.length - 1), Jo(i, d), (i[t.index] = d)
  );
}
function yb(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Vc(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (vc(e, e.mergedAttrs, !0), n !== null && Mp(r, n, e));
}
function vb(t, e, n, r, i, o) {
  let s = st(),
    a = i[O],
    c = ke(s, i);
  Vp(a, i, s, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = s.directiveStart + u,
      f = Yn(i, a, d, s);
    dn(f, i);
  }
  $p(a, i, s), c && dn(c, i);
  let l = Yn(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[_t] = i[_t] = l), o !== null)) for (let u of o) u(l, e);
  return Rp(a, s, i), l;
}
function Db(t, e, n, r) {
  if (r) qa(t, n, ["ng-version", "17.3.11"]);
  else {
    let { attrs: i, classes: o } = Gv(e.selectors[0]);
    i && qa(t, n, i), o && o.length > 0 && Sp(t, n, o.join(" "));
  }
}
function wb(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = n[i];
    r.push(o != null ? Array.from(o) : null);
  }
}
function Eb() {
  let t = st();
  Jc(Y()[O], t);
}
var yn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = bb;
  let t = e;
  return t;
})();
function bb() {
  let t = st();
  return ng(t, Y());
}
var Cb = yn,
  tg = class extends Cb {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return nr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new an(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = el(this._hostTNode, this._hostLView);
      if (Uh(e)) {
        let n = bo(e, this._hostLView),
          r = Eo(e),
          i = n[O].data[r + 8];
        return new an(i, n);
      } else return new an(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = kf(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - Ce;
    }
    createEmbeddedView(e, n, r) {
      let i, o;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector));
      let s = xf(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, o, s);
      return this.insertImpl(a, i, Af(this._hostTNode, s)), a;
    }
    createComponent(e, n, r, i, o) {
      let s = e && !lD(e),
        a;
      if (s) a = n;
      else {
        let p = n || {};
        (a = p.index),
          (r = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let c = s ? e : new Jn(zt(e)),
        l = r || this.parentInjector;
      if (!o && c.ngModule == null) {
        let y = (s ? l : this.parentInjector).get(Ie, null);
        y && (o = y);
      }
      let u = zt(c.componentType ?? {}),
        d = xf(this._lContainer, u?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(l, i, f, o);
      return this.insertImpl(h.hostView, a, Af(this._hostTNode, d)), h;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (vD(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ge],
            l = new tg(c, c[ot], c[ge]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return NE(s, i, o, r), e.attachToViewContainerRef(), rh(Va(s), o, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = kf(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = ac(this._lContainer, n);
      r && (yo(Va(this._lContainer), n), Ep(r[O], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = ac(this._lContainer, n);
      return r && yo(Va(this._lContainer), n) != null ? new fn(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function kf(t) {
  return t[Do];
}
function Va(t) {
  return t[Do] || (t[Do] = []);
}
function ng(t, e) {
  let n,
    r = e[t.index];
  return (
    gt(r) ? (n = r) : ((n = Bp(r, e, null, t)), (e[t.index] = n), Jo(e, n)),
    rg(n, e, t, r),
    new tg(n, t, e)
  );
}
function Ib(t, e) {
  let n = t[J],
    r = n.createComment(""),
    i = ke(e, t),
    o = hl(n, i);
  return Mo(n, o, r, Gw(n, i), !1), r;
}
var rg = ig,
  Il = () => !1;
function Sb(t, e, n) {
  return Il(t, e, n);
}
function ig(t, e, n, r) {
  if (t[xt]) return;
  let i;
  n.type & 8 ? (i = it(r)) : (i = Ib(e, n)), (t[xt] = i);
}
function Mb(t, e, n) {
  if (t[xt] && t[Rr]) return !0;
  let r = n[nt],
    i = e.index - Fe;
  if (!r || iw(e) || Wo(r, i)) return !1;
  let s = sc(r, i),
    a = r.data[sl]?.[i],
    [c, l] = eb(s, a);
  return (t[xt] = c), (t[Rr] = l), !0;
}
function Tb(t, e, n, r) {
  Il(t, n, e) || ig(t, e, n, r);
}
function _b() {
  (rg = Tb), (Il = Mb);
}
var Ec = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  bc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let n = e.queries;
      if (n !== null) {
        let r = e.contentQueries !== null ? e.contentQueries[0] : n.length,
          i = [];
        for (let o = 0; o < r; o++) {
          let s = n.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let n = 0; n < this.queries.length; n++)
        Sl(e, n).matches !== null && this.queries[n].setDirty();
    }
  },
  Cc = class {
    constructor(e, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof e == "string" ? (this.predicate = kb(e)) : (this.predicate = e);
    }
  },
  Ic = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(e, n);
    }
    elementEnd(e) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(e);
    }
    embeddedTView(e) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let i = n !== null ? n.length : 0,
          o = this.getByIndex(r).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = r), n !== null ? n.push(o) : (n = [o]));
      }
      return n !== null ? new t(n) : null;
    }
    template(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(e, n);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  Sc = class t {
    constructor(e, n = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = n);
    }
    elementStart(e, n) {
      this.isApplyingToNode(n) && this.matchTNode(e, n);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, n) {
      this.elementStart(e, n);
    }
    embeddedTView(e, n) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, n),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = e.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let i = 0; i < r.length; i++) {
          let o = r[i];
          this.matchTNodeWithReadOption(e, n, Ab(n, o)),
            this.matchTNodeWithReadOption(e, n, fo(n, e, o, !1, !1));
        }
      else
        r === Zn
          ? n.type & 4 && this.matchTNodeWithReadOption(e, n, -1)
          : this.matchTNodeWithReadOption(e, n, fo(n, e, r, !1, !1));
    }
    matchTNodeWithReadOption(e, n, r) {
      if (r !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === yt || i === yn || (i === Zn && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let o = fo(n, e, i, !1, !1);
            o !== null && this.addMatch(n.index, o);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(e, n) {
      this.matches === null ? (this.matches = [e, n]) : this.matches.push(e, n);
    }
  };
function Ab(t, e) {
  let n = t.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === e) return n[r + 1];
  }
  return null;
}
function xb(t, e) {
  return t.type & 11 ? nr(t, e) : t.type & 4 ? El(t, e) : null;
}
function Nb(t, e, n, r) {
  return n === -1 ? xb(e, t) : n === -2 ? Rb(t, e, r) : Yn(t, t[O], n, e);
}
function Rb(t, e, n) {
  if (n === yt) return nr(e, t);
  if (n === Zn) return El(e, t);
  if (n === yn) return ng(e, t);
}
function og(t, e, n, r) {
  let i = e[At].queries[r];
  if (i.matches === null) {
    let o = t.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = o[l];
        a.push(Nb(e, u, s[c + 1], n.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Mc(t, e, n, r) {
  let i = t.queries.getByIndex(n),
    o = i.matches;
  if (o !== null) {
    let s = og(t, e, i, n);
    for (let a = 0; a < o.length; a += 2) {
      let c = o[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = o[a + 1],
          u = e[-c];
        for (let d = Ce; d < u.length; d++) {
          let f = u[d];
          f[Ur] === f[ge] && Mc(f[O], f, l, r);
        }
        if (u[Kn] !== null) {
          let d = u[Kn];
          for (let f = 0; f < d.length; f++) {
            let h = d[f];
            Mc(h[O], h, l, r);
          }
        }
      }
    }
  }
  return r;
}
function Ob(t, e) {
  return t[At].queries[e].queryList;
}
function Pb(t, e, n) {
  let r = new rc((n & 4) === 4);
  return (
    aE(t, e, r, r.destroy), (e[At] ??= new bc()).queries.push(new Ec(r)) - 1
  );
}
function Fb(t, e, n) {
  let r = Ke();
  return (
    r.firstCreatePass &&
      (Lb(r, new Cc(t, e, n), -1), (e & 2) === 2 && (r.staticViewQueries = !0)),
    Pb(r, Y(), e)
  );
}
function kb(t) {
  return t.split(",").map((e) => e.trim());
}
function Lb(t, e, n) {
  t.queries === null && (t.queries = new Ic()), t.queries.track(new Sc(e, n));
}
function Sl(t, e) {
  return t.queries.getByIndex(e);
}
function jb(t, e) {
  let n = t[O],
    r = Sl(n, e);
  return r.crossesNgTemplate ? Mc(n, t, e, []) : og(n, t, r, e);
}
function Vb(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let o = n.get(i);
    if (!o) {
      let s = t(i);
      n.set(i, (o = s.then(Hb)));
    }
    return o;
  }
  return (
    No.forEach((i, o) => {
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
      let c = Promise.all(s).then(() => zb(o));
      e.push(c);
    }),
    Bb(),
    Promise.all(e).then(() => {})
  );
}
var No = new Map(),
  $b = new Set();
function Bb() {
  let t = No;
  return (No = new Map()), t;
}
function Ub() {
  return No.size === 0;
}
function Hb(t) {
  return typeof t == "string" ? t : t.text();
}
function zb(t) {
  $b.delete(t);
}
var qt = class {},
  kr = class {};
var Ro = class extends qt {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new xo(this));
      let i = dh(e);
      (this._bootstrapComponents = vp(i.bootstrap)),
        (this._r3Injector = Xh(
          e,
          n,
          [
            { provide: qt, useValue: this },
            { provide: ns, useValue: this.componentFactoryResolver },
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
  Oo = class extends kr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Ro(this.moduleType, e, []);
    }
  };
function qb(t, e, n) {
  return new Ro(t, e, n);
}
var Tc = class extends qt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new xo(this)),
      (this.instance = null);
    let n = new Ar(
      [
        ...e.providers,
        { provide: qt, useValue: this },
        { provide: ns, useValue: this.componentFactoryResolver },
      ],
      e.parent || Uc(),
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
function os(t, e, n = null) {
  return new Tc({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Qr = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ye(!1));
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
function sg(t) {
  return Wb(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Gb(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function Wb(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function Qb(t, e, n) {
  return (t[e] = n);
}
function Kr(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function Yr(t) {
  return (t.flags & 32) === 32;
}
function Kb(t, e, n, r, i, o, s, a, c) {
  let l = e.consts,
    u = Xo(e, t, 4, s || null, wo(l, a));
  jp(e, n, u, wo(l, c)), Jc(e, u);
  let d = (u.tView = yl(
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
function Zr(t, e, n, r, i, o, s, a) {
  let c = Y(),
    l = Ke(),
    u = t + Fe,
    d = l.firstCreatePass ? Kb(u, l, c, e, n, r, i, o, s) : l.data[u];
  Gr(d, !1);
  let f = ag(l, c, d, t);
  Xc() && pl(l, c, f, d), dn(f, c);
  let h = Bp(f, c, f, d);
  return (
    (c[u] = h),
    Jo(c, h),
    Sb(h, d, c),
    zc(d) && Op(l, c, d),
    s != null && Pp(c, d, a),
    Zr
  );
}
var ag = cg;
function cg(t, e, n, r) {
  return mt(!0), e[J].createComment("");
}
function Yb(t, e, n, r) {
  let i = e[nt],
    o = !i || qr() || Yr(n) || Wo(i, r);
  if ((mt(o), o)) return cg(t, e, n, r);
  let s = i.data[hw]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let a = es(i, t, e, n);
  Go(i, r, a);
  let c = cl(i, r);
  return ts(c, a);
}
function Zb() {
  ag = Yb;
}
function ss(t, e, n, r) {
  let i = Y(),
    o = Wc();
  if (Kr(i, o, e)) {
    let s = Ke(),
      a = Zc();
    bE(a, i, t, e, n, r);
  }
  return ss;
}
function lg(t, e, n, r) {
  return Kr(t, Wc(), n) ? e + Vo(n) + r : Wt;
}
function oo(t, e) {
  return (t << 17) | (e << 2);
}
function pn(t) {
  return (t >> 17) & 32767;
}
function Xb(t) {
  return (t & 2) == 2;
}
function Jb(t, e) {
  return (t & 131071) | (e << 17);
}
function _c(t) {
  return t | 2;
}
function er(t) {
  return (t & 131068) >> 2;
}
function $a(t, e) {
  return (t & -131069) | (e << 2);
}
function eC(t) {
  return (t & 1) === 1;
}
function Ac(t) {
  return t | 1;
}
function tC(t, e, n, r, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = pn(s),
    c = er(s);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Vr(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let f = pn(t[a + 1]);
      (t[r + 1] = oo(f, a)),
        f !== 0 && (t[f + 1] = $a(t[f + 1], r)),
        (t[a + 1] = Jb(t[a + 1], r));
    } else
      (t[r + 1] = oo(a, 0)), a !== 0 && (t[a + 1] = $a(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = oo(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = $a(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = _c(t[r + 1])),
    Lf(t, u, r, !0),
    Lf(t, u, r, !1),
    nC(e, u, t, r, o),
    (s = oo(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function nC(t, e, n, r, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Vr(o, e) >= 0 &&
    (n[r + 1] = Ac(n[r + 1]));
}
function Lf(t, e, n, r) {
  let i = t[n + 1],
    o = e === null,
    s = r ? pn(i) : er(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      l = t[s + 1];
    rC(c, e) && ((a = !0), (t[s + 1] = r ? Ac(l) : _c(l))),
      (s = r ? pn(l) : er(l));
  }
  a && (t[n + 1] = r ? _c(i) : Ac(i));
}
function rC(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Vr(t, e) >= 0
    : !1;
}
function Se(t, e, n) {
  let r = Y(),
    i = Wc();
  if (Kr(r, i, e)) {
    let o = Ke(),
      s = Zc();
    Lp(o, s, r, t, e, r[J], n, !1);
  }
  return Se;
}
function jf(t, e, n, r, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  vl(t, n, o[s], s, r);
}
function as(t, e, n) {
  return iC(t, e, n, !1), as;
}
function iC(t, e, n, r) {
  let i = Y(),
    o = Ke(),
    s = ND(2);
  if ((o.firstUpdatePass && sC(o, t, s, r), e !== Wt && Kr(i, s, e))) {
    let a = o.data[tr()];
    dC(o, a, i, i[J], t, (i[s + 1] = fC(e, n)), r, s);
  }
}
function oC(t, e) {
  return e >= t.expandoStartIndex;
}
function sC(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let o = i[tr()],
      s = oC(t, n);
    hC(o, r) && e === null && !s && (e = !1),
      (e = aC(i, o, e, r)),
      tC(i, o, e, n, s, r);
  }
}
function aC(t, e, n, r) {
  let i = FD(t),
    o = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = Ba(null, t, e, n, r)), (n = Lr(n, e.attrs, r)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((n = Ba(i, t, e, n, r)), o === null)) {
        let c = cC(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ba(null, t, e, c[1], r)),
          (c = Lr(c, e.attrs, r)),
          lC(t, e, r, c));
      } else o = uC(t, e, r);
  }
  return (
    o !== void 0 && (r ? (e.residualClasses = o) : (e.residualStyles = o)), n
  );
}
function cC(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (er(r) !== 0) return t[pn(r)];
}
function lC(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[pn(i)] = r;
}
function uC(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    r = Lr(r, s, n);
  }
  return Lr(r, e.attrs, n);
}
function Ba(t, e, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = e[a]), (r = Lr(r, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function Lr(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Rv(t, s, n ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function dC(t, e, n, r, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = eC(l) ? Vf(c, e, n, i, er(l), s) : void 0;
  if (!Po(u)) {
    Po(o) || (Xb(l) && (o = Vf(c, null, n, i, a, s)));
    let d = Mh(tr(), n);
    Xw(r, s, d, i, o);
  }
}
function Vf(t, e, n, r, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      f = n[i + 1];
    f === Wt && (f = d ? qe : void 0);
    let h = d ? _a(f, r) : u === r ? f : void 0;
    if ((l && !Po(h) && (h = _a(c, r)), Po(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? pn(p) : er(p);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = _a(c, r));
  }
  return a;
}
function Po(t) {
  return t !== void 0;
}
function fC(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = be(Qo(t)))),
    t
  );
}
function hC(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function pC(t, e, n, r, i, o) {
  let s = e.consts,
    a = wo(s, i),
    c = Xo(e, t, 2, r, a);
  return (
    jp(e, n, c, wo(s, o)),
    c.attrs !== null && vc(c, c.attrs, !1),
    c.mergedAttrs !== null && vc(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function C(t, e, n, r) {
  let i = Y(),
    o = Ke(),
    s = Fe + t,
    a = i[J],
    c = o.firstCreatePass ? pC(s, o, i, e, n, r) : o.data[s],
    l = ug(o, i, c, a, e, t);
  i[s] = l;
  let u = zc(c);
  return (
    Gr(c, !0),
    Mp(a, l, c),
    !Yr(c) && Xc() && pl(o, i, l, c),
    ED() === 0 && dn(l, i),
    bD(),
    u && (Op(o, i, c), Rp(o, c, i)),
    r !== null && Pp(i, c),
    C
  );
}
function M() {
  let t = st();
  Rh() ? _D() : ((t = t.parent), Gr(t, !1));
  let e = t;
  ID(e) && MD(), CD();
  let n = Ke();
  return (
    n.firstCreatePass && (Jc(n, t), wh(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      $D(e) &&
      jf(n, e, Y(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      BD(e) &&
      jf(n, e, Y(), e.stylesWithoutHost, !1),
    M
  );
}
function X(t, e, n, r) {
  return C(t, e, n, r), M(), X;
}
var ug = (t, e, n, r, i, o) => (mt(!0), Ko(r, i, Vh()));
function gC(t, e, n, r, i, o) {
  let s = e[nt],
    a = !s || qr() || Yr(n) || Wo(s, o);
  if ((mt(a), a)) return Ko(r, i, Vh());
  let c = es(s, t, e, n);
  return (
    fp(s, o) && Go(s, o, c.nextSibling),
    s && (ep(n) || tp(c)) && Hr(n) && (SD(n), Ip(c)),
    c
  );
}
function mC() {
  ug = gC;
}
var yC = (t, e, n, r) => (mt(!0), fl(e[J], ""));
function vC(t, e, n, r) {
  let i,
    o = e[nt],
    s = !o || qr() || Yr(n);
  if ((mt(s), s)) return fl(e[J], "");
  let a = es(o, t, e, n),
    c = Iw(o, r);
  return Go(o, r, a), (i = ts(c, a)), i;
}
function DC() {
  yC = vC;
}
var Fo = "en-US";
var wC = Fo;
function EC(t) {
  typeof t == "string" && (wC = t.toLowerCase().replace(/_/g, "-"));
}
function dg(t, e, n) {
  let r = t[J];
  switch (n) {
    case Node.COMMENT_NODE:
      return fl(r, e);
    case Node.TEXT_NODE:
      return dl(r, e);
    case Node.ELEMENT_NODE:
      return Ko(r, e, null);
  }
}
var bC = (t, e, n, r) => (mt(!0), dg(t, n, r));
function CC(t, e, n, r) {
  return mt(!0), dg(t, n, r);
}
function IC() {
  bC = CC;
}
function rr(t, e, n, r) {
  let i = Y(),
    o = Ke(),
    s = st();
  return MC(o, i, i[J], s, t, e, r), rr;
}
function SC(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = e[xr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function MC(t, e, n, r, i, o, s) {
  let a = zc(r),
    l = t.firstCreatePass && zp(t),
    u = e[_t],
    d = Hp(e),
    f = !0;
  if (r.type & 3 || s) {
    let y = ke(r, e),
      x = s ? s(y) : y,
      T = d.length,
      H = s ? (Q) => s(it(Q[r.index])) : r.index,
      z = null;
    if ((!s && a && (z = SC(t, e, i, r.index)), z !== null)) {
      let Q = z.__ngLastListenerFn__ || z;
      (Q.__ngNextListenerFn__ = o), (z.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Bf(r, e, u, o, !1);
      let Q = n.listen(x, i, o);
      d.push(o, Q), l && l.push(i, H, T, T + 1);
    }
  } else o = Bf(r, e, u, o, !1);
  let h = r.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let y = p.length;
    if (y)
      for (let x = 0; x < y; x += 2) {
        let T = p[x],
          H = p[x + 1],
          Te = e[T][H].subscribe(o),
          ne = d.length;
        d.push(o, Te), l && l.push(i, r.index, ne, -(ne + 1));
      }
  }
}
function $f(t, e, n, r) {
  let i = q(null);
  try {
    return ut(6, e, n), n(r) !== !1;
  } catch (o) {
    return qp(t, o), !1;
  } finally {
    ut(7, e, n), q(i);
  }
}
function Bf(t, e, n, r, i) {
  return function o(s) {
    if (s === Function) return r;
    let a = t.componentOffset > -1 ? Gt(t.index, e) : e;
    wl(a);
    let c = $f(e, n, r, s),
      l = o.__ngNextListenerFn__;
    for (; l; ) (c = $f(e, n, l, s) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function Ml(t, e, n) {
  return cs(t, "", e, "", n), Ml;
}
function cs(t, e, n, r, i) {
  let o = Y(),
    s = lg(o, e, n, r);
  if (s !== Wt) {
    let a = Ke(),
      c = Zc();
    Lp(a, c, o, t, s, o[J], i, !1);
  }
  return cs;
}
function Tl(t, e, n) {
  Fb(t, e, n);
}
function ls(t) {
  let e = Y(),
    n = Ke(),
    r = Oh();
  Qc(r + 1);
  let i = Sl(n, r);
  if (t.dirty && yD(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = jb(e, r);
      t.reset(o, ew), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function us() {
  return Ob(Y(), Oh());
}
function F(t, e = "") {
  let n = Y(),
    r = Ke(),
    i = t + Fe,
    o = r.firstCreatePass ? Xo(r, i, 1, e, null) : r.data[i],
    s = fg(r, n, o, e, t);
  (n[i] = s), Xc() && pl(r, n, s, o), Gr(o, !1);
}
var fg = (t, e, n, r, i) => (mt(!0), dl(e[J], r));
function TC(t, e, n, r, i) {
  let o = e[nt],
    s = !o || qr() || Yr(n) || Wo(o, i);
  return mt(s), s ? dl(e[J], r) : es(o, t, e, n);
}
function _C() {
  fg = TC;
}
function _l(t) {
  return ds("", t, ""), _l;
}
function ds(t, e, n) {
  let r = Y(),
    i = lg(r, t, e, n);
  return i !== Wt && ME(r, tr(), i), ds;
}
var AC = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = ph(!1, r.type),
          o =
            i.length > 0
              ? os([i], this._injector, `Standalone[${r.type.name}]`)
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
    factory: () => new e(E(Ie)),
  });
  let t = e;
  return t;
})();
function hg(t) {
  Qt("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(AC).getOrCreateStandaloneInjector(t));
}
function ir(t, e, n, r) {
  return NC(Y(), AD(), t, e, n, r);
}
function xC(t, e) {
  let n = t[e];
  return n === Wt ? void 0 : n;
}
function NC(t, e, n, r, i, o) {
  let s = e + n;
  return Kr(t, s, i) ? Qb(t, s + 1, o ? r.call(o, i) : r(i)) : xC(t, s + 1);
}
var so = null;
function RC(t) {
  (so !== null &&
    (t.defaultEncapsulation !== so.defaultEncapsulation ||
      t.preserveWhitespaces !== so.preserveWhitespaces)) ||
    (so = t);
}
var fs = (() => {
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
var Al = new S(""),
  Xr = new S(""),
  hs = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          xl || (OC(o), o.addToWindow(i)),
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
      return new (i || e)(E(G), E(ps), E(Xr));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ps = (() => {
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
        return xl?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function OC(t) {
  xl = t;
}
var xl;
function Jr(t) {
  return !!t && typeof t.then == "function";
}
function pg(t) {
  return !!t && typeof t.subscribe == "function";
}
var gs = new S(""),
  gg = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = g(gs, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let o of this.appInits) {
          let s = o();
          if (Jr(s)) r.push(s);
          else if (pg(s)) {
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
  or = new S("");
function PC() {
  Nd(() => {
    throw new m(600, !1);
  });
}
function FC(t) {
  return t.isBoundToModule;
}
function kC(t, e, n) {
  try {
    let r = n();
    return Jr(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function mg(t, e) {
  return Array.isArray(e) ? e.reduce(mg, t) : v(v({}, t), e);
}
var Rt = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = g(Jh)),
        (this.afterRenderEffectManager = g(Cl)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new we()),
        (this.afterTick = new we()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = g(Qr).hasPendingTasks.pipe(L((r) => !r))),
        (this._injector = g(Ie));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let o = r instanceof Ao;
      if (!this._injector.get(gg).done) {
        let h = !o && uh(r),
          p = !1;
        throw new m(405, p);
      }
      let a;
      o ? (a = r) : (a = this._injector.get(ns).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = FC(a) ? void 0 : this._injector.get(qt),
        l = i || a.selector,
        u = a.create(at.NULL, [], l, c),
        d = u.location.nativeElement,
        f = u.injector.get(Al, null);
      return (
        f?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            po(this.components, u),
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
        if (i === Wp) throw new m(103, !1);
        if (r) {
          let s = i === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            LC(a, s, c);
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => xc(s)
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => xc(s)
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
      po(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(or, []);
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
        this._destroyListeners.push(r), () => po(this._destroyListeners, r)
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
function po(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var ao;
function Nl(t) {
  ao ??= new WeakMap();
  let e = ao.get(t);
  if (e) return e;
  let n = t.isStable
    .pipe(Je((r) => r))
    .toPromise()
    .then(() => {});
  return ao.set(t, n), t.onDestroy(() => ao?.delete(t)), n;
}
function LC(t, e, n) {
  (!e && !xc(t)) || jC(t, n, e);
}
function xc(t) {
  return Gc(t);
}
function jC(t, e, n) {
  let r;
  n ? ((r = 0), (t[A] |= 1024)) : t[A] & 64 ? (r = 0) : (r = 1), Qp(t, e, r);
}
var Nc = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  ms = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new Oo(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          o = dh(r),
          s = vp(o.declarations).reduce((a, c) => {
            let l = zt(c);
            return l && a.push(new Jn(l)), a;
          }, []);
        return new Nc(i, s);
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
  VC = new S("");
function $C(t, e, n) {
  let r = new Oo(n);
  return Promise.resolve(r);
}
function Uf(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var BC = (() => {
  let e = class e {
    constructor() {
      (this.zone = g(G)), (this.applicationRef = g(Rt));
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
function UC(t) {
  return [
    { provide: G, useFactory: t },
    {
      provide: cn,
      multi: !0,
      useFactory: () => {
        let e = g(BC, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: cn,
      multi: !0,
      useFactory: () => {
        let e = g(qC);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Jh, useFactory: HC },
  ];
}
function HC() {
  let t = g(G),
    e = g(ht);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function zC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var qC = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new ce()),
        (this.initialized = !1),
        (this.zone = g(G)),
        (this.pendingTasks = g(Qr));
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
function GC() {
  return (typeof $localize < "u" && $localize.locale) || Fo;
}
var Rl = new S("", {
  providedIn: "root",
  factory: () => g(Rl, P.Optional | P.SkipSelf) || GC(),
});
var yg = new S(""),
  vg = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let o = fb(
          i?.ngZone,
          zC({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = qb(
              r.moduleType,
              this.injector,
              UC(() => o)
            ),
            a = s.injector.get(ht, null);
          return (
            o.runOutsideAngular(() => {
              let c = o.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              s.onDestroy(() => {
                po(this._modules, s), c.unsubscribe();
              });
            }),
            kC(a, o, () => {
              let c = s.injector.get(gg);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = s.injector.get(Rl, Fo);
                  return EC(l || Fo), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let o = mg({}, i);
        return $C(this.injector, o, r).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(Rt);
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
        let r = this._injector.get(yg, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(at));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Mr = null,
  Dg = new S("");
function WC(t) {
  if (Mr && !Mr.get(Dg, !1)) throw new m(400, !1);
  PC(), (Mr = t);
  let e = t.get(vg);
  return YC(t), e;
}
function Ol(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new S(r);
  return (o = []) => {
    let s = wg();
    if (!s || s.injector.get(Dg, !1)) {
      let a = [...n, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : WC(QC(a, r));
    }
    return KC(i);
  };
}
function QC(t = [], e) {
  return at.create({
    name: e,
    providers: [
      { provide: Uo, useValue: "platform" },
      { provide: yg, useValue: new Set([() => (Mr = null)]) },
      ...t,
    ],
  });
}
function KC(t) {
  let e = wg();
  if (!e) throw new m(401, !1);
  return e;
}
function wg() {
  return Mr?.get(vg) ?? null;
}
function YC(t) {
  t.get(rl, null)?.forEach((n) => n());
}
var vn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = ZC;
  let t = e;
  return t;
})();
function ZC(t) {
  return XC(st(), Y(), (t & 16) === 16);
}
function XC(t, e, n) {
  if (Hr(t) && !n) {
    let r = Gt(t.index, e);
    return new fn(r, r);
  } else if (t.type & 47) {
    let r = e[Ge];
    return new fn(r, e);
  }
  return null;
}
var Rc = class {
    constructor() {}
    supports(e) {
      return sg(e);
    }
    create(e) {
      return new Oc(e);
    }
  },
  JC = (t, e) => e,
  Oc = class {
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
        (this._trackByFn = e || JC);
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
        let s = !r || (n && n.currentIndex < Hf(r, i, o)) ? n : r,
          a = Hf(s, i, o),
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
      if ((e == null && (e = []), !sg(e))) throw new m(900, !1);
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
          Gb(e, (a) => {
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
              : (e = this._addAfter(new Pc(n, r), o, i))),
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
        this._linkedRecords === null && (this._linkedRecords = new ko()),
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
        this._unlinkedRecords === null && (this._unlinkedRecords = new ko()),
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
  Pc = class {
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
  Fc = class {
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
  ko = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new Fc()), this.map.set(n, r)), r.add(e);
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
function Hf(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
function zf() {
  return new Pl([new Rc()]);
}
var Pl = (() => {
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
        useFactory: (i) => e.create(r, i || zf()),
        deps: [[e, new Lc(), new Bo()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i != null) return i;
      throw new m(901, !1);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: zf });
  let t = e;
  return t;
})();
var Eg = Ol(null, "core", []),
  bg = (() => {
    let e = class e {
      constructor(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Rt));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })();
var qf = !1,
  e0 = !1;
function t0() {
  qf || ((qf = !0), ww(), mC(), _C(), DC(), Zb(), _b(), nb(), sE(), IC());
}
function n0(t, e) {
  return Nl(t);
}
function Cg() {
  return $r([
    {
      provide: io,
      useFactory: () => {
        let t = !0;
        return (
          Ir() && (t = !!g(mn, { optional: !0 })?.get(up, null)),
          t && Qt("NgHydration"),
          t
        );
      },
    },
    {
      provide: cn,
      useValue: () => {
        (e0 = !!g(Sw, { optional: !0 })), Ir() && g(io) && (r0(), t0());
      },
      multi: !0,
    },
    { provide: pp, useFactory: () => Ir() && g(io) },
    {
      provide: or,
      useFactory: () => {
        if (Ir() && g(io)) {
          let t = g(Rt),
            e = g(at);
          return () => {
            n0(t, e).then(() => {
              WE(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function r0() {
  let t = qo(),
    e;
  for (let n of t.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === vw) {
      e = n;
      break;
    }
  if (!e) throw new m(-507, !1);
}
function Ig(t) {
  let e = zt(t);
  if (!e) return null;
  let n = new Jn(e);
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
var xg = null;
function Dn() {
  return xg;
}
function Ng(t) {
  xg ??= t;
}
var ys = class {};
var ve = new S(""),
  Vl = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(a0), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Rg = new S(""),
  a0 = (() => {
    let e = class e extends Vl {
      constructor() {
        super(),
          (this._doc = g(ve)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return Dn().getBaseHref(this._doc);
      }
      onPopState(r) {
        let i = Dn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", r, !1),
          () => i.removeEventListener("popstate", r)
        );
      }
      onHashChange(r) {
        let i = Dn().getGlobalEventTarget(this._doc, "window");
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
function $l(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function Sg(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function Ot(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var wn = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(Bl), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Og = new S(""),
  Bl = (() => {
    let e = class e extends wn {
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
        return $l(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + Ot(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && r ? `${i}${o}` : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Ot(s));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Ot(s));
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
      return new (i || e)(E(Vl), E(Og, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Pg = (() => {
    let e = class e extends wn {
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
        let i = $l(this._baseHref, r);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Ot(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + Ot(s));
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
      return new (i || e)(E(Vl), E(Og, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  sr = (() => {
    let e = class e {
      constructor(r) {
        (this._subject = new pe()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = r);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = u0(Sg(Mg(i)))),
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
        return this.path() == this.normalize(r + Ot(i));
      }
      normalize(r) {
        return e.stripTrailingSlash(l0(this._basePath, Mg(r)));
      }
      prepareExternalUrl(r) {
        return (
          r && r[0] !== "/" && (r = "/" + r),
          this._locationStrategy.prepareExternalUrl(r)
        );
      }
      go(r, i = "", o = null) {
        this._locationStrategy.pushState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Ot(i)), o);
      }
      replaceState(r, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Ot(i)), o);
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
    (e.normalizeQueryParams = Ot),
      (e.joinWithSlash = $l),
      (e.stripTrailingSlash = Sg),
      (e.ɵfac = function (i) {
        return new (i || e)(E(wn));
      }),
      (e.ɵprov = w({ token: e, factory: () => c0(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function c0() {
  return new sr(E(wn));
}
function l0(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function Mg(t) {
  return t.replace(/\/index.html$/, "");
}
function u0(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function Ul(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, o] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Fl = /\s+/,
  Tg = [],
  ar = (() => {
    let e = class e {
      constructor(r, i) {
        (this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = Tg),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Fl) : Tg;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(Fl) : r;
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
            r.split(Fl).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Z(yt), Z(rs));
    }),
      (e.ɵdir = gn({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [Tt.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var kl = class {
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
  Fg = (() => {
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
              new kl(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = i.get(s);
            i.move(c, a), _g(c, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let c = i.get(o).context;
          (c.index = o), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          _g(s, o);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Z(yn), Z(Zn), Z(Pl));
    }),
      (e.ɵdir = gn({
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
function _g(t, e) {
  t.context.$implicit = e.item;
}
var kg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })(),
  Hl = "browser",
  d0 = "server";
function Me(t) {
  return t === Hl;
}
function ei(t) {
  return t === d0;
}
var Lg = (() => {
    let e = class e {};
    e.ɵprov = w({
      token: e,
      providedIn: "root",
      factory: () => (Me(g(te)) ? new Ll(g(ve), window) : new jl()),
    });
    let t = e;
    return t;
  })(),
  Ll = class {
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
      let n = f0(this.document, e);
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
function f0(t, e) {
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
var jl = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  vs = class {};
var ws = class t {
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
var qg = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(qg || {}),
  ql = class {
    constructor(e, n = Gg.Ok, r = "OK") {
      (this.headers = e.headers || new ws()),
        (this.status = e.status !== void 0 ? e.status : n),
        (this.statusText = e.statusText || r),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var Es = class t extends ql {
  constructor(e = {}) {
    super(e),
      (this.type = qg.Response),
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
var Gg = (function (t) {
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
})(Gg || {});
var p0 = new S("");
var jg = "b",
  Vg = "h",
  $g = "s",
  Bg = "st",
  Ug = "u",
  Hg = "rt",
  Ds = new S(""),
  g0 = ["GET", "HEAD"];
function m0(t, e) {
  let d = g(Ds),
    { isCacheActive: n } = d,
    r = Fi(d, ["isCacheActive"]),
    { transferCache: i, method: o } = t;
  if (
    !n ||
    (o === "POST" && !r.includePostRequests && !i) ||
    (o !== "POST" && !g0.includes(o)) ||
    i === !1 ||
    r.filter?.(t) === !1
  )
    return e(t);
  let s = g(mn),
    a = v0(t),
    c = s.get(a, null),
    l = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (l = i.includeHeaders), c)) {
    let { [jg]: f, [Hg]: h, [Vg]: p, [$g]: y, [Bg]: x, [Ug]: T } = c,
      H = f;
    switch (h) {
      case "arraybuffer":
        H = new TextEncoder().encode(f).buffer;
        break;
      case "blob":
        H = new Blob([f]);
        break;
    }
    let z = new ws(p);
    return _(new Es({ body: H, headers: z, status: y, statusText: x, url: T }));
  }
  let u = ei(g(te));
  return e(t).pipe(
    le((f) => {
      f instanceof Es &&
        u &&
        s.set(a, {
          [jg]: f.body,
          [Vg]: y0(f.headers, l),
          [$g]: f.status,
          [Bg]: f.statusText,
          [Ug]: f.url || "",
          [Hg]: t.responseType,
        });
    })
  );
}
function y0(t, e) {
  if (!e) return {};
  let n = {};
  for (let r of e) {
    let i = t.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function zg(t) {
  return [...t.keys()]
    .sort()
    .map((e) => `${e}=${t.getAll(e)}`)
    .join("&");
}
function v0(t) {
  let { params: e, method: n, responseType: r, url: i } = t,
    o = zg(e),
    s = t.serializeBody();
  s instanceof URLSearchParams ? (s = zg(s)) : typeof s != "string" && (s = "");
  let a = [n, r, i, s, o].join("|"),
    c = D0(a);
  return c;
}
function D0(t) {
  let e = 0;
  for (let n of t) e = (Math.imul(31, e) + n.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function Wg(t) {
  return [
    {
      provide: Ds,
      useFactory: () => (
        Qt("NgHttpTransferCache"), v({ isCacheActive: !0 }, t)
      ),
    },
    { provide: p0, useValue: m0, multi: !0, deps: [mn, Ds] },
    {
      provide: or,
      multi: !0,
      useFactory: () => {
        let e = g(Rt),
          n = g(Ds);
        return () => {
          Nl(e).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var Ql = class extends ys {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Kl = class t extends Ql {
    static makeCurrent() {
      Ng(new t());
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
      let n = w0();
      return n == null ? null : E0(n);
    }
    resetBaseElement() {
      ti = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Ul(document.cookie, e);
    }
  },
  ti = null;
function w0() {
  return (
    (ti = ti || document.querySelector("base")),
    ti ? ti.getAttribute("href") : null
  );
}
function E0(t) {
  return new URL(t, document.baseURI).pathname;
}
var Yl = class {
    addToWindow(e) {
      (Oe.getAngularTestability = (r, i = !0) => {
        let o = e.findTestabilityInTree(r, i);
        if (o == null) throw new m(5103, !1);
        return o;
      }),
        (Oe.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (Oe.getAllAngularRootElements = () => e.getAllRootElements());
      let n = (r) => {
        let i = Oe.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && r();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      Oe.frameworkStabilizers || (Oe.frameworkStabilizers = []),
        Oe.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(e, n, r) {
      if (n == null) return null;
      let i = e.getTestability(n);
      return (
        i ??
        (r
          ? Dn().isShadowRoot(n)
            ? this.findTestabilityInTree(e, n.host, !0)
            : this.findTestabilityInTree(e, n.parentElement, !0)
          : null)
      );
    }
  },
  b0 = (() => {
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
  Zl = new S(""),
  Yg = (() => {
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
      return new (i || e)(E(Zl), E(G));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  bs = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Gl = "ng-app-id",
  Zg = (() => {
    let e = class e {
      constructor(r, i, o, s = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ei(s)),
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
        let r = this.doc.head?.querySelectorAll(`style[${Gl}="${this.appId}"]`);
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
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(Gl), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Gl, this.appId),
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
      return new (i || e)(E(ve), E(Wr), E(ol, 8), E(te));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Wl = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  eu = /%COMP%/g,
  Xg = "%COMP%",
  C0 = `_nghost-${Xg}`,
  I0 = `_ngcontent-${Xg}`,
  S0 = !0,
  M0 = new S("", { providedIn: "root", factory: () => S0 });
function T0(t) {
  return I0.replace(eu, t);
}
function _0(t) {
  return C0.replace(eu, t);
}
function Jg(t, e) {
  return e.map((n) => n.replace(eu, t));
}
var Cs = (() => {
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
          (this.platformIsServer = ei(c)),
          (this.defaultRenderer = new ni(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === ft.ShadowDom &&
          (i = se(v({}, i), { encapsulation: ft.Emulated }));
        let o = this.getOrCreateRenderer(r, i);
        return (
          o instanceof Is
            ? o.applyToHost(r)
            : o instanceof ri && o.applyStyles(),
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
            case ft.Emulated:
              s = new Is(l, u, i, this.appId, d, a, c, f);
              break;
            case ft.ShadowDom:
              return new Xl(l, u, r, i, a, c, this.nonce, f);
            default:
              s = new ri(l, u, i, d, a, c, f);
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
        E(Yg),
        E(Zg),
        E(Wr),
        E(M0),
        E(ve),
        E(te),
        E(G),
        E(ol)
      );
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ni = class {
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
        ? this.doc.createElementNS(Wl[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (Qg(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (Qg(e) ? e.content : e).insertBefore(n, r);
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
        let o = Wl[i];
        o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Wl[r];
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
      i & (Nt.DashCase | Nt.Important)
        ? e.style.setProperty(n, r, i & Nt.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & Nt.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
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
        ((e = Dn().getGlobalEventTarget(this.doc, e)), !e)
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
function Qg(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Xl = class extends ni {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = Jg(i.id, i.styles);
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
  ri = class extends ni {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? Jg(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Is = class extends ri {
    constructor(e, n, r, i, o, s, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, o, s, a, c, l),
        (this.contentAttr = T0(l)),
        (this.hostAttr = _0(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  A0 = (() => {
    let e = class e extends bs {
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
  Kg = ["alt", "control", "meta", "shift"],
  x0 = {
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
  N0 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  R0 = (() => {
    let e = class e extends bs {
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
          .runOutsideAngular(() => Dn().onAndCancel(r, s.domEventName, a));
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
          Kg.forEach((u) => {
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
        let o = x0[r.key] || r.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = r.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Kg.forEach((a) => {
                if (a !== o) {
                  let c = N0[a];
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
function O0() {
  Kl.makeCurrent();
}
function P0() {
  return new ht();
}
function F0() {
  return sp(document), document;
}
var k0 = [
    { provide: te, useValue: Hl },
    { provide: rl, useValue: O0, multi: !0 },
    { provide: ve, useFactory: F0, deps: [] },
  ],
  em = Ol(Eg, "browser", k0),
  L0 = new S(""),
  j0 = [
    { provide: Xr, useClass: Yl, deps: [] },
    { provide: Al, useClass: hs, deps: [G, ps, Xr] },
    { provide: hs, useClass: hs, deps: [G, ps, Xr] },
  ],
  V0 = [
    { provide: Uo, useValue: "root" },
    { provide: ht, useFactory: P0, deps: [] },
    { provide: Zl, useClass: A0, multi: !0, deps: [ve, G, te] },
    { provide: Zl, useClass: R0, multi: !0, deps: [ve] },
    Cs,
    Zg,
    Yg,
    { provide: hn, useExisting: Cs },
    { provide: vs, useClass: b0, deps: [] },
    [],
  ],
  tu = (() => {
    let e = class e {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: e, providers: [{ provide: Wr, useValue: r.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(L0, 12));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({ providers: [...V0, ...j0], imports: [kg, bg] }));
    let t = e;
    return t;
  })();
var tm = (() => {
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
var Jl = (function (t) {
  return (
    (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    t
  );
})(Jl || {});
function nm(...t) {
  let e = [],
    n = new Set(),
    r = n.has(Jl.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: o } of t) n.add(o), i.length && e.push(i);
  return $r([[], Cg(), n.has(Jl.NoHttpTransferCache) || r ? [] : Wg({}), e]);
}
var R = "primary",
  vi = Symbol("RouteTitle"),
  su = class {
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
function fr(t) {
  return new su(t);
}
function $0(t, e, n) {
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
function B0(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!vt(t[n], e[n])) return !1;
  return !0;
}
function vt(t, e) {
  let n = t ? au(t) : void 0,
    r = e ? au(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let o = 0; o < n.length; o++)
    if (((i = n[o]), !fm(t[i], e[i]))) return !1;
  return !0;
}
function au(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function fm(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, o) => r[o] === i);
  } else return t === e;
}
function hm(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Xt(t) {
  return ba(t) ? t : Jr(t) ? ie(Promise.resolve(t)) : _(t);
}
var U0 = { exact: gm, subset: mm },
  pm = { exact: H0, subset: z0, ignored: () => !0 };
function im(t, e, n) {
  return (
    U0[n.paths](t.root, e.root, n.matrixParams) &&
    pm[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function H0(t, e) {
  return vt(t, e);
}
function gm(t, e, n) {
  if (
    !bn(t.segments, e.segments) ||
    !Ts(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !gm(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function z0(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => fm(t[n], e[n]))
  );
}
function mm(t, e, n) {
  return ym(t, e, e.segments, n);
}
function ym(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!bn(i, n) || e.hasChildren() || !Ts(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!bn(t.segments, n) || !Ts(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !mm(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      o = n.slice(t.segments.length);
    return !bn(t.segments, i) || !Ts(t.segments, i, r) || !t.children[R]
      ? !1
      : ym(t.children[R], e, o, r);
  }
}
function Ts(t, e, n) {
  return e.every((r, i) => pm[n](t[i].parameters, r.parameters));
}
var Kt = class {
    constructor(e = new W([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= fr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return W0.serialize(this);
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
      return _s(this);
    }
  },
  En = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= fr(this.parameters)), this._parameterMap;
    }
    toString() {
      return Dm(this);
    }
  };
function q0(t, e) {
  return bn(t, e) && t.every((n, r) => vt(n.parameters, e[r].parameters));
}
function bn(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function G0(t, e) {
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
var Di = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => new ui(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ui = class {
    parse(e) {
      let n = new lu(e);
      return new Kt(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(e) {
      let n = `/${ii(e.root, !0)}`,
        r = Y0(e.queryParams),
        i = typeof e.fragment == "string" ? `#${Q0(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  W0 = new ui();
function _s(t) {
  return t.segments.map((e) => Dm(e)).join("/");
}
function ii(t, e) {
  if (!t.hasChildren()) return _s(t);
  if (e) {
    let n = t.children[R] ? ii(t.children[R], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== R && r.push(`${i}:${ii(o, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = G0(t, (r, i) =>
      i === R ? [ii(t.children[R], !1)] : [`${i}:${ii(r, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[R] != null
      ? `${_s(t)}/${n[0]}`
      : `${_s(t)}/(${n.join("//")})`;
  }
}
function vm(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Ss(t) {
  return vm(t).replace(/%3B/gi, ";");
}
function Q0(t) {
  return encodeURI(t);
}
function cu(t) {
  return vm(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function As(t) {
  return decodeURIComponent(t);
}
function om(t) {
  return As(t.replace(/\+/g, "%20"));
}
function Dm(t) {
  return `${cu(t.path)}${K0(t.parameters)}`;
}
function K0(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${cu(e)}=${cu(n)}`)
    .join("");
}
function Y0(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${Ss(n)}=${Ss(i)}`).join("&")
        : `${Ss(n)}=${Ss(r)}`
    )
    .filter((n) => n);
  return e.length ? `?${e.join("&")}` : "";
}
var Z0 = /^[^\/()?;#]+/;
function nu(t) {
  let e = t.match(Z0);
  return e ? e[0] : "";
}
var X0 = /^[^\/()?;=#]+/;
function J0(t) {
  let e = t.match(X0);
  return e ? e[0] : "";
}
var eI = /^[^=?&#]+/;
function tI(t) {
  let e = t.match(eI);
  return e ? e[0] : "";
}
var nI = /^[^&#]+/;
function rI(t) {
  let e = t.match(nI);
  return e ? e[0] : "";
}
var lu = class {
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
    let e = nu(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new m(4009, !1);
    return this.capture(e), new En(As(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = J0(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = nu(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[As(n)] = As(r);
  }
  parseQueryParam(e) {
    let n = tI(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = rI(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let i = om(n),
      o = om(r);
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
      let r = nu(this.remaining),
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
function wm(t) {
  return t.segments.length > 0 ? new W([], { [R]: t }) : t;
}
function Em(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let o = Em(i);
    if (r === R && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
  }
  let n = new W(t.segments, e);
  return iI(n);
}
function iI(t) {
  if (t.numberOfChildren === 1 && t.children[R]) {
    let e = t.children[R];
    return new W(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function hr(t) {
  return t instanceof Kt;
}
function oI(t, e, n = null, r = null) {
  let i = bm(t);
  return Cm(i, e, n, r);
}
function bm(t) {
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
    i = wm(r);
  return e ?? i;
}
function Cm(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return ru(i, i, i, n, r);
  let o = sI(e);
  if (o.toRoot()) return ru(i, i, new W([], {}), n, r);
  let s = aI(o, i, t),
    a = s.processChildren
      ? ai(s.segmentGroup, s.index, o.commands)
      : Sm(s.segmentGroup, s.index, o.commands);
  return ru(i, s.segmentGroup, a, n, r);
}
function xs(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function di(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function ru(t, e, n, r, i) {
  let o = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  t === e ? (s = n) : (s = Im(t, e, n));
  let a = wm(Em(s));
  return new Kt(a, o, i);
}
function Im(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (r[i] = n) : (r[i] = Im(o, e, n));
    }),
    new W(t.segments, r)
  );
}
var Ns = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && xs(r[0]))
    )
      throw new m(4003, !1);
    let i = r.find(di);
    if (i && i !== hm(r)) throw new m(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function sI(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Ns(!0, 0, t);
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
  return new Ns(n, e, r);
}
var ur = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function aI(t, e, n) {
  if (t.isAbsolute) return new ur(e, !0, 0);
  if (!n) return new ur(e, !1, NaN);
  if (n.parent === null) return new ur(n, !0, 0);
  let r = xs(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return cI(n, i, t.numberOfDoubleDots);
}
function cI(t, e, n) {
  let r = t,
    i = e,
    o = n;
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new m(4005, !1);
    i = r.segments.length;
  }
  return new ur(r, !1, i - o);
}
function lI(t) {
  return di(t[0]) ? t[0].outlets : { [R]: t };
}
function Sm(t, e, n) {
  if (((t ??= new W([], {})), t.segments.length === 0 && t.hasChildren()))
    return ai(t, e, n);
  let r = uI(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let o = new W(t.segments.slice(0, r.pathIndex), {});
    return (
      (o.children[R] = new W(t.segments.slice(r.pathIndex), t.children)),
      ai(o, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new W(t.segments, {})
      : r.match && !t.hasChildren()
      ? uu(t, e, n)
      : r.match
      ? ai(t, 0, i)
      : uu(t, e, n);
}
function ai(t, e, n) {
  if (n.length === 0) return new W(t.segments, {});
  {
    let r = lI(n),
      i = {};
    if (
      Object.keys(r).some((o) => o !== R) &&
      t.children[R] &&
      t.numberOfChildren === 1 &&
      t.children[R].segments.length === 0
    ) {
      let o = ai(t.children[R], e, n);
      return new W(t.segments, o.children);
    }
    return (
      Object.entries(r).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Sm(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        r[o] === void 0 && (i[o] = s);
      }),
      new W(t.segments, i)
    );
  }
}
function uI(t, e, n) {
  let r = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return o;
    let s = t.segments[i],
      a = n[r];
    if (di(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!am(c, l, s)) return o;
      r += 2;
    } else {
      if (!am(c, {}, s)) return o;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function uu(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (di(o)) {
      let c = dI(o.outlets);
      return new W(r, c);
    }
    if (i === 0 && xs(n[0])) {
      let c = t.segments[e];
      r.push(new En(c.path, sm(n[0]))), i++;
      continue;
    }
    let s = di(o) ? o.outlets[R] : `${o}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    s && a && xs(a)
      ? (r.push(new En(s, sm(a))), (i += 2))
      : (r.push(new En(s, {})), i++);
  }
  return new W(r, {});
}
function dI(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = uu(new W([], {}), 0, r));
    }),
    e
  );
}
function sm(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function am(t, e, n) {
  return t == n.path && vt(e, n.parameters);
}
var ci = "imperative",
  me = (function (t) {
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
  })(me || {}),
  Ye = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  pr = class extends Ye {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = me.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Pt = class extends Ye {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = me.NavigationEnd);
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
  Rs = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Rs || {}),
  Yt = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = me.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Zt = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = me.NavigationSkipped);
    }
  },
  fi = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = me.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Os = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = me.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  du = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = me.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  fu = class extends Ye {
    constructor(e, n, r, i, o) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = me.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  hu = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = me.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  pu = class extends Ye {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = me.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  gu = class {
    constructor(e) {
      (this.route = e), (this.type = me.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  mu = class {
    constructor(e) {
      (this.route = e), (this.type = me.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  yu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = me.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  vu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = me.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Du = class {
    constructor(e) {
      (this.snapshot = e), (this.type = me.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  wu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = me.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ps = class {
    constructor(e, n, r) {
      (this.routerEvent = e),
        (this.position = n),
        (this.anchor = r),
        (this.type = me.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  hi = class {},
  pi = class {
    constructor(e) {
      this.url = e;
    }
  };
var Eu = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new wi()),
        (this.attachRef = null);
    }
  },
  wi = (() => {
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
        return i || ((i = new Eu()), this.contexts.set(r, i)), i;
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
  Fs = class {
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
      let n = bu(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = bu(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = Cu(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Cu(e, this._root).map((n) => n.value);
    }
  };
function bu(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = bu(t, n);
    if (r) return r;
  }
  return null;
}
function Cu(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = Cu(t, n);
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
function lr(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var ks = class extends Fs {
  constructor(e, n) {
    super(e), (this.snapshot = n), Ou(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Mm(t) {
  let e = fI(t),
    n = new ye([new En("", {})]),
    r = new ye({}),
    i = new ye({}),
    o = new ye({}),
    s = new ye(""),
    a = new gr(n, r, o, s, i, R, t, e.root);
  return (a.snapshot = e.root), new ks(new je(a, []), e);
}
function fI(t) {
  let e = {},
    n = {},
    r = {},
    i = "",
    o = new gi([], e, r, i, n, R, t, null, {});
  return new Ls("", new je(o, []));
}
var gr = class {
  constructor(e, n, r, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(L((l) => l[vi])) ?? _(void 0)),
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
      (this._paramMap ??= this.params.pipe(L((e) => fr(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(L((e) => fr(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Ru(t, e, n = "emptyOnly") {
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
    i && _m(i) && (r.resolve[vi] = i.title),
    r
  );
}
var gi = class {
    get title() {
      return this.data?.[vi];
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
      return (this._paramMap ??= fr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= fr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  Ls = class extends Fs {
    constructor(e, n) {
      super(n), (this.url = e), Ou(this, n);
    }
    toString() {
      return Tm(this._root);
    }
  };
function Ou(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => Ou(t, n));
}
function Tm(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Tm).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function iu(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      vt(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      vt(e.params, n.params) || t.paramsSubject.next(n.params),
      B0(e.url, n.url) || t.urlSubject.next(n.url),
      vt(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Iu(t, e) {
  let n = vt(t.params, e.params) && q0(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || Iu(t.parent, e.parent));
}
function _m(t) {
  return typeof t.title == "string" || t.title === null;
}
var hI = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = R),
          (this.activateEvents = new pe()),
          (this.deactivateEvents = new pe()),
          (this.attachEvents = new pe()),
          (this.detachEvents = new pe()),
          (this.parentContexts = g(wi)),
          (this.location = g(yn)),
          (this.changeDetector = g(vn)),
          (this.environmentInjector = g(Ie)),
          (this.inputBinder = g(Us, { optional: !0 })),
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
          l = new Su(r, c, o.injector);
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
      (e.ɵdir = gn({
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
        features: [zo],
      }));
    let t = e;
    return t;
  })(),
  Su = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === gr
        ? this.route
        : e === wi
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  Us = new S(""),
  cm = (() => {
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
          o = Cr([i.queryParams, i.params, i.data])
            .pipe(
              Re(
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
              let a = Ig(i.component);
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
function pI(t, e, n) {
  let r = mi(t, e._root, n ? n._root : void 0);
  return new ks(r, e);
}
function mi(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = gI(t, e, n);
    return new je(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => mi(t, a))),
          s
        );
      }
    }
    let r = mI(e.value),
      i = e.children.map((o) => mi(t, o));
    return new je(r, i);
  }
}
function gI(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return mi(t, r, i);
    return mi(t, r);
  });
}
function mI(t) {
  return new gr(
    new ye(t.url),
    new ye(t.params),
    new ye(t.queryParams),
    new ye(t.fragment),
    new ye(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Am = "ngNavigationCancelingError";
function xm(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = hr(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Nm(!1, Ve.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function Nm(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ""}`);
  return (n[Am] = !0), (n.cancellationCode = e), n;
}
function yI(t) {
  return Rm(t) && hr(t.url);
}
function Rm(t) {
  return !!t && t[Am];
}
var vI = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [hg],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && X(0, "router-outlet");
      },
      dependencies: [hI],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function DI(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = os(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Pu(t) {
  let e = t.children && t.children.map(Pu),
    n = e ? se(v({}, t), { children: e }) : v({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== R &&
      (n.component = vI),
    n
  );
}
function Dt(t) {
  return t.outlet || R;
}
function wI(t, e) {
  let n = t.filter((r) => Dt(r) === e);
  return n.push(...t.filter((r) => Dt(r) !== e)), n;
}
function Ei(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var EI = (t, e, n, r) =>
    L(
      (i) => (
        new Mu(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      )
    ),
  Mu = class {
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
        iu(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = lr(n);
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
        o = lr(e);
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
        o = lr(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = lr(n);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], r),
          this.forwardEvent(new wu(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new vu(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if ((iu(i), i === o))
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
            iu(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Ei(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  js = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  dr = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function bI(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return oi(r, i, n, [r.value]);
}
function CI(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function yr(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !Yf(t) ? t : e.get(t)) : r;
}
function oi(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = lr(e);
  return (
    t.children.forEach((s) => {
      II(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => li(a, n.getContext(s), i)),
    i
  );
}
function II(
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
    let c = SI(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new js(r))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? oi(t, e, a ? a.children : null, r, i) : oi(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new dr(a.outlet.component, s));
  } else
    s && li(e, a, i),
      i.canActivateChecks.push(new js(r)),
      o.component
        ? oi(t, null, a ? a.children : null, r, i)
        : oi(t, null, n, r, i);
  return i;
}
function SI(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !bn(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !bn(t.url, e.url) || !vt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Iu(t, e) || !vt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Iu(t, e);
  }
}
function li(t, e, n) {
  let r = lr(t),
    i = t.value;
  Object.entries(r).forEach(([o, s]) => {
    i.component
      ? e
        ? li(s, e.children.getContext(o), n)
        : li(s, null, n)
      : li(s, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new dr(e.outlet.component, i))
        : n.canDeactivateChecks.push(new dr(null, i))
      : n.canDeactivateChecks.push(new dr(null, i));
}
function bi(t) {
  return typeof t == "function";
}
function MI(t) {
  return typeof t == "boolean";
}
function TI(t) {
  return t && bi(t.canLoad);
}
function _I(t) {
  return t && bi(t.canActivate);
}
function AI(t) {
  return t && bi(t.canActivateChild);
}
function xI(t) {
  return t && bi(t.canDeactivate);
}
function NI(t) {
  return t && bi(t.canMatch);
}
function Om(t) {
  return t instanceof It || t?.name === "EmptyError";
}
var Ms = Symbol("INITIAL_VALUE");
function mr() {
  return Re((t) =>
    Cr(t.map((e) => e.pipe(St(1), Ma(Ms)))).pipe(
      L((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === Ms) return Ms;
            if (n === !1 || n instanceof Kt) return n;
          }
        return !0;
      }),
      Ne((e) => e !== Ms),
      St(1)
    )
  );
}
function RI(t, e) {
  return ae((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && o.length === 0
      ? _(se(v({}, n), { guardsResult: !0 }))
      : OI(s, r, i, t).pipe(
          ae((a) => (a && MI(a) ? PI(r, o, t, e) : _(a))),
          L((a) => se(v({}, n), { guardsResult: a }))
        );
  });
}
function OI(t, e, n, r) {
  return ie(t).pipe(
    ae((i) => VI(i.component, i.route, n, e, r)),
    Je((i) => i !== !0, !0)
  );
}
function PI(t, e, n, r) {
  return ie(e).pipe(
    $t((i) =>
      jn(
        kI(i.route.parent, r),
        FI(i.route, r),
        jI(t, i.path, n),
        LI(t, i.route, n)
      )
    ),
    Je((i) => i !== !0, !0)
  );
}
function FI(t, e) {
  return t !== null && e && e(new Du(t)), _(!0);
}
function kI(t, e) {
  return t !== null && e && e(new yu(t)), _(!0);
}
function LI(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return _(!0);
  let i = r.map((o) =>
    to(() => {
      let s = Ei(e) ?? n,
        a = yr(o, s),
        c = _I(a) ? a.canActivate(e, t) : pt(s, () => a(e, t));
      return Xt(c).pipe(Je());
    })
  );
  return _(i).pipe(mr());
}
function jI(t, e, n) {
  let r = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => CI(s))
      .filter((s) => s !== null)
      .map((s) =>
        to(() => {
          let a = s.guards.map((c) => {
            let l = Ei(s.node) ?? n,
              u = yr(c, l),
              d = AI(u) ? u.canActivateChild(r, t) : pt(l, () => u(r, t));
            return Xt(d).pipe(Je());
          });
          return _(a).pipe(mr());
        })
      );
  return _(o).pipe(mr());
}
function VI(t, e, n, r, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return _(!0);
  let s = o.map((a) => {
    let c = Ei(e) ?? i,
      l = yr(a, c),
      u = xI(l) ? l.canDeactivate(t, e, n, r) : pt(c, () => l(t, e, n, r));
    return Xt(u).pipe(Je());
  });
  return _(s).pipe(mr());
}
function $I(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = yr(s, t),
      c = TI(a) ? a.canLoad(e, n) : pt(t, () => a(e, n));
    return Xt(c);
  });
  return _(o).pipe(mr(), Pm(r));
}
function Pm(t) {
  return va(
    le((e) => {
      if (hr(e)) throw xm(t, e);
    }),
    L((e) => e === !0)
  );
}
function BI(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = yr(s, t),
      c = NI(a) ? a.canMatch(e, n) : pt(t, () => a(e, n));
    return Xt(c);
  });
  return _(o).pipe(mr(), Pm(r));
}
var yi = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Vs = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function cr(t) {
  return kn(new yi(t));
}
function UI(t) {
  return kn(new m(4e3, !1));
}
function HI(t) {
  return kn(Nm(!1, Ve.GuardRejected));
}
var Tu = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return _(r);
        if (i.numberOfChildren > 1 || !i.children[R]) return UI(e.redirectTo);
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
      if (n.startsWith("/")) throw new Vs(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let o = this.createSegmentGroup(e, n.root, r, i);
      return new Kt(
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
  _u = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function zI(t, e, n, r, i) {
  let o = Fu(t, e, n);
  return o.matched
    ? ((r = DI(e, r)),
      BI(r, e, n, i).pipe(L((s) => (s === !0 ? o : v({}, _u)))))
    : _(o);
}
function Fu(t, e, n) {
  if (e.path === "**") return qI(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? v({}, _u)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || $0)(n, t, e);
  if (!i) return v({}, _u);
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
function qI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? hm(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function lm(t, e, n, r) {
  return n.length > 0 && QI(t, n, r)
    ? {
        segmentGroup: new W(e, WI(r, new W(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && KI(t, n, r)
    ? {
        segmentGroup: new W(t.segments, GI(t, n, r, t.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new W(t.segments, t.children), slicedSegments: n };
}
function GI(t, e, n, r) {
  let i = {};
  for (let o of n)
    if (Hs(t, e, o) && !r[Dt(o)]) {
      let s = new W([], {});
      i[Dt(o)] = s;
    }
  return v(v({}, r), i);
}
function WI(t, e) {
  let n = {};
  n[R] = e;
  for (let r of t)
    if (r.path === "" && Dt(r) !== R) {
      let i = new W([], {});
      n[Dt(r)] = i;
    }
  return n;
}
function QI(t, e, n) {
  return n.some((r) => Hs(t, e, r) && Dt(r) !== R);
}
function KI(t, e, n) {
  return n.some((r) => Hs(t, e, r));
}
function Hs(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function YI(t, e, n, r) {
  return Dt(t) !== r && (r === R || !Hs(e, n, t)) ? !1 : Fu(e, t, n).matched;
}
function ZI(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var Au = class {};
function XI(t, e, n, r, i, o, s = "emptyOnly") {
  return new xu(t, e, n, r, i, s, o).recognize();
}
var JI = 31,
  xu = class {
    constructor(e, n, r, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Tu(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new m(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = lm(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        L((n) => {
          let r = new gi(
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
            o = new Ls("", i),
            s = oI(r, [], this.urlTree.queryParams, this.urlTree.fragment);
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
        Vt((r) => {
          if (r instanceof Vs)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof yi ? this.noMatchError(r) : r;
        })
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = Ru(r, n, this.paramsInheritanceStrategy);
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
      return ie(i).pipe(
        $t((o) => {
          let s = r.children[o],
            a = wI(n, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Sa((o, s) => (o.push(...s), o)),
        Bt(null),
        Ia(),
        ae((o) => {
          if (o === null) return cr(r);
          let s = Fm(o);
          return eS(s), _(s);
        })
      );
    }
    processSegment(e, n, r, i, o, s) {
      return ie(n).pipe(
        $t((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            o,
            s
          ).pipe(
            Vt((c) => {
              if (c instanceof yi) return _(null);
              throw c;
            })
          )
        ),
        Je((a) => !!a),
        Vt((a) => {
          if (Om(a)) return ZI(r, i, o) ? _(new Au()) : cr(r);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, n, r, i, o, s, a) {
      return YI(r, i, o, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, o, s)
          : cr(i)
        : cr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = Fu(n, i, o);
      if (!a) return cr(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > JI && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(ae((f) => this.processSegment(e, r, n, f.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, o) {
      let s = zI(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        s.pipe(
          Re((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  Re(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new gi(
                        u,
                        f,
                        Object.freeze(v({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        nS(r),
                        Dt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        rS(r)
                      ),
                      { segmentGroup: p, slicedSegments: y } = lm(n, u, d, c);
                    if (y.length === 0 && p.hasChildren())
                      return this.processChildren(l, c, p).pipe(
                        L((T) => (T === null ? null : new je(h, T)))
                      );
                    if (c.length === 0 && y.length === 0)
                      return _(new je(h, []));
                    let x = Dt(r) === o;
                    return this.processSegment(l, c, p, y, x ? R : o, !0).pipe(
                      L((T) => new je(h, T instanceof je ? [T] : []))
                    );
                  })
                ))
              : cr(n)
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
          : $I(e, n, r, this.urlSerializer).pipe(
              ae((i) =>
                i
                  ? this.configLoader.loadChildren(e, n).pipe(
                      le((o) => {
                        (n._loadedRoutes = o.routes),
                          (n._loadedInjector = o.injector);
                      })
                    )
                  : HI(n)
              )
            )
        : _({ routes: [], injector: e });
    }
  };
function eS(t) {
  t.sort((e, n) =>
    e.value.outlet === R
      ? -1
      : n.value.outlet === R
      ? 1
      : e.value.outlet.localeCompare(n.value.outlet)
  );
}
function tS(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function Fm(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!tS(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = Fm(r.children);
    e.push(new je(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function nS(t) {
  return t.data || {};
}
function rS(t) {
  return t.resolve || {};
}
function iS(t, e, n, r, i, o) {
  return ae((s) =>
    XI(t, e, n, r, s.extractedUrl, i, o).pipe(
      L(({ state: a, tree: c }) =>
        se(v({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function oS(t, e) {
  return ae((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return _(n);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of km(c)) s.add(l);
    let a = 0;
    return ie(s).pipe(
      $t((c) =>
        o.has(c)
          ? sS(c, r, t, e)
          : ((c.data = Ru(c, c.parent, t).resolve), _(void 0))
      ),
      le(() => a++),
      $n(1),
      ae((c) => (a === s.size ? _(n) : xe))
    );
  });
}
function km(t) {
  let e = t.children.map((n) => km(n)).flat();
  return [t, ...e];
}
function sS(t, e, n, r) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !_m(i) && (o[vi] = i.title),
    aS(o, t, e, r).pipe(
      L(
        (s) => (
          (t._resolvedData = s), (t.data = Ru(t, t.parent, n).resolve), null
        )
      )
    )
  );
}
function aS(t, e, n, r) {
  let i = au(t);
  if (i.length === 0) return _({});
  let o = {};
  return ie(i).pipe(
    ae((s) =>
      cS(t[s], e, n, r).pipe(
        Je(),
        le((a) => {
          o[s] = a;
        })
      )
    ),
    $n(1),
    Ca(o),
    Vt((s) => (Om(s) ? xe : kn(s)))
  );
}
function cS(t, e, n, r) {
  let i = Ei(e) ?? r,
    o = yr(t, i),
    s = o.resolve ? o.resolve(e, n) : pt(i, () => o(e, n));
  return Xt(s);
}
function ou(t) {
  return Re((e) => {
    let n = t(e);
    return n ? ie(n).pipe(L(() => e)) : _(e);
  });
}
var Lm = (() => {
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
        return r.data[vi];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(lS), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  lS = (() => {
    let e = class e extends Lm {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(tm));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ci = new S("", { providedIn: "root", factory: () => ({}) }),
  $s = new S(""),
  ku = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = g(ms));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return _(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Xt(r.loadComponent()).pipe(
            L(jm),
            le((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            Vn(() => {
              this.componentLoaders.delete(r);
            })
          ),
          o = new Fn(i, () => new we()).pipe(Pn());
        return this.componentLoaders.set(r, o), o;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return _({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = uS(i, this.compiler, r, this.onLoadEndListener).pipe(
            Vn(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new Fn(s, () => new we()).pipe(Pn());
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
function uS(t, e, n, r) {
  return Xt(t.loadChildren()).pipe(
    L(jm),
    ae((i) =>
      i instanceof kr || Array.isArray(i) ? _(i) : ie(e.compileModuleAsync(i))
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
            (s = o.get($s, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Pu), injector: o }
      );
    })
  );
}
function dS(t) {
  return t && typeof t == "object" && "default" in t;
}
function jm(t) {
  return dS(t) ? t.default : t;
}
var Lu = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(fS), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fS = (() => {
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
  Vm = new S(""),
  $m = new S("");
function hS(t, e, n) {
  let r = t.get($m),
    i = t.get(ve);
  return t.get(G).runOutsideAngular(() => {
    if (!i.startViewTransition || r.skipNextTransition)
      return (r.skipNextTransition = !1), new Promise((l) => setTimeout(l));
    let o,
      s = new Promise((l) => {
        o = l;
      }),
      a = i.startViewTransition(() => (o(), pS(t))),
      { onViewTransitionCreated: c } = r;
    return c && pt(t, () => c({ transition: a, from: e, to: n })), s;
  });
}
function pS(t) {
  return new Promise((e) => {
    is(e, { injector: t });
  });
}
var ju = (() => {
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
        (this.configLoader = g(ku)),
        (this.environmentInjector = g(Ie)),
        (this.urlSerializer = g(Di)),
        (this.rootContexts = g(wi)),
        (this.location = g(sr)),
        (this.inputBindingEnabled = g(Us, { optional: !0 }) !== null),
        (this.titleStrategy = g(Lm)),
        (this.options = g(Ci, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = g(Lu)),
        (this.createViewTransition = g(Vm, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => _(void 0)),
        (this.rootComponentType = null);
      let r = (o) => this.events.next(new gu(o)),
        i = (o) => this.events.next(new mu(o));
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
        (this.transitions = new ye({
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
          source: ci,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          Ne((s) => s.id !== 0),
          L((s) =>
            se(v({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Re((s) => {
            let a = !1,
              c = !1;
            return _(s).pipe(
              Re((l) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Ve.SupersededByNewNavigation
                    ),
                    xe
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
                      new Zt(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        f,
                        Rs.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    xe
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return _(l).pipe(
                    Re((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new pr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? xe
                          : Promise.resolve(f)
                      );
                    }),
                    iS(
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
                      let h = new Os(
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
                      extras: x,
                    } = l,
                    T = new pr(f, this.urlSerializer.serialize(h), p, y);
                  this.events.next(T);
                  let H = Mm(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      se(v({}, l), {
                        targetSnapshot: H,
                        urlAfterRedirects: h,
                        extras: se(v({}, x), {
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
                      new Zt(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        f,
                        Rs.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    xe
                  );
                }
              }),
              le((l) => {
                let u = new du(
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
                      guards: bI(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              RI(this.environmentInjector, (l) => this.events.next(l)),
              le((l) => {
                if (((s.guardsResult = l.guardsResult), hr(l.guardsResult)))
                  throw xm(this.urlSerializer, l.guardsResult);
                let u = new fu(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(u);
              }),
              Ne((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Ve.GuardRejected),
                    !1)
              ),
              ou((l) => {
                if (l.guards.canActivateChecks.length)
                  return _(l).pipe(
                    le((u) => {
                      let d = new hu(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Re((u) => {
                      let d = !1;
                      return _(u).pipe(
                        oS(
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
                      let d = new pu(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              ou((l) => {
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
                return Cr(u(l.targetSnapshot.root)).pipe(Bt(null), St(1));
              }),
              ou(() => this.afterPreactivation()),
              Re(() => {
                let { currentSnapshot: l, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root
                  );
                return d ? ie(d).pipe(L(() => s)) : _(s);
              }),
              L((l) => {
                let u = pI(
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
                this.events.next(new hi());
              }),
              EI(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              St(1),
              le({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Pt(
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
              Ta(
                this.transitionAbortSubject.pipe(
                  le((l) => {
                    throw l;
                  })
                )
              ),
              Vn(() => {
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
              Vt((l) => {
                if (((c = !0), Rm(l)))
                  this.events.next(
                    new Yt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    yI(l) ? this.events.next(new pi(l.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new fi(
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
                return xe;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(r, i, o) {
      let s = new Yt(r.id, this.urlSerializer.serialize(r.extractedUrl), i, o);
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
function gS(t) {
  return t !== ci;
}
var mS = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(yS), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Nu = class {
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
  yS = (() => {
    let e = class e extends Nu {};
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = tl(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Bm = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => g(vS), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  vS = (() => {
    let e = class e extends Bm {
      constructor() {
        super(...arguments),
          (this.location = g(sr)),
          (this.urlSerializer = g(Di)),
          (this.options = g(Ci, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = g(Lu)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Kt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Mm(null)),
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
        if (r instanceof pr) this.stateMemento = this.createStateMemento();
        else if (r instanceof Zt) this.rawUrlTree = i.initialUrl;
        else if (r instanceof Os) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          r instanceof hi
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Yt &&
              (r.code === Ve.GuardRejected || r.code === Ve.NoDataFromResolver)
            ? this.restoreHistory(i)
            : r instanceof fi
            ? this.restoreHistory(i, !0)
            : r instanceof Pt &&
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
        return (r || (r = tl(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  si = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(si || {});
function Um(t, e) {
  t.events
    .pipe(
      Ne(
        (n) =>
          n instanceof Pt ||
          n instanceof Yt ||
          n instanceof fi ||
          n instanceof Zt
      ),
      L((n) =>
        n instanceof Pt || n instanceof Zt
          ? si.COMPLETE
          : (
              n instanceof Yt
                ? n.code === Ve.Redirect ||
                  n.code === Ve.SupersededByNewNavigation
                : !1
            )
          ? si.REDIRECTING
          : si.FAILED
      ),
      Ne((n) => n !== si.REDIRECTING),
      St(1)
    )
    .subscribe(() => {
      e();
    });
}
function DS(t) {
  throw t;
}
var wS = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  ES = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Cn = (() => {
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
          (this.console = g(fs)),
          (this.stateManager = g(Bm)),
          (this.options = g(Ci, { optional: !0 }) || {}),
          (this.pendingTasks = g(Qr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = g(ju)),
          (this.urlSerializer = g(Di)),
          (this.location = g(sr)),
          (this.urlHandlingStrategy = g(Lu)),
          (this._events = new we()),
          (this.errorHandler = this.options.errorHandler || DS),
          (this.navigated = !1),
          (this.routeReuseStrategy = g(mS)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = g($s, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!g(Us, { optional: !0 })),
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
                i instanceof Yt &&
                  i.code !== Ve.Redirect &&
                  i.code !== Ve.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Pt) this.navigated = !0;
              else if (i instanceof pi) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || gS(o.source),
                  };
                this.scheduleNavigation(a, ci, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            CS(i) && this._events.next(i);
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
              ci,
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
        (this.config = r.map(Pu)), (this.navigated = !1);
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
          f = bm(h);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (f = this.currentUrlTree.root);
        }
        return Cm(f, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let o = hr(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, ci, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return bS(r), this.navigateByUrl(this.createUrlTree(r, i), i);
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
          (i === !0 ? (o = v({}, wS)) : i === !1 ? (o = v({}, ES)) : (o = i),
          hr(r))
        )
          return im(this.currentUrlTree, r, o);
        let s = this.parseUrl(r);
        return im(this.currentUrlTree, s, o);
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
          Um(this, () => {
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
function bS(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new m(4008, !1);
}
function CS(t) {
  return !(t instanceof hi) && !(t instanceof pi);
}
var Bs = class {};
var IS = (() => {
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
            Ne((r) => r instanceof Pt),
            $t(() => this.preload())
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
            (s._injector = os(s.providers, r, `Route: ${s.path}`));
          let a = s._injector ?? r,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return ie(o).pipe(Ln());
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
            return ie([s, a]).pipe(Ln());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Cn), E(ms), E(Ie), E(Bs), E(ku));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Hm = new S(""),
  SS = (() => {
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
          (this.environmentInjector = g(Ie)),
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
          r instanceof pr
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = r.navigationTrigger),
              (this.restoredId = r.restoredState
                ? r.restoredState.navigationId
                : 0))
            : r instanceof Pt
            ? ((this.lastId = r.id),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.urlAfterRedirects).fragment
              ))
            : r instanceof Zt &&
              r.code === Rs.IgnoredSameUrlNavigation &&
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
          r instanceof Ps &&
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
          ki(this, null, function* () {
            yield new Promise((o) => {
              setTimeout(() => {
                o();
              }),
                is(
                  () => {
                    o();
                  },
                  { injector: this.environmentInjector }
                );
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new Ps(
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
      _p();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function MS(t) {
  return t.routerState.root;
}
function Ii(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function TS() {
  let t = g(at);
  return (e) => {
    let n = t.get(Rt);
    if (e !== n.components[0]) return;
    let r = t.get(Cn),
      i = t.get(zm);
    t.get(Vu) === 1 && r.initialNavigation(),
      t.get(qm, null, P.Optional)?.setUpPreloading(),
      t.get(Hm, null, P.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var zm = new S("", { factory: () => new we() }),
  Vu = new S("", { providedIn: "root", factory: () => 1 });
function _S() {
  return Ii(2, [
    { provide: Vu, useValue: 0 },
    {
      provide: gs,
      multi: !0,
      deps: [at],
      useFactory: (e) => {
        let n = e.get(Rg, Promise.resolve());
        return () =>
          n.then(
            () =>
              new Promise((r) => {
                let i = e.get(Cn),
                  o = e.get(zm);
                Um(i, () => {
                  r(!0);
                }),
                  (e.get(ju).afterPreactivation = () => (
                    r(!0), o.closed ? _(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function AS() {
  return Ii(3, [
    {
      provide: gs,
      multi: !0,
      useFactory: () => {
        let e = g(Cn);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Vu, useValue: 2 },
  ]);
}
var qm = new S("");
function xS(t) {
  return Ii(0, [
    { provide: qm, useExisting: IS },
    { provide: Bs, useExisting: t },
  ]);
}
function NS() {
  return Ii(8, [cm, { provide: Us, useExisting: cm }]);
}
function RS(t) {
  let e = [
    { provide: Vm, useValue: hS },
    {
      provide: $m,
      useValue: v({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return Ii(9, e);
}
var um = new S("ROUTER_FORROOT_GUARD"),
  OS = [
    sr,
    { provide: Di, useClass: ui },
    Cn,
    wi,
    { provide: gr, useFactory: MS, deps: [Cn] },
    ku,
    [],
  ],
  $u = (() => {
    let e = class e {
      constructor(r) {}
      static forRoot(r, i) {
        return {
          ngModule: e,
          providers: [
            OS,
            [],
            { provide: $s, multi: !0, useValue: r },
            { provide: um, useFactory: LS, deps: [[Cn, new Bo(), new Lc()]] },
            { provide: Ci, useValue: i || {} },
            i?.useHash ? FS() : kS(),
            PS(),
            i?.preloadingStrategy ? xS(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? jS(i) : [],
            i?.bindToComponentInputs ? NS().ɵproviders : [],
            i?.enableViewTransitions ? RS().ɵproviders : [],
            VS(),
          ],
        };
      }
      static forChild(r) {
        return {
          ngModule: e,
          providers: [{ provide: $s, multi: !0, useValue: r }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(um, 8));
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({}));
    let t = e;
    return t;
  })();
function PS() {
  return {
    provide: Hm,
    useFactory: () => {
      let t = g(Lg),
        e = g(G),
        n = g(Ci),
        r = g(ju),
        i = g(Di);
      return (
        n.scrollOffset && t.setOffset(n.scrollOffset), new SS(i, r, t, e, n)
      );
    },
  };
}
function FS() {
  return { provide: wn, useClass: Pg };
}
function kS() {
  return { provide: wn, useClass: Bl };
}
function LS(t) {
  return "guarded";
}
function jS(t) {
  return [
    t.initialNavigation === "disabled" ? AS().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? _S().ɵproviders : [],
  ];
}
var dm = new S("");
function VS() {
  return [
    { provide: dm, useFactory: TS },
    { provide: or, multi: !0, useExisting: dm },
  ];
}
var $S = [],
  Gm = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Qe({ type: e })),
      (e.ɵinj = We({ imports: [$u.forRoot($S), $u] }));
    let t = e;
    return t;
  })();
var wt = (() => {
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
      Me(this.platformId)
        ? window.open(r, "_blank")
        : console.warn("Attempted to open a URL on the server side.");
    }
    updateSticky(r) {
      (this.isSticky = r >= 600), console.log("Sticky status:", this.isSticky);
    }
    onScroll() {
      return new U((r) => {
        if (Me(this.platformId)) {
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
        if (Me(this.platformId)) {
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
    return new (i || e)(E(te), E(G));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var BS = ["hamburger"],
  US = ["collapsedMenu"],
  HS = (t) => ({ sticky: t }),
  Wm = (() => {
    let e = class e {
      constructor(r, i) {
        (this.platformId = r), (this.portfolioServ = i), (this.isSticky = !1);
      }
      ngAfterViewInit() {
        Me(this.platformId) &&
          (this.scrollSubscription = this.portfolioServ
            .onScroll()
            .subscribe(() => {
              let r =
                window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
              window.getComputedStyle(this.hamburger.nativeElement).display ==
                "none" &&
                (this.portfolioServ.updateSticky(r),
                (this.isSticky = this.portfolioServ.isSticky));
            }));
      }
      ngOnDestroy() {
        this.scrollSubscription && this.scrollSubscription.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Z(te), Z(wt));
    }),
      (e.ɵcmp = oe({
        type: e,
        selectors: [["app-navbar"]],
        viewQuery: function (i, o) {
          if ((i & 1 && (Tl(BS, 5), Tl(US, 5)), i & 2)) {
            let s;
            ls((s = us())) && (o.hamburger = s.first),
              ls((s = us())) && (o.collapsedMenu = s.first);
          }
        },
        decls: 19,
        vars: 3,
        consts: [
          ["hamburger", ""],
          ["collapsedMenu", ""],
          [
            1,
            "navbar",
            "navbar-expand-lg",
            "navbar-dark",
            "bg-extra-dark",
            "py-3",
            "pt-sm-4",
            3,
            "ngClass",
          ],
          [1, "container-fluid"],
          ["href", "#", 1, "margin-left-custom", "logo", "d-inline-block"],
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
            (C(0, "nav", 2)(1, "div", 3)(2, "a", 4),
            X(3, "img", 5),
            M(),
            C(4, "button", 6, 0),
            X(6, "span", 7),
            M(),
            C(7, "div", 8, 1)(9, "ul", 9)(10, "li", 10)(11, "a", 11),
            F(12, "Skills"),
            M()(),
            C(13, "li", 12)(14, "a", 13),
            F(15, "Projects"),
            M()(),
            C(16, "li", 14)(17, "a", 15),
            F(18, "Curriculum"),
            M()()()()()()),
            i & 2 && Se("ngClass", ir(1, HS, o.isSticky));
        },
        dependencies: [ar],
        styles: [
          "nav[_ngcontent-%COMP%]{padding:1.5rem 0 0}.sticky[_ngcontent-%COMP%]{position:sticky;top:0;left:0;width:100%;opacity:1;z-index:1000;background-color:#030f1896;box-shadow:0 4px 6px #0000001a;transition:all .5s ease-in-out;animation:_ngcontent-%COMP%_opacity .5s;padding:1.5rem 0}@keyframes _ngcontent-%COMP%_opacity{0%{opacity:0}to{opacity:1}}.sticky[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{transform:scale(.8);transition:transform .5s ease-in-out}.nav-item[_ngcontent-%COMP%]{transform:all .3s}nav[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%]{color:var(--darkblue-palette)}.nav-item[_ngcontent-%COMP%]:hover, .nav-item[_ngcontent-%COMP%]:active{background-color:transparent;cursor:pointer;box-shadow:#a0faa333 0 0 24px,#a0faa333 0 0 39px,#a0faa333 0 0 60px}.nav-item[_ngcontent-%COMP%]:hover   .nav-link[_ngcontent-%COMP%]{color:var(--light-green);text-decoration:none}.fw-600[_ngcontent-%COMP%]{font-weight:600;letter-spacing:1.2px}.fs-4to5[_ngcontent-%COMP%]{font-size:1.3rem}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:43px;height:auto}@media (min-width: 62em){.collapse[_ngcontent-%COMP%]{display:flex;justify-content:center}}@media (max-width: 62em){.container-fluid[_ngcontent-%COMP%]{position:relative}.navbar-collapse[_ngcontent-%COMP%]{position:absolute;top:-12px;right:35px}.nav-item[_ngcontent-%COMP%]{border:solid .2px var(--darkblue-palette)!important;border-radius:0%!important}.navbar-toggler[_ngcontent-%COMP%]{border:1px solid var(--light-green);color:var(--light-green)}.navbar-toggler[_ngcontent-%COMP%]:active{border:1.5px solid var(--light-green);color:var(--light-green)}.navbar-toggler-icon[_ngcontent-%COMP%]{color:var(--light-green)}}@media (max-width: 36em){.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:30px;margin-right:auto}}",
        ],
      }));
    let t = e;
    return t;
  })();
var Qm = (() => {
  let e = class e {
    constructor(r) {
      this.platformId = r;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(Z(te));
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-hero"]],
      decls: 13,
      vars: 0,
      consts: [
        [
          1,
          "bg-extra-dark",
          "heightHero",
          "d-flex",
          "align-items-center",
          "justify-content-center",
        ],
        [1, "mt-custom"],
        [1, "row", "heroContent", "me-0", "ms-0"],
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
          (C(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
            4,
            "h1",
            4
          ),
          F(5, "Stefania Neri"),
          M(),
          C(6, "div")(7, "h1", 5),
          F(8, "Junior Full Stack Developer"),
          M(),
          C(9, "h1", 6),
          F(10, "QA Tester"),
          M()()(),
          C(11, "div", 7),
          X(12, "img", 8),
          M()()()());
      },
      styles: [
        ".heightHero[_ngcontent-%COMP%]{height:calc(100vh - 93.31px)}.heroContent[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-around;border:2px solid var(--light-green);padding:8rem;border-radius:3%;background-image:linear-gradient(180deg,var(--darkblue-palette),#154755)}.mt-custom[_ngcontent-%COMP%]{margin-top:-80px}.name[_ngcontent-%COMP%]{font-size:4.6rem;color:var(--light-green)}.sub[_ngcontent-%COMP%]{font-size:2rem;color:#a0faa3c4}.imgHero[_ngcontent-%COMP%]{height:auto;width:100%}@media (max-width: 87.5em){.name[_ngcontent-%COMP%]{font-size:4.5rem}.sub[_ngcontent-%COMP%]{font-size:2.5rem}}@media (max-width: 62em){.name[_ngcontent-%COMP%]{font-size:3.5rem}.sub[_ngcontent-%COMP%]{font-size:1.7rem}}@media (max-width: 48em){.name[_ngcontent-%COMP%]{text-align:center;margin-top:2rem}.sub[_ngcontent-%COMP%]{text-align:center}.imgHero[_ngcontent-%COMP%]{padding-bottom:2rem}}@media (max-width: 36em){.heightHero[_ngcontent-%COMP%]{height:auto}.heroContent[_ngcontent-%COMP%]{justify-content:center;padding:8rem 2rem}.imgHero[_ngcontent-%COMP%]{padding-bottom:2rem}}",
      ],
    }));
  let t = e;
  return t;
})();
var Km = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
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
          "pe-2",
          "pe-md-0",
          "rounded",
          "border-light-green",
          "bg-darkblue-main",
          "text-white",
        ],
        [
          1,
          "card-body",
          "px-2",
          "pt-1",
          "pb-2",
          "px-md-3",
          "pt-md-4",
          "pb-md-3",
          "text-center",
        ],
        ["height", "70", "width", "70", 3, "src", "alt"],
        [1, "w-100"],
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
          X(2, "img", 2),
          C(3, "div", 3)(4, "h5", 4),
          F(5),
          M(),
          C(6, "div", 5),
          X(7, "div", 6),
          M()()()()),
          i & 2 &&
            (Le(2),
            Ml("src", o.skill.src, yp),
            cs("alt", "", o.skill.linguaggio, " logo"),
            Le(3),
            _l(o.skill.linguaggio),
            Le(2),
            as("width", o.skill.progress, "%"),
            ss("aria-valuenow", o.skill.progress));
      },
      styles: [
        ".prgparent[_ngcontent-%COMP%]{background-color:#0a1623;border-radius:0;border:1px solid var(--light-green)}.pgbar[_ngcontent-%COMP%]{background-color:var(--light-green);box-shadow:#a0faa333 0 0 24px,#a0faa333 0 0 39px,#a0faa333 0 0 60px}@media (max-width: 36em){.card-body[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:stretch}.prgparent[_ngcontent-%COMP%]{width:100%}.border-light-green[_ngcontent-%COMP%]{border:1px solid var(--light-green)}}",
      ],
    }));
  let t = e;
  return t;
})();
var Ym = (() => {
  let e = class e {
    constructor(r, i, o) {
      (this.element = r),
        (this.platformId = i),
        (this.portfolioServ = o),
        (this.appear = new pe());
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
      Me(this.platformId) &&
        (this.subscriptionScroll = this.portfolioServ
          .onScroll()
          .subscribe((r) => {
            console.log("Scroll position:", r), this.checkVisibility();
          }));
    }
    subscribeToResize() {
      Me(this.platformId) &&
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
    return new (i || e)(Z(yt), Z(te), Z(wt));
  }),
    (e.ɵdir = gn({
      type: e,
      selectors: [["", "appear", ""]],
      outputs: { appear: "appear" },
    }));
  let t = e;
  return t;
})();
var QS = (t) => ({ "slide-in": t });
function KS(t, e) {
  if ((t & 1 && X(0, "app-skill", 10), t & 2)) {
    let n = e.$implicit;
    Se("skill", n);
  }
}
function YS(t, e) {
  if ((t & 1 && X(0, "app-skill", 10), t & 2)) {
    let n = e.$implicit;
    Se("skill", n);
  }
}
function ZS(t, e) {
  if ((t & 1 && X(0, "app-skill", 11), t & 2)) {
    let n = e.$implicit;
    Se("skill", n);
  }
}
var Zm = (() => {
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
    return new (i || e)(Z(wt), Z(vn));
  }),
    (e.ɵcmp = oe({
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
          "col-8 col-sm-4 col-lg-2 my-4 my-md-5 mx-1",
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
          "col-8",
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
          rr("appear", function () {
            return o.onAppear();
          }),
          C(2, "div", 2)(3, "h1"),
          F(4, "Skills"),
          M()(),
          C(5, "h2", 3),
          F(6, "Frontend"),
          M(),
          C(7, "div", 4),
          Zr(8, KS, 1, 1, "app-skill", 5),
          M(),
          C(9, "h2", 6),
          F(10, "Backend"),
          M(),
          C(11, "div", 4),
          Zr(12, YS, 1, 1, "app-skill", 7),
          M(),
          C(13, "h2", 6),
          F(14, "Miscellaneous"),
          M(),
          C(15, "div", 8),
          Zr(16, ZS, 1, 1, "app-skill", 9),
          M()()()),
          i & 2 &&
            (Le(),
            Se("ngClass", ir(4, QS, o.isVisible)),
            Le(7),
            Se("ngForOf", o.listaSkillFE),
            Le(4),
            Se("ngForOf", o.listaSkillBE),
            Le(4),
            Se("ngForOf", o.listaSkillMisc));
      },
      dependencies: [ar, Fg, Km, Ym],
      styles: [
        ".bg-skill[_ngcontent-%COMP%]{background-color:#051d2c}.container[_ngcontent-%COMP%]   .slide-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideIn 4s forwards}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(120%)!important;opacity:0}to{transform:translate(0)!important;opacity:1}}@media (max-width: 36em){.subTitle[_ngcontent-%COMP%]{font-size:1.7rem;margin-top:1rem}.row[_ngcontent-%COMP%]{margin:0}}",
      ],
    }));
  let t = e;
  return t;
})();
var Xm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
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
        [1, "card-title", "fs-3", "text-center", "pb-2"],
        [1, "fs-5", "text-center"],
        [1, "card-text", "fs-4"],
        ["href", "#"],
        [1, "fs-4", "mb-0"],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h1"),
          F(4, "Projects"),
          M()(),
          C(5, "div", 3)(6, "div", 4)(7, "div", 5),
          X(8, "img", 6),
          C(9, "div", 7)(10, "h4", 8),
          F(11, "Theater Box Office"),
          M(),
          C(12, "p", 9),
          F(
            13,
            "As part of a simulated project I created a platform that offers a catalog of shows available for booking. Users must log in to select and book a show, then are redirected to a page for payment and ticket purchase confirmation. User registrations and purchased tickets are stored in the fictional theater company\u2019s database."
          ),
          M(),
          C(14, "p", 10),
          F(15, "Source code: "),
          C(16, "a", 11),
          F(17, "Theater Box Office repository"),
          M()(),
          C(18, "p", 12),
          F(19, "Made with:"),
          M(),
          C(20, "ul")(21, "li"),
          F(22, "Java"),
          M(),
          C(23, "li"),
          F(24, "SpringBoot"),
          M(),
          C(25, "li"),
          F(26, "Hibernate"),
          M(),
          C(27, "li"),
          F(28, "MySQL"),
          M(),
          C(29, "li"),
          F(30, "JavaScript"),
          M(),
          C(31, "li"),
          F(32, "HTML"),
          M(),
          C(33, "li"),
          F(34, "CSS"),
          M()()()()()()()());
      },
      styles: [
        ".bg-prj[_ngcontent-%COMP%]{background-color:#031017}.card[_ngcontent-%COMP%]{width:60%}@media (max-width: 36em){.card[_ngcontent-%COMP%]{width:90%}}",
      ],
    }));
  let t = e;
  return t;
})();
var Jm = (() => {
  let e = class e {
    constructor(r, i) {
      (this.platformId = r),
        (this.portfolioServ = i),
        (this.urlCV = "assets/CV Stefania Neri.pdf");
    }
    openCV() {
      if (Me(this.platformId)) {
        console.log("Open cv ts:", this.urlCV);
        let r = /Android|iPhone|iPad|Mobi|/i.test(navigator.userAgent);
        if ((console.log(r), r)) {
          let i = document.createElement("a");
          if (i.download !== void 0) {
            i.setAttribute("href", this.urlCV),
              i.setAttribute("download", "CV Stefania Neri.pdf"),
              (i.style.visibility = "hidden"),
              document.body.appendChild(i);
            try {
              i.click();
            } catch {
              console.log("Errore apertura CV"),
                window.open(this.urlCV, "_blank");
            } finally {
              document.body.removeChild(i);
            }
          } else this.portfolioServ.open(this.urlCV);
        }
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(Z(te), Z(wt));
  }),
    (e.ɵcmp = oe({
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
          F(3, "Curriculum"),
          M(),
          C(4, "button", 3),
          rr("click", function () {
            return o.openCV();
          }),
          F(5, " Check my CV for more info "),
          M()()());
      },
      styles: [
        ".btn-cv[_ngcontent-%COMP%]{border:1px solid var(--sand-palette);background-color:var(--darkblue-palette);color:var(--light-green);transition:all .7s}.bg-lightgreen-gradient-cv[_ngcontent-%COMP%]{background-image:linear-gradient(180deg,#a0faa3e4,#e1f4e1d2)}.btn-cv[_ngcontent-%COMP%]:hover, .btn-cv[_ngcontent-%COMP%]:active{background-image:linear-gradient(180deg,#8df390,#d4f6d5da);color:var(--darkblue-palette);font-weight:600;border-color:var(--darkgreen);box-shadow:#a0faa395 0 0 60px,#a0faa395 0 0 60px,#a0faa395 0 0 60px;transition:all .3s}@media (max-width: 36em){.btn-cv[_ngcontent-%COMP%]{box-shadow:#030f1800 0 0 24px,#030f1800 0 0 39px,#030f1833 0 0 60px}}",
      ],
    }));
  let t = e;
  return t;
})();
var ey = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-contacts"]],
      decls: 0,
      vars: 0,
      template: function (i, o) {},
    }));
  let t = e;
  return t;
})();
var ty = (() => {
  let e = class e {
    constructor() {
      this.currentDate = new Date();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
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
          F(3),
          M(),
          C(4, "div", 3)(5, "a", 4),
          F(6, "stefania.neri.92@gmail.com"),
          M()(),
          C(7, "div", 5),
          X(8, "ion-icon", 6),
          F(9, " Torino, Italy "),
          M(),
          C(10, "div", 7)(11, "a", 8),
          X(12, "img", 9),
          M(),
          C(13, "a", 10),
          X(14, "img", 11),
          M(),
          C(15, "a", 12),
          X(16, "img", 13),
          M()()()()),
          i & 2 &&
            (Le(3), ds("\xA9 ", o.currentDate.getFullYear(), " Stefania Neri"));
      },
      styles: [
        ".custom-shadow[_ngcontent-%COMP%]{box-shadow:0 -3px 9px #00000f80}ion-icon[_ngcontent-%COMP%]{color:var(--light-green)}",
      ],
    }));
  let t = e;
  return t;
})();
var ny = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
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
var iM = (t) => ({ "back-to-top": t }),
  ry = (() => {
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
        Me(this.platformId) &&
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
      return new (i || e)(Z(te), Z(wt));
    }),
      (e.ɵcmp = oe({
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
            (X(0, "app-navbar", 0)(1, "app-hero")(2, "app-skills")(
              3,
              "app-projects"
            )(4, "app-curriculum")(5, "app-about-me")(6, "app-contacts"),
            C(7, "a", 1)(8, "span", 2),
            F(9, "keyboard_arrow_up"),
            M()(),
            X(10, "app-footer")),
            i & 2 &&
              (Se("titleSN", o.titleParent),
              Le(7),
              Se("ngClass", ir(2, iM, o.isSticky)));
        },
        dependencies: [ar, Wm, Qm, Zm, Xm, Jm, ey, ty, ny],
        styles: [
          ".slide-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideIn 4s forwards}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(120%)!important;opacity:0}to{transform:translate(0)!important;opacity:1}}",
        ],
      }));
    let t = e;
    return t;
  })();
var k = (function (t) {
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
  })(k || {}),
  Et = "*";
function iy(t, e = null) {
  return { type: k.Sequence, steps: t, options: e };
}
function Bu(t) {
  return { type: k.Style, styles: t, offset: null };
}
var Jt = class {
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
  Mi = class {
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
  zs = "!";
function oy(t) {
  return new m(3e3, !1);
}
function oM() {
  return new m(3100, !1);
}
function sM() {
  return new m(3101, !1);
}
function aM(t) {
  return new m(3001, !1);
}
function cM(t) {
  return new m(3003, !1);
}
function lM(t) {
  return new m(3004, !1);
}
function uM(t, e) {
  return new m(3005, !1);
}
function dM() {
  return new m(3006, !1);
}
function fM() {
  return new m(3007, !1);
}
function hM(t, e) {
  return new m(3008, !1);
}
function pM(t) {
  return new m(3002, !1);
}
function gM(t, e, n, r, i) {
  return new m(3010, !1);
}
function mM() {
  return new m(3011, !1);
}
function yM() {
  return new m(3012, !1);
}
function vM() {
  return new m(3200, !1);
}
function DM() {
  return new m(3202, !1);
}
function wM() {
  return new m(3013, !1);
}
function EM(t) {
  return new m(3014, !1);
}
function bM(t) {
  return new m(3015, !1);
}
function CM(t) {
  return new m(3016, !1);
}
function IM(t, e) {
  return new m(3404, !1);
}
function SM(t) {
  return new m(3502, !1);
}
function MM(t) {
  return new m(3503, !1);
}
function TM() {
  return new m(3300, !1);
}
function _M(t) {
  return new m(3504, !1);
}
function AM(t) {
  return new m(3301, !1);
}
function xM(t, e) {
  return new m(3302, !1);
}
function NM(t) {
  return new m(3303, !1);
}
function RM(t, e) {
  return new m(3400, !1);
}
function OM(t) {
  return new m(3401, !1);
}
function PM(t) {
  return new m(3402, !1);
}
function FM(t, e) {
  return new m(3505, !1);
}
function en(t) {
  switch (t.length) {
    case 0:
      return new Jt();
    case 1:
      return t[0];
    default:
      return new Mi(t);
  }
}
function Dy(t, e, n = new Map(), r = new Map()) {
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
            case zs:
              y = n.get(h);
              break;
            case Et:
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
    throw SM(i);
  return o;
}
function ud(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && Uu(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && Uu(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && Uu(n, "destroy", t)));
      break;
  }
}
function Uu(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    o = dd(
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
function dd(t, e, n, r, i = "", o = 0, s) {
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
function sy(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var kM = typeof document > "u" ? null : document.documentElement;
function fd(t) {
  let e = t.parentNode || t.host || null;
  return e === kM ? null : e;
}
function LM(t) {
  return t.substring(1, 6) == "ebkit";
}
var In = null,
  ay = !1;
function jM(t) {
  In ||
    ((In = VM() || {}), (ay = In.style ? "WebkitAppearance" in In.style : !1));
  let e = !0;
  return (
    In.style &&
      !LM(t) &&
      ((e = t in In.style),
      !e &&
        ay &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in In.style)),
    e
  );
}
function VM() {
  return typeof document < "u" ? document.body : null;
}
function wy(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = fd(e);
  }
  return !1;
}
function Ey(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var hd = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return jM(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return wy(r, i);
      }
      getParentElement(r) {
        return fd(r);
      }
      query(r, i, o) {
        return Ey(r, i, o);
      }
      computeStyle(r, i, o) {
        return o || "";
      }
      animate(r, i, o, s, a, c = [], l) {
        return new Jt(o, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  yd = class yd {};
yd.NOOP = new hd();
var Tn = yd,
  _n = class {};
var $M = 1e3,
  by = "{{",
  BM = "}}",
  Cy = "ng-enter",
  Qu = "ng-leave",
  qs = "ng-trigger",
  Ys = ".ng-trigger",
  cy = "ng-animating",
  Ku = ".ng-animating";
function Ft(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : Yu(parseFloat(e[1]), e[2]);
}
function Yu(t, e) {
  switch (e) {
    case "s":
      return t * $M;
    default:
      return t;
  }
}
function Zs(t, e, n) {
  return t.hasOwnProperty("duration") ? t : UM(t, e, n);
}
function UM(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    o = 0,
    s = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(oy(t)), { duration: 0, delay: 0, easing: "" };
    i = Yu(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (o = Yu(parseFloat(c), a[4]));
    let l = a[5];
    l && (s = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(oM()), (a = !0)),
      o < 0 && (e.push(sM()), (a = !0)),
      a && e.splice(c, 0, oy(t));
  }
  return { duration: i, delay: o, easing: s };
}
function HM(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function bt(t, e, n) {
  e.forEach((r, i) => {
    let o = pd(i);
    n && !n.has(i) && n.set(i, t.style[o]), (t.style[o] = r);
  });
}
function Mn(t, e) {
  e.forEach((n, r) => {
    let i = pd(r);
    t.style[i] = "";
  });
}
function Ti(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : iy(t)) : t;
}
function zM(t, e, n) {
  let r = e.params || {},
    i = Iy(t);
  i.length &&
    i.forEach((o) => {
      r.hasOwnProperty(o) || n.push(aM(o));
    });
}
var Zu = new RegExp(`${by}\\s*(.+?)\\s*${BM}`, "g");
function Iy(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = Zu.exec(t)); ) e.push(n[1]);
    Zu.lastIndex = 0;
  }
  return e;
}
function Ai(t, e, n) {
  let r = `${t}`,
    i = r.replace(Zu, (o, s) => {
      let a = e[s];
      return a == null && (n.push(cM(s)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
var qM = /-+([a-z0-9])/g;
function pd(t) {
  return t.replace(qM, (...e) => e[1].toUpperCase());
}
function GM(t, e) {
  return t === 0 || e === 0;
}
function WM(t, e, n) {
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
        i.forEach((a) => s.set(a, gd(t, a)));
      }
  }
  return e;
}
function $e(t, e, n) {
  switch (e.type) {
    case k.Trigger:
      return t.visitTrigger(e, n);
    case k.State:
      return t.visitState(e, n);
    case k.Transition:
      return t.visitTransition(e, n);
    case k.Sequence:
      return t.visitSequence(e, n);
    case k.Group:
      return t.visitGroup(e, n);
    case k.Animate:
      return t.visitAnimate(e, n);
    case k.Keyframes:
      return t.visitKeyframes(e, n);
    case k.Style:
      return t.visitStyle(e, n);
    case k.Reference:
      return t.visitReference(e, n);
    case k.AnimateChild:
      return t.visitAnimateChild(e, n);
    case k.AnimateRef:
      return t.visitAnimateRef(e, n);
    case k.Query:
      return t.visitQuery(e, n);
    case k.Stagger:
      return t.visitStagger(e, n);
    default:
      throw lM(e.type);
  }
}
function gd(t, e) {
  return window.getComputedStyle(t)[e];
}
var QM = new Set([
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
  Xs = class extends _n {
    normalizePropertyName(e, n) {
      return pd(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let o = "",
        s = r.toString().trim();
      if (QM.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") o = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(uM(e, r));
        }
      return s + o;
    }
  };
var Js = "*";
function KM(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => YM(r, n, e))
      : n.push(t),
    n
  );
}
function YM(t, e, n) {
  if (t[0] == ":") {
    let c = ZM(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(bM(t)), e;
  let i = r[1],
    o = r[2],
    s = r[3];
  e.push(ly(i, s));
  let a = i == Js && s == Js;
  o[0] == "<" && !a && e.push(ly(s, i));
}
function ZM(t, e) {
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
      return e.push(CM(t)), "* => *";
  }
}
var Gs = new Set(["true", "1"]),
  Ws = new Set(["false", "0"]);
function ly(t, e) {
  let n = Gs.has(t) || Ws.has(t),
    r = Gs.has(e) || Ws.has(e);
  return (i, o) => {
    let s = t == Js || t == i,
      a = e == Js || e == o;
    return (
      !s && n && typeof i == "boolean" && (s = i ? Gs.has(t) : Ws.has(t)),
      !a && r && typeof o == "boolean" && (a = o ? Gs.has(e) : Ws.has(e)),
      s && a
    );
  };
}
var Sy = ":self",
  XM = new RegExp(`s*${Sy}s*,?`, "g");
function My(t, e, n, r) {
  return new Xu(t).build(e, n, r);
}
var uy = "",
  Xu = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new Ju(n);
      return this._resetContextStyleTimingState(i), $e(this, Ti(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = uy),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(uy, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        o = [],
        s = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(dM()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == k.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), o.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == k.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), s.push(c);
          } else n.errors.push(fM());
        }),
        {
          type: k.Trigger,
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
              Iy(c).forEach((l) => {
                s.hasOwnProperty(l) || o.add(l);
              });
            });
        }),
          o.size && n.errors.push(hM(e.name, [...o.values()]));
      }
      return {
        type: k.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = $e(this, Ti(e.animation), n),
        i = KM(e.expr, n.errors);
      return {
        type: k.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: Sn(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: k.Sequence,
        steps: e.steps.map((r) => $e(this, r, n)),
        options: Sn(e.options),
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
        (n.currentTime = i), { type: k.Group, steps: o, options: Sn(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = nT(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        o = e.styles ? e.styles : Bu({});
      if (o.type == k.Keyframes) i = this.visitKeyframes(o, n);
      else {
        let s = e.styles,
          a = !1;
        if (!s) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (s = Bu(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(s, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: k.Animate, timings: r, style: i, options: null }
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
          ? a === Et
            ? r.push(a)
            : n.errors.push(pM(a))
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
              if (c.toString().indexOf(by) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: k.Style,
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
                  (n.errors.push(gM(c, u.startTime, u.endTime, o, i)),
                  (d = !1)),
                (o = u.startTime)),
                d && l.set(c, { startTime: o, endTime: i }),
                n.options && zM(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: k.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(mM()), r;
      let i = 1,
        o = 0,
        s = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((T) => {
          let H = this._makeStyleAst(T, n),
            z = H.offset != null ? H.offset : tT(H.styles),
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
      c && n.errors.push(yM()), a && n.errors.push(vM());
      let d = e.steps.length,
        f = 0;
      o > 0 && o < d ? n.errors.push(DM()) : o == 0 && (f = i / (d - 1));
      let h = d - 1,
        p = n.currentTime,
        y = n.currentAnimateTimings,
        x = y.duration;
      return (
        u.forEach((T, H) => {
          let z = f > 0 ? (H == h ? 1 : f * H) : s[H],
            Q = z * x;
          (n.currentTime = p + y.delay + Q),
            (y.duration = Q),
            this._validateStyleAst(T, n),
            (T.offset = z),
            r.styles.push(T);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: k.Reference,
        animation: $e(this, Ti(e.animation), n),
        options: Sn(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: k.AnimateChild, options: Sn(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: k.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: Sn(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [o, s] = JM(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + o : o),
        Be(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = $e(this, Ti(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: k.Query,
          selector: o,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: s,
          animation: a,
          originalSelector: e.selector,
          options: Sn(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(wM());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : Zs(e.timings, n.errors, !0);
      return {
        type: k.Stagger,
        animation: $e(this, Ti(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function JM(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == Sy);
  return (
    e && (t = t.replace(XM, "")),
    (t = t
      .replace(/@\*/g, Ys)
      .replace(/@\w+/g, (n) => Ys + "-" + n.slice(1))
      .replace(/:animating/g, Ku)),
    [t, e]
  );
}
function eT(t) {
  return t ? v({}, t) : null;
}
var Ju = class {
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
function tT(t) {
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
function nT(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let o = Zs(t, e).duration;
    return Hu(o, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
    let o = Hu(0, 0, "");
    return (o.dynamic = !0), (o.strValue = n), o;
  }
  let i = Zs(n, e);
  return Hu(i.duration, i.delay, i.easing);
}
function Sn(t) {
  return (
    t ? ((t = v({}, t)), t.params && (t.params = eT(t.params))) : (t = {}), t
  );
}
function Hu(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function md(t, e, n, r, i, o, s = null, a = !1) {
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
var xi = class {
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
  rT = 1,
  iT = ":enter",
  oT = new RegExp(iT, "g"),
  sT = ":leave",
  aT = new RegExp(sT, "g");
function Ty(t, e, n, r, i, o = new Map(), s = new Map(), a, c, l = []) {
  return new ed().buildKeyframes(t, e, n, r, i, o, s, a, c, l);
}
var ed = class {
    buildKeyframes(e, n, r, i, o, s, a, c, l, u = []) {
      l = l || new xi();
      let d = new td(e, n, l, i, o, u, []);
      d.options = c;
      let f = c.delay ? Ft(c.delay) : 0;
      d.currentTimeline.delayNextStep(f),
        d.currentTimeline.setStyles([s], null, d.errors, c),
        $e(this, r, d);
      let h = d.timelines.filter((p) => p.containsAnimation());
      if (h.length && a.size) {
        let p;
        for (let y = h.length - 1; y >= 0; y--) {
          let x = h[y];
          if (x.element === n) {
            p = x;
            break;
          }
        }
        p &&
          !p.allowOnlyTimelineStyles() &&
          p.setStyles([a], null, d.errors, c);
      }
      return h.length
        ? h.map((p) => p.buildKeyframes())
        : [md(n, [], [], [], 0, f, "", !1)];
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
            typeof o == "number" ? o : Ft(Ai(o, i?.params ?? {}, n.errors));
          r.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let o = n.currentTimeline.currentTime,
        s = r.duration != null ? Ft(r.duration) : null,
        a = r.delay != null ? Ft(r.delay) : null;
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
        i.previousNode.type == k.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = ea));
        let s = Ft(o.delay);
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
        o = e.options && e.options.delay ? Ft(e.options.delay) : 0;
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
          i = n.params ? Ai(r, n.params, n.errors) : r;
        return Zs(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let o = e.style;
      o.type == k.Keyframes
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
        o = i.delay ? Ft(i.delay) : 0;
      o &&
        (n.previousNode.type === k.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = ea));
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
  ea = {},
  td = class t {
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
        (this.previousNode = ea),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new ta(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = Ft(r.duration)),
        r.delay != null && (i.delay = Ft(r.delay));
      let o = r.params;
      if (o) {
        let s = i.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!n || !s.hasOwnProperty(a)) && (s[a] = Ai(o[a], s, this.errors));
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
        (this.previousNode = ea),
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
        o = new nd(
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
        (e = e.replace(oT, "." + this._enterClassName)),
          (e = e.replace(aT, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !o && a.length == 0 && s.push(EM(n)), a;
    }
  },
  ta = class t {
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
      (this.duration += rT), this._loadKeyframe();
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
        this._backFill.set(n, r || Et), this._currentKeyframe.set(n, Et);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let o = (i && i.params) || {},
        s = cT(e, this._globalTimelineStyles);
      for (let [a, c] of s) {
        let l = Ai(c, o, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Et),
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
          u === zs ? e.add(d) : u === Et && n.add(d);
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
      return md(
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
  nd = class extends ta {
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
        l.set("offset", dy(a)), o.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let f = new Map(e[d]),
            h = f.get("offset"),
            p = n + h * r;
          f.set("offset", dy(p / s)), o.push(f);
        }
        (r = s), (n = 0), (i = ""), (e = o);
      }
      return md(
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
function dy(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function cT(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r ??= e.keys();
        for (let o of r) n.set(o, Et);
      } else for (let [o, s] of i) n.set(o, s);
    }),
    n
  );
}
function fy(t, e, n, r, i, o, s, a, c, l, u, d, f) {
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
var zu = {},
  na = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return lT(this.ast.matchers, e, n, r, i);
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
        f = (this.ast.options && this.ast.options.params) || zu,
        h = (a && a.params) || zu,
        p = this.buildStyles(r, h, d),
        y = (c && c.params) || zu,
        x = this.buildStyles(i, y, d),
        T = new Set(),
        H = new Map(),
        z = new Map(),
        Q = i === "void",
        Te = { params: _y(y, f), delay: this.ast.options?.delay },
        ne = u ? [] : Ty(e, n, this.ast.animation, o, s, p, x, Te, l, d),
        re = 0;
      return (
        ne.forEach((de) => {
          re = Math.max(de.duration + de.delay, re);
        }),
        d.length
          ? fy(n, this._triggerName, r, i, Q, p, x, [], [], H, z, re, d)
          : (ne.forEach((de) => {
              let Ct = de.element,
                kt = Be(H, Ct, new Set());
              de.preStyleProps.forEach((tn) => kt.add(tn));
              let vd = Be(z, Ct, new Set());
              de.postStyleProps.forEach((tn) => vd.add(tn)),
                Ct !== n && T.add(Ct);
            }),
            fy(
              n,
              this._triggerName,
              r,
              i,
              Q,
              p,
              x,
              ne,
              [...T.values()],
              H,
              z,
              re
            ))
      );
    }
  };
function lT(t, e, n, r, i) {
  return t.some((o) => o(e, n, r, i));
}
function _y(t, e) {
  let n = v({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var rd = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = _y(e, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != "string" &&
          o.forEach((s, a) => {
            s && (s = Ai(s, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (s = this.normalizer.normalizeStyleValue(a, c, s, n)), r.set(a, s);
          });
      }),
      r
    );
  }
};
function uT(t, e, n) {
  return new id(t, e, n);
}
var id = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let o = (i.options && i.options.params) || {};
        this.states.set(i.name, new rd(i.style, o, r));
      }),
      hy(this.states, "true", "1"),
      hy(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new na(e, i, this.states));
      }),
      (this.fallbackTransition = dT(e, this.states, this._normalizer));
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
function dT(t, e, n) {
  let r = [(s, a) => !0],
    i = { type: k.Sequence, steps: [], options: null },
    o = {
      type: k.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new na(t, o, e);
}
function hy(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var fT = new xi(),
  od = class {
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
        o = My(this._driver, n, r, i);
      if (r.length) throw MM(r);
      i.length && void 0, this._animations.set(e, o);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        o = Dy(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, o, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        o = this._animations.get(e),
        s,
        a = new Map();
      if (
        (o
          ? ((s = Ty(
              this._driver,
              n,
              o,
              Cy,
              Qu,
              new Map(),
              new Map(),
              r,
              fT,
              i
            )),
            s.forEach((u) => {
              let d = Be(a, u.element, new Map());
              u.postStyleProps.forEach((f) => d.set(f, null));
            }))
          : (i.push(TM()), (s = [])),
        i.length)
      )
        throw _M(i);
      a.forEach((u, d) => {
        u.forEach((f, h) => {
          u.set(h, this._driver.computeStyle(d, h, Et));
        });
      });
      let c = s.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = en(c);
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
      if (!n) throw AM(e);
      return n;
    }
    listen(e, n, r, i) {
      let o = dd(n, "", "", "");
      return ud(this._getPlayer(e), r, o, i), () => {};
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
  py = "ng-animate-queued",
  hT = ".ng-animate-queued",
  qu = "ng-animate-disabled",
  pT = ".ng-animate-disabled",
  gT = "ng-star-inserted",
  mT = ".ng-star-inserted",
  yT = [],
  Ay = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  vT = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  ct = "__ng_removed",
  Ni = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = wT(i)), r)) {
        let o = e,
          { value: s } = o,
          a = Fi(o, ["value"]);
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
  _i = "void",
  Gu = new Ni(_i),
  sd = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Ze(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw xM(r, n);
      if (r == null || r.length == 0) throw NM(n);
      if (!ET(r)) throw RM(r, n);
      let o = Be(this._elementListeners, e, []),
        s = { name: n, phase: r, callback: i };
      o.push(s);
      let a = Be(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (Ze(e, qs), Ze(e, qs + "-" + n), a.set(n, Gu)),
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
      if (!n) throw OM(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let o = this._getTrigger(n),
        s = new Ri(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Ze(e, qs),
        Ze(e, qs + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new Ni(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = Gu),
        !(l.value === _i) && c.value === l.value)
      ) {
        if (!IT(c.params, l.params)) {
          let y = [],
            x = o.matchStyles(c.value, c.params, y),
            T = o.matchStyles(l.value, l.params, y);
          y.length
            ? this._engine.reportError(y)
            : this._engine.afterFlush(() => {
                Mn(e, x), bt(e, T);
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
          (Ze(e, py),
          s.onStart(() => {
            vr(e, py);
          })),
        s.onDone(() => {
          let y = this.players.indexOf(s);
          y >= 0 && this.players.splice(y, 1);
          let x = this._engine.playersByElement.get(e);
          if (x) {
            let T = x.indexOf(s);
            T >= 0 && x.splice(T, 1);
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
      let r = this._engine.driver.query(e, Ys, !0);
      r.forEach((i) => {
        if (i[ct]) return;
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
              let u = this.trigger(e, l, _i, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, s),
            r && en(a).onDone(() => this._engine.processLeaveNode(e)),
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
            l = r.get(s) || Gu,
            u = new Ni(_i),
            d = new Ri(this.id, s, e);
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
        let o = e[ct];
        (!o || o === Ay) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      Ze(e, this._hostClassName);
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
                let c = dd(
                  o,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value
                );
                (c._data = e), ud(r.player, a.phase, c, a.callback);
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
  ad = class {
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
      let r = new sd(e, n, this);
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
      if (Qs(n)) {
        let o = this._fetchNamespace(e);
        if (o) return o.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!Qs(n)) return;
      let o = n[ct];
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
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Ze(e, qu))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), vr(e, qu));
    }
    removeNode(e, n, r) {
      if (Qs(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let o = this.namespacesByHostElement.get(n);
        o && o.id !== e && o.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, o) {
      this.collectedLeaveElements.push(n),
        (n[ct] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(e, n, r, i, o) {
      return Qs(n) ? this._fetchNamespace(e).listen(n, r, i, o) : () => {};
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
      let n = this.driver.query(e, Ys, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Ku, !0)),
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
        if (this.players.length) return en(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[ct];
      if (n && n.setForRemoval) {
        if (((e[ct] = Ay), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(qu) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, pT, !0).forEach((r) => {
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
          Ze(i, gT);
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
            ? en(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw PM(e);
    }
    _flushAnimations(e, n) {
      let r = new xi(),
        i = [],
        o = new Map(),
        s = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((D) => {
        u.add(D);
        let b = this.driver.query(D, hT, !0);
        for (let I = 0; I < b.length; I++) u.add(b[I]);
      });
      let d = this.bodyNode,
        f = Array.from(this.statesByElement.keys()),
        h = yy(f, this.collectedEnterElements),
        p = new Map(),
        y = 0;
      h.forEach((D, b) => {
        let I = Cy + y++;
        p.set(b, I), D.forEach((B) => Ze(B, I));
      });
      let x = [],
        T = new Set(),
        H = new Set();
      for (let D = 0; D < this.collectedLeaveElements.length; D++) {
        let b = this.collectedLeaveElements[D],
          I = b[ct];
        I &&
          I.setForRemoval &&
          (x.push(b),
          T.add(b),
          I.hasAnimation
            ? this.driver.query(b, mT, !0).forEach((B) => T.add(B))
            : H.add(b));
      }
      let z = new Map(),
        Q = yy(f, Array.from(T));
      Q.forEach((D, b) => {
        let I = Qu + y++;
        z.set(b, I), D.forEach((B) => Ze(B, I));
      }),
        e.push(() => {
          h.forEach((D, b) => {
            let I = p.get(b);
            D.forEach((B) => vr(B, I));
          }),
            Q.forEach((D, b) => {
              let I = z.get(b);
              D.forEach((B) => vr(B, I));
            }),
            x.forEach((D) => {
              this.processLeaveNode(D);
            });
        });
      let Te = [],
        ne = [];
      for (let D = this._namespaceList.length - 1; D >= 0; D--)
        this._namespaceList[D].drainQueuedTransitions(n).forEach((I) => {
          let B = I.player,
            fe = I.element;
          if ((Te.push(B), this.collectedEnterElements.length)) {
            let De = fe[ct];
            if (De && De.setForMove) {
              if (
                De.previousTriggersValues &&
                De.previousTriggersValues.has(I.triggerName)
              ) {
                let nn = De.previousTriggersValues.get(I.triggerName),
                  Ue = this.statesByElement.get(I.element);
                if (Ue && Ue.has(I.triggerName)) {
                  let Oi = Ue.get(I.triggerName);
                  (Oi.value = nn), Ue.set(I.triggerName, Oi);
                }
              }
              B.destroy();
              return;
            }
          }
          let lt = !d || !this.driver.containsElement(d, fe),
            _e = z.get(fe),
            Lt = p.get(fe),
            ee = this._buildInstruction(I, r, Lt, _e, lt);
          if (ee.errors && ee.errors.length) {
            ne.push(ee);
            return;
          }
          if (lt) {
            B.onStart(() => Mn(fe, ee.fromStyles)),
              B.onDestroy(() => bt(fe, ee.toStyles)),
              i.push(B);
            return;
          }
          if (I.isFallbackTransition) {
            B.onStart(() => Mn(fe, ee.fromStyles)),
              B.onDestroy(() => bt(fe, ee.toStyles)),
              i.push(B);
            return;
          }
          let Ed = [];
          ee.timelines.forEach((De) => {
            (De.stretchStartingKeyframe = !0),
              this.disabledNodes.has(De.element) || Ed.push(De);
          }),
            (ee.timelines = Ed),
            r.append(fe, ee.timelines);
          let Fy = { instruction: ee, player: B, element: fe };
          s.push(Fy),
            ee.queriedElements.forEach((De) => Be(a, De, []).push(B)),
            ee.preStyleProps.forEach((De, nn) => {
              if (De.size) {
                let Ue = c.get(nn);
                Ue || c.set(nn, (Ue = new Set())),
                  De.forEach((Oi, ca) => Ue.add(ca));
              }
            }),
            ee.postStyleProps.forEach((De, nn) => {
              let Ue = l.get(nn);
              Ue || l.set(nn, (Ue = new Set())),
                De.forEach((Oi, ca) => Ue.add(ca));
            });
        });
      if (ne.length) {
        let D = [];
        ne.forEach((b) => {
          D.push(FM(b.triggerName, b.errors));
        }),
          Te.forEach((b) => b.destroy()),
          this.reportError(D);
      }
      let re = new Map(),
        de = new Map();
      s.forEach((D) => {
        let b = D.element;
        r.has(b) &&
          (de.set(b, b),
          this._beforeAnimationBuild(D.player.namespaceId, D.instruction, re));
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
            Be(re, b, []).push(B), B.destroy();
          });
        });
      let Ct = x.filter((D) => vy(D, c, l)),
        kt = new Map();
      my(kt, this.driver, H, l, Et).forEach((D) => {
        vy(D, c, l) && Ct.push(D);
      });
      let tn = new Map();
      h.forEach((D, b) => {
        my(tn, this.driver, new Set(D), c, zs);
      }),
        Ct.forEach((D) => {
          let b = kt.get(D),
            I = tn.get(D);
          kt.set(
            D,
            new Map([...(b?.entries() ?? []), ...(I?.entries() ?? [])])
          );
        });
      let aa = [],
        Dd = [],
        wd = {};
      s.forEach((D) => {
        let { element: b, player: I, instruction: B } = D;
        if (r.has(b)) {
          if (u.has(b)) {
            I.onDestroy(() => bt(b, B.toStyles)),
              (I.disabled = !0),
              I.overrideTotalTime(B.totalTime),
              i.push(I);
            return;
          }
          let fe = wd;
          if (de.size > 1) {
            let _e = b,
              Lt = [];
            for (; (_e = _e.parentNode); ) {
              let ee = de.get(_e);
              if (ee) {
                fe = ee;
                break;
              }
              Lt.push(_e);
            }
            Lt.forEach((ee) => de.set(ee, fe));
          }
          let lt = this._buildAnimation(I.namespaceId, B, re, o, tn, kt);
          if ((I.setRealPlayer(lt), fe === wd)) aa.push(I);
          else {
            let _e = this.playersByElement.get(fe);
            _e && _e.length && (I.parentPlayer = en(_e)), i.push(I);
          }
        } else
          Mn(b, B.fromStyles),
            I.onDestroy(() => bt(b, B.toStyles)),
            Dd.push(I),
            u.has(b) && i.push(I);
      }),
        Dd.forEach((D) => {
          let b = o.get(D.element);
          if (b && b.length) {
            let I = en(b);
            D.setRealPlayer(I);
          }
        }),
        i.forEach((D) => {
          D.parentPlayer ? D.syncPlayerEvents(D.parentPlayer) : D.destroy();
        });
      for (let D = 0; D < x.length; D++) {
        let b = x[D],
          I = b[ct];
        if ((vr(b, Qu), I && I.hasAnimation)) continue;
        let B = [];
        if (a.size) {
          let lt = a.get(b);
          lt && lt.length && B.push(...lt);
          let _e = this.driver.query(b, Ku, !0);
          for (let Lt = 0; Lt < _e.length; Lt++) {
            let ee = a.get(_e[Lt]);
            ee && ee.length && B.push(...ee);
          }
        }
        let fe = B.filter((lt) => !lt.destroyed);
        fe.length ? bT(this, b, fe) : this.processLeaveNode(b);
      }
      return (
        (x.length = 0),
        aa.forEach((D) => {
          this.players.push(D),
            D.onDone(() => {
              D.destroy();
              let b = this.players.indexOf(D);
              this.players.splice(b, 1);
            }),
            D.play();
        }),
        aa
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
          let c = !o || o == _i;
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
      Mn(o, n.fromStyles);
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
          let x = y[ct];
          if (x && x.removedBeforeQueried) return new Jt(p.duration, p.delay);
          let T = y !== c,
            H = CT((r.get(y) || yT).map((re) => re.getRealPlayer())).filter(
              (re) => {
                let de = re;
                return de.element ? de.element === y : !1;
              }
            ),
            z = o.get(y),
            Q = s.get(y),
            Te = Dy(this._normalizer, p.keyframes, z, Q),
            ne = this._buildPlayer(p, Te, H);
          if ((p.subTimeline && i && d.add(y), T)) {
            let re = new Ri(e, a, y);
            re.setRealPlayer(ne), l.push(re);
          }
          return ne;
        });
      l.forEach((p) => {
        Be(this.playersByQueriedElement, p.element, []).push(p),
          p.onDone(() => DT(this.playersByQueriedElement, p.element, p));
      }),
        u.forEach((p) => Ze(p, cy));
      let h = en(f);
      return (
        h.onDestroy(() => {
          u.forEach((p) => vr(p, cy)), bt(c, n.toStyles);
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
        : new Jt(e.duration, e.delay);
    }
  },
  Ri = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new Jt()),
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
          n.forEach((i) => ud(e, r, void 0, i));
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
function DT(t, e, n) {
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
function wT(t) {
  return t ?? null;
}
function Qs(t) {
  return t && t.nodeType === 1;
}
function ET(t) {
  return t == "start" || t == "done";
}
function gy(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function my(t, e, n, r, i) {
  let o = [];
  n.forEach((c) => o.push(gy(c)));
  let s = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let f = e.computeStyle(l, d, i);
      u.set(d, f), (!f || f.length == 0) && ((l[ct] = vT), s.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => gy(c, o[a++])), s;
}
function yy(t, e) {
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
function Ze(t, e) {
  t.classList?.add(e);
}
function vr(t, e) {
  t.classList?.remove(e);
}
function bT(t, e, n) {
  en(n).onDone(() => t.processLeaveNode(e));
}
function CT(t) {
  let e = [];
  return xy(t, e), e;
}
function xy(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof Mi ? xy(r.players, e) : e.push(r);
  }
}
function IT(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let o = n[i];
    if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
function vy(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((o) => i.add(o)) : e.set(t, r), n.delete(t), !0;
}
var wr = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (o, s) => {}),
      (this._transitionEngine = new ad(e.body, n, r, i)),
      (this._timelineEngine = new od(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (o, s) =>
        this.onRemovalComplete(o, s));
  }
  registerTrigger(e, n, r, i, o) {
    let s = e + "-" + i,
      a = this._triggerCache[s];
    if (!a) {
      let c = [],
        l = [],
        u = My(this._driver, o, c, l);
      if (c.length) throw IM(i, c);
      l.length && void 0,
        (a = uT(i, u, this._normalizer)),
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
      let [o, s] = sy(r),
        a = i;
      this._timelineEngine.command(o, n, s, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, o) {
    if (r.charAt(0) == "@") {
      let [s, a] = sy(r);
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
function ST(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = Wu(e[0])), e.length > 1 && (r = Wu(e[e.length - 1])))
      : e instanceof Map && (n = Wu(e)),
    n || r ? new cd(t, n, r) : null
  );
}
var Dr = class Dr {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = Dr.initialStylesByElement.get(e);
    i || Dr.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        bt(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (bt(this._element, this._initialStyles),
        this._endStyles &&
          (bt(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (Dr.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (Mn(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (Mn(this._element, this._endStyles), (this._endStyles = null)),
        bt(this._element, this._initialStyles),
        (this._state = 3));
  }
};
Dr.initialStylesByElement = new WeakMap();
var cd = Dr;
function Wu(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      MT(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function MT(t) {
  return t === "display" || t === "position";
}
var ra = class {
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
          i !== "offset" && e.set(i, this._finished ? r : gd(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  ia = class {
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
      return wy(e, n);
    }
    getParentElement(e) {
      return fd(e);
    }
    query(e, n, r) {
      return Ey(e, n, r);
    }
    computeStyle(e, n, r) {
      return gd(e, n);
    }
    animate(e, n, r, i, o, s = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      o && (c.easing = o);
      let l = new Map(),
        u = s.filter((h) => h instanceof ra);
      GM(r, i) &&
        u.forEach((h) => {
          h.currentSnapshot.forEach((p, y) => l.set(y, p));
        });
      let d = HM(n).map((h) => new Map(h));
      d = WM(e, d, l);
      let f = ST(e, d);
      return new ra(e, d, c, f);
    }
  };
var Ks = "@",
  Ny = "@.disabled",
  oa = class {
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
      n.charAt(0) == Ks && n == Ny
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
  ld = class extends oa {
    constructor(e, n, r, i, o) {
      super(n, r, i, o), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == Ks
        ? n.charAt(1) == "." && n == Ny
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == Ks) {
        let i = TT(e),
          o = n.slice(1),
          s = "";
        return (
          o.charAt(0) != Ks && ([o, s] = _T(o)),
          this.engine.listen(this.namespaceId, i, o, s, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function TT(t) {
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
function _T(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var sa = class {
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
        (u = new oa(r, i, this.engine, d)), l.set(i, u);
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
    return n.data.animation.forEach(a), new ld(this, s, i, this.engine);
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
var xT = (() => {
  let e = class e extends wr {
    constructor(r, i, o) {
      super(r, i, o, g(Xn, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ve), E(Tn), E(_n));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function NT() {
  return new Xs();
}
function RT(t, e, n) {
  return new sa(t, e, n);
}
var Ry = [
    { provide: _n, useFactory: NT },
    { provide: wr, useClass: xT },
    { provide: hn, useFactory: RT, deps: [Cs, wr, G] },
  ],
  OT = [
    { provide: Tn, useFactory: () => new ia() },
    { provide: il, useValue: "BrowserAnimations" },
    ...Ry,
  ],
  A1 = [
    { provide: Tn, useClass: hd },
    { provide: il, useValue: "NoopAnimations" },
    ...Ry,
  ];
function Oy() {
  return Qt("NgEagerAnimations"), [...OT];
}
var Py = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Qe({ type: e, bootstrap: [ry] })),
    (e.ɵinj = We({ providers: [nm(), Oy()], imports: [tu, Gm] }));
  let t = e;
  return t;
})();
em()
  .bootstrapModule(Py)
  .catch((t) => console.error(t));

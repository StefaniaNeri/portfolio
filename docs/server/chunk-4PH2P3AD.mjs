import "./polyfills.server.mjs";
import { a as Z, b as et, d as ba, h as Ln } from "./chunk-VVCT4QZE.mjs";
var hm = null;
var wu = 1,
  pm = Symbol("SIGNAL");
function Oe(t) {
  let e = hm;
  return (hm = t), e;
}
var mm = {
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
function tD(t) {
  if (!(Tu(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === wu)) {
    if (!t.producerMustRecompute(t) && !Du(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = wu);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = wu);
  }
}
function gm(t) {
  return t && (t.nextProducerIndex = 0), Oe(t);
}
function ym(t, e) {
  if (
    (Oe(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Tu(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        _u(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Du(t) {
  wa(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (tD(n), r !== n.version)) return !0;
  }
  return !1;
}
function vm(t) {
  if ((wa(t), Tu(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      _u(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function _u(t, e) {
  if ((nD(t), wa(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      _u(t.producerNode[r], t.producerIndexOfThis[r]);
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
    wa(i), (i.producerIndexOfThis[r] = e);
  }
}
function Tu(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function wa(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function nD(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function rD() {
  throw new Error();
}
var iD = rD;
function Em(t) {
  iD = t;
}
function me(t) {
  return typeof t == "function";
}
function hi(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Da = hi(
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
function bs(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var nt = class t {
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
          for (let s of n) s.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (me(r))
        try {
          r();
        } catch (s) {
          e = s instanceof Da ? s.errors : [s];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let s of i)
          try {
            bm(s);
          } catch (o) {
            (e = e ?? []),
              o instanceof Da ? (e = [...e, ...o.errors]) : e.push(o);
          }
      }
      if (e) throw new Da(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) bm(e);
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
    n === e ? (this._parentage = null) : Array.isArray(n) && bs(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && bs(n, e), e instanceof t && e._removeParent(this);
  }
};
nt.EMPTY = (() => {
  let t = new nt();
  return (t.closed = !0), t;
})();
var Su = nt.EMPTY;
function _a(t) {
  return (
    t instanceof nt ||
    (t && "closed" in t && me(t.remove) && me(t.add) && me(t.unsubscribe))
  );
}
function bm(t) {
  me(t) ? t() : t.unsubscribe();
}
var Xt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var pi = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = pi;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = pi;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Ta(t) {
  pi.setTimeout(() => {
    let { onUnhandledError: e } = Xt;
    if (e) e(t);
    else throw t;
  });
}
function ws() {}
var wm = Cu("C", void 0, void 0);
function Dm(t) {
  return Cu("E", void 0, t);
}
function _m(t) {
  return Cu("N", t, void 0);
}
function Cu(t, e, n) {
  return { kind: t, value: e, error: n };
}
var Br = null;
function mi(t) {
  if (Xt.useDeprecatedSynchronousErrorHandling) {
    let e = !Br;
    if ((e && (Br = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Br;
      if (((Br = null), n)) throw r;
    }
  } else t();
}
function Tm(t) {
  Xt.useDeprecatedSynchronousErrorHandling &&
    Br &&
    ((Br.errorThrown = !0), (Br.error = t));
}
var Hr = class extends nt {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), _a(e) && e.add(this))
          : (this.destination = aD);
    }
    static create(e, n, r) {
      return new gi(e, n, r);
    }
    next(e) {
      this.isStopped ? Nu(_m(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Nu(Dm(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Nu(wm, this) : ((this.isStopped = !0), this._complete());
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
  sD = Function.prototype.bind;
function Iu(t, e) {
  return sD.call(t, e);
}
var Mu = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          Sa(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          Sa(r);
        }
      else Sa(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          Sa(n);
        }
    }
  },
  gi = class extends Hr {
    constructor(e, n, r) {
      super();
      let i;
      if (me(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let s;
        this && Xt.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Iu(e.next, s),
              error: e.error && Iu(e.error, s),
              complete: e.complete && Iu(e.complete, s),
            }))
          : (i = e);
      }
      this.destination = new Mu(i);
    }
  };
function Sa(t) {
  Xt.useDeprecatedSynchronousErrorHandling ? Tm(t) : Ta(t);
}
function oD(t) {
  throw t;
}
function Nu(t, e) {
  let { onStoppedNotification: n } = Xt;
  n && pi.setTimeout(() => n(t, e));
}
var aD = { closed: !0, next: ws, error: oD, complete: ws };
var yi = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Nt(t) {
  return t;
}
function Au(...t) {
  return xu(t);
}
function xu(t) {
  return t.length === 0
    ? Nt
    : t.length === 1
    ? t[0]
    : function (n) {
        return t.reduce((r, i) => i(r), n);
      };
}
var ke = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let s = lD(n) ? n : new gi(n, r, i);
      return (
        mi(() => {
          let { operator: o, source: a } = this;
          s.add(
            o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s)
          );
        }),
        s
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
        (r = Sm(r)),
        new r((i, s) => {
          let o = new gi({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                s(c), o.unsubscribe();
              }
            },
            error: s,
            complete: i,
          });
          this.subscribe(o);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [yi]() {
      return this;
    }
    pipe(...n) {
      return xu(n)(this);
    }
    toPromise(n) {
      return (
        (n = Sm(n)),
        new n((r, i) => {
          let s;
          this.subscribe(
            (o) => (s = o),
            (o) => i(o),
            () => r(s)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Sm(t) {
  var e;
  return (e = t ?? Xt.Promise) !== null && e !== void 0 ? e : Promise;
}
function cD(t) {
  return t && me(t.next) && me(t.error) && me(t.complete);
}
function lD(t) {
  return (t && t instanceof Hr) || (cD(t) && _a(t));
}
function Ru(t) {
  return me(t?.lift);
}
function Ce(t) {
  return (e) => {
    if (Ru(e))
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
function Ie(t, e, n, r, i) {
  return new Ou(t, e, n, r, i);
}
var Ou = class extends Hr {
  constructor(e, n, r, i, s, o) {
    super(e),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
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
function vi() {
  return Ce((t, e) => {
    let n = null;
    t._refCount++;
    let r = Ie(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        s = n;
      (n = null), i && (!s || i === s) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var Ei = class extends ke {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ru(e) && (this.lift = e.lift);
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
      e = this._connection = new nt();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          Ie(
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
        e.closed && ((this._connection = null), (e = nt.EMPTY));
    }
    return e;
  }
  refCount() {
    return vi()(this);
  }
};
var Cm = hi(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var dt = (() => {
    class t extends ke {
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
        let r = new Ca(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Cm();
      }
      next(n) {
        mi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        mi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        mi(() => {
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
        let { hasError: r, isStopped: i, observers: s } = this;
        return r || i
          ? Su
          : ((this.currentObservers = null),
            s.push(n),
            new nt(() => {
              (this.currentObservers = null), bs(s, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this;
        r ? n.error(i) : s && n.complete();
      }
      asObservable() {
        let n = new ke();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new Ca(e, n)), t;
  })(),
  Ca = class extends dt {
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
        : Su;
    }
  };
var ft = class extends dt {
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
var Mt = new ke((t) => t.complete());
function Im(t) {
  return t && me(t.schedule);
}
function Nm(t) {
  return t[t.length - 1];
}
function Mm(t) {
  return me(Nm(t)) ? t.pop() : void 0;
}
function cr(t) {
  return Im(Nm(t)) ? t.pop() : void 0;
}
function xm(t, e, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s);
        });
  }
  return new (n || (n = Promise))(function (s, o) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        o(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        o(d);
      }
    }
    function l(u) {
      u.done ? s(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
}
function Am(t) {
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
function Ur(t) {
  return this instanceof Ur ? ((this.v = t), this) : new Ur(t);
}
function Rm(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    s = [];
  return (
    (i = {}),
    a("next"),
    a("throw"),
    a("return", o),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function o(b) {
    return function (I) {
      return Promise.resolve(I).then(b, d);
    };
  }
  function a(b, I) {
    r[b] &&
      ((i[b] = function (M) {
        return new Promise(function (F, R) {
          s.push([b, M, F, R]) > 1 || c(b, M);
        });
      }),
      I && (i[b] = I(i[b])));
  }
  function c(b, I) {
    try {
      l(r[b](I));
    } catch (M) {
      g(s[0][3], M);
    }
  }
  function l(b) {
    b.value instanceof Ur
      ? Promise.resolve(b.value.v).then(u, d)
      : g(s[0][2], b);
  }
  function u(b) {
    c("next", b);
  }
  function d(b) {
    c("throw", b);
  }
  function g(b, I) {
    b(I), s.shift(), s.length && c(s[0][0], s[0][1]);
  }
}
function Om(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof Am == "function" ? Am(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(s) {
    n[s] =
      t[s] &&
      function (o) {
        return new Promise(function (a, c) {
          (o = t[s](o)), i(a, c, o.done, o.value);
        });
      };
  }
  function i(s, o, a, c) {
    Promise.resolve(c).then(function (l) {
      s({ value: l, done: a });
    }, o);
  }
}
var Ia = (t) => t && typeof t.length == "number" && typeof t != "function";
function Na(t) {
  return me(t?.then);
}
function Ma(t) {
  return me(t[yi]);
}
function Aa(t) {
  return Symbol.asyncIterator && me(t?.[Symbol.asyncIterator]);
}
function xa(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function uD() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Ra = uD();
function Oa(t) {
  return me(t?.[Ra]);
}
function ka(t) {
  return Rm(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Ur(n.read());
        if (i) return yield Ur(void 0);
        yield yield Ur(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function La(t) {
  return me(t?.getReader);
}
function at(t) {
  if (t instanceof ke) return t;
  if (t != null) {
    if (Ma(t)) return dD(t);
    if (Ia(t)) return fD(t);
    if (Na(t)) return hD(t);
    if (Aa(t)) return km(t);
    if (Oa(t)) return pD(t);
    if (La(t)) return mD(t);
  }
  throw xa(t);
}
function dD(t) {
  return new ke((e) => {
    let n = t[yi]();
    if (me(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function fD(t) {
  return new ke((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function hD(t) {
  return new ke((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, Ta);
  });
}
function pD(t) {
  return new ke((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function km(t) {
  return new ke((e) => {
    gD(t, e).catch((n) => e.error(n));
  });
}
function mD(t) {
  return km(ka(t));
}
function gD(t, e) {
  var n, r, i, s;
  return xm(this, void 0, void 0, function* () {
    try {
      for (n = Om(t); (r = yield n.next()), !r.done; ) {
        let o = r.value;
        if ((e.next(o), e.closed)) return;
      }
    } catch (o) {
      i = { error: o };
    } finally {
      try {
        r && !r.done && (s = n.return) && (yield s.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Dt(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(s), !i)) return s;
}
function Pa(t, e = 0) {
  return Ce((n, r) => {
    n.subscribe(
      Ie(
        r,
        (i) => Dt(r, t, () => r.next(i), e),
        () => Dt(r, t, () => r.complete(), e),
        (i) => Dt(r, t, () => r.error(i), e)
      )
    );
  });
}
function Fa(t, e = 0) {
  return Ce((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function Lm(t, e) {
  return at(t).pipe(Fa(e), Pa(e));
}
function Pm(t, e) {
  return at(t).pipe(Fa(e), Pa(e));
}
function Fm(t, e) {
  return new ke((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function jm(t, e) {
  return new ke((n) => {
    let r;
    return (
      Dt(n, e, () => {
        (r = t[Ra]()),
          Dt(
            n,
            e,
            () => {
              let i, s;
              try {
                ({ value: i, done: s } = r.next());
              } catch (o) {
                n.error(o);
                return;
              }
              s ? n.complete() : n.next(i);
            },
            0,
            !0
          );
      }),
      () => me(r?.return) && r.return()
    );
  });
}
function ja(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new ke((n) => {
    Dt(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      Dt(
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
function Bm(t, e) {
  return ja(ka(t), e);
}
function Hm(t, e) {
  if (t != null) {
    if (Ma(t)) return Lm(t, e);
    if (Ia(t)) return Fm(t, e);
    if (Na(t)) return Pm(t, e);
    if (Aa(t)) return ja(t, e);
    if (Oa(t)) return jm(t, e);
    if (La(t)) return Bm(t, e);
  }
  throw xa(t);
}
function Ge(t, e) {
  return e ? Hm(t, e) : at(t);
}
function ue(...t) {
  let e = cr(t);
  return Ge(t, e);
}
function bi(t, e) {
  let n = me(t) ? t : () => t,
    r = (i) => i.error(n());
  return new ke(e ? (i) => e.schedule(r, 0, i) : r);
}
function ku(t) {
  return !!t && (t instanceof ke || (me(t.lift) && me(t.subscribe)));
}
var Pn = hi(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Ee(t, e) {
  return Ce((n, r) => {
    let i = 0;
    n.subscribe(
      Ie(r, (s) => {
        r.next(t.call(e, s, i++));
      })
    );
  });
}
var { isArray: yD } = Array;
function vD(t, e) {
  return yD(e) ? t(...e) : t(e);
}
function Um(t) {
  return Ee((e) => vD(t, e));
}
var { isArray: ED } = Array,
  { getPrototypeOf: bD, prototype: wD, keys: DD } = Object;
function Vm(t) {
  if (t.length === 1) {
    let e = t[0];
    if (ED(e)) return { args: e, keys: null };
    if (_D(e)) {
      let n = DD(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function _D(t) {
  return t && typeof t == "object" && bD(t) === wD;
}
function qm(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function Ds(...t) {
  let e = cr(t),
    n = Mm(t),
    { args: r, keys: i } = Vm(t);
  if (r.length === 0) return Ge([], e);
  let s = new ke(TD(r, e, i ? (o) => qm(i, o) : Nt));
  return n ? s.pipe(Um(n)) : s;
}
function TD(t, e, n = Nt) {
  return (r) => {
    $m(
      e,
      () => {
        let { length: i } = t,
          s = new Array(i),
          o = i,
          a = i;
        for (let c = 0; c < i; c++)
          $m(
            e,
            () => {
              let l = Ge(t[c], e),
                u = !1;
              l.subscribe(
                Ie(
                  r,
                  (d) => {
                    (s[c] = d), u || ((u = !0), a--), a || r.next(n(s.slice()));
                  },
                  () => {
                    --o || r.complete();
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
function $m(t, e, n) {
  t ? Dt(n, t, e) : e();
}
function zm(t, e, n, r, i, s, o, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    g = () => {
      d && !c.length && !l && e.complete();
    },
    b = (M) => (l < r ? I(M) : c.push(M)),
    I = (M) => {
      s && e.next(M), l++;
      let F = !1;
      at(n(M, u++)).subscribe(
        Ie(
          e,
          (R) => {
            i?.(R), s ? b(R) : e.next(R);
          },
          () => {
            F = !0;
          },
          void 0,
          () => {
            if (F)
              try {
                for (l--; c.length && l < r; ) {
                  let R = c.shift();
                  o ? Dt(e, o, () => I(R)) : I(R);
                }
                g();
              } catch (R) {
                e.error(R);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      Ie(e, b, () => {
        (d = !0), g();
      })
    ),
    () => {
      a?.();
    }
  );
}
function tt(t, e, n = 1 / 0) {
  return me(e)
    ? tt((r, i) => Ee((s, o) => e(r, s, i, o))(at(t(r, i))), n)
    : (typeof e == "number" && (n = e), Ce((r, i) => zm(r, i, t, n)));
}
function wi(t = 1 / 0) {
  return tt(Nt, t);
}
function Gm() {
  return wi(1);
}
function Di(...t) {
  return Gm()(Ge(t, cr(t)));
}
function Ba(t) {
  return new ke((e) => {
    at(t()).subscribe(e);
  });
}
function _t(t, e) {
  return Ce((n, r) => {
    let i = 0;
    n.subscribe(Ie(r, (s) => t.call(e, s, i++) && r.next(s)));
  });
}
function lr(t) {
  return Ce((e, n) => {
    let r = null,
      i = !1,
      s;
    (r = e.subscribe(
      Ie(n, void 0, void 0, (o) => {
        (s = at(t(o, lr(t)(e)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0);
      })
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n));
  });
}
function Wm(t, e, n, r, i) {
  return (s, o) => {
    let a = n,
      c = e,
      l = 0;
    s.subscribe(
      Ie(
        o,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), r && o.next(c);
        },
        i &&
          (() => {
            a && o.next(c), o.complete();
          })
      )
    );
  };
}
function Fn(t, e) {
  return me(e) ? tt(t, e, 1) : tt(t, 1);
}
function ur(t) {
  return Ce((e, n) => {
    let r = !1;
    e.subscribe(
      Ie(
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
function jn(t) {
  return t <= 0
    ? () => Mt
    : Ce((e, n) => {
        let r = 0;
        e.subscribe(
          Ie(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          })
        );
      });
}
function Lu(t) {
  return Ee(() => t);
}
function Ha(t = SD) {
  return Ce((e, n) => {
    let r = !1;
    e.subscribe(
      Ie(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t()))
      )
    );
  });
}
function SD() {
  return new Pn();
}
function dr(t) {
  return Ce((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Jt(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? _t((i, s) => t(i, s, r)) : Nt,
      jn(1),
      n ? ur(e) : Ha(() => new Pn())
    );
}
function _i(t) {
  return t <= 0
    ? () => Mt
    : Ce((e, n) => {
        let r = [];
        e.subscribe(
          Ie(
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
function Pu(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? _t((i, s) => t(i, s, r)) : Nt,
      _i(1),
      n ? ur(e) : Ha(() => new Pn())
    );
}
function Fu(t, e) {
  return Ce(Wm(t, e, arguments.length >= 2, !0));
}
function ju(...t) {
  let e = cr(t);
  return Ce((n, r) => {
    (e ? Di(t, n, e) : Di(t, n)).subscribe(r);
  });
}
function Tt(t, e) {
  return Ce((n, r) => {
    let i = null,
      s = 0,
      o = !1,
      a = () => o && !i && r.complete();
    n.subscribe(
      Ie(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = s++;
          at(t(c, u)).subscribe(
            (i = Ie(
              r,
              (d) => r.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (o = !0), a();
        }
      )
    );
  });
}
function Bu(t) {
  return Ce((e, n) => {
    at(t).subscribe(Ie(n, () => n.complete(), ws)), !n.closed && e.subscribe(n);
  });
}
function rt(t, e, n) {
  let r = me(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? Ce((i, s) => {
        var o;
        (o = r.subscribe) === null || o === void 0 || o.call(r);
        let a = !0;
        i.subscribe(
          Ie(
            s,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), s.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                s.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                s.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : Nt;
}
var Lg = "https://g.co/ng/security#xss",
  G = class extends Error {
    constructor(e, n) {
      super(_c(e, n)), (this.code = e);
    }
  };
function _c(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function zs(t) {
  return { toString: t }.toString();
}
var Ua = "__parameters__";
function CD(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Pg(t, e, n) {
  return zs(() => {
    let r = CD(e);
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this;
      let o = new i(...s);
      return (a.annotation = o), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(Ua)
          ? c[Ua]
          : Object.defineProperty(c, Ua, { value: [] })[Ua];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(o), c;
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
var At = globalThis;
function He(t) {
  for (let e in t) if (t[e] === He) return e;
  throw Error("Could not find renamed property on target object.");
}
function St(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(St).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function Qm(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var ID = He({ __forward_ref__: He });
function Fg(t) {
  return (
    (t.__forward_ref__ = Fg),
    (t.toString = function () {
      return St(this());
    }),
    t
  );
}
function Gt(t) {
  return jg(t) ? t() : t;
}
function jg(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(ID) && t.__forward_ref__ === Fg
  );
}
function J(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Rt(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Tc(t) {
  return Km(t, Hg) || Km(t, Ug);
}
function Bg(t) {
  return Tc(t) !== null;
}
function Km(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function ND(t) {
  let e = t && (t[Hg] || t[Ug]);
  return e || null;
}
function Ym(t) {
  return t && (t.hasOwnProperty(Zm) || t.hasOwnProperty(MD)) ? t[Zm] : null;
}
var Hg = He({ ɵprov: He }),
  Zm = He({ ɵinj: He }),
  Ug = He({ ngInjectableDef: He }),
  MD = He({ ngInjectorDef: He }),
  ie = class {
    constructor(e, n) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = J({
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
function Vg(t) {
  return t && !!t.ɵproviders;
}
var AD = He({ ɵcmp: He }),
  xD = He({ ɵdir: He }),
  RD = He({ ɵpipe: He }),
  OD = He({ ɵmod: He }),
  Za = He({ ɵfac: He }),
  Ts = He({ __NG_ELEMENT_ID__: He }),
  Xm = He({ __NG_ENV_ID__: He });
function Gs(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function kD(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Gs(t);
}
function LD(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new G(-200, t);
}
function Wd(t, e) {
  throw new G(-201, !1);
}
var we = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(we || {}),
  ed;
function qg() {
  return ed;
}
function zt(t) {
  let e = ed;
  return (ed = t), e;
}
function $g(t, e, n) {
  let r = Tc(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & we.Optional) return null;
  if (e !== void 0) return e;
  Wd(t, "Injector");
}
var PD = {},
  Ns = PD,
  td = "__NG_DI_FLAG__",
  Xa = "ngTempTokenPath",
  FD = "ngTokenPath",
  jD = /\n/gm,
  BD = "\u0275",
  Jm = "__source",
  Mi;
function HD() {
  return Mi;
}
function fr(t) {
  let e = Mi;
  return (Mi = t), e;
}
function UD(t, e = we.Default) {
  if (Mi === void 0) throw new G(-203, !1);
  return Mi === null
    ? $g(t, void 0, e)
    : Mi.get(t, e & we.Optional ? null : void 0, e);
}
function X(t, e = we.Default) {
  return (qg() || UD)(Gt(t), e);
}
function q(t, e = we.Default) {
  return X(t, Sc(e));
}
function Sc(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function nd(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = Gt(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new G(900, !1);
      let i,
        s = we.Default;
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = VD(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a);
      }
      e.push(X(i, s));
    } else e.push(X(r));
  }
  return e;
}
function zg(t, e) {
  return (t[td] = e), (t.prototype[td] = e), t;
}
function VD(t) {
  return t[td];
}
function qD(t, e, n, r) {
  let i = t[Xa];
  throw (
    (e[Jm] && i.unshift(e[Jm]),
    (t.message = $D(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[FD] = i),
    (t[Xa] = null),
    t)
  );
}
function $D(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == BD
      ? t.slice(2)
      : t;
  let i = St(e);
  if (Array.isArray(e)) i = e.map(St).join(" -> ");
  else if (typeof e == "object") {
    let s = [];
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o];
        s.push(o + ":" + (typeof a == "string" ? JSON.stringify(a) : St(a)));
      }
    i = `{${s.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    jD,
    `
  `
  )}`;
}
var ji = zg(Pg("Optional"), 8);
var Qd = zg(Pg("SkipSelf"), 4);
function xi(t, e) {
  let n = t.hasOwnProperty(Za);
  return n ? t[Za] : null;
}
function Kd(t, e) {
  t.forEach((n) => (Array.isArray(n) ? Kd(n, e) : e(n)));
}
function Gg(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function Ja(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function zD(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let s = i - 2;
      (t[i] = t[s]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function GD(t, e, n) {
  let r = Ws(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), zD(t, r, e, n)), r;
}
function Hu(t, e) {
  let n = Ws(t, e);
  if (n >= 0) return t[n | 1];
}
function Ws(t, e) {
  return WD(t, e, 1);
}
function WD(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let s = r + ((i - r) >> 1),
      o = t[s << n];
    if (e === o) return s << n;
    o > e ? (i = s) : (r = s + 1);
  }
  return ~(i << n);
}
var Ms = {},
  Wt = [],
  qr = new ie(""),
  Wg = new ie("", -1),
  Qg = new ie(""),
  ec = class {
    get(e, n = Ns) {
      if (n === Ns) {
        let r = new Error(`NullInjectorError: No provider for ${St(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Kg = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Kg || {}),
  nn = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(nn || {}),
  Hn = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(Hn || {});
function QD(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let s = e.length;
      if (i + s === r || t.charCodeAt(i + s) <= 32) return i;
    }
    n = i + 1;
  }
}
function rd(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let s = n[r++],
        o = n[r++],
        a = n[r++];
      t.setAttribute(e, o, a, s);
    } else {
      let s = i,
        o = n[++r];
      YD(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++;
    }
  }
  return r;
}
function KD(t) {
  return t === 3 || t === 4 || t === 6;
}
function YD(t) {
  return t.charCodeAt(0) === 64;
}
function Yd(t, e) {
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
              ? eg(t, n, i, null, e[++r])
              : eg(t, n, i, null, null));
      }
    }
  return t;
}
function eg(t, e, n, r, i) {
  let s = 0,
    o = t.length;
  if (e === -1) o = -1;
  else
    for (; s < t.length; ) {
      let a = t[s++];
      if (typeof a == "number") {
        if (a === e) {
          o = -1;
          break;
        } else if (a > e) {
          o = s - 1;
          break;
        }
      }
    }
  for (; s < t.length; ) {
    let a = t[s];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[s + 1] = i);
        return;
      } else if (r === t[s + 1]) {
        t[s + 2] = i;
        return;
      }
    }
    s++, r !== null && s++, i !== null && s++;
  }
  o !== -1 && (t.splice(o, 0, e), (s = o + 1)),
    t.splice(s++, 0, n),
    r !== null && t.splice(s++, 0, r),
    i !== null && t.splice(s++, 0, i);
}
var Yg = "ng-template";
function ZD(t, e, n, r) {
  let i = 0;
  if (r) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && QD(e[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Zd(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let s;
    for (; ++i < e.length && typeof (s = e[i]) == "string"; )
      if (s.toLowerCase() === n) return !0;
  }
  return !1;
}
function Zd(t) {
  return t.type === 4 && t.value !== Yg;
}
function XD(t, e, n) {
  let r = t.type === 4 && !n ? Yg : t.value;
  return e === r;
}
function JD(t, e, n) {
  let r = 4,
    i = t.attrs,
    s = i !== null ? n_(i) : 0,
    o = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!o && !en(r) && !en(c)) return !1;
      if (o && en(c)) continue;
      (o = !1), (r = c | (r & 1));
      continue;
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !XD(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (en(r)) return !1;
          o = !0;
        }
      } else if (r & 8) {
        if (i === null || !ZD(t, i, c, n)) {
          if (en(r)) return !1;
          o = !0;
        }
      } else {
        let l = e[++a],
          u = e_(c, i, Zd(t), n);
        if (u === -1) {
          if (en(r)) return !1;
          o = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > s ? (d = "") : (d = i[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (en(r)) return !1;
            o = !0;
          }
        }
      }
  }
  return en(r) || o;
}
function en(t) {
  return (t & 1) === 0;
}
function e_(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let s = !1;
    for (; i < e.length; ) {
      let o = e[i];
      if (o === t) return i;
      if (o === 3 || o === 6) s = !0;
      else if (o === 1 || o === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (o === 4) break;
        if (o === 0) {
          i += 4;
          continue;
        }
      }
      i += s ? 1 : 2;
    }
    return -1;
  } else return r_(e, t);
}
function t_(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (JD(t, e[r], n)) return !0;
  return !1;
}
function n_(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (KD(n)) return e;
  }
  return t.length;
}
function r_(t, e) {
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
function tg(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function i_(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    s = !1;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + o) : r & 4 && (i += " " + o);
    else
      i !== "" && !en(o) && ((e += tg(s, i)), (i = "")),
        (r = o),
        (s = s || !en(r));
    n++;
  }
  return i !== "" && (e += tg(s, i)), e;
}
function s_(t) {
  return t.map(i_).join(",");
}
function o_(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      i === 2 ? s !== "" && e.push(s, t[++r]) : i === 8 && n.push(s);
    else {
      if (!en(i)) break;
      i = s;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function Zg(t) {
  return zs(() => {
    let e = ny(t),
      n = et(Z({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Kg.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || nn.Emulated,
        styles: t.styles || Wt,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    ry(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = rg(r, !1)), (n.pipeDefs = rg(r, !0)), (n.id = l_(n)), n
    );
  });
}
function a_(t) {
  return Un(t) || Xg(t);
}
function c_(t) {
  return t !== null;
}
function Ot(t) {
  return zs(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Wt,
    declarations: t.declarations || Wt,
    imports: t.imports || Wt,
    exports: t.exports || Wt,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function ng(t, e) {
  if (t == null) return Ms;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        a = Hn.None;
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = a !== Hn.None ? [r, a] : r), (e[s] = o)) : (n[s] = r);
    }
  return n;
}
function Qs(t) {
  return zs(() => {
    let e = ny(t);
    return ry(e), e;
  });
}
function Un(t) {
  return t[AD] || null;
}
function Xg(t) {
  return t[xD] || null;
}
function Jg(t) {
  return t[RD] || null;
}
function ey(t) {
  let e = Un(t) || Xg(t) || Jg(t);
  return e !== null ? e.standalone : !1;
}
function ty(t, e) {
  let n = t[OD] || null;
  if (!n && e === !0)
    throw new Error(`Type ${St(t)} does not have '\u0275mod' property.`);
  return n;
}
function ny(t) {
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
    inputConfig: t.inputs || Ms,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Wt,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ng(t.inputs, e),
    outputs: ng(t.outputs),
    debugInfo: null,
  };
}
function ry(t) {
  t.features?.forEach((e) => e(t));
}
function rg(t, e) {
  if (!t) return null;
  let n = e ? Jg : a_;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(c_);
}
function l_(t) {
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
function Yr(t) {
  return { ɵproviders: t };
}
function u_(...t) {
  return { ɵproviders: iy(!0, t), ɵfromNgModule: !0 };
}
function iy(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o);
    };
  return (
    Kd(e, (o) => {
      let a = o;
      id(a, s, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && sy(i, s),
    n
  );
}
function sy(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    Xd(i, (s) => {
      e(s, r);
    });
  }
}
function id(t, e, n, r) {
  if (((t = Gt(t)), !t)) return !1;
  let i = null,
    s = Ym(t),
    o = !s && Un(t);
  if (!s && !o) {
    let c = t.ngModule;
    if (((s = Ym(c)), s)) i = c;
    else return !1;
  } else {
    if (o && !o.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (o) {
    if (a) return !1;
    if ((r.add(i), o.dependencies)) {
      let c =
        typeof o.dependencies == "function" ? o.dependencies() : o.dependencies;
      for (let l of c) id(l, e, n, r);
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i);
      let l;
      try {
        Kd(s.imports, (u) => {
          id(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && sy(l, e);
    }
    if (!a) {
      let l = xi(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: Wt }, i),
        e({ provide: Qg, useValue: i, multi: !0 }, i),
        e({ provide: qr, useValue: () => X(i), multi: !0 }, i);
    }
    let c = s.providers;
    if (c != null && !a) {
      let l = t;
      Xd(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Xd(t, e) {
  for (let n of t)
    Vg(n) && (n = n.ɵproviders), Array.isArray(n) ? Xd(n, e) : e(n);
}
var d_ = He({ provide: String, useValue: He });
function oy(t) {
  return t !== null && typeof t == "object" && d_ in t;
}
function f_(t) {
  return !!(t && t.useExisting);
}
function h_(t) {
  return !!(t && t.useFactory);
}
function sd(t) {
  return typeof t == "function";
}
var Cc = new ie(""),
  za = {},
  p_ = {},
  Uu;
function Jd() {
  return Uu === void 0 && (Uu = new ec()), Uu;
}
var pt = class {},
  As = class extends pt {
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
        ad(e, (o) => this.processProvider(o)),
        this.records.set(Wg, Ti(void 0, this)),
        i.has("environment") && this.records.set(pt, Ti(void 0, this));
      let s = this.records.get(Cc);
      s != null && typeof s.value == "string" && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(Qg, Wt, we.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = Oe(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          Oe(e);
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
      let n = fr(this),
        r = zt(void 0),
        i;
      try {
        return e();
      } finally {
        fr(n), zt(r);
      }
    }
    get(e, n = Ns, r = we.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Xm))) return e[Xm](this);
      r = Sc(r);
      let i,
        s = fr(this),
        o = zt(void 0);
      try {
        if (!(r & we.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = b_(e) && Tc(e);
            l && this.injectableDefInScope(l)
              ? (c = Ti(od(e), za))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & we.Self ? Jd() : this.parent;
        return (n = r & we.Optional && n === Ns ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Xa] = a[Xa] || []).unshift(St(e)), s)) throw a;
          return qD(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        zt(o), fr(s);
      }
    }
    resolveInjectorInitializers() {
      let e = Oe(null),
        n = fr(this),
        r = zt(void 0),
        i;
      try {
        let s = this.get(qr, Wt, we.Self);
        for (let o of s) o();
      } finally {
        fr(n), zt(r), Oe(e);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(St(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new G(205, !1);
    }
    processProvider(e) {
      e = Gt(e);
      let n = sd(e) ? e : Gt(e && e.provide),
        r = g_(e);
      if (!sd(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = Ti(void 0, za, !0)),
          (i.factory = () => nd(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      let r = Oe(null);
      try {
        return (
          n.value === za && ((n.value = p_), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            E_(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        Oe(r);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = Gt(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function od(t) {
  let e = Tc(t),
    n = e !== null ? e.factory : xi(t);
  if (n !== null) return n;
  if (t instanceof ie) throw new G(204, !1);
  if (t instanceof Function) return m_(t);
  throw new G(204, !1);
}
function m_(t) {
  if (t.length > 0) throw new G(204, !1);
  let n = ND(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function g_(t) {
  if (oy(t)) return Ti(void 0, t.useValue);
  {
    let e = y_(t);
    return Ti(e, za);
  }
}
function y_(t, e, n) {
  let r;
  if (sd(t)) {
    let i = Gt(t);
    return xi(i) || od(i);
  } else if (oy(t)) r = () => Gt(t.useValue);
  else if (h_(t)) r = () => t.useFactory(...nd(t.deps || []));
  else if (f_(t)) r = () => X(Gt(t.useExisting));
  else {
    let i = Gt(t && (t.useClass || t.provide));
    if (v_(t)) r = () => new i(...nd(t.deps));
    else return xi(i) || od(i);
  }
  return r;
}
function Ti(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function v_(t) {
  return !!t.deps;
}
function E_(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function b_(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof ie);
}
function ad(t, e) {
  for (let n of t)
    Array.isArray(n) ? ad(n, e) : n && Vg(n) ? ad(n.ɵproviders, e) : e(n);
}
function on(t, e) {
  t instanceof As && t.assertNotDestroyed();
  let n,
    r = fr(t),
    i = zt(void 0);
  try {
    return e();
  } finally {
    fr(r), zt(i);
  }
}
function ay() {
  return qg() !== void 0 || HD() != null;
}
function w_(t) {
  if (!ay()) throw new G(-203, !1);
}
function D_(t) {
  let e = At.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function __(t) {
  return typeof t == "function";
}
var Xe = 0,
  ve = 1,
  de = 2,
  ct = 3,
  tn = 4,
  an = 5,
  rn = 6,
  xs = 7,
  vn = 8,
  Ri = 9,
  sn = 10,
  Ve = 11,
  Rs = 12,
  ig = 13,
  Ks = 14,
  xt = 15,
  Ic = 16,
  Si = 17,
  Oi = 18,
  Nc = 19,
  cy = 20,
  hr = 21,
  Vu = 22,
  $r = 23,
  st = 25,
  ef = 1,
  Os = 6,
  Vn = 7,
  tc = 8,
  nc = 9,
  Ct = 10,
  tf = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(tf || {});
function Bn(t) {
  return Array.isArray(t) && typeof t[ef] == "object";
}
function kt(t) {
  return Array.isArray(t) && t[ef] === !0;
}
function ly(t) {
  return (t.flags & 4) !== 0;
}
function Bi(t) {
  return t.componentOffset > -1;
}
function nf(t) {
  return (t.flags & 1) === 1;
}
function Ys(t) {
  return !!t.template;
}
function rf(t) {
  return (t[de] & 512) !== 0;
}
function T_(t) {
  return (t.type & 16) === 16;
}
function S_(t) {
  return (t[de] & 32) === 32;
}
var cd = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function uy(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function Mc() {
  return dy;
}
function dy(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = I_), C_;
}
Mc.ngInherit = !0;
function C_() {
  let t = hy(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === Ms) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function I_(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = hy(t) || N_(t, { previous: Ms, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    l = c[s];
  (a[s] = new cd(l && l.currentValue, n, c === Ms)), uy(t, e, i, n);
}
var fy = "__ngSimpleChanges__";
function hy(t) {
  return t[fy] || null;
}
function N_(t, e) {
  return (t[fy] = e);
}
var sg = null;
var gn = function (t, e, n) {
    sg?.(t, e, n);
  },
  M_ = "svg",
  A_ = "math",
  x_ = !1;
function R_() {
  return x_;
}
function it(t) {
  for (; Array.isArray(t); ) t = t[Xe];
  return t;
}
function py(t) {
  for (; Array.isArray(t); ) {
    if (typeof t[ef] == "object") return t;
    t = t[Xe];
  }
  return null;
}
function my(t, e) {
  return it(e[t]);
}
function Lt(t, e) {
  return it(e[t.index]);
}
function gy(t, e) {
  return t.data[e];
}
function mr(t, e) {
  let n = e[t];
  return Bn(n) ? n : n[Xe];
}
function sf(t) {
  return (t[de] & 128) === 128;
}
function O_(t) {
  return kt(t[ct]);
}
function rc(t, e) {
  return e == null ? null : t[e];
}
function yy(t) {
  t[Si] = 0;
}
function k_(t) {
  t[de] & 1024 || ((t[de] |= 1024), sf(t) && ks(t));
}
function of(t) {
  return !!(t[de] & 9216 || t[$r]?.dirty);
}
function ld(t) {
  t[sn].changeDetectionScheduler?.notify(1),
    of(t)
      ? ks(t)
      : t[de] & 64 &&
        (R_()
          ? ((t[de] |= 1024), ks(t))
          : t[sn].changeDetectionScheduler?.notify());
}
function ks(t) {
  t[sn].changeDetectionScheduler?.notify();
  let e = Ls(t);
  for (; e !== null && !(e[de] & 8192 || ((e[de] |= 8192), !sf(e))); )
    e = Ls(e);
}
function vy(t, e) {
  if ((t[de] & 256) === 256) throw new G(911, !1);
  t[hr] === null && (t[hr] = []), t[hr].push(e);
}
function L_(t, e) {
  if (t[hr] === null) return;
  let n = t[hr].indexOf(e);
  n !== -1 && t[hr].splice(n, 1);
}
function Ls(t) {
  let e = t[ct];
  return kt(e) ? e[ct] : e;
}
var Ne = {
  lFrame: Sy(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
function P_() {
  return Ne.lFrame.elementDepthCount;
}
function F_() {
  Ne.lFrame.elementDepthCount++;
}
function j_() {
  Ne.lFrame.elementDepthCount--;
}
function Ey() {
  return Ne.bindingsEnabled;
}
function Zs() {
  return Ne.skipHydrationRootTNode !== null;
}
function B_(t) {
  return Ne.skipHydrationRootTNode === t;
}
function H_(t) {
  Ne.skipHydrationRootTNode = t;
}
function U_() {
  Ne.skipHydrationRootTNode = null;
}
function We() {
  return Ne.lFrame.lView;
}
function bn() {
  return Ne.lFrame.tView;
}
function cn() {
  let t = by();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function by() {
  return Ne.lFrame.currentTNode;
}
function V_() {
  let t = Ne.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Xs(t, e) {
  let n = Ne.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function wy() {
  return Ne.lFrame.isParent;
}
function q_() {
  Ne.lFrame.isParent = !1;
}
function $_() {
  let t = Ne.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function z_(t) {
  return (Ne.lFrame.bindingIndex = t);
}
function af() {
  return Ne.lFrame.bindingIndex++;
}
function G_(t) {
  let e = Ne.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function W_() {
  return Ne.lFrame.inI18n;
}
function Q_(t, e) {
  let n = Ne.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), ud(e);
}
function K_() {
  return Ne.lFrame.currentDirectiveIndex;
}
function ud(t) {
  Ne.lFrame.currentDirectiveIndex = t;
}
function Y_(t) {
  let e = Ne.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function Dy(t) {
  Ne.lFrame.currentQueryIndex = t;
}
function Z_(t) {
  let e = t[ve];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[an] : null;
}
function _y(t, e, n) {
  if (n & we.SkipSelf) {
    let i = e,
      s = t;
    for (; (i = i.parent), i === null && !(n & we.Host); )
      if (((i = Z_(s)), i === null || ((s = s[Ks]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = s);
  }
  let r = (Ne.lFrame = Ty());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function cf(t) {
  let e = Ty(),
    n = t[ve];
  (Ne.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function Ty() {
  let t = Ne.lFrame,
    e = t === null ? null : t.child;
  return e === null ? Sy(t) : e;
}
function Sy(t) {
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
function Cy() {
  let t = Ne.lFrame;
  return (Ne.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Iy = Cy;
function lf() {
  let t = Cy();
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
function Hi() {
  return Ne.lFrame.selectedIndex;
}
function zr(t) {
  Ne.lFrame.selectedIndex = t;
}
function uf() {
  let t = Ne.lFrame;
  return gy(t.tView, t.selectedIndex);
}
function Ny() {
  return Ne.lFrame.currentNamespace;
}
var My = !0;
function df() {
  return My;
}
function wn(t) {
  My = t;
}
function X_(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype;
  if (r) {
    let o = dy(e);
    (n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s));
}
function ff(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let s = t.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = s;
    o && (t.contentHooks ??= []).push(-n, o),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      l &&
        ((t.viewHooks ??= []).push(n, l), (t.viewCheckHooks ??= []).push(n, l)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function Ga(t, e, n) {
  Ay(t, e, 3, n);
}
function Wa(t, e, n, r) {
  (t[de] & 3) === n && Ay(t, e, n, r);
}
function qu(t, e) {
  let n = t[de];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[de] = n));
}
function Ay(t, e, n, r) {
  let i = r !== void 0 ? t[Si] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0;
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[Si] += 65536),
        (a < s || s == -1) &&
          (J_(t, n, e, c), (t[Si] = (t[Si] & 4294901760) + c + 2)),
        c++;
}
function og(t, e) {
  gn(4, t, e);
  let n = Oe(null);
  try {
    e.call(t);
  } finally {
    Oe(n), gn(5, t, e);
  }
}
function J_(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o];
  i
    ? t[de] >> 14 < t[Si] >> 16 &&
      (t[de] & 3) === e &&
      ((t[de] += 16384), og(a, s))
    : og(a, s);
}
var Ai = -1,
  Ps = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function eT(t) {
  return t instanceof Ps;
}
function tT(t) {
  return (
    t != null &&
    typeof t == "object" &&
    (t.insertBeforeIndex === null ||
      typeof t.insertBeforeIndex == "number" ||
      Array.isArray(t.insertBeforeIndex))
  );
}
function nT(t) {
  return (t.flags & 8) !== 0;
}
function rT(t) {
  return (t.flags & 16) !== 0;
}
function xy(t) {
  return t !== Ai;
}
function ic(t) {
  return t & 32767;
}
function iT(t) {
  return t >> 16;
}
function sc(t, e) {
  let n = iT(t),
    r = e;
  for (; n > 0; ) (r = r[Ks]), n--;
  return r;
}
var dd = !0;
function ag(t) {
  let e = dd;
  return (dd = t), e;
}
var sT = 256,
  Ry = sT - 1,
  Oy = 5,
  oT = 0,
  yn = {};
function aT(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Ts) && (r = n[Ts]),
    r == null && (r = n[Ts] = oT++);
  let i = r & Ry,
    s = 1 << i;
  e.data[t + (i >> Oy)] |= s;
}
function ky(t, e) {
  let n = Ly(t, e);
  if (n !== -1) return n;
  let r = e[ve];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    $u(r.data, t),
    $u(e, null),
    $u(r.blueprint, null));
  let i = hf(t, e),
    s = t.injectorIndex;
  if (xy(i)) {
    let o = ic(i),
      a = sc(i, e),
      c = a[ve].data;
    for (let l = 0; l < 8; l++) e[s + l] = a[o + l] | c[o + l];
  }
  return (e[s + 8] = i), s;
}
function $u(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Ly(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function hf(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = Hy(i)), r === null)) return Ai;
    if ((n++, (i = i[Ks]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Ai;
}
function cT(t, e, n) {
  aT(t, e, n);
}
function Py(t, e, n) {
  if (n & we.Optional || t !== void 0) return t;
  Wd(e, "NodeInjector");
}
function Fy(t, e, n, r) {
  if (
    (n & we.Optional && r === void 0 && (r = null), !(n & (we.Self | we.Host)))
  ) {
    let i = t[Ri],
      s = zt(void 0);
    try {
      return i ? i.get(e, r, n & we.Optional) : $g(e, r, n & we.Optional);
    } finally {
      zt(s);
    }
  }
  return Py(r, e, n);
}
function jy(t, e, n, r = we.Default, i) {
  if (t !== null) {
    if (e[de] & 2048 && !(r & we.Self)) {
      let o = hT(t, e, n, r, yn);
      if (o !== yn) return o;
    }
    let s = By(t, e, n, r, yn);
    if (s !== yn) return s;
  }
  return Fy(e, n, r, i);
}
function By(t, e, n, r, i) {
  let s = dT(n);
  if (typeof s == "function") {
    if (!_y(e, t, r)) return r & we.Host ? Py(i, n, r) : Fy(e, n, r, i);
    try {
      let o;
      if (((o = s(r)), o == null && !(r & we.Optional))) Wd(n);
      else return o;
    } finally {
      Iy();
    }
  } else if (typeof s == "number") {
    let o = null,
      a = Ly(t, e),
      c = Ai,
      l = r & we.Host ? e[xt][an] : null;
    for (
      (a === -1 || r & we.SkipSelf) &&
      ((c = a === -1 ? hf(t, e) : e[a + 8]),
      c === Ai || !lg(r, !1)
        ? (a = -1)
        : ((o = e[ve]), (a = ic(c)), (e = sc(c, e))));
      a !== -1;

    ) {
      let u = e[ve];
      if (cg(s, a, u.data)) {
        let d = lT(a, e, n, o, r, l);
        if (d !== yn) return d;
      }
      (c = e[a + 8]),
        c !== Ai && lg(r, e[ve].data[a + 8] === l) && cg(s, a, e)
          ? ((o = u), (a = ic(c)), (e = sc(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function lT(t, e, n, r, i, s) {
  let o = e[ve],
    a = o.data[t + 8],
    c = r == null ? Bi(a) && dd : r != o && (a.type & 3) !== 0,
    l = i & we.Host && s === a,
    u = uT(a, o, n, c, l);
  return u !== null ? Fs(e, o, u, a) : yn;
}
function uT(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    a = s & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = s >> 20,
    d = r ? a : a + u,
    g = i ? a + u : l;
  for (let b = d; b < g; b++) {
    let I = o[b];
    if ((b < c && n === I) || (b >= c && I.type === n)) return b;
  }
  if (i) {
    let b = o[c];
    if (b && Ys(b) && b.type === n) return c;
  }
  return null;
}
function Fs(t, e, n, r) {
  let i = t[n],
    s = e.data;
  if (eT(i)) {
    let o = i;
    o.resolving && LD(kD(s[n]));
    let a = ag(o.canSeeViewProviders);
    o.resolving = !0;
    let c,
      l = o.injectImpl ? zt(o.injectImpl) : null,
      u = _y(t, r, we.Default);
    try {
      (i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && X_(n, s[n], e);
    } finally {
      l !== null && zt(l), ag(a), (o.resolving = !1), Iy();
    }
  }
  return i;
}
function dT(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Ts) ? t[Ts] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Ry : fT) : e;
}
function cg(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> Oy)] & r);
}
function lg(t, e) {
  return !(t & we.Self) && !(t & we.Host && e);
}
var Vr = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return jy(this._tNode, this._lView, e, Sc(r), n);
  }
};
function fT() {
  return new Vr(cn(), We());
}
function pf(t) {
  return zs(() => {
    let e = t.prototype.constructor,
      n = e[Za] || fd(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let s = i[Za] || fd(i);
      if (s && s !== n) return s;
      i = Object.getPrototypeOf(i);
    }
    return (s) => new s();
  });
}
function fd(t) {
  return jg(t)
    ? () => {
        let e = fd(Gt(t));
        return e && e();
      }
    : xi(t);
}
function hT(t, e, n, r, i) {
  let s = t,
    o = e;
  for (; s !== null && o !== null && o[de] & 2048 && !(o[de] & 512); ) {
    let a = By(s, o, n, r | we.Self, yn);
    if (a !== yn) return a;
    let c = s.parent;
    if (!c) {
      let l = o[cy];
      if (l) {
        let u = l.get(n, yn, r);
        if (u !== yn) return u;
      }
      (c = Hy(o)), (o = o[Ks]);
    }
    s = c;
  }
  return i;
}
function Hy(t) {
  let e = t[ve],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[an] : null;
}
function ug(t, e = null, n = null, r) {
  let i = Uy(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function Uy(t, e = null, n = null, r, i = new Set()) {
  let s = [n || Wt, u_(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : St(t))),
    new As(s, e || Jd(), r || null, i)
  );
}
var Pt = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return ug({ name: "" }, i, r, "");
      {
        let s = r.name ?? "";
        return ug({ name: s }, r.parent, r.providers, s);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Ns),
    (e.NULL = new ec()),
    (e.ɵprov = J({ token: e, providedIn: "any", factory: () => X(Wg) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var pT = "ngOriginalError";
function zu(t) {
  return t[pT];
}
var En = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && zu(e);
      for (; n && zu(n); ) n = zu(n);
      return n || null;
    }
  },
  Vy = new ie("", {
    providedIn: "root",
    factory: () => q(En).handleError.bind(void 0),
  }),
  mf = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = mT), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  hd = class extends mf {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return vy(this._lView, e), () => L_(this._lView, e);
    }
  };
function mT() {
  return new hd(We());
}
function gT() {
  return Ac(cn(), We());
}
function Ac(t, e) {
  return new Js(Lt(t, e));
}
var Js = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = gT;
  let t = e;
  return t;
})();
var pd = class extends dt {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      ay() && (this.destroyRef = q(mf, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let n = Oe(null);
    try {
      super.next(e);
    } finally {
      Oe(n);
    }
  }
  subscribe(e, n, r) {
    let i = e,
      s = n || (() => null),
      o = r;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (s = c.error?.bind(c)), (o = c.complete?.bind(c));
    }
    this.__isAsync && ((s = Gu(s)), i && (i = Gu(i)), o && (o = Gu(o)));
    let a = super.subscribe({ next: i, error: s, complete: o });
    return e instanceof nt && e.add(a), a;
  }
};
function Gu(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var vt = pd;
var js = "ngSkipHydration",
  yT = "ngskiphydration";
function qy(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let n = 0; n < e.length; n += 2) {
    let r = e[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === yT) return !0;
  }
  return !1;
}
function $y(t) {
  return t.hasAttribute(js);
}
function oc(t) {
  return (t.flags & 128) === 128;
}
function ac(t) {
  if (oc(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if (oc(t) || qy(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var zy = new Map(),
  vT = 0;
function ET() {
  return vT++;
}
function bT(t) {
  zy.set(t[Nc], t);
}
function wT(t) {
  zy.delete(t[Nc]);
}
var dg = "__ngContext__";
function Gr(t, e) {
  Bn(e) ? ((t[dg] = e[Nc]), bT(e)) : (t[dg] = e);
}
function Gy(t) {
  return Qy(t[Rs]);
}
function Wy(t) {
  return Qy(t[tn]);
}
function Qy(t) {
  for (; t !== null && !kt(t); ) t = t[tn];
  return t;
}
var md;
function gf(t) {
  md = t;
}
function xc() {
  if (md !== void 0) return md;
  if (typeof document < "u") return document;
  throw new G(210, !1);
}
var Zr = new ie("", { providedIn: "root", factory: () => DT }),
  DT = "ng",
  Rc = new ie(""),
  Ft = new ie("", { providedIn: "platform", factory: () => "unknown" });
var yf = new ie(""),
  vf = new ie("", {
    providedIn: "root",
    factory: () =>
      xc().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function _T() {
  let t = new Dn();
  return q(Ft) === "browser" && (t.store = TT(xc(), q(Zr))), t;
}
var Dn = (() => {
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
  e.ɵprov = J({ token: e, providedIn: "root", factory: _T });
  let t = e;
  return t;
})();
function TT(t, e) {
  let n = t.getElementById(e + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + e, r);
    }
  return {};
}
var Ef = "h",
  bf = "b",
  Bs = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(Bs || {}),
  gd = "e",
  yd = "t",
  Hs = "c",
  cc = "x",
  ki = "r",
  vd = "i",
  Ed = "n",
  Qa = "d",
  ST = "__nghData__",
  wf = ST,
  Ss = "ngh",
  Df = "nghm",
  Ky = () => null;
function CT(t, e, n = !1) {
  let r = t.getAttribute(Ss);
  if (r == null) return null;
  let [i, s] = r.split("|");
  if (((r = n ? s : i), !r)) return null;
  let o = s ? `|${s}` : "",
    a = n ? i : o,
    c = {};
  if (r !== "") {
    let u = e.get(Dn, null, { optional: !0 });
    u !== null && (c = u.get(wf, [])[Number(r)]);
  }
  let l = { data: c, firstChild: t.firstChild ?? null };
  return (
    n && ((l.firstChild = t), Oc(l, 0, t.nextSibling)),
    a ? t.setAttribute(Ss, a) : t.removeAttribute(Ss),
    l
  );
}
function IT() {
  Ky = CT;
}
function _f(t, e, n = !1) {
  return Ky(t, e, n);
}
function Yy(t) {
  let e = t._lView;
  return e[ve].type === 2 ? null : (rf(e) && (e = e[st]), e);
}
function NT(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function MT(t) {
  let e = xc(),
    n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(s) {
        let o = NT(s);
        return o === "ngetn" || o === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    i = [];
  for (; (r = n.nextNode()); ) i.push(r);
  for (let s of i)
    s.textContent === "ngetn"
      ? s.replaceWith(e.createTextNode(""))
      : s.remove();
}
function Oc(t, e, n) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = n);
}
function bd(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function AT(t, e) {
  let n = t.data,
    r = n[gd]?.[e] ?? null;
  return r === null && n[Hs]?.[e] && (r = Tf(t, e)), r;
}
function Zy(t, e) {
  return t.data[Hs]?.[e] ?? null;
}
function Tf(t, e) {
  let n = Zy(t, e) ?? [],
    r = 0;
  for (let i of n) r += i[ki] * (i[cc] ?? 1);
  return r;
}
function kc(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let n = t.data[Qa];
    t.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var Ci = new ie(""),
  Xy = !1,
  Jy = new ie("", { providedIn: "root", factory: () => Xy }),
  xT = new ie("");
var lc = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Lg})`;
  }
};
function Lc(t) {
  return t instanceof lc ? t.changingThisBreaksApplicationSecurity : t;
}
function ev(t, e) {
  let n = RT(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${Lg})`);
  }
  return n === e;
}
function RT(t) {
  return (t instanceof lc && t.getTypeName()) || null;
}
var OT = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function tv(t) {
  return (t = String(t)), t.match(OT) ? t : "unsafe:" + t;
}
var Sf = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Sf || {});
function DF(t) {
  let e = kT();
  return e ? e.sanitize(Sf.URL, t) || "" : ev(t, "URL") ? Lc(t) : tv(Gs(t));
}
function kT() {
  let t = We();
  return t && t[sn].sanitizer;
}
var LT = /^>|^->|<!--|-->|--!>|<!-$/g,
  PT = /(<|>)/g,
  FT = "\u200B$1\u200B";
function jT(t) {
  return t.replace(LT, (e) => e.replace(PT, FT));
}
function BT(t) {
  return t.ownerDocument.body;
}
function nv(t) {
  return t instanceof Function ? t() : t;
}
function _s(t) {
  return (t ?? q(Pt)).get(Ft) === "browser";
}
var qn = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(qn || {}),
  HT;
function Cf(t, e) {
  return HT(t, e);
}
function Ii(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1;
    kt(r) ? (s = r) : Bn(r) && ((o = !0), (r = r[Xe]));
    let a = it(r);
    t === 0 && n !== null
      ? i == null
        ? av(e, n, a)
        : uc(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? uc(e, n, a, i || null, !0)
      : t === 2
      ? xf(e, a, o)
      : t === 3 && e.destroyNode(a),
      s != null && nS(e, t, s, n, i);
  }
}
function If(t, e) {
  return t.createText(e);
}
function UT(t, e, n) {
  t.setValue(e, n);
}
function Nf(t, e) {
  return t.createComment(jT(e));
}
function Pc(t, e, n) {
  return t.createElement(e, n);
}
function VT(t, e) {
  rv(t, e), (e[Xe] = null), (e[an] = null);
}
function qT(t, e, n, r, i, s) {
  (r[Xe] = i), (r[an] = e), Fc(t, r, n, 1, i, s);
}
function rv(t, e) {
  e[sn].changeDetectionScheduler?.notify(1), Fc(t, e, e[Ve], 2, null, null);
}
function $T(t) {
  let e = t[Rs];
  if (!e) return Wu(t[ve], t);
  for (; e; ) {
    let n = null;
    if (Bn(e)) n = e[Rs];
    else {
      let r = e[Ct];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[tn] && e !== t; ) Bn(e) && Wu(e[ve], e), (e = e[ct]);
      e === null && (e = t), Bn(e) && Wu(e[ve], e), (n = e && e[tn]);
    }
    e = n;
  }
}
function zT(t, e, n, r) {
  let i = Ct + r,
    s = n.length;
  r > 0 && (n[i - 1][tn] = e),
    r < s - Ct
      ? ((e[tn] = n[i]), Gg(n, Ct + r, e))
      : (n.push(e), (e[tn] = null)),
    (e[ct] = n);
  let o = e[Ic];
  o !== null && n !== o && GT(o, e);
  let a = e[Oi];
  a !== null && a.insertView(t), ld(e), (e[de] |= 128);
}
function GT(t, e) {
  let n = t[nc],
    i = e[ct][ct][xt];
  e[xt] !== i && (t[de] |= tf.HasTransplantedViews),
    n === null ? (t[nc] = [e]) : n.push(e);
}
function iv(t, e) {
  let n = t[nc],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function wd(t, e) {
  if (t.length <= Ct) return;
  let n = Ct + e,
    r = t[n];
  if (r) {
    let i = r[Ic];
    i !== null && i !== t && iv(i, r), e > 0 && (t[n - 1][tn] = r[tn]);
    let s = Ja(t, Ct + e);
    VT(r[ve], r);
    let o = s[Oi];
    o !== null && o.detachView(s[ve]),
      (r[ct] = null),
      (r[tn] = null),
      (r[de] &= -129);
  }
  return r;
}
function sv(t, e) {
  if (!(e[de] & 256)) {
    let n = e[Ve];
    n.destroyNode && Fc(t, e, n, 3, null, null), $T(e);
  }
}
function Wu(t, e) {
  if (e[de] & 256) return;
  let n = Oe(null);
  try {
    (e[de] &= -129),
      (e[de] |= 256),
      e[$r] && vm(e[$r]),
      QT(t, e),
      WT(t, e),
      e[ve].type === 1 && e[Ve].destroy();
    let r = e[Ic];
    if (r !== null && kt(e[ct])) {
      r !== e[ct] && iv(r, e);
      let i = e[Oi];
      i !== null && i.detachView(t);
    }
    wT(e);
  } finally {
    Oe(n);
  }
}
function WT(t, e) {
  let n = t.cleanup,
    r = e[xs];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let o = n[s + 3];
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2);
      } else {
        let o = r[n[s + 1]];
        n[s].call(o);
      }
  r !== null && (e[xs] = null);
  let i = e[hr];
  if (i !== null) {
    e[hr] = null;
    for (let s = 0; s < i.length; s++) {
      let o = i[s];
      o();
    }
  }
}
function QT(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof Ps)) {
        let s = n[r + 1];
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1];
            gn(4, a, c);
            try {
              c.call(a);
            } finally {
              gn(5, a, c);
            }
          }
        else {
          gn(4, i, s);
          try {
            s.call(i);
          } finally {
            gn(5, i, s);
          }
        }
      }
    }
}
function ov(t, e, n) {
  return KT(t, e.parent, n);
}
function KT(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[Xe];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i];
      if (s === nn.None || s === nn.Emulated) return null;
    }
    return Lt(r, n);
  }
}
function uc(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function av(t, e, n) {
  t.appendChild(e, n);
}
function fg(t, e, n, r, i) {
  r !== null ? uc(t, e, n, r, i) : av(t, e, n);
}
function YT(t, e, n, r) {
  t.removeChild(e, n, r);
}
function Mf(t, e) {
  return t.parentNode(e);
}
function ZT(t, e) {
  return t.nextSibling(e);
}
function XT(t, e, n) {
  return eS(t, e, n);
}
function JT(t, e, n) {
  return t.type & 40 ? Lt(t, n) : null;
}
var eS = JT,
  hg;
function Af(t, e, n, r) {
  let i = ov(t, r, e),
    s = e[Ve],
    o = r.parent || e[an],
    a = XT(o, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) fg(s, i, n[c], a, !1);
    else fg(s, i, n, a, !1);
  hg !== void 0 && hg(s, r, e, n, i);
}
function Cs(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return Lt(e, t);
    if (n & 4) return Dd(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return Cs(t, r);
      {
        let i = t[e.index];
        return kt(i) ? Dd(-1, i) : it(i);
      }
    } else {
      if (n & 32) return Cf(e, t)() || it(t[e.index]);
      {
        let r = cv(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Ls(t[xt]);
          return Cs(i, r);
        } else return Cs(t, e.next);
      }
    }
  }
  return null;
}
function cv(t, e) {
  if (e !== null) {
    let r = t[xt][an],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function Dd(t, e) {
  let n = Ct + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[ve].firstChild;
    if (i !== null) return Cs(r, i);
  }
  return e[Vn];
}
function xf(t, e, n) {
  let r = Mf(t, e);
  r && YT(t, r, e, n);
}
function lv(t) {
  t.textContent = "";
}
function Rf(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (o && e === 0 && (a && Gr(it(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) Rf(t, e, n.child, r, i, s, !1), Ii(e, t, i, a, s);
      else if (c & 32) {
        let l = Cf(n, r),
          u;
        for (; (u = l()); ) Ii(e, t, i, u, s);
        Ii(e, t, i, a, s);
      } else c & 16 ? tS(t, e, r, n, i, s) : Ii(e, t, i, a, s);
    n = o ? n.projectionNext : n.next;
  }
}
function Fc(t, e, n, r, i, s) {
  Rf(n, r, t.firstChild, e, i, s, !1);
}
function tS(t, e, n, r, i, s) {
  let o = n[xt],
    c = o[an].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ii(e, t, i, u, s);
    }
  else {
    let l = c,
      u = o[ct];
    oc(r) && (l.flags |= 128), Rf(t, e, l, u, i, s, !0);
  }
}
function nS(t, e, n, r, i) {
  let s = n[Vn],
    o = it(n);
  s !== o && Ii(e, t, r, s, i);
  for (let a = Ct; a < n.length; a++) {
    let c = n[a];
    Fc(c[ve], c, t, e, r, s);
  }
}
function rS(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let s = r.indexOf("-") === -1 ? void 0 : qn.DashCase;
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (s |= qn.Important)),
        t.setStyle(n, r, i, s));
  }
}
function iS(t, e, n) {
  t.setAttribute(e, "style", n);
}
function uv(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function dv(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n;
  r !== null && rd(t, e, r),
    i !== null && uv(t, e, i),
    s !== null && iS(t, e, s);
}
var gr = {};
function _F(t = 1) {
  fv(bn(), We(), Hi() + t, !1);
}
function fv(t, e, n, r) {
  if (!r)
    if ((e[de] & 3) === 3) {
      let s = t.preOrderCheckHooks;
      s !== null && Ga(e, s, n);
    } else {
      let s = t.preOrderHooks;
      s !== null && Wa(e, s, 0, n);
    }
  zr(n);
}
function yr(t, e = we.Default) {
  let n = We();
  if (n === null) return X(t, e);
  let r = cn();
  return jy(r, n, Gt(t), e);
}
function hv() {
  let t = "invalid";
  throw new Error(t);
}
function pv(t, e, n, r, i, s) {
  let o = Oe(null);
  try {
    let a = null;
    i & Hn.SignalBased && (a = e[r][pm]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & Hn.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : uy(e, a, r, s);
  } finally {
    Oe(o);
  }
}
function sS(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) zr(~i);
        else {
          let s = i,
            o = n[++r],
            a = n[++r];
          Q_(o, s);
          let c = e[s];
          a(2, c);
        }
      }
    } finally {
      zr(-1);
    }
}
function jc(t, e, n, r, i, s, o, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[Xe] = i),
    (d[de] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[de] & 2048)) && (d[de] |= 2048),
    yy(d),
    (d[ct] = d[Ks] = t),
    (d[vn] = n),
    (d[sn] = o || (t && t[sn])),
    (d[Ve] = a || (t && t[Ve])),
    (d[Ri] = c || (t && t[Ri]) || null),
    (d[an] = s),
    (d[Nc] = ET()),
    (d[rn] = u),
    (d[cy] = l),
    (d[xt] = e.type == 2 ? t[xt] : d),
    d
  );
}
function Bc(t, e, n, r, i) {
  let s = t.data[e];
  if (s === null) (s = oS(t, e, n, r, i)), W_() && (s.flags |= 32);
  else if (s.type & 64) {
    (s.type = n), (s.value = r), (s.attrs = i);
    let o = V_();
    s.injectorIndex = o === null ? -1 : o.injectorIndex;
  }
  return Xs(s, !0), s;
}
function oS(t, e, n, r, i) {
  let s = by(),
    o = wy(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = fS(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  );
}
function mv(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function gv(t, e, n, r, i) {
  let s = Hi(),
    o = r & 2;
  try {
    zr(-1), o && e.length > st && fv(t, e, st, !1), gn(o ? 2 : 0, i), n(r, i);
  } finally {
    zr(s), gn(o ? 3 : 1, i);
  }
}
function yv(t, e, n) {
  if (ly(e)) {
    let r = Oe(null);
    try {
      let i = e.directiveStart,
        s = e.directiveEnd;
      for (let o = i; o < s; o++) {
        let a = t.data[o];
        if (a.contentQueries) {
          let c = n[o];
          a.contentQueries(1, c, o);
        }
      }
    } finally {
      Oe(r);
    }
  }
}
function vv(t, e, n) {
  Ey() && (vS(t, e, n, Lt(n, e)), (n.flags & 64) === 64 && Sv(t, e, n));
}
function Ev(t, e, n = Lt) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        a = o === -1 ? n(e, t) : t[o];
      t[i++] = a;
    }
  }
}
function bv(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Of(
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
function Of(t, e, n, r, i, s, o, a, c, l, u) {
  let d = st + r,
    g = d + i,
    b = aS(d, g),
    I = typeof l == "function" ? l() : l;
  return (b[ve] = {
    type: t,
    blueprint: b,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: b.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: g,
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
    directiveRegistry: typeof s == "function" ? s() : s,
    pipeRegistry: typeof o == "function" ? o() : o,
    firstChild: null,
    schemas: c,
    consts: I,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function aS(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : gr);
  return n;
}
function cS(t, e, n, r) {
  let s = r.get(Jy, Xy) || n === nn.ShadowDom,
    o = t.selectRootElement(e, s);
  return lS(o), o;
}
function lS(t) {
  wv(t);
}
var wv = () => null;
function uS(t) {
  $y(t) ? lv(t) : MT(t);
}
function dS() {
  wv = uS;
}
function fS(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Zs() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: o,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: s,
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
function pg(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue;
    let o = e[s];
    if (o === void 0) continue;
    r ??= {};
    let a,
      c = Hn.None;
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o);
    let l = s;
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue;
      l = i[s];
    }
    t === 0 ? mg(r, n, l, a, c) : mg(r, n, l, a);
  }
  return r;
}
function mg(t, e, n, r, i) {
  let s;
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i);
}
function hS(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    s = t.data,
    o = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = s[u],
      g = n ? n.get(d) : null,
      b = g ? g.inputs : null,
      I = g ? g.outputs : null;
    (c = pg(0, d.inputs, u, c, b)), (l = pg(1, d.outputs, u, l, I));
    let M = c !== null && o !== null && !Zd(e) ? MS(c, u, o) : null;
    a.push(M);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function pS(t) {
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
function Dv(t, e, n, r, i, s, o, a) {
  let c = Lt(e, n),
    l = e.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (kf(t, n, u, r, i), Bi(e) && mS(n, e.index))
    : e.type & 3
    ? ((r = pS(r)),
      (i = o != null ? o(i, e.value || "", r) : i),
      s.setProperty(c, r, i))
    : e.type & 12;
}
function mS(t, e) {
  let n = mr(e, t);
  n[de] & 16 || (n[de] |= 64);
}
function _v(t, e, n, r) {
  if (Ey()) {
    let i = r === null ? null : { "": -1 },
      s = bS(t, n),
      o,
      a;
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && Tv(t, e, n, o, i, a),
      i && wS(n, r, i);
  }
  n.mergedAttrs = Yd(n.mergedAttrs, n.attrs);
}
function Tv(t, e, n, r, i, s) {
  for (let l = 0; l < r.length; l++) cT(ky(n, e), t, r[l].type);
  _S(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let o = !1,
    a = !1,
    c = mv(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = Yd(n.mergedAttrs, u.hostAttrs)),
      TS(t, n, e, c, u),
      DS(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !o &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (o = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  hS(t, n, s);
}
function gS(t, e, n, r, i) {
  let s = i.hostBindings;
  if (s) {
    let o = t.hostBindingOpCodes;
    o === null && (o = t.hostBindingOpCodes = []);
    let a = ~e.index;
    yS(o) != a && o.push(a), o.push(n, r, s);
  }
}
function yS(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function vS(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd;
  Bi(n) && SS(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || ky(n, e),
    Gr(r, e);
  let o = n.initialInputs;
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      l = Fs(e, t, a, n);
    if ((Gr(l, e), o !== null && NS(e, a - i, l, c, n, o), Ys(c))) {
      let u = mr(n.index, e);
      u[vn] = Fs(e, t, a, n);
    }
  }
}
function Sv(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = K_();
  try {
    zr(s);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      ud(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          ES(c, l);
    }
  } finally {
    zr(-1), ud(o);
  }
}
function ES(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function bS(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s];
      if (t_(e, o.selectors, !1))
        if ((r || (r = []), Ys(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o);
            let c = a.length;
            _d(t, e, c);
          } else r.unshift(o), _d(t, e, 0);
        else
          (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o);
    }
  return r === null ? null : [r, i];
}
function _d(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function wS(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]];
      if (s == null) throw new G(-301, !1);
      r.push(e[i], s);
    }
  }
}
function DS(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    Ys(e) && (n[""] = t);
  }
}
function _S(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function TS(t, e, n, r, i) {
  t.data[r] = i;
  let s = i.factory || (i.factory = xi(i.type, !0)),
    o = new Ps(s, Ys(i), yr);
  (t.blueprint[r] = o), (n[r] = o), gS(t, e, r, mv(t, n, i.hostVars, gr), i);
}
function SS(t, e, n) {
  let r = Lt(e, t),
    i = bv(n),
    s = t[sn].rendererFactory,
    o = 16;
  n.signals ? (o = 4096) : n.onPush && (o = 64);
  let a = Hc(
    t,
    jc(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function CS(t, e, n, r, i, s) {
  let o = Lt(t, e);
  IS(e[Ve], o, s, t.value, n, r, i);
}
function IS(t, e, n, r, i, s, o) {
  if (s == null) t.removeAttribute(e, i, n);
  else {
    let a = o == null ? Gs(s) : o(s, r || "", i);
    t.setAttribute(e, i, a, n);
  }
}
function NS(t, e, n, r, i, s) {
  let o = s[e];
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        l = o[a++],
        u = o[a++],
        d = o[a++];
      pv(r, n, c, l, u, d);
    }
}
function MS(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (s === 0) {
      i += 4;
      continue;
    } else if (s === 5) {
      i += 2;
      continue;
    }
    if (typeof s == "number") break;
    if (t.hasOwnProperty(s)) {
      r === null && (r = []);
      let o = t[s];
      for (let a = 0; a < o.length; a += 3)
        if (o[a] === e) {
          r.push(s, o[a + 1], o[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function Cv(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function Iv(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = Oe(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1];
        if (o !== -1) {
          let a = t.data[o];
          Dy(s), a.contentQueries(2, e[o], o);
        }
      }
    } finally {
      Oe(r);
    }
  }
}
function Hc(t, e) {
  return t[Rs] ? (t[ig][tn] = e) : (t[Rs] = e), (t[ig] = e), e;
}
function Td(t, e, n) {
  Dy(0);
  let r = Oe(null);
  try {
    e(t, n);
  } finally {
    Oe(r);
  }
}
function AS(t) {
  return t[xs] || (t[xs] = []);
}
function xS(t) {
  return t.cleanup || (t.cleanup = []);
}
function Nv(t, e) {
  let n = t[Ri],
    r = n ? n.get(En, null) : null;
  r && r.handleError(e);
}
function kf(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      l = e[o],
      u = t.data[o];
    pv(u, l, r, a, c, i);
  }
}
function RS(t, e, n) {
  let r = my(e, t);
  UT(t[Ve], r, n);
}
function OS(t, e) {
  let n = mr(e, t),
    r = n[ve];
  kS(r, n);
  let i = n[Xe];
  i !== null && n[rn] === null && (n[rn] = _f(i, n[Ri])), Lf(r, n, n[vn]);
}
function kS(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function Lf(t, e, n) {
  cf(e);
  try {
    let r = t.viewQuery;
    r !== null && Td(1, r, n);
    let i = t.template;
    i !== null && gv(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[Oi]?.finishViewCreation(t),
      t.staticContentQueries && Iv(t, e),
      t.staticViewQueries && Td(2, t.viewQuery, n);
    let s = t.components;
    s !== null && LS(e, s);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[de] &= -5), lf();
  }
}
function LS(t, e) {
  for (let n = 0; n < e.length; n++) OS(t, e[n]);
}
function PS(t, e, n, r) {
  let i = Oe(null);
  try {
    let s = e.tView,
      a = t[de] & 4096 ? 4096 : 16,
      c = jc(
        t,
        s,
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
    c[Ic] = l;
    let u = t[Oi];
    return u !== null && (c[Oi] = u.createEmbeddedView(s)), Lf(s, c, n), c;
  } finally {
    Oe(i);
  }
}
function gg(t, e) {
  return !e || e.firstChild === null || oc(t);
}
function FS(t, e, n, r = !0) {
  let i = e[ve];
  if ((zT(i, e, t, n), r)) {
    let o = Dd(n, t),
      a = e[Ve],
      c = Mf(a, t[Vn]);
    c !== null && qT(i, t[an], a, e, c, o);
  }
  let s = e[rn];
  s !== null && s.firstChild !== null && (s.firstChild = null);
}
function Us(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index];
    s !== null && r.push(it(s)), kt(s) && Mv(s, r);
    let o = n.type;
    if (o & 8) Us(t, e, n.child, r);
    else if (o & 32) {
      let a = Cf(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (o & 16) {
      let a = cv(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Ls(e[xt]);
        Us(c[ve], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function Mv(t, e) {
  for (let n = Ct; n < t.length; n++) {
    let r = t[n],
      i = r[ve].firstChild;
    i !== null && Us(r[ve], r, i, e);
  }
  t[Vn] !== t[Xe] && e.push(t[Vn]);
}
var Av = [];
function jS(t) {
  return t[$r] ?? BS(t);
}
function BS(t) {
  let e = Av.pop() ?? Object.create(US);
  return (e.lView = t), e;
}
function HS(t) {
  t.lView[$r] !== t && ((t.lView = null), Av.push(t));
}
var US = et(Z({}, mm), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      ks(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[$r] = this;
    },
  }),
  xv = 100;
function Rv(t, e = !0, n = 0) {
  let r = t[sn],
    i = r.rendererFactory,
    s = !1;
  s || i.begin?.();
  try {
    VS(t, n);
  } catch (o) {
    throw (e && Nv(t, o), o);
  } finally {
    s || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function VS(t, e) {
  Sd(t, e);
  let n = 0;
  for (; of(t); ) {
    if (n === xv) throw new G(103, !1);
    n++, Sd(t, 1);
  }
}
function qS(t, e, n, r) {
  let i = e[de];
  if ((i & 256) === 256) return;
  let s = !1;
  !s && e[sn].inlineEffectRunner?.flush(), cf(e);
  let o = null,
    a = null;
  !s && $S(t) && ((a = jS(e)), (o = gm(a)));
  try {
    yy(e), z_(t.bindingStartIndex), n !== null && gv(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && Ga(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Wa(e, d, 0, null), qu(e, 0);
      }
    if ((zS(e), Ov(e, 0), t.contentQueries !== null && Iv(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && Ga(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Wa(e, d, 1), qu(e, 1);
      }
    sS(t, e);
    let l = t.components;
    l !== null && Lv(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && Td(2, u, r), !s))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && Ga(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Wa(e, d, 2), qu(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Vu])) {
      for (let d of e[Vu]) d();
      e[Vu] = null;
    }
    s || (e[de] &= -73);
  } catch (c) {
    throw (ks(e), c);
  } finally {
    a !== null && (ym(a, o), HS(a)), lf();
  }
}
function $S(t) {
  return t.type !== 2;
}
function Ov(t, e) {
  for (let n = Gy(t); n !== null; n = Wy(n))
    for (let r = Ct; r < n.length; r++) {
      let i = n[r];
      kv(i, e);
    }
}
function zS(t) {
  for (let e = Gy(t); e !== null; e = Wy(e)) {
    if (!(e[de] & tf.HasTransplantedViews)) continue;
    let n = e[nc];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[ct];
      k_(i);
    }
  }
}
function GS(t, e, n) {
  let r = mr(e, t);
  kv(r, n);
}
function kv(t, e) {
  sf(t) && Sd(t, e);
}
function Sd(t, e) {
  let r = t[ve],
    i = t[de],
    s = t[$r],
    o = !!(e === 0 && i & 16);
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && Du(s))),
    s && (s.dirty = !1),
    (t[de] &= -9217),
    o)
  )
    qS(r, t, r.template, t[vn]);
  else if (i & 8192) {
    Ov(t, 1);
    let a = r.components;
    a !== null && Lv(t, a, 1);
  }
}
function Lv(t, e, n) {
  for (let r = 0; r < e.length; r++) GS(t, e[r], n);
}
function Pf(t) {
  for (t[sn].changeDetectionScheduler?.notify(); t; ) {
    t[de] |= 64;
    let e = Ls(t);
    if (rf(t) && !e) return t;
    t = e;
  }
  return null;
}
var Wr = class {
    get rootNodes() {
      let e = this._lView,
        n = e[ve];
      return Us(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[vn];
    }
    set context(e) {
      this._lView[vn] = e;
    }
    get destroyed() {
      return (this._lView[de] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ct];
        if (kt(e)) {
          let n = e[tc],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (wd(e, r), Ja(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      sv(this._lView[ve], this._lView);
    }
    onDestroy(e) {
      vy(this._lView, e);
    }
    markForCheck() {
      Pf(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[de] &= -129;
    }
    reattach() {
      ld(this._lView), (this._lView[de] |= 128);
    }
    detectChanges() {
      (this._lView[de] |= 1024), Rv(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new G(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), rv(this._lView[ve], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new G(902, !1);
      (this._appRef = e), ld(this._lView);
    }
  },
  Ff = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = KS;
    let t = e;
    return t;
  })(),
  WS = Ff,
  QS = class extends WS {
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
      let i = PS(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new Wr(i);
    }
  };
function KS() {
  return YS(cn(), We());
}
function YS(t, e) {
  return t.type & 4 ? new QS(e, t, Ac(t, e)) : null;
}
var Cd = "<-- AT THIS LOCATION";
function ZS(t) {
  switch (t) {
    case 4:
      return "view container";
    case 2:
      return "element";
    case 8:
      return "ng-container";
    case 32:
      return "icu";
    case 64:
      return "i18n";
    case 16:
      return "projection";
    case 1:
      return "text";
    default:
      return "<unknown>";
  }
}
function XS(t, e) {
  let n = `During serialization, Angular was unable to find an element in the DOM:

`,
    r = `${rC(t, e, !1)}

`,
    i = sC();
  throw new G(-502, n + r + i);
}
function JS(t) {
  let e =
      "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n",
    n = `${iC(t)}

`,
    r = e + n + oC();
  return new G(-503, r);
}
function eC(t) {
  let e = [];
  if (t.attrs)
    for (let n = 0; n < t.attrs.length; ) {
      let r = t.attrs[n++];
      if (typeof r == "number") break;
      let i = t.attrs[n++];
      e.push(`${r}="${dc(i)}"`);
    }
  return e.join(" ");
}
var tC = new Set(["ngh", "ng-version", "ng-server-context"]);
function nC(t) {
  let e = [];
  for (let n = 0; n < t.attributes.length; n++) {
    let r = t.attributes[n];
    tC.has(r.name) || e.push(`${r.name}="${dc(r.value)}"`);
  }
  return e.join(" ");
}
function Qu(t, e = "\u2026") {
  switch (t.type) {
    case 1:
      return `#text${t.value ? `(${t.value})` : ""}`;
    case 2:
      let r = eC(t),
        i = t.value.toLowerCase();
      return `<${i}${r ? " " + r : ""}>${e}</${i}>`;
    case 8:
      return "<!-- ng-container -->";
    case 4:
      return "<!-- container -->";
    default:
      return `#node(${ZS(t.type)})`;
  }
}
function Ka(t, e = "\u2026") {
  let n = t;
  switch (n.nodeType) {
    case Node.ELEMENT_NODE:
      let r = n.tagName.toLowerCase(),
        i = nC(n);
      return `<${r}${i ? " " + i : ""}>${e}</${r}>`;
    case Node.TEXT_NODE:
      let s = n.textContent ? dc(n.textContent) : "";
      return `#text${s ? `(${s})` : ""}`;
    case Node.COMMENT_NODE:
      return `<!-- ${dc(n.textContent ?? "")} -->`;
    default:
      return `#node(${n.nodeType})`;
  }
}
function rC(t, e, n) {
  let r = "  ",
    i = "";
  e.prev
    ? ((i +=
        r +
        `\u2026
`),
      (i +=
        r +
        Qu(e.prev) +
        `
`))
    : e.type &&
      e.type & 12 &&
      (i +=
        r +
        `\u2026
`),
    n
      ? ((i +=
          r +
          Qu(e) +
          `
`),
        (i +=
          r +
          `<!-- container -->  ${Cd}
`))
      : (i +=
          r +
          Qu(e) +
          `  ${Cd}
`),
    (i +=
      r +
      `\u2026
`);
  let s = e.type ? ov(t[ve], e, t) : null;
  return (
    s &&
      (i = Ka(
        s,
        `
` + i
      )),
    i
  );
}
function iC(t) {
  let e = "  ",
    n = "",
    r = t;
  return (
    r.previousSibling &&
      ((n +=
        e +
        `\u2026
`),
      (n +=
        e +
        Ka(r.previousSibling) +
        `
`)),
    (n +=
      e +
      Ka(r) +
      `  ${Cd}
`),
    t.nextSibling &&
      (n +=
        e +
        `\u2026
`),
    t.parentNode &&
      (n = Ka(
        r.parentNode,
        `
` + n
      )),
    n
  );
}
function sC(t) {
  return `To fix this problem:
  * check ${
    t ? `the "${t}"` : "corresponding"
  } component for hydration-related issues
  * check to see if your template has valid HTML structure
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function oC() {
  return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function aC(t) {
  return t.replace(/\s+/gm, "");
}
function dc(t, e = 50) {
  return t
    ? ((t = aC(t)), t.length > e ? `${t.substring(0, e - 1)}\u2026` : t)
    : "";
}
function Pv(t) {
  let e = t[Os] ?? [],
    r = t[ct][Ve];
  for (let i of e) cC(i, r);
  t[Os] = Wt;
}
function cC(t, e) {
  let n = 0,
    r = t.firstChild;
  if (r) {
    let i = t.data[ki];
    for (; n < i; ) {
      let s = r.nextSibling;
      xf(e, r, !1), (r = s), n++;
    }
  }
}
function Fv(t) {
  Pv(t);
  for (let e = Ct; e < t.length; e++) fc(t[e]);
}
function lC(t) {
  let e = t[rn]?.i18nNodes;
  if (e) {
    let n = t[Ve];
    for (let r of e.values()) xf(n, r, !1);
    t[rn].i18nNodes = void 0;
  }
}
function fc(t) {
  lC(t);
  let e = t[ve];
  for (let n = st; n < e.bindingStartIndex; n++)
    if (kt(t[n])) {
      let r = t[n];
      Fv(r);
    } else Bn(t[n]) && fc(t[n]);
}
function uC(t) {
  let e = t._views;
  for (let n of e) {
    let r = Yy(n);
    if (r !== null && r[Xe] !== null)
      if (Bn(r)) fc(r);
      else {
        let i = r[Xe];
        fc(i), Fv(r);
      }
  }
}
var dC = new RegExp(`^(\\d+)*(${bf}|${Ef})*(.*)`);
function fC(t, e) {
  let n = [t];
  for (let r of e) {
    let i = n.length - 1;
    if (i > 0 && n[i - 1] === r) {
      let s = n[i] || 1;
      n[i] = s + 1;
    } else n.push(r, "");
  }
  return n.join("");
}
function hC(t) {
  let e = t.match(dC),
    [n, r, i, s] = e,
    o = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of s.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [o, ...a];
}
function pC(t) {
  return !t.prev && t.parent?.type === 8;
}
function Ku(t) {
  return t.index - st;
}
function Vs(t, e) {
  return !(t.type & 16) && !!e[t.index] && !it(e[t.index])?.isConnected;
}
function mC(t, e) {
  let n = t.i18nNodes;
  if (n) {
    let r = n.get(e);
    return r && n.delete(e), r;
  }
  return null;
}
function Uc(t, e, n, r) {
  let i = Ku(r),
    s = mC(t, i);
  if (!s) {
    let o = t.data[Ed];
    if (o?.[i]) s = yC(o[i], n);
    else if (e.firstChild === r) s = t.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (pC(r)) {
        let l = Ku(r.parent);
        s = bd(t, l);
      } else {
        let l = Lt(c, n);
        if (a) s = l.firstChild;
        else {
          let u = Ku(c),
            d = bd(t, u);
          if (c.type === 2 && d) {
            let b = Tf(t, u) + 1;
            s = Vc(b, d);
          } else s = l.nextSibling;
        }
      }
    }
  }
  return s;
}
function Vc(t, e) {
  let n = e;
  for (let r = 0; r < t; r++) n = n.nextSibling;
  return n;
}
function gC(t, e) {
  let n = t;
  for (let r = 0; r < e.length; r += 2) {
    let i = e[r],
      s = e[r + 1];
    for (let o = 0; o < s; o++)
      switch (i) {
        case Bs.FirstChild:
          n = n.firstChild;
          break;
        case Bs.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function yC(t, e) {
  let [n, ...r] = hC(t),
    i;
  if (n === Ef) i = e[xt][Xe];
  else if (n === bf) i = BT(e[xt][Xe]);
  else {
    let s = Number(n);
    i = it(e[s + st]);
  }
  return gC(i, r);
}
function Id(t, e) {
  if (t === e) return [];
  if (t.parentElement == null || e.parentElement == null) return null;
  if (t.parentElement === e.parentElement) return vC(t, e);
  {
    let n = e.parentElement,
      r = Id(t, n),
      i = Id(n.firstChild, e);
    return !r || !i ? null : [...r, Bs.FirstChild, ...i];
  }
}
function vC(t, e) {
  let n = [],
    r = null;
  for (r = t; r != null && r !== e; r = r.nextSibling) n.push(Bs.NextSibling);
  return r == null ? null : n;
}
function yg(t, e, n) {
  let r = Id(t, e);
  return r === null ? null : fC(n, r);
}
function EC(t, e) {
  let n = t.parent,
    r,
    i,
    s;
  for (; n !== null && Vs(n, e); ) n = n.parent;
  n === null || !(n.type & 3)
    ? ((r = s = Ef), (i = e[xt][Xe]))
    : ((r = n.index), (i = it(e[r])), (s = Gs(r - st)));
  let o = it(e[t.index]);
  if (t.type & 12) {
    let c = Cs(e, t);
    c && (o = c);
  }
  let a = yg(i, o, s);
  if (a === null && i !== o) {
    let c = i.ownerDocument.body;
    if (((a = yg(c, o, bf)), a === null)) throw XS(e, t);
  }
  return a;
}
function bC(t, e) {
  let n = [];
  for (let r of e)
    for (let i = 0; i < (r[cc] ?? 1); i++) {
      let s = { data: r, firstChild: null };
      r[ki] > 0 && ((s.firstChild = t), (t = Vc(r[ki], t))), n.push(s);
    }
  return [t, n];
}
var jv = () => null;
function wC(t, e) {
  let n = t[Os];
  return !e || n === null || n.length === 0
    ? null
    : n[0].data[vd] === e
    ? n.shift()
    : (Pv(t), null);
}
function DC() {
  jv = wC;
}
function vg(t, e) {
  return jv(t, e);
}
var Li = class {},
  Nd = class {},
  hc = class {};
function _C(t) {
  let e = Error(`No component factory found for ${St(t)}.`);
  return (e[TC] = t), e;
}
var TC = "ngComponent";
var Md = class {
    resolveComponentFactory(e) {
      throw _C(e);
    }
  },
  qc = (() => {
    let e = class e {};
    e.NULL = new Md();
    let t = e;
    return t;
  })(),
  Qr = class {},
  Ui = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => SC();
    let t = e;
    return t;
  })();
function SC() {
  let t = We(),
    e = cn(),
    n = mr(e.index, t);
  return (Bn(n) ? n : t)[Ve];
}
var CC = (() => {
    let e = class e {};
    e.ɵprov = J({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Yu = {};
var Eg = new Set();
function vr(t) {
  Eg.has(t) ||
    (Eg.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function bg(...t) {}
function IC() {
  let t = typeof At.requestAnimationFrame == "function",
    e = At[t ? "requestAnimationFrame" : "setTimeout"],
    n = At[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var Be = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new vt(!1)),
        (this.onMicrotaskEmpty = new vt(!1)),
        (this.onStable = new vt(!1)),
        (this.onError = new vt(!1)),
        typeof Zone > "u")
      )
        throw new G(908, !1);
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
        (i.nativeRequestAnimationFrame = IC().nativeRequestAnimationFrame),
        AC(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new G(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new G(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask("NgZoneEvent: " + i, e, NC, bg, bg);
      try {
        return s.runTask(o, n, r);
      } finally {
        s.cancelTask(o);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  NC = {};
function jf(t) {
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
function MC(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      At,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Ad(t),
                (t.isCheckStableRunning = !0),
                jf(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Ad(t));
}
function AC(t) {
  let e = () => {
    MC(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (xC(a)) return n.invokeTask(i, s, o, a);
      try {
        return wg(t), n.invokeTask(i, s, o, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Dg(t);
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return wg(t), n.invoke(i, s, o, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Dg(t);
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == "microTask"
            ? ((t._hasPendingMicrotasks = s.microTask), Ad(t), jf(t))
            : s.change == "macroTask" &&
              (t.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  });
}
function Ad(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function wg(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Dg(t) {
  t._nesting--, jf(t);
}
var xd = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new vt()),
      (this.onMicrotaskEmpty = new vt()),
      (this.onStable = new vt()),
      (this.onError = new vt());
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
function xC(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function RC(t = "zone.js", e) {
  return t === "noop" ? new xd() : t === "zone.js" ? new Be(e) : t;
}
var Ni = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Ni || {}),
  OC = { destroy() {} };
function $c(t, e) {
  !e && w_($c);
  let n = e?.injector ?? q(Pt);
  if (!_s(n)) return OC;
  vr("NgAfterNextRender");
  let r = n.get(Bf),
    i = (r.handler ??= new Od()),
    s = e?.phase ?? Ni.MixedReadWrite,
    o = () => {
      i.unregister(c), a();
    },
    a = n.get(mf).onDestroy(o),
    c = on(
      n,
      () =>
        new Rd(s, () => {
          o(), t();
        })
    );
  return i.register(c), { destroy: o };
}
var Rd = class {
    constructor(e, n) {
      (this.phase = e),
        (this.callbackFn = n),
        (this.zone = q(Be)),
        (this.errorHandler = q(En, { optional: !0 })),
        q(Li, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  Od = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Ni.EarlyRead]: new Set(),
          [Ni.Write]: new Set(),
          [Ni.MixedReadWrite]: new Set(),
          [Ni.Read]: new Set(),
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
  Bf = (() => {
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
    e.ɵprov = J({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function kd(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      if (typeof a == "number") s = a;
      else if (s == 1) i = Qm(i, a);
      else if (s == 2) {
        let c = a,
          l = e[++o];
        r = Qm(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var pc = class extends qc {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = Un(e);
    return new Pi(n, this.ngModule);
  }
};
function _g(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function kC(t) {
  let e = t.toLowerCase();
  return e === "svg" ? M_ : e === "math" ? A_ : null;
}
var Ld = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = Sc(r);
      let i = this.injector.get(e, Yu, r);
      return i !== Yu || n === Yu ? i : this.parentInjector.get(e, n, r);
    }
  },
  Pi = class extends hc {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = _g(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return _g(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = s_(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      let s = Oe(null);
      try {
        i = i || this.ngModule;
        let o = i instanceof pt ? i : i?.injector;
        o &&
          this.componentDef.getStandaloneInjector !== null &&
          (o = this.componentDef.getStandaloneInjector(o) || o);
        let a = o ? new Ld(e, o) : e,
          c = a.get(Qr, null);
        if (c === null) throw new G(407, !1);
        let l = a.get(CC, null),
          u = a.get(Bf, null),
          d = a.get(Li, null),
          g = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: d,
          },
          b = c.createRenderer(null, this.componentDef),
          I = this.componentDef.selectors[0][0] || "div",
          M = r
            ? cS(b, r, this.componentDef.encapsulation, a)
            : Pc(b, I, kC(I)),
          F = 512;
        this.componentDef.signals
          ? (F |= 4096)
          : this.componentDef.onPush || (F |= 16);
        let R = null;
        M !== null && (R = _f(M, a, !0));
        let _ = Of(0, null, null, 1, 0, null, null, null, null, null, null),
          w = jc(null, _, null, F, null, null, g, b, a, null, R);
        cf(w);
        let T, E;
        try {
          let te = this.componentDef,
            re,
            pe = null;
          te.findHostDirectiveDefs
            ? ((re = []),
              (pe = new Map()),
              te.findHostDirectiveDefs(te, re, pe),
              re.push(te))
            : (re = [te]);
          let z = LC(w, M),
            O = PC(z, M, te, re, w, g, b);
          (E = gy(_, st)),
            M && BC(b, te, M, r),
            n !== void 0 && HC(E, this.ngContentSelectors, n),
            (T = jC(O, te, re, pe, w, [UC])),
            Lf(_, w, null);
        } finally {
          lf();
        }
        return new Pd(this.componentType, T, Ac(E, w), w, E);
      } finally {
        Oe(s);
      }
    }
  },
  Pd = class extends Nd {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Wr(i, void 0, !1)),
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
        let s = this._rootLView;
        kf(s[ve], s, i, e, n), this.previousInputValues.set(e, n);
        let o = mr(this._tNode.index, s);
        Pf(o);
      }
    }
    get injector() {
      return new Vr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function LC(t, e) {
  let n = t[ve],
    r = st;
  return (t[r] = e), Bc(n, r, 2, "#host", null);
}
function PC(t, e, n, r, i, s, o) {
  let a = i[ve];
  FC(r, t, e, o);
  let c = null;
  e !== null && (c = _f(e, i[Ri]));
  let l = s.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = jc(i, bv(n), null, u, i[t.index], t, s, l, null, null, c);
  return (
    a.firstCreatePass && _d(a, t, r.length - 1), Hc(i, d), (i[t.index] = d)
  );
}
function FC(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Yd(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (kd(e, e.mergedAttrs, !0), n !== null && dv(r, n, e));
}
function jC(t, e, n, r, i, s) {
  let o = cn(),
    a = i[ve],
    c = Lt(o, i);
  Tv(a, i, o, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = o.directiveStart + u,
      g = Fs(i, a, d, o);
    Gr(g, i);
  }
  Sv(a, i, o), c && Gr(c, i);
  let l = Fs(i, a, o.directiveStart + o.componentOffset, o);
  if (((t[vn] = i[vn] = l), s !== null)) for (let u of s) u(l, e);
  return yv(a, o, i), l;
}
function BC(t, e, n, r) {
  if (r) rd(t, n, ["ng-version", "17.3.11"]);
  else {
    let { attrs: i, classes: s } = o_(e.selectors[0]);
    i && rd(t, n, i), s && s.length > 0 && uv(t, n, s.join(" "));
  }
}
function HC(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let s = n[i];
    r.push(s != null ? Array.from(s) : null);
  }
}
function UC() {
  let t = cn();
  ff(We()[ve], t);
}
var eo = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = VC;
  let t = e;
  return t;
})();
function VC() {
  let t = cn();
  return $C(t, We());
}
var qC = eo,
  Bv = class extends qC {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Ac(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Vr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = hf(this._hostTNode, this._hostLView);
      if (xy(e)) {
        let n = sc(e, this._hostLView),
          r = ic(e),
          i = n[ve].data[r + 8];
        return new Vr(i, n);
      } else return new Vr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = Tg(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - Ct;
    }
    createEmbeddedView(e, n, r) {
      let i, s;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (s = r.injector));
      let o = vg(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, s, o);
      return this.insertImpl(a, i, gg(this._hostTNode, o)), a;
    }
    createComponent(e, n, r, i, s) {
      let o = e && !__(e),
        a;
      if (o) a = n;
      else {
        let I = n || {};
        (a = I.index),
          (r = I.injector),
          (i = I.projectableNodes),
          (s = I.environmentInjector || I.ngModuleRef);
      }
      let c = o ? e : new Pi(Un(e)),
        l = r || this.parentInjector;
      if (!s && c.ngModule == null) {
        let M = (o ? l : this.parentInjector).get(pt, null);
        M && (s = M);
      }
      let u = Un(c.componentType ?? {}),
        d = vg(this._lContainer, u?.id ?? null),
        g = d?.firstChild ?? null,
        b = c.create(l, i, g, s);
      return this.insertImpl(b.hostView, a, gg(this._hostTNode, d)), b;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (O_(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ct],
            l = new Bv(c, c[an], c[ct]);
          l.detach(l.indexOf(e));
        }
      }
      let s = this._adjustIndex(n),
        o = this._lContainer;
      return FS(o, i, s, r), e.attachToViewContainerRef(), Gg(Zu(o), s, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = Tg(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = wd(this._lContainer, n);
      r && (Ja(Zu(this._lContainer), n), sv(r[ve], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = wd(this._lContainer, n);
      return r && Ja(Zu(this._lContainer), n) != null ? new Wr(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function Tg(t) {
  return t[tc];
}
function Zu(t) {
  return t[tc] || (t[tc] = []);
}
function $C(t, e) {
  let n,
    r = e[t.index];
  return (
    kt(r) ? (n = r) : ((n = Cv(r, e, null, t)), (e[t.index] = n), Hc(e, n)),
    Hv(n, e, t, r),
    new Bv(n, t, e)
  );
}
function zC(t, e) {
  let n = t[Ve],
    r = n.createComment(""),
    i = Lt(e, t),
    s = Mf(n, i);
  return uc(n, s, r, ZT(n, i), !1), r;
}
var Hv = Uv,
  Hf = () => !1;
function GC(t, e, n) {
  return Hf(t, e, n);
}
function Uv(t, e, n, r) {
  if (t[Vn]) return;
  let i;
  n.type & 8 ? (i = it(r)) : (i = zC(e, n)), (t[Vn] = i);
}
function WC(t, e, n) {
  if (t[Vn] && t[Os]) return !0;
  let r = n[rn],
    i = e.index - st;
  if (!r || ac(e) || kc(r, i)) return !1;
  let o = bd(r, i),
    a = r.data[Hs]?.[i],
    [c, l] = bC(o, a);
  return (t[Vn] = c), (t[Os] = l), !0;
}
function QC(t, e, n, r) {
  Hf(t, n, e) || Uv(t, e, n, r);
}
function KC() {
  (Hv = QC), (Hf = WC);
}
function YC(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let s = n.get(i);
    if (!s) {
      let o = t(i);
      n.set(i, (s = o.then(eI)));
    }
    return s;
  }
  return (
    mc.forEach((i, s) => {
      let o = [];
      i.templateUrl &&
        o.push(
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
        i.styleUrls.forEach((d, g) => {
          a.push(""),
            o.push(
              r(d).then((b) => {
                (a[l + g] = b),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          o.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(o).then(() => tI(s));
      e.push(c);
    }),
    XC(),
    Promise.all(e).then(() => {})
  );
}
var mc = new Map(),
  ZC = new Set();
function XC() {
  let t = mc;
  return (mc = new Map()), t;
}
function JC() {
  return mc.size === 0;
}
function eI(t) {
  return typeof t == "string" ? t : t.text();
}
function tI(t) {
  ZC.delete(t);
}
var pr = class {},
  qs = class {};
var gc = class extends pr {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new pc(this));
      let i = ty(e);
      (this._bootstrapComponents = nv(i.bootstrap)),
        (this._r3Injector = Uy(
          e,
          n,
          [
            { provide: pr, useValue: this },
            { provide: qc, useValue: this.componentFactoryResolver },
            ...r,
          ],
          St(e),
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
  yc = class extends qs {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new gc(this.moduleType, e, []);
    }
  };
function nI(t, e, n) {
  return new gc(t, e, n);
}
var Fd = class extends pr {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new pc(this)),
      (this.instance = null);
    let n = new As(
      [
        ...e.providers,
        { provide: pr, useValue: this },
        { provide: qc, useValue: this.componentFactoryResolver },
      ],
      e.parent || Jd(),
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
function zc(t, e, n = null) {
  return new Fd({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Xr = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ft(!1));
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Vv(t) {
  return iI(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function rI(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function iI(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function sI(t, e, n) {
  return (t[e] = n);
}
function to(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function no(t) {
  return (t.flags & 32) === 32;
}
function oI(t, e, n, r, i, s, o, a, c) {
  let l = e.consts,
    u = Bc(e, t, 4, o || null, rc(l, a));
  _v(e, n, u, rc(l, c)), ff(e, u);
  let d = (u.tView = Of(
    2,
    u,
    r,
    i,
    s,
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
function aI(t, e, n, r, i, s, o, a) {
  let c = We(),
    l = bn(),
    u = t + st,
    d = l.firstCreatePass ? oI(u, l, c, e, n, r, i, s, o) : l.data[u];
  Xs(d, !1);
  let g = qv(l, c, d, t);
  df() && Af(l, c, g, d), Gr(g, c);
  let b = Cv(g, c, g, d);
  return (
    (c[u] = b),
    Hc(c, b),
    GC(b, d, c),
    nf(d) && vv(l, c, d),
    o != null && Ev(c, d, a),
    aI
  );
}
var qv = $v;
function $v(t, e, n, r) {
  return wn(!0), e[Ve].createComment("");
}
function cI(t, e, n, r) {
  let i = e[rn],
    s = !i || Zs() || no(n) || kc(i, r);
  if ((wn(s), s)) return $v(t, e, n, r);
  let o = i.data[yd]?.[r] ?? null;
  o !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = o);
  let a = Uc(i, t, e, n);
  Oc(i, r, a);
  let c = Tf(i, r);
  return Vc(c, a);
}
function lI() {
  qv = cI;
}
function zv(t, e, n, r) {
  let i = We(),
    s = af();
  if (to(i, s, e)) {
    let o = bn(),
      a = uf();
    CS(a, i, t, e, n, r);
  }
  return zv;
}
function Gv(t, e, n, r) {
  return to(t, af(), n) ? e + Gs(n) + r : gr;
}
function Va(t, e) {
  return (t << 17) | (e << 2);
}
function Kr(t) {
  return (t >> 17) & 32767;
}
function uI(t) {
  return (t & 2) == 2;
}
function dI(t, e) {
  return (t & 131071) | (e << 17);
}
function jd(t) {
  return t | 2;
}
function Fi(t) {
  return (t & 131068) >> 2;
}
function Xu(t, e) {
  return (t & -131069) | (e << 2);
}
function fI(t) {
  return (t & 1) === 1;
}
function Bd(t) {
  return t | 1;
}
function hI(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = Kr(o),
    c = Fi(o);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Ws(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let g = Kr(t[a + 1]);
      (t[r + 1] = Va(g, a)),
        g !== 0 && (t[g + 1] = Xu(t[g + 1], r)),
        (t[a + 1] = dI(t[a + 1], r));
    } else
      (t[r + 1] = Va(a, 0)), a !== 0 && (t[a + 1] = Xu(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = Va(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = Xu(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = jd(t[r + 1])),
    Sg(t, u, r, !0),
    Sg(t, u, r, !1),
    pI(e, u, t, r, s),
    (o = Va(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o);
}
function pI(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles;
  s != null &&
    typeof e == "string" &&
    Ws(s, e) >= 0 &&
    (n[r + 1] = Bd(n[r + 1]));
}
function Sg(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? Kr(i) : Fi(i),
    a = !1;
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      l = t[o + 1];
    mI(c, e) && ((a = !0), (t[o + 1] = r ? Bd(l) : jd(l))),
      (o = r ? Kr(l) : Fi(l));
  }
  a && (t[n + 1] = r ? jd(i) : Bd(i));
}
function mI(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Ws(t, e) >= 0
    : !1;
}
function gI(t, e, n) {
  let r = We(),
    i = af();
  if (to(r, i, e)) {
    let s = bn(),
      o = uf();
    Dv(s, o, r, t, e, r[Ve], n, !1);
  }
  return gI;
}
function Cg(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? "class" : "style";
  kf(t, n, s[o], o, r);
}
function Wv(t, e, n) {
  return yI(t, e, n, !1), Wv;
}
function yI(t, e, n, r) {
  let i = We(),
    s = bn(),
    o = G_(2);
  if ((s.firstUpdatePass && EI(s, t, o, r), e !== gr && to(i, o, e))) {
    let a = s.data[Hi()];
    TI(s, a, i, i[Ve], t, (i[o + 1] = SI(e, n)), r, o);
  }
}
function vI(t, e) {
  return e >= t.expandoStartIndex;
}
function EI(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let s = i[Hi()],
      o = vI(t, n);
    CI(s, r) && e === null && !o && (e = !1),
      (e = bI(i, s, e, r)),
      hI(i, s, e, n, o, r);
  }
}
function bI(t, e, n, r) {
  let i = Y_(t),
    s = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = Ju(null, t, e, n, r)), (n = $s(n, e.attrs, r)), (s = null));
  else {
    let o = e.directiveStylingLast;
    if (o === -1 || t[o] !== i)
      if (((n = Ju(i, t, e, n, r)), s === null)) {
        let c = wI(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ju(null, t, e, c[1], r)),
          (c = $s(c, e.attrs, r)),
          DI(t, e, r, c));
      } else s = _I(t, e, r);
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  );
}
function wI(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (Fi(r) !== 0) return t[Kr(r)];
}
function DI(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[Kr(i)] = r;
}
function _I(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs;
    r = $s(r, o, n);
  }
  return $s(r, e.attrs, n);
}
function Ju(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = $s(r, s.hostAttrs, i)), s !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function $s(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s];
      typeof o == "number"
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          GD(t, o, n ? !0 : e[++s]));
    }
  return t === void 0 ? null : t;
}
function TI(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = fI(l) ? Ig(c, e, n, i, Fi(l), o) : void 0;
  if (!vc(u)) {
    vc(s) || (uI(l) && (s = Ig(c, null, n, i, a, o)));
    let d = my(Hi(), n);
    rS(r, o, d, i, s);
  }
}
function Ig(t, e, n, r, i, s) {
  let o = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      g = n[i + 1];
    g === gr && (g = d ? Wt : void 0);
    let b = d ? Hu(g, r) : u === r ? g : void 0;
    if ((l && !vc(b) && (b = Hu(c, r)), vc(b) && ((a = b), o))) return a;
    let I = t[i + 1];
    i = o ? Kr(I) : Fi(I);
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles;
    c != null && (a = Hu(c, r));
  }
  return a;
}
function vc(t) {
  return t !== void 0;
}
function SI(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = St(Lc(t)))),
    t
  );
}
function CI(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function II(t, e, n, r, i, s) {
  let o = e.consts,
    a = rc(o, i),
    c = Bc(e, t, 2, r, a);
  return (
    _v(e, n, c, rc(o, s)),
    c.attrs !== null && kd(c, c.attrs, !1),
    c.mergedAttrs !== null && kd(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function Qv(t, e, n, r) {
  let i = We(),
    s = bn(),
    o = st + t,
    a = i[Ve],
    c = s.firstCreatePass ? II(o, s, i, e, n, r) : s.data[o],
    l = Yv(s, i, c, a, e, t);
  i[o] = l;
  let u = nf(c);
  return (
    Xs(c, !0),
    dv(a, l, c),
    !no(c) && df() && Af(s, i, l, c),
    P_() === 0 && Gr(l, i),
    F_(),
    u && (vv(s, i, c), yv(s, c, i)),
    r !== null && Ev(i, c),
    Qv
  );
}
function Kv() {
  let t = cn();
  wy() ? q_() : ((t = t.parent), Xs(t, !1));
  let e = t;
  B_(e) && U_(), j_();
  let n = bn();
  return (
    n.firstCreatePass && (ff(n, t), ly(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      nT(e) &&
      Cg(n, e, We(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      rT(e) &&
      Cg(n, e, We(), e.stylesWithoutHost, !1),
    Kv
  );
}
function Uf(t, e, n, r) {
  return Qv(t, e, n, r), Kv(), Uf;
}
var Yv = (t, e, n, r, i, s) => (wn(!0), Pc(r, i, Ny()));
function NI(t, e, n, r, i, s) {
  let o = e[rn],
    a = !o || Zs() || no(n) || kc(o, s);
  if ((wn(a), a)) return Pc(r, i, Ny());
  let c = Uc(o, t, e, n);
  return (
    Zy(o, s) && Oc(o, s, c.nextSibling),
    o && (qy(n) || $y(c)) && Bi(n) && (H_(n), lv(c)),
    c
  );
}
function MI() {
  Yv = NI;
}
var AI = (t, e, n, r) => (wn(!0), Nf(e[Ve], ""));
function xI(t, e, n, r) {
  let i,
    s = e[rn],
    o = !s || Zs() || no(n);
  if ((wn(o), o)) return Nf(e[Ve], "");
  let a = Uc(s, t, e, n),
    c = AT(s, r);
  return Oc(s, r, a), (i = Vc(c, a)), i;
}
function RI() {
  AI = xI;
}
var Ec = "en-US";
var OI = Ec;
function kI(t) {
  typeof t == "string" && (OI = t.toLowerCase().replace(/_/g, "-"));
}
function Zv(t, e, n) {
  let r = t[Ve];
  switch (n) {
    case Node.COMMENT_NODE:
      return Nf(r, e);
    case Node.TEXT_NODE:
      return If(r, e);
    case Node.ELEMENT_NODE:
      return Pc(r, e, null);
  }
}
var LI = (t, e, n, r) => (wn(!0), Zv(t, n, r));
function PI(t, e, n, r) {
  return wn(!0), Zv(t, n, r);
}
function FI() {
  LI = PI;
}
function Xv(t, e, n, r) {
  let i = We(),
    s = bn(),
    o = cn();
  return BI(s, i, i[Ve], o, t, e, r), Xv;
}
function jI(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s];
      if (o === n && i[s + 1] === r) {
        let a = e[xs],
          c = i[s + 2];
        return a.length > c ? a[c] : null;
      }
      typeof o == "string" && (s += 2);
    }
  return null;
}
function BI(t, e, n, r, i, s, o) {
  let a = nf(r),
    l = t.firstCreatePass && xS(t),
    u = e[vn],
    d = AS(e),
    g = !0;
  if (r.type & 3 || o) {
    let M = Lt(r, e),
      F = o ? o(M) : M,
      R = d.length,
      _ = o ? (T) => o(it(T[r.index])) : r.index,
      w = null;
    if ((!o && a && (w = jI(t, e, i, r.index)), w !== null)) {
      let T = w.__ngLastListenerFn__ || w;
      (T.__ngNextListenerFn__ = s), (w.__ngLastListenerFn__ = s), (g = !1);
    } else {
      s = Mg(r, e, u, s, !1);
      let T = n.listen(F, i, s);
      d.push(s, T), l && l.push(i, _, R, R + 1);
    }
  } else s = Mg(r, e, u, s, !1);
  let b = r.outputs,
    I;
  if (g && b !== null && (I = b[i])) {
    let M = I.length;
    if (M)
      for (let F = 0; F < M; F += 2) {
        let R = I[F],
          _ = I[F + 1],
          E = e[R][_].subscribe(s),
          te = d.length;
        d.push(s, E), l && l.push(i, r.index, te, -(te + 1));
      }
  }
}
function Ng(t, e, n, r) {
  let i = Oe(null);
  try {
    return gn(6, e, n), n(r) !== !1;
  } catch (s) {
    return Nv(t, s), !1;
  } finally {
    gn(7, e, n), Oe(i);
  }
}
function Mg(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r;
    let a = t.componentOffset > -1 ? mr(t.index, e) : e;
    Pf(a);
    let c = Ng(e, n, r, o),
      l = s.__ngNextListenerFn__;
    for (; l; ) (c = Ng(e, n, l, o) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && o.preventDefault(), c;
  };
}
function HI(t, e, n) {
  return Jv(t, "", e, "", n), HI;
}
function Jv(t, e, n, r, i) {
  let s = We(),
    o = Gv(s, e, n, r);
  if (o !== gr) {
    let a = bn(),
      c = uf();
    Dv(a, c, s, t, o, s[Ve], i, !1);
  }
  return Jv;
}
function CF(t, e = "") {
  let n = We(),
    r = bn(),
    i = t + st,
    s = r.firstCreatePass ? Bc(r, i, 1, e, null) : r.data[i],
    o = eE(r, n, s, e, t);
  (n[i] = o), df() && Af(r, n, o, s), Xs(s, !1);
}
var eE = (t, e, n, r, i) => (wn(!0), If(e[Ve], r));
function UI(t, e, n, r, i) {
  let s = e[rn],
    o = !s || Zs() || no(n) || kc(s, i);
  return wn(o), o ? If(e[Ve], r) : Uc(s, t, e, n);
}
function VI() {
  eE = UI;
}
function qI(t) {
  return tE("", t, ""), qI;
}
function tE(t, e, n) {
  let r = We(),
    i = Gv(r, t, e, n);
  return i !== gr && RS(r, Hi(), i), tE;
}
var $I = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = iy(!1, r.type),
          s =
            i.length > 0
              ? zc([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, s);
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
  e.ɵprov = J({
    token: e,
    providedIn: "environment",
    factory: () => new e(X(pt)),
  });
  let t = e;
  return t;
})();
function nE(t) {
  vr("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get($I).getOrCreateStandaloneInjector(t));
}
function IF(t, e, n, r) {
  return GI(We(), $_(), t, e, n, r);
}
function zI(t, e) {
  let n = t[e];
  return n === gr ? void 0 : n;
}
function GI(t, e, n, r, i, s) {
  let o = e + n;
  return to(t, o, i) ? sI(t, o + 1, s ? r.call(s, i) : r(i)) : zI(t, o + 1);
}
var qa = null;
function WI(t) {
  (qa !== null &&
    (t.defaultEncapsulation !== qa.defaultEncapsulation ||
      t.preserveWhitespaces !== qa.preserveWhitespaces)) ||
    (qa = t);
}
var Gc = (() => {
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var ro = new ie(""),
  io = new ie(""),
  Vi = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          Vf || (QI(s), s.addToWindow(i)),
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
                Be.assertNotInAngularZone(),
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
      addCallback(r, i, s) {
        let o = -1;
        i &&
          i > 0 &&
          (o = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== o
            )),
              r();
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: o, updateCb: s });
      }
      whenStable(r, i, s) {
        if (s && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(r, i, s), this._runCallbacksIfReady();
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
      findProviders(r, i, s) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(Be), X(Wc), X(io));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Wc = (() => {
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
        return Vf?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function QI(t) {
  Vf = t;
}
var Vf;
function so(t) {
  return !!t && typeof t.then == "function";
}
function rE(t) {
  return !!t && typeof t.subscribe == "function";
}
var Qc = new ie(""),
  iE = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = q(Qc, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let s of this.appInits) {
          let o = s();
          if (so(o)) r.push(o);
          else if (rE(o)) {
            let a = new Promise((c, l) => {
              o.subscribe({ complete: c, error: l });
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
          .catch((s) => {
            this.reject(s);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  qi = new ie("");
function KI() {
  Em(() => {
    throw new G(600, !1);
  });
}
function YI(t) {
  return t.isBoundToModule;
}
function ZI(t, e, n) {
  try {
    let r = n();
    return so(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function sE(t, e) {
  return Array.isArray(e) ? e.reduce(sE, t) : Z(Z({}, t), e);
}
var ln = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = q(Vy)),
        (this.afterRenderEffectManager = q(Bf)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new dt()),
        (this.afterTick = new dt()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = q(Xr).hasPendingTasks.pipe(Ee((r) => !r))),
        (this._injector = q(pt));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let s = r instanceof hc;
      if (!this._injector.get(iE).done) {
        let b = !s && ey(r),
          I = !1;
        throw new G(405, I);
      }
      let a;
      s ? (a = r) : (a = this._injector.get(qc).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = YI(a) ? void 0 : this._injector.get(pr),
        l = i || a.selector,
        u = a.create(Pt.NULL, [], l, c),
        d = u.location.nativeElement,
        g = u.injector.get(ro, null);
      return (
        g?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            Ya(this.components, u),
            g?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new G(101, !1);
      let i = Oe(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (s) {
        this.internalErrorHandler(s);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), Oe(i);
      }
    }
    detectChangesInAttachedViews(r) {
      let i = 0,
        s = this.afterRenderEffectManager;
      for (;;) {
        if (i === xv) throw new G(103, !1);
        if (r) {
          let o = i === 0;
          this.beforeRender.next(o);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            XI(a, o, c);
        }
        if (
          (i++,
          s.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: o }) => Hd(o)
          ) &&
            (s.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: o }) => Hd(o)
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
      Ya(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(qi, []);
      [...this._bootstrapListeners, ...i].forEach((s) => s(r));
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
        this._destroyListeners.push(r), () => Ya(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new G(406, !1);
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ya(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var $a;
function oo(t) {
  $a ??= new WeakMap();
  let e = $a.get(t);
  if (e) return e;
  let n = t.isStable
    .pipe(Jt((r) => r))
    .toPromise()
    .then(() => {});
  return $a.set(t, n), t.onDestroy(() => $a?.delete(t)), n;
}
function XI(t, e, n) {
  (!e && !Hd(t)) || JI(t, n, e);
}
function Hd(t) {
  return of(t);
}
function JI(t, e, n) {
  let r;
  n ? ((r = 0), (t[de] |= 1024)) : t[de] & 64 ? (r = 0) : (r = 1), Rv(t, e, r);
}
var Ud = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  Kc = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new yc(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          s = ty(r),
          o = nv(s.declarations).reduce((a, c) => {
            let l = Un(c);
            return l && a.push(new Pi(l)), a;
          }, []);
        return new Ud(i, o);
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
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  e1 = new ie("");
function t1(t, e, n) {
  let r = new yc(n);
  return Promise.resolve(r);
}
function Ag(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var n1 = (() => {
  let e = class e {
    constructor() {
      (this.zone = q(Be)), (this.applicationRef = q(ln));
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function r1(t) {
  return [
    { provide: Be, useFactory: t },
    {
      provide: qr,
      multi: !0,
      useFactory: () => {
        let e = q(n1, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: qr,
      multi: !0,
      useFactory: () => {
        let e = q(o1);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Vy, useFactory: i1 },
  ];
}
function i1() {
  let t = q(Be),
    e = q(En);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function s1(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var o1 = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new nt()),
        (this.initialized = !1),
        (this.zone = q(Be)),
        (this.pendingTasks = q(Xr));
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
              Be.assertNotInAngularZone(),
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
            Be.assertInAngularZone(), (r ??= this.pendingTasks.add());
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function a1() {
  return (typeof $localize < "u" && $localize.locale) || Ec;
}
var qf = new ie("", {
  providedIn: "root",
  factory: () => q(qf, we.Optional | we.SkipSelf) || a1(),
});
var oE = new ie(""),
  aE = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let s = RC(
          i?.ngZone,
          s1({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return s.run(() => {
          let o = nI(
              r.moduleType,
              this.injector,
              r1(() => s)
            ),
            a = o.injector.get(En, null);
          return (
            s.runOutsideAngular(() => {
              let c = s.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              o.onDestroy(() => {
                Ya(this._modules, o), c.unsubscribe();
              });
            }),
            ZI(a, s, () => {
              let c = o.injector.get(iE);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = o.injector.get(qf, Ec);
                  return kI(l || Ec), this._moduleDoBootstrap(o), o;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let s = sE({}, i);
        return t1(this.injector, s, r).then((o) =>
          this.bootstrapModuleFactory(o, s)
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(ln);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((s) => i.bootstrap(s));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(i);
        else throw new G(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new G(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let r = this._injector.get(oE, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(Pt));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Is = null,
  Yc = new ie("");
function c1(t) {
  if (Is && !Is.get(Yc, !1)) throw new G(400, !1);
  KI(), (Is = t);
  let e = t.get(aE);
  return d1(t), e;
}
function Zc(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new ie(r);
  return (s = []) => {
    let o = cE();
    if (!o || o.injector.get(Yc, !1)) {
      let a = [...n, ...s, { provide: i, useValue: !0 }];
      t ? t(a) : c1(l1(a, r));
    }
    return u1(i);
  };
}
function l1(t = [], e) {
  return Pt.create({
    name: e,
    providers: [
      { provide: Cc, useValue: "platform" },
      { provide: oE, useValue: new Set([() => (Is = null)]) },
      ...t,
    ],
  });
}
function u1(t) {
  let e = cE();
  if (!e) throw new G(401, !1);
  return e;
}
function cE() {
  return Is?.get(aE) ?? null;
}
function d1(t) {
  t.get(Rc, null)?.forEach((n) => n());
}
var ao = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = f1;
  let t = e;
  return t;
})();
function f1(t) {
  return h1(cn(), We(), (t & 16) === 16);
}
function h1(t, e, n) {
  if (Bi(t) && !n) {
    let r = mr(t.index, e);
    return new Wr(r, r);
  } else if (t.type & 47) {
    let r = e[xt];
    return new Wr(r, e);
  }
  return null;
}
var Vd = class {
    constructor() {}
    supports(e) {
      return Vv(e);
    }
    create(e) {
      return new qd(e);
    }
  },
  p1 = (t, e) => e,
  qd = class {
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
        (this._trackByFn = e || p1);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        s = null;
      for (; n || r; ) {
        let o = !r || (n && n.currentIndex < xg(r, i, s)) ? n : r,
          a = xg(o, i, s),
          c = o.currentIndex;
        if (o === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), o.previousIndex == null)) i++;
        else {
          s || (s = []);
          let l = a - i,
            u = c - i;
          if (l != u) {
            for (let g = 0; g < l; g++) {
              let b = g < s.length ? s[g] : (s[g] = 0),
                I = b + g;
              u <= I && I < l && (s[g] = b + 1);
            }
            let d = o.previousIndex;
            s[d] = u - l;
          }
        }
        a !== c && e(o, a, c);
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
      if ((e == null && (e = []), !Vv(e))) throw new G(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        s,
        o;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (s = e[a]),
            (o = this._trackByFn(a, s)),
            n === null || !Object.is(n.trackById, o)
              ? ((n = this._mismatch(n, s, o, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, s, o, a)),
                Object.is(n.item, s) || this._addIdentityChange(n, s)),
            (n = n._next);
      } else
        (i = 0),
          rI(e, (a) => {
            (o = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, o)
                ? ((n = this._mismatch(n, a, o, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, o, i)),
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
      let s;
      return (
        e === null ? (s = this._itTail) : ((s = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, s, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, s, i))
              : (e = this._addAfter(new $d(n, r), s, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let s =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        s !== null
          ? (e = this._reinsertAfter(s, e._prev, i))
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
        s = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = s) : (i._nextRemoved = s),
        s === null ? (this._removalsTail = i) : (s._prevRemoved = i),
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
        this._linkedRecords === null && (this._linkedRecords = new bc()),
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
        this._unlinkedRecords === null && (this._unlinkedRecords = new bc()),
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
  $d = class {
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
  zd = class {
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
  bc = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new zd()), this.map.set(n, r)), r.add(e);
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
function xg(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
function Rg() {
  return new $f([new Vd()]);
}
var $f = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let s = i.factories.slice();
        r = r.concat(s);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || Rg()),
        deps: [[e, new Qd(), new ji()]],
      };
    }
    find(r) {
      let i = this.factories.find((s) => s.supports(r));
      if (i != null) return i;
      throw new G(901, !1);
    }
  };
  e.ɵprov = J({ token: e, providedIn: "root", factory: Rg });
  let t = e;
  return t;
})();
var zf = Zc(null, "core", []),
  lE = (() => {
    let e = class e {
      constructor(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(ln));
    }),
      (e.ɵmod = Ot({ type: e })),
      (e.ɵinj = Rt({}));
    let t = e;
    return t;
  })();
var Og = !1,
  uE = !1;
function m1() {
  Og || ((Og = !0), IT(), MI(), VI(), RI(), lI(), KC(), DC(), dS(), FI());
}
function g1(t, e) {
  return oo(t);
}
function dE() {
  return Yr([
    {
      provide: Ci,
      useFactory: () => {
        let t = !0;
        return (
          _s() && (t = !!q(Dn, { optional: !0 })?.get(wf, null)),
          t && vr("NgHydration"),
          t
        );
      },
    },
    {
      provide: qr,
      useValue: () => {
        (uE = !!q(xT, { optional: !0 })), _s() && q(Ci) && (v1(), m1());
      },
      multi: !0,
    },
    { provide: Jy, useFactory: () => _s() && q(Ci) },
    {
      provide: qi,
      useFactory: () => {
        if (_s() && q(Ci)) {
          let t = q(ln),
            e = q(Pt);
          return () => {
            g1(t, e).then(() => {
              uC(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function y1() {
  return uE;
}
function v1() {
  let t = xc(),
    e;
  for (let n of t.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === Df) {
      e = n;
      break;
    }
  if (!e) throw new G(-507, !1);
}
var Gd = class {
    constructor() {
      (this.views = []), (this.indexByContent = new Map());
    }
    add(e) {
      let n = JSON.stringify(e);
      if (!this.indexByContent.has(n)) {
        let r = this.views.length;
        return this.views.push(e), this.indexByContent.set(n, r), r;
      }
      return this.indexByContent.get(n);
    }
    getAll() {
      return this.views;
    }
  },
  E1 = 0;
function fE(t) {
  return t.ssrId || (t.ssrId = `t${E1++}`), t.ssrId;
}
function hE(t, e, n) {
  let r = [];
  return Us(t, e, n, r), r.length;
}
function b1(t) {
  let e = [];
  return Mv(t, e), e.length;
}
function pE(t, e) {
  let n = t[Xe];
  return n && !n.hasAttribute(js) ? Dc(n, t, e) : null;
}
function mE(t, e) {
  let n = py(t[Xe]),
    r = pE(n, e),
    i = it(n[Xe]),
    s = t[ct],
    o = Dc(i, s, e),
    a = n[Ve],
    c = `${r}|${o}`;
  a.setAttribute(i, Ss, c);
}
function gE(t, e) {
  let n = new Gd(),
    r = new Map(),
    i = t._views;
  for (let a of i) {
    let c = Yy(a);
    if (c !== null) {
      let l = { serializedViewCollection: n, corruptedTextNodes: r };
      kt(c) ? mE(c, l) : pE(c, l), T1(r, e);
    }
  }
  let s = n.getAll();
  t.injector.get(Dn).set(wf, s);
}
function w1(t, e) {
  let n = [],
    r = "";
  for (let i = Ct; i < t.length; i++) {
    let s = t[i],
      o,
      a,
      c;
    if (rf(s) && ((s = s[st]), kt(s))) {
      (a = b1(s) + 1), mE(s, e);
      let u = py(s[Xe]);
      c = { [vd]: u[ve].ssrId, [ki]: a };
    }
    if (!c) {
      let u = s[ve];
      u.type === 1
        ? ((o = u.ssrId), (a = 1))
        : ((o = fE(u)), (a = hE(u, s, u.firstChild))),
        (c = Z({ [vd]: o, [ki]: a }, yE(t[i], e)));
    }
    let l = JSON.stringify(c);
    if (n.length > 0 && l === r) {
      let u = n[n.length - 1];
      (u[cc] ??= 1), u[cc]++;
    } else (r = l), n.push(c);
  }
  return n;
}
function wc(t, e, n) {
  let r = e.index - st;
  (t[Ed] ??= {}), (t[Ed][r] = EC(e, n));
}
function kg(t, e) {
  let n = e.index - st;
  (t[Qa] ??= []), t[Qa].includes(n) || t[Qa].push(n);
}
function yE(t, e) {
  let n = {},
    r = t[ve];
  for (let i = st; i < r.bindingStartIndex; i++) {
    let s = r.data[i],
      o = i - st;
    if (tT(s)) {
      if (Vs(s, t) && S1(s)) {
        kg(n, s);
        continue;
      }
      if (Array.isArray(s.projection)) {
        for (let a of s.projection)
          if (a)
            if (!Array.isArray(a))
              !T_(a) && !ac(a) && (Vs(a, t) ? kg(n, a) : wc(n, a, t));
            else throw JS(it(t[i]));
      }
      if ((D1(n, s, t), kt(t[i]))) {
        let a = s.tView;
        a !== null && ((n[yd] ??= {}), (n[yd][o] = fE(a)));
        let c = t[i][Xe];
        if (Array.isArray(c)) {
          let l = it(c);
          l.hasAttribute(js) || Dc(l, c, e);
        }
        (n[Hs] ??= {}), (n[Hs][o] = w1(t[i], e));
      } else if (Array.isArray(t[i])) {
        let a = it(t[i][Xe]);
        a.hasAttribute(js) || Dc(a, t[i], e);
      } else if (s.type & 8) (n[gd] ??= {}), (n[gd][o] = hE(r, t, s.child));
      else if (s.type & 16) {
        let a = s.next;
        for (; a !== null && a.type & 16; ) a = a.next;
        a && !ac(a) && wc(n, a, t);
      } else if (s.type & 1) {
        let a = it(t[i]);
        a.textContent === ""
          ? e.corruptedTextNodes.set(a, "ngetn")
          : a.nextSibling?.nodeType === Node.TEXT_NODE &&
            e.corruptedTextNodes.set(a, "ngtns");
      }
    }
  }
  return n;
}
function D1(t, e, n) {
  e.projectionNext &&
    e.projectionNext !== e.next &&
    !ac(e.projectionNext) &&
    wc(t, e.projectionNext, n),
    e.prev === null &&
      e.parent !== null &&
      Vs(e.parent, n) &&
      !Vs(e, n) &&
      wc(t, e, n);
}
function _1(t) {
  let e = t[vn];
  return e?.constructor
    ? Un(e.constructor)?.encapsulation === nn.ShadowDom
    : !1;
}
function Dc(t, e, n) {
  let r = e[Ve];
  if ((S_(e) && !y1()) || _1(e)) return r.setAttribute(t, js, ""), null;
  {
    let i = yE(e, n),
      s = n.serializedViewCollection.add(i);
    return r.setAttribute(t, Ss, s.toString()), s;
  }
}
function T1(t, e) {
  for (let [n, r] of t) n.after(e.createComment(r));
}
function S1(t) {
  let e = t;
  for (; e != null; ) {
    if (Bi(e)) return !0;
    e = e.parent;
  }
  return !1;
}
function vE(t) {
  let e = Un(t);
  if (!e) return null;
  let n = new Pi(e);
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
var _E = null;
function un() {
  return _E;
}
function Jc(t) {
  _E ??= t;
}
var Xc = class {};
var $e = new ie(""),
  $i = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(M1), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  TE = new ie(""),
  M1 = (() => {
    let e = class e extends $i {
      constructor() {
        super(),
          (this._doc = q($e)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return un().getBaseHref(this._doc);
      }
      onPopState(r) {
        let i = un().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", r, !1),
          () => i.removeEventListener("popstate", r)
        );
      }
      onHashChange(r) {
        let i = un().getGlobalEventTarget(this._doc, "window");
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
      pushState(r, i, s) {
        this._history.pushState(r, i, s);
      }
      replaceState(r, i, s) {
        this._history.replaceState(r, i, s);
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
      (e.ɵprov = J({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function Yf(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function EE(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function $n(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var ei = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(Zf), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  SE = new ie(""),
  Zf = (() => {
    let e = class e extends ei {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            q($e).location?.origin ??
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
        return Yf(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + $n(this._platformLocation.search),
          s = this._platformLocation.hash;
        return s && r ? `${i}${s}` : i;
      }
      pushState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + $n(o));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + $n(o));
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
      return new (i || e)(X($i), X(SE, 8));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  CE = (() => {
    let e = class e extends ei {
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
        let i = Yf(this._baseHref, r);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + $n(o));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + $n(o));
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
      return new (i || e)(X($i), X(SE, 8));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zi = (() => {
    let e = class e {
      constructor(r) {
        (this._subject = new vt()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = r);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = R1(EE(bE(i)))),
          this._locationStrategy.onPopState((s) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: s.state,
              type: s.type,
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
        return this.path() == this.normalize(r + $n(i));
      }
      normalize(r) {
        return e.stripTrailingSlash(x1(this._basePath, bE(r)));
      }
      prepareExternalUrl(r) {
        return (
          r && r[0] !== "/" && (r = "/" + r),
          this._locationStrategy.prepareExternalUrl(r)
        );
      }
      go(r, i = "", s = null) {
        this._locationStrategy.pushState(s, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + $n(i)), s);
      }
      replaceState(r, i = "", s = null) {
        this._locationStrategy.replaceState(s, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + $n(i)), s);
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
        this._urlChangeListeners.forEach((s) => s(r, i));
      }
      subscribe(r, i, s) {
        return this._subject.subscribe({ next: r, error: i, complete: s });
      }
    };
    (e.normalizeQueryParams = $n),
      (e.joinWithSlash = Yf),
      (e.stripTrailingSlash = EE),
      (e.ɵfac = function (i) {
        return new (i || e)(X(ei));
      }),
      (e.ɵprov = J({ token: e, factory: () => A1(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function A1() {
  return new zi(X(ei));
}
function x1(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function bE(t) {
  return t.replace(/\/index.html$/, "");
}
function R1(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function el(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, s] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(s);
  }
  return null;
}
var Gf = /\s+/,
  wE = [],
  XF = (() => {
    let e = class e {
      constructor(r, i) {
        (this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = wE),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Gf) : wE;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(Gf) : r;
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
        let s = this.stateMap.get(r);
        s !== void 0
          ? (s.enabled !== i && ((s.changed = !0), (s.enabled = i)),
            (s.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            s = r[1];
          s.changed
            ? (this._toggleClass(i, s.enabled), (s.changed = !1))
            : s.touched ||
              (s.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (s.touched = !1);
        }
      }
      _toggleClass(r, i) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(Gf).forEach((s) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, s)
                : this._renderer.removeClass(this._ngEl.nativeElement, s);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(yr(Js), yr(Ui));
    }),
      (e.ɵdir = Qs({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [Hn.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Wf = class {
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
  JF = (() => {
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
      constructor(r, i, s) {
        (this._viewContainer = r),
          (this._template = i),
          (this._differs = s),
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
        r.forEachOperation((s, o, a) => {
          if (s.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Wf(s.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let c = i.get(o);
            i.move(c, a), DE(c, s);
          }
        });
        for (let s = 0, o = i.length; s < o; s++) {
          let c = i.get(s).context;
          (c.index = s), (c.count = o), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((s) => {
          let o = i.get(s.currentIndex);
          DE(o, s);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(yr(eo), yr(Ff), yr($f));
    }),
      (e.ɵdir = Qs({
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
function DE(t, e) {
  t.context.$implicit = e.item;
}
var IE = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ot({ type: e })),
      (e.ɵinj = Rt({}));
    let t = e;
    return t;
  })(),
  NE = "browser",
  Xf = "server";
function O1(t) {
  return t === NE;
}
function lo(t) {
  return t === Xf;
}
var tl = (() => {
    let e = class e {};
    e.ɵprov = J({
      token: e,
      providedIn: "root",
      factory: () => (O1(q(Ft)) ? new Qf(q($e), window) : new co()),
    });
    let t = e;
    return t;
  })(),
  Qf = class {
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
      let n = k1(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        s = this.offset();
      this.window.scrollTo(r - s[0], i - s[1]);
    }
  };
function k1(t, e) {
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
      let s = i.shadowRoot;
      if (s) {
        let o = s.getElementById(e) || s.querySelector(`[name="${e}"]`);
        if (o) return o;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var co = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Er = class {};
var fo = class {},
  il = class {},
  wr = class t {
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
                          s = i.toLowerCase(),
                          o = n.slice(r + 1).trim();
                        this.maybeSetNormalizedName(i, s),
                          this.headers.has(s)
                            ? this.headers.get(s).push(o)
                            : this.headers.set(s, [o]);
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
          let s = e.value;
          if (!s) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let o = this.headers.get(n);
            if (!o) return;
            (o = o.filter((a) => s.indexOf(a) === -1)),
              o.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, o);
          }
          break;
      }
    }
    setHeaderEntries(e, n) {
      let r = (Array.isArray(n) ? n : [n]).map((s) => s.toString()),
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
var eh = class {
  encodeKey(e) {
    return ME(e);
  }
  encodeValue(e) {
    return ME(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function F1(t, e) {
  let n = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let s = i.indexOf("="),
            [o, a] =
              s == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, s)), e.decodeValue(i.slice(s + 1))],
            c = n.get(o) || [];
          c.push(a), n.set(o, c);
        }),
    n
  );
}
var j1 = /%(\d[a-f0-9])/gi,
  B1 = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function ME(t) {
  return encodeURIComponent(t).replace(j1, (e, n) => B1[n] ?? e);
}
function nl(t) {
  return `${t}`;
}
var br = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new eh()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = F1(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((n) => {
            let r = e.fromObject[n],
              i = Array.isArray(r) ? r.map(nl) : [nl(r)];
            this.map.set(n, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let n = this.map.get(e);
    return n ? n[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, n) {
    return this.clone({ param: e, value: n, op: "a" });
  }
  appendAll(e) {
    let n = [];
    return (
      Object.keys(e).forEach((r) => {
        let i = e[r];
        Array.isArray(i)
          ? i.forEach((s) => {
              n.push({ param: r, value: s, op: "a" });
            })
          : n.push({ param: r, value: i, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(e, n) {
    return this.clone({ param: e, value: n, op: "s" });
  }
  delete(e, n) {
    return this.clone({ param: e, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let n = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let n = new t({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(e)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let n = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              n.push(nl(e.value)), this.map.set(e.param, n);
              break;
            case "d":
              if (e.value !== void 0) {
                let r = this.map.get(e.param) || [],
                  i = r.indexOf(nl(e.value));
                i !== -1 && r.splice(i, 1),
                  r.length > 0
                    ? this.map.set(e.param, r)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var th = class {
  constructor() {
    this.map = new Map();
  }
  set(e, n) {
    return this.map.set(e, n), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function H1(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function AE(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function xE(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function RE(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function U1(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var uo = class t {
    constructor(e, n, r, i) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let s;
      if (
        (H1(this.method) || i
          ? ((this.body = r !== void 0 ? r : null), (s = i))
          : (s = r),
        s &&
          ((this.reportProgress = !!s.reportProgress),
          (this.withCredentials = !!s.withCredentials),
          s.responseType && (this.responseType = s.responseType),
          s.headers && (this.headers = s.headers),
          s.context && (this.context = s.context),
          s.params && (this.params = s.params),
          (this.transferCache = s.transferCache)),
        (this.headers ??= new wr()),
        (this.context ??= new th()),
        !this.params)
      )
        (this.params = new br()), (this.urlWithParams = n);
      else {
        let o = this.params.toString();
        if (o.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + o;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          AE(this.body) ||
          xE(this.body) ||
          RE(this.body) ||
          U1(this.body)
        ? this.body
        : this.body instanceof br
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || RE(this.body)
        ? null
        : xE(this.body)
        ? this.body.type || null
        : AE(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof br
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let n = e.method || this.method,
        r = e.url || this.url,
        i = e.responseType || this.responseType,
        s = e.transferCache ?? this.transferCache,
        o = e.body !== void 0 ? e.body : this.body,
        a = e.withCredentials ?? this.withCredentials,
        c = e.reportProgress ?? this.reportProgress,
        l = e.headers || this.headers,
        u = e.params || this.params,
        d = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (l = Object.keys(e.setHeaders).reduce(
            (g, b) => g.set(b, e.setHeaders[b]),
            l
          )),
        e.setParams &&
          (u = Object.keys(e.setParams).reduce(
            (g, b) => g.set(b, e.setParams[b]),
            u
          )),
        new t(n, r, o, {
          params: u,
          headers: l,
          context: d,
          reportProgress: c,
          responseType: i,
          withCredentials: a,
          transferCache: s,
        })
      );
    }
  },
  Gi = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Gi || {}),
  ho = class {
    constructor(e, n = ol.Ok, r = "OK") {
      (this.headers = e.headers || new wr()),
        (this.status = e.status !== void 0 ? e.status : n),
        (this.statusText = e.statusText || r),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  nh = class t extends ho {
    constructor(e = {}) {
      super(e), (this.type = Gi.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Wi = class t extends ho {
    constructor(e = {}) {
      super(e),
        (this.type = Gi.Response),
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
  },
  sl = class extends ho {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  ol = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
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
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
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
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
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
  })(ol || {});
function Jf(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var V1 = (() => {
  let e = class e {
    constructor(r) {
      this.handler = r;
    }
    request(r, i, s = {}) {
      let o;
      if (r instanceof uo) o = r;
      else {
        let l;
        s.headers instanceof wr ? (l = s.headers) : (l = new wr(s.headers));
        let u;
        s.params &&
          (s.params instanceof br
            ? (u = s.params)
            : (u = new br({ fromObject: s.params }))),
          (o = new uo(r, i, s.body !== void 0 ? s.body : null, {
            headers: l,
            context: s.context,
            params: u,
            reportProgress: s.reportProgress,
            responseType: s.responseType || "json",
            withCredentials: s.withCredentials,
            transferCache: s.transferCache,
          }));
      }
      let a = ue(o).pipe(Fn((l) => this.handler.handle(l)));
      if (r instanceof uo || s.observe === "events") return a;
      let c = a.pipe(_t((l) => l instanceof Wi));
      switch (s.observe || "body") {
        case "body":
          switch (o.responseType) {
            case "arraybuffer":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return l.body;
                })
              );
            case "blob":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return l.body;
                })
              );
            case "text":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && typeof l.body != "string")
                    throw new Error("Response is not a string.");
                  return l.body;
                })
              );
            case "json":
            default:
              return c.pipe(Ee((l) => l.body));
          }
        case "response":
          return c;
        default:
          throw new Error(`Unreachable: unhandled observe type ${s.observe}}`);
      }
    }
    delete(r, i = {}) {
      return this.request("DELETE", r, i);
    }
    get(r, i = {}) {
      return this.request("GET", r, i);
    }
    head(r, i = {}) {
      return this.request("HEAD", r, i);
    }
    jsonp(r, i) {
      return this.request("JSONP", r, {
        params: new br().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(r, i = {}) {
      return this.request("OPTIONS", r, i);
    }
    patch(r, i, s = {}) {
      return this.request("PATCH", r, Jf(s, i));
    }
    post(r, i, s = {}) {
      return this.request("POST", r, Jf(s, i));
    }
    put(r, i, s = {}) {
      return this.request("PUT", r, Jf(s, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X(fo));
  }),
    (e.ɵprov = J({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function qE(t, e) {
  return e(t);
}
function q1(t, e) {
  return (n, r) => e.intercept(n, { handle: (i) => t(i, r) });
}
function $1(t, e, n) {
  return (r, i) => on(n, () => e(r, (s) => t(s, i)));
}
var z1 = new ie(""),
  rh = new ie(""),
  cl = new ie(""),
  G1 = new ie("");
function W1() {
  let t = null;
  return (e, n) => {
    t === null && (t = (q(z1, { optional: !0 }) ?? []).reduceRight(q1, qE));
    let r = q(Xr),
      i = r.add();
    return t(e, n).pipe(dr(() => r.remove(i)));
  };
}
var OE = (() => {
  let e = class e extends fo {
    constructor(r, i) {
      super(),
        (this.backend = r),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = q(Xr));
      let s = q(G1, { optional: !0 });
      this.backend = s ?? r;
    }
    handle(r) {
      if (this.chain === null) {
        let s = Array.from(
          new Set([...this.injector.get(rh), ...this.injector.get(cl, [])])
        );
        this.chain = s.reduceRight((o, a) => $1(o, a, this.injector), qE);
      }
      let i = this.pendingTasks.add();
      return this.chain(r, (s) => this.backend.handle(s)).pipe(
        dr(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X(il), X(pt));
  }),
    (e.ɵprov = J({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var Q1 = /^\)\]\}',?\n/;
function K1(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var kE = (() => {
    let e = class e {
      constructor(r) {
        this.xhrFactory = r;
      }
      handle(r) {
        if (r.method === "JSONP") throw new G(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? Ge(i.ɵloadImpl()) : ue(null)).pipe(
          Tt(
            () =>
              new ke((o) => {
                let a = i.build();
                if (
                  (a.open(r.method, r.urlWithParams),
                  r.withCredentials && (a.withCredentials = !0),
                  r.headers.forEach((F, R) =>
                    a.setRequestHeader(F, R.join(","))
                  ),
                  r.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !r.headers.has("Content-Type"))
                ) {
                  let F = r.detectContentTypeHeader();
                  F !== null && a.setRequestHeader("Content-Type", F);
                }
                if (r.responseType) {
                  let F = r.responseType.toLowerCase();
                  a.responseType = F !== "json" ? F : "text";
                }
                let c = r.serializeBody(),
                  l = null,
                  u = () => {
                    if (l !== null) return l;
                    let F = a.statusText || "OK",
                      R = new wr(a.getAllResponseHeaders()),
                      _ = K1(a) || r.url;
                    return (
                      (l = new nh({
                        headers: R,
                        status: a.status,
                        statusText: F,
                        url: _,
                      })),
                      l
                    );
                  },
                  d = () => {
                    let { headers: F, status: R, statusText: _, url: w } = u(),
                      T = null;
                    R !== ol.NoContent &&
                      (T =
                        typeof a.response > "u" ? a.responseText : a.response),
                      R === 0 && (R = T ? ol.Ok : 0);
                    let E = R >= 200 && R < 300;
                    if (r.responseType === "json" && typeof T == "string") {
                      let te = T;
                      T = T.replace(Q1, "");
                      try {
                        T = T !== "" ? JSON.parse(T) : null;
                      } catch (re) {
                        (T = te), E && ((E = !1), (T = { error: re, text: T }));
                      }
                    }
                    E
                      ? (o.next(
                          new Wi({
                            body: T,
                            headers: F,
                            status: R,
                            statusText: _,
                            url: w || void 0,
                          })
                        ),
                        o.complete())
                      : o.error(
                          new sl({
                            error: T,
                            headers: F,
                            status: R,
                            statusText: _,
                            url: w || void 0,
                          })
                        );
                  },
                  g = (F) => {
                    let { url: R } = u(),
                      _ = new sl({
                        error: F,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: R || void 0,
                      });
                    o.error(_);
                  },
                  b = !1,
                  I = (F) => {
                    b || (o.next(u()), (b = !0));
                    let R = { type: Gi.DownloadProgress, loaded: F.loaded };
                    F.lengthComputable && (R.total = F.total),
                      r.responseType === "text" &&
                        a.responseText &&
                        (R.partialText = a.responseText),
                      o.next(R);
                  },
                  M = (F) => {
                    let R = { type: Gi.UploadProgress, loaded: F.loaded };
                    F.lengthComputable && (R.total = F.total), o.next(R);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", g),
                  a.addEventListener("timeout", g),
                  a.addEventListener("abort", g),
                  r.reportProgress &&
                    (a.addEventListener("progress", I),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", M)),
                  a.send(c),
                  o.next({ type: Gi.Sent }),
                  () => {
                    a.removeEventListener("error", g),
                      a.removeEventListener("abort", g),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", g),
                      r.reportProgress &&
                        (a.removeEventListener("progress", I),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", M)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(Er));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  $E = new ie(""),
  Y1 = "XSRF-TOKEN",
  Z1 = new ie("", { providedIn: "root", factory: () => Y1 }),
  X1 = "X-XSRF-TOKEN",
  J1 = new ie("", { providedIn: "root", factory: () => X1 }),
  al = class {},
  eN = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this.doc = r),
          (this.platform = i),
          (this.cookieName = s),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let r = this.doc.cookie || "";
        return (
          r !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = el(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e), X(Ft), X(Z1));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function tN(t, e) {
  let n = t.url.toLowerCase();
  if (
    !q($E) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return e(t);
  let r = q(al).getToken(),
    i = q(J1);
  return (
    r != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, r) })),
    e(t)
  );
}
var zE = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(zE || {});
function nN(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function rN(...t) {
  let e = [
    V1,
    kE,
    OE,
    { provide: fo, useExisting: OE },
    { provide: il, useExisting: kE },
    { provide: rh, useValue: tN, multi: !0 },
    { provide: $E, useValue: !0 },
    { provide: al, useClass: eN },
  ];
  for (let n of t) e.push(...n.ɵproviders);
  return Yr(e);
}
var LE = new ie("");
function iN() {
  return nN(zE.LegacyInterceptors, [
    { provide: LE, useFactory: W1 },
    { provide: rh, useExisting: LE, multi: !0 },
  ]);
}
var GE = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Ot({ type: e })),
    (e.ɵinj = Rt({ providers: [rN(iN())] }));
  let t = e;
  return t;
})();
var PE = "b",
  FE = "h",
  jE = "s",
  BE = "st",
  HE = "u",
  UE = "rt",
  rl = new ie(""),
  sN = ["GET", "HEAD"];
function oN(t, e) {
  let d = q(rl),
    { isCacheActive: n } = d,
    r = ba(d, ["isCacheActive"]),
    { transferCache: i, method: s } = t;
  if (
    !n ||
    (s === "POST" && !r.includePostRequests && !i) ||
    (s !== "POST" && !sN.includes(s)) ||
    i === !1 ||
    r.filter?.(t) === !1
  )
    return e(t);
  let o = q(Dn),
    a = cN(t),
    c = o.get(a, null),
    l = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (l = i.includeHeaders), c)) {
    let { [PE]: g, [UE]: b, [FE]: I, [jE]: M, [BE]: F, [HE]: R } = c,
      _ = g;
    switch (b) {
      case "arraybuffer":
        _ = new TextEncoder().encode(g).buffer;
        break;
      case "blob":
        _ = new Blob([g]);
        break;
    }
    let w = new wr(I);
    return ue(
      new Wi({ body: _, headers: w, status: M, statusText: F, url: R })
    );
  }
  let u = lo(q(Ft));
  return e(t).pipe(
    rt((g) => {
      g instanceof Wi &&
        u &&
        o.set(a, {
          [PE]: g.body,
          [FE]: aN(g.headers, l),
          [jE]: g.status,
          [BE]: g.statusText,
          [HE]: g.url || "",
          [UE]: t.responseType,
        });
    })
  );
}
function aN(t, e) {
  if (!e) return {};
  let n = {};
  for (let r of e) {
    let i = t.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function VE(t) {
  return [...t.keys()]
    .sort()
    .map((e) => `${e}=${t.getAll(e)}`)
    .join("&");
}
function cN(t) {
  let { params: e, method: n, responseType: r, url: i } = t,
    s = VE(e),
    o = t.serializeBody();
  o instanceof URLSearchParams ? (o = VE(o)) : typeof o != "string" && (o = "");
  let a = [n, r, i, o, s].join("|"),
    c = lN(a);
  return c;
}
function lN(t) {
  let e = 0;
  for (let n of t) e = (Math.imul(31, e) + n.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function WE(t) {
  return [
    {
      provide: rl,
      useFactory: () => (
        vr("NgHttpTransferCache"), Z({ isCacheActive: !0 }, t)
      ),
    },
    { provide: cl, useValue: oN, multi: !0, deps: [Dn, rl] },
    {
      provide: qi,
      multi: !0,
      useFactory: () => {
        let e = q(ln),
          n = q(rl);
        return () => {
          oo(e).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var oh = class extends Xc {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  ll = class t extends oh {
    static makeCurrent() {
      Jc(new t());
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
      let n = uN();
      return n == null ? null : dN(n);
    }
    resetBaseElement() {
      po = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return el(document.cookie, e);
    }
  },
  po = null;
function uN() {
  return (
    (po = po || document.querySelector("base")),
    po ? po.getAttribute("href") : null
  );
}
function dN(t) {
  return new URL(t, document.baseURI).pathname;
}
var ah = class {
    addToWindow(e) {
      (At.getAngularTestability = (r, i = !0) => {
        let s = e.findTestabilityInTree(r, i);
        if (s == null) throw new G(5103, !1);
        return s;
      }),
        (At.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (At.getAllAngularRootElements = () => e.getAllRootElements());
      let n = (r) => {
        let i = At.getAllAngularTestabilities(),
          s = i.length,
          o = function () {
            s--, s == 0 && r();
          };
        i.forEach((a) => {
          a.whenStable(o);
        });
      };
      At.frameworkStabilizers || (At.frameworkStabilizers = []),
        At.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(e, n, r) {
      if (n == null) return null;
      let i = e.getTestability(n);
      return (
        i ??
        (r
          ? un().isShadowRoot(n)
            ? this.findTestabilityInTree(e, n.host, !0)
            : this.findTestabilityInTree(e, n.parentElement, !0)
          : null)
      );
    }
  },
  fN = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  mo = new ie(""),
  YE = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((s) => {
            s.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, s) {
        return this._findPluginFor(i).addEventListener(r, i, s);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(r))), !i))
          throw new G(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(mo), X(Be));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Qi = class {
    constructor(e) {
      this._doc = e;
    }
  },
  ih = "ng-app-id",
  ZE = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = lo(o)),
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
        i.get(r)?.elements?.forEach((s) => s.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${ih}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((s) => {
              s.textContent != null && i.set(s.textContent, s);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let s = this.styleRef;
        if (s.has(r)) {
          let o = s.get(r);
          return (o.usage += i), o.usage;
        }
        return s.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let s = this.styleNodesInDOM,
          o = s?.get(i);
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(ih), o;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(ih, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let s = this.getStyleElement(r, i),
          o = this.styleRef,
          a = o.get(i)?.elements;
        a ? a.push(s) : o.set(i, { elements: [s], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e), X(Zr), X(vf, 8), X(Ft));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  sh = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  uh = /%COMP%/g,
  XE = "%COMP%",
  hN = `_nghost-${XE}`,
  pN = `_ngcontent-${XE}`,
  mN = !0,
  gN = new ie("", { providedIn: "root", factory: () => mN });
function yN(t) {
  return pN.replace(uh, t);
}
function vN(t) {
  return hN.replace(uh, t);
}
function JE(t, e) {
  return e.map((n) => n.replace(uh, t));
}
var ul = (() => {
    let e = class e {
      constructor(r, i, s, o, a, c, l, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = s),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = lo(c)),
          (this.defaultRenderer = new go(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === nn.ShadowDom &&
          (i = et(Z({}, i), { encapsulation: nn.Emulated }));
        let s = this.getOrCreateRenderer(r, i);
        return (
          s instanceof dl
            ? s.applyToHost(r)
            : s instanceof yo && s.applyStyles(),
          s
        );
      }
      getOrCreateRenderer(r, i) {
        let s = this.rendererByCompId,
          o = s.get(i.id);
        if (!o) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            g = this.platformIsServer;
          switch (i.encapsulation) {
            case nn.Emulated:
              o = new dl(l, u, i, this.appId, d, a, c, g);
              break;
            case nn.ShadowDom:
              return new ch(l, u, r, i, a, c, this.nonce, g);
            default:
              o = new yo(l, u, i, d, a, c, g);
              break;
          }
          s.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        X(YE),
        X(ZE),
        X(Zr),
        X(gN),
        X($e),
        X(Ft),
        X(Be),
        X(vf)
      );
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  go = class {
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
        ? this.doc.createElementNS(sh[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (QE(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (QE(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new G(-5104, !1);
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
        let s = sh[i];
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = sh[r];
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
      i & (qn.DashCase | qn.Important)
        ? e.style.setProperty(n, r, i & qn.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & qn.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
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
        ((e = un().getGlobalEventTarget(this.doc, e)), !e)
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
function QE(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var ch = class extends go {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = JE(i.id, i.styles);
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
  yo = class extends go {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? JE(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  dl = class extends yo {
    constructor(e, n, r, i, s, o, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, s, o, a, c, l),
        (this.contentAttr = yN(l)),
        (this.hostAttr = vN(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  EN = (() => {
    let e = class e extends Qi {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return (
          r.addEventListener(i, s, !1), () => this.removeEventListener(r, i, s)
        );
      }
      removeEventListener(r, i, s) {
        return r.removeEventListener(i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  KE = ["alt", "control", "meta", "shift"],
  bN = {
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
  wN = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  DN = (() => {
    let e = class e extends Qi {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, s) {
        let o = e.parseEventName(i),
          a = e.eventCallback(o.fullKey, s, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => un().onAndCancel(r, o.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          s = i.shift();
        if (i.length === 0 || !(s === "keydown" || s === "keyup")) return null;
        let o = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          KE.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = s), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(r, i) {
        let s = bN[r.key] || r.key,
          o = "";
        return (
          i.indexOf("code.") > -1 && ((s = r.code), (o = "code.")),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === " " ? (s = "space") : s === "." && (s = "dot"),
              KE.forEach((a) => {
                if (a !== s) {
                  let c = wN[a];
                  c(r) && (o += a + ".");
                }
              }),
              (o += s),
              o === i)
        );
      }
      static eventCallback(r, i, s) {
        return (o) => {
          e.matchEventFullKeyCode(o, r) && s.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function _N() {
  return new En();
}
var TN = new ie(""),
  SN = [
    { provide: io, useClass: ah, deps: [] },
    { provide: ro, useClass: Vi, deps: [Be, Wc, io] },
    { provide: Vi, useClass: Vi, deps: [Be, Wc, io] },
  ],
  CN = [
    { provide: Cc, useValue: "root" },
    { provide: En, useFactory: _N, deps: [] },
    { provide: mo, useClass: EN, multi: !0, deps: [$e, Be, Ft] },
    { provide: mo, useClass: DN, multi: !0, deps: [$e] },
    ul,
    ZE,
    YE,
    { provide: Qr, useExisting: ul },
    { provide: Er, useClass: fN, deps: [] },
    [],
  ],
  fl = (() => {
    let e = class e {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: e, providers: [{ provide: Zr, useValue: r.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(TN, 12));
    }),
      (e.ɵmod = Ot({ type: e })),
      (e.ɵinj = Rt({ providers: [...CN, ...SN], imports: [IE, lE] }));
    let t = e;
    return t;
  })();
var eb = (() => {
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
    return new (i || e)(X($e));
  }),
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var lh = (function (t) {
  return (
    (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    t
  );
})(lh || {});
function N2(...t) {
  let e = [],
    n = new Set(),
    r = n.has(lh.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: s } of t) n.add(s), i.length && e.push(i);
  return Yr([[], dE(), n.has(lh.NoHttpTransferCache) || r ? [] : WE({}), e]);
}
var De = (function (t) {
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
  })(De || {}),
  _n = "*";
function tb(t, e = null) {
  return { type: De.Sequence, steps: t, options: e };
}
function dh(t) {
  return { type: De.Style, styles: t, offset: null };
}
var Dr = class {
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
  vo = class {
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
        s = this.players.length;
      s == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((o) => {
            o.onDone(() => {
              ++n == s && this._onFinish();
            }),
              o.onDestroy(() => {
                ++r == s && this._onDestroy();
              }),
              o.onStart(() => {
                ++i == s && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (o, a) => Math.max(o, a.totalTime),
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
  hl = "!";
function nb(t) {
  return new G(3e3, !1);
}
function NN() {
  return new G(3100, !1);
}
function MN() {
  return new G(3101, !1);
}
function AN(t) {
  return new G(3001, !1);
}
function xN(t) {
  return new G(3003, !1);
}
function RN(t) {
  return new G(3004, !1);
}
function ON(t, e) {
  return new G(3005, !1);
}
function kN() {
  return new G(3006, !1);
}
function LN() {
  return new G(3007, !1);
}
function PN(t, e) {
  return new G(3008, !1);
}
function FN(t) {
  return new G(3002, !1);
}
function jN(t, e, n, r, i) {
  return new G(3010, !1);
}
function BN() {
  return new G(3011, !1);
}
function HN() {
  return new G(3012, !1);
}
function UN() {
  return new G(3200, !1);
}
function VN() {
  return new G(3202, !1);
}
function qN() {
  return new G(3013, !1);
}
function $N(t) {
  return new G(3014, !1);
}
function zN(t) {
  return new G(3015, !1);
}
function GN(t) {
  return new G(3016, !1);
}
function WN(t, e) {
  return new G(3404, !1);
}
function QN(t) {
  return new G(3502, !1);
}
function KN(t) {
  return new G(3503, !1);
}
function YN() {
  return new G(3300, !1);
}
function ZN(t) {
  return new G(3504, !1);
}
function XN(t) {
  return new G(3301, !1);
}
function JN(t, e) {
  return new G(3302, !1);
}
function eM(t) {
  return new G(3303, !1);
}
function tM(t, e) {
  return new G(3400, !1);
}
function nM(t) {
  return new G(3401, !1);
}
function rM(t) {
  return new G(3402, !1);
}
function iM(t, e) {
  return new G(3505, !1);
}
function _r(t) {
  switch (t.length) {
    case 0:
      return new Dr();
    case 1:
      return t[0];
    default:
      return new vo(t);
  }
}
function gb(t, e, n = new Map(), r = new Map()) {
  let i = [],
    s = [],
    o = -1,
    a = null;
  if (
    (e.forEach((c) => {
      let l = c.get("offset"),
        u = l == o,
        d = (u && a) || new Map();
      c.forEach((g, b) => {
        let I = b,
          M = g;
        if (b !== "offset")
          switch (((I = t.normalizePropertyName(I, i)), M)) {
            case hl:
              M = n.get(b);
              break;
            case _n:
              M = r.get(b);
              break;
            default:
              M = t.normalizeStyleValue(b, I, M, i);
              break;
          }
        d.set(I, M);
      }),
        u || s.push(d),
        (a = d),
        (o = l);
    }),
    i.length)
  )
    throw QN(i);
  return s;
}
function kh(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && fh(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && fh(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && fh(n, "destroy", t)));
      break;
  }
}
function fh(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    s = Lh(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i
    ),
    o = t._data;
  return o != null && (s._data = o), s;
}
function Lh(t, e, n, r, i = "", s = 0, o) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: s,
    disabled: !!o,
  };
}
function Bt(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function rb(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var sM = typeof document > "u" ? null : document.documentElement;
function Ph(t) {
  let e = t.parentNode || t.host || null;
  return e === sM ? null : e;
}
function oM(t) {
  return t.substring(1, 6) == "ebkit";
}
var ti = null,
  ib = !1;
function aM(t) {
  ti ||
    ((ti = cM() || {}), (ib = ti.style ? "WebkitAppearance" in ti.style : !1));
  let e = !0;
  return (
    ti.style &&
      !oM(t) &&
      ((e = t in ti.style),
      !e &&
        ib &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in ti.style)),
    e
  );
}
function cM() {
  return typeof document < "u" ? document.body : null;
}
function yb(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = Ph(e);
  }
  return !1;
}
function vb(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var Fh = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return aM(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return yb(r, i);
      }
      getParentElement(r) {
        return Ph(r);
      }
      query(r, i, s) {
        return vb(r, i, s);
      }
      computeStyle(r, i, s) {
        return s || "";
      }
      animate(r, i, s, o, a, c = [], l) {
        return new Dr(s, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Uh = class Uh {};
Uh.NOOP = new Fh();
var ii = Uh,
  si = class {};
var lM = 1e3,
  Eb = "{{",
  uM = "}}",
  bb = "ng-enter",
  vh = "ng-leave",
  pl = "ng-trigger",
  El = ".ng-trigger",
  sb = "ng-animating",
  Eh = ".ng-animating";
function zn(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : bh(parseFloat(e[1]), e[2]);
}
function bh(t, e) {
  switch (e) {
    case "s":
      return t * lM;
    default:
      return t;
  }
}
function bl(t, e, n) {
  return t.hasOwnProperty("duration") ? t : dM(t, e, n);
}
function dM(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    s = 0,
    o = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(nb(t)), { duration: 0, delay: 0, easing: "" };
    i = bh(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (s = bh(parseFloat(c), a[4]));
    let l = a[5];
    l && (o = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(NN()), (a = !0)),
      s < 0 && (e.push(MN()), (a = !0)),
      a && e.splice(c, 0, nb(t));
  }
  return { duration: i, delay: s, easing: o };
}
function fM(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function Tn(t, e, n) {
  e.forEach((r, i) => {
    let s = jh(i);
    n && !n.has(i) && n.set(i, t.style[s]), (t.style[s] = r);
  });
}
function ri(t, e) {
  e.forEach((n, r) => {
    let i = jh(r);
    t.style[i] = "";
  });
}
function Eo(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : tb(t)) : t;
}
function hM(t, e, n) {
  let r = e.params || {},
    i = wb(t);
  i.length &&
    i.forEach((s) => {
      r.hasOwnProperty(s) || n.push(AN(s));
    });
}
var wh = new RegExp(`${Eb}\\s*(.+?)\\s*${uM}`, "g");
function wb(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = wh.exec(t)); ) e.push(n[1]);
    wh.lastIndex = 0;
  }
  return e;
}
function wo(t, e, n) {
  let r = `${t}`,
    i = r.replace(wh, (s, o) => {
      let a = e[o];
      return a == null && (n.push(xN(o)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
var pM = /-+([a-z0-9])/g;
function jh(t) {
  return t.replace(pM, (...e) => e[1].toUpperCase());
}
function mM(t, e) {
  return t === 0 || e === 0;
}
function gM(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((s, o) => {
        r.has(o) || i.push(o), r.set(o, s);
      }),
      i.length)
    )
      for (let s = 1; s < e.length; s++) {
        let o = e[s];
        i.forEach((a) => o.set(a, Bh(t, a)));
      }
  }
  return e;
}
function jt(t, e, n) {
  switch (e.type) {
    case De.Trigger:
      return t.visitTrigger(e, n);
    case De.State:
      return t.visitState(e, n);
    case De.Transition:
      return t.visitTransition(e, n);
    case De.Sequence:
      return t.visitSequence(e, n);
    case De.Group:
      return t.visitGroup(e, n);
    case De.Animate:
      return t.visitAnimate(e, n);
    case De.Keyframes:
      return t.visitKeyframes(e, n);
    case De.Style:
      return t.visitStyle(e, n);
    case De.Reference:
      return t.visitReference(e, n);
    case De.AnimateChild:
      return t.visitAnimateChild(e, n);
    case De.AnimateRef:
      return t.visitAnimateRef(e, n);
    case De.Query:
      return t.visitQuery(e, n);
    case De.Stagger:
      return t.visitStagger(e, n);
    default:
      throw RN(e.type);
  }
}
function Bh(t, e) {
  return window.getComputedStyle(t)[e];
}
var yM = new Set([
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
  wl = class extends si {
    normalizePropertyName(e, n) {
      return jh(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let s = "",
        o = r.toString().trim();
      if (yM.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") s = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(ON(e, r));
        }
      return o + s;
    }
  };
var Dl = "*";
function vM(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => EM(r, n, e))
      : n.push(t),
    n
  );
}
function EM(t, e, n) {
  if (t[0] == ":") {
    let c = bM(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(zN(t)), e;
  let i = r[1],
    s = r[2],
    o = r[3];
  e.push(ob(i, o));
  let a = i == Dl && o == Dl;
  s[0] == "<" && !a && e.push(ob(o, i));
}
function bM(t, e) {
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
      return e.push(GN(t)), "* => *";
  }
}
var ml = new Set(["true", "1"]),
  gl = new Set(["false", "0"]);
function ob(t, e) {
  let n = ml.has(t) || gl.has(t),
    r = ml.has(e) || gl.has(e);
  return (i, s) => {
    let o = t == Dl || t == i,
      a = e == Dl || e == s;
    return (
      !o && n && typeof i == "boolean" && (o = i ? ml.has(t) : gl.has(t)),
      !a && r && typeof s == "boolean" && (a = s ? ml.has(e) : gl.has(e)),
      o && a
    );
  };
}
var Db = ":self",
  wM = new RegExp(`s*${Db}s*,?`, "g");
function _b(t, e, n, r) {
  return new Dh(t).build(e, n, r);
}
var ab = "",
  Dh = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new _h(n);
      return this._resetContextStyleTimingState(i), jt(this, Eo(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = ab),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(ab, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        s = [],
        o = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(kN()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == De.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), s.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == De.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), o.push(c);
          } else n.errors.push(LN());
        }),
        {
          type: De.Trigger,
          name: e.name,
          states: s,
          transitions: o,
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
        let s = new Set(),
          o = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((c) => {
              wb(c).forEach((l) => {
                o.hasOwnProperty(l) || s.add(l);
              });
            });
        }),
          s.size && n.errors.push(PN(e.name, [...s.values()]));
      }
      return {
        type: De.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = jt(this, Eo(e.animation), n),
        i = vM(e.expr, n.errors);
      return {
        type: De.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: ni(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: De.Sequence,
        steps: e.steps.map((r) => jt(this, r, n)),
        options: ni(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        s = e.steps.map((o) => {
          n.currentTime = r;
          let a = jt(this, o, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i),
        { type: De.Group, steps: s, options: ni(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = SM(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        s = e.styles ? e.styles : dh({});
      if (s.type == De.Keyframes) i = this.visitKeyframes(s, n);
      else {
        let o = e.styles,
          a = !1;
        if (!o) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (o = dh(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(o, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: De.Animate, timings: r, style: i, options: null }
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
          ? a === _n
            ? r.push(a)
            : n.errors.push(FN(a))
          : r.push(new Map(Object.entries(a)));
      let s = !1,
        o = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((o = a.get("easing")), a.delete("easing")), !s)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(Eb) >= 0) {
                s = !0;
                break;
              }
          }
        }),
        {
          type: De.Style,
          styles: r,
          easing: o,
          offset: e.offset,
          containsDynamicStyles: s,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        s = n.currentTime;
      r && s > 0 && (s -= r.duration + r.delay),
        e.styles.forEach((o) => {
          typeof o != "string" &&
            o.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (s != i &&
                  s >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(jN(c, u.startTime, u.endTime, s, i)),
                  (d = !1)),
                (s = u.startTime)),
                d && l.set(c, { startTime: s, endTime: i }),
                n.options && hM(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: De.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(BN()), r;
      let i = 1,
        s = 0,
        o = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((R) => {
          let _ = this._makeStyleAst(R, n),
            w = _.offset != null ? _.offset : TM(_.styles),
            T = 0;
          return (
            w != null && (s++, (T = _.offset = w)),
            (c = c || T < 0 || T > 1),
            (a = a || T < l),
            (l = T),
            o.push(T),
            _
          );
        });
      c && n.errors.push(HN()), a && n.errors.push(UN());
      let d = e.steps.length,
        g = 0;
      s > 0 && s < d ? n.errors.push(VN()) : s == 0 && (g = i / (d - 1));
      let b = d - 1,
        I = n.currentTime,
        M = n.currentAnimateTimings,
        F = M.duration;
      return (
        u.forEach((R, _) => {
          let w = g > 0 ? (_ == b ? 1 : g * _) : o[_],
            T = w * F;
          (n.currentTime = I + M.delay + T),
            (M.duration = T),
            this._validateStyleAst(R, n),
            (R.offset = w),
            r.styles.push(R);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: De.Reference,
        animation: jt(this, Eo(e.animation), n),
        options: ni(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: De.AnimateChild, options: ni(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: De.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: ni(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [s, o] = DM(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + s : s),
        Bt(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = jt(this, Eo(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: De.Query,
          selector: s,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: o,
          animation: a,
          originalSelector: e.selector,
          options: ni(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(qN());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : bl(e.timings, n.errors, !0);
      return {
        type: De.Stagger,
        animation: jt(this, Eo(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function DM(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == Db);
  return (
    e && (t = t.replace(wM, "")),
    (t = t
      .replace(/@\*/g, El)
      .replace(/@\w+/g, (n) => El + "-" + n.slice(1))
      .replace(/:animating/g, Eh)),
    [t, e]
  );
}
function _M(t) {
  return t ? Z({}, t) : null;
}
var _h = class {
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
function TM(t) {
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
function SM(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let s = bl(t, e).duration;
    return hh(s, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((s) => s.charAt(0) == "{" && s.charAt(1) == "{")) {
    let s = hh(0, 0, "");
    return (s.dynamic = !0), (s.strValue = n), s;
  }
  let i = bl(n, e);
  return hh(i.duration, i.delay, i.easing);
}
function ni(t) {
  return (
    t ? ((t = Z({}, t)), t.params && (t.params = _M(t.params))) : (t = {}), t
  );
}
function hh(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function Hh(t, e, n, r, i, s, o = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: s,
    totalTime: i + s,
    easing: o,
    subTimeline: a,
  };
}
var Do = class {
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
  CM = 1,
  IM = ":enter",
  NM = new RegExp(IM, "g"),
  MM = ":leave",
  AM = new RegExp(MM, "g");
function Tb(t, e, n, r, i, s = new Map(), o = new Map(), a, c, l = []) {
  return new Th().buildKeyframes(t, e, n, r, i, s, o, a, c, l);
}
var Th = class {
    buildKeyframes(e, n, r, i, s, o, a, c, l, u = []) {
      l = l || new Do();
      let d = new Sh(e, n, l, i, s, u, []);
      d.options = c;
      let g = c.delay ? zn(c.delay) : 0;
      d.currentTimeline.delayNextStep(g),
        d.currentTimeline.setStyles([o], null, d.errors, c),
        jt(this, r, d);
      let b = d.timelines.filter((I) => I.containsAnimation());
      if (b.length && a.size) {
        let I;
        for (let M = b.length - 1; M >= 0; M--) {
          let F = b[M];
          if (F.element === n) {
            I = F;
            break;
          }
        }
        I &&
          !I.allowOnlyTimelineStyles() &&
          I.setStyles([a], null, d.errors, c);
      }
      return b.length
        ? b.map((I) => I.buildKeyframes())
        : [Hh(n, [], [], [], 0, g, "", !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          s = n.currentTimeline.currentTime,
          o = this._visitSubInstructions(r, i, i.options);
        s != o && n.transformIntoNewTimeline(o);
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
        let s = i?.delay;
        if (s) {
          let o =
            typeof s == "number" ? s : zn(wo(s, i?.params ?? {}, n.errors));
          r.delayNextStep(o);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let s = n.currentTimeline.currentTime,
        o = r.duration != null ? zn(r.duration) : null,
        a = r.delay != null ? zn(r.delay) : null;
      return (
        o !== 0 &&
          e.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, o, a);
            s = Math.max(s, l.duration + l.delay);
          }),
        s
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        jt(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        s = e.options;
      if (
        s &&
        (s.params || s.delay) &&
        ((i = n.createSubContext(s)),
        i.transformIntoNewTimeline(),
        s.delay != null)
      ) {
        i.previousNode.type == De.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = _l));
        let o = zn(s.delay);
        i.delayNextStep(o);
      }
      e.steps.length &&
        (e.steps.forEach((o) => jt(this, o, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        s = e.options && e.options.delay ? zn(e.options.delay) : 0;
      e.steps.forEach((o) => {
        let a = n.createSubContext(e.options);
        s && a.delayNextStep(s),
          jt(this, o, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((o) => n.currentTimeline.mergeTimelineCollectedStyles(o)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? wo(r, n.params, n.errors) : r;
        return bl(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let s = e.style;
      s.type == De.Keyframes
        ? this.visitKeyframes(s, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(s, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let s = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(s)
        : r.setStyles(e.styles, s, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        s = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * s),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + s),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        s = i.delay ? zn(i.delay) : 0;
      s &&
        (n.previousNode.type === De.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = _l));
      let o = r,
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
        s && d.delayNextStep(s),
          l === n.element && (c = d.currentTimeline),
          jt(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let g = d.currentTimeline.currentTime;
        o = Math.max(o, g);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(o),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        s = e.timings,
        o = Math.abs(s.duration),
        a = o * (n.currentQueryTotal - 1),
        c = o * n.currentQueryIndex;
      switch (s.duration < 0 ? "reverse" : s.easing) {
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
      jt(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  _l = {},
  Sh = class t {
    constructor(e, n, r, i, s, o, a, c) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = s),
        (this.errors = o),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = _l),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new Tl(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = zn(r.duration)),
        r.delay != null && (i.delay = zn(r.delay));
      let s = r.params;
      if (s) {
        let o = i.params;
        o || (o = this.options.params = {}),
          Object.keys(s).forEach((a) => {
            (!n || !o.hasOwnProperty(a)) && (o[a] = wo(s[a], o, this.errors));
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
        s = new t(
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
        (s.previousNode = this.previousNode),
        (s.currentAnimateTimings = this.currentAnimateTimings),
        (s.options = this._copyOptions()),
        s.updateOptions(e),
        (s.currentQueryIndex = this.currentQueryIndex),
        (s.currentQueryTotal = this.currentQueryTotal),
        (s.parentContext = this),
        this.subContextCount++,
        s
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = _l),
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
        s = new Ch(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe
        );
      return this.timelines.push(s), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, s, o) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(NM, "." + this._enterClassName)),
          (e = e.replace(AM, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !s && a.length == 0 && o.push($N(n)), a;
    }
  },
  Tl = class t {
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
      (this.duration += CM), this._loadKeyframe();
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
        this._backFill.set(n, r || _n), this._currentKeyframe.set(n, _n);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let s = (i && i.params) || {},
        o = xM(e, this._globalTimelineStyles);
      for (let [a, c] of o) {
        let l = wo(c, s, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? _n),
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
          u === hl ? e.add(d) : u === _n && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let s = [...e.values()],
        o = [...n.values()];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return Hh(
        this.element,
        i,
        s,
        o,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  Ch = class extends Tl {
    constructor(e, n, r, i, s, o, a = !1) {
      super(e, n, o.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = s),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: o.duration,
          delay: o.delay,
          easing: o.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let s = [],
          o = r + n,
          a = n / o,
          c = new Map(e[0]);
        c.set("offset", 0), s.push(c);
        let l = new Map(e[0]);
        l.set("offset", cb(a)), s.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let g = new Map(e[d]),
            b = g.get("offset"),
            I = n + b * r;
          g.set("offset", cb(I / o)), s.push(g);
        }
        (r = o), (n = 0), (i = ""), (e = s);
      }
      return Hh(
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
function cb(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function xM(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r ??= e.keys();
        for (let s of r) n.set(s, _n);
      } else for (let [s, o] of i) n.set(s, o);
    }),
    n
  );
}
function lb(t, e, n, r, i, s, o, a, c, l, u, d, g) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: s,
    toState: r,
    toStyles: o,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: g,
  };
}
var ph = {},
  Sl = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return RM(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, s, o, a, c, l, u) {
      let d = [],
        g = (this.ast.options && this.ast.options.params) || ph,
        b = (a && a.params) || ph,
        I = this.buildStyles(r, b, d),
        M = (c && c.params) || ph,
        F = this.buildStyles(i, M, d),
        R = new Set(),
        _ = new Map(),
        w = new Map(),
        T = i === "void",
        E = { params: Sb(M, g), delay: this.ast.options?.delay },
        te = u ? [] : Tb(e, n, this.ast.animation, s, o, I, F, E, l, d),
        re = 0;
      return (
        te.forEach((pe) => {
          re = Math.max(pe.duration + pe.delay, re);
        }),
        d.length
          ? lb(n, this._triggerName, r, i, T, I, F, [], [], _, w, re, d)
          : (te.forEach((pe) => {
              let z = pe.element,
                O = Bt(_, z, new Set());
              pe.preStyleProps.forEach((Y) => O.add(Y));
              let j = Bt(w, z, new Set());
              pe.postStyleProps.forEach((Y) => j.add(Y)), z !== n && R.add(z);
            }),
            lb(
              n,
              this._triggerName,
              r,
              i,
              T,
              I,
              F,
              te,
              [...R.values()],
              _,
              w,
              re
            ))
      );
    }
  };
function RM(t, e, n, r, i) {
  return t.some((s) => s(e, n, r, i));
}
function Sb(t, e) {
  let n = Z({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var Ih = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = Sb(e, this.defaultParams);
    return (
      this.styles.styles.forEach((s) => {
        typeof s != "string" &&
          s.forEach((o, a) => {
            o && (o = wo(o, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (o = this.normalizer.normalizeStyleValue(a, c, o, n)), r.set(a, o);
          });
      }),
      r
    );
  }
};
function OM(t, e, n) {
  return new Nh(t, e, n);
}
var Nh = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let s = (i.options && i.options.params) || {};
        this.states.set(i.name, new Ih(i.style, s, r));
      }),
      ub(this.states, "true", "1"),
      ub(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new Sl(e, i, this.states));
      }),
      (this.fallbackTransition = kM(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((o) => o.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function kM(t, e, n) {
  let r = [(o, a) => !0],
    i = { type: De.Sequence, steps: [], options: null },
    s = {
      type: De.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Sl(t, s, e);
}
function ub(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var LM = new Do(),
  Mh = class {
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
        s = _b(this._driver, n, r, i);
      if (r.length) throw KN(r);
      i.length && void 0, this._animations.set(e, s);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        s = gb(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, s, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        s = this._animations.get(e),
        o,
        a = new Map();
      if (
        (s
          ? ((o = Tb(
              this._driver,
              n,
              s,
              bb,
              vh,
              new Map(),
              new Map(),
              r,
              LM,
              i
            )),
            o.forEach((u) => {
              let d = Bt(a, u.element, new Map());
              u.postStyleProps.forEach((g) => d.set(g, null));
            }))
          : (i.push(YN()), (o = [])),
        i.length)
      )
        throw ZN(i);
      a.forEach((u, d) => {
        u.forEach((g, b) => {
          u.set(b, this._driver.computeStyle(d, b, _n));
        });
      });
      let c = o.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = _r(c);
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
      if (!n) throw XN(e);
      return n;
    }
    listen(e, n, r, i) {
      let s = Lh(n, "", "", "");
      return kh(this._getPlayer(e), r, s, i), () => {};
    }
    command(e, n, r, i) {
      if (r == "register") {
        this.register(e, i[0]);
        return;
      }
      if (r == "create") {
        let o = i[0] || {};
        this.create(e, n, o);
        return;
      }
      let s = this._getPlayer(e);
      switch (r) {
        case "play":
          s.play();
          break;
        case "pause":
          s.pause();
          break;
        case "reset":
          s.reset();
          break;
        case "restart":
          s.restart();
          break;
        case "finish":
          s.finish();
          break;
        case "init":
          s.init();
          break;
        case "setPosition":
          s.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  db = "ng-animate-queued",
  PM = ".ng-animate-queued",
  mh = "ng-animate-disabled",
  FM = ".ng-animate-disabled",
  jM = "ng-star-inserted",
  BM = ".ng-star-inserted",
  HM = [],
  Cb = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  UM = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  dn = "__ng_removed",
  _o = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = qM(i)), r)) {
        let s = e,
          { value: o } = s,
          a = ba(s, ["value"]);
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
  bo = "void",
  gh = new _o(bo),
  Ah = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Qt(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw JN(r, n);
      if (r == null || r.length == 0) throw eM(n);
      if (!$M(r)) throw tM(r, n);
      let s = Bt(this._elementListeners, e, []),
        o = { name: n, phase: r, callback: i };
      s.push(o);
      let a = Bt(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (Qt(e, pl), Qt(e, pl + "-" + n), a.set(n, gh)),
        () => {
          this._engine.afterFlush(() => {
            let c = s.indexOf(o);
            c >= 0 && s.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw nM(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let s = this._getTrigger(n),
        o = new To(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Qt(e, pl),
        Qt(e, pl + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new _o(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = gh),
        !(l.value === bo) && c.value === l.value)
      ) {
        if (!WM(c.params, l.params)) {
          let M = [],
            F = s.matchStyles(c.value, c.params, M),
            R = s.matchStyles(l.value, l.params, M);
          M.length
            ? this._engine.reportError(M)
            : this._engine.afterFlush(() => {
                ri(e, F), Tn(e, R);
              });
        }
        return;
      }
      let g = Bt(this._engine.playersByElement, e, []);
      g.forEach((M) => {
        M.namespaceId == this.id &&
          M.triggerName == n &&
          M.queued &&
          M.destroy();
      });
      let b = s.matchTransition(c.value, l.value, e, l.params),
        I = !1;
      if (!b) {
        if (!i) return;
        (b = s.fallbackTransition), (I = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: b,
          fromState: c,
          toState: l,
          player: o,
          isFallbackTransition: I,
        }),
        I ||
          (Qt(e, db),
          o.onStart(() => {
            Ki(e, db);
          })),
        o.onDone(() => {
          let M = this.players.indexOf(o);
          M >= 0 && this.players.splice(M, 1);
          let F = this._engine.playersByElement.get(e);
          if (F) {
            let R = F.indexOf(o);
            R >= 0 && F.splice(R, 1);
          }
        }),
        this.players.push(o),
        g.push(o),
        o
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
      let r = this._engine.driver.query(e, El, !0);
      r.forEach((i) => {
        if (i[dn]) return;
        let s = this._engine.fetchNamespacesByElement(i);
        s.size
          ? s.forEach((o) => o.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i))
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let s = this._engine.statesByElement.get(e),
        o = new Map();
      if (s) {
        let a = [];
        if (
          (s.forEach((c, l) => {
            if ((o.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(e, l, bo, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, o),
            r && _r(a).onDone(() => this._engine.processLeaveNode(e)),
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
        n.forEach((s) => {
          let o = s.name;
          if (i.has(o)) return;
          i.add(o);
          let c = this._triggers.get(o).fallbackTransition,
            l = r.get(o) || gh,
            u = new _o(bo),
            d = new To(this.id, o, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: o,
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
        let s = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (s && s.length) i = !0;
        else {
          let o = e;
          for (; (o = o.parentNode); )
            if (r.statesByElement.get(o)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let s = e[dn];
        (!s || s === Cb) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      Qt(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let s = r.element,
            o = this._elementListeners.get(s);
          o &&
            o.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = Lh(
                  s,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value
                );
                (c._data = e), kh(r.player, a.phase, c, a.callback);
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
          let s = r.transition.ast.depCount,
            o = i.transition.ast.depCount;
          return s == 0 || o == 0
            ? s - o
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
  xh = class {
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
        (this.onRemovalComplete = (s, o) => {});
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
      let r = new Ah(e, n, this);
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
        let o = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, e), (o = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        o || r.unshift(e);
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
            let s = this._fetchNamespace(i.namespaceId);
            s && n.add(s);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (yl(n)) {
        let s = this._fetchNamespace(e);
        if (s) return s.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!yl(n)) return;
      let s = n[dn];
      if (s && s.setForRemoval) {
        (s.setForRemoval = !1), (s.setForMove = !0);
        let o = this.collectedLeaveElements.indexOf(n);
        o >= 0 && this.collectedLeaveElements.splice(o, 1);
      }
      if (e) {
        let o = this._fetchNamespace(e);
        o && o.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Qt(e, mh))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), Ki(e, mh));
    }
    removeNode(e, n, r) {
      if (yl(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let s = this.namespacesByHostElement.get(n);
        s && s.id !== e && s.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, s) {
      this.collectedLeaveElements.push(n),
        (n[dn] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: s,
        });
    }
    listen(e, n, r, i, s) {
      return yl(n) ? this._fetchNamespace(e).listen(n, r, i, s) : () => {};
    }
    _buildInstruction(e, n, r, i, s) {
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
        s
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, El, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Eh, !0)),
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
        if (this.players.length) return _r(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[dn];
      if (n && n.setForRemoval) {
        if (((e[dn] = Cb), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(mh) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, FM, !0).forEach((r) => {
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
          Qt(i, jM);
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
            ? _r(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw rM(e);
    }
    _flushAnimations(e, n) {
      let r = new Do(),
        i = [],
        s = new Map(),
        o = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((y) => {
        u.add(y);
        let C = this.driver.query(y, PM, !0);
        for (let x = 0; x < C.length; x++) u.add(C[x]);
      });
      let d = this.bodyNode,
        g = Array.from(this.statesByElement.keys()),
        b = pb(g, this.collectedEnterElements),
        I = new Map(),
        M = 0;
      b.forEach((y, C) => {
        let x = bb + M++;
        I.set(C, x), y.forEach((V) => Qt(V, x));
      });
      let F = [],
        R = new Set(),
        _ = new Set();
      for (let y = 0; y < this.collectedLeaveElements.length; y++) {
        let C = this.collectedLeaveElements[y],
          x = C[dn];
        x &&
          x.setForRemoval &&
          (F.push(C),
          R.add(C),
          x.hasAnimation
            ? this.driver.query(C, BM, !0).forEach((V) => R.add(V))
            : _.add(C));
      }
      let w = new Map(),
        T = pb(g, Array.from(R));
      T.forEach((y, C) => {
        let x = vh + M++;
        w.set(C, x), y.forEach((V) => Qt(V, x));
      }),
        e.push(() => {
          b.forEach((y, C) => {
            let x = I.get(C);
            y.forEach((V) => Ki(V, x));
          }),
            T.forEach((y, C) => {
              let x = w.get(C);
              y.forEach((V) => Ki(V, x));
            }),
            F.forEach((y) => {
              this.processLeaveNode(y);
            });
        });
      let E = [],
        te = [];
      for (let y = this._namespaceList.length - 1; y >= 0; y--)
        this._namespaceList[y].drainQueuedTransitions(n).forEach((x) => {
          let V = x.player,
            K = x.element;
          if ((E.push(V), this.collectedEnterElements.length)) {
            let ot = K[dn];
            if (ot && ot.setForMove) {
              if (
                ot.previousTriggersValues &&
                ot.previousTriggersValues.has(x.triggerName)
              ) {
                let In = ot.previousTriggersValues.get(x.triggerName),
                  Et = this.statesByElement.get(x.element);
                if (Et && Et.has(x.triggerName)) {
                  let li = Et.get(x.triggerName);
                  (li.value = In), Et.set(x.triggerName, li);
                }
              }
              V.destroy();
              return;
            }
          }
          let he = !d || !this.driver.containsElement(d, K),
            S = w.get(K),
            k = I.get(K),
            $ = this._buildInstruction(x, r, k, S, he);
          if ($.errors && $.errors.length) {
            te.push($);
            return;
          }
          if (he) {
            V.onStart(() => ri(K, $.fromStyles)),
              V.onDestroy(() => Tn(K, $.toStyles)),
              i.push(V);
            return;
          }
          if (x.isFallbackTransition) {
            V.onStart(() => ri(K, $.fromStyles)),
              V.onDestroy(() => Tn(K, $.toStyles)),
              i.push(V);
            return;
          }
          let _e = [];
          $.timelines.forEach((ot) => {
            (ot.stretchStartingKeyframe = !0),
              this.disabledNodes.has(ot.element) || _e.push(ot);
          }),
            ($.timelines = _e),
            r.append(K, $.timelines);
          let gt = { instruction: $, player: V, element: K };
          o.push(gt),
            $.queriedElements.forEach((ot) => Bt(a, ot, []).push(V)),
            $.preStyleProps.forEach((ot, In) => {
              if (ot.size) {
                let Et = c.get(In);
                Et || c.set(In, (Et = new Set())),
                  ot.forEach((li, ls) => Et.add(ls));
              }
            }),
            $.postStyleProps.forEach((ot, In) => {
              let Et = l.get(In);
              Et || l.set(In, (Et = new Set())),
                ot.forEach((li, ls) => Et.add(ls));
            });
        });
      if (te.length) {
        let y = [];
        te.forEach((C) => {
          y.push(iM(C.triggerName, C.errors));
        }),
          E.forEach((C) => C.destroy()),
          this.reportError(y);
      }
      let re = new Map(),
        pe = new Map();
      o.forEach((y) => {
        let C = y.element;
        r.has(C) &&
          (pe.set(C, C),
          this._beforeAnimationBuild(y.player.namespaceId, y.instruction, re));
      }),
        i.forEach((y) => {
          let C = y.element;
          this._getPreviousPlayers(
            C,
            !1,
            y.namespaceId,
            y.triggerName,
            null
          ).forEach((V) => {
            Bt(re, C, []).push(V), V.destroy();
          });
        });
      let z = F.filter((y) => mb(y, c, l)),
        O = new Map();
      hb(O, this.driver, _, l, _n).forEach((y) => {
        mb(y, c, l) && z.push(y);
      });
      let Y = new Map();
      b.forEach((y, C) => {
        hb(Y, this.driver, new Set(y), c, hl);
      }),
        z.forEach((y) => {
          let C = O.get(y),
            x = Y.get(y);
          O.set(y, new Map([...(C?.entries() ?? []), ...(x?.entries() ?? [])]));
        });
      let v = [],
        m = [],
        p = {};
      o.forEach((y) => {
        let { element: C, player: x, instruction: V } = y;
        if (r.has(C)) {
          if (u.has(C)) {
            x.onDestroy(() => Tn(C, V.toStyles)),
              (x.disabled = !0),
              x.overrideTotalTime(V.totalTime),
              i.push(x);
            return;
          }
          let K = p;
          if (pe.size > 1) {
            let S = C,
              k = [];
            for (; (S = S.parentNode); ) {
              let $ = pe.get(S);
              if ($) {
                K = $;
                break;
              }
              k.push(S);
            }
            k.forEach(($) => pe.set($, K));
          }
          let he = this._buildAnimation(x.namespaceId, V, re, s, Y, O);
          if ((x.setRealPlayer(he), K === p)) v.push(x);
          else {
            let S = this.playersByElement.get(K);
            S && S.length && (x.parentPlayer = _r(S)), i.push(x);
          }
        } else
          ri(C, V.fromStyles),
            x.onDestroy(() => Tn(C, V.toStyles)),
            m.push(x),
            u.has(C) && i.push(x);
      }),
        m.forEach((y) => {
          let C = s.get(y.element);
          if (C && C.length) {
            let x = _r(C);
            y.setRealPlayer(x);
          }
        }),
        i.forEach((y) => {
          y.parentPlayer ? y.syncPlayerEvents(y.parentPlayer) : y.destroy();
        });
      for (let y = 0; y < F.length; y++) {
        let C = F[y],
          x = C[dn];
        if ((Ki(C, vh), x && x.hasAnimation)) continue;
        let V = [];
        if (a.size) {
          let he = a.get(C);
          he && he.length && V.push(...he);
          let S = this.driver.query(C, Eh, !0);
          for (let k = 0; k < S.length; k++) {
            let $ = a.get(S[k]);
            $ && $.length && V.push(...$);
          }
        }
        let K = V.filter((he) => !he.destroyed);
        K.length ? zM(this, C, K) : this.processLeaveNode(C);
      }
      return (
        (F.length = 0),
        v.forEach((y) => {
          this.players.push(y),
            y.onDone(() => {
              y.destroy();
              let C = this.players.indexOf(y);
              this.players.splice(C, 1);
            }),
            y.play();
        }),
        v
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, s) {
      let o = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (o = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let c = !s || s == bo;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || o.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (o = o.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
          )),
        o
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        s = n.element,
        o = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== s,
          d = Bt(r, l, []);
        this._getPreviousPlayers(l, u, o, a, n.toState).forEach((b) => {
          let I = b.getRealPlayer();
          I.beforeDestroy && I.beforeDestroy(), b.destroy(), d.push(b);
        });
      }
      ri(s, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, s, o) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        g = n.timelines.map((I) => {
          let M = I.element;
          u.add(M);
          let F = M[dn];
          if (F && F.removedBeforeQueried) return new Dr(I.duration, I.delay);
          let R = M !== c,
            _ = GM((r.get(M) || HM).map((re) => re.getRealPlayer())).filter(
              (re) => {
                let pe = re;
                return pe.element ? pe.element === M : !1;
              }
            ),
            w = s.get(M),
            T = o.get(M),
            E = gb(this._normalizer, I.keyframes, w, T),
            te = this._buildPlayer(I, E, _);
          if ((I.subTimeline && i && d.add(M), R)) {
            let re = new To(e, a, M);
            re.setRealPlayer(te), l.push(re);
          }
          return te;
        });
      l.forEach((I) => {
        Bt(this.playersByQueriedElement, I.element, []).push(I),
          I.onDone(() => VM(this.playersByQueriedElement, I.element, I));
      }),
        u.forEach((I) => Qt(I, sb));
      let b = _r(g);
      return (
        b.onDestroy(() => {
          u.forEach((I) => Ki(I, sb)), Tn(c, n.toStyles);
        }),
        d.forEach((I) => {
          Bt(i, I, []).push(b);
        }),
        b
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new Dr(e.duration, e.delay);
    }
  },
  To = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new Dr()),
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
          n.forEach((i) => kh(e, r, void 0, i));
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
      Bt(this._queuedCallbacks, e, []).push(n);
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
function VM(t, e, n) {
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
function qM(t) {
  return t ?? null;
}
function yl(t) {
  return t && t.nodeType === 1;
}
function $M(t) {
  return t == "start" || t == "done";
}
function fb(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function hb(t, e, n, r, i) {
  let s = [];
  n.forEach((c) => s.push(fb(c)));
  let o = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let g = e.computeStyle(l, d, i);
      u.set(d, g), (!g || g.length == 0) && ((l[dn] = UM), o.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => fb(c, s[a++])), o;
}
function pb(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    s = new Map();
  function o(a) {
    if (!a) return r;
    let c = s.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = o(l)), s.set(a, c), c;
  }
  return (
    e.forEach((a) => {
      let c = o(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function Qt(t, e) {
  t.classList?.add(e);
}
function Ki(t, e) {
  t.classList?.remove(e);
}
function zM(t, e, n) {
  _r(n).onDone(() => t.processLeaveNode(e));
}
function GM(t) {
  let e = [];
  return Ib(t, e), e;
}
function Ib(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof vo ? Ib(r.players, e) : e.push(r);
  }
}
function WM(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let s = n[i];
    if (!e.hasOwnProperty(s) || t[s] !== e[s]) return !1;
  }
  return !0;
}
function mb(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((s) => i.add(s)) : e.set(t, r), n.delete(t), !0;
}
var Zi = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (s, o) => {}),
      (this._transitionEngine = new xh(e.body, n, r, i)),
      (this._timelineEngine = new Mh(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (s, o) =>
        this.onRemovalComplete(s, o));
  }
  registerTrigger(e, n, r, i, s) {
    let o = e + "-" + i,
      a = this._triggerCache[o];
    if (!a) {
      let c = [],
        l = [],
        u = _b(this._driver, s, c, l);
      if (c.length) throw WN(i, c);
      l.length && void 0,
        (a = OM(i, u, this._normalizer)),
        (this._triggerCache[o] = a);
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
      let [s, o] = rb(r),
        a = i;
      this._timelineEngine.command(s, n, o, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, s) {
    if (r.charAt(0) == "@") {
      let [o, a] = rb(r);
      return this._timelineEngine.listen(o, n, a, s);
    }
    return this._transitionEngine.listen(e, n, r, i, s);
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
function QM(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = yh(e[0])), e.length > 1 && (r = yh(e[e.length - 1])))
      : e instanceof Map && (n = yh(e)),
    n || r ? new Rh(t, n, r) : null
  );
}
var Yi = class Yi {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = Yi.initialStylesByElement.get(e);
    i || Yi.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        Tn(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (Tn(this._element, this._initialStyles),
        this._endStyles &&
          (Tn(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (Yi.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (ri(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (ri(this._element, this._endStyles), (this._endStyles = null)),
        Tn(this._element, this._initialStyles),
        (this._state = 3));
  }
};
Yi.initialStylesByElement = new WeakMap();
var Rh = Yi;
function yh(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      KM(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function KM(t) {
  return t === "display" || t === "position";
}
var Cl = class {
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
          i !== "offset" && e.set(i, this._finished ? r : Bh(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  Il = class {
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
      return yb(e, n);
    }
    getParentElement(e) {
      return Ph(e);
    }
    query(e, n, r) {
      return vb(e, n, r);
    }
    computeStyle(e, n, r) {
      return Bh(e, n);
    }
    animate(e, n, r, i, s, o = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      s && (c.easing = s);
      let l = new Map(),
        u = o.filter((b) => b instanceof Cl);
      mM(r, i) &&
        u.forEach((b) => {
          b.currentSnapshot.forEach((I, M) => l.set(M, I));
        });
      let d = fM(n).map((b) => new Map(b));
      d = gM(e, d, l);
      let g = QM(e, d);
      return new Cl(e, d, c, g);
    }
  };
var vl = "@",
  Nb = "@.disabled",
  Nl = class {
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
      n.charAt(0) == vl && n == Nb
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
  Oh = class extends Nl {
    constructor(e, n, r, i, s) {
      super(n, r, i, s), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == vl
        ? n.charAt(1) == "." && n == Nb
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == vl) {
        let i = YM(e),
          s = n.slice(1),
          o = "";
        return (
          s.charAt(0) != vl && ([s, o] = ZM(s)),
          this.engine.listen(this.namespaceId, i, s, o, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function YM(t) {
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
function ZM(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var Ml = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, s) => {
        let o = s?.parentNode(i);
        o && s.removeChild(o, i);
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
        (u = new Nl(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let s = n.id,
      o = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(o, e);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(s, o, e, l.name, l);
    };
    return n.data.animation.forEach(a), new Oh(this, o, i, this.engine);
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
          i.forEach((s) => {
            let [o, a] = s;
            o(a);
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
var JM = (() => {
  let e = class e extends Zi {
    constructor(r, i, s) {
      super(r, i, s, q(Li, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(X($e), X(ii), X(si));
  }),
    (e.ɵprov = J({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function eA() {
  return new wl();
}
function tA(t, e, n) {
  return new Ml(t, e, n);
}
var Mb = [
    { provide: si, useFactory: eA },
    { provide: Zi, useClass: JM },
    { provide: Qr, useFactory: tA, deps: [ul, Zi, Be] },
  ],
  nA = [
    { provide: ii, useFactory: () => new Il() },
    { provide: yf, useValue: "BrowserAnimations" },
    ...Mb,
  ],
  rA = [
    { provide: ii, useClass: Fh },
    { provide: yf, useValue: "NoopAnimations" },
    ...Mb,
  ];
function V2() {
  return vr("NgEagerAnimations"), [...nA];
}
var Ab = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Ot({ type: e })),
    (e.ɵinj = Rt({ providers: rA, imports: [fl] }));
  let t = e;
  return t;
})();
var iA = Object.getOwnPropertyNames,
  ae = (t, e) =>
    function () {
      return e || (0, t[iA(t)[0]])((e = { exports: {} }).exports, e), e.exports;
    },
  So = ae({
    "external/npm/node_modules/domino/lib/Event.js"(t, e) {
      "use strict";
      (e.exports = n),
        (n.CAPTURING_PHASE = 1),
        (n.AT_TARGET = 2),
        (n.BUBBLING_PHASE = 3);
      function n(r, i) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = n.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          r && (this.type = r),
          i)
        )
          for (var s in i) this[s] = i[s];
      }
      n.prototype = Object.create(Object.prototype, {
        constructor: { value: n },
        stopPropagation: {
          value: function () {
            this._propagationStopped = !0;
          },
        },
        stopImmediatePropagation: {
          value: function () {
            (this._propagationStopped = !0),
              (this._immediatePropagationStopped = !0);
          },
        },
        preventDefault: {
          value: function () {
            this.cancelable && (this.defaultPrevented = !0);
          },
        },
        initEvent: {
          value: function (i, s, o) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = i),
                (this.bubbles = s),
                (this.cancelable = o));
          },
        },
      });
    },
  }),
  xb = ae({
    "external/npm/node_modules/domino/lib/UIEvent.js"(t, e) {
      "use strict";
      var n = So();
      e.exports = r;
      function r() {
        n.call(this), (this.view = null), (this.detail = 0);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initUIEvent: {
          value: function (i, s, o, a, c) {
            this.initEvent(i, s, o), (this.view = a), (this.detail = c);
          },
        },
      });
    },
  }),
  Rb = ae({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(t, e) {
      "use strict";
      var n = xb();
      e.exports = r;
      function r() {
        n.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initMouseEvent: {
          value: function (i, s, o, a, c, l, u, d, g, b, I, M, F, R, _) {
            switch (
              (this.initEvent(i, s, o, a, c),
              (this.screenX = l),
              (this.screenY = u),
              (this.clientX = d),
              (this.clientY = g),
              (this.ctrlKey = b),
              (this.altKey = I),
              (this.shiftKey = M),
              (this.metaKey = F),
              (this.button = R),
              R)
            ) {
              case 0:
                this.buttons = 1;
                break;
              case 1:
                this.buttons = 4;
                break;
              case 2:
                this.buttons = 2;
                break;
              default:
                this.buttons = 0;
                break;
            }
            this.relatedTarget = _;
          },
        },
        getModifierState: {
          value: function (i) {
            switch (i) {
              case "Alt":
                return this.altKey;
              case "Control":
                return this.ctrlKey;
              case "Shift":
                return this.shiftKey;
              case "Meta":
                return this.metaKey;
              default:
                return !1;
            }
          },
        },
      });
    },
  }),
  $h = ae({
    "external/npm/node_modules/domino/lib/DOMException.js"(t, e) {
      "use strict";
      e.exports = O;
      var n = 1,
        r = 3,
        i = 4,
        s = 5,
        o = 7,
        a = 8,
        c = 9,
        l = 11,
        u = 12,
        d = 13,
        g = 14,
        b = 15,
        I = 17,
        M = 18,
        F = 19,
        R = 20,
        _ = 21,
        w = 22,
        T = 23,
        E = 24,
        te = 25,
        re = [
          null,
          "INDEX_SIZE_ERR",
          null,
          "HIERARCHY_REQUEST_ERR",
          "WRONG_DOCUMENT_ERR",
          "INVALID_CHARACTER_ERR",
          null,
          "NO_MODIFICATION_ALLOWED_ERR",
          "NOT_FOUND_ERR",
          "NOT_SUPPORTED_ERR",
          "INUSE_ATTRIBUTE_ERR",
          "INVALID_STATE_ERR",
          "SYNTAX_ERR",
          "INVALID_MODIFICATION_ERR",
          "NAMESPACE_ERR",
          "INVALID_ACCESS_ERR",
          null,
          "TYPE_MISMATCH_ERR",
          "SECURITY_ERR",
          "NETWORK_ERR",
          "ABORT_ERR",
          "URL_MISMATCH_ERR",
          "QUOTA_EXCEEDED_ERR",
          "TIMEOUT_ERR",
          "INVALID_NODE_TYPE_ERR",
          "DATA_CLONE_ERR",
        ],
        pe = [
          null,
          "INDEX_SIZE_ERR (1): the index is not in the allowed range",
          null,
          "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model",
          "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required",
          "INVALID_CHARACTER_ERR (5): the string contains invalid characters",
          null,
          "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified",
          "NOT_FOUND_ERR (8): the object can not be found here",
          "NOT_SUPPORTED_ERR (9): this operation is not supported",
          "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute",
          "INVALID_STATE_ERR (11): the object is in an invalid state",
          "SYNTAX_ERR (12): the string did not match the expected pattern",
          "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way",
          "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML",
          "INVALID_ACCESS_ERR (15): the object does not support the operation or argument",
          null,
          "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type",
          "SECURITY_ERR (18): the operation is insecure",
          "NETWORK_ERR (19): a network error occurred",
          "ABORT_ERR (20): the user aborted an operation",
          "URL_MISMATCH_ERR (21): the given URL does not match another URL",
          "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded",
          "TIMEOUT_ERR (23): a timeout occurred",
          "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation",
          "DATA_CLONE_ERR (25): the object can not be cloned.",
        ],
        z = {
          INDEX_SIZE_ERR: n,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: r,
          WRONG_DOCUMENT_ERR: i,
          INVALID_CHARACTER_ERR: s,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: o,
          NOT_FOUND_ERR: a,
          NOT_SUPPORTED_ERR: c,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: l,
          SYNTAX_ERR: u,
          INVALID_MODIFICATION_ERR: d,
          NAMESPACE_ERR: g,
          INVALID_ACCESS_ERR: b,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: I,
          SECURITY_ERR: M,
          NETWORK_ERR: F,
          ABORT_ERR: R,
          URL_MISMATCH_ERR: _,
          QUOTA_EXCEEDED_ERR: w,
          TIMEOUT_ERR: T,
          INVALID_NODE_TYPE_ERR: E,
          DATA_CLONE_ERR: te,
        };
      function O(v) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = v),
          (this.message = pe[v]),
          (this.name = re[v]);
      }
      O.prototype.__proto__ = Error.prototype;
      for (Y in z)
        (j = { value: z[Y] }),
          Object.defineProperty(O, Y, j),
          Object.defineProperty(O.prototype, Y, j);
      var j, Y;
    },
  }),
  zh = ae({
    "external/npm/node_modules/domino/lib/config.js"(t) {
      t.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  Je = ae({
    "external/npm/node_modules/domino/lib/utils.js"(t) {
      "use strict";
      var e = $h(),
        n = e,
        r = zh().isApiWritable;
      (t.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (t.IndexSizeError = function () {
          throw new e(n.INDEX_SIZE_ERR);
        }),
        (t.HierarchyRequestError = function () {
          throw new e(n.HIERARCHY_REQUEST_ERR);
        }),
        (t.WrongDocumentError = function () {
          throw new e(n.WRONG_DOCUMENT_ERR);
        }),
        (t.InvalidCharacterError = function () {
          throw new e(n.INVALID_CHARACTER_ERR);
        }),
        (t.NoModificationAllowedError = function () {
          throw new e(n.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (t.NotFoundError = function () {
          throw new e(n.NOT_FOUND_ERR);
        }),
        (t.NotSupportedError = function () {
          throw new e(n.NOT_SUPPORTED_ERR);
        }),
        (t.InvalidStateError = function () {
          throw new e(n.INVALID_STATE_ERR);
        }),
        (t.SyntaxError = function () {
          throw new e(n.SYNTAX_ERR);
        }),
        (t.InvalidModificationError = function () {
          throw new e(n.INVALID_MODIFICATION_ERR);
        }),
        (t.NamespaceError = function () {
          throw new e(n.NAMESPACE_ERR);
        }),
        (t.InvalidAccessError = function () {
          throw new e(n.INVALID_ACCESS_ERR);
        }),
        (t.TypeMismatchError = function () {
          throw new e(n.TYPE_MISMATCH_ERR);
        }),
        (t.SecurityError = function () {
          throw new e(n.SECURITY_ERR);
        }),
        (t.NetworkError = function () {
          throw new e(n.NETWORK_ERR);
        }),
        (t.AbortError = function () {
          throw new e(n.ABORT_ERR);
        }),
        (t.UrlMismatchError = function () {
          throw new e(n.URL_MISMATCH_ERR);
        }),
        (t.QuotaExceededError = function () {
          throw new e(n.QUOTA_EXCEEDED_ERR);
        }),
        (t.TimeoutError = function () {
          throw new e(n.TIMEOUT_ERR);
        }),
        (t.InvalidNodeTypeError = function () {
          throw new e(n.INVALID_NODE_TYPE_ERR);
        }),
        (t.DataCloneError = function () {
          throw new e(n.DATA_CLONE_ERR);
        }),
        (t.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (t.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass."
          );
        }),
        (t.assert = function (i, s) {
          if (!i)
            throw new Error(
              "Assertion failed: " +
                (s || "") +
                `
` +
                new Error().stack
            );
        }),
        (t.expose = function (i, s) {
          for (var o in i)
            Object.defineProperty(s.prototype, o, { value: i[o], writable: r });
        }),
        (t.merge = function (i, s) {
          for (var o in s) i[o] = s[o];
        }),
        (t.documentOrder = function (i, s) {
          return 3 - (i.compareDocumentPosition(s) & 6);
        }),
        (t.toASCIILowerCase = function (i) {
          return i.replace(/[A-Z]+/g, function (s) {
            return s.toLowerCase();
          });
        }),
        (t.toASCIIUpperCase = function (i) {
          return i.replace(/[a-z]+/g, function (s) {
            return s.toUpperCase();
          });
        });
    },
  }),
  Ob = ae({
    "external/npm/node_modules/domino/lib/EventTarget.js"(t, e) {
      "use strict";
      var n = So(),
        r = Rb(),
        i = Je();
      e.exports = s;
      function s() {}
      s.prototype = {
        addEventListener: function (a, c, l) {
          if (c) {
            l === void 0 && (l = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[a] || (this._listeners[a] = []);
            for (var u = this._listeners[a], d = 0, g = u.length; d < g; d++) {
              var b = u[d];
              if (b.listener === c && b.capture === l) return;
            }
            var I = { listener: c, capture: l };
            typeof c == "function" && (I.f = c), u.push(I);
          }
        },
        removeEventListener: function (a, c, l) {
          if ((l === void 0 && (l = !1), this._listeners)) {
            var u = this._listeners[a];
            if (u)
              for (var d = 0, g = u.length; d < g; d++) {
                var b = u[d];
                if (b.listener === c && b.capture === l) {
                  u.length === 1
                    ? (this._listeners[a] = void 0)
                    : u.splice(d, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (a) {
          return this._dispatchEvent(a, !1);
        },
        _dispatchEvent: function (a, c) {
          typeof c != "boolean" && (c = !1);
          function l(M, F) {
            var R = F.type,
              _ = F.eventPhase;
            if (
              ((F.currentTarget = M),
              _ !== n.CAPTURING_PHASE && M._handlers && M._handlers[R])
            ) {
              var w = M._handlers[R],
                T;
              if (typeof w == "function") T = w.call(F.currentTarget, F);
              else {
                var E = w.handleEvent;
                if (typeof E != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function."
                  );
                T = E.call(w, F);
              }
              switch (F.type) {
                case "mouseover":
                  T === !0 && F.preventDefault();
                  break;
                case "beforeunload":
                default:
                  T === !1 && F.preventDefault();
                  break;
              }
            }
            var te = M._listeners && M._listeners[R];
            if (te) {
              te = te.slice();
              for (var re = 0, pe = te.length; re < pe; re++) {
                if (F._immediatePropagationStopped) return;
                var z = te[re];
                if (
                  !(
                    (_ === n.CAPTURING_PHASE && !z.capture) ||
                    (_ === n.BUBBLING_PHASE && z.capture)
                  )
                )
                  if (z.f) z.f.call(F.currentTarget, F);
                  else {
                    var O = z.listener.handleEvent;
                    if (typeof O != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function."
                      );
                    O.call(z.listener, F);
                  }
              }
            }
          }
          (!a._initialized || a._dispatching) && i.InvalidStateError(),
            (a.isTrusted = c),
            (a._dispatching = !0),
            (a.target = this);
          for (var u = [], d = this.parentNode; d; d = d.parentNode) u.push(d);
          a.eventPhase = n.CAPTURING_PHASE;
          for (
            var g = u.length - 1;
            g >= 0 && (l(u[g], a), !a._propagationStopped);
            g--
          );
          if (
            (a._propagationStopped ||
              ((a.eventPhase = n.AT_TARGET), l(this, a)),
            a.bubbles && !a._propagationStopped)
          ) {
            a.eventPhase = n.BUBBLING_PHASE;
            for (
              var b = 0, I = u.length;
              b < I && (l(u[b], a), !a._propagationStopped);
              b++
            );
          }
          if (
            ((a._dispatching = !1),
            (a.eventPhase = n.AT_TARGET),
            (a.currentTarget = null),
            c && !a.defaultPrevented && a instanceof r)
          )
            switch (a.type) {
              case "mousedown":
                this._armed = { x: a.clientX, y: a.clientY, t: a.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(a) && this._doClick(a), (this._armed = null);
                break;
            }
          return !a.defaultPrevented;
        },
        _isClick: function (o) {
          return (
            this._armed !== null &&
            o.type === "mouseup" &&
            o.isTrusted &&
            o.button === 0 &&
            o.timeStamp - this._armed.t < 1e3 &&
            Math.abs(o.clientX - this._armed.x) < 10 &&
            Math.abs(o.clientY - this._armed.Y) < 10
          );
        },
        _doClick: function (o) {
          if (!this._click_in_progress) {
            this._click_in_progress = !0;
            for (var a = this; a && !a._post_click_activation_steps; )
              a = a.parentNode;
            a &&
              a._pre_click_activation_steps &&
              a._pre_click_activation_steps();
            var c = this.ownerDocument.createEvent("MouseEvent");
            c.initMouseEvent(
              "click",
              !0,
              !0,
              this.ownerDocument.defaultView,
              1,
              o.screenX,
              o.screenY,
              o.clientX,
              o.clientY,
              o.ctrlKey,
              o.altKey,
              o.shiftKey,
              o.metaKey,
              o.button,
              null
            );
            var l = this._dispatchEvent(c, !0);
            a &&
              (l
                ? a._post_click_activation_steps &&
                  a._post_click_activation_steps(c)
                : a._cancelled_activation_steps &&
                  a._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (a, c) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[a] = c);
        },
        _getEventHandler: function (a) {
          return (this._handlers && this._handlers[a]) || null;
        },
      };
    },
  }),
  kb = ae({
    "external/npm/node_modules/domino/lib/LinkedList.js"(t, e) {
      "use strict";
      var n = Je(),
        r = (e.exports = {
          valid: function (i) {
            return (
              n.assert(i, "list falsy"),
              n.assert(i._previousSibling, "previous falsy"),
              n.assert(i._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (i, s) {
            n.assert(r.valid(i) && r.valid(s));
            var o = i,
              a = i._previousSibling,
              c = s,
              l = s._previousSibling;
            (o._previousSibling = l),
              (a._nextSibling = c),
              (l._nextSibling = o),
              (c._previousSibling = a),
              n.assert(r.valid(i) && r.valid(s));
          },
          replace: function (i, s) {
            n.assert(r.valid(i) && (s === null || r.valid(s))),
              s !== null && r.insertBefore(s, i),
              r.remove(i),
              n.assert(r.valid(i) && (s === null || r.valid(s)));
          },
          remove: function (i) {
            n.assert(r.valid(i));
            var s = i._previousSibling;
            if (s !== i) {
              var o = i._nextSibling;
              (s._nextSibling = o),
                (o._previousSibling = s),
                (i._previousSibling = i._nextSibling = i),
                n.assert(r.valid(i));
            }
          },
        });
    },
  }),
  Lb = ae({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(t, e) {
      "use strict";
      e.exports = {
        serializeOne: F,
        ɵescapeMatchingClosingTag: g,
        ɵescapeClosingCommentTag: I,
        ɵescapeProcessingInstructionContent: M,
      };
      var n = Je(),
        r = n.NAMESPACE,
        i = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        s = {
          area: !0,
          base: !0,
          basefont: !0,
          bgsound: !0,
          br: !0,
          col: !0,
          embed: !0,
          frame: !0,
          hr: !0,
          img: !0,
          input: !0,
          keygen: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
        },
        o = {},
        a = /[&<>\u00A0]/g,
        c = /[&"<>\u00A0]/g;
      function l(R) {
        return a.test(R)
          ? R.replace(a, (_) => {
              switch (_) {
                case "&":
                  return "&amp;";
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : R;
      }
      function u(R) {
        return c.test(R)
          ? R.replace(c, (_) => {
              switch (_) {
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "&":
                  return "&amp;";
                case '"':
                  return "&quot;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : R;
      }
      function d(R) {
        var _ = R.namespaceURI;
        return _
          ? _ === r.XML
            ? "xml:" + R.localName
            : _ === r.XLINK
            ? "xlink:" + R.localName
            : _ === r.XMLNS
            ? R.localName === "xmlns"
              ? "xmlns"
              : "xmlns:" + R.localName
            : R.name
          : R.localName;
      }
      function g(R, _) {
        let w = "</" + _;
        if (!R.toLowerCase().includes(w)) return R;
        let T = [...R],
          E = R.matchAll(new RegExp(w, "ig"));
        for (let te of E) T[te.index] = "&lt;";
        return T.join("");
      }
      var b = /--!?>/;
      function I(R) {
        return b.test(R) ? R.replace(/(--\!?)>/g, "$1&gt;") : R;
      }
      function M(R) {
        return R.includes(">") ? R.replaceAll(">", "&gt;") : R;
      }
      function F(R, _) {
        var w = "";
        switch (R.nodeType) {
          case 1:
            var T = R.namespaceURI,
              E = T === r.HTML,
              te = E || T === r.SVG || T === r.MATHML ? R.localName : R.tagName;
            w += "<" + te;
            for (var re = 0, pe = R._numattrs; re < pe; re++) {
              var z = R._attr(re);
              (w += " " + d(z)),
                z.value !== void 0 && (w += '="' + u(z.value) + '"');
            }
            if (((w += ">"), !(E && s[te]))) {
              var O = R.serialize();
              i[te.toUpperCase()] && (O = g(O, te)),
                E &&
                  o[te] &&
                  O.charAt(0) ===
                    `
` &&
                  (w += `
`),
                (w += O),
                (w += "</" + te + ">");
            }
            break;
          case 3:
          case 4:
            var j;
            _.nodeType === 1 && _.namespaceURI === r.HTML
              ? (j = _.tagName)
              : (j = ""),
              i[j] || (j === "NOSCRIPT" && _.ownerDocument._scripting_enabled)
                ? (w += R.data)
                : (w += l(R.data));
            break;
          case 8:
            w += "<!--" + I(R.data) + "-->";
            break;
          case 7:
            let Y = M(R.data);
            w += "<?" + R.target + " " + Y + "?>";
            break;
          case 10:
            (w += "<!DOCTYPE " + R.name), (w += ">");
            break;
          default:
            n.InvalidStateError();
        }
        return w;
      }
    },
  }),
  mt = ae({
    "external/npm/node_modules/domino/lib/Node.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = Ob(),
        r = kb(),
        i = Lb(),
        s = Je();
      function o() {
        n.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var a = (o.ELEMENT_NODE = 1),
        c = (o.ATTRIBUTE_NODE = 2),
        l = (o.TEXT_NODE = 3),
        u = (o.CDATA_SECTION_NODE = 4),
        d = (o.ENTITY_REFERENCE_NODE = 5),
        g = (o.ENTITY_NODE = 6),
        b = (o.PROCESSING_INSTRUCTION_NODE = 7),
        I = (o.COMMENT_NODE = 8),
        M = (o.DOCUMENT_NODE = 9),
        F = (o.DOCUMENT_TYPE_NODE = 10),
        R = (o.DOCUMENT_FRAGMENT_NODE = 11),
        _ = (o.NOTATION_NODE = 12),
        w = (o.DOCUMENT_POSITION_DISCONNECTED = 1),
        T = (o.DOCUMENT_POSITION_PRECEDING = 2),
        E = (o.DOCUMENT_POSITION_FOLLOWING = 4),
        te = (o.DOCUMENT_POSITION_CONTAINS = 8),
        re = (o.DOCUMENT_POSITION_CONTAINED_BY = 16),
        pe = (o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      o.prototype = Object.create(n.prototype, {
        baseURI: { get: s.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === a
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: s.shouldOverride },
        firstChild: { get: s.shouldOverride },
        lastChild: { get: s.shouldOverride },
        isConnected: {
          get: function () {
            let z = this;
            for (; z != null; ) {
              if (z.nodeType === o.DOCUMENT_NODE) return !0;
              (z = z.parentNode),
                z != null &&
                  z.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (z = z.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var z = this.parentNode;
            return !z || this === z.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var z = this.parentNode,
              O = this._nextSibling;
            return !z || O === z.firstChild ? null : O;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (z) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (z) {},
        },
        _countChildrenOfType: {
          value: function (z) {
            for (var O = 0, j = this.firstChild; j !== null; j = j.nextSibling)
              j.nodeType === z && O++;
            return O;
          },
        },
        _ensureInsertValid: {
          value: function (O, j, Y) {
            var v = this,
              m,
              p;
            if (!O.nodeType) throw new TypeError("not a node");
            switch (v.nodeType) {
              case M:
              case R:
              case a:
                break;
              default:
                s.HierarchyRequestError();
            }
            switch (
              (O.isAncestor(v) && s.HierarchyRequestError(),
              (j !== null || !Y) && j.parentNode !== v && s.NotFoundError(),
              O.nodeType)
            ) {
              case R:
              case F:
              case a:
              case l:
              case b:
              case I:
                break;
              default:
                s.HierarchyRequestError();
            }
            if (v.nodeType === M)
              switch (O.nodeType) {
                case l:
                  s.HierarchyRequestError();
                  break;
                case R:
                  switch (
                    (O._countChildrenOfType(l) > 0 && s.HierarchyRequestError(),
                    O._countChildrenOfType(a))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (j !== null)
                        for (
                          Y && j.nodeType === F && s.HierarchyRequestError(),
                            p = j.nextSibling;
                          p !== null;
                          p = p.nextSibling
                        )
                          p.nodeType === F && s.HierarchyRequestError();
                      (m = v._countChildrenOfType(a)),
                        Y
                          ? m > 0 && s.HierarchyRequestError()
                          : (m > 1 || (m === 1 && j.nodeType !== a)) &&
                            s.HierarchyRequestError();
                      break;
                    default:
                      s.HierarchyRequestError();
                  }
                  break;
                case a:
                  if (j !== null)
                    for (
                      Y && j.nodeType === F && s.HierarchyRequestError(),
                        p = j.nextSibling;
                      p !== null;
                      p = p.nextSibling
                    )
                      p.nodeType === F && s.HierarchyRequestError();
                  (m = v._countChildrenOfType(a)),
                    Y
                      ? m > 0 && s.HierarchyRequestError()
                      : (m > 1 || (m === 1 && j.nodeType !== a)) &&
                        s.HierarchyRequestError();
                  break;
                case F:
                  if (j === null)
                    v._countChildrenOfType(a) && s.HierarchyRequestError();
                  else
                    for (
                      p = v.firstChild;
                      p !== null && p !== j;
                      p = p.nextSibling
                    )
                      p.nodeType === a && s.HierarchyRequestError();
                  (m = v._countChildrenOfType(F)),
                    Y
                      ? m > 0 && s.HierarchyRequestError()
                      : (m > 1 || (m === 1 && j.nodeType !== F)) &&
                        s.HierarchyRequestError();
                  break;
              }
            else O.nodeType === F && s.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (O, j) {
            var Y = this;
            Y._ensureInsertValid(O, j, !0);
            var v = j;
            return (
              v === O && (v = O.nextSibling),
              Y.doc.adoptNode(O),
              O._insertOrReplace(Y, v, !1),
              O
            );
          },
        },
        appendChild: {
          value: function (z) {
            return this.insertBefore(z, null);
          },
        },
        _appendChild: {
          value: function (z) {
            z._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (O) {
            var j = this;
            if (!O.nodeType) throw new TypeError("not a node");
            return O.parentNode !== j && s.NotFoundError(), O.remove(), O;
          },
        },
        replaceChild: {
          value: function (O, j) {
            var Y = this;
            return (
              Y._ensureInsertValid(O, j, !1),
              O.doc !== Y.doc && Y.doc.adoptNode(O),
              O._insertOrReplace(Y, j, !0),
              j
            );
          },
        },
        contains: {
          value: function (O) {
            return O === null
              ? !1
              : this === O
              ? !0
              : (this.compareDocumentPosition(O) & re) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (O) {
            if (this === O) return 0;
            if (this.doc !== O.doc || this.rooted !== O.rooted) return w + pe;
            for (var j = [], Y = [], v = this; v !== null; v = v.parentNode)
              j.push(v);
            for (v = O; v !== null; v = v.parentNode) Y.push(v);
            if ((j.reverse(), Y.reverse(), j[0] !== Y[0])) return w + pe;
            v = Math.min(j.length, Y.length);
            for (var m = 1; m < v; m++)
              if (j[m] !== Y[m]) return j[m].index < Y[m].index ? E : T;
            return j.length < Y.length ? E + re : T + te;
          },
        },
        isSameNode: {
          value: function (O) {
            return this === O;
          },
        },
        isEqualNode: {
          value: function (O) {
            if (!O || O.nodeType !== this.nodeType || !this.isEqual(O))
              return !1;
            for (
              var j = this.firstChild, Y = O.firstChild;
              j && Y;
              j = j.nextSibling, Y = Y.nextSibling
            )
              if (!j.isEqualNode(Y)) return !1;
            return j === null && Y === null;
          },
        },
        cloneNode: {
          value: function (z) {
            var O = this.clone();
            if (z)
              for (var j = this.firstChild; j !== null; j = j.nextSibling)
                O._appendChild(j.cloneNode(!0));
            return O;
          },
        },
        lookupPrefix: {
          value: function (O) {
            var j;
            if (O === "" || O === null || O === void 0) return null;
            switch (this.nodeType) {
              case a:
                return this._lookupNamespacePrefix(O, this);
              case M:
                return (j = this.documentElement), j ? j.lookupPrefix(O) : null;
              case g:
              case _:
              case R:
              case F:
                return null;
              case c:
                return (j = this.ownerElement), j ? j.lookupPrefix(O) : null;
              default:
                return (j = this.parentElement), j ? j.lookupPrefix(O) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j;
            switch (this.nodeType) {
              case a:
                return s.shouldOverride();
              case M:
                return (
                  (j = this.documentElement), j ? j.lookupNamespaceURI(O) : null
                );
              case g:
              case _:
              case F:
              case R:
                return null;
              case c:
                return (
                  (j = this.ownerElement), j ? j.lookupNamespaceURI(O) : null
                );
              default:
                return (
                  (j = this.parentElement), j ? j.lookupNamespaceURI(O) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j = this.lookupNamespaceURI(null);
            return j === O;
          },
        },
        index: {
          get: function () {
            var z = this.parentNode;
            if (this === z.firstChild) return 0;
            var O = z.childNodes;
            if (this._index === void 0 || O[this._index] !== this) {
              for (var j = 0; j < O.length; j++) O[j]._index = j;
              s.assert(O[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (z) {
            if (this.doc !== z.doc || this.rooted !== z.rooted) return !1;
            for (var O = z; O; O = O.parentNode) if (O === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (z) {
            z.ownerDocument === null
              ? (z.ownerDocument = this.doc)
              : z.ownerDocument !== this.doc && s.WrongDocumentError();
          },
        },
        removeChildren: { value: s.shouldOverride },
        _insertOrReplace: {
          value: function (O, j, Y) {
            var v = this,
              m,
              p;
            if (
              (v.nodeType === R && v.rooted && s.HierarchyRequestError(),
              O._childNodes &&
                ((m = j === null ? O._childNodes.length : j.index),
                v.parentNode === O))
            ) {
              var y = v.index;
              y < m && m--;
            }
            Y && (j.rooted && j.doc.mutateRemove(j), (j.parentNode = null));
            var C = j;
            C === null && (C = O.firstChild);
            var x = v.rooted && O.rooted;
            if (v.nodeType === R) {
              for (
                var V = [0, Y ? 1 : 0], K, he = v.firstChild;
                he !== null;
                he = K
              )
                (K = he.nextSibling), V.push(he), (he.parentNode = O);
              var S = V.length;
              if (
                (Y
                  ? r.replace(C, S > 2 ? V[2] : null)
                  : S > 2 && C !== null && r.insertBefore(V[2], C),
                O._childNodes)
              )
                for (
                  V[0] = j === null ? O._childNodes.length : j._index,
                    O._childNodes.splice.apply(O._childNodes, V),
                    p = 2;
                  p < S;
                  p++
                )
                  V[p]._index = V[0] + (p - 2);
              else
                O._firstChild === j &&
                  (S > 2
                    ? (O._firstChild = V[2])
                    : Y && (O._firstChild = null));
              if (
                (v._childNodes
                  ? (v._childNodes.length = 0)
                  : (v._firstChild = null),
                O.rooted)
              )
                for (O.modify(), p = 2; p < S; p++) O.doc.mutateInsert(V[p]);
            } else {
              if (j === v) return;
              x ? v._remove() : v.parentNode && v.remove(),
                (v.parentNode = O),
                Y
                  ? (r.replace(C, v),
                    O._childNodes
                      ? ((v._index = m), (O._childNodes[m] = v))
                      : O._firstChild === j && (O._firstChild = v))
                  : (C !== null && r.insertBefore(v, C),
                    O._childNodes
                      ? ((v._index = m), O._childNodes.splice(m, 0, v))
                      : O._firstChild === j && (O._firstChild = v)),
                x
                  ? (O.modify(), O.doc.mutateMove(v))
                  : O.rooted && (O.modify(), O.doc.mutateInsert(v));
            }
          },
        },
        lastModTime: {
          get: function () {
            return (
              this._lastModTime || (this._lastModTime = this.doc.modclock),
              this._lastModTime
            );
          },
        },
        modify: {
          value: function () {
            if (this.doc.modclock)
              for (
                var z = ++this.doc.modclock, O = this;
                O;
                O = O.parentElement
              )
                O._lastModTime && (O._lastModTime = z);
          },
        },
        doc: {
          get: function () {
            return this.ownerDocument || this;
          },
        },
        rooted: {
          get: function () {
            return !!this._nid;
          },
        },
        normalize: {
          value: function () {
            for (var z, O = this.firstChild; O !== null; O = z)
              if (
                ((z = O.nextSibling),
                O.normalize && O.normalize(),
                O.nodeType === o.TEXT_NODE)
              ) {
                if (O.nodeValue === "") {
                  this.removeChild(O);
                  continue;
                }
                var j = O.previousSibling;
                j !== null &&
                  j.nodeType === o.TEXT_NODE &&
                  (j.appendData(O.nodeValue), this.removeChild(O));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var z = "", O = this.firstChild; O !== null; O = O.nextSibling)
              z += i.serializeOne(O, this);
            return z;
          },
        },
        outerHTML: {
          get: function () {
            return i.serializeOne(this, { nodeType: 0 });
          },
          set: s.nyi,
        },
        ELEMENT_NODE: { value: a },
        ATTRIBUTE_NODE: { value: c },
        TEXT_NODE: { value: l },
        CDATA_SECTION_NODE: { value: u },
        ENTITY_REFERENCE_NODE: { value: d },
        ENTITY_NODE: { value: g },
        PROCESSING_INSTRUCTION_NODE: { value: b },
        COMMENT_NODE: { value: I },
        DOCUMENT_NODE: { value: M },
        DOCUMENT_TYPE_NODE: { value: F },
        DOCUMENT_FRAGMENT_NODE: { value: R },
        NOTATION_NODE: { value: _ },
        DOCUMENT_POSITION_DISCONNECTED: { value: w },
        DOCUMENT_POSITION_PRECEDING: { value: T },
        DOCUMENT_POSITION_FOLLOWING: { value: E },
        DOCUMENT_POSITION_CONTAINS: { value: te },
        DOCUMENT_POSITION_CONTAINED_BY: { value: re },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: pe },
      });
    },
  }),
  sA = ae({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(t, e) {
      "use strict";
      e.exports = class extends Array {
        constructor(r) {
          if ((super((r && r.length) || 0), r)) for (var i in r) this[i] = r[i];
        }
        item(r) {
          return this[r] || null;
        }
      };
    },
  }),
  oA = ae({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(t, e) {
      "use strict";
      function n(i) {
        return this[i] || null;
      }
      function r(i) {
        return i || (i = []), (i.item = n), i;
      }
      e.exports = r;
    },
  }),
  Xi = ae({
    "external/npm/node_modules/domino/lib/NodeList.js"(t, e) {
      "use strict";
      var n;
      try {
        n = sA();
      } catch {
        n = oA();
      }
      e.exports = n;
    },
  }),
  Gh = ae({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = mt(),
        r = Xi();
      function i() {
        n.call(this), (this._firstChild = this._childNodes = null);
      }
      i.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return this._childNodes
              ? this._childNodes.length > 0
              : this._firstChild !== null;
          },
        },
        childNodes: {
          get: function () {
            return this._ensureChildNodes(), this._childNodes;
          },
        },
        firstChild: {
          get: function () {
            return this._childNodes
              ? this._childNodes.length === 0
                ? null
                : this._childNodes[0]
              : this._firstChild;
          },
        },
        lastChild: {
          get: function () {
            var s = this._childNodes,
              o;
            return s
              ? s.length === 0
                ? null
                : s[s.length - 1]
              : ((o = this._firstChild),
                o === null ? null : o._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var s = this._firstChild,
                o = s,
                a = (this._childNodes = new r());
              if (s)
                do a.push(o), (o = o._nextSibling);
                while (o !== s);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var o = this.rooted ? this.ownerDocument : null,
                a = this.firstChild,
                c;
              a !== null;

            )
              (c = a),
                (a = c.nextSibling),
                o && o.mutateRemove(c),
                (c.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  Wh = ae({
    "external/npm/node_modules/domino/lib/xmlnames.js"(t) {
      "use strict";
      (t.isValidName = M), (t.isValidQName = F);
      var e = /^[_:A-Za-z][-.:\w]+$/,
        n = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        r =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        i =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        s = "[" + r + "][" + i + "]*",
        o = r + ":",
        a = i + ":",
        c = new RegExp("^[" + o + "][" + a + "]*$"),
        l = new RegExp("^(" + s + "|" + s + ":" + s + ")$"),
        u = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        d = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        g = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (r += "\uD800-\u{EFC00}-\uDFFF"),
        (i += "\uD800-\u{EFC00}-\uDFFF"),
        (s = "[" + r + "][" + i + "]*"),
        (o = r + ":"),
        (a = i + ":");
      var b = new RegExp("^[" + o + "][" + a + "]*$"),
        I = new RegExp("^(" + s + "|" + s + ":" + s + ")$");
      function M(R) {
        if (e.test(R) || c.test(R)) return !0;
        if (!u.test(R) || !b.test(R)) return !1;
        var _ = R.match(d),
          w = R.match(g);
        return w !== null && 2 * w.length === _.length;
      }
      function F(R) {
        if (n.test(R) || l.test(R)) return !0;
        if (!u.test(R) || !I.test(R)) return !1;
        var _ = R.match(d),
          w = R.match(g);
        return w !== null && 2 * w.length === _.length;
      }
    },
  }),
  Pb = ae({
    "external/npm/node_modules/domino/lib/attributes.js"(t) {
      "use strict";
      var e = Je();
      t.property = function (r) {
        if (Array.isArray(r.type)) {
          var i = Object.create(null);
          r.type.forEach(function (a) {
            i[a.value || a] = a.alias || a;
          });
          var s = r.missing;
          s === void 0 && (s = null);
          var o = r.invalid;
          return (
            o === void 0 && (o = s),
            {
              get: function () {
                var a = this._getattr(r.name);
                return a === null
                  ? s
                  : ((a = i[a.toLowerCase()]),
                    a !== void 0 ? a : o !== null ? o : a);
              },
              set: function (a) {
                this._setattr(r.name, a);
              },
            }
          );
        } else {
          if (r.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(r.name);
              },
              set: function (a) {
                a ? this._setattr(r.name, "") : this.removeAttribute(r.name);
              },
            };
          if (
            r.type === Number ||
            r.type === "long" ||
            r.type === "unsigned long" ||
            r.type === "limited unsigned long with fallback"
          )
            return n(r);
          if (!r.type || r.type === String)
            return {
              get: function () {
                return this._getattr(r.name) || "";
              },
              set: function (a) {
                r.treatNullAsEmptyString && a === null && (a = ""),
                  this._setattr(r.name, a);
              },
            };
          if (typeof r.type == "function") return r.type(r.name, r);
        }
        throw new Error("Invalid attribute definition");
      };
      function n(r) {
        var i;
        typeof r.default == "function"
          ? (i = r.default)
          : typeof r.default == "number"
          ? (i = function () {
              return r.default;
            })
          : (i = function () {
              e.assert(!1, typeof r.default);
            });
        var s = r.type === "unsigned long",
          o = r.type === "long",
          a = r.type === "limited unsigned long with fallback",
          c = r.min,
          l = r.max,
          u = r.setmin;
        return (
          c === void 0 && (s && (c = 0), o && (c = -2147483648), a && (c = 1)),
          l === void 0 && (s || o || a) && (l = 2147483647),
          {
            get: function () {
              var d = this._getattr(r.name),
                g = r.float ? parseFloat(d) : parseInt(d, 10);
              if (
                d === null ||
                !isFinite(g) ||
                (c !== void 0 && g < c) ||
                (l !== void 0 && g > l)
              )
                return i.call(this);
              if (s || o || a) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(d)) return i.call(this);
                g = g | 0;
              }
              return g;
            },
            set: function (d) {
              r.float || (d = Math.floor(d)),
                u !== void 0 &&
                  d < u &&
                  e.IndexSizeError(r.name + " set to " + d),
                s
                  ? (d = d < 0 || d > 2147483647 ? i.call(this) : d | 0)
                  : a
                  ? (d = d < 1 || d > 2147483647 ? i.call(this) : d | 0)
                  : o &&
                    (d =
                      d < -2147483648 || d > 2147483647 ? i.call(this) : d | 0),
                this._setattr(r.name, String(d));
            },
          }
        );
      }
      t.registerChangeHandler = function (r, i, s) {
        var o = r.prototype;
        Object.prototype.hasOwnProperty.call(o, "_attributeChangeHandlers") ||
          (o._attributeChangeHandlers = Object.create(
            o._attributeChangeHandlers || null
          )),
          (o._attributeChangeHandlers[i] = s);
      };
    },
  }),
  aA = ae({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = mt();
      function r(i, s) {
        (this.root = i),
          (this.filter = s),
          (this.lastModTime = i.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      r.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (i) {
            return (
              this.checkcache(),
              !this.done && i >= this.cache.length && this.traverse(),
              this.cache[i]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var i = this.cache.length - 1; i >= 0; i--) this[i] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (i) {
            i !== void 0 && i++;
            for (var s; (s = this.next()) !== null; )
              if (
                ((this[this.cache.length] = s),
                this.cache.push(s),
                i && this.cache.length === i)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var i =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              s;
            for (
              i.nodeType === n.DOCUMENT_NODE
                ? (s = i.documentElement)
                : (s = i.nextElement(this.root));
              s;

            ) {
              if (this.filter(s)) return s;
              s = s.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  Fb = ae({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(t, e) {
      "use strict";
      var n = Je();
      e.exports = r;
      function r(c, l) {
        (this._getString = c),
          (this._setString = l),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(r.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (c) {
            var l = a(this);
            return c < 0 || c >= l.length ? null : l[c];
          },
        },
        contains: {
          value: function (c) {
            c = String(c);
            var l = a(this);
            return l.indexOf(c) > -1;
          },
        },
        add: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]);
              c.indexOf(d) < 0 && c.push(d);
            }
            this._update(c);
          },
        },
        remove: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]),
                g = c.indexOf(d);
              g > -1 && c.splice(g, 1);
            }
            this._update(c);
          },
        },
        toggle: {
          value: function (l, u) {
            return (
              (l = s(l)),
              this.contains(l)
                ? u === void 0 || u === !1
                  ? (this.remove(l), !1)
                  : !0
                : u === void 0 || u === !0
                ? (this.add(l), !0)
                : !1
            );
          },
        },
        replace: {
          value: function (l, u) {
            String(u) === "" && n.SyntaxError(), (l = s(l)), (u = s(u));
            var d = a(this),
              g = d.indexOf(l);
            if (g < 0) return !1;
            var b = d.indexOf(u);
            return (
              b < 0
                ? (d[g] = u)
                : g < b
                ? ((d[g] = u), d.splice(b, 1))
                : d.splice(g, 1),
              this._update(d),
              !0
            );
          },
        },
        toString: {
          value: function () {
            return this._getString();
          },
        },
        value: {
          get: function () {
            return this._getString();
          },
          set: function (c) {
            this._setString(c), this._update();
          },
        },
        _update: {
          value: function (c) {
            c
              ? (i(this, c), this._setString(c.join(" ").trim()))
              : i(this, a(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function i(c, l) {
        var u = c._length,
          d;
        for (c._length = l.length, d = 0; d < l.length; d++) c[d] = l[d];
        for (; d < u; d++) c[d] = void 0;
      }
      function s(c) {
        return (
          (c = String(c)),
          c === "" && n.SyntaxError(),
          /[ \t\r\n\f]/.test(c) && n.InvalidCharacterError(),
          c
        );
      }
      function o(c) {
        for (var l = c._length, u = Array(l), d = 0; d < l; d++) u[d] = c[d];
        return u;
      }
      function a(c) {
        var l = c._getString();
        if (l === c._lastStringValue) return o(c);
        var u = l.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (u === "") return [];
        var d = Object.create(null);
        return u.split(/[ \t\r\n\f]+/g).filter(function (g) {
          var b = "$" + g;
          return d[b] ? !1 : ((d[b] = !0), !0);
        });
      }
    },
  }),
  Qh = ae({
    "external/npm/node_modules/domino/lib/select.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        r = function (v, m) {
          return v.compareDocumentPosition(m);
        },
        i = function (v, m) {
          return r(v, m) & 2 ? 1 : -1;
        },
        s = function (v) {
          for (; (v = v.nextSibling) && v.nodeType !== 1; );
          return v;
        },
        o = function (v) {
          for (; (v = v.previousSibling) && v.nodeType !== 1; );
          return v;
        },
        a = function (v) {
          if ((v = v.firstChild))
            for (; v.nodeType !== 1 && (v = v.nextSibling); );
          return v;
        },
        c = function (v) {
          if ((v = v.lastChild))
            for (; v.nodeType !== 1 && (v = v.previousSibling); );
          return v;
        },
        l = function (v) {
          if (!v.parentNode) return !1;
          var m = v.parentNode.nodeType;
          return m === 1 || m === 9;
        },
        u = function (v) {
          if (!v) return v;
          var m = v[0];
          return m === '"' || m === "'"
            ? (v[v.length - 1] === m ? (v = v.slice(1, -1)) : (v = v.slice(1)),
              v.replace(E.str_escape, function (p) {
                var y = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(p);
                if (!y) return p.slice(1);
                if (y[2]) return "";
                var C = parseInt(y[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(C)
                  : String.fromCharCode(C);
              }))
            : E.ident.test(v)
            ? d(v)
            : v;
        },
        d = function (v) {
          return v.replace(E.escape, function (m) {
            var p = /^\\([0-9A-Fa-f]+)/.exec(m);
            if (!p) return m[1];
            var y = parseInt(p[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(y)
              : String.fromCharCode(y);
          });
        },
        g = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (v, m) {
                for (var p = this.length; p--; ) if (this[p] === m) return p;
                return -1;
              };
        })(),
        b = function (v, m) {
          var p = E.inside.source.replace(/</g, v).replace(/>/g, m);
          return new RegExp(p);
        },
        I = function (v, m, p) {
          return (
            (v = v.source), (v = v.replace(m, p.source || p)), new RegExp(v)
          );
        },
        M = function (v, m) {
          return v
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", m)
            .join("/");
        },
        F = function (v, m) {
          var p = v.replace(/\s+/g, ""),
            y;
          return (
            p === "even"
              ? (p = "2n+0")
              : p === "odd"
              ? (p = "2n+1")
              : p.indexOf("n") === -1 && (p = "0n" + p),
            (y = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(p)),
            {
              group: y[1] === "-" ? -(y[2] || 1) : +(y[2] || 1),
              offset: y[4] ? (y[3] === "-" ? -y[4] : +y[4]) : 0,
            }
          );
        },
        R = function (v, m, p) {
          var y = F(v),
            C = y.group,
            x = y.offset,
            V = p ? c : a,
            K = p ? o : s;
          return function (he) {
            if (l(he))
              for (var S = V(he.parentNode), k = 0; S; ) {
                if ((m(S, he) && k++, S === he))
                  return (k -= x), C && k ? k % C === 0 && k < 0 == C < 0 : !k;
                S = K(S);
              }
          };
        },
        _ = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (v) {
            return (
              (v = v.toLowerCase()),
              function (m) {
                return m.nodeName.toLowerCase() === v;
              }
            );
          },
          attr: function (v, m, p, y) {
            return (
              (m = w[m]),
              function (C) {
                var x;
                switch (v) {
                  case "for":
                    x = C.htmlFor;
                    break;
                  case "class":
                    (x = C.className),
                      x === "" && C.getAttribute("class") == null && (x = null);
                    break;
                  case "href":
                  case "src":
                    x = C.getAttribute(v, 2);
                    break;
                  case "title":
                    x = C.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (C.getAttribute) {
                      x = C.getAttribute(v);
                      break;
                    }
                  default:
                    if (C.hasAttribute && !C.hasAttribute(v)) break;
                    x =
                      C[v] != null ? C[v] : C.getAttribute && C.getAttribute(v);
                    break;
                }
                if (x != null)
                  return (
                    (x = x + ""),
                    y && ((x = x.toLowerCase()), (p = p.toLowerCase())),
                    m(x, p)
                  );
              }
            );
          },
          ":first-child": function (v) {
            return !o(v) && l(v);
          },
          ":last-child": function (v) {
            return !s(v) && l(v);
          },
          ":only-child": function (v) {
            return !o(v) && !s(v) && l(v);
          },
          ":nth-child": function (v, m) {
            return R(
              v,
              function () {
                return !0;
              },
              m
            );
          },
          ":nth-last-child": function (v) {
            return _[":nth-child"](v, !0);
          },
          ":root": function (v) {
            return v.ownerDocument.documentElement === v;
          },
          ":empty": function (v) {
            return !v.firstChild;
          },
          ":not": function (v) {
            var m = j(v);
            return function (p) {
              return !m(p);
            };
          },
          ":first-of-type": function (v) {
            if (l(v)) {
              for (var m = v.nodeName; (v = o(v)); )
                if (v.nodeName === m) return;
              return !0;
            }
          },
          ":last-of-type": function (v) {
            if (l(v)) {
              for (var m = v.nodeName; (v = s(v)); )
                if (v.nodeName === m) return;
              return !0;
            }
          },
          ":only-of-type": function (v) {
            return _[":first-of-type"](v) && _[":last-of-type"](v);
          },
          ":nth-of-type": function (v, m) {
            return R(
              v,
              function (p, y) {
                return p.nodeName === y.nodeName;
              },
              m
            );
          },
          ":nth-last-of-type": function (v) {
            return _[":nth-of-type"](v, !0);
          },
          ":checked": function (v) {
            return !!(v.checked || v.selected);
          },
          ":indeterminate": function (v) {
            return !_[":checked"](v);
          },
          ":enabled": function (v) {
            return !v.disabled && v.type !== "hidden";
          },
          ":disabled": function (v) {
            return !!v.disabled;
          },
          ":target": function (v) {
            return v.id === n.location.hash.substring(1);
          },
          ":focus": function (v) {
            return v === v.ownerDocument.activeElement;
          },
          ":is": function (v) {
            return j(v);
          },
          ":matches": function (v) {
            return _[":is"](v);
          },
          ":nth-match": function (v, m) {
            var p = v.split(/\s*,\s*/),
              y = p.shift(),
              C = j(p.join(","));
            return R(y, C, m);
          },
          ":nth-last-match": function (v) {
            return _[":nth-match"](v, !0);
          },
          ":links-here": function (v) {
            return v + "" == n.location + "";
          },
          ":lang": function (v) {
            return function (m) {
              for (; m; ) {
                if (m.lang) return m.lang.indexOf(v) === 0;
                m = m.parentNode;
              }
            };
          },
          ":dir": function (v) {
            return function (m) {
              for (; m; ) {
                if (m.dir) return m.dir === v;
                m = m.parentNode;
              }
            };
          },
          ":scope": function (v, m) {
            var p = m || v.ownerDocument;
            return p.nodeType === 9 ? v === p.documentElement : v === p;
          },
          ":any-link": function (v) {
            return typeof v.href == "string";
          },
          ":local-link": function (v) {
            if (v.nodeName) return v.href && v.host === n.location.host;
            var m = +v + 1;
            return function (p) {
              if (p.href) {
                var y = n.location + "",
                  C = p + "";
                return M(y, m) === M(C, m);
              }
            };
          },
          ":default": function (v) {
            return !!v.defaultSelected;
          },
          ":valid": function (v) {
            return v.willValidate || (v.validity && v.validity.valid);
          },
          ":invalid": function (v) {
            return !_[":valid"](v);
          },
          ":in-range": function (v) {
            return v.value > v.min && v.value <= v.max;
          },
          ":out-of-range": function (v) {
            return !_[":in-range"](v);
          },
          ":required": function (v) {
            return !!v.required;
          },
          ":optional": function (v) {
            return !v.required;
          },
          ":read-only": function (v) {
            if (v.readOnly) return !0;
            var m = v.getAttribute("contenteditable"),
              p = v.contentEditable,
              y = v.nodeName.toLowerCase();
            return (
              (y = y !== "input" && y !== "textarea"),
              (y || v.disabled) && m == null && p !== "true"
            );
          },
          ":read-write": function (v) {
            return !_[":read-only"](v);
          },
          ":hover": function () {
            throw new Error(":hover is not supported.");
          },
          ":active": function () {
            throw new Error(":active is not supported.");
          },
          ":link": function () {
            throw new Error(":link is not supported.");
          },
          ":visited": function () {
            throw new Error(":visited is not supported.");
          },
          ":column": function () {
            throw new Error(":column is not supported.");
          },
          ":nth-column": function () {
            throw new Error(":nth-column is not supported.");
          },
          ":nth-last-column": function () {
            throw new Error(":nth-last-column is not supported.");
          },
          ":current": function () {
            throw new Error(":current is not supported.");
          },
          ":past": function () {
            throw new Error(":past is not supported.");
          },
          ":future": function () {
            throw new Error(":future is not supported.");
          },
          ":contains": function (v) {
            return function (m) {
              var p = m.innerText || m.textContent || m.value || "";
              return p.indexOf(v) !== -1;
            };
          },
          ":has": function (v) {
            return function (m) {
              return Y(v, m).length > 0;
            };
          },
        },
        w = {
          "-": function () {
            return !0;
          },
          "=": function (v, m) {
            return v === m;
          },
          "*=": function (v, m) {
            return v.indexOf(m) !== -1;
          },
          "~=": function (v, m) {
            var p, y, C, x;
            for (y = 0; ; y = p + 1) {
              if (((p = v.indexOf(m, y)), p === -1)) return !1;
              if (
                ((C = v[p - 1]),
                (x = v[p + m.length]),
                (!C || C === " ") && (!x || x === " "))
              )
                return !0;
            }
          },
          "|=": function (v, m) {
            var p = v.indexOf(m),
              y;
            if (p === 0) return (y = v[p + m.length]), y === "-" || !y;
          },
          "^=": function (v, m) {
            return v.indexOf(m) === 0;
          },
          "$=": function (v, m) {
            var p = v.lastIndexOf(m);
            return p !== -1 && p + m.length === v.length;
          },
          "!=": function (v, m) {
            return v !== m;
          },
        },
        T = {
          " ": function (v) {
            return function (m) {
              for (; (m = m.parentNode); ) if (v(m)) return m;
            };
          },
          ">": function (v) {
            return function (m) {
              if ((m = m.parentNode)) return v(m) && m;
            };
          },
          "+": function (v) {
            return function (m) {
              if ((m = o(m))) return v(m) && m;
            };
          },
          "~": function (v) {
            return function (m) {
              for (; (m = o(m)); ) if (v(m)) return m;
            };
          },
          noop: function (v) {
            return function (m) {
              return v(m) && m;
            };
          },
          ref: function (v, m) {
            var p;
            function y(C) {
              for (
                var x = C.ownerDocument,
                  V = x.getElementsByTagName("*"),
                  K = V.length;
                K--;

              )
                if (((p = V[K]), y.test(C))) return (p = null), !0;
              p = null;
            }
            return (
              (y.combinator = function (C) {
                if (!(!p || !p.getAttribute)) {
                  var x = p.getAttribute(m) || "";
                  if (
                    (x[0] === "#" && (x = x.substring(1)), x === C.id && v(p))
                  )
                    return p;
                }
              }),
              y
            );
          },
        },
        E = {
          escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
          str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
          nonascii: /[\u00A0-\uFFFF]/,
          cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
          qname: /^ *(cssid|\*)/,
          simple: /^(?:([.#]cssid)|pseudo|attr)/,
          ref: /^ *\/(cssid)\/ */,
          combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
          attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
          pseudo: /^(:cssid)(?:\((inside)\))?/,
          inside:
            /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
          ident: /^(cssid)$/,
        };
      (E.cssid = I(E.cssid, "nonascii", E.nonascii)),
        (E.cssid = I(E.cssid, "escape", E.escape)),
        (E.qname = I(E.qname, "cssid", E.cssid)),
        (E.simple = I(E.simple, "cssid", E.cssid)),
        (E.ref = I(E.ref, "cssid", E.cssid)),
        (E.attr = I(E.attr, "cssid", E.cssid)),
        (E.pseudo = I(E.pseudo, "cssid", E.cssid)),
        (E.inside = I(E.inside, `[^"'>]*`, E.inside)),
        (E.attr = I(E.attr, "inside", b("\\[", "\\]"))),
        (E.pseudo = I(E.pseudo, "inside", b("\\(", "\\)"))),
        (E.simple = I(E.simple, "pseudo", E.pseudo)),
        (E.simple = I(E.simple, "attr", E.attr)),
        (E.ident = I(E.ident, "cssid", E.cssid)),
        (E.str_escape = I(E.str_escape, "escape", E.escape));
      var te = function (v) {
          for (
            var m = v.replace(/^\s+|\s+$/g, ""),
              p,
              y = [],
              C = [],
              x,
              V,
              K,
              he,
              S;
            m;

          ) {
            if ((K = E.qname.exec(m)))
              (m = m.substring(K[0].length)), (V = d(K[1])), C.push(re(V, !0));
            else if ((K = E.simple.exec(m)))
              (m = m.substring(K[0].length)),
                (V = "*"),
                C.push(re(V, !0)),
                C.push(re(K));
            else throw new SyntaxError("Invalid selector.");
            for (; (K = E.simple.exec(m)); )
              (m = m.substring(K[0].length)), C.push(re(K));
            if (
              (m[0] === "!" &&
                ((m = m.substring(1)),
                (x = O()),
                (x.qname = V),
                C.push(x.simple)),
              (K = E.ref.exec(m)))
            ) {
              (m = m.substring(K[0].length)),
                (S = T.ref(pe(C), d(K[1]))),
                y.push(S.combinator),
                (C = []);
              continue;
            }
            if ((K = E.combinator.exec(m))) {
              if (
                ((m = m.substring(K[0].length)),
                (he = K[1] || K[2] || K[3]),
                he === ",")
              ) {
                y.push(T.noop(pe(C)));
                break;
              }
            } else he = "noop";
            if (!T[he]) throw new SyntaxError("Bad combinator.");
            y.push(T[he](pe(C))), (C = []);
          }
          return (
            (p = z(y)),
            (p.qname = V),
            (p.sel = m),
            x &&
              ((x.lname = p.qname),
              (x.test = p),
              (x.qname = x.qname),
              (x.sel = p.sel),
              (p = x)),
            S && ((S.test = p), (S.qname = p.qname), (S.sel = p.sel), (p = S)),
            p
          );
        },
        re = function (v, m) {
          if (m) return v === "*" ? _["*"] : _.type(v);
          if (v[1])
            return v[1][0] === "."
              ? _.attr("class", "~=", d(v[1].substring(1)), !1)
              : _.attr("id", "=", d(v[1].substring(1)), !1);
          if (v[2]) return v[3] ? _[d(v[2])](u(v[3])) : _[d(v[2])];
          if (v[4]) {
            var p = v[6],
              y = /["'\s]\s*I$/i.test(p);
            return (
              y && (p = p.replace(/\s*I$/i, "")),
              _.attr(d(v[4]), v[5] || "-", u(p), y)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        pe = function (v) {
          var m = v.length,
            p;
          return m < 2
            ? v[0]
            : function (y) {
                if (y) {
                  for (p = 0; p < m; p++) if (!v[p](y)) return;
                  return !0;
                }
              };
        },
        z = function (v) {
          return v.length < 2
            ? function (m) {
                return !!v[0](m);
              }
            : function (m) {
                for (var p = v.length; p--; ) if (!(m = v[p](m))) return;
                return !0;
              };
        },
        O = function () {
          var v;
          function m(p) {
            for (
              var y = p.ownerDocument,
                C = y.getElementsByTagName(m.lname),
                x = C.length;
              x--;

            )
              if (m.test(C[x]) && v === p) return (v = null), !0;
            v = null;
          }
          return (
            (m.simple = function (p) {
              return (v = p), !0;
            }),
            m
          );
        },
        j = function (v) {
          for (var m = te(v), p = [m]; m.sel; ) (m = te(m.sel)), p.push(m);
          return p.length < 2
            ? m
            : function (y) {
                for (var C = p.length, x = 0; x < C; x++)
                  if (p[x](y)) return !0;
              };
        },
        Y = function (v, m) {
          for (
            var p = [],
              y = te(v),
              C = m.getElementsByTagName(y.qname),
              x = 0,
              V;
            (V = C[x++]);

          )
            y(V) && p.push(V);
          if (y.sel) {
            for (; y.sel; )
              for (
                y = te(y.sel), C = m.getElementsByTagName(y.qname), x = 0;
                (V = C[x++]);

              )
                y(V) && g.call(p, V) === -1 && p.push(V);
            p.sort(i);
          }
          return p;
        };
      (e.exports = t =
        function (v, m) {
          var p, y;
          if (m.nodeType !== 11 && v.indexOf(" ") === -1) {
            if (
              v[0] === "#" &&
              m.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(v) &&
              m.doc._hasMultipleElementsWithId &&
              ((p = v.substring(1)), !m.doc._hasMultipleElementsWithId(p))
            )
              return (y = m.doc.getElementById(p)), y ? [y] : [];
            if (v[0] === "." && /^\.\w+$/.test(v))
              return m.getElementsByClassName(v.substring(1));
            if (/^\w+$/.test(v)) return m.getElementsByTagName(v);
          }
          return Y(v, m);
        }),
        (t.selectors = _),
        (t.operators = w),
        (t.combinators = T),
        (t.matches = function (v, m) {
          var p = { sel: m };
          do if (((p = te(p.sel)), p(v))) return !0;
          while (p.sel);
          return !1;
        });
    },
  }),
  Kh = ae({
    "external/npm/node_modules/domino/lib/ChildNode.js"(t, e) {
      "use strict";
      var n = mt(),
        r = kb(),
        i = function (o, a) {
          for (var c = o.createDocumentFragment(), l = 0; l < a.length; l++) {
            var u = a[l],
              d = u instanceof n;
            c.appendChild(d ? u : o.createTextNode(String(u)));
          }
          return c;
        },
        s = {
          after: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                c.insertBefore(u, l);
              }
            },
          },
          before: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.previousSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (g) {
                    return g === l;
                  });

                )
                  l = l.previousSibling;
                var u = i(this.doc, a),
                  d = l ? l.nextSibling : c.firstChild;
                c.insertBefore(u, d);
              }
            },
          },
          remove: {
            value: function () {
              this.parentNode !== null &&
                (this.doc &&
                  (this.doc._preremoveNodeIterators(this),
                  this.rooted && this.doc.mutateRemove(this)),
                this._remove(),
                (this.parentNode = null));
            },
          },
          _remove: {
            value: function () {
              var a = this.parentNode;
              a !== null &&
                (a._childNodes
                  ? a._childNodes.splice(this.index, 1)
                  : a._firstChild === this &&
                    (this._nextSibling === this
                      ? (a._firstChild = null)
                      : (a._firstChild = this._nextSibling)),
                r.remove(this),
                a.modify());
            },
          },
          replaceWith: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                this.parentNode === c
                  ? c.replaceChild(u, this)
                  : c.insertBefore(u, l);
              }
            },
          },
        };
      e.exports = s;
    },
  }),
  jb = ae({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(t, e) {
      "use strict";
      var n = mt(),
        r = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var i = this.nextSibling; i !== null; i = i.nextSibling)
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var i = this.previousSibling;
                  i !== null;
                  i = i.previousSibling
                )
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
        };
      e.exports = r;
    },
  }),
  Bb = ae({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = Je();
      function r(i) {
        this.element = i;
      }
      Object.defineProperties(r.prototype, {
        length: { get: n.shouldOverride },
        item: { value: n.shouldOverride },
        getNamedItem: {
          value: function (s) {
            return this.element.getAttributeNode(s);
          },
        },
        getNamedItemNS: {
          value: function (s, o) {
            return this.element.getAttributeNodeNS(s, o);
          },
        },
        setNamedItem: { value: n.nyi },
        setNamedItemNS: { value: n.nyi },
        removeNamedItem: {
          value: function (s) {
            var o = this.element.getAttributeNode(s);
            if (o) return this.element.removeAttribute(s), o;
            n.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (s, o) {
            var a = this.element.getAttributeNodeNS(s, o);
            if (a) return this.element.removeAttributeNS(s, o), a;
            n.NotFoundError();
          },
        },
      });
    },
  }),
  Co = ae({
    "external/npm/node_modules/domino/lib/Element.js"(t, e) {
      "use strict";
      e.exports = _;
      var n = Wh(),
        r = Je(),
        i = r.NAMESPACE,
        s = Pb(),
        o = mt(),
        a = Xi(),
        c = Lb(),
        l = aA(),
        u = $h(),
        d = Fb(),
        g = Qh(),
        b = Gh(),
        I = Kh(),
        M = jb(),
        F = Bb(),
        R = Object.create(null);
      function _(m, p, y, C) {
        b.call(this),
          (this.nodeType = o.ELEMENT_NODE),
          (this.ownerDocument = m),
          (this.localName = p),
          (this.namespaceURI = y),
          (this.prefix = C),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function w(m, p) {
        if (m.nodeType === o.TEXT_NODE) p.push(m._data);
        else
          for (var y = 0, C = m.childNodes.length; y < C; y++)
            w(m.childNodes[y], p);
      }
      (_.prototype = Object.create(b.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === i.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var p;
              if (
                (this.prefix === null
                  ? (p = this.localName)
                  : (p = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var y = R[p];
                y || (R[p] = y = r.toASCIIUpperCase(p)), (p = y);
              }
              this._tagName = p;
            }
            return this._tagName;
          },
        },
        nodeName: {
          get: function () {
            return this.tagName;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: {
          get: function () {
            var m = [];
            return w(this, m), m.join("");
          },
          set: function (m) {
            this.removeChildren(),
              m != null &&
                m !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(m));
          },
        },
        innerText: {
          get: function () {
            var m = [];
            return (
              w(this, m),
              m
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (m) {
            this.removeChildren(),
              m != null &&
                m !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(m));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: r.nyi,
        },
        outerHTML: {
          get: function () {
            return c.serializeOne(this, { nodeType: 0 });
          },
          set: function (m) {
            var p = this.ownerDocument,
              y = this.parentNode;
            if (y !== null) {
              y.nodeType === o.DOCUMENT_NODE && r.NoModificationAllowedError(),
                y.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (y = y.ownerDocument.createElement("body"));
              var C = p.implementation.mozHTMLParser(p._address, y);
              C.parse(m === null ? "" : String(m), !0),
                this.replaceWith(C._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (p, y) {
            var C = !1;
            switch (p) {
              case "beforebegin":
                C = !0;
              case "afterend":
                var x = this.parentNode;
                return x === null
                  ? null
                  : x.insertBefore(y, C ? this : this.nextSibling);
              case "afterbegin":
                C = !0;
              case "beforeend":
                return this.insertBefore(y, C ? this.firstChild : null);
              default:
                return r.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (p, y) {
            if (y.nodeType !== o.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, y)
            );
          },
        },
        insertAdjacentText: {
          value: function (p, y) {
            var C = this.ownerDocument.createTextNode(y);
            (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, C);
          },
        },
        insertAdjacentHTML: {
          value: function (p, y) {
            (p = r.toASCIILowerCase(String(p))), (y = String(y));
            var C;
            switch (p) {
              case "beforebegin":
              case "afterend":
                (C = this.parentNode),
                  (C === null || C.nodeType === o.DOCUMENT_NODE) &&
                    r.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                C = this;
                break;
              default:
                r.SyntaxError();
            }
            (!(C instanceof _) ||
              (C.ownerDocument.isHTML &&
                C.localName === "html" &&
                C.namespaceURI === i.HTML)) &&
              (C = C.ownerDocument.createElementNS(i.HTML, "body"));
            var x = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              C
            );
            x.parse(y, !0), this._insertAdjacent(p, x._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new re(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new E(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var m = this.firstChild; m !== null; m = m.nextSibling)
              if (m.nodeType === o.ELEMENT_NODE) return m;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var m = this.lastChild; m !== null; m = m.previousSibling)
              if (m.nodeType === o.ELEMENT_NODE) return m;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (m) {
            m || (m = this.ownerDocument.documentElement);
            var p = this.firstElementChild;
            if (!p) {
              if (this === m) return null;
              p = this.nextElementSibling;
            }
            if (p) return p;
            for (var y = this.parentElement; y && y !== m; y = y.parentElement)
              if (((p = y.nextElementSibling), p)) return p;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (p) {
            var y;
            return p
              ? (p === "*"
                  ? (y = function () {
                      return !0;
                    })
                  : this.isHTML
                  ? (y = z(p))
                  : (y = pe(p)),
                new l(this, y))
              : new a();
          },
        },
        getElementsByTagNameNS: {
          value: function (p, y) {
            var C;
            return (
              p === "*" && y === "*"
                ? (C = function () {
                    return !0;
                  })
                : p === "*"
                ? (C = pe(y))
                : y === "*"
                ? (C = O(p))
                : (C = j(p, y)),
              new l(this, C)
            );
          },
        },
        getElementsByClassName: {
          value: function (p) {
            if (((p = String(p).trim()), p === "")) {
              var y = new a();
              return y;
            }
            return (p = p.split(/[ \t\r\n\f]+/)), new l(this, Y(p));
          },
        },
        getElementsByName: {
          value: function (p) {
            return new l(this, v(String(p)));
          },
        },
        clone: {
          value: function () {
            var p;
            this.namespaceURI !== i.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (p = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName
                ))
              : (p = this.ownerDocument.createElement(this.localName));
            for (var y = 0, C = this._attrKeys.length; y < C; y++) {
              var x = this._attrKeys[y],
                V = this._attrsByLName[x],
                K = V.cloneNode();
              K._setOwnerElement(p), (p._attrsByLName[x] = K), p._addQName(K);
            }
            return (p._attrKeys = this._attrKeys.concat()), p;
          },
        },
        isEqual: {
          value: function (p) {
            if (
              this.localName !== p.localName ||
              this.namespaceURI !== p.namespaceURI ||
              this.prefix !== p.prefix ||
              this._numattrs !== p._numattrs
            )
              return !1;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var x = this._attr(y);
              if (
                !p.hasAttributeNS(x.namespaceURI, x.localName) ||
                p.getAttributeNS(x.namespaceURI, x.localName) !== x.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (p, y) {
            if (
              this.namespaceURI &&
              this.namespaceURI === p &&
              this.prefix !== null &&
              y.lookupNamespaceURI(this.prefix) === p
            )
              return this.prefix;
            for (var C = 0, x = this._numattrs; C < x; C++) {
              var V = this._attr(C);
              if (
                V.prefix === "xmlns" &&
                V.value === p &&
                y.lookupNamespaceURI(V.localName) === p
              )
                return V.localName;
            }
            var K = this.parentElement;
            return K ? K._lookupNamespacePrefix(p, y) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (p) {
            if (
              ((p === "" || p === void 0) && (p = null),
              this.namespaceURI !== null && this.prefix === p)
            )
              return this.namespaceURI;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var x = this._attr(y);
              if (
                x.namespaceURI === i.XMLNS &&
                ((x.prefix === "xmlns" && x.localName === p) ||
                  (p === null && x.prefix === null && x.localName === "xmlns"))
              )
                return x.value || null;
            }
            var V = this.parentElement;
            return V ? V.lookupNamespaceURI(p) : null;
          },
        },
        getAttribute: {
          value: function (p) {
            var y = this.getAttributeNode(p);
            return y ? y.value : null;
          },
        },
        getAttributeNS: {
          value: function (p, y) {
            var C = this.getAttributeNodeNS(p, y);
            return C ? C.value : null;
          },
        },
        getAttributeNode: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            return y ? (Array.isArray(y) && (y = y[0]), y) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = this._attrsByLName[p + "|" + y];
            return C || null;
          },
        },
        hasAttribute: {
          value: function (p) {
            return (
              (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._attrsByQName[p] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y;
            return this._attrsByLName[C] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var C = this._attrsByQName[p];
            return C === void 0
              ? y === void 0 || y === !0
                ? (this._setAttribute(p, ""), !0)
                : !1
              : y === void 0 || y === !1
              ? (this.removeAttribute(p), !1)
              : !0;
          },
        },
        _setAttribute: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              x;
            C
              ? Array.isArray(C) && (C = C[0])
              : ((C = this._newattr(p)), (x = !0)),
              (C.value = y),
              this._attributes && (this._attributes[p] = C),
              x && this._newattrhook && this._newattrhook(p, y);
          },
        },
        setAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._setAttribute(p, String(y));
          },
        },
        _setAttributeNS: {
          value: function (p, y, C) {
            var x = y.indexOf(":"),
              V,
              K;
            x < 0
              ? ((V = null), (K = y))
              : ((V = y.substring(0, x)), (K = y.substring(x + 1))),
              (p === "" || p === void 0) && (p = null);
            var he = (p === null ? "" : p) + "|" + K,
              S = this._attrsByLName[he],
              k;
            S ||
              ((S = new T(this, K, V, p)),
              (k = !0),
              (this._attrsByLName[he] = S),
              this._attributes && (this._attributes[this._attrKeys.length] = S),
              this._attrKeys.push(he),
              this._addQName(S)),
              (S.value = C),
              k && this._newattrhook && this._newattrhook(y, C);
          },
        },
        setAttributeNS: {
          value: function (p, y, C) {
            (p = p == null || p === "" ? null : String(p)),
              (y = String(y)),
              n.isValidQName(y) || r.InvalidCharacterError();
            var x = y.indexOf(":"),
              V = x < 0 ? null : y.substring(0, x);
            ((V !== null && p === null) ||
              (V === "xml" && p !== i.XML) ||
              ((y === "xmlns" || V === "xmlns") && p !== i.XMLNS) ||
              (p === i.XMLNS && !(y === "xmlns" || V === "xmlns"))) &&
              r.NamespaceError(),
              this._setAttributeNS(p, y, String(C));
          },
        },
        setAttributeNode: {
          value: function (p) {
            if (p.ownerElement !== null && p.ownerElement !== this)
              throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = null,
              C = this._attrsByQName[p.name];
            if (C) {
              if (
                (Array.isArray(C) || (C = [C]),
                C.some(function (x) {
                  return x === p;
                }))
              )
                return p;
              if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
              C.forEach(function (x) {
                this.removeAttributeNode(x);
              }, this),
                (y = C[0]);
            }
            return this.setAttributeNodeNS(p), y;
          },
        },
        setAttributeNodeNS: {
          value: function (p) {
            if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName,
              x = this._attrsByLName[C];
            return (
              x && this.removeAttributeNode(x),
              p._setOwnerElement(this),
              (this._attrsByLName[C] = p),
              this._attributes && (this._attributes[this._attrKeys.length] = p),
              this._attrKeys.push(C),
              this._addQName(p),
              this._newattrhook && this._newattrhook(p.name, p.value),
              x || null
            );
          },
        },
        removeAttribute: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            if (y) {
              Array.isArray(y)
                ? y.length > 2
                  ? (y = y.shift())
                  : ((this._attrsByQName[p] = y[1]), (y = y[0]))
                : (this._attrsByQName[p] = void 0);
              var C = y.namespaceURI,
                x = (C === null ? "" : C) + "|" + y.localName;
              this._attrsByLName[x] = void 0;
              var V = this._attrKeys.indexOf(x);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, V, 1),
                (this._attributes[p] = void 0)),
                this._attrKeys.splice(V, 1);
              var K = y.onchange;
              y._setOwnerElement(null),
                K && K.call(y, this, y.localName, y.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(y);
            }
          },
        },
        removeAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y,
              x = this._attrsByLName[C];
            if (x) {
              this._attrsByLName[C] = void 0;
              var V = this._attrKeys.indexOf(C);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, V, 1),
                this._attrKeys.splice(V, 1),
                this._removeQName(x);
              var K = x.onchange;
              x._setOwnerElement(null),
                K && K.call(x, this, x.localName, x.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(x);
            }
          },
        },
        removeAttributeNode: {
          value: function (p) {
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName;
            return (
              this._attrsByLName[C] !== p && r.NotFoundError(),
              this.removeAttributeNS(y, p.localName),
              p
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var p = this;
            return this._attrKeys.map(function (y) {
              return p._attrsByLName[y].name;
            });
          },
        },
        _getattr: {
          value: function (p) {
            var y = this._attrsByQName[p];
            return y ? y.value : null;
          },
        },
        _setattr: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              x;
            C || ((C = this._newattr(p)), (x = !0)),
              (C.value = String(y)),
              this._attributes && (this._attributes[p] = C),
              x && this._newattrhook && this._newattrhook(p, y);
          },
        },
        _newattr: {
          value: function (p) {
            var y = new T(this, p, null, null),
              C = "|" + p;
            return (
              (this._attrsByQName[p] = y),
              (this._attrsByLName[C] = y),
              this._attributes && (this._attributes[this._attrKeys.length] = y),
              this._attrKeys.push(C),
              y
            );
          },
        },
        _addQName: {
          value: function (m) {
            var p = m.name,
              y = this._attrsByQName[p];
            y
              ? Array.isArray(y)
                ? y.push(m)
                : (this._attrsByQName[p] = [y, m])
              : (this._attrsByQName[p] = m),
              this._attributes && (this._attributes[p] = m);
          },
        },
        _removeQName: {
          value: function (m) {
            var p = m.name,
              y = this._attrsByQName[p];
            if (Array.isArray(y)) {
              var C = y.indexOf(m);
              r.assert(C !== -1),
                y.length === 2
                  ? ((this._attrsByQName[p] = y[1 - C]),
                    this._attributes &&
                      (this._attributes[p] = this._attrsByQName[p]))
                  : (y.splice(C, 1),
                    this._attributes &&
                      this._attributes[p] === m &&
                      (this._attributes[p] = y[0]));
            } else
              r.assert(y === m),
                (this._attrsByQName[p] = void 0),
                this._attributes && (this._attributes[p] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (m) {
            return this._attrsByLName[this._attrKeys[m]];
          },
        },
        id: s.property({ name: "id" }),
        className: s.property({ name: "class" }),
        classList: {
          get: function () {
            var m = this;
            if (this._classList) return this._classList;
            var p = new d(
              function () {
                return m.className || "";
              },
              function (y) {
                m.className = y;
              }
            );
            return (this._classList = p), p;
          },
          set: function (m) {
            this.className = m;
          },
        },
        matches: {
          value: function (m) {
            return g.matches(this, m);
          },
        },
        closest: {
          value: function (m) {
            var p = this;
            do {
              if (p.matches && p.matches(m)) return p;
              p = p.parentElement || p.parentNode;
            } while (p !== null && p.nodeType === o.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (m) {
            return g(m, this)[0];
          },
        },
        querySelectorAll: {
          value: function (m) {
            var p = g(m, this);
            return p.item ? p : new a(p);
          },
        },
      })),
        Object.defineProperties(_.prototype, I),
        Object.defineProperties(_.prototype, M),
        s.registerChangeHandler(_, "id", function (m, p, y, C) {
          m.rooted &&
            (y && m.ownerDocument.delId(y, m),
            C && m.ownerDocument.addId(C, m));
        }),
        s.registerChangeHandler(_, "class", function (m, p, y, C) {
          m._classList && m._classList._update();
        });
      function T(m, p, y, C, x) {
        (this.localName = p),
          (this.prefix = y === null || y === "" ? null : "" + y),
          (this.namespaceURI = C === null || C === "" ? null : "" + C),
          (this.data = x),
          this._setOwnerElement(m);
      }
      (T.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (p) {
            (this._ownerElement = p),
              this.prefix === null && this.namespaceURI === null && p
                ? (this.onchange = p._attributeChangeHandlers[this.localName])
                : (this.onchange = null);
          },
        },
        name: {
          get: function () {
            return this.prefix
              ? this.prefix + ":" + this.localName
              : this.localName;
          },
        },
        specified: {
          get: function () {
            return !0;
          },
        },
        value: {
          get: function () {
            return this.data;
          },
          set: function (m) {
            var p = this.data;
            (m = m === void 0 ? "" : m + ""),
              m !== p &&
                ((this.data = m),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, p, m),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, p)));
          },
        },
        cloneNode: {
          value: function (p) {
            return new T(
              null,
              this.localName,
              this.prefix,
              this.namespaceURI,
              this.data
            );
          },
        },
        nodeType: {
          get: function () {
            return o.ATTRIBUTE_NODE;
          },
        },
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            this.value = m;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            m == null && (m = ""), (this.value = m);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            m == null && (m = ""), (this.value = m);
          },
        },
      })),
        (_._Attr = T);
      function E(m) {
        F.call(this, m);
        for (var p in m._attrsByQName) this[p] = m._attrsByQName[p];
        for (var y = 0; y < m._attrKeys.length; y++)
          this[y] = m._attrsByLName[m._attrKeys[y]];
      }
      E.prototype = Object.create(F.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (m) {
            return (
              (m = m >>> 0),
              m >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[m]]
            );
          },
        },
      });
      var te;
      (te = globalThis.Symbol) != null &&
        te.iterator &&
        (E.prototype[globalThis.Symbol.iterator] = function () {
          var m = 0,
            p = this.length,
            y = this;
          return {
            next: function () {
              return m < p ? { value: y.item(m++) } : { done: !0 };
            },
          };
        });
      function re(m) {
        (this.element = m), this.updateCache();
      }
      re.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (p) {
            return this.updateCache(), this.childrenByNumber[p] || null;
          },
        },
        namedItem: {
          value: function (p) {
            return this.updateCache(), this.childrenByName[p] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var p =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var y =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  C = 0;
                C < y;
                C++
              )
                this[C] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var x = this.element.firstChild;
                x !== null;
                x = x.nextSibling
              )
                if (x.nodeType === o.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = x),
                    this.childrenByNumber.push(x);
                  var V = x.getAttribute("id");
                  V && !this.childrenByName[V] && (this.childrenByName[V] = x);
                  var K = x.getAttribute("name");
                  K &&
                    this.element.namespaceURI === i.HTML &&
                    p.test(this.element.localName) &&
                    !this.childrenByName[K] &&
                    (this.childrenByName[V] = x);
                }
            }
          },
        },
      });
      function pe(m) {
        return function (p) {
          return p.localName === m;
        };
      }
      function z(m) {
        var p = r.toASCIILowerCase(m);
        return p === m
          ? pe(m)
          : function (y) {
              return y.isHTML ? y.localName === p : y.localName === m;
            };
      }
      function O(m) {
        return function (p) {
          return p.namespaceURI === m;
        };
      }
      function j(m, p) {
        return function (y) {
          return y.namespaceURI === m && y.localName === p;
        };
      }
      function Y(m) {
        return function (p) {
          return m.every(function (y) {
            return p.classList.contains(y);
          });
        };
      }
      function v(m) {
        return function (p) {
          return p.namespaceURI !== i.HTML ? !1 : p.getAttribute("name") === m;
        };
      }
    },
  }),
  Hb = ae({
    "external/npm/node_modules/domino/lib/Leaf.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = mt(),
        r = Xi(),
        i = Je(),
        s = i.HierarchyRequestError,
        o = i.NotFoundError;
      function a() {
        n.call(this);
      }
      a.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        replaceChild: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        removeChild: {
          value: function (c) {
            if (!c.nodeType) throw new TypeError("not a node");
            o();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new r()), this._childNodes
            );
          },
        },
      });
    },
  }),
  Rl = ae({
    "external/npm/node_modules/domino/lib/CharacterData.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = Hb(),
        r = Je(),
        i = Kh(),
        s = jb();
      function o() {
        n.call(this);
      }
      (o.prototype = Object.create(n.prototype, {
        substringData: {
          value: function (c, l) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (c = c >>> 0),
              (l = l >>> 0),
              (c > this.data.length || c < 0 || l < 0) && r.IndexSizeError(),
              this.data.substring(c, c + l)
            );
          },
        },
        appendData: {
          value: function (c) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(c);
          },
        },
        insertData: {
          value: function (c, l) {
            return this.replaceData(c, 0, l);
          },
        },
        deleteData: {
          value: function (c, l) {
            return this.replaceData(c, l, "");
          },
        },
        replaceData: {
          value: function (c, l, u) {
            var d = this.data,
              g = d.length;
            (c = c >>> 0),
              (l = l >>> 0),
              (u = String(u)),
              (c > g || c < 0) && r.IndexSizeError(),
              c + l > g && (l = g - c);
            var b = d.substring(0, c),
              I = d.substring(c + l);
            this.data = b + u + I;
          },
        },
        isEqual: {
          value: function (c) {
            return this._data === c._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(o.prototype, i),
        Object.defineProperties(o.prototype, s);
    },
  }),
  Ub = ae({
    "external/npm/node_modules/domino/lib/Text.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = Je(),
        r = mt(),
        i = Rl();
      function s(a, c) {
        i.call(this),
          (this.nodeType = r.TEXT_NODE),
          (this.ownerDocument = a),
          (this._data = c),
          (this._index = void 0);
      }
      var o = {
        get: function () {
          return this._data;
        },
        set: function (a) {
          a == null ? (a = "") : (a = String(a)),
            a !== this._data &&
              ((this._data = a),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      s.prototype = Object.create(i.prototype, {
        nodeName: { value: "#text" },
        nodeValue: o,
        textContent: o,
        innerText: o,
        data: {
          get: o.get,
          set: function (a) {
            o.set.call(this, a === null ? "" : String(a));
          },
        },
        splitText: {
          value: function (c) {
            (c > this._data.length || c < 0) && n.IndexSizeError();
            var l = this._data.substring(c),
              u = this.ownerDocument.createTextNode(l);
            this.data = this.data.substring(0, c);
            var d = this.parentNode;
            return d !== null && d.insertBefore(u, this.nextSibling), u;
          },
        },
        wholeText: {
          get: function () {
            for (
              var c = this.textContent, l = this.nextSibling;
              l && l.nodeType === r.TEXT_NODE;
              l = l.nextSibling
            )
              c += l.textContent;
            return c;
          },
        },
        replaceWholeText: { value: n.nyi },
        clone: {
          value: function () {
            return new s(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  Vb = ae({
    "external/npm/node_modules/domino/lib/Comment.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = mt(),
        r = Rl();
      function i(o, a) {
        r.call(this),
          (this.nodeType = n.COMMENT_NODE),
          (this.ownerDocument = o),
          (this._data = a);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  qb = ae({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = mt(),
        r = Xi(),
        i = Gh(),
        s = Co(),
        o = Qh(),
        a = Je();
      function c(l) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = l);
      }
      c.prototype = Object.create(i.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          s.prototype,
          "textContent"
        ),
        innerText: Object.getOwnPropertyDescriptor(s.prototype, "innerText"),
        querySelector: {
          value: function (l) {
            var u = this.querySelectorAll(l);
            return u.length ? u[0] : null;
          },
        },
        querySelectorAll: {
          value: function (l) {
            var u = Object.create(this);
            (u.isHTML = !0),
              (u.getElementsByTagName = s.prototype.getElementsByTagName),
              (u.nextElement = Object.getOwnPropertyDescriptor(
                s.prototype,
                "firstElementChild"
              ).get);
            var d = o(l, u);
            return d.item ? d : new r(d);
          },
        },
        clone: {
          value: function () {
            return new c(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (u) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
      });
    },
  }),
  $b = ae({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = mt(),
        r = Rl();
      function i(o, a, c) {
        r.call(this),
          (this.nodeType = n.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = o),
          (this.target = a),
          (this._data = c);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (a) {
            return this.target === a.target && this._data === a._data;
          },
        },
      });
    },
  }),
  Ol = ae({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(t, e) {
      "use strict";
      var n = {
        FILTER_ACCEPT: 1,
        FILTER_REJECT: 2,
        FILTER_SKIP: 3,
        SHOW_ALL: 4294967295,
        SHOW_ELEMENT: 1,
        SHOW_ATTRIBUTE: 2,
        SHOW_TEXT: 4,
        SHOW_CDATA_SECTION: 8,
        SHOW_ENTITY_REFERENCE: 16,
        SHOW_ENTITY: 32,
        SHOW_PROCESSING_INSTRUCTION: 64,
        SHOW_COMMENT: 128,
        SHOW_DOCUMENT: 256,
        SHOW_DOCUMENT_TYPE: 512,
        SHOW_DOCUMENT_FRAGMENT: 1024,
        SHOW_NOTATION: 2048,
      };
      e.exports = n.constructor = n.prototype = n;
    },
  }),
  zb = ae({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(t, e) {
      "use strict";
      var n = (e.exports = {
        nextSkippingChildren: r,
        nextAncestorSibling: i,
        next: s,
        previous: a,
        deepLastChild: o,
      });
      function r(c, l) {
        return c === l
          ? null
          : c.nextSibling !== null
          ? c.nextSibling
          : i(c, l);
      }
      function i(c, l) {
        for (c = c.parentNode; c !== null; c = c.parentNode) {
          if (c === l) return null;
          if (c.nextSibling !== null) return c.nextSibling;
        }
        return null;
      }
      function s(c, l) {
        var u;
        return (
          (u = c.firstChild),
          u !== null
            ? u
            : c === l
            ? null
            : ((u = c.nextSibling), u !== null ? u : i(c, l))
        );
      }
      function o(c) {
        for (; c.lastChild; ) c = c.lastChild;
        return c;
      }
      function a(c, l) {
        var u;
        return (
          (u = c.previousSibling),
          u !== null ? o(u) : ((u = c.parentNode), u === l ? null : u)
        );
      }
    },
  }),
  cA = ae({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(t, e) {
      "use strict";
      e.exports = u;
      var n = mt(),
        r = Ol(),
        i = zb(),
        s = Je(),
        o = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        a = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function c(d, g) {
        var b, I, M, F, R;
        for (I = d._currentNode[o[g]]; I !== null; ) {
          if (((F = d._internalFilter(I)), F === r.FILTER_ACCEPT))
            return (d._currentNode = I), I;
          if (F === r.FILTER_SKIP && ((b = I[o[g]]), b !== null)) {
            I = b;
            continue;
          }
          for (; I !== null; ) {
            if (((R = I[a[g]]), R !== null)) {
              I = R;
              break;
            }
            if (
              ((M = I.parentNode),
              M === null || M === d.root || M === d._currentNode)
            )
              return null;
            I = M;
          }
        }
        return null;
      }
      function l(d, g) {
        var b, I, M;
        if (((b = d._currentNode), b === d.root)) return null;
        for (;;) {
          for (M = b[a[g]]; M !== null; ) {
            if (((b = M), (I = d._internalFilter(b)), I === r.FILTER_ACCEPT))
              return (d._currentNode = b), b;
            (M = b[o[g]]),
              (I === r.FILTER_REJECT || M === null) && (M = b[a[g]]);
          }
          if (
            ((b = b.parentNode),
            b === null ||
              b === d.root ||
              d._internalFilter(b) === r.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function u(d, g, b) {
        (!d || !d.nodeType) && s.NotSupportedError(),
          (this._root = d),
          (this._whatToShow = Number(g) || 0),
          (this._filter = b || null),
          (this._active = !1),
          (this._currentNode = d);
      }
      Object.defineProperties(u.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        currentNode: {
          get: function () {
            return this._currentNode;
          },
          set: function (g) {
            if (!(g instanceof n)) throw new TypeError("Not a Node");
            this._currentNode = g;
          },
        },
        _internalFilter: {
          value: function (g) {
            var b, I;
            if (
              (this._active && s.InvalidStateError(),
              !((1 << (g.nodeType - 1)) & this._whatToShow))
            )
              return r.FILTER_SKIP;
            if (((I = this._filter), I === null)) b = r.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof I == "function" ? (b = I(g)) : (b = I.acceptNode(g));
              } finally {
                this._active = !1;
              }
            }
            return +b;
          },
        },
        parentNode: {
          value: function () {
            for (var g = this._currentNode; g !== this.root; ) {
              if (((g = g.parentNode), g === null)) return null;
              if (this._internalFilter(g) === r.FILTER_ACCEPT)
                return (this._currentNode = g), g;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return c(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return c(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return l(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return l(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var g, b, I, M;
            for (g = this._currentNode; g !== this._root; ) {
              for (I = g.previousSibling; I; I = g.previousSibling)
                if (
                  ((g = I),
                  (b = this._internalFilter(g)),
                  b !== r.FILTER_REJECT)
                ) {
                  for (
                    M = g.lastChild;
                    M &&
                    ((g = M),
                    (b = this._internalFilter(g)),
                    b !== r.FILTER_REJECT);
                    M = g.lastChild
                  );
                  if (b === r.FILTER_ACCEPT) return (this._currentNode = g), g;
                }
              if (g === this.root || g.parentNode === null) return null;
              if (
                ((g = g.parentNode),
                this._internalFilter(g) === r.FILTER_ACCEPT)
              )
                return (this._currentNode = g), g;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var g, b, I, M;
            (g = this._currentNode), (b = r.FILTER_ACCEPT);
            e: for (;;) {
              for (I = g.firstChild; I; I = g.firstChild) {
                if (
                  ((g = I),
                  (b = this._internalFilter(g)),
                  b === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = g), g;
                if (b === r.FILTER_REJECT) break;
              }
              for (
                M = i.nextSkippingChildren(g, this.root);
                M;
                M = i.nextSkippingChildren(g, this.root)
              ) {
                if (
                  ((g = M),
                  (b = this._internalFilter(g)),
                  b === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = g), g;
                if (b === r.FILTER_SKIP) continue e;
              }
              return null;
            }
          },
        },
        toString: {
          value: function () {
            return "[object TreeWalker]";
          },
        },
      });
    },
  }),
  lA = ae({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = Ol(),
        r = zb(),
        i = Je();
      function s(l, u, d) {
        return d ? r.next(l, u) : l === u ? null : r.previous(l, null);
      }
      function o(l, u) {
        for (; u; u = u.parentNode) if (l === u) return !0;
        return !1;
      }
      function a(l, u) {
        var d, g;
        for (d = l._referenceNode, g = l._pointerBeforeReferenceNode; ; ) {
          if (g === u) g = !g;
          else if (((d = s(d, l._root, u)), d === null)) return null;
          var b = l._internalFilter(d);
          if (b === n.FILTER_ACCEPT) break;
        }
        return (l._referenceNode = d), (l._pointerBeforeReferenceNode = g), d;
      }
      function c(l, u, d) {
        (!l || !l.nodeType) && i.NotSupportedError(),
          (this._root = l),
          (this._referenceNode = l),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(u) || 0),
          (this._filter = d || null),
          (this._active = !1),
          l.doc._attachNodeIterator(this);
      }
      Object.defineProperties(c.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        referenceNode: {
          get: function () {
            return this._referenceNode;
          },
        },
        pointerBeforeReferenceNode: {
          get: function () {
            return this._pointerBeforeReferenceNode;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        _internalFilter: {
          value: function (u) {
            var d, g;
            if (
              (this._active && i.InvalidStateError(),
              !((1 << (u.nodeType - 1)) & this._whatToShow))
            )
              return n.FILTER_SKIP;
            if (((g = this._filter), g === null)) d = n.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof g == "function" ? (d = g(u)) : (d = g.acceptNode(u));
              } finally {
                this._active = !1;
              }
            }
            return +d;
          },
        },
        _preremove: {
          value: function (u) {
            if (!o(u, this._root) && o(u, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var d = u; d.lastChild; ) d = d.lastChild;
                if (((d = r.next(d, this.root)), d)) {
                  this._referenceNode = d;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (u.previousSibling === null)
                this._referenceNode = u.parentNode;
              else {
                this._referenceNode = u.previousSibling;
                var g;
                for (
                  g = this._referenceNode.lastChild;
                  g;
                  g = this._referenceNode.lastChild
                )
                  this._referenceNode = g;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return a(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return a(this, !1);
          },
        },
        detach: { value: function () {} },
        toString: {
          value: function () {
            return "[object NodeIterator]";
          },
        },
      });
    },
  }),
  Yh = ae({
    "external/npm/node_modules/domino/lib/URL.js"(t, e) {
      "use strict";
      e.exports = n;
      function n(r) {
        if (!r) return Object.create(n.prototype);
        this.url = r.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var i = n.pattern.exec(this.url);
        if (i) {
          if ((i[2] && (this.scheme = i[2]), i[4])) {
            var s = i[4].match(n.userinfoPattern);
            if (
              (s &&
                ((this.username = s[1]),
                (this.password = s[3]),
                (i[4] = i[4].substring(s[0].length))),
              i[4].match(n.portPattern))
            ) {
              var o = i[4].lastIndexOf(":");
              (this.host = i[4].substring(0, o)),
                (this.port = i[4].substring(o + 1));
            } else this.host = i[4];
          }
          i[5] && (this.path = i[5]),
            i[6] && (this.query = i[7]),
            i[8] && (this.fragment = i[9]);
        }
      }
      (n.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (n.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (n.portPattern = /:\d+$/),
        (n.authorityPattern = /^[^:\/?#]+:\/\//),
        (n.hierarchyPattern = /^[^:\/?#]+:\//),
        (n.percentEncode = function (i) {
          var s = i.charCodeAt(0);
          if (s < 256) return "%" + s.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (n.prototype = {
          constructor: n,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return n.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return n.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var r = "";
            return (
              this.scheme !== void 0 && (r += this.scheme + ":"),
              this.isAbsolute() &&
                ((r += "//"),
                (this.username || this.password) &&
                  ((r += this.username || ""),
                  this.password && (r += ":" + this.password),
                  (r += "@")),
                this.host && (r += this.host)),
              this.port !== void 0 && (r += ":" + this.port),
              this.path !== void 0 && (r += this.path),
              this.query !== void 0 && (r += "?" + this.query),
              this.fragment !== void 0 && (r += "#" + this.fragment),
              r
            );
          },
          resolve: function (r) {
            var i = this,
              s = new n(r),
              o = new n();
            return (
              s.scheme !== void 0
                ? ((o.scheme = s.scheme),
                  (o.username = s.username),
                  (o.password = s.password),
                  (o.host = s.host),
                  (o.port = s.port),
                  (o.path = c(s.path)),
                  (o.query = s.query))
                : ((o.scheme = i.scheme),
                  s.host !== void 0
                    ? ((o.username = s.username),
                      (o.password = s.password),
                      (o.host = s.host),
                      (o.port = s.port),
                      (o.path = c(s.path)),
                      (o.query = s.query))
                    : ((o.username = i.username),
                      (o.password = i.password),
                      (o.host = i.host),
                      (o.port = i.port),
                      s.path
                        ? (s.path.charAt(0) === "/"
                            ? (o.path = c(s.path))
                            : ((o.path = a(i.path, s.path)),
                              (o.path = c(o.path))),
                          (o.query = s.query))
                        : ((o.path = i.path),
                          s.query !== void 0
                            ? (o.query = s.query)
                            : (o.query = i.query)))),
              (o.fragment = s.fragment),
              o.toString()
            );
            function a(l, u) {
              if (i.host !== void 0 && !i.path) return "/" + u;
              var d = l.lastIndexOf("/");
              return d === -1 ? u : l.substring(0, d + 1) + u;
            }
            function c(l) {
              if (!l) return l;
              for (var u = ""; l.length > 0; ) {
                if (l === "." || l === "..") {
                  l = "";
                  break;
                }
                var d = l.substring(0, 2),
                  g = l.substring(0, 3),
                  b = l.substring(0, 4);
                if (g === "../") l = l.substring(3);
                else if (d === "./") l = l.substring(2);
                else if (g === "/./") l = "/" + l.substring(3);
                else if (d === "/." && l.length === 2) l = "/";
                else if (b === "/../" || (g === "/.." && l.length === 3))
                  (l = "/" + l.substring(4)), (u = u.replace(/\/?[^\/]*$/, ""));
                else {
                  var I = l.match(/(\/?([^\/]*))/)[0];
                  (u += I), (l = l.substring(I.length));
                }
              }
              return u;
            }
          },
        });
    },
  }),
  uA = ae({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = So();
      function r(i, s) {
        n.call(this, i, s);
      }
      r.prototype = Object.create(n.prototype, { constructor: { value: r } });
    },
  }),
  Gb = ae({
    "external/npm/node_modules/domino/lib/events.js"(t, e) {
      "use strict";
      e.exports = {
        Event: So(),
        UIEvent: xb(),
        MouseEvent: Rb(),
        CustomEvent: uA(),
      };
    },
  }),
  dA = ae({
    "external/npm/node_modules/domino/lib/style_parser.js"(t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.hyphenate = t.parse = void 0);
      function e(r) {
        let i = [],
          s = 0,
          o = 0,
          a = 0,
          c = 0,
          l = 0,
          u = null;
        for (; s < r.length; )
          switch (r.charCodeAt(s++)) {
            case 40:
              o++;
              break;
            case 41:
              o--;
              break;
            case 39:
              a === 0
                ? (a = 39)
                : a === 39 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 34:
              a === 0
                ? (a = 34)
                : a === 34 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 58:
              !u &&
                o === 0 &&
                a === 0 &&
                ((u = n(r.substring(l, s - 1).trim())), (c = s));
              break;
            case 59:
              if (u && c > 0 && o === 0 && a === 0) {
                let g = r.substring(c, s - 1).trim();
                i.push(u, g), (l = s), (c = 0), (u = null);
              }
              break;
          }
        if (u && c) {
          let d = r.slice(c).trim();
          i.push(u, d);
        }
        return i;
      }
      t.parse = e;
      function n(r) {
        return r
          .replace(/[a-z][A-Z]/g, (i) => i.charAt(0) + "-" + i.charAt(1))
          .toLowerCase();
      }
      t.hyphenate = n;
    },
  }),
  Zh = ae({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(t, e) {
      "use strict";
      var { parse: n } = dA();
      e.exports = function (c) {
        let l = new i(c),
          u = {
            get: function (d, g) {
              return g in d ? d[g] : d.getPropertyValue(r(g));
            },
            has: function (d, g) {
              return !0;
            },
            set: function (d, g, b) {
              return g in d ? (d[g] = b) : d.setProperty(r(g), b ?? void 0), !0;
            },
          };
        return new Proxy(l, u);
      };
      function r(c) {
        return c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function i(c) {
        this._element = c;
      }
      var s = "!important";
      function o(c) {
        let l = { property: {}, priority: {} };
        if (!c) return l;
        let u = n(c);
        if (u.length < 2) return l;
        for (let d = 0; d < u.length; d += 2) {
          let g = u[d],
            b = u[d + 1];
          b.endsWith(s) &&
            ((l.priority[g] = "important"), (b = b.slice(0, -s.length).trim())),
            (l.property[g] = b);
        }
        return l;
      }
      var a = {};
      i.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var c = this.cssText;
              (this._parsedStyles = o(c)),
                (this._lastParsedText = c),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var c = this._parsed,
              l = "";
            for (var u in c.property)
              l && (l += " "),
                (l += u + ": " + c.property[u]),
                c.priority[u] && (l += " !" + c.priority[u]),
                (l += ";");
            (this.cssText = l), (this._lastParsedText = l), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (c) {
            this._element.setAttribute("style", c);
          },
        },
        length: {
          get: function () {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property
                )),
              this._names.length
            );
          },
        },
        item: {
          value: function (c) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property
                )),
              this._names[c]
            );
          },
        },
        getPropertyValue: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.property[c] || "";
          },
        },
        getPropertyPriority: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.priority[c] || "";
          },
        },
        setProperty: {
          value: function (c, l, u) {
            if (
              ((c = c.toLowerCase()),
              l == null && (l = ""),
              u == null && (u = ""),
              l !== a && (l = "" + l),
              (l = l.trim()),
              l === "")
            ) {
              this.removeProperty(c);
              return;
            }
            if (!(u !== "" && u !== a && !/^important$/i.test(u))) {
              var d = this._parsed;
              if (l === a) {
                if (!d.property[c]) return;
                u !== "" ? (d.priority[c] = "important") : delete d.priority[c];
              } else {
                if (l.includes(";") && !l.includes("data:")) return;
                var g = o(c + ":" + l);
                if (
                  Object.getOwnPropertyNames(g.property).length === 0 ||
                  Object.getOwnPropertyNames(g.priority).length !== 0
                )
                  return;
                for (var b in g.property)
                  (d.property[b] = g.property[b]),
                    u !== a &&
                      (u !== ""
                        ? (d.priority[b] = "important")
                        : d.priority[b] && delete d.priority[b]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (c, l) {
            return this.setProperty(c, l, a);
          },
        },
        setPropertyPriority: {
          value: function (c, l) {
            return this.setProperty(c, a, l);
          },
        },
        removeProperty: {
          value: function (c) {
            c = c.toLowerCase();
            var l = this._parsed;
            c in l.property &&
              (delete l.property[c], delete l.priority[c], this._serialize());
          },
        },
      });
    },
  }),
  Wb = ae({
    "external/npm/node_modules/domino/lib/URLUtils.js"(t, e) {
      "use strict";
      var n = Yh();
      e.exports = r;
      function r() {}
      (r.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new n(this.href);
          },
        },
        protocol: {
          get: function () {
            var i = this._url;
            return i && i.scheme ? i.scheme + ":" : ":";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(/:+$/, "")),
              (i = i.replace(/[^-+\.a-zA-Z0-9]/g, n.percentEncode)),
              i.length > 0 && ((o.scheme = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        host: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased()
              ? i.host + (i.port ? ":" + i.port : "")
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode
              )),
              i.length > 0 &&
                ((o.host = i), delete o.port, (s = o.toString()))),
              (this.href = s);
          },
        },
        hostname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() ? i.host : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(/^\/+/, "")),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode
              )),
              i.length > 0 && ((o.host = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        port: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() && i.port !== void 0
              ? i.port
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = "" + i),
              (i = i.replace(/[^0-9].*$/, "")),
              (i = i.replace(/^0+/, "")),
              i.length === 0 && (i = "0"),
              parseInt(i, 10) <= 65535 && ((o.port = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        pathname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() ? i.path : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) !== "/" && (i = "/" + i),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.path = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        search: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() && i.query !== void 0
              ? "?" + i.query
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) === "?" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.query = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        hash: {
          get: function () {
            var i = this._url;
            return i == null || i.fragment == null || i.fragment === ""
              ? ""
              : "#" + i.fragment;
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            i.charAt(0) === "#" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.fragment = i),
              (s = o.toString()),
              (this.href = s);
          },
        },
        username: {
          get: function () {
            var i = this._url;
            return i.username || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                n.percentEncode
              )),
              (o.username = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        password: {
          get: function () {
            var i = this._url;
            return i.password || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              (i === ""
                ? (o.password = null)
                : ((i = i.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    n.percentEncode
                  )),
                  (o.password = i)),
              (s = o.toString())),
              (this.href = s);
          },
        },
        origin: {
          get: function () {
            var i = this._url;
            if (i == null) return "";
            var s = function (o) {
              var a = [i.scheme, i.host, +i.port || o];
              return a[0] + "://" + a[1] + (a[2] === o ? "" : ":" + a[2]);
            };
            switch (i.scheme) {
              case "ftp":
                return s(21);
              case "gopher":
                return s(70);
              case "http":
              case "ws":
                return s(80);
              case "https":
              case "wss":
                return s(443);
              default:
                return i.scheme + "://";
            }
          },
        },
      })),
        (r._inherit = function (i) {
          Object.getOwnPropertyNames(r.prototype).forEach(function (s) {
            if (!(s === "constructor" || s === "href")) {
              var o = Object.getOwnPropertyDescriptor(r.prototype, s);
              Object.defineProperty(i, s, o);
            }
          });
        });
    },
  }),
  Qb = ae({
    "external/npm/node_modules/domino/lib/defineElement.js"(t, e) {
      "use strict";
      var n = Pb(),
        r = zh().isApiWritable;
      e.exports = function (a, c, l, u) {
        var d = a.ctor;
        if (d) {
          var g = a.props || {};
          if (a.attributes)
            for (var b in a.attributes) {
              var I = a.attributes[b];
              (typeof I != "object" || Array.isArray(I)) && (I = { type: I }),
                I.name || (I.name = b.toLowerCase()),
                (g[b] = n.property(I));
            }
          (g.constructor = { value: d, writable: r }),
            (d.prototype = Object.create((a.superclass || c).prototype, g)),
            a.events && o(d, a.events),
            (l[a.name] = d);
        } else d = c;
        return (
          (a.tags || (a.tag && [a.tag]) || []).forEach(function (M) {
            u[M] = d;
          }),
          d
        );
      };
      function i(a, c, l, u) {
        (this.body = a),
          (this.document = c),
          (this.form = l),
          (this.element = u);
      }
      i.prototype.build = function () {
        return () => {};
      };
      function s(a, c, l, u) {
        var d = a.ownerDocument || Object.create(null),
          g = a.form || Object.create(null);
        a[c] = new i(u, d, g, a).build();
      }
      function o(a, c) {
        var l = a.prototype;
        c.forEach(function (u) {
          Object.defineProperty(l, "on" + u, {
            get: function () {
              return this._getEventHandler(u);
            },
            set: function (d) {
              this._setEventHandler(u, d);
            },
          }),
            n.registerChangeHandler(a, "on" + u, s);
        });
      }
    },
  }),
  Xh = ae({
    "external/npm/node_modules/domino/lib/htmlelts.js"(t) {
      "use strict";
      var e = mt(),
        n = Co(),
        r = Zh(),
        i = Je(),
        s = Wb(),
        o = Qb(),
        a = (t.elements = {}),
        c = Object.create(null);
      t.createElement = function (_, w, T) {
        var E = c[w] || F;
        return new E(_, w, T);
      };
      function l(_) {
        return o(_, M, a, c);
      }
      function u(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            if (w === null) return "";
            var T = this.doc._resolve(w);
            return T === null ? w : T;
          },
          set: function (w) {
            this._setattr(_, w);
          },
        };
      }
      function d(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            return w === null
              ? null
              : w.toLowerCase() === "use-credentials"
              ? "use-credentials"
              : "anonymous";
          },
          set: function (w) {
            w == null ? this.removeAttribute(_) : this._setattr(_, w);
          },
        };
      }
      var g = {
          type: [
            "",
            "no-referrer",
            "no-referrer-when-downgrade",
            "same-origin",
            "origin",
            "strict-origin",
            "origin-when-cross-origin",
            "strict-origin-when-cross-origin",
            "unsafe-url",
          ],
          missing: "",
        },
        b = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        I = function (_, w, T) {
          M.call(this, _, w, T), (this._form = null);
        },
        M = (t.HTMLElement = l({
          superclass: n,
          name: "HTMLElement",
          ctor: function (w, T, E) {
            n.call(this, w, T, i.NAMESPACE.HTML, E);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (_) {
                this._innerHTML = _;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (_) {
                var w = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this
                );
                w.parse(_ === null ? "" : String(_), !0);
                for (
                  var T = this instanceof c.template ? this.content : this;
                  T.hasChildNodes();

                )
                  T.removeChild(T.firstChild);
                T.appendChild(w._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new r(this)), this._style;
              },
              set: function (_) {
                _ == null && (_ = ""), this._setattr("style", String(_));
              },
            },
            blur: { value: function () {} },
            focus: { value: function () {} },
            forceSpellCheck: { value: function () {} },
            click: {
              value: function () {
                if (!this._click_in_progress) {
                  this._click_in_progress = !0;
                  try {
                    this._pre_click_activation_steps &&
                      this._pre_click_activation_steps();
                    var _ = this.ownerDocument.createEvent("MouseEvent");
                    _.initMouseEvent(
                      "click",
                      !0,
                      !0,
                      this.ownerDocument.defaultView,
                      1,
                      0,
                      0,
                      0,
                      0,
                      !1,
                      !1,
                      !1,
                      !1,
                      0,
                      null
                    );
                    var w = this.dispatchEvent(_);
                    w
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(_)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: i.nyi },
          },
          attributes: {
            title: String,
            lang: String,
            dir: { type: ["ltr", "rtl", "auto"], missing: "" },
            draggable: { type: ["true", "false"], treatNullAsEmptyString: !0 },
            spellcheck: { type: ["true", "false"], missing: "" },
            enterKeyHint: {
              type: [
                "enter",
                "done",
                "go",
                "next",
                "previous",
                "search",
                "send",
              ],
              missing: "",
            },
            autoCapitalize: {
              type: ["off", "on", "none", "sentences", "words", "characters"],
              missing: "",
            },
            autoFocus: Boolean,
            accessKey: String,
            nonce: String,
            hidden: Boolean,
            translate: { type: ["no", "yes"], missing: "" },
            tabIndex: {
              type: "long",
              default: function () {
                return this.tagName in b || this.contentEditable ? 0 : -1;
              },
            },
          },
          events: [
            "abort",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "contextmenu",
            "cuechange",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "mousedown",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "mousewheel",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "readystatechange",
            "reset",
            "seeked",
            "seeking",
            "select",
            "show",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting",
            "blur",
            "error",
            "focus",
            "load",
            "scroll",
          ],
        })),
        F = l({
          name: "HTMLUnknownElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        R = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      l({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (w, T, E) {
          M.call(this, w, T, E);
        },
        props: {
          _post_click_activation_steps: {
            value: function (_) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: u,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: g,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        s._inherit(c.a.prototype),
        l({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: u,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: g,
            noHref: Boolean,
          },
        }),
        s._inherit(c.area.prototype),
        l({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { clear: String },
        }),
        l({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { target: String },
        }),
        l({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          events: [
            "afterprint",
            "beforeprint",
            "beforeunload",
            "blur",
            "error",
            "focus",
            "hashchange",
            "load",
            "message",
            "offline",
            "online",
            "pagehide",
            "pageshow",
            "popstate",
            "resize",
            "scroll",
            "storage",
            "unload",
          ],
          attributes: {
            text: { type: String, treatNullAsEmptyString: !0 },
            link: { type: String, treatNullAsEmptyString: !0 },
            vLink: { type: String, treatNullAsEmptyString: !0 },
            aLink: { type: String, treatNullAsEmptyString: !0 },
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            background: String,
          },
        }),
        l({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: {
            name: String,
            value: String,
            disabled: Boolean,
            autofocus: Boolean,
            type: {
              type: ["submit", "reset", "button", "menu"],
              missing: "submit",
            },
            formTarget: String,
            formAction: u,
            formNoValidate: Boolean,
            formMethod: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "",
            },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
          },
        }),
        l({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { value: String },
        }),
        l({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        l({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { open: Boolean },
        }),
        l({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            src: u,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        l({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: { disabled: Boolean, name: String },
        }),
        l({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            action: String,
            autocomplete: { type: ["on", "off"], missing: "on" },
            name: String,
            acceptCharset: { name: "accept-charset" },
            target: String,
            noValidate: Boolean,
            method: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "get",
            },
            enctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
            encoding: {
              name: "enctype",
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
          },
        }),
        l({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        l({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        l({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { xmlns: u, version: String },
        }),
        l({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            src: u,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: g,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: u,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            alt: String,
            src: u,
            srcset: String,
            crossOrigin: d,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: g,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: u,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: u,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: R.form,
            _post_click_activation_steps: {
              value: function (_) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var w = this.form.getElementsByName(this.name),
                      T = w.length - 1;
                    T >= 0;
                    T--
                  ) {
                    var E = w[T];
                    E.checked = E === this;
                  }
              },
            },
          },
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            accept: String,
            alt: String,
            max: String,
            min: String,
            pattern: String,
            placeholder: String,
            step: String,
            dirName: String,
            defaultValue: { name: "value" },
            multiple: Boolean,
            required: Boolean,
            readOnly: Boolean,
            checked: Boolean,
            value: String,
            src: u,
            defaultChecked: { name: "checked", type: Boolean },
            size: { type: "unsigned long", default: 20, min: 1, setmin: 1 },
            width: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            height: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            autocomplete: String,
            type: {
              type: [
                "text",
                "hidden",
                "search",
                "tel",
                "url",
                "email",
                "password",
                "datetime",
                "date",
                "month",
                "week",
                "time",
                "datetime-local",
                "number",
                "range",
                "color",
                "checkbox",
                "radio",
                "file",
                "submit",
                "image",
                "reset",
                "button",
              ],
              missing: "text",
            },
            formTarget: String,
            formNoValidate: Boolean,
            formMethod: { type: ["get", "post"], invalid: "get", missing: "" },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
            align: String,
            useMap: String,
          },
        }),
        l({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        l({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        l({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        l({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            href: u,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: d,
            nonce: String,
            integrity: String,
            referrerPolicy: g,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        l({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { name: String },
        }),
        l({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        l({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        l({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
        }),
        l({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { cite: u, dateTime: String },
        }),
        l({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            _numitems: {
              get: function () {
                var _ = 0;
                return (
                  this.childNodes.forEach(function (w) {
                    w.nodeType === e.ELEMENT_NODE && w.tagName === "LI" && _++;
                  }),
                  _
                );
              },
            },
          },
          attributes: {
            type: String,
            reversed: Boolean,
            start: {
              type: "long",
              default: function () {
                return this.reversed ? this._numitems : 1;
              },
            },
            compact: Boolean,
          },
        }),
        l({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: {
            data: u,
            type: String,
            name: String,
            useMap: String,
            typeMustMatch: Boolean,
            width: String,
            height: String,
            align: String,
            archive: String,
            code: String,
            declare: Boolean,
            hspace: { type: "unsigned long", default: 0 },
            standby: String,
            vspace: { type: "unsigned long", default: 0 },
            codeBase: u,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        l({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            form: {
              get: function () {
                for (
                  var _ = this.parentNode;
                  _ && _.nodeType === e.ELEMENT_NODE;

                ) {
                  if (_.localName === "select") return _.form;
                  _ = _.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (_) {
                this._setattr("value", _);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (_) {
                this.textContent = _;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        l({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: { name: String },
        }),
        l({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        l({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        l({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: R,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        l({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { cite: u },
        }),
        l({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            text: {
              get: function () {
                for (
                  var _ = "", w = 0, T = this.childNodes.length;
                  w < T;
                  w++
                ) {
                  var E = this.childNodes[w];
                  E.nodeType === e.TEXT_NODE && (_ += E._data);
                }
                return _;
              },
              set: function (_) {
                this.removeChildren(),
                  _ !== null &&
                    _ !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(_));
              },
            },
          },
          attributes: {
            src: u,
            type: String,
            charset: String,
            referrerPolicy: g,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: d,
            nonce: String,
            integrity: String,
          },
        }),
        l({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: R.form,
            options: {
              get: function () {
                return this.getElementsByTagName("option");
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            multiple: Boolean,
            required: Boolean,
            size: { type: "unsigned long", default: 0 },
          },
        }),
        l({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        l({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        l({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          name: "HTMLTableCellElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            colSpan: { type: "unsigned long", default: 1 },
            rowSpan: { type: "unsigned long", default: 1 },
            scope: {
              type: ["row", "col", "rowgroup", "colgroup"],
              missing: "",
            },
            abbr: String,
            align: String,
            axis: String,
            height: String,
            width: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            noWrap: Boolean,
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            span: {
              type: "limited unsigned long with fallback",
              default: 1,
              min: 1,
            },
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            width: String,
          },
        }),
        l({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            border: String,
            frame: String,
            rules: String,
            summary: String,
            width: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            cellPadding: { type: String, treatNullAsEmptyString: !0 },
            cellSpacing: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E),
              (this._contentFragment = w._templateDoc.createDocumentFragment());
          },
          props: {
            content: {
              get: function () {
                return this._contentFragment;
              },
            },
            serialize: {
              value: function () {
                return this.content.serialize();
              },
            },
          },
        }),
        l({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            cells: {
              get: function () {
                return this.querySelectorAll("td,th");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
          },
        }),
        l({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: R.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (_) {
                this.textContent = _;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (_) {
                this.defaultValue = _;
              },
            },
            textLength: {
              get: function () {
                return this.value.length;
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            placeholder: String,
            wrap: String,
            dirName: String,
            required: Boolean,
            readOnly: Boolean,
            rows: { type: "limited unsigned long with fallback", default: 2 },
            cols: { type: "limited unsigned long with fallback", default: 20 },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
          },
        }),
        l({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        l({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        l({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { type: String, compact: Boolean },
        }),
        l({
          name: "HTMLMediaElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            src: u,
            crossOrigin: d,
            preload: {
              type: ["metadata", "none", "auto", { value: "", alias: "auto" }],
              missing: "auto",
            },
            loop: Boolean,
            autoplay: Boolean,
            mediaGroup: String,
            controls: Boolean,
            defaultMuted: { name: "muted", type: Boolean },
          },
        }),
        l({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, E) {
            a.HTMLMediaElement.call(this, w, T, E);
          },
        }),
        l({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, E) {
            a.HTMLMediaElement.call(this, w, T, E);
          },
          attributes: {
            poster: u,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        l({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, E) {
            a.HTMLTableCellElement.call(this, w, T, E);
          },
        }),
        l({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, E) {
            a.HTMLTableCellElement.call(this, w, T, E);
          },
        }),
        l({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        l({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
        }),
        l({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            getContext: { value: i.nyi },
            probablySupportsContext: { value: i.nyi },
            setContext: { value: i.nyi },
            transferControlToProxy: { value: i.nyi },
            toDataURL: { value: i.nyi },
            toBlob: { value: i.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        l({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            show: { value: i.nyi },
            showModal: { value: i.nyi },
            close: { value: i.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        l({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          props: {
            _label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null && _ !== ""
                  ? _
                  : ((_ = this.textContent),
                    _.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null ? _ : this._label;
              },
              set: function (_) {
                this._setattr("label", _);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: u,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        l({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: u,
            type: String,
            width: String,
            height: String,
          },
        }),
        l({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            src: u,
            srclang: String,
            label: String,
            default: Boolean,
            kind: {
              type: [
                "subtitles",
                "captions",
                "descriptions",
                "chapters",
                "metadata",
              ],
              missing: "subtitles",
              invalid: "metadata",
            },
          },
          props: {
            NONE: {
              get: function () {
                return 0;
              },
            },
            LOADING: {
              get: function () {
                return 1;
              },
            },
            LOADED: {
              get: function () {
                return 2;
              },
            },
            ERROR: {
              get: function () {
                return 3;
              },
            },
            readyState: { get: i.nyi },
            track: { get: i.nyi },
          },
        }),
        l({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        l({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (w, T, E) {
            M.call(this, w, T, E);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tags: [
            "abbr",
            "address",
            "article",
            "aside",
            "b",
            "bdi",
            "bdo",
            "cite",
            "content",
            "code",
            "dd",
            "dfn",
            "dt",
            "em",
            "figcaption",
            "figure",
            "footer",
            "header",
            "hgroup",
            "i",
            "kbd",
            "main",
            "mark",
            "nav",
            "noscript",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "section",
            "small",
            "strong",
            "sub",
            "summary",
            "sup",
            "u",
            "var",
            "wbr",
            "acronym",
            "basefont",
            "big",
            "center",
            "nobr",
            "noembed",
            "noframes",
            "plaintext",
            "strike",
            "tt",
          ],
        });
    },
  }),
  Kb = ae({
    "external/npm/node_modules/domino/lib/svg.js"(t) {
      "use strict";
      var e = Co(),
        n = Qb(),
        r = Je(),
        i = Zh(),
        s = (t.elements = {}),
        o = Object.create(null);
      t.createElement = function (l, u, d) {
        var g = o[u] || c;
        return new g(l, u, d);
      };
      function a(l) {
        return n(l, c, s, o);
      }
      var c = a({
        superclass: e,
        name: "SVGElement",
        ctor: function (u, d, g) {
          e.call(this, u, d, r.NAMESPACE.SVG, g);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new i(this)), this._style;
            },
          },
        },
      });
      a({
        name: "SVGSVGElement",
        ctor: function (u, d, g) {
          c.call(this, u, d, g);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return t.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        a({
          tags: [
            "a",
            "altGlyph",
            "altGlyphDef",
            "altGlyphItem",
            "animate",
            "animateColor",
            "animateMotion",
            "animateTransform",
            "circle",
            "clipPath",
            "color-profile",
            "cursor",
            "defs",
            "desc",
            "ellipse",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDiffuseLighting",
            "feDisplacementMap",
            "feDistantLight",
            "feFlood",
            "feFuncA",
            "feFuncB",
            "feFuncG",
            "feFuncR",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMergeNode",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence",
            "filter",
            "font",
            "font-face",
            "font-face-format",
            "font-face-name",
            "font-face-src",
            "font-face-uri",
            "foreignObject",
            "g",
            "glyph",
            "glyphRef",
            "hkern",
            "image",
            "line",
            "linearGradient",
            "marker",
            "mask",
            "metadata",
            "missing-glyph",
            "mpath",
            "path",
            "pattern",
            "polygon",
            "polyline",
            "radialGradient",
            "rect",
            "script",
            "set",
            "stop",
            "style",
            "switch",
            "symbol",
            "text",
            "textPath",
            "title",
            "tref",
            "tspan",
            "use",
            "view",
            "vkern",
          ],
        });
    },
  }),
  fA = ae({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(t, e) {
      "use strict";
      e.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  Jh = ae({
    "external/npm/node_modules/domino/lib/Document.js"(t, e) {
      "use strict";
      e.exports = z;
      var n = mt(),
        r = Xi(),
        i = Gh(),
        s = Co(),
        o = Ub(),
        a = Vb(),
        c = So(),
        l = qb(),
        u = $b(),
        d = kl(),
        g = cA(),
        b = lA(),
        I = Ol(),
        M = Yh(),
        F = Qh(),
        R = Gb(),
        _ = Wh(),
        w = Xh(),
        T = Kb(),
        E = Je(),
        te = fA(),
        re = E.NAMESPACE,
        pe = zh().isApiWritable;
      function z(S, k) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_NODE),
          (this.isHTML = S),
          (this._address = k || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new d(this)),
          (this.ownerDocument = null),
          (this._contentType = S ? "text/html" : "application/xml"),
          (this.doctype = null),
          (this.documentElement = null),
          (this._templateDocCache = null),
          (this._nodeIterators = null),
          (this._nid = 1),
          (this._nextnid = 2),
          (this._nodes = [null, this]),
          (this.byId = Object.create(null)),
          (this.modclock = 0);
      }
      var O = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        j = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        Y = function (S, k, $) {
          return {
            get: function () {
              var _e = S.call(this);
              return _e ? _e[k] : $;
            },
            set: function (_e) {
              var gt = S.call(this);
              gt && (gt[k] = _e);
            },
          };
        };
      function v(S, k) {
        var $, _e, gt;
        return (
          S === "" && (S = null),
          _.isValidQName(k) || E.InvalidCharacterError(),
          ($ = null),
          (_e = k),
          (gt = k.indexOf(":")),
          gt >= 0 && (($ = k.substring(0, gt)), (_e = k.substring(gt + 1))),
          $ !== null && S === null && E.NamespaceError(),
          $ === "xml" && S !== re.XML && E.NamespaceError(),
          ($ === "xmlns" || k === "xmlns") &&
            S !== re.XMLNS &&
            E.NamespaceError(),
          S === re.XMLNS &&
            !($ === "xmlns" || k === "xmlns") &&
            E.NamespaceError(),
          { namespace: S, prefix: $, localName: _e }
        );
      }
      z.prototype = Object.create(i.prototype, {
        _setMutationHandler: {
          value: function (S) {
            this.mutationHandler = S;
          },
        },
        _dispatchRendererEvent: {
          value: function (S, k, $) {
            var _e = this._nodes[S];
            _e && _e._dispatchEvent(new c(k, $), !0);
          },
        },
        nodeName: { value: "#document" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        documentURI: {
          get: function () {
            return this._address;
          },
          set: E.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (S) {
            return new o(this, String(S));
          },
        },
        createComment: {
          value: function (S) {
            return new a(this, S);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new l(this);
          },
        },
        createProcessingInstruction: {
          value: function (S, k) {
            return (
              (!_.isValidName(S) || k.indexOf("?>") !== -1) &&
                E.InvalidCharacterError(),
              new u(this, S, k)
            );
          },
        },
        createAttribute: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || E.InvalidCharacterError(),
              this.isHTML && (S = E.toASCIILowerCase(S)),
              new s._Attr(null, S, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var $ = v(S, k);
            return new s._Attr(null, $.localName, $.prefix, $.namespace, "");
          },
        },
        createElement: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || E.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(S) && (S = E.toASCIILowerCase(S)),
                  w.createElement(this, S, null))
                : this.contentType === "application/xhtml+xml"
                ? w.createElement(this, S, null)
                : new s(this, S, null, null)
            );
          },
          writable: pe,
        },
        createElementNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var $ = v(S, k);
            return this._createElementNS($.localName, $.namespace, $.prefix);
          },
          writable: pe,
        },
        _createElementNS: {
          value: function (S, k, $) {
            return k === re.HTML
              ? w.createElement(this, S, $)
              : k === re.SVG
              ? T.createElement(this, S, $)
              : new s(this, S, k, $);
          },
        },
        createEvent: {
          value: function (k) {
            k = k.toLowerCase();
            var $ = j[k] || k,
              _e = R[O[$]];
            if (_e) {
              var gt = new _e();
              return (gt._initialized = !1), gt;
            } else E.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (S, k, $) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? I.SHOW_ALL : +k),
              ($ = $ === void 0 ? null : $),
              new g(S, k, $)
            );
          },
        },
        createNodeIterator: {
          value: function (S, k, $) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? I.SHOW_ALL : +k),
              ($ = $ === void 0 ? null : $),
              new b(S, k, $)
            );
          },
        },
        _attachNodeIterator: {
          value: function (S) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(S);
          },
        },
        _detachNodeIterator: {
          value: function (S) {
            var k = this._nodeIterators.indexOf(S);
            this._nodeIterators.splice(k, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (S) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (k) {
                k._preremove(S);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var k = this.firstChild; k !== null; k = k.nextSibling)
              k.nodeType === n.DOCUMENT_TYPE_NODE
                ? (this.doctype = k)
                : k.nodeType === n.ELEMENT_NODE && (this.documentElement = k);
          },
        },
        insertBefore: {
          value: function (k, $) {
            return (
              n.prototype.insertBefore.call(this, k, $),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        replaceChild: {
          value: function (k, $) {
            return (
              n.prototype.replaceChild.call(this, k, $),
              this._updateDocTypeElement(),
              $
            );
          },
        },
        removeChild: {
          value: function (k) {
            return (
              n.prototype.removeChild.call(this, k),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        getElementById: {
          value: function (S) {
            var k = this.byId[S];
            return k ? (k instanceof he ? k.getFirst() : k) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (S) {
            return this.byId[S] instanceof he;
          },
        },
        getElementsByName: { value: s.prototype.getElementsByName },
        getElementsByTagName: { value: s.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: s.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: s.prototype.getElementsByClassName },
        adoptNode: {
          value: function (k) {
            return (
              k.nodeType === n.DOCUMENT_NODE && E.NotSupportedError(),
              k.nodeType === n.ATTRIBUTE_NODE ||
                (k.parentNode && k.parentNode.removeChild(k),
                k.ownerDocument !== this && K(k, this)),
              k
            );
          },
        },
        importNode: {
          value: function (k, $) {
            return this.adoptNode(k.cloneNode($));
          },
          writable: pe,
        },
        origin: {
          get: function () {
            return null;
          },
        },
        characterSet: {
          get: function () {
            return "UTF-8";
          },
        },
        contentType: {
          get: function () {
            return this._contentType;
          },
        },
        URL: {
          get: function () {
            return this._address;
          },
        },
        domain: { get: E.nyi, set: E.nyi },
        referrer: { get: E.nyi },
        cookie: { get: E.nyi, set: E.nyi },
        lastModified: { get: E.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: E.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var S = this._titleElement,
              k = S ? S.textContent : "";
            return k.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (S) {
            var k = this._titleElement,
              $ = this.head;
            (!k && !$) ||
              (k || ((k = this.createElement("title")), $.appendChild(k)),
              (k.textContent = S));
          },
        },
        dir: Y(
          function () {
            var S = this.documentElement;
            if (S && S.tagName === "HTML") return S;
          },
          "dir",
          ""
        ),
        fgColor: Y(
          function () {
            return this.body;
          },
          "text",
          ""
        ),
        linkColor: Y(
          function () {
            return this.body;
          },
          "link",
          ""
        ),
        vlinkColor: Y(
          function () {
            return this.body;
          },
          "vLink",
          ""
        ),
        alinkColor: Y(
          function () {
            return this.body;
          },
          "aLink",
          ""
        ),
        bgColor: Y(
          function () {
            return this.body;
          },
          "bgColor",
          ""
        ),
        charset: {
          get: function () {
            return this.characterSet;
          },
        },
        inputEncoding: {
          get: function () {
            return this.characterSet;
          },
        },
        scrollingElement: {
          get: function () {
            return this._quirks ? this.body : this.documentElement;
          },
        },
        body: {
          get: function () {
            return p(this.documentElement, "body");
          },
          set: E.nyi,
        },
        head: {
          get: function () {
            return p(this.documentElement, "head");
          },
        },
        images: { get: E.nyi },
        embeds: { get: E.nyi },
        plugins: { get: E.nyi },
        links: { get: E.nyi },
        forms: { get: E.nyi },
        scripts: { get: E.nyi },
        applets: {
          get: function () {
            return [];
          },
        },
        activeElement: {
          get: function () {
            return null;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: E.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: E.nyi,
        },
        write: {
          value: function (S) {
            if ((this.isHTML || E.InvalidStateError(), !!this._parser)) {
              this._parser;
              var k = arguments.join("");
              this._parser.parse(k);
            }
          },
        },
        writeln: {
          value: function (k) {
            this.write(
              Array.prototype.join.call(arguments, "") +
                `
`
            );
          },
        },
        open: {
          value: function () {
            this.documentElement = null;
          },
        },
        close: {
          value: function () {
            (this.readyState = "interactive"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this._dispatchEvent(new c("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new c("load"), !0);
          },
        },
        clone: {
          value: function () {
            var k = new z(this.isHTML, this._address);
            return (
              (k._quirks = this._quirks),
              (k._contentType = this._contentType),
              k
            );
          },
        },
        cloneNode: {
          value: function (k) {
            var $ = n.prototype.cloneNode.call(this, !1);
            if (k)
              for (var _e = this.firstChild; _e !== null; _e = _e.nextSibling)
                $._appendChild($.importNode(_e, !0));
            return $._updateDocTypeElement(), $;
          },
        },
        isEqual: {
          value: function (k) {
            return !0;
          },
        },
        mutateValue: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: te.VALUE, target: S, data: S.data });
          },
        },
        mutateAttr: {
          value: function (S, k) {
            this.mutationHandler &&
              this.mutationHandler({
                type: te.ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: te.REMOVE_ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: te.REMOVE,
                target: S.parentNode,
                node: S,
              }),
              V(S);
          },
        },
        mutateInsert: {
          value: function (S) {
            x(S),
              this.mutationHandler &&
                this.mutationHandler({
                  type: te.INSERT,
                  target: S.parentNode,
                  node: S,
                });
          },
        },
        mutateMove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: te.MOVE, target: S });
          },
        },
        addId: {
          value: function (k, $) {
            var _e = this.byId[k];
            _e
              ? (_e instanceof he || ((_e = new he(_e)), (this.byId[k] = _e)),
                _e.add($))
              : (this.byId[k] = $);
          },
        },
        delId: {
          value: function (k, $) {
            var _e = this.byId[k];
            E.assert(_e),
              _e instanceof he
                ? (_e.del($),
                  _e.length === 1 && (this.byId[k] = _e.downgrade()))
                : (this.byId[k] = void 0);
          },
        },
        _resolve: {
          value: function (S) {
            return new M(this._documentBaseURL).resolve(S);
          },
        },
        _documentBaseURL: {
          get: function () {
            var S = this._address;
            S === "about:blank" && (S = "/");
            var k = this.querySelector("base[href]");
            return k ? new M(S).resolve(k.getAttribute("href")) : S;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var S = new z(this.isHTML, this._address);
              this._templateDocCache = S._templateDocCache = S;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (S) {
            return F(S, this)[0];
          },
        },
        querySelectorAll: {
          value: function (S) {
            var k = F(S, this);
            return k.item ? k : new r(k);
          },
        },
      });
      var m = [
        "abort",
        "canplay",
        "canplaythrough",
        "change",
        "click",
        "contextmenu",
        "cuechange",
        "dblclick",
        "drag",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "dragstart",
        "drop",
        "durationchange",
        "emptied",
        "ended",
        "input",
        "invalid",
        "keydown",
        "keypress",
        "keyup",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mousedown",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup",
        "mousewheel",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "readystatechange",
        "reset",
        "seeked",
        "seeking",
        "select",
        "show",
        "stalled",
        "submit",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
        "blur",
        "error",
        "focus",
        "load",
        "scroll",
      ];
      m.forEach(function (S) {
        Object.defineProperty(z.prototype, "on" + S, {
          get: function () {
            return this._getEventHandler(S);
          },
          set: function (k) {
            this._setEventHandler(S, k);
          },
        });
      });
      function p(S, k) {
        if (S && S.isHTML) {
          for (var $ = S.firstChild; $ !== null; $ = $.nextSibling)
            if (
              $.nodeType === n.ELEMENT_NODE &&
              $.localName === k &&
              $.namespaceURI === re.HTML
            )
              return $;
        }
        return null;
      }
      function y(S) {
        if (
          ((S._nid = S.ownerDocument._nextnid++),
          (S.ownerDocument._nodes[S._nid] = S),
          S.nodeType === n.ELEMENT_NODE)
        ) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.addId(k, S), S._roothook && S._roothook();
        }
      }
      function C(S) {
        if (S.nodeType === n.ELEMENT_NODE) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.delId(k, S);
        }
        (S.ownerDocument._nodes[S._nid] = void 0), (S._nid = void 0);
      }
      function x(S) {
        if ((y(S), S.nodeType === n.ELEMENT_NODE))
          for (var k = S.firstChild; k !== null; k = k.nextSibling) x(k);
      }
      function V(S) {
        C(S);
        for (var k = S.firstChild; k !== null; k = k.nextSibling) V(k);
      }
      function K(S, k) {
        (S.ownerDocument = k),
          (S._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(S, "_tagName") &&
            (S._tagName = void 0);
        for (var $ = S.firstChild; $ !== null; $ = $.nextSibling) K($, k);
      }
      function he(S) {
        (this.nodes = Object.create(null)),
          (this.nodes[S._nid] = S),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (he.prototype.add = function (S) {
        this.nodes[S._nid] ||
          ((this.nodes[S._nid] = S), this.length++, (this.firstNode = void 0));
      }),
        (he.prototype.del = function (S) {
          this.nodes[S._nid] &&
            (delete this.nodes[S._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (he.prototype.getFirst = function () {
          if (!this.firstNode) {
            var S;
            for (S in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[S]) &
                  n.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[S]);
          }
          return this.firstNode;
        }),
        (he.prototype.downgrade = function () {
          if (this.length === 1) {
            var S;
            for (S in this.nodes) return this.nodes[S];
          }
          return this;
        });
    },
  }),
  ep = ae({
    "external/npm/node_modules/domino/lib/DocumentType.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = mt(),
        r = Hb(),
        i = Kh();
      function s(o, a, c, l) {
        r.call(this),
          (this.nodeType = n.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = o || null),
          (this.name = a),
          (this.publicId = c || ""),
          (this.systemId = l || "");
      }
      (s.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        clone: {
          value: function () {
            return new s(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId
            );
          },
        },
        isEqual: {
          value: function (a) {
            return (
              this.name === a.name &&
              this.publicId === a.publicId &&
              this.systemId === a.systemId
            );
          },
        },
      })),
        Object.defineProperties(s.prototype, i);
    },
  }),
  tp = ae({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(t, e) {
      "use strict";
      e.exports = Me;
      var n = Jh(),
        r = ep(),
        i = mt(),
        s = Je().NAMESPACE,
        o = Xh(),
        a = o.elements,
        c = Function.prototype.apply.bind(Array.prototype.push),
        l = -1,
        u = 1,
        d = 2,
        g = 3,
        b = 4,
        I = 5,
        M = [],
        F =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        R = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        _ =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        w =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        T = Object.create(null);
      (T[s.HTML] = {
        __proto__: null,
        address: !0,
        applet: !0,
        area: !0,
        article: !0,
        aside: !0,
        base: !0,
        basefont: !0,
        bgsound: !0,
        blockquote: !0,
        body: !0,
        br: !0,
        button: !0,
        caption: !0,
        center: !0,
        col: !0,
        colgroup: !0,
        dd: !0,
        details: !0,
        dir: !0,
        div: !0,
        dl: !0,
        dt: !0,
        embed: !0,
        fieldset: !0,
        figcaption: !0,
        figure: !0,
        footer: !0,
        form: !0,
        frame: !0,
        frameset: !0,
        h1: !0,
        h2: !0,
        h3: !0,
        h4: !0,
        h5: !0,
        h6: !0,
        head: !0,
        header: !0,
        hgroup: !0,
        hr: !0,
        html: !0,
        iframe: !0,
        img: !0,
        input: !0,
        li: !0,
        link: !0,
        listing: !0,
        main: !0,
        marquee: !0,
        menu: !0,
        meta: !0,
        nav: !0,
        noembed: !0,
        noframes: !0,
        noscript: !0,
        object: !0,
        ol: !0,
        p: !0,
        param: !0,
        plaintext: !0,
        pre: !0,
        script: !0,
        section: !0,
        select: !0,
        source: !0,
        style: !0,
        summary: !0,
        table: !0,
        tbody: !0,
        td: !0,
        template: !0,
        textarea: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        title: !0,
        tr: !0,
        track: !0,
        ul: !0,
        wbr: !0,
        xmp: !0,
      }),
        (T[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (T[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var E = Object.create(null);
      E[s.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var te = Object.create(null);
      te[s.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var re = Object.create(null);
      re[s.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var pe = Object.create(null);
      pe[s.HTML] = {
        __proto__: null,
        dd: !0,
        dt: !0,
        li: !0,
        menuitem: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
      };
      var z = Object.create(null);
      z[s.HTML] = {
        __proto__: null,
        caption: !0,
        colgroup: !0,
        dd: !0,
        dt: !0,
        li: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
        tbody: !0,
        td: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        tr: !0,
      };
      var O = Object.create(null);
      O[s.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var j = Object.create(null);
      j[s.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var Y = Object.create(null);
      Y[s.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var v = Object.create(null);
      v[s.HTML] = {
        __proto__: null,
        button: !0,
        fieldset: !0,
        input: !0,
        keygen: !0,
        object: !0,
        output: !0,
        select: !0,
        textarea: !0,
        img: !0,
      };
      var m = Object.create(null);
      (m[s.HTML] = {
        __proto__: null,
        applet: !0,
        caption: !0,
        html: !0,
        table: !0,
        td: !0,
        th: !0,
        marquee: !0,
        object: !0,
        template: !0,
      }),
        (m[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (m[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var p = Object.create(m);
      (p[s.HTML] = Object.create(m[s.HTML])),
        (p[s.HTML].ol = !0),
        (p[s.HTML].ul = !0);
      var y = Object.create(m);
      (y[s.HTML] = Object.create(m[s.HTML])), (y[s.HTML].button = !0);
      var C = Object.create(null);
      C[s.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var x = Object.create(null);
      x[s.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var V = Object.create(null);
      V[s.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var K = Object.create(null);
      K[s.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var he = {
          __proto__: null,
          "xlink:actuate": s.XLINK,
          "xlink:arcrole": s.XLINK,
          "xlink:href": s.XLINK,
          "xlink:role": s.XLINK,
          "xlink:show": s.XLINK,
          "xlink:title": s.XLINK,
          "xlink:type": s.XLINK,
          "xml:base": s.XML,
          "xml:lang": s.XML,
          "xml:space": s.XML,
          xmlns: s.XMLNS,
          "xmlns:xlink": s.XMLNS,
        },
        S = {
          __proto__: null,
          attributename: "attributeName",
          attributetype: "attributeType",
          basefrequency: "baseFrequency",
          baseprofile: "baseProfile",
          calcmode: "calcMode",
          clippathunits: "clipPathUnits",
          diffuseconstant: "diffuseConstant",
          edgemode: "edgeMode",
          filterunits: "filterUnits",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          limitingconeangle: "limitingConeAngle",
          markerheight: "markerHeight",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          numoctaves: "numOctaves",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          refx: "refX",
          refy: "refY",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stitchtiles: "stitchTiles",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textlength: "textLength",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          xchannelselector: "xChannelSelector",
          ychannelselector: "yChannelSelector",
          zoomandpan: "zoomAndPan",
        },
        k = {
          __proto__: null,
          altglyph: "altGlyph",
          altglyphdef: "altGlyphDef",
          altglyphitem: "altGlyphItem",
          animatecolor: "animateColor",
          animatemotion: "animateMotion",
          animatetransform: "animateTransform",
          clippath: "clipPath",
          feblend: "feBlend",
          fecolormatrix: "feColorMatrix",
          fecomponenttransfer: "feComponentTransfer",
          fecomposite: "feComposite",
          feconvolvematrix: "feConvolveMatrix",
          fediffuselighting: "feDiffuseLighting",
          fedisplacementmap: "feDisplacementMap",
          fedistantlight: "feDistantLight",
          feflood: "feFlood",
          fefunca: "feFuncA",
          fefuncb: "feFuncB",
          fefuncg: "feFuncG",
          fefuncr: "feFuncR",
          fegaussianblur: "feGaussianBlur",
          feimage: "feImage",
          femerge: "feMerge",
          femergenode: "feMergeNode",
          femorphology: "feMorphology",
          feoffset: "feOffset",
          fepointlight: "fePointLight",
          fespecularlighting: "feSpecularLighting",
          fespotlight: "feSpotLight",
          fetile: "feTile",
          feturbulence: "feTurbulence",
          foreignobject: "foreignObject",
          glyphref: "glyphRef",
          lineargradient: "linearGradient",
          radialgradient: "radialGradient",
          textpath: "textPath",
        },
        $ = {
          __proto__: null,
          0: 65533,
          128: 8364,
          130: 8218,
          131: 402,
          132: 8222,
          133: 8230,
          134: 8224,
          135: 8225,
          136: 710,
          137: 8240,
          138: 352,
          139: 8249,
          140: 338,
          142: 381,
          145: 8216,
          146: 8217,
          147: 8220,
          148: 8221,
          149: 8226,
          150: 8211,
          151: 8212,
          152: 732,
          153: 8482,
          154: 353,
          155: 8250,
          156: 339,
          158: 382,
          159: 376,
        },
        _e = {
          __proto__: null,
          AElig: 198,
          "AElig;": 198,
          AMP: 38,
          "AMP;": 38,
          Aacute: 193,
          "Aacute;": 193,
          "Abreve;": 258,
          Acirc: 194,
          "Acirc;": 194,
          "Acy;": 1040,
          "Afr;": [55349, 56580],
          Agrave: 192,
          "Agrave;": 192,
          "Alpha;": 913,
          "Amacr;": 256,
          "And;": 10835,
          "Aogon;": 260,
          "Aopf;": [55349, 56632],
          "ApplyFunction;": 8289,
          Aring: 197,
          "Aring;": 197,
          "Ascr;": [55349, 56476],
          "Assign;": 8788,
          Atilde: 195,
          "Atilde;": 195,
          Auml: 196,
          "Auml;": 196,
          "Backslash;": 8726,
          "Barv;": 10983,
          "Barwed;": 8966,
          "Bcy;": 1041,
          "Because;": 8757,
          "Bernoullis;": 8492,
          "Beta;": 914,
          "Bfr;": [55349, 56581],
          "Bopf;": [55349, 56633],
          "Breve;": 728,
          "Bscr;": 8492,
          "Bumpeq;": 8782,
          "CHcy;": 1063,
          COPY: 169,
          "COPY;": 169,
          "Cacute;": 262,
          "Cap;": 8914,
          "CapitalDifferentialD;": 8517,
          "Cayleys;": 8493,
          "Ccaron;": 268,
          Ccedil: 199,
          "Ccedil;": 199,
          "Ccirc;": 264,
          "Cconint;": 8752,
          "Cdot;": 266,
          "Cedilla;": 184,
          "CenterDot;": 183,
          "Cfr;": 8493,
          "Chi;": 935,
          "CircleDot;": 8857,
          "CircleMinus;": 8854,
          "CirclePlus;": 8853,
          "CircleTimes;": 8855,
          "ClockwiseContourIntegral;": 8754,
          "CloseCurlyDoubleQuote;": 8221,
          "CloseCurlyQuote;": 8217,
          "Colon;": 8759,
          "Colone;": 10868,
          "Congruent;": 8801,
          "Conint;": 8751,
          "ContourIntegral;": 8750,
          "Copf;": 8450,
          "Coproduct;": 8720,
          "CounterClockwiseContourIntegral;": 8755,
          "Cross;": 10799,
          "Cscr;": [55349, 56478],
          "Cup;": 8915,
          "CupCap;": 8781,
          "DD;": 8517,
          "DDotrahd;": 10513,
          "DJcy;": 1026,
          "DScy;": 1029,
          "DZcy;": 1039,
          "Dagger;": 8225,
          "Darr;": 8609,
          "Dashv;": 10980,
          "Dcaron;": 270,
          "Dcy;": 1044,
          "Del;": 8711,
          "Delta;": 916,
          "Dfr;": [55349, 56583],
          "DiacriticalAcute;": 180,
          "DiacriticalDot;": 729,
          "DiacriticalDoubleAcute;": 733,
          "DiacriticalGrave;": 96,
          "DiacriticalTilde;": 732,
          "Diamond;": 8900,
          "DifferentialD;": 8518,
          "Dopf;": [55349, 56635],
          "Dot;": 168,
          "DotDot;": 8412,
          "DotEqual;": 8784,
          "DoubleContourIntegral;": 8751,
          "DoubleDot;": 168,
          "DoubleDownArrow;": 8659,
          "DoubleLeftArrow;": 8656,
          "DoubleLeftRightArrow;": 8660,
          "DoubleLeftTee;": 10980,
          "DoubleLongLeftArrow;": 10232,
          "DoubleLongLeftRightArrow;": 10234,
          "DoubleLongRightArrow;": 10233,
          "DoubleRightArrow;": 8658,
          "DoubleRightTee;": 8872,
          "DoubleUpArrow;": 8657,
          "DoubleUpDownArrow;": 8661,
          "DoubleVerticalBar;": 8741,
          "DownArrow;": 8595,
          "DownArrowBar;": 10515,
          "DownArrowUpArrow;": 8693,
          "DownBreve;": 785,
          "DownLeftRightVector;": 10576,
          "DownLeftTeeVector;": 10590,
          "DownLeftVector;": 8637,
          "DownLeftVectorBar;": 10582,
          "DownRightTeeVector;": 10591,
          "DownRightVector;": 8641,
          "DownRightVectorBar;": 10583,
          "DownTee;": 8868,
          "DownTeeArrow;": 8615,
          "Downarrow;": 8659,
          "Dscr;": [55349, 56479],
          "Dstrok;": 272,
          "ENG;": 330,
          ETH: 208,
          "ETH;": 208,
          Eacute: 201,
          "Eacute;": 201,
          "Ecaron;": 282,
          Ecirc: 202,
          "Ecirc;": 202,
          "Ecy;": 1069,
          "Edot;": 278,
          "Efr;": [55349, 56584],
          Egrave: 200,
          "Egrave;": 200,
          "Element;": 8712,
          "Emacr;": 274,
          "EmptySmallSquare;": 9723,
          "EmptyVerySmallSquare;": 9643,
          "Eogon;": 280,
          "Eopf;": [55349, 56636],
          "Epsilon;": 917,
          "Equal;": 10869,
          "EqualTilde;": 8770,
          "Equilibrium;": 8652,
          "Escr;": 8496,
          "Esim;": 10867,
          "Eta;": 919,
          Euml: 203,
          "Euml;": 203,
          "Exists;": 8707,
          "ExponentialE;": 8519,
          "Fcy;": 1060,
          "Ffr;": [55349, 56585],
          "FilledSmallSquare;": 9724,
          "FilledVerySmallSquare;": 9642,
          "Fopf;": [55349, 56637],
          "ForAll;": 8704,
          "Fouriertrf;": 8497,
          "Fscr;": 8497,
          "GJcy;": 1027,
          GT: 62,
          "GT;": 62,
          "Gamma;": 915,
          "Gammad;": 988,
          "Gbreve;": 286,
          "Gcedil;": 290,
          "Gcirc;": 284,
          "Gcy;": 1043,
          "Gdot;": 288,
          "Gfr;": [55349, 56586],
          "Gg;": 8921,
          "Gopf;": [55349, 56638],
          "GreaterEqual;": 8805,
          "GreaterEqualLess;": 8923,
          "GreaterFullEqual;": 8807,
          "GreaterGreater;": 10914,
          "GreaterLess;": 8823,
          "GreaterSlantEqual;": 10878,
          "GreaterTilde;": 8819,
          "Gscr;": [55349, 56482],
          "Gt;": 8811,
          "HARDcy;": 1066,
          "Hacek;": 711,
          "Hat;": 94,
          "Hcirc;": 292,
          "Hfr;": 8460,
          "HilbertSpace;": 8459,
          "Hopf;": 8461,
          "HorizontalLine;": 9472,
          "Hscr;": 8459,
          "Hstrok;": 294,
          "HumpDownHump;": 8782,
          "HumpEqual;": 8783,
          "IEcy;": 1045,
          "IJlig;": 306,
          "IOcy;": 1025,
          Iacute: 205,
          "Iacute;": 205,
          Icirc: 206,
          "Icirc;": 206,
          "Icy;": 1048,
          "Idot;": 304,
          "Ifr;": 8465,
          Igrave: 204,
          "Igrave;": 204,
          "Im;": 8465,
          "Imacr;": 298,
          "ImaginaryI;": 8520,
          "Implies;": 8658,
          "Int;": 8748,
          "Integral;": 8747,
          "Intersection;": 8898,
          "InvisibleComma;": 8291,
          "InvisibleTimes;": 8290,
          "Iogon;": 302,
          "Iopf;": [55349, 56640],
          "Iota;": 921,
          "Iscr;": 8464,
          "Itilde;": 296,
          "Iukcy;": 1030,
          Iuml: 207,
          "Iuml;": 207,
          "Jcirc;": 308,
          "Jcy;": 1049,
          "Jfr;": [55349, 56589],
          "Jopf;": [55349, 56641],
          "Jscr;": [55349, 56485],
          "Jsercy;": 1032,
          "Jukcy;": 1028,
          "KHcy;": 1061,
          "KJcy;": 1036,
          "Kappa;": 922,
          "Kcedil;": 310,
          "Kcy;": 1050,
          "Kfr;": [55349, 56590],
          "Kopf;": [55349, 56642],
          "Kscr;": [55349, 56486],
          "LJcy;": 1033,
          LT: 60,
          "LT;": 60,
          "Lacute;": 313,
          "Lambda;": 923,
          "Lang;": 10218,
          "Laplacetrf;": 8466,
          "Larr;": 8606,
          "Lcaron;": 317,
          "Lcedil;": 315,
          "Lcy;": 1051,
          "LeftAngleBracket;": 10216,
          "LeftArrow;": 8592,
          "LeftArrowBar;": 8676,
          "LeftArrowRightArrow;": 8646,
          "LeftCeiling;": 8968,
          "LeftDoubleBracket;": 10214,
          "LeftDownTeeVector;": 10593,
          "LeftDownVector;": 8643,
          "LeftDownVectorBar;": 10585,
          "LeftFloor;": 8970,
          "LeftRightArrow;": 8596,
          "LeftRightVector;": 10574,
          "LeftTee;": 8867,
          "LeftTeeArrow;": 8612,
          "LeftTeeVector;": 10586,
          "LeftTriangle;": 8882,
          "LeftTriangleBar;": 10703,
          "LeftTriangleEqual;": 8884,
          "LeftUpDownVector;": 10577,
          "LeftUpTeeVector;": 10592,
          "LeftUpVector;": 8639,
          "LeftUpVectorBar;": 10584,
          "LeftVector;": 8636,
          "LeftVectorBar;": 10578,
          "Leftarrow;": 8656,
          "Leftrightarrow;": 8660,
          "LessEqualGreater;": 8922,
          "LessFullEqual;": 8806,
          "LessGreater;": 8822,
          "LessLess;": 10913,
          "LessSlantEqual;": 10877,
          "LessTilde;": 8818,
          "Lfr;": [55349, 56591],
          "Ll;": 8920,
          "Lleftarrow;": 8666,
          "Lmidot;": 319,
          "LongLeftArrow;": 10229,
          "LongLeftRightArrow;": 10231,
          "LongRightArrow;": 10230,
          "Longleftarrow;": 10232,
          "Longleftrightarrow;": 10234,
          "Longrightarrow;": 10233,
          "Lopf;": [55349, 56643],
          "LowerLeftArrow;": 8601,
          "LowerRightArrow;": 8600,
          "Lscr;": 8466,
          "Lsh;": 8624,
          "Lstrok;": 321,
          "Lt;": 8810,
          "Map;": 10501,
          "Mcy;": 1052,
          "MediumSpace;": 8287,
          "Mellintrf;": 8499,
          "Mfr;": [55349, 56592],
          "MinusPlus;": 8723,
          "Mopf;": [55349, 56644],
          "Mscr;": 8499,
          "Mu;": 924,
          "NJcy;": 1034,
          "Nacute;": 323,
          "Ncaron;": 327,
          "Ncedil;": 325,
          "Ncy;": 1053,
          "NegativeMediumSpace;": 8203,
          "NegativeThickSpace;": 8203,
          "NegativeThinSpace;": 8203,
          "NegativeVeryThinSpace;": 8203,
          "NestedGreaterGreater;": 8811,
          "NestedLessLess;": 8810,
          "NewLine;": 10,
          "Nfr;": [55349, 56593],
          "NoBreak;": 8288,
          "NonBreakingSpace;": 160,
          "Nopf;": 8469,
          "Not;": 10988,
          "NotCongruent;": 8802,
          "NotCupCap;": 8813,
          "NotDoubleVerticalBar;": 8742,
          "NotElement;": 8713,
          "NotEqual;": 8800,
          "NotEqualTilde;": [8770, 824],
          "NotExists;": 8708,
          "NotGreater;": 8815,
          "NotGreaterEqual;": 8817,
          "NotGreaterFullEqual;": [8807, 824],
          "NotGreaterGreater;": [8811, 824],
          "NotGreaterLess;": 8825,
          "NotGreaterSlantEqual;": [10878, 824],
          "NotGreaterTilde;": 8821,
          "NotHumpDownHump;": [8782, 824],
          "NotHumpEqual;": [8783, 824],
          "NotLeftTriangle;": 8938,
          "NotLeftTriangleBar;": [10703, 824],
          "NotLeftTriangleEqual;": 8940,
          "NotLess;": 8814,
          "NotLessEqual;": 8816,
          "NotLessGreater;": 8824,
          "NotLessLess;": [8810, 824],
          "NotLessSlantEqual;": [10877, 824],
          "NotLessTilde;": 8820,
          "NotNestedGreaterGreater;": [10914, 824],
          "NotNestedLessLess;": [10913, 824],
          "NotPrecedes;": 8832,
          "NotPrecedesEqual;": [10927, 824],
          "NotPrecedesSlantEqual;": 8928,
          "NotReverseElement;": 8716,
          "NotRightTriangle;": 8939,
          "NotRightTriangleBar;": [10704, 824],
          "NotRightTriangleEqual;": 8941,
          "NotSquareSubset;": [8847, 824],
          "NotSquareSubsetEqual;": 8930,
          "NotSquareSuperset;": [8848, 824],
          "NotSquareSupersetEqual;": 8931,
          "NotSubset;": [8834, 8402],
          "NotSubsetEqual;": 8840,
          "NotSucceeds;": 8833,
          "NotSucceedsEqual;": [10928, 824],
          "NotSucceedsSlantEqual;": 8929,
          "NotSucceedsTilde;": [8831, 824],
          "NotSuperset;": [8835, 8402],
          "NotSupersetEqual;": 8841,
          "NotTilde;": 8769,
          "NotTildeEqual;": 8772,
          "NotTildeFullEqual;": 8775,
          "NotTildeTilde;": 8777,
          "NotVerticalBar;": 8740,
          "Nscr;": [55349, 56489],
          Ntilde: 209,
          "Ntilde;": 209,
          "Nu;": 925,
          "OElig;": 338,
          Oacute: 211,
          "Oacute;": 211,
          Ocirc: 212,
          "Ocirc;": 212,
          "Ocy;": 1054,
          "Odblac;": 336,
          "Ofr;": [55349, 56594],
          Ograve: 210,
          "Ograve;": 210,
          "Omacr;": 332,
          "Omega;": 937,
          "Omicron;": 927,
          "Oopf;": [55349, 56646],
          "OpenCurlyDoubleQuote;": 8220,
          "OpenCurlyQuote;": 8216,
          "Or;": 10836,
          "Oscr;": [55349, 56490],
          Oslash: 216,
          "Oslash;": 216,
          Otilde: 213,
          "Otilde;": 213,
          "Otimes;": 10807,
          Ouml: 214,
          "Ouml;": 214,
          "OverBar;": 8254,
          "OverBrace;": 9182,
          "OverBracket;": 9140,
          "OverParenthesis;": 9180,
          "PartialD;": 8706,
          "Pcy;": 1055,
          "Pfr;": [55349, 56595],
          "Phi;": 934,
          "Pi;": 928,
          "PlusMinus;": 177,
          "Poincareplane;": 8460,
          "Popf;": 8473,
          "Pr;": 10939,
          "Precedes;": 8826,
          "PrecedesEqual;": 10927,
          "PrecedesSlantEqual;": 8828,
          "PrecedesTilde;": 8830,
          "Prime;": 8243,
          "Product;": 8719,
          "Proportion;": 8759,
          "Proportional;": 8733,
          "Pscr;": [55349, 56491],
          "Psi;": 936,
          QUOT: 34,
          "QUOT;": 34,
          "Qfr;": [55349, 56596],
          "Qopf;": 8474,
          "Qscr;": [55349, 56492],
          "RBarr;": 10512,
          REG: 174,
          "REG;": 174,
          "Racute;": 340,
          "Rang;": 10219,
          "Rarr;": 8608,
          "Rarrtl;": 10518,
          "Rcaron;": 344,
          "Rcedil;": 342,
          "Rcy;": 1056,
          "Re;": 8476,
          "ReverseElement;": 8715,
          "ReverseEquilibrium;": 8651,
          "ReverseUpEquilibrium;": 10607,
          "Rfr;": 8476,
          "Rho;": 929,
          "RightAngleBracket;": 10217,
          "RightArrow;": 8594,
          "RightArrowBar;": 8677,
          "RightArrowLeftArrow;": 8644,
          "RightCeiling;": 8969,
          "RightDoubleBracket;": 10215,
          "RightDownTeeVector;": 10589,
          "RightDownVector;": 8642,
          "RightDownVectorBar;": 10581,
          "RightFloor;": 8971,
          "RightTee;": 8866,
          "RightTeeArrow;": 8614,
          "RightTeeVector;": 10587,
          "RightTriangle;": 8883,
          "RightTriangleBar;": 10704,
          "RightTriangleEqual;": 8885,
          "RightUpDownVector;": 10575,
          "RightUpTeeVector;": 10588,
          "RightUpVector;": 8638,
          "RightUpVectorBar;": 10580,
          "RightVector;": 8640,
          "RightVectorBar;": 10579,
          "Rightarrow;": 8658,
          "Ropf;": 8477,
          "RoundImplies;": 10608,
          "Rrightarrow;": 8667,
          "Rscr;": 8475,
          "Rsh;": 8625,
          "RuleDelayed;": 10740,
          "SHCHcy;": 1065,
          "SHcy;": 1064,
          "SOFTcy;": 1068,
          "Sacute;": 346,
          "Sc;": 10940,
          "Scaron;": 352,
          "Scedil;": 350,
          "Scirc;": 348,
          "Scy;": 1057,
          "Sfr;": [55349, 56598],
          "ShortDownArrow;": 8595,
          "ShortLeftArrow;": 8592,
          "ShortRightArrow;": 8594,
          "ShortUpArrow;": 8593,
          "Sigma;": 931,
          "SmallCircle;": 8728,
          "Sopf;": [55349, 56650],
          "Sqrt;": 8730,
          "Square;": 9633,
          "SquareIntersection;": 8851,
          "SquareSubset;": 8847,
          "SquareSubsetEqual;": 8849,
          "SquareSuperset;": 8848,
          "SquareSupersetEqual;": 8850,
          "SquareUnion;": 8852,
          "Sscr;": [55349, 56494],
          "Star;": 8902,
          "Sub;": 8912,
          "Subset;": 8912,
          "SubsetEqual;": 8838,
          "Succeeds;": 8827,
          "SucceedsEqual;": 10928,
          "SucceedsSlantEqual;": 8829,
          "SucceedsTilde;": 8831,
          "SuchThat;": 8715,
          "Sum;": 8721,
          "Sup;": 8913,
          "Superset;": 8835,
          "SupersetEqual;": 8839,
          "Supset;": 8913,
          THORN: 222,
          "THORN;": 222,
          "TRADE;": 8482,
          "TSHcy;": 1035,
          "TScy;": 1062,
          "Tab;": 9,
          "Tau;": 932,
          "Tcaron;": 356,
          "Tcedil;": 354,
          "Tcy;": 1058,
          "Tfr;": [55349, 56599],
          "Therefore;": 8756,
          "Theta;": 920,
          "ThickSpace;": [8287, 8202],
          "ThinSpace;": 8201,
          "Tilde;": 8764,
          "TildeEqual;": 8771,
          "TildeFullEqual;": 8773,
          "TildeTilde;": 8776,
          "Topf;": [55349, 56651],
          "TripleDot;": 8411,
          "Tscr;": [55349, 56495],
          "Tstrok;": 358,
          Uacute: 218,
          "Uacute;": 218,
          "Uarr;": 8607,
          "Uarrocir;": 10569,
          "Ubrcy;": 1038,
          "Ubreve;": 364,
          Ucirc: 219,
          "Ucirc;": 219,
          "Ucy;": 1059,
          "Udblac;": 368,
          "Ufr;": [55349, 56600],
          Ugrave: 217,
          "Ugrave;": 217,
          "Umacr;": 362,
          "UnderBar;": 95,
          "UnderBrace;": 9183,
          "UnderBracket;": 9141,
          "UnderParenthesis;": 9181,
          "Union;": 8899,
          "UnionPlus;": 8846,
          "Uogon;": 370,
          "Uopf;": [55349, 56652],
          "UpArrow;": 8593,
          "UpArrowBar;": 10514,
          "UpArrowDownArrow;": 8645,
          "UpDownArrow;": 8597,
          "UpEquilibrium;": 10606,
          "UpTee;": 8869,
          "UpTeeArrow;": 8613,
          "Uparrow;": 8657,
          "Updownarrow;": 8661,
          "UpperLeftArrow;": 8598,
          "UpperRightArrow;": 8599,
          "Upsi;": 978,
          "Upsilon;": 933,
          "Uring;": 366,
          "Uscr;": [55349, 56496],
          "Utilde;": 360,
          Uuml: 220,
          "Uuml;": 220,
          "VDash;": 8875,
          "Vbar;": 10987,
          "Vcy;": 1042,
          "Vdash;": 8873,
          "Vdashl;": 10982,
          "Vee;": 8897,
          "Verbar;": 8214,
          "Vert;": 8214,
          "VerticalBar;": 8739,
          "VerticalLine;": 124,
          "VerticalSeparator;": 10072,
          "VerticalTilde;": 8768,
          "VeryThinSpace;": 8202,
          "Vfr;": [55349, 56601],
          "Vopf;": [55349, 56653],
          "Vscr;": [55349, 56497],
          "Vvdash;": 8874,
          "Wcirc;": 372,
          "Wedge;": 8896,
          "Wfr;": [55349, 56602],
          "Wopf;": [55349, 56654],
          "Wscr;": [55349, 56498],
          "Xfr;": [55349, 56603],
          "Xi;": 926,
          "Xopf;": [55349, 56655],
          "Xscr;": [55349, 56499],
          "YAcy;": 1071,
          "YIcy;": 1031,
          "YUcy;": 1070,
          Yacute: 221,
          "Yacute;": 221,
          "Ycirc;": 374,
          "Ycy;": 1067,
          "Yfr;": [55349, 56604],
          "Yopf;": [55349, 56656],
          "Yscr;": [55349, 56500],
          "Yuml;": 376,
          "ZHcy;": 1046,
          "Zacute;": 377,
          "Zcaron;": 381,
          "Zcy;": 1047,
          "Zdot;": 379,
          "ZeroWidthSpace;": 8203,
          "Zeta;": 918,
          "Zfr;": 8488,
          "Zopf;": 8484,
          "Zscr;": [55349, 56501],
          aacute: 225,
          "aacute;": 225,
          "abreve;": 259,
          "ac;": 8766,
          "acE;": [8766, 819],
          "acd;": 8767,
          acirc: 226,
          "acirc;": 226,
          acute: 180,
          "acute;": 180,
          "acy;": 1072,
          aelig: 230,
          "aelig;": 230,
          "af;": 8289,
          "afr;": [55349, 56606],
          agrave: 224,
          "agrave;": 224,
          "alefsym;": 8501,
          "aleph;": 8501,
          "alpha;": 945,
          "amacr;": 257,
          "amalg;": 10815,
          amp: 38,
          "amp;": 38,
          "and;": 8743,
          "andand;": 10837,
          "andd;": 10844,
          "andslope;": 10840,
          "andv;": 10842,
          "ang;": 8736,
          "ange;": 10660,
          "angle;": 8736,
          "angmsd;": 8737,
          "angmsdaa;": 10664,
          "angmsdab;": 10665,
          "angmsdac;": 10666,
          "angmsdad;": 10667,
          "angmsdae;": 10668,
          "angmsdaf;": 10669,
          "angmsdag;": 10670,
          "angmsdah;": 10671,
          "angrt;": 8735,
          "angrtvb;": 8894,
          "angrtvbd;": 10653,
          "angsph;": 8738,
          "angst;": 197,
          "angzarr;": 9084,
          "aogon;": 261,
          "aopf;": [55349, 56658],
          "ap;": 8776,
          "apE;": 10864,
          "apacir;": 10863,
          "ape;": 8778,
          "apid;": 8779,
          "apos;": 39,
          "approx;": 8776,
          "approxeq;": 8778,
          aring: 229,
          "aring;": 229,
          "ascr;": [55349, 56502],
          "ast;": 42,
          "asymp;": 8776,
          "asympeq;": 8781,
          atilde: 227,
          "atilde;": 227,
          auml: 228,
          "auml;": 228,
          "awconint;": 8755,
          "awint;": 10769,
          "bNot;": 10989,
          "backcong;": 8780,
          "backepsilon;": 1014,
          "backprime;": 8245,
          "backsim;": 8765,
          "backsimeq;": 8909,
          "barvee;": 8893,
          "barwed;": 8965,
          "barwedge;": 8965,
          "bbrk;": 9141,
          "bbrktbrk;": 9142,
          "bcong;": 8780,
          "bcy;": 1073,
          "bdquo;": 8222,
          "becaus;": 8757,
          "because;": 8757,
          "bemptyv;": 10672,
          "bepsi;": 1014,
          "bernou;": 8492,
          "beta;": 946,
          "beth;": 8502,
          "between;": 8812,
          "bfr;": [55349, 56607],
          "bigcap;": 8898,
          "bigcirc;": 9711,
          "bigcup;": 8899,
          "bigodot;": 10752,
          "bigoplus;": 10753,
          "bigotimes;": 10754,
          "bigsqcup;": 10758,
          "bigstar;": 9733,
          "bigtriangledown;": 9661,
          "bigtriangleup;": 9651,
          "biguplus;": 10756,
          "bigvee;": 8897,
          "bigwedge;": 8896,
          "bkarow;": 10509,
          "blacklozenge;": 10731,
          "blacksquare;": 9642,
          "blacktriangle;": 9652,
          "blacktriangledown;": 9662,
          "blacktriangleleft;": 9666,
          "blacktriangleright;": 9656,
          "blank;": 9251,
          "blk12;": 9618,
          "blk14;": 9617,
          "blk34;": 9619,
          "block;": 9608,
          "bne;": [61, 8421],
          "bnequiv;": [8801, 8421],
          "bnot;": 8976,
          "bopf;": [55349, 56659],
          "bot;": 8869,
          "bottom;": 8869,
          "bowtie;": 8904,
          "boxDL;": 9559,
          "boxDR;": 9556,
          "boxDl;": 9558,
          "boxDr;": 9555,
          "boxH;": 9552,
          "boxHD;": 9574,
          "boxHU;": 9577,
          "boxHd;": 9572,
          "boxHu;": 9575,
          "boxUL;": 9565,
          "boxUR;": 9562,
          "boxUl;": 9564,
          "boxUr;": 9561,
          "boxV;": 9553,
          "boxVH;": 9580,
          "boxVL;": 9571,
          "boxVR;": 9568,
          "boxVh;": 9579,
          "boxVl;": 9570,
          "boxVr;": 9567,
          "boxbox;": 10697,
          "boxdL;": 9557,
          "boxdR;": 9554,
          "boxdl;": 9488,
          "boxdr;": 9484,
          "boxh;": 9472,
          "boxhD;": 9573,
          "boxhU;": 9576,
          "boxhd;": 9516,
          "boxhu;": 9524,
          "boxminus;": 8863,
          "boxplus;": 8862,
          "boxtimes;": 8864,
          "boxuL;": 9563,
          "boxuR;": 9560,
          "boxul;": 9496,
          "boxur;": 9492,
          "boxv;": 9474,
          "boxvH;": 9578,
          "boxvL;": 9569,
          "boxvR;": 9566,
          "boxvh;": 9532,
          "boxvl;": 9508,
          "boxvr;": 9500,
          "bprime;": 8245,
          "breve;": 728,
          brvbar: 166,
          "brvbar;": 166,
          "bscr;": [55349, 56503],
          "bsemi;": 8271,
          "bsim;": 8765,
          "bsime;": 8909,
          "bsol;": 92,
          "bsolb;": 10693,
          "bsolhsub;": 10184,
          "bull;": 8226,
          "bullet;": 8226,
          "bump;": 8782,
          "bumpE;": 10926,
          "bumpe;": 8783,
          "bumpeq;": 8783,
          "cacute;": 263,
          "cap;": 8745,
          "capand;": 10820,
          "capbrcup;": 10825,
          "capcap;": 10827,
          "capcup;": 10823,
          "capdot;": 10816,
          "caps;": [8745, 65024],
          "caret;": 8257,
          "caron;": 711,
          "ccaps;": 10829,
          "ccaron;": 269,
          ccedil: 231,
          "ccedil;": 231,
          "ccirc;": 265,
          "ccups;": 10828,
          "ccupssm;": 10832,
          "cdot;": 267,
          cedil: 184,
          "cedil;": 184,
          "cemptyv;": 10674,
          cent: 162,
          "cent;": 162,
          "centerdot;": 183,
          "cfr;": [55349, 56608],
          "chcy;": 1095,
          "check;": 10003,
          "checkmark;": 10003,
          "chi;": 967,
          "cir;": 9675,
          "cirE;": 10691,
          "circ;": 710,
          "circeq;": 8791,
          "circlearrowleft;": 8634,
          "circlearrowright;": 8635,
          "circledR;": 174,
          "circledS;": 9416,
          "circledast;": 8859,
          "circledcirc;": 8858,
          "circleddash;": 8861,
          "cire;": 8791,
          "cirfnint;": 10768,
          "cirmid;": 10991,
          "cirscir;": 10690,
          "clubs;": 9827,
          "clubsuit;": 9827,
          "colon;": 58,
          "colone;": 8788,
          "coloneq;": 8788,
          "comma;": 44,
          "commat;": 64,
          "comp;": 8705,
          "compfn;": 8728,
          "complement;": 8705,
          "complexes;": 8450,
          "cong;": 8773,
          "congdot;": 10861,
          "conint;": 8750,
          "copf;": [55349, 56660],
          "coprod;": 8720,
          copy: 169,
          "copy;": 169,
          "copysr;": 8471,
          "crarr;": 8629,
          "cross;": 10007,
          "cscr;": [55349, 56504],
          "csub;": 10959,
          "csube;": 10961,
          "csup;": 10960,
          "csupe;": 10962,
          "ctdot;": 8943,
          "cudarrl;": 10552,
          "cudarrr;": 10549,
          "cuepr;": 8926,
          "cuesc;": 8927,
          "cularr;": 8630,
          "cularrp;": 10557,
          "cup;": 8746,
          "cupbrcap;": 10824,
          "cupcap;": 10822,
          "cupcup;": 10826,
          "cupdot;": 8845,
          "cupor;": 10821,
          "cups;": [8746, 65024],
          "curarr;": 8631,
          "curarrm;": 10556,
          "curlyeqprec;": 8926,
          "curlyeqsucc;": 8927,
          "curlyvee;": 8910,
          "curlywedge;": 8911,
          curren: 164,
          "curren;": 164,
          "curvearrowleft;": 8630,
          "curvearrowright;": 8631,
          "cuvee;": 8910,
          "cuwed;": 8911,
          "cwconint;": 8754,
          "cwint;": 8753,
          "cylcty;": 9005,
          "dArr;": 8659,
          "dHar;": 10597,
          "dagger;": 8224,
          "daleth;": 8504,
          "darr;": 8595,
          "dash;": 8208,
          "dashv;": 8867,
          "dbkarow;": 10511,
          "dblac;": 733,
          "dcaron;": 271,
          "dcy;": 1076,
          "dd;": 8518,
          "ddagger;": 8225,
          "ddarr;": 8650,
          "ddotseq;": 10871,
          deg: 176,
          "deg;": 176,
          "delta;": 948,
          "demptyv;": 10673,
          "dfisht;": 10623,
          "dfr;": [55349, 56609],
          "dharl;": 8643,
          "dharr;": 8642,
          "diam;": 8900,
          "diamond;": 8900,
          "diamondsuit;": 9830,
          "diams;": 9830,
          "die;": 168,
          "digamma;": 989,
          "disin;": 8946,
          "div;": 247,
          divide: 247,
          "divide;": 247,
          "divideontimes;": 8903,
          "divonx;": 8903,
          "djcy;": 1106,
          "dlcorn;": 8990,
          "dlcrop;": 8973,
          "dollar;": 36,
          "dopf;": [55349, 56661],
          "dot;": 729,
          "doteq;": 8784,
          "doteqdot;": 8785,
          "dotminus;": 8760,
          "dotplus;": 8724,
          "dotsquare;": 8865,
          "doublebarwedge;": 8966,
          "downarrow;": 8595,
          "downdownarrows;": 8650,
          "downharpoonleft;": 8643,
          "downharpoonright;": 8642,
          "drbkarow;": 10512,
          "drcorn;": 8991,
          "drcrop;": 8972,
          "dscr;": [55349, 56505],
          "dscy;": 1109,
          "dsol;": 10742,
          "dstrok;": 273,
          "dtdot;": 8945,
          "dtri;": 9663,
          "dtrif;": 9662,
          "duarr;": 8693,
          "duhar;": 10607,
          "dwangle;": 10662,
          "dzcy;": 1119,
          "dzigrarr;": 10239,
          "eDDot;": 10871,
          "eDot;": 8785,
          eacute: 233,
          "eacute;": 233,
          "easter;": 10862,
          "ecaron;": 283,
          "ecir;": 8790,
          ecirc: 234,
          "ecirc;": 234,
          "ecolon;": 8789,
          "ecy;": 1101,
          "edot;": 279,
          "ee;": 8519,
          "efDot;": 8786,
          "efr;": [55349, 56610],
          "eg;": 10906,
          egrave: 232,
          "egrave;": 232,
          "egs;": 10902,
          "egsdot;": 10904,
          "el;": 10905,
          "elinters;": 9191,
          "ell;": 8467,
          "els;": 10901,
          "elsdot;": 10903,
          "emacr;": 275,
          "empty;": 8709,
          "emptyset;": 8709,
          "emptyv;": 8709,
          "emsp13;": 8196,
          "emsp14;": 8197,
          "emsp;": 8195,
          "eng;": 331,
          "ensp;": 8194,
          "eogon;": 281,
          "eopf;": [55349, 56662],
          "epar;": 8917,
          "eparsl;": 10723,
          "eplus;": 10865,
          "epsi;": 949,
          "epsilon;": 949,
          "epsiv;": 1013,
          "eqcirc;": 8790,
          "eqcolon;": 8789,
          "eqsim;": 8770,
          "eqslantgtr;": 10902,
          "eqslantless;": 10901,
          "equals;": 61,
          "equest;": 8799,
          "equiv;": 8801,
          "equivDD;": 10872,
          "eqvparsl;": 10725,
          "erDot;": 8787,
          "erarr;": 10609,
          "escr;": 8495,
          "esdot;": 8784,
          "esim;": 8770,
          "eta;": 951,
          eth: 240,
          "eth;": 240,
          euml: 235,
          "euml;": 235,
          "euro;": 8364,
          "excl;": 33,
          "exist;": 8707,
          "expectation;": 8496,
          "exponentiale;": 8519,
          "fallingdotseq;": 8786,
          "fcy;": 1092,
          "female;": 9792,
          "ffilig;": 64259,
          "fflig;": 64256,
          "ffllig;": 64260,
          "ffr;": [55349, 56611],
          "filig;": 64257,
          "fjlig;": [102, 106],
          "flat;": 9837,
          "fllig;": 64258,
          "fltns;": 9649,
          "fnof;": 402,
          "fopf;": [55349, 56663],
          "forall;": 8704,
          "fork;": 8916,
          "forkv;": 10969,
          "fpartint;": 10765,
          frac12: 189,
          "frac12;": 189,
          "frac13;": 8531,
          frac14: 188,
          "frac14;": 188,
          "frac15;": 8533,
          "frac16;": 8537,
          "frac18;": 8539,
          "frac23;": 8532,
          "frac25;": 8534,
          frac34: 190,
          "frac34;": 190,
          "frac35;": 8535,
          "frac38;": 8540,
          "frac45;": 8536,
          "frac56;": 8538,
          "frac58;": 8541,
          "frac78;": 8542,
          "frasl;": 8260,
          "frown;": 8994,
          "fscr;": [55349, 56507],
          "gE;": 8807,
          "gEl;": 10892,
          "gacute;": 501,
          "gamma;": 947,
          "gammad;": 989,
          "gap;": 10886,
          "gbreve;": 287,
          "gcirc;": 285,
          "gcy;": 1075,
          "gdot;": 289,
          "ge;": 8805,
          "gel;": 8923,
          "geq;": 8805,
          "geqq;": 8807,
          "geqslant;": 10878,
          "ges;": 10878,
          "gescc;": 10921,
          "gesdot;": 10880,
          "gesdoto;": 10882,
          "gesdotol;": 10884,
          "gesl;": [8923, 65024],
          "gesles;": 10900,
          "gfr;": [55349, 56612],
          "gg;": 8811,
          "ggg;": 8921,
          "gimel;": 8503,
          "gjcy;": 1107,
          "gl;": 8823,
          "glE;": 10898,
          "gla;": 10917,
          "glj;": 10916,
          "gnE;": 8809,
          "gnap;": 10890,
          "gnapprox;": 10890,
          "gne;": 10888,
          "gneq;": 10888,
          "gneqq;": 8809,
          "gnsim;": 8935,
          "gopf;": [55349, 56664],
          "grave;": 96,
          "gscr;": 8458,
          "gsim;": 8819,
          "gsime;": 10894,
          "gsiml;": 10896,
          gt: 62,
          "gt;": 62,
          "gtcc;": 10919,
          "gtcir;": 10874,
          "gtdot;": 8919,
          "gtlPar;": 10645,
          "gtquest;": 10876,
          "gtrapprox;": 10886,
          "gtrarr;": 10616,
          "gtrdot;": 8919,
          "gtreqless;": 8923,
          "gtreqqless;": 10892,
          "gtrless;": 8823,
          "gtrsim;": 8819,
          "gvertneqq;": [8809, 65024],
          "gvnE;": [8809, 65024],
          "hArr;": 8660,
          "hairsp;": 8202,
          "half;": 189,
          "hamilt;": 8459,
          "hardcy;": 1098,
          "harr;": 8596,
          "harrcir;": 10568,
          "harrw;": 8621,
          "hbar;": 8463,
          "hcirc;": 293,
          "hearts;": 9829,
          "heartsuit;": 9829,
          "hellip;": 8230,
          "hercon;": 8889,
          "hfr;": [55349, 56613],
          "hksearow;": 10533,
          "hkswarow;": 10534,
          "hoarr;": 8703,
          "homtht;": 8763,
          "hookleftarrow;": 8617,
          "hookrightarrow;": 8618,
          "hopf;": [55349, 56665],
          "horbar;": 8213,
          "hscr;": [55349, 56509],
          "hslash;": 8463,
          "hstrok;": 295,
          "hybull;": 8259,
          "hyphen;": 8208,
          iacute: 237,
          "iacute;": 237,
          "ic;": 8291,
          icirc: 238,
          "icirc;": 238,
          "icy;": 1080,
          "iecy;": 1077,
          iexcl: 161,
          "iexcl;": 161,
          "iff;": 8660,
          "ifr;": [55349, 56614],
          igrave: 236,
          "igrave;": 236,
          "ii;": 8520,
          "iiiint;": 10764,
          "iiint;": 8749,
          "iinfin;": 10716,
          "iiota;": 8489,
          "ijlig;": 307,
          "imacr;": 299,
          "image;": 8465,
          "imagline;": 8464,
          "imagpart;": 8465,
          "imath;": 305,
          "imof;": 8887,
          "imped;": 437,
          "in;": 8712,
          "incare;": 8453,
          "infin;": 8734,
          "infintie;": 10717,
          "inodot;": 305,
          "int;": 8747,
          "intcal;": 8890,
          "integers;": 8484,
          "intercal;": 8890,
          "intlarhk;": 10775,
          "intprod;": 10812,
          "iocy;": 1105,
          "iogon;": 303,
          "iopf;": [55349, 56666],
          "iota;": 953,
          "iprod;": 10812,
          iquest: 191,
          "iquest;": 191,
          "iscr;": [55349, 56510],
          "isin;": 8712,
          "isinE;": 8953,
          "isindot;": 8949,
          "isins;": 8948,
          "isinsv;": 8947,
          "isinv;": 8712,
          "it;": 8290,
          "itilde;": 297,
          "iukcy;": 1110,
          iuml: 239,
          "iuml;": 239,
          "jcirc;": 309,
          "jcy;": 1081,
          "jfr;": [55349, 56615],
          "jmath;": 567,
          "jopf;": [55349, 56667],
          "jscr;": [55349, 56511],
          "jsercy;": 1112,
          "jukcy;": 1108,
          "kappa;": 954,
          "kappav;": 1008,
          "kcedil;": 311,
          "kcy;": 1082,
          "kfr;": [55349, 56616],
          "kgreen;": 312,
          "khcy;": 1093,
          "kjcy;": 1116,
          "kopf;": [55349, 56668],
          "kscr;": [55349, 56512],
          "lAarr;": 8666,
          "lArr;": 8656,
          "lAtail;": 10523,
          "lBarr;": 10510,
          "lE;": 8806,
          "lEg;": 10891,
          "lHar;": 10594,
          "lacute;": 314,
          "laemptyv;": 10676,
          "lagran;": 8466,
          "lambda;": 955,
          "lang;": 10216,
          "langd;": 10641,
          "langle;": 10216,
          "lap;": 10885,
          laquo: 171,
          "laquo;": 171,
          "larr;": 8592,
          "larrb;": 8676,
          "larrbfs;": 10527,
          "larrfs;": 10525,
          "larrhk;": 8617,
          "larrlp;": 8619,
          "larrpl;": 10553,
          "larrsim;": 10611,
          "larrtl;": 8610,
          "lat;": 10923,
          "latail;": 10521,
          "late;": 10925,
          "lates;": [10925, 65024],
          "lbarr;": 10508,
          "lbbrk;": 10098,
          "lbrace;": 123,
          "lbrack;": 91,
          "lbrke;": 10635,
          "lbrksld;": 10639,
          "lbrkslu;": 10637,
          "lcaron;": 318,
          "lcedil;": 316,
          "lceil;": 8968,
          "lcub;": 123,
          "lcy;": 1083,
          "ldca;": 10550,
          "ldquo;": 8220,
          "ldquor;": 8222,
          "ldrdhar;": 10599,
          "ldrushar;": 10571,
          "ldsh;": 8626,
          "le;": 8804,
          "leftarrow;": 8592,
          "leftarrowtail;": 8610,
          "leftharpoondown;": 8637,
          "leftharpoonup;": 8636,
          "leftleftarrows;": 8647,
          "leftrightarrow;": 8596,
          "leftrightarrows;": 8646,
          "leftrightharpoons;": 8651,
          "leftrightsquigarrow;": 8621,
          "leftthreetimes;": 8907,
          "leg;": 8922,
          "leq;": 8804,
          "leqq;": 8806,
          "leqslant;": 10877,
          "les;": 10877,
          "lescc;": 10920,
          "lesdot;": 10879,
          "lesdoto;": 10881,
          "lesdotor;": 10883,
          "lesg;": [8922, 65024],
          "lesges;": 10899,
          "lessapprox;": 10885,
          "lessdot;": 8918,
          "lesseqgtr;": 8922,
          "lesseqqgtr;": 10891,
          "lessgtr;": 8822,
          "lesssim;": 8818,
          "lfisht;": 10620,
          "lfloor;": 8970,
          "lfr;": [55349, 56617],
          "lg;": 8822,
          "lgE;": 10897,
          "lhard;": 8637,
          "lharu;": 8636,
          "lharul;": 10602,
          "lhblk;": 9604,
          "ljcy;": 1113,
          "ll;": 8810,
          "llarr;": 8647,
          "llcorner;": 8990,
          "llhard;": 10603,
          "lltri;": 9722,
          "lmidot;": 320,
          "lmoust;": 9136,
          "lmoustache;": 9136,
          "lnE;": 8808,
          "lnap;": 10889,
          "lnapprox;": 10889,
          "lne;": 10887,
          "lneq;": 10887,
          "lneqq;": 8808,
          "lnsim;": 8934,
          "loang;": 10220,
          "loarr;": 8701,
          "lobrk;": 10214,
          "longleftarrow;": 10229,
          "longleftrightarrow;": 10231,
          "longmapsto;": 10236,
          "longrightarrow;": 10230,
          "looparrowleft;": 8619,
          "looparrowright;": 8620,
          "lopar;": 10629,
          "lopf;": [55349, 56669],
          "loplus;": 10797,
          "lotimes;": 10804,
          "lowast;": 8727,
          "lowbar;": 95,
          "loz;": 9674,
          "lozenge;": 9674,
          "lozf;": 10731,
          "lpar;": 40,
          "lparlt;": 10643,
          "lrarr;": 8646,
          "lrcorner;": 8991,
          "lrhar;": 8651,
          "lrhard;": 10605,
          "lrm;": 8206,
          "lrtri;": 8895,
          "lsaquo;": 8249,
          "lscr;": [55349, 56513],
          "lsh;": 8624,
          "lsim;": 8818,
          "lsime;": 10893,
          "lsimg;": 10895,
          "lsqb;": 91,
          "lsquo;": 8216,
          "lsquor;": 8218,
          "lstrok;": 322,
          lt: 60,
          "lt;": 60,
          "ltcc;": 10918,
          "ltcir;": 10873,
          "ltdot;": 8918,
          "lthree;": 8907,
          "ltimes;": 8905,
          "ltlarr;": 10614,
          "ltquest;": 10875,
          "ltrPar;": 10646,
          "ltri;": 9667,
          "ltrie;": 8884,
          "ltrif;": 9666,
          "lurdshar;": 10570,
          "luruhar;": 10598,
          "lvertneqq;": [8808, 65024],
          "lvnE;": [8808, 65024],
          "mDDot;": 8762,
          macr: 175,
          "macr;": 175,
          "male;": 9794,
          "malt;": 10016,
          "maltese;": 10016,
          "map;": 8614,
          "mapsto;": 8614,
          "mapstodown;": 8615,
          "mapstoleft;": 8612,
          "mapstoup;": 8613,
          "marker;": 9646,
          "mcomma;": 10793,
          "mcy;": 1084,
          "mdash;": 8212,
          "measuredangle;": 8737,
          "mfr;": [55349, 56618],
          "mho;": 8487,
          micro: 181,
          "micro;": 181,
          "mid;": 8739,
          "midast;": 42,
          "midcir;": 10992,
          middot: 183,
          "middot;": 183,
          "minus;": 8722,
          "minusb;": 8863,
          "minusd;": 8760,
          "minusdu;": 10794,
          "mlcp;": 10971,
          "mldr;": 8230,
          "mnplus;": 8723,
          "models;": 8871,
          "mopf;": [55349, 56670],
          "mp;": 8723,
          "mscr;": [55349, 56514],
          "mstpos;": 8766,
          "mu;": 956,
          "multimap;": 8888,
          "mumap;": 8888,
          "nGg;": [8921, 824],
          "nGt;": [8811, 8402],
          "nGtv;": [8811, 824],
          "nLeftarrow;": 8653,
          "nLeftrightarrow;": 8654,
          "nLl;": [8920, 824],
          "nLt;": [8810, 8402],
          "nLtv;": [8810, 824],
          "nRightarrow;": 8655,
          "nVDash;": 8879,
          "nVdash;": 8878,
          "nabla;": 8711,
          "nacute;": 324,
          "nang;": [8736, 8402],
          "nap;": 8777,
          "napE;": [10864, 824],
          "napid;": [8779, 824],
          "napos;": 329,
          "napprox;": 8777,
          "natur;": 9838,
          "natural;": 9838,
          "naturals;": 8469,
          nbsp: 160,
          "nbsp;": 160,
          "nbump;": [8782, 824],
          "nbumpe;": [8783, 824],
          "ncap;": 10819,
          "ncaron;": 328,
          "ncedil;": 326,
          "ncong;": 8775,
          "ncongdot;": [10861, 824],
          "ncup;": 10818,
          "ncy;": 1085,
          "ndash;": 8211,
          "ne;": 8800,
          "neArr;": 8663,
          "nearhk;": 10532,
          "nearr;": 8599,
          "nearrow;": 8599,
          "nedot;": [8784, 824],
          "nequiv;": 8802,
          "nesear;": 10536,
          "nesim;": [8770, 824],
          "nexist;": 8708,
          "nexists;": 8708,
          "nfr;": [55349, 56619],
          "ngE;": [8807, 824],
          "nge;": 8817,
          "ngeq;": 8817,
          "ngeqq;": [8807, 824],
          "ngeqslant;": [10878, 824],
          "nges;": [10878, 824],
          "ngsim;": 8821,
          "ngt;": 8815,
          "ngtr;": 8815,
          "nhArr;": 8654,
          "nharr;": 8622,
          "nhpar;": 10994,
          "ni;": 8715,
          "nis;": 8956,
          "nisd;": 8954,
          "niv;": 8715,
          "njcy;": 1114,
          "nlArr;": 8653,
          "nlE;": [8806, 824],
          "nlarr;": 8602,
          "nldr;": 8229,
          "nle;": 8816,
          "nleftarrow;": 8602,
          "nleftrightarrow;": 8622,
          "nleq;": 8816,
          "nleqq;": [8806, 824],
          "nleqslant;": [10877, 824],
          "nles;": [10877, 824],
          "nless;": 8814,
          "nlsim;": 8820,
          "nlt;": 8814,
          "nltri;": 8938,
          "nltrie;": 8940,
          "nmid;": 8740,
          "nopf;": [55349, 56671],
          not: 172,
          "not;": 172,
          "notin;": 8713,
          "notinE;": [8953, 824],
          "notindot;": [8949, 824],
          "notinva;": 8713,
          "notinvb;": 8951,
          "notinvc;": 8950,
          "notni;": 8716,
          "notniva;": 8716,
          "notnivb;": 8958,
          "notnivc;": 8957,
          "npar;": 8742,
          "nparallel;": 8742,
          "nparsl;": [11005, 8421],
          "npart;": [8706, 824],
          "npolint;": 10772,
          "npr;": 8832,
          "nprcue;": 8928,
          "npre;": [10927, 824],
          "nprec;": 8832,
          "npreceq;": [10927, 824],
          "nrArr;": 8655,
          "nrarr;": 8603,
          "nrarrc;": [10547, 824],
          "nrarrw;": [8605, 824],
          "nrightarrow;": 8603,
          "nrtri;": 8939,
          "nrtrie;": 8941,
          "nsc;": 8833,
          "nsccue;": 8929,
          "nsce;": [10928, 824],
          "nscr;": [55349, 56515],
          "nshortmid;": 8740,
          "nshortparallel;": 8742,
          "nsim;": 8769,
          "nsime;": 8772,
          "nsimeq;": 8772,
          "nsmid;": 8740,
          "nspar;": 8742,
          "nsqsube;": 8930,
          "nsqsupe;": 8931,
          "nsub;": 8836,
          "nsubE;": [10949, 824],
          "nsube;": 8840,
          "nsubset;": [8834, 8402],
          "nsubseteq;": 8840,
          "nsubseteqq;": [10949, 824],
          "nsucc;": 8833,
          "nsucceq;": [10928, 824],
          "nsup;": 8837,
          "nsupE;": [10950, 824],
          "nsupe;": 8841,
          "nsupset;": [8835, 8402],
          "nsupseteq;": 8841,
          "nsupseteqq;": [10950, 824],
          "ntgl;": 8825,
          ntilde: 241,
          "ntilde;": 241,
          "ntlg;": 8824,
          "ntriangleleft;": 8938,
          "ntrianglelefteq;": 8940,
          "ntriangleright;": 8939,
          "ntrianglerighteq;": 8941,
          "nu;": 957,
          "num;": 35,
          "numero;": 8470,
          "numsp;": 8199,
          "nvDash;": 8877,
          "nvHarr;": 10500,
          "nvap;": [8781, 8402],
          "nvdash;": 8876,
          "nvge;": [8805, 8402],
          "nvgt;": [62, 8402],
          "nvinfin;": 10718,
          "nvlArr;": 10498,
          "nvle;": [8804, 8402],
          "nvlt;": [60, 8402],
          "nvltrie;": [8884, 8402],
          "nvrArr;": 10499,
          "nvrtrie;": [8885, 8402],
          "nvsim;": [8764, 8402],
          "nwArr;": 8662,
          "nwarhk;": 10531,
          "nwarr;": 8598,
          "nwarrow;": 8598,
          "nwnear;": 10535,
          "oS;": 9416,
          oacute: 243,
          "oacute;": 243,
          "oast;": 8859,
          "ocir;": 8858,
          ocirc: 244,
          "ocirc;": 244,
          "ocy;": 1086,
          "odash;": 8861,
          "odblac;": 337,
          "odiv;": 10808,
          "odot;": 8857,
          "odsold;": 10684,
          "oelig;": 339,
          "ofcir;": 10687,
          "ofr;": [55349, 56620],
          "ogon;": 731,
          ograve: 242,
          "ograve;": 242,
          "ogt;": 10689,
          "ohbar;": 10677,
          "ohm;": 937,
          "oint;": 8750,
          "olarr;": 8634,
          "olcir;": 10686,
          "olcross;": 10683,
          "oline;": 8254,
          "olt;": 10688,
          "omacr;": 333,
          "omega;": 969,
          "omicron;": 959,
          "omid;": 10678,
          "ominus;": 8854,
          "oopf;": [55349, 56672],
          "opar;": 10679,
          "operp;": 10681,
          "oplus;": 8853,
          "or;": 8744,
          "orarr;": 8635,
          "ord;": 10845,
          "order;": 8500,
          "orderof;": 8500,
          ordf: 170,
          "ordf;": 170,
          ordm: 186,
          "ordm;": 186,
          "origof;": 8886,
          "oror;": 10838,
          "orslope;": 10839,
          "orv;": 10843,
          "oscr;": 8500,
          oslash: 248,
          "oslash;": 248,
          "osol;": 8856,
          otilde: 245,
          "otilde;": 245,
          "otimes;": 8855,
          "otimesas;": 10806,
          ouml: 246,
          "ouml;": 246,
          "ovbar;": 9021,
          "par;": 8741,
          para: 182,
          "para;": 182,
          "parallel;": 8741,
          "parsim;": 10995,
          "parsl;": 11005,
          "part;": 8706,
          "pcy;": 1087,
          "percnt;": 37,
          "period;": 46,
          "permil;": 8240,
          "perp;": 8869,
          "pertenk;": 8241,
          "pfr;": [55349, 56621],
          "phi;": 966,
          "phiv;": 981,
          "phmmat;": 8499,
          "phone;": 9742,
          "pi;": 960,
          "pitchfork;": 8916,
          "piv;": 982,
          "planck;": 8463,
          "planckh;": 8462,
          "plankv;": 8463,
          "plus;": 43,
          "plusacir;": 10787,
          "plusb;": 8862,
          "pluscir;": 10786,
          "plusdo;": 8724,
          "plusdu;": 10789,
          "pluse;": 10866,
          plusmn: 177,
          "plusmn;": 177,
          "plussim;": 10790,
          "plustwo;": 10791,
          "pm;": 177,
          "pointint;": 10773,
          "popf;": [55349, 56673],
          pound: 163,
          "pound;": 163,
          "pr;": 8826,
          "prE;": 10931,
          "prap;": 10935,
          "prcue;": 8828,
          "pre;": 10927,
          "prec;": 8826,
          "precapprox;": 10935,
          "preccurlyeq;": 8828,
          "preceq;": 10927,
          "precnapprox;": 10937,
          "precneqq;": 10933,
          "precnsim;": 8936,
          "precsim;": 8830,
          "prime;": 8242,
          "primes;": 8473,
          "prnE;": 10933,
          "prnap;": 10937,
          "prnsim;": 8936,
          "prod;": 8719,
          "profalar;": 9006,
          "profline;": 8978,
          "profsurf;": 8979,
          "prop;": 8733,
          "propto;": 8733,
          "prsim;": 8830,
          "prurel;": 8880,
          "pscr;": [55349, 56517],
          "psi;": 968,
          "puncsp;": 8200,
          "qfr;": [55349, 56622],
          "qint;": 10764,
          "qopf;": [55349, 56674],
          "qprime;": 8279,
          "qscr;": [55349, 56518],
          "quaternions;": 8461,
          "quatint;": 10774,
          "quest;": 63,
          "questeq;": 8799,
          quot: 34,
          "quot;": 34,
          "rAarr;": 8667,
          "rArr;": 8658,
          "rAtail;": 10524,
          "rBarr;": 10511,
          "rHar;": 10596,
          "race;": [8765, 817],
          "racute;": 341,
          "radic;": 8730,
          "raemptyv;": 10675,
          "rang;": 10217,
          "rangd;": 10642,
          "range;": 10661,
          "rangle;": 10217,
          raquo: 187,
          "raquo;": 187,
          "rarr;": 8594,
          "rarrap;": 10613,
          "rarrb;": 8677,
          "rarrbfs;": 10528,
          "rarrc;": 10547,
          "rarrfs;": 10526,
          "rarrhk;": 8618,
          "rarrlp;": 8620,
          "rarrpl;": 10565,
          "rarrsim;": 10612,
          "rarrtl;": 8611,
          "rarrw;": 8605,
          "ratail;": 10522,
          "ratio;": 8758,
          "rationals;": 8474,
          "rbarr;": 10509,
          "rbbrk;": 10099,
          "rbrace;": 125,
          "rbrack;": 93,
          "rbrke;": 10636,
          "rbrksld;": 10638,
          "rbrkslu;": 10640,
          "rcaron;": 345,
          "rcedil;": 343,
          "rceil;": 8969,
          "rcub;": 125,
          "rcy;": 1088,
          "rdca;": 10551,
          "rdldhar;": 10601,
          "rdquo;": 8221,
          "rdquor;": 8221,
          "rdsh;": 8627,
          "real;": 8476,
          "realine;": 8475,
          "realpart;": 8476,
          "reals;": 8477,
          "rect;": 9645,
          reg: 174,
          "reg;": 174,
          "rfisht;": 10621,
          "rfloor;": 8971,
          "rfr;": [55349, 56623],
          "rhard;": 8641,
          "rharu;": 8640,
          "rharul;": 10604,
          "rho;": 961,
          "rhov;": 1009,
          "rightarrow;": 8594,
          "rightarrowtail;": 8611,
          "rightharpoondown;": 8641,
          "rightharpoonup;": 8640,
          "rightleftarrows;": 8644,
          "rightleftharpoons;": 8652,
          "rightrightarrows;": 8649,
          "rightsquigarrow;": 8605,
          "rightthreetimes;": 8908,
          "ring;": 730,
          "risingdotseq;": 8787,
          "rlarr;": 8644,
          "rlhar;": 8652,
          "rlm;": 8207,
          "rmoust;": 9137,
          "rmoustache;": 9137,
          "rnmid;": 10990,
          "roang;": 10221,
          "roarr;": 8702,
          "robrk;": 10215,
          "ropar;": 10630,
          "ropf;": [55349, 56675],
          "roplus;": 10798,
          "rotimes;": 10805,
          "rpar;": 41,
          "rpargt;": 10644,
          "rppolint;": 10770,
          "rrarr;": 8649,
          "rsaquo;": 8250,
          "rscr;": [55349, 56519],
          "rsh;": 8625,
          "rsqb;": 93,
          "rsquo;": 8217,
          "rsquor;": 8217,
          "rthree;": 8908,
          "rtimes;": 8906,
          "rtri;": 9657,
          "rtrie;": 8885,
          "rtrif;": 9656,
          "rtriltri;": 10702,
          "ruluhar;": 10600,
          "rx;": 8478,
          "sacute;": 347,
          "sbquo;": 8218,
          "sc;": 8827,
          "scE;": 10932,
          "scap;": 10936,
          "scaron;": 353,
          "sccue;": 8829,
          "sce;": 10928,
          "scedil;": 351,
          "scirc;": 349,
          "scnE;": 10934,
          "scnap;": 10938,
          "scnsim;": 8937,
          "scpolint;": 10771,
          "scsim;": 8831,
          "scy;": 1089,
          "sdot;": 8901,
          "sdotb;": 8865,
          "sdote;": 10854,
          "seArr;": 8664,
          "searhk;": 10533,
          "searr;": 8600,
          "searrow;": 8600,
          sect: 167,
          "sect;": 167,
          "semi;": 59,
          "seswar;": 10537,
          "setminus;": 8726,
          "setmn;": 8726,
          "sext;": 10038,
          "sfr;": [55349, 56624],
          "sfrown;": 8994,
          "sharp;": 9839,
          "shchcy;": 1097,
          "shcy;": 1096,
          "shortmid;": 8739,
          "shortparallel;": 8741,
          shy: 173,
          "shy;": 173,
          "sigma;": 963,
          "sigmaf;": 962,
          "sigmav;": 962,
          "sim;": 8764,
          "simdot;": 10858,
          "sime;": 8771,
          "simeq;": 8771,
          "simg;": 10910,
          "simgE;": 10912,
          "siml;": 10909,
          "simlE;": 10911,
          "simne;": 8774,
          "simplus;": 10788,
          "simrarr;": 10610,
          "slarr;": 8592,
          "smallsetminus;": 8726,
          "smashp;": 10803,
          "smeparsl;": 10724,
          "smid;": 8739,
          "smile;": 8995,
          "smt;": 10922,
          "smte;": 10924,
          "smtes;": [10924, 65024],
          "softcy;": 1100,
          "sol;": 47,
          "solb;": 10692,
          "solbar;": 9023,
          "sopf;": [55349, 56676],
          "spades;": 9824,
          "spadesuit;": 9824,
          "spar;": 8741,
          "sqcap;": 8851,
          "sqcaps;": [8851, 65024],
          "sqcup;": 8852,
          "sqcups;": [8852, 65024],
          "sqsub;": 8847,
          "sqsube;": 8849,
          "sqsubset;": 8847,
          "sqsubseteq;": 8849,
          "sqsup;": 8848,
          "sqsupe;": 8850,
          "sqsupset;": 8848,
          "sqsupseteq;": 8850,
          "squ;": 9633,
          "square;": 9633,
          "squarf;": 9642,
          "squf;": 9642,
          "srarr;": 8594,
          "sscr;": [55349, 56520],
          "ssetmn;": 8726,
          "ssmile;": 8995,
          "sstarf;": 8902,
          "star;": 9734,
          "starf;": 9733,
          "straightepsilon;": 1013,
          "straightphi;": 981,
          "strns;": 175,
          "sub;": 8834,
          "subE;": 10949,
          "subdot;": 10941,
          "sube;": 8838,
          "subedot;": 10947,
          "submult;": 10945,
          "subnE;": 10955,
          "subne;": 8842,
          "subplus;": 10943,
          "subrarr;": 10617,
          "subset;": 8834,
          "subseteq;": 8838,
          "subseteqq;": 10949,
          "subsetneq;": 8842,
          "subsetneqq;": 10955,
          "subsim;": 10951,
          "subsub;": 10965,
          "subsup;": 10963,
          "succ;": 8827,
          "succapprox;": 10936,
          "succcurlyeq;": 8829,
          "succeq;": 10928,
          "succnapprox;": 10938,
          "succneqq;": 10934,
          "succnsim;": 8937,
          "succsim;": 8831,
          "sum;": 8721,
          "sung;": 9834,
          sup1: 185,
          "sup1;": 185,
          sup2: 178,
          "sup2;": 178,
          sup3: 179,
          "sup3;": 179,
          "sup;": 8835,
          "supE;": 10950,
          "supdot;": 10942,
          "supdsub;": 10968,
          "supe;": 8839,
          "supedot;": 10948,
          "suphsol;": 10185,
          "suphsub;": 10967,
          "suplarr;": 10619,
          "supmult;": 10946,
          "supnE;": 10956,
          "supne;": 8843,
          "supplus;": 10944,
          "supset;": 8835,
          "supseteq;": 8839,
          "supseteqq;": 10950,
          "supsetneq;": 8843,
          "supsetneqq;": 10956,
          "supsim;": 10952,
          "supsub;": 10964,
          "supsup;": 10966,
          "swArr;": 8665,
          "swarhk;": 10534,
          "swarr;": 8601,
          "swarrow;": 8601,
          "swnwar;": 10538,
          szlig: 223,
          "szlig;": 223,
          "target;": 8982,
          "tau;": 964,
          "tbrk;": 9140,
          "tcaron;": 357,
          "tcedil;": 355,
          "tcy;": 1090,
          "tdot;": 8411,
          "telrec;": 8981,
          "tfr;": [55349, 56625],
          "there4;": 8756,
          "therefore;": 8756,
          "theta;": 952,
          "thetasym;": 977,
          "thetav;": 977,
          "thickapprox;": 8776,
          "thicksim;": 8764,
          "thinsp;": 8201,
          "thkap;": 8776,
          "thksim;": 8764,
          thorn: 254,
          "thorn;": 254,
          "tilde;": 732,
          times: 215,
          "times;": 215,
          "timesb;": 8864,
          "timesbar;": 10801,
          "timesd;": 10800,
          "tint;": 8749,
          "toea;": 10536,
          "top;": 8868,
          "topbot;": 9014,
          "topcir;": 10993,
          "topf;": [55349, 56677],
          "topfork;": 10970,
          "tosa;": 10537,
          "tprime;": 8244,
          "trade;": 8482,
          "triangle;": 9653,
          "triangledown;": 9663,
          "triangleleft;": 9667,
          "trianglelefteq;": 8884,
          "triangleq;": 8796,
          "triangleright;": 9657,
          "trianglerighteq;": 8885,
          "tridot;": 9708,
          "trie;": 8796,
          "triminus;": 10810,
          "triplus;": 10809,
          "trisb;": 10701,
          "tritime;": 10811,
          "trpezium;": 9186,
          "tscr;": [55349, 56521],
          "tscy;": 1094,
          "tshcy;": 1115,
          "tstrok;": 359,
          "twixt;": 8812,
          "twoheadleftarrow;": 8606,
          "twoheadrightarrow;": 8608,
          "uArr;": 8657,
          "uHar;": 10595,
          uacute: 250,
          "uacute;": 250,
          "uarr;": 8593,
          "ubrcy;": 1118,
          "ubreve;": 365,
          ucirc: 251,
          "ucirc;": 251,
          "ucy;": 1091,
          "udarr;": 8645,
          "udblac;": 369,
          "udhar;": 10606,
          "ufisht;": 10622,
          "ufr;": [55349, 56626],
          ugrave: 249,
          "ugrave;": 249,
          "uharl;": 8639,
          "uharr;": 8638,
          "uhblk;": 9600,
          "ulcorn;": 8988,
          "ulcorner;": 8988,
          "ulcrop;": 8975,
          "ultri;": 9720,
          "umacr;": 363,
          uml: 168,
          "uml;": 168,
          "uogon;": 371,
          "uopf;": [55349, 56678],
          "uparrow;": 8593,
          "updownarrow;": 8597,
          "upharpoonleft;": 8639,
          "upharpoonright;": 8638,
          "uplus;": 8846,
          "upsi;": 965,
          "upsih;": 978,
          "upsilon;": 965,
          "upuparrows;": 8648,
          "urcorn;": 8989,
          "urcorner;": 8989,
          "urcrop;": 8974,
          "uring;": 367,
          "urtri;": 9721,
          "uscr;": [55349, 56522],
          "utdot;": 8944,
          "utilde;": 361,
          "utri;": 9653,
          "utrif;": 9652,
          "uuarr;": 8648,
          uuml: 252,
          "uuml;": 252,
          "uwangle;": 10663,
          "vArr;": 8661,
          "vBar;": 10984,
          "vBarv;": 10985,
          "vDash;": 8872,
          "vangrt;": 10652,
          "varepsilon;": 1013,
          "varkappa;": 1008,
          "varnothing;": 8709,
          "varphi;": 981,
          "varpi;": 982,
          "varpropto;": 8733,
          "varr;": 8597,
          "varrho;": 1009,
          "varsigma;": 962,
          "varsubsetneq;": [8842, 65024],
          "varsubsetneqq;": [10955, 65024],
          "varsupsetneq;": [8843, 65024],
          "varsupsetneqq;": [10956, 65024],
          "vartheta;": 977,
          "vartriangleleft;": 8882,
          "vartriangleright;": 8883,
          "vcy;": 1074,
          "vdash;": 8866,
          "vee;": 8744,
          "veebar;": 8891,
          "veeeq;": 8794,
          "vellip;": 8942,
          "verbar;": 124,
          "vert;": 124,
          "vfr;": [55349, 56627],
          "vltri;": 8882,
          "vnsub;": [8834, 8402],
          "vnsup;": [8835, 8402],
          "vopf;": [55349, 56679],
          "vprop;": 8733,
          "vrtri;": 8883,
          "vscr;": [55349, 56523],
          "vsubnE;": [10955, 65024],
          "vsubne;": [8842, 65024],
          "vsupnE;": [10956, 65024],
          "vsupne;": [8843, 65024],
          "vzigzag;": 10650,
          "wcirc;": 373,
          "wedbar;": 10847,
          "wedge;": 8743,
          "wedgeq;": 8793,
          "weierp;": 8472,
          "wfr;": [55349, 56628],
          "wopf;": [55349, 56680],
          "wp;": 8472,
          "wr;": 8768,
          "wreath;": 8768,
          "wscr;": [55349, 56524],
          "xcap;": 8898,
          "xcirc;": 9711,
          "xcup;": 8899,
          "xdtri;": 9661,
          "xfr;": [55349, 56629],
          "xhArr;": 10234,
          "xharr;": 10231,
          "xi;": 958,
          "xlArr;": 10232,
          "xlarr;": 10229,
          "xmap;": 10236,
          "xnis;": 8955,
          "xodot;": 10752,
          "xopf;": [55349, 56681],
          "xoplus;": 10753,
          "xotime;": 10754,
          "xrArr;": 10233,
          "xrarr;": 10230,
          "xscr;": [55349, 56525],
          "xsqcup;": 10758,
          "xuplus;": 10756,
          "xutri;": 9651,
          "xvee;": 8897,
          "xwedge;": 8896,
          yacute: 253,
          "yacute;": 253,
          "yacy;": 1103,
          "ycirc;": 375,
          "ycy;": 1099,
          yen: 165,
          "yen;": 165,
          "yfr;": [55349, 56630],
          "yicy;": 1111,
          "yopf;": [55349, 56682],
          "yscr;": [55349, 56526],
          "yucy;": 1102,
          yuml: 255,
          "yuml;": 255,
          "zacute;": 378,
          "zcaron;": 382,
          "zcy;": 1079,
          "zdot;": 380,
          "zeetrf;": 8488,
          "zeta;": 950,
          "zfr;": [55349, 56631],
          "zhcy;": 1078,
          "zigrarr;": 8669,
          "zopf;": [55349, 56683],
          "zscr;": [55349, 56527],
          "zwj;": 8205,
          "zwnj;": 8204,
        },
        gt =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        ot = 32,
        In = /[^\r"&\u0000]+/g,
        Et = /[^\r'&\u0000]+/g,
        li = /[^\r\t\n\f &>\u0000]+/g,
        ls = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        G0 = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        W0 = /[^\]\r\u0000\uffff]*/g,
        Q0 = /[^&<\r\u0000\uffff]*/g,
        Hp = /[^<\r\u0000\uffff]*/g,
        K0 = /[^\r\u0000\uffff]*/g,
        Up = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        Vp =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        Qo = /[^\x09\x0A\x0C\x0D\x20]/,
        tu = /[^\x09\x0A\x0C\x0D\x20]/g,
        Y0 = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        Nr = /^[\x09\x0A\x0C\x0D\x20]+/,
        Ko = /\x00/g;
      function ht(B) {
        var U = 16384;
        if (B.length < U) return String.fromCharCode.apply(String, B);
        for (var oe = "", ee = 0; ee < B.length; ee += U)
          oe += String.fromCharCode.apply(String, B.slice(ee, ee + U));
        return oe;
      }
      function Z0(B) {
        for (var U = [], oe = 0; oe < B.length; oe++) U[oe] = B.charCodeAt(oe);
        return U;
      }
      function Le(B, U) {
        if (typeof U == "string")
          return B.namespaceURI === s.HTML && B.localName === U;
        var oe = U[B.namespaceURI];
        return oe && oe[B.localName];
      }
      function qp(B) {
        return Le(B, V);
      }
      function $p(B) {
        if (Le(B, K)) return !0;
        if (B.namespaceURI === s.MATHML && B.localName === "annotation-xml") {
          var U = B.getAttribute("encoding");
          if (
            (U && (U = U.toLowerCase()),
            U === "text/html" || U === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function X0(B) {
        return B in k ? k[B] : B;
      }
      function zp(B) {
        for (var U = 0, oe = B.length; U < oe; U++)
          B[U][0] in S && (B[U][0] = S[B[U][0]]);
      }
      function Gp(B) {
        for (var U = 0, oe = B.length; U < oe; U++)
          if (B[U][0] === "definitionurl") {
            B[U][0] = "definitionURL";
            break;
          }
      }
      function nu(B) {
        for (var U = 0, oe = B.length; U < oe; U++)
          B[U][0] in he && B[U].push(he[B[U][0]]);
      }
      function Wp(B, U) {
        for (var oe = 0, ee = B.length; oe < ee; oe++) {
          var qe = B[oe][0],
            ne = B[oe][1];
          U.hasAttribute(qe) || U._setAttribute(qe, ne);
        }
      }
      (Me.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (Me.ElementStack.prototype.push = function (B) {
          this.elements.push(B), (this.top = B);
        }),
        (Me.ElementStack.prototype.pop = function (B) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (Me.ElementStack.prototype.popTag = function (B) {
          for (var U = this.elements.length - 1; U > 0; U--) {
            var oe = this.elements[U];
            if (Le(oe, B)) break;
          }
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Me.ElementStack.prototype.popElementType = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !(this.elements[U] instanceof B);
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Me.ElementStack.prototype.popElement = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && this.elements[U] !== B;
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Me.ElementStack.prototype.removeElement = function (B) {
          if (this.top === B) this.pop();
          else {
            var U = this.elements.lastIndexOf(B);
            U !== -1 && this.elements.splice(U, 1);
          }
        }),
        (Me.ElementStack.prototype.clearToContext = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !Le(this.elements[U], B);
            U--
          );
          (this.elements.length = U + 1), (this.top = this.elements[U]);
        }),
        (Me.ElementStack.prototype.contains = function (B) {
          return this.inSpecificScope(B, Object.create(null));
        }),
        (Me.ElementStack.prototype.inSpecificScope = function (B, U) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (Le(ee, B)) return !0;
            if (Le(ee, U)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.elementInSpecificScope = function (B, U) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (ee === B) return !0;
            if (Le(ee, U)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.elementTypeInSpecificScope = function (
          B,
          U
        ) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (ee instanceof B) return !0;
            if (Le(ee, U)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.inScope = function (B) {
          return this.inSpecificScope(B, m);
        }),
        (Me.ElementStack.prototype.elementInScope = function (B) {
          return this.elementInSpecificScope(B, m);
        }),
        (Me.ElementStack.prototype.elementTypeInScope = function (B) {
          return this.elementTypeInSpecificScope(B, m);
        }),
        (Me.ElementStack.prototype.inButtonScope = function (B) {
          return this.inSpecificScope(B, y);
        }),
        (Me.ElementStack.prototype.inListItemScope = function (B) {
          return this.inSpecificScope(B, p);
        }),
        (Me.ElementStack.prototype.inTableScope = function (B) {
          return this.inSpecificScope(B, C);
        }),
        (Me.ElementStack.prototype.inSelectScope = function (B) {
          for (var U = this.elements.length - 1; U >= 0; U--) {
            var oe = this.elements[U];
            if (oe.namespaceURI !== s.HTML) return !1;
            var ee = oe.localName;
            if (ee === B) return !0;
            if (ee !== "optgroup" && ee !== "option") return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.generateImpliedEndTags = function (B, U) {
          for (
            var oe = U ? z : pe, ee = this.elements.length - 1;
            ee >= 0;
            ee--
          ) {
            var qe = this.elements[ee];
            if ((B && Le(qe, B)) || !Le(this.elements[ee], oe)) break;
          }
          (this.elements.length = ee + 1), (this.top = this.elements[ee]);
        }),
        (Me.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (Me.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (Me.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (Me.ActiveFormattingElements.prototype.push = function (B, U) {
          for (
            var oe = 0, ee = this.list.length - 1;
            ee >= 0 && this.list[ee] !== this.MARKER;
            ee--
          )
            if (Mr(B, this.list[ee], this.attrs[ee]) && (oe++, oe === 3)) {
              this.list.splice(ee, 1), this.attrs.splice(ee, 1);
              break;
            }
          this.list.push(B);
          for (var qe = [], ne = 0; ne < U.length; ne++) qe[ne] = U[ne];
          this.attrs.push(qe);
          function Mr(Wn, Ar, Nn) {
            if (Wn.localName !== Ar.localName || Wn._numattrs !== Nn.length)
              return !1;
            for (var bt = 0, Yo = Nn.length; bt < Yo; bt++) {
              var xr = Nn[bt][0],
                A = Nn[bt][1];
              if (!Wn.hasAttribute(xr) || Wn.getAttribute(xr) !== A) return !1;
            }
            return !0;
          }
        }),
        (Me.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var B = this.list.length - 1;
            B >= 0 && this.list[B] !== this.MARKER;
            B--
          );
          B < 0 && (B = 0), (this.list.length = B), (this.attrs.length = B);
        }),
        (Me.ActiveFormattingElements.prototype.findElementByTag = function (B) {
          for (var U = this.list.length - 1; U >= 0; U--) {
            var oe = this.list[U];
            if (oe === this.MARKER) break;
            if (oe.localName === B) return oe;
          }
          return null;
        }),
        (Me.ActiveFormattingElements.prototype.indexOf = function (B) {
          return this.list.lastIndexOf(B);
        }),
        (Me.ActiveFormattingElements.prototype.remove = function (B) {
          var U = this.list.lastIndexOf(B);
          U !== -1 && (this.list.splice(U, 1), this.attrs.splice(U, 1));
        }),
        (Me.ActiveFormattingElements.prototype.replace = function (B, U, oe) {
          var ee = this.list.lastIndexOf(B);
          ee !== -1 && ((this.list[ee] = U), (this.attrs[ee] = oe));
        }),
        (Me.ActiveFormattingElements.prototype.insertAfter = function (B, U) {
          var oe = this.list.lastIndexOf(B);
          oe !== -1 &&
            (this.list.splice(oe, 0, U), this.attrs.splice(oe, 0, U));
        });
      function Me(B, U, oe) {
        var ee = null,
          qe = 0,
          ne = 0,
          Mr = !1,
          Wn = !1,
          Ar = 0,
          Nn = [],
          bt = "",
          Yo = !0,
          xr = 0,
          A = Te,
          Qn,
          Qe,
          Pe = "",
          Zo = "",
          Fe = [],
          It = "",
          wt = "",
          Ue = [],
          Kn = [],
          Yn = [],
          Zn = [],
          Yt = [],
          Xo = !1,
          H = Kw,
          Mn = null,
          An = [],
          N = new Me.ElementStack(),
          be = new Me.ActiveFormattingElements(),
          Rr = U !== void 0,
          Jo = null,
          xn = null,
          ea = !0;
        U && (ea = U.ownerDocument._scripting_enabled),
          oe && oe.scripting_enabled === !1 && (ea = !1);
        var Ke = !0,
          ru = !1,
          ta,
          iu,
          W = [],
          Xn = !1,
          Or = !1,
          na = {
            document: function () {
              return Ae;
            },
            _asDocumentFragment: function () {
              for (
                var f = Ae.createDocumentFragment(), h = Ae.firstChild;
                h.hasChildNodes();

              )
                f.appendChild(h.firstChild);
              return f;
            },
            pause: function () {
              xr++;
            },
            resume: function () {
              xr--, this.parse("");
            },
            parse: function (f, h, D) {
              var L;
              return xr > 0
                ? ((bt += f), !0)
                : (Ar === 0
                    ? (bt && ((f = bt + f), (bt = "")),
                      h && ((f += "\uFFFF"), (Mr = !0)),
                      (ee = f),
                      (qe = f.length),
                      (ne = 0),
                      Yo && ((Yo = !1), ee.charCodeAt(0) === 65279 && (ne = 1)),
                      Ar++,
                      (L = Kp(D)),
                      (bt = ee.substring(ne, qe)),
                      Ar--)
                    : (Ar++,
                      Nn.push(ee, qe, ne),
                      (ee = f),
                      (qe = f.length),
                      (ne = 0),
                      Kp(),
                      (L = !1),
                      (bt = ee.substring(ne, qe)),
                      (ne = Nn.pop()),
                      (qe = Nn.pop()),
                      (ee = Nn.pop()),
                      bt &&
                        ((ee = bt + ee.substring(ne)),
                        (qe = ee.length),
                        (ne = 0),
                        (bt = "")),
                      Ar--),
                  L);
            },
          },
          Ae = new n(!0, B);
        if (((Ae._parser = na), (Ae._scripting_enabled = ea), U)) {
          if (
            (U.ownerDocument._quirks && (Ae._quirks = !0),
            U.ownerDocument._limitedQuirks && (Ae._limitedQuirks = !0),
            U.namespaceURI === s.HTML)
          )
            switch (U.localName) {
              case "title":
              case "textarea":
                A = nr;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                A = lu;
                break;
            }
          var Qp = Ae.createElement("html");
          Ae._appendChild(Qp),
            N.push(Qp),
            U instanceof a.HTMLTemplateElement && An.push(Eu),
            ms();
          for (var us = U; us !== null; us = us.parentElement)
            if (us instanceof a.HTMLFormElement) {
              xn = us;
              break;
            }
        }
        function Kp(f) {
          for (var h, D, L, P; ne < qe; ) {
            if (xr > 0 || (f && f())) return !0;
            switch (typeof A.lookahead) {
              case "undefined":
                if (((h = ee.charCodeAt(ne++)), Wn && ((Wn = !1), h === 10))) {
                  ne++;
                  continue;
                }
                switch (h) {
                  case 13:
                    ne < qe ? ee.charCodeAt(ne) === 10 && ne++ : (Wn = !0),
                      A(10);
                    break;
                  case 65535:
                    if (Mr && ne === qe) {
                      A(l);
                      break;
                    }
                  default:
                    A(h);
                    break;
                }
                break;
              case "number":
                h = ee.charCodeAt(ne);
                var Q = A.lookahead,
                  le = !0;
                if ((Q < 0 && ((le = !1), (Q = -Q)), Q < qe - ne))
                  (D = le ? ee.substring(ne, ne + Q) : null), (P = !1);
                else if (Mr)
                  (D = le ? ee.substring(ne, qe) : null),
                    (P = !0),
                    h === 65535 && ne === qe - 1 && (h = l);
                else return !0;
                A(h, D, P);
                break;
              case "string":
                (h = ee.charCodeAt(ne)), (L = A.lookahead);
                var Se = ee.indexOf(L, ne);
                if (Se !== -1) (D = ee.substring(ne, Se + L.length)), (P = !1);
                else {
                  if (!Mr) return !0;
                  (D = ee.substring(ne, qe)),
                    h === 65535 && ne === qe - 1 && (h = l),
                    (P = !0);
                }
                A(h, D, P);
                break;
            }
          }
          return !1;
        }
        function Jn(f, h) {
          for (var D = 0; D < Yt.length; D++) if (Yt[D][0] === f) return;
          h !== void 0 ? Yt.push([f, h]) : Yt.push([f]);
        }
        function J0() {
          Vp.lastIndex = ne - 1;
          var f = Vp.exec(ee);
          if (!f) throw new Error("should never happen");
          var h = f[1];
          if (!h) return !1;
          var D = f[2],
            L = D.length;
          switch (D[0]) {
            case '"':
            case "'":
              (D = D.substring(1, L - 1)), (ne += f[0].length - 1), (A = hu);
              break;
            default:
              (A = mn), (ne += f[0].length - 1), (D = D.substring(0, L - 1));
              break;
          }
          for (var P = 0; P < Yt.length; P++) if (Yt[P][0] === h) return !0;
          return Yt.push([h, D]), !0;
        }
        function ew() {
          (Xo = !1), (Pe = ""), (Yt.length = 0);
        }
        function ds() {
          (Xo = !0), (Pe = ""), (Yt.length = 0);
        }
        function Rn() {
          Fe.length = 0;
        }
        function su() {
          It = "";
        }
        function ou() {
          wt = "";
        }
        function Yp() {
          Ue.length = 0;
        }
        function ui() {
          (Kn.length = 0), (Yn = null), (Zn = null);
        }
        function ra() {
          Yn = [];
        }
        function er() {
          Zn = [];
        }
        function xe() {
          ru = !0;
        }
        function tw() {
          return N.top && N.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function Vt(f) {
          return Zo === f;
        }
        function di() {
          if (W.length > 0) {
            var f = ht(W);
            if (
              ((W.length = 0),
              Or &&
                ((Or = !1),
                f[0] ===
                  `
` && (f = f.substring(1)),
                f.length === 0))
            )
              return;
            Ze(u, f), (Xn = !1);
          }
          Or = !1;
        }
        function fs(f) {
          f.lastIndex = ne - 1;
          var h = f.exec(ee);
          if (h && h.index === ne - 1)
            return (
              (h = h[0]),
              (ne += h.length - 1),
              Mr && ne === qe && ((h = h.slice(0, -1)), ne--),
              h
            );
          throw new Error("should never happen");
        }
        function hs(f) {
          f.lastIndex = ne - 1;
          var h = f.exec(ee)[0];
          return h ? (nw(h), (ne += h.length - 1), !0) : !1;
        }
        function nw(f) {
          W.length > 0 && di(),
            !(
              Or &&
              ((Or = !1),
              f[0] ===
                `
` && (f = f.substring(1)),
              f.length === 0)
            ) && Ze(u, f);
        }
        function On() {
          if (Xo) Ze(g, Pe);
          else {
            var f = Pe;
            (Pe = ""), (Zo = f), Ze(d, f, Yt);
          }
        }
        function rw() {
          if (ne === qe) return !1;
          Up.lastIndex = ne;
          var f = Up.exec(ee);
          if (!f) throw new Error("should never happen");
          var h = f[2];
          if (!h) return !1;
          var D = f[1];
          return (
            D
              ? ((ne += h.length + 2), Ze(g, h))
              : ((ne += h.length + 1), (Zo = h), Ze(d, h, M)),
            !0
          );
        }
        function iw() {
          Xo ? Ze(g, Pe, null, !0) : Ze(d, Pe, Yt, !0);
        }
        function Re() {
          Ze(I, ht(Kn), Yn ? ht(Yn) : void 0, Zn ? ht(Zn) : void 0);
        }
        function ge() {
          di(), H(l), (Ae.modclock = 1);
        }
        var Ze = (na.insertToken = function (h, D, L, P) {
          di();
          var Q = N.top;
          !Q || Q.namespaceURI === s.HTML
            ? H(h, D, L, P)
            : h !== d && h !== u
            ? fm(h, D, L, P)
            : (qp(Q) &&
                (h === u ||
                  (h === d && D !== "mglyph" && D !== "malignmark"))) ||
              (h === d &&
                D === "svg" &&
                Q.namespaceURI === s.MATHML &&
                Q.localName === "annotation-xml") ||
              $p(Q)
            ? ((iu = !0), H(h, D, L, P), (iu = !1))
            : fm(h, D, L, P);
        });
        function fn(f) {
          var h = N.top;
          tr && Le(h, re)
            ? sa(function (D) {
                return D.createComment(f);
              })
            : (h instanceof a.HTMLTemplateElement && (h = h.content),
              h._appendChild(h.ownerDocument.createComment(f)));
        }
        function hn(f) {
          var h = N.top;
          if (tr && Le(h, re))
            sa(function (L) {
              return L.createTextNode(f);
            });
          else {
            h instanceof a.HTMLTemplateElement && (h = h.content);
            var D = h.lastChild;
            D && D.nodeType === i.TEXT_NODE
              ? D.appendData(f)
              : h._appendChild(h.ownerDocument.createTextNode(f));
          }
        }
        function ps(f, h, D) {
          var L = o.createElement(f, h, null);
          if (D)
            for (var P = 0, Q = D.length; P < Q; P++)
              L._setAttribute(D[P][0], D[P][1]);
          return L;
        }
        var tr = !1;
        function fe(f, h) {
          var D = ia(function (L) {
            return ps(L, f, h);
          });
          return Le(D, v) && (D._form = xn), D;
        }
        function ia(f) {
          var h;
          return (
            tr && Le(N.top, re)
              ? (h = sa(f))
              : N.top instanceof a.HTMLTemplateElement
              ? ((h = f(N.top.content.ownerDocument)),
                N.top.content._appendChild(h))
              : ((h = f(N.top.ownerDocument)), N.top._appendChild(h)),
            N.push(h),
            h
          );
        }
        function au(f, h, D) {
          return ia(function (L) {
            var P = L._createElementNS(f, D, null);
            if (h)
              for (var Q = 0, le = h.length; Q < le; Q++) {
                var Se = h[Q];
                Se.length === 2
                  ? P._setAttribute(Se[0], Se[1])
                  : P._setAttributeNS(Se[2], Se[0], Se[1]);
              }
            return P;
          });
        }
        function Zp(f) {
          for (var h = N.elements.length - 1; h >= 0; h--)
            if (N.elements[h] instanceof f) return h;
          return -1;
        }
        function sa(f) {
          var h,
            D,
            L = -1,
            P = -1,
            Q;
          if (
            ((L = Zp(a.HTMLTableElement)),
            (P = Zp(a.HTMLTemplateElement)),
            P >= 0 && (L < 0 || P > L)
              ? (h = N.elements[P])
              : L >= 0 &&
                ((h = N.elements[L].parentNode),
                h ? (D = N.elements[L]) : (h = N.elements[L - 1])),
            h || (h = N.elements[0]),
            h instanceof a.HTMLTemplateElement && (h = h.content),
            (Q = f(h.ownerDocument)),
            Q.nodeType === i.TEXT_NODE)
          ) {
            var le;
            if (
              (D ? (le = D.previousSibling) : (le = h.lastChild),
              le && le.nodeType === i.TEXT_NODE)
            )
              return le.appendData(Q.data), Q;
          }
          return D ? h.insertBefore(Q, D) : h._appendChild(Q), Q;
        }
        function ms() {
          for (var f = !1, h = N.elements.length - 1; h >= 0; h--) {
            var D = N.elements[h];
            if (
              (h === 0 && ((f = !0), Rr && (D = U)), D.namespaceURI === s.HTML)
            ) {
              var L = D.localName;
              switch (L) {
                case "select":
                  for (var P = h; P > 0; ) {
                    var Q = N.elements[--P];
                    if (Q instanceof a.HTMLTemplateElement) break;
                    if (Q instanceof a.HTMLTableElement) {
                      H = Ea;
                      return;
                    }
                  }
                  H = kn;
                  return;
                case "tr":
                  H = vs;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  H = Fr;
                  return;
                case "caption":
                  H = vu;
                  return;
                case "colgroup":
                  H = va;
                  return;
                case "table":
                  H = qt;
                  return;
                case "template":
                  H = An[An.length - 1];
                  return;
                case "body":
                  H = ce;
                  return;
                case "frameset":
                  H = bu;
                  return;
                case "html":
                  Jo === null ? (H = ga) : (H = yu);
                  return;
                default:
                  if (!f) {
                    if (L === "head") {
                      H = Ye;
                      return;
                    }
                    if (L === "td" || L === "th") {
                      H = fi;
                      return;
                    }
                  }
              }
            }
            if (f) {
              H = ce;
              return;
            }
          }
        }
        function oa(f, h) {
          fe(f, h), (A = gs), (Mn = H), (H = ya);
        }
        function sw(f, h) {
          fe(f, h), (A = nr), (Mn = H), (H = ya);
        }
        function cu(f, h) {
          return {
            elt: ps(f, be.list[h].localName, be.attrs[h]),
            attrs: be.attrs[h],
          };
        }
        function yt() {
          if (be.list.length !== 0) {
            var f = be.list[be.list.length - 1];
            if (f !== be.MARKER && N.elements.lastIndexOf(f) === -1) {
              for (
                var h = be.list.length - 2;
                h >= 0 &&
                ((f = be.list[h]),
                !(f === be.MARKER || N.elements.lastIndexOf(f) !== -1));
                h--
              );
              for (h = h + 1; h < be.list.length; h++) {
                var D = ia(function (L) {
                  return cu(L, h).elt;
                });
                be.list[h] = D;
              }
            }
          }
        }
        var aa = { localName: "BM" };
        function ow(f) {
          if (Le(N.top, f) && be.indexOf(N.top) === -1) return N.pop(), !0;
          for (var h = 0; h < 8; ) {
            h++;
            var D = be.findElementByTag(f);
            if (!D) return !1;
            var L = N.elements.lastIndexOf(D);
            if (L === -1) return be.remove(D), !0;
            if (!N.elementInScope(D)) return !0;
            for (var P = null, Q, le = L + 1; le < N.elements.length; le++)
              if (Le(N.elements[le], T)) {
                (P = N.elements[le]), (Q = le);
                break;
              }
            if (P) {
              var Se = N.elements[L - 1];
              be.insertAfter(D, aa);
              for (
                var ze = P, ut = P, $t = Q, Zt, jr = 0;
                jr++, (ze = N.elements[--$t]), ze !== D;

              ) {
                if (
                  ((Zt = be.indexOf(ze)),
                  jr > 3 && Zt !== -1 && (be.remove(ze), (Zt = -1)),
                  Zt === -1)
                ) {
                  N.removeElement(ze);
                  continue;
                }
                var ar = cu(Se.ownerDocument, Zt);
                be.replace(ze, ar.elt, ar.attrs),
                  (N.elements[$t] = ar.elt),
                  (ze = ar.elt),
                  ut === P && (be.remove(aa), be.insertAfter(ar.elt, aa)),
                  ze._appendChild(ut),
                  (ut = ze);
              }
              tr && Le(Se, re)
                ? sa(function () {
                    return ut;
                  })
                : Se instanceof a.HTMLTemplateElement
                ? Se.content._appendChild(ut)
                : Se._appendChild(ut);
              for (
                var Es = cu(P.ownerDocument, be.indexOf(D));
                P.hasChildNodes();

              )
                Es.elt._appendChild(P.firstChild);
              P._appendChild(Es.elt),
                be.remove(D),
                be.replace(aa, Es.elt, Es.attrs),
                N.removeElement(D);
              var eD = N.elements.lastIndexOf(P);
              N.elements.splice(eD + 1, 0, Es.elt);
            } else return N.popElement(D), be.remove(D), !0;
          }
          return !0;
        }
        function aw() {
          N.pop(), (H = Mn);
        }
        function kr() {
          delete Ae._parser,
            (N.elements.length = 0),
            Ae.defaultView &&
              Ae.defaultView.dispatchEvent(new a.Event("load", {}));
        }
        function se(f, h) {
          (A = h), ne--;
        }
        function Te(f) {
          switch (f) {
            case 38:
              (Qn = Te), (A = ys);
              break;
            case 60:
              if (rw()) break;
              A = cw;
              break;
            case 0:
              W.push(f), (Xn = !0);
              break;
            case -1:
              ge();
              break;
            default:
              hs(Q0) || W.push(f);
              break;
          }
        }
        function nr(f) {
          switch (f) {
            case 38:
              (Qn = nr), (A = ys);
              break;
            case 60:
              A = uw;
              break;
            case 0:
              W.push(65533), (Xn = !0);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function gs(f) {
          switch (f) {
            case 60:
              A = hw;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              hs(Hp) || W.push(f);
              break;
          }
        }
        function rr(f) {
          switch (f) {
            case 60:
              A = gw;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              hs(Hp) || W.push(f);
              break;
          }
        }
        function lu(f) {
          switch (f) {
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              hs(K0) || W.push(f);
              break;
          }
        }
        function cw(f) {
          switch (f) {
            case 33:
              A = tm;
              break;
            case 47:
              A = lw;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ew(), se(f, Xp);
              break;
            case 63:
              se(f, da);
              break;
            default:
              W.push(60), se(f, Te);
              break;
          }
        }
        function lw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ds(), se(f, Xp);
              break;
            case 62:
              A = Te;
              break;
            case -1:
              W.push(60), W.push(47), ge();
              break;
            default:
              se(f, da);
              break;
          }
        }
        function Xp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = mn;
              break;
            case 47:
              A = sr;
              break;
            case 62:
              (A = Te), On();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Pe += String.fromCharCode(f + 32);
              break;
            case 0:
              Pe += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            default:
              Pe += fs(ls);
              break;
          }
        }
        function uw(f) {
          f === 47 ? (Rn(), (A = dw)) : (W.push(60), se(f, nr));
        }
        function dw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ds(), se(f, fw);
              break;
            default:
              W.push(60), W.push(47), se(f, nr);
              break;
          }
        }
        function fw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Vt(Pe)) {
                A = mn;
                return;
              }
              break;
            case 47:
              if (Vt(Pe)) {
                A = sr;
                return;
              }
              break;
            case 62:
              if (Vt(Pe)) {
                (A = Te), On();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Pe += String.fromCharCode(f + 32)), Fe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Pe += String.fromCharCode(f)), Fe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Fe), se(f, nr);
        }
        function hw(f) {
          f === 47 ? (Rn(), (A = pw)) : (W.push(60), se(f, gs));
        }
        function pw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ds(), se(f, mw);
              break;
            default:
              W.push(60), W.push(47), se(f, gs);
              break;
          }
        }
        function mw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Vt(Pe)) {
                A = mn;
                return;
              }
              break;
            case 47:
              if (Vt(Pe)) {
                A = sr;
                return;
              }
              break;
            case 62:
              if (Vt(Pe)) {
                (A = Te), On();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Pe += String.fromCharCode(f + 32)), Fe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Pe += String.fromCharCode(f)), Fe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Fe), se(f, gs);
        }
        function gw(f) {
          switch (f) {
            case 47:
              Rn(), (A = yw);
              break;
            case 33:
              (A = Ew), W.push(60), W.push(33);
              break;
            default:
              W.push(60), se(f, rr);
              break;
          }
        }
        function yw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ds(), se(f, vw);
              break;
            default:
              W.push(60), W.push(47), se(f, rr);
              break;
          }
        }
        function vw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Vt(Pe)) {
                A = mn;
                return;
              }
              break;
            case 47:
              if (Vt(Pe)) {
                A = sr;
                return;
              }
              break;
            case 62:
              if (Vt(Pe)) {
                (A = Te), On();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Pe += String.fromCharCode(f + 32)), Fe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Pe += String.fromCharCode(f)), Fe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Fe), se(f, rr);
        }
        function Ew(f) {
          f === 45 ? ((A = bw), W.push(45)) : se(f, rr);
        }
        function bw(f) {
          f === 45 ? ((A = Jp), W.push(45)) : se(f, rr);
        }
        function pn(f) {
          switch (f) {
            case 45:
              (A = ww), W.push(45);
              break;
            case 60:
              A = uu;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function ww(f) {
          switch (f) {
            case 45:
              (A = Jp), W.push(45);
              break;
            case 60:
              A = uu;
              break;
            case 0:
              (A = pn), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = pn), W.push(f);
              break;
          }
        }
        function Jp(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              A = uu;
              break;
            case 62:
              (A = rr), W.push(62);
              break;
            case 0:
              (A = pn), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = pn), W.push(f);
              break;
          }
        }
        function uu(f) {
          switch (f) {
            case 47:
              Rn(), (A = Dw);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Rn(), W.push(60), se(f, Tw);
              break;
            default:
              W.push(60), se(f, pn);
              break;
          }
        }
        function Dw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              ds(), se(f, _w);
              break;
            default:
              W.push(60), W.push(47), se(f, pn);
              break;
          }
        }
        function _w(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Vt(Pe)) {
                A = mn;
                return;
              }
              break;
            case 47:
              if (Vt(Pe)) {
                A = sr;
                return;
              }
              break;
            case 62:
              if (Vt(Pe)) {
                (A = Te), On();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Pe += String.fromCharCode(f + 32)), Fe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Pe += String.fromCharCode(f)), Fe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Fe), se(f, pn);
        }
        function Tw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              ht(Fe) === "script" ? (A = ir) : (A = pn), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Fe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Fe.push(f), W.push(f);
              break;
            default:
              se(f, pn);
              break;
          }
        }
        function ir(f) {
          switch (f) {
            case 45:
              (A = Sw), W.push(45);
              break;
            case 60:
              (A = du), W.push(60);
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function Sw(f) {
          switch (f) {
            case 45:
              (A = Cw), W.push(45);
              break;
            case 60:
              (A = du), W.push(60);
              break;
            case 0:
              (A = ir), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = ir), W.push(f);
              break;
          }
        }
        function Cw(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              (A = du), W.push(60);
              break;
            case 62:
              (A = rr), W.push(62);
              break;
            case 0:
              (A = ir), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = ir), W.push(f);
              break;
          }
        }
        function du(f) {
          f === 47 ? (Rn(), (A = Iw), W.push(47)) : se(f, ir);
        }
        function Iw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              ht(Fe) === "script" ? (A = pn) : (A = ir), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Fe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Fe.push(f), W.push(f);
              break;
            default:
              se(f, ir);
              break;
          }
        }
        function mn(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              A = sr;
              break;
            case 62:
              (A = Te), On();
              break;
            case -1:
              ge();
              break;
            case 61:
              su(), (It += String.fromCharCode(f)), (A = fu);
              break;
            default:
              if (J0()) break;
              su(), se(f, fu);
              break;
          }
        }
        function fu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              se(f, Nw);
              break;
            case 61:
              A = em;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              It += String.fromCharCode(f + 32);
              break;
            case 0:
              It += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              It += fs(G0);
              break;
          }
        }
        function Nw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              Jn(It), (A = sr);
              break;
            case 61:
              A = em;
              break;
            case 62:
              (A = Te), Jn(It), On();
              break;
            case -1:
              Jn(It), ge();
              break;
            default:
              Jn(It), su(), se(f, fu);
              break;
          }
        }
        function em(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              ou(), (A = ca);
              break;
            case 39:
              ou(), (A = la);
              break;
            case 62:
            default:
              ou(), se(f, ua);
              break;
          }
        }
        function ca(f) {
          switch (f) {
            case 34:
              Jn(It, wt), (A = hu);
              break;
            case 38:
              (Qn = ca), (A = ys);
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            case 10:
              wt += String.fromCharCode(f);
              break;
            default:
              wt += fs(In);
              break;
          }
        }
        function la(f) {
          switch (f) {
            case 39:
              Jn(It, wt), (A = hu);
              break;
            case 38:
              (Qn = la), (A = ys);
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            case 10:
              wt += String.fromCharCode(f);
              break;
            default:
              wt += fs(Et);
              break;
          }
        }
        function ua(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              Jn(It, wt), (A = mn);
              break;
            case 38:
              (Qn = ua), (A = ys);
              break;
            case 62:
              Jn(It, wt), (A = Te), On();
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              ne--, (A = Te);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              wt += fs(li);
              break;
          }
        }
        function hu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = mn;
              break;
            case 47:
              A = sr;
              break;
            case 62:
              (A = Te), On();
              break;
            case -1:
              ge();
              break;
            default:
              se(f, mn);
              break;
          }
        }
        function sr(f) {
          switch (f) {
            case 62:
              (A = Te), iw(!0);
              break;
            case -1:
              ge();
              break;
            default:
              se(f, mn);
              break;
          }
        }
        function da(f, h, D) {
          var L = h.length;
          D ? (ne += L - 1) : (ne += L);
          var P = h.substring(0, L - 1);
          (P = P.replace(/\u0000/g, "\uFFFD")),
            (P = P.replace(
              /\u000D\u000A/g,
              `
`
            )),
            (P = P.replace(
              /\u000D/g,
              `
`
            )),
            Ze(b, P),
            (A = Te);
        }
        da.lookahead = ">";
        function tm(f, h, D) {
          if (h[0] === "-" && h[1] === "-") {
            (ne += 2), Yp(), (A = Mw);
            return;
          }
          h.toUpperCase() === "DOCTYPE"
            ? ((ne += 7), (A = Pw))
            : h === "[CDATA[" && tw()
            ? ((ne += 7), (A = gu))
            : (A = da);
        }
        tm.lookahead = 7;
        function Mw(f) {
          switch ((Yp(), f)) {
            case 45:
              A = Aw;
              break;
            case 62:
              (A = Te), Ze(b, ht(Ue));
              break;
            default:
              se(f, Lr);
              break;
          }
        }
        function Aw(f) {
          switch (f) {
            case 45:
              A = fa;
              break;
            case 62:
              (A = Te), Ze(b, ht(Ue));
              break;
            case -1:
              Ze(b, ht(Ue)), ge();
              break;
            default:
              Ue.push(45), se(f, Lr);
              break;
          }
        }
        function Lr(f) {
          switch (f) {
            case 60:
              Ue.push(f), (A = xw);
              break;
            case 45:
              A = pu;
              break;
            case 0:
              Ue.push(65533);
              break;
            case -1:
              Ze(b, ht(Ue)), ge();
              break;
            default:
              Ue.push(f);
              break;
          }
        }
        function xw(f) {
          switch (f) {
            case 33:
              Ue.push(f), (A = Rw);
              break;
            case 60:
              Ue.push(f);
              break;
            default:
              se(f, Lr);
              break;
          }
        }
        function Rw(f) {
          switch (f) {
            case 45:
              A = Ow;
              break;
            default:
              se(f, Lr);
              break;
          }
        }
        function Ow(f) {
          switch (f) {
            case 45:
              A = kw;
              break;
            default:
              se(f, pu);
              break;
          }
        }
        function kw(f) {
          switch (f) {
            case 62:
            case -1:
              se(f, fa);
              break;
            default:
              se(f, fa);
              break;
          }
        }
        function pu(f) {
          switch (f) {
            case 45:
              A = fa;
              break;
            case -1:
              Ze(b, ht(Ue)), ge();
              break;
            default:
              Ue.push(45), se(f, Lr);
              break;
          }
        }
        function fa(f) {
          switch (f) {
            case 62:
              (A = Te), Ze(b, ht(Ue));
              break;
            case 33:
              A = Lw;
              break;
            case 45:
              Ue.push(45);
              break;
            case -1:
              Ze(b, ht(Ue)), ge();
              break;
            default:
              Ue.push(45), Ue.push(45), se(f, Lr);
              break;
          }
        }
        function Lw(f) {
          switch (f) {
            case 45:
              Ue.push(45), Ue.push(45), Ue.push(33), (A = pu);
              break;
            case 62:
              (A = Te), Ze(b, ht(Ue));
              break;
            case -1:
              Ze(b, ht(Ue)), ge();
              break;
            default:
              Ue.push(45), Ue.push(45), Ue.push(33), se(f, Lr);
              break;
          }
        }
        function Pw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = nm;
              break;
            case -1:
              ui(), xe(), Re(), ge();
              break;
            default:
              se(f, nm);
              break;
          }
        }
        function nm(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              ui(), Kn.push(f + 32), (A = mu);
              break;
            case 0:
              ui(), Kn.push(65533), (A = mu);
              break;
            case 62:
              ui(), xe(), (A = Te), Re();
              break;
            case -1:
              ui(), xe(), Re(), ge();
              break;
            default:
              ui(), Kn.push(f), (A = mu);
              break;
          }
        }
        function mu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = rm;
              break;
            case 62:
              (A = Te), Re();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Kn.push(f + 32);
              break;
            case 0:
              Kn.push(65533);
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              Kn.push(f);
              break;
          }
        }
        function rm(f, h, D) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              ne += 1;
              break;
            case 62:
              (A = Te), (ne += 1), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              (h = h.toUpperCase()),
                h === "PUBLIC"
                  ? ((ne += 6), (A = Fw))
                  : h === "SYSTEM"
                  ? ((ne += 6), (A = Hw))
                  : (xe(), (A = or));
              break;
          }
        }
        rm.lookahead = 6;
        function Fw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = jw;
              break;
            case 34:
              ra(), (A = im);
              break;
            case 39:
              ra(), (A = sm);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function jw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              ra(), (A = im);
              break;
            case 39:
              ra(), (A = sm);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function im(f) {
          switch (f) {
            case 34:
              A = om;
              break;
            case 0:
              Yn.push(65533);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              Yn.push(f);
              break;
          }
        }
        function sm(f) {
          switch (f) {
            case 39:
              A = om;
              break;
            case 0:
              Yn.push(65533);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              Yn.push(f);
              break;
          }
        }
        function om(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Bw;
              break;
            case 62:
              (A = Te), Re();
              break;
            case 34:
              er(), (A = ha);
              break;
            case 39:
              er(), (A = pa);
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function Bw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = Te), Re();
              break;
            case 34:
              er(), (A = ha);
              break;
            case 39:
              er(), (A = pa);
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function Hw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Uw;
              break;
            case 34:
              er(), (A = ha);
              break;
            case 39:
              er(), (A = pa);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function Uw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              er(), (A = ha);
              break;
            case 39:
              er(), (A = pa);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              xe(), (A = or);
              break;
          }
        }
        function ha(f) {
          switch (f) {
            case 34:
              A = am;
              break;
            case 0:
              Zn.push(65533);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              Zn.push(f);
              break;
          }
        }
        function pa(f) {
          switch (f) {
            case 39:
              A = am;
              break;
            case 0:
              Zn.push(65533);
              break;
            case 62:
              xe(), (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              Zn.push(f);
              break;
          }
        }
        function am(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = Te), Re();
              break;
            case -1:
              xe(), Re(), ge();
              break;
            default:
              A = or;
              break;
          }
        }
        function or(f) {
          switch (f) {
            case 62:
              (A = Te), Re();
              break;
            case -1:
              Re(), ge();
              break;
            default:
              break;
          }
        }
        function gu(f) {
          switch (f) {
            case 93:
              A = Vw;
              break;
            case -1:
              ge();
              break;
            case 0:
              Xn = !0;
            default:
              hs(W0) || W.push(f);
              break;
          }
        }
        function Vw(f) {
          switch (f) {
            case 93:
              A = qw;
              break;
            default:
              W.push(93), se(f, gu);
              break;
          }
        }
        function qw(f) {
          switch (f) {
            case 93:
              W.push(93);
              break;
            case 62:
              di(), (A = Te);
              break;
            default:
              W.push(93), W.push(93), se(f, gu);
              break;
          }
        }
        function ys(f) {
          switch ((Rn(), Fe.push(38), f)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              se(f, Pr);
              break;
            case 35:
              Fe.push(f), (A = $w);
              break;
            default:
              se(f, cm);
              break;
          }
        }
        function cm(f) {
          gt.lastIndex = ne;
          var h = gt.exec(ee);
          if (!h) throw new Error("should never happen");
          var D = h[1];
          if (!D) {
            A = Pr;
            return;
          }
          switch (((ne += D.length), c(Fe, Z0(D)), Qn)) {
            case ca:
            case la:
            case ua:
              if (D[D.length - 1] !== ";" && /[=A-Za-z0-9]/.test(ee[ne])) {
                A = Pr;
                return;
              }
              break;
            default:
              break;
          }
          Rn();
          var L = _e[D];
          typeof L == "number" ? Fe.push(L) : c(Fe, L), (A = Pr);
        }
        cm.lookahead = -ot;
        function $w(f) {
          switch (((Qe = 0), f)) {
            case 120:
            case 88:
              Fe.push(f), (A = zw);
              break;
            default:
              se(f, Gw);
              break;
          }
        }
        function zw(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              se(f, Ww);
              break;
            default:
              se(f, Pr);
              break;
          }
        }
        function Gw(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              se(f, Qw);
              break;
            default:
              se(f, Pr);
              break;
          }
        }
        function Ww(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (Qe *= 16), (Qe += f - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (Qe *= 16), (Qe += f - 87);
              break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Qe *= 16), (Qe += f - 48);
              break;
            case 59:
              A = ma;
              break;
            default:
              se(f, ma);
              break;
          }
        }
        function Qw(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Qe *= 10), (Qe += f - 48);
              break;
            case 59:
              A = ma;
              break;
            default:
              se(f, ma);
              break;
          }
        }
        function ma(f) {
          Qe in $
            ? (Qe = $[Qe])
            : (Qe > 1114111 || (Qe >= 55296 && Qe < 57344)) && (Qe = 65533),
            Rn(),
            Qe <= 65535
              ? Fe.push(Qe)
              : ((Qe = Qe - 65536),
                Fe.push(55296 + (Qe >> 10)),
                Fe.push(56320 + (Qe & 1023))),
            se(f, Pr);
        }
        function Pr(f) {
          switch (Qn) {
            case ca:
            case la:
            case ua:
              wt += ht(Fe);
              break;
            default:
              c(W, Fe);
              break;
          }
          se(f, Qn);
        }
        function Kw(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(Nr, "")), h.length === 0)) return;
              break;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              var P = h,
                Q = D,
                le = L;
              Ae.appendChild(new r(Ae, P, Q, le)),
                ru ||
                P.toLowerCase() !== "html" ||
                F.test(Q) ||
                (le && le.toLowerCase() === R) ||
                (le === void 0 && _.test(Q))
                  ? (Ae._quirks = !0)
                  : (w.test(Q) || (le !== void 0 && _.test(Q))) &&
                    (Ae._limitedQuirks = !0),
                (H = lm);
              return;
          }
          (Ae._quirks = !0), (H = lm), H(f, h, D, L);
        }
        function lm(f, h, D, L) {
          var P;
          switch (f) {
            case 1:
              if (((h = h.replace(Nr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 2:
              if (h === "html") {
                (P = ps(Ae, h, D)), N.push(P), Ae.appendChild(P), (H = ga);
                return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (P = ps(Ae, "html", null)),
            N.push(P),
            Ae.appendChild(P),
            (H = ga),
            H(f, h, D, L);
        }
        function ga(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(Nr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              fn(h);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "head":
                  var P = fe(h, D);
                  (Jo = P), (H = Ye);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          ga(d, "head", null), H(f, h, D, L);
        }
        function Ye(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(Nr);
              if (
                (P && (hn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  fe(h, D), N.pop();
                  return;
                case "title":
                  sw(h, D);
                  return;
                case "noscript":
                  if (!ea) {
                    fe(h, D), (H = um);
                    return;
                  }
                case "noframes":
                case "style":
                  oa(h, D);
                  return;
                case "script":
                  ia(function (Q) {
                    var le = ps(Q, h, D);
                    return (
                      (le._parser_inserted = !0),
                      (le._force_async = !1),
                      Rr && (le._already_started = !0),
                      di(),
                      le
                    );
                  }),
                    (A = rr),
                    (Mn = H),
                    (H = ya);
                  return;
                case "template":
                  fe(h, D), be.insertMarker(), (Ke = !1), (H = Eu), An.push(H);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "head":
                  N.pop(), (H = yu);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!N.contains("template")) return;
                  N.generateImpliedEndTags(null, "thorough"),
                    N.popTag("template"),
                    be.clearToMarker(),
                    An.pop(),
                    ms();
                  return;
                default:
                  return;
              }
              break;
          }
          Ye(g, "head", null), H(f, h, D, L);
        }
        function um(f, h, D, L) {
          switch (f) {
            case 5:
              return;
            case 4:
              Ye(f, h);
              return;
            case 1:
              var P = h.match(Nr);
              if (
                (P && (Ye(f, P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  Ye(f, h, D);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "noscript":
                  N.pop(), (H = Ye);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          um(g, "noscript", null), H(f, h, D, L);
        }
        function yu(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(Nr);
              if (
                (P && (hn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "body":
                  fe(h, D), (Ke = !1), (H = ce);
                  return;
                case "frameset":
                  fe(h, D), (H = bu);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  N.push(Jo), Ye(d, h, D), N.removeElement(Jo);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "template":
                  return Ye(f, h, D, L);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          yu(d, "body", null), (Ke = !0), H(f, h, D, L);
        }
        function ce(f, h, D, L) {
          var P, Q, le, Se;
          switch (f) {
            case 1:
              if (Xn && ((h = h.replace(Ko, "")), h.length === 0)) return;
              Ke && Qo.test(h) && (Ke = !1), yt(), hn(h);
              return;
            case 5:
              return;
            case 4:
              fn(h);
              return;
            case -1:
              if (An.length) return Eu(f);
              kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  if (N.contains("template")) return;
                  Wp(D, N.elements[0]);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  Ye(d, h, D);
                  return;
                case "body":
                  if (
                    ((P = N.elements[1]),
                    !P ||
                      !(P instanceof a.HTMLBodyElement) ||
                      N.contains("template"))
                  )
                    return;
                  (Ke = !1), Wp(D, P);
                  return;
                case "frameset":
                  if (
                    !Ke ||
                    ((P = N.elements[1]),
                    !P || !(P instanceof a.HTMLBodyElement))
                  )
                    return;
                  for (
                    P.parentNode && P.parentNode.removeChild(P);
                    !(N.top instanceof a.HTMLHtmlElement);

                  )
                    N.pop();
                  fe(h, D), (H = bu);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "main":
                case "nav":
                case "ol":
                case "p":
                case "section":
                case "summary":
                case "ul":
                  N.inButtonScope("p") && ce(g, "p"), fe(h, D);
                  return;
                case "menu":
                  N.inButtonScope("p") && ce(g, "p"),
                    Le(N.top, "menuitem") && N.pop(),
                    fe(h, D);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  N.inButtonScope("p") && ce(g, "p"),
                    N.top instanceof a.HTMLHeadingElement && N.pop(),
                    fe(h, D);
                  return;
                case "pre":
                case "listing":
                  N.inButtonScope("p") && ce(g, "p"),
                    fe(h, D),
                    (Or = !0),
                    (Ke = !1);
                  return;
                case "form":
                  if (xn && !N.contains("template")) return;
                  N.inButtonScope("p") && ce(g, "p"),
                    (Se = fe(h, D)),
                    N.contains("template") || (xn = Se);
                  return;
                case "li":
                  for (Ke = !1, Q = N.elements.length - 1; Q >= 0; Q--) {
                    if (((le = N.elements[Q]), le instanceof a.HTMLLIElement)) {
                      ce(g, "li");
                      break;
                    }
                    if (Le(le, T) && !Le(le, E)) break;
                  }
                  N.inButtonScope("p") && ce(g, "p"), fe(h, D);
                  return;
                case "dd":
                case "dt":
                  for (Ke = !1, Q = N.elements.length - 1; Q >= 0; Q--) {
                    if (((le = N.elements[Q]), Le(le, te))) {
                      ce(g, le.localName);
                      break;
                    }
                    if (Le(le, T) && !Le(le, E)) break;
                  }
                  N.inButtonScope("p") && ce(g, "p"), fe(h, D);
                  return;
                case "plaintext":
                  N.inButtonScope("p") && ce(g, "p"), fe(h, D), (A = lu);
                  return;
                case "button":
                  N.inScope("button")
                    ? (ce(g, "button"), H(f, h, D, L))
                    : (yt(), fe(h, D), (Ke = !1));
                  return;
                case "a":
                  var ze = be.findElementByTag("a");
                  ze && (ce(g, h), be.remove(ze), N.removeElement(ze));
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  yt(), be.push(fe(h, D), D);
                  return;
                case "nobr":
                  yt(), N.inScope(h) && (ce(g, h), yt()), be.push(fe(h, D), D);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  yt(), fe(h, D), be.insertMarker(), (Ke = !1);
                  return;
                case "table":
                  !Ae._quirks && N.inButtonScope("p") && ce(g, "p"),
                    fe(h, D),
                    (Ke = !1),
                    (H = qt);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  yt(), fe(h, D), N.pop(), (Ke = !1);
                  return;
                case "input":
                  yt(), (Se = fe(h, D)), N.pop();
                  var ut = Se.getAttribute("type");
                  (!ut || ut.toLowerCase() !== "hidden") && (Ke = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  fe(h, D), N.pop();
                  return;
                case "hr":
                  N.inButtonScope("p") && ce(g, "p"),
                    Le(N.top, "menuitem") && N.pop(),
                    fe(h, D),
                    N.pop(),
                    (Ke = !1);
                  return;
                case "image":
                  ce(d, "img", D, L);
                  return;
                case "textarea":
                  fe(h, D), (Or = !0), (Ke = !1), (A = nr), (Mn = H), (H = ya);
                  return;
                case "xmp":
                  N.inButtonScope("p") && ce(g, "p"), yt(), (Ke = !1), oa(h, D);
                  return;
                case "iframe":
                  (Ke = !1), oa(h, D);
                  return;
                case "noembed":
                  oa(h, D);
                  return;
                case "select":
                  yt(),
                    fe(h, D),
                    (Ke = !1),
                    H === qt || H === vu || H === Fr || H === vs || H === fi
                      ? (H = Ea)
                      : (H = kn);
                  return;
                case "optgroup":
                case "option":
                  N.top instanceof a.HTMLOptionElement && ce(g, "option"),
                    yt(),
                    fe(h, D);
                  return;
                case "menuitem":
                  Le(N.top, "menuitem") && N.pop(), yt(), fe(h, D);
                  return;
                case "rb":
                case "rtc":
                  N.inScope("ruby") && N.generateImpliedEndTags(), fe(h, D);
                  return;
                case "rp":
                case "rt":
                  N.inScope("ruby") && N.generateImpliedEndTags("rtc"),
                    fe(h, D);
                  return;
                case "math":
                  yt(), Gp(D), nu(D), au(h, D, s.MATHML), L && N.pop();
                  return;
                case "svg":
                  yt(), zp(D), nu(D), au(h, D, s.SVG), L && N.pop();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "frame":
                case "head":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              yt(), fe(h, D);
              return;
            case 3:
              switch (h) {
                case "template":
                  Ye(g, h, D);
                  return;
                case "body":
                  if (!N.inScope("body")) return;
                  H = dm;
                  return;
                case "html":
                  if (!N.inScope("body")) return;
                  (H = dm), H(f, h, D);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "button":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "listing":
                case "main":
                case "menu":
                case "nav":
                case "ol":
                case "pre":
                case "section":
                case "summary":
                case "ul":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h);
                  return;
                case "form":
                  if (N.contains("template")) {
                    if (!N.inScope("form")) return;
                    N.generateImpliedEndTags(), N.popTag("form");
                  } else {
                    var $t = xn;
                    if (((xn = null), !$t || !N.elementInScope($t))) return;
                    N.generateImpliedEndTags(), N.removeElement($t);
                  }
                  return;
                case "p":
                  N.inButtonScope(h)
                    ? (N.generateImpliedEndTags(h), N.popTag(h))
                    : (ce(d, h, null), H(f, h, D, L));
                  return;
                case "li":
                  if (!N.inListItemScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "dd":
                case "dt":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!N.elementTypeInScope(a.HTMLHeadingElement)) return;
                  N.generateImpliedEndTags(),
                    N.popElementType(a.HTMLHeadingElement);
                  return;
                case "sarcasm":
                  break;
                case "a":
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "nobr":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  var Zt = ow(h);
                  if (Zt) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h), be.clearToMarker();
                  return;
                case "br":
                  ce(d, h, null);
                  return;
              }
              for (Q = N.elements.length - 1; Q >= 0; Q--)
                if (((le = N.elements[Q]), Le(le, h))) {
                  N.generateImpliedEndTags(h), N.popElement(le);
                  break;
                } else if (Le(le, T)) return;
              return;
          }
        }
        function ya(f, h, D, L) {
          switch (f) {
            case 1:
              hn(h);
              return;
            case -1:
              N.top instanceof a.HTMLScriptElement &&
                (N.top._already_started = !0),
                N.pop(),
                (H = Mn),
                H(f);
              return;
            case 3:
              h === "script" ? aw() : (N.pop(), (H = Mn));
              return;
            default:
              return;
          }
        }
        function qt(f, h, D, L) {
          function P(le) {
            for (var Se = 0, ze = le.length; Se < ze; Se++)
              if (le[Se][0] === "type") return le[Se][1].toLowerCase();
            return null;
          }
          switch (f) {
            case 1:
              if (iu) {
                ce(f, h, D, L);
                return;
              } else if (Le(N.top, re)) {
                (ta = []), (Mn = H), (H = Yw), H(f, h, D, L);
                return;
              }
              break;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "caption":
                  N.clearToContext(O), be.insertMarker(), fe(h, D), (H = vu);
                  return;
                case "colgroup":
                  N.clearToContext(O), fe(h, D), (H = va);
                  return;
                case "col":
                  qt(d, "colgroup", null), H(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.clearToContext(O), fe(h, D), (H = Fr);
                  return;
                case "td":
                case "th":
                case "tr":
                  qt(d, "tbody", null), H(f, h, D, L);
                  return;
                case "table":
                  if (!N.inTableScope(h)) return;
                  qt(g, h), H(f, h, D, L);
                  return;
                case "style":
                case "script":
                case "template":
                  Ye(f, h, D, L);
                  return;
                case "input":
                  var Q = P(D);
                  if (Q !== "hidden") break;
                  fe(h, D), N.pop();
                  return;
                case "form":
                  if (xn || N.contains("template")) return;
                  (xn = fe(h, D)), N.popElement(xn);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  if (!N.inTableScope(h)) return;
                  N.popTag(h), ms();
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
                case "template":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          (tr = !0), ce(f, h, D, L), (tr = !1);
        }
        function Yw(f, h, D, L) {
          if (f === u) {
            if (Xn && ((h = h.replace(Ko, "")), h.length === 0)) return;
            ta.push(h);
          } else {
            var P = ta.join("");
            (ta.length = 0),
              Qo.test(P) ? ((tr = !0), ce(u, P), (tr = !1)) : hn(P),
              (H = Mn),
              H(f, h, D, L);
          }
        }
        function vu(f, h, D, L) {
          function P() {
            return N.inTableScope("caption")
              ? (N.generateImpliedEndTags(),
                N.popTag("caption"),
                be.clearToMarker(),
                (H = qt),
                !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  P() && H(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "caption":
                  P();
                  return;
                case "table":
                  P() && H(f, h, D, L);
                  return;
                case "body":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              break;
          }
          ce(f, h, D, L);
        }
        function va(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(Nr);
              if (
                (P && (hn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "col":
                  fe(h, D), N.pop();
                  return;
                case "template":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "colgroup":
                  if (!Le(N.top, "colgroup")) return;
                  N.pop(), (H = qt);
                  return;
                case "col":
                  return;
                case "template":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          Le(N.top, "colgroup") && (va(g, "colgroup"), H(f, h, D, L));
        }
        function Fr(f, h, D, L) {
          function P() {
            (!N.inTableScope("tbody") &&
              !N.inTableScope("thead") &&
              !N.inTableScope("tfoot")) ||
              (N.clearToContext(j),
              Fr(g, N.top.localName, null),
              H(f, h, D, L));
          }
          switch (f) {
            case 2:
              switch (h) {
                case "tr":
                  N.clearToContext(j), fe(h, D), (H = vs);
                  return;
                case "th":
                case "td":
                  Fr(d, "tr", null), H(f, h, D, L);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P();
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  P();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && (N.clearToContext(j), N.pop(), (H = qt));
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                case "tr":
                  return;
              }
              break;
          }
          qt(f, h, D, L);
        }
        function vs(f, h, D, L) {
          function P() {
            return N.inTableScope("tr")
              ? (N.clearToContext(Y), N.pop(), (H = Fr), !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "th":
                case "td":
                  N.clearToContext(Y), fe(h, D), (H = fi), be.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  P() && H(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "tr":
                  P();
                  return;
                case "table":
                  P() && H(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && P() && H(f, h, D, L);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                  return;
              }
              break;
          }
          qt(f, h, D, L);
        }
        function fi(f, h, D, L) {
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  N.inTableScope("td")
                    ? (fi(g, "td"), H(f, h, D, L))
                    : N.inTableScope("th") && (fi(g, "th"), H(f, h, D, L));
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "td":
                case "th":
                  if (!N.inTableScope(h)) return;
                  N.generateImpliedEndTags(),
                    N.popTag(h),
                    be.clearToMarker(),
                    (H = vs);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                  return;
                case "table":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  if (!N.inTableScope(h)) return;
                  fi(g, N.inTableScope("td") ? "td" : "th"), H(f, h, D, L);
                  return;
              }
              break;
          }
          ce(f, h, D, L);
        }
        function kn(f, h, D, L) {
          switch (f) {
            case 1:
              if (Xn && ((h = h.replace(Ko, "")), h.length === 0)) return;
              hn(h);
              return;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case -1:
              ce(f, h, D, L);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && kn(g, h), fe(h, D);
                  return;
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement && kn(g, "option"),
                    N.top instanceof a.HTMLOptGroupElement && kn(g, h),
                    fe(h, D);
                  return;
                case "select":
                  kn(g, h);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!N.inSelectScope("select")) return;
                  kn(g, "select"), H(f, h, D, L);
                  return;
                case "script":
                case "template":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement &&
                    N.elements[N.elements.length - 2] instanceof
                      a.HTMLOptGroupElement &&
                    kn(g, "option"),
                    N.top instanceof a.HTMLOptGroupElement && N.pop();
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && N.pop();
                  return;
                case "select":
                  if (!N.inSelectScope(h)) return;
                  N.popTag(h), ms();
                  return;
                case "template":
                  Ye(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function Ea(f, h, D, L) {
          switch (h) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (f) {
                case 2:
                  Ea(g, "select"), H(f, h, D, L);
                  return;
                case 3:
                  N.inTableScope(h) && (Ea(g, "select"), H(f, h, D, L));
                  return;
              }
          }
          kn(f, h, D, L);
        }
        function Eu(f, h, D, L) {
          function P(Q) {
            (H = Q), (An[An.length - 1] = H), H(f, h, D, L);
          }
          switch (f) {
            case 1:
            case 4:
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              N.contains("template")
                ? (N.popTag("template"),
                  be.clearToMarker(),
                  An.pop(),
                  ms(),
                  H(f, h, D, L))
                : kr();
              return;
            case 2:
              switch (h) {
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  Ye(f, h, D, L);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P(qt);
                  return;
                case "col":
                  P(va);
                  return;
                case "tr":
                  P(Fr);
                  return;
                case "td":
                case "th":
                  P(vs);
                  return;
              }
              P(ce);
              return;
            case 3:
              switch (h) {
                case "template":
                  Ye(f, h, D, L);
                  return;
                default:
                  return;
              }
          }
        }
        function dm(f, h, D, L) {
          switch (f) {
            case 1:
              if (Qo.test(h)) break;
              ce(f, h);
              return;
            case 4:
              N.elements[0]._appendChild(Ae.createComment(h));
              return;
            case 5:
              return;
            case -1:
              kr();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
            case 3:
              if (h === "html") {
                if (Rr) return;
                H = Xw;
                return;
              }
              break;
          }
          (H = ce), H(f, h, D, L);
        }
        function bu(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(tu, "")), h.length > 0 && hn(h);
              return;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case -1:
              kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "frameset":
                  fe(h, D);
                  return;
                case "frame":
                  fe(h, D), N.pop();
                  return;
                case "noframes":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "frameset") {
                if (Rr && N.top instanceof a.HTMLHtmlElement) return;
                N.pop(),
                  !Rr && !(N.top instanceof a.HTMLFrameSetElement) && (H = Zw);
                return;
              }
              break;
          }
        }
        function Zw(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(tu, "")), h.length > 0 && hn(h);
              return;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case -1:
              kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  Ye(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "html") {
                H = Jw;
                return;
              }
              break;
          }
        }
        function Xw(f, h, D, L) {
          switch (f) {
            case 1:
              if (Qo.test(h)) break;
              ce(f, h, D, L);
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              kr();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
          }
          (H = ce), H(f, h, D, L);
        }
        function Jw(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(tu, "")), h.length > 0 && ce(f, h, D, L);
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  Ye(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function fm(f, h, D, L) {
          function P(ze) {
            for (var ut = 0, $t = ze.length; ut < $t; ut++)
              switch (ze[ut][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var Q;
          switch (f) {
            case 1:
              Ke && Y0.test(h) && (Ke = !1),
                Xn && (h = h.replace(Ko, "\uFFFD")),
                hn(h);
              return;
            case 4:
              fn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "font":
                  if (!P(D)) break;
                case "b":
                case "big":
                case "blockquote":
                case "body":
                case "br":
                case "center":
                case "code":
                case "dd":
                case "div":
                case "dl":
                case "dt":
                case "em":
                case "embed":
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                case "head":
                case "hr":
                case "i":
                case "img":
                case "li":
                case "listing":
                case "menu":
                case "meta":
                case "nobr":
                case "ol":
                case "p":
                case "pre":
                case "ruby":
                case "s":
                case "small":
                case "span":
                case "strong":
                case "strike":
                case "sub":
                case "sup":
                case "table":
                case "tt":
                case "u":
                case "ul":
                case "var":
                  if (Rr) break;
                  do N.pop(), (Q = N.top);
                  while (Q.namespaceURI !== s.HTML && !qp(Q) && !$p(Q));
                  Ze(f, h, D, L);
                  return;
              }
              (Q = N.elements.length === 1 && Rr ? U : N.top),
                Q.namespaceURI === s.MATHML
                  ? Gp(D)
                  : Q.namespaceURI === s.SVG && ((h = X0(h)), zp(D)),
                nu(D),
                au(h, D, Q.namespaceURI),
                L && (h === "script" && (Q.namespaceURI, s.SVG), N.pop());
              return;
            case 3:
              if (
                ((Q = N.top),
                h === "script" &&
                  Q.namespaceURI === s.SVG &&
                  Q.localName === "script")
              )
                N.pop();
              else
                for (var le = N.elements.length - 1, Se = N.elements[le]; ; ) {
                  if (Se.localName.toLowerCase() === h) {
                    N.popElement(Se);
                    break;
                  }
                  if (((Se = N.elements[--le]), Se.namespaceURI === s.HTML)) {
                    H(f, h, D, L);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (na.testTokenizer = function (f, h, D, L) {
            var P = [];
            switch (h) {
              case "PCDATA state":
                A = Te;
                break;
              case "RCDATA state":
                A = nr;
                break;
              case "RAWTEXT state":
                A = gs;
                break;
              case "PLAINTEXT state":
                A = lu;
                break;
            }
            if (
              (D && (Zo = D),
              (Ze = function (le, Se, ze, ut) {
                switch ((di(), le)) {
                  case 1:
                    P.length > 0 && P[P.length - 1][0] === "Character"
                      ? (P[P.length - 1][1] += Se)
                      : P.push(["Character", Se]);
                    break;
                  case 4:
                    P.push(["Comment", Se]);
                    break;
                  case 5:
                    P.push([
                      "DOCTYPE",
                      Se,
                      ze === void 0 ? null : ze,
                      ut === void 0 ? null : ut,
                      !ru,
                    ]);
                    break;
                  case 2:
                    for (
                      var $t = Object.create(null), Zt = 0;
                      Zt < ze.length;
                      Zt++
                    ) {
                      var jr = ze[Zt];
                      jr.length === 1 ? ($t[jr[0]] = "") : ($t[jr[0]] = jr[1]);
                    }
                    var ar = ["StartTag", Se, $t];
                    ut && ar.push(!0), P.push(ar);
                    break;
                  case 3:
                    P.push(["EndTag", Se]);
                    break;
                  case -1:
                    break;
                }
              }),
              !L)
            )
              this.parse(f, !0);
            else {
              for (var Q = 0; Q < f.length; Q++) this.parse(f[Q]);
              this.parse("", !0);
            }
            return P;
          }),
          na
        );
      }
    },
  }),
  kl = ae({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = Jh(),
        r = ep(),
        i = tp(),
        s = Je(),
        o = Wh();
      function a(l) {
        this.contextObject = l;
      }
      var c = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      a.prototype = {
        hasFeature: function (u, d) {
          var g = c[(u || "").toLowerCase()];
          return (g && g[d || ""]) || !1;
        },
        createDocumentType: function (u, d, g) {
          return (
            o.isValidQName(u) || s.InvalidCharacterError(),
            new r(this.contextObject, u, d, g)
          );
        },
        createDocument: function (u, d, g) {
          var b = new n(!1, null),
            I;
          return (
            d ? (I = b.createElementNS(u, d)) : (I = null),
            g && b.appendChild(g),
            I && b.appendChild(I),
            u === s.NAMESPACE.HTML
              ? (b._contentType = "application/xhtml+xml")
              : u === s.NAMESPACE.SVG
              ? (b._contentType = "image/svg+xml")
              : (b._contentType = "application/xml"),
            b
          );
        },
        createHTMLDocument: function (u) {
          var d = new n(!0, null);
          d.appendChild(new r(d, "html"));
          var g = d.createElement("html");
          d.appendChild(g);
          var b = d.createElement("head");
          if ((g.appendChild(b), u !== void 0)) {
            var I = d.createElement("title");
            b.appendChild(I), I.appendChild(d.createTextNode(u));
          }
          return g.appendChild(d.createElement("body")), (d.modclock = 1), d;
        },
        mozSetOutputMutationHandler: function (l, u) {
          l.mutationHandler = u;
        },
        mozGetInputMutationHandler: function (l) {
          s.nyi();
        },
        mozHTMLParser: i,
      };
    },
  }),
  hA = ae({
    "external/npm/node_modules/domino/lib/Location.js"(t, e) {
      "use strict";
      var n = Yh(),
        r = Wb();
      e.exports = i;
      function i(s, o) {
        (this._window = s), (this._href = o);
      }
      i.prototype = Object.create(r.prototype, {
        constructor: { value: i },
        href: {
          get: function () {
            return this._href;
          },
          set: function (s) {
            this.assign(s);
          },
        },
        assign: {
          value: function (s) {
            var o = new n(this._href),
              a = o.resolve(s);
            this._href = a;
          },
        },
        replace: {
          value: function (s) {
            this.assign(s);
          },
        },
        reload: {
          value: function () {
            this.assign(this.href);
          },
        },
        toString: {
          value: function () {
            return this.href;
          },
        },
      });
    },
  }),
  pA = ae({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
        appCodeName: { value: "Mozilla" },
        appName: { value: "Netscape" },
        appVersion: { value: "4.0" },
        platform: { value: "" },
        product: { value: "Gecko" },
        productSub: { value: "20100101" },
        userAgent: { value: "" },
        vendor: { value: "" },
        vendorSub: { value: "" },
        taintEnabled: {
          value: function () {
            return !1;
          },
        },
      });
      e.exports = n;
    },
  }),
  mA = ae({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(t, e) {
      "use strict";
      var n = { setTimeout, clearTimeout, setInterval, clearInterval };
      e.exports = n;
    },
  }),
  Yb = ae({
    "external/npm/node_modules/domino/lib/impl.js"(t, e) {
      "use strict";
      var n = Je();
      (t = e.exports =
        {
          CSSStyleDeclaration: Zh(),
          CharacterData: Rl(),
          Comment: Vb(),
          DOMException: $h(),
          DOMImplementation: kl(),
          DOMTokenList: Fb(),
          Document: Jh(),
          DocumentFragment: qb(),
          DocumentType: ep(),
          Element: Co(),
          HTMLParser: tp(),
          NamedNodeMap: Bb(),
          Node: mt(),
          NodeList: Xi(),
          NodeFilter: Ol(),
          ProcessingInstruction: $b(),
          Text: Ub(),
          Window: Zb(),
        }),
        n.merge(t, Gb()),
        n.merge(t, Xh().elements),
        n.merge(t, Kb().elements);
    },
  }),
  Zb = ae({
    "external/npm/node_modules/domino/lib/Window.js"(t, e) {
      "use strict";
      var n = kl(),
        r = Ob(),
        i = hA(),
        s = Je();
      e.exports = o;
      function o(a) {
        (this.document = a || new n(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new i(
            this,
            this.document._address || "about:blank"
          ));
      }
      (o.prototype = Object.create(r.prototype, {
        console: { value: console },
        history: { value: { back: s.nyi, forward: s.nyi, go: s.nyi } },
        navigator: { value: pA() },
        window: {
          get: function () {
            return this;
          },
        },
        self: {
          get: function () {
            return this;
          },
        },
        frames: {
          get: function () {
            return this;
          },
        },
        parent: {
          get: function () {
            return this;
          },
        },
        top: {
          get: function () {
            return this;
          },
        },
        length: { value: 0 },
        frameElement: { value: null },
        opener: { value: null },
        onload: {
          get: function () {
            return this._getEventHandler("load");
          },
          set: function (a) {
            this._setEventHandler("load", a);
          },
        },
        getComputedStyle: {
          value: function (c) {
            return c.style;
          },
        },
      })),
        s.expose(mA(), o),
        s.expose(Yb(), o);
    },
  }),
  gA = ae({
    "external/npm/node_modules/domino/lib/index.js"(t) {
      var e = kl(),
        n = tp(),
        r = Zb(),
        i = Yb();
      (t.createDOMImplementation = function () {
        return new e(null);
      }),
        (t.createDocument = function (s, o) {
          if (s || o) {
            var a = new n();
            return a.parse(s || "", !0), a.document();
          }
          return new e(null).createHTMLDocument("");
        }),
        (t.createIncrementalHTMLParser = function () {
          var s = new n();
          return {
            write: function (o) {
              o.length > 0 &&
                s.parse(o, !1, function () {
                  return !0;
                });
            },
            end: function (o) {
              s.parse(o || "", !0, function () {
                return !0;
              });
            },
            process: function (o) {
              return s.parse("", !1, o);
            },
            document: function () {
              return s.document();
            },
          };
        }),
        (t.createWindow = function (s, o) {
          var a = t.createDocument(s);
          return o !== void 0 && (a._address = o), new i.Window(a);
        }),
        (t.impl = i);
    },
  }),
  xl = gA();
function yA() {
  Object.assign(globalThis, xl.impl),
    (globalThis.KeyboardEvent = xl.impl.Event);
}
function Xb(t, e = "/") {
  return xl.createWindow(t, e).document;
}
function vA(t) {
  return t.serialize();
}
var qh = class t extends ll {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !1);
    }
    static makeCurrent() {
      yA(), Jc(new t());
    }
    createHtmlDocument() {
      return Xb(
        "<html><head><title>fakeTitle</title></head><body></body></html>"
      );
    }
    getDefaultDocument() {
      return t.defaultDoc || (t.defaultDoc = xl.createDocument()), t.defaultDoc;
    }
    isElementNode(e) {
      return e ? e.nodeType === t.defaultDoc.ELEMENT_NODE : !1;
    }
    isShadowRoot(e) {
      return e.shadowRoot == e;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? e.defaultView
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      return (
        e.documentElement.querySelector("base")?.getAttribute("href") || ""
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
      let i = (e.ownerDocument || e).defaultView;
      i && i.dispatchEvent(n);
    }
    getUserAgent() {
      return "Fake user agent";
    }
    getCookie(e) {
      throw new Error("getCookie has not been implemented");
    }
  },
  Jb = (() => {
    let e = class e {
      constructor(r) {
        this._doc = r;
      }
      renderToString() {
        return vA(this._doc);
      }
      getDocument() {
        return this._doc;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  EA = (() => {
    let e = class e {
      ɵloadImpl() {
        return Ln(this, null, function* () {
          if (!this.xhrImpl) {
            let { default: r } = yield import("./chunk-O73ZHKXN.mjs");
            this.xhrImpl = r;
          }
        });
      }
      build() {
        let r = this.xhrImpl;
        if (!r)
          throw new Error(
            "Unexpected state in ServerXhr: XHR implementation is not loaded."
          );
        return new r.XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function bA(t, e) {
  let n = q($i),
    { href: r, protocol: i, hostname: s, port: o } = n;
  if (!i.startsWith("http")) return e(t);
  let a = `${i}//${s}`;
  o && (a += `:${o}`);
  let c = n.getBaseHrefFromDOM() || r,
    l = new URL(c, a),
    u = new URL(t.url, l).toString();
  return e(t.clone({ url: u }));
}
var wA = [
    { provide: Er, useClass: EA },
    { provide: cl, useValue: bA, multi: !0 },
  ],
  Ll = new ie("Server.INITIAL_CONFIG"),
  e0 = new ie("Server.RENDER_MODULE_HOOK"),
  Al = "resolve:";
function Vh(t) {
  let {
    hostname: e,
    protocol: n,
    port: r,
    pathname: i,
    search: s,
    hash: o,
  } = new URL(t, Al + "//");
  return (
    n !== Al &&
      r === "" &&
      /\:(80|443)/.test(t) &&
      (r = n === "http:" ? "80" : "443"),
    n === Al && t.charAt(0) !== "/" && (i = i.slice(1)),
    {
      hostname: e,
      protocol: n === Al ? "" : n,
      port: r,
      pathname: i,
      search: s,
      hash: o,
    }
  );
}
var DA = (() => {
    let e = class e {
      constructor(r, i) {
        (this._doc = r),
          (this.href = "/"),
          (this.hostname = "/"),
          (this.protocol = "/"),
          (this.port = "/"),
          (this.pathname = "/"),
          (this.search = ""),
          (this.hash = ""),
          (this._hashUpdate = new dt());
        let s = i;
        if (s) {
          if (s.url) {
            let o = Vh(s.url);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port),
              (this.pathname = o.pathname),
              (this.search = o.search),
              (this.hash = o.hash),
              (this.href = r.location.href);
          }
          if (s.useAbsoluteUrl) {
            if (!s.baseUrl)
              throw new Error(
                '"PlatformConfig.baseUrl" must be set if "useAbsoluteUrl" is true'
              );
            let o = Vh(s.baseUrl);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port);
          }
        }
      }
      getBaseHrefFromDOM() {
        return un().getBaseHref(this._doc);
      }
      onPopState(r) {
        return () => {};
      }
      onHashChange(r) {
        let i = this._hashUpdate.subscribe(r);
        return () => i.unsubscribe();
      }
      get url() {
        return `${this.pathname}${this.search}${this.hash}`;
      }
      setHash(r, i) {
        if (this.hash === r) return;
        this.hash = r;
        let s = this.url;
        queueMicrotask(() =>
          this._hashUpdate.next({
            type: "hashchange",
            state: null,
            oldUrl: i,
            newUrl: s,
          })
        );
      }
      replaceState(r, i, s) {
        let o = this.url,
          a = Vh(s);
        (this.pathname = a.pathname),
          (this.search = a.search),
          this.setHash(a.hash, o);
      }
      pushState(r, i, s) {
        this.replaceState(r, i, s);
      }
      forward() {
        throw new Error("Not implemented");
      }
      back() {
        throw new Error("Not implemented");
      }
      getState() {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e), X(Ll, 8));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _A = (() => {
    let e = class e extends Qi {
      constructor(r) {
        super(r), (this.doc = r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return un().onAndCancel(r, i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X($e));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  TA = [{ provide: e0, useFactory: SA, deps: [$e, Zr, Dn], multi: !0 }];
function SA(t, e, n) {
  return () => {
    let r = n.toJson();
    if (n.isEmpty) return;
    let i = t.createElement("script");
    (i.id = e + "-state"),
      i.setAttribute("type", "application/json"),
      (i.textContent = r),
      t.body.appendChild(i);
  };
}
var CA = [
  { provide: $e, useFactory: AA, deps: [Pt] },
  { provide: Ft, useValue: Xf },
  { provide: Rc, useFactory: IA, multi: !0 },
  { provide: $i, useClass: DA, deps: [$e, [ji, Ll]] },
  { provide: Jb, deps: [$e] },
  { provide: Yc, useValue: !0 },
];
function IA() {
  return () => {
    qh.makeCurrent();
  };
}
var NA = [{ provide: mo, multi: !0, useClass: _A }],
  MA = [
    TA,
    NA,
    wA,
    { provide: Vi, useValue: null },
    { provide: ro, useValue: null },
    { provide: tl, useClass: co },
  ],
  t5 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ot({ type: e })),
      (e.ɵinj = Rt({ providers: MA, imports: [GE, Ab, fl] }));
    let t = e;
    return t;
  })();
function AA(t) {
  let e = t.get(Ll, null),
    n;
  return (
    e && e.document
      ? (n = typeof e.document == "string" ? Xb(e.document, e.url) : e.document)
      : (n = un().createHtmlDocument()),
    gf(n),
    n
  );
}
var xA = Zc(zf, "server", CA);
function t0(t) {
  let e = t.platformProviders ?? [];
  return xA([
    { provide: Ll, useValue: { document: t.document, url: t.url } },
    e,
  ]);
}
function RA(t) {
  let e = t.createComment(Df);
  t.body.firstChild
    ? t.body.insertBefore(e, t.body.firstChild)
    : t.body.append(e);
}
function OA(t) {
  let e = t.injector,
    n = LA(e.get(kA, r0));
  t.components.forEach((r) => {
    let i = r.injector.get(Ui),
      s = r.location.nativeElement;
    s && i.setAttribute(s, "ng-server-context", n);
  });
}
function n0(t, e) {
  return Ln(this, null, function* () {
    let n = e.injector;
    yield oo(e);
    let r = t.injector.get(Jb);
    if (e.injector.get(Ci, !1)) {
      let o = r.getDocument();
      RA(o), gE(e, o);
    }
    let i = n.get(e0, null);
    if (i) {
      let o = [];
      for (let a of i)
        try {
          let c = a();
          c && o.push(c);
        } catch (c) {
          console.warn("Ignoring BEFORE_APP_SERIALIZED Exception: ", c);
        }
      if (o.length)
        for (let a of yield Promise.allSettled(o))
          a.status === "rejected" &&
            console.warn(
              "Ignoring BEFORE_APP_SERIALIZED Exception: ",
              a.reason
            );
    }
    OA(e);
    let s = r.renderToString();
    return (
      yield new Promise((o) => {
        setTimeout(() => {
          t.destroy(), o();
        }, 0);
      }),
      s
    );
  });
}
var r0 = "other",
  kA = new ie("SERVER_CONTEXT");
function LA(t) {
  let e = t.replace(/[^a-zA-Z0-9\-]/g, "");
  return e.length > 0 ? e : r0;
}
function n5(t, e) {
  return Ln(this, null, function* () {
    let { document: n, url: r, extraProviders: i } = e,
      s = t0({ document: n, url: r, platformProviders: i }),
      a = (yield s.bootstrapModule(t)).injector.get(ln);
    return n0(s, a);
  });
}
function r5(t, e) {
  return Ln(this, null, function* () {
    let n = t0(e),
      r = yield t();
    return n0(n, r);
  });
}
var ye = "primary",
  Uo = Symbol("RouteTitle"),
  op = class {
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
function rs(t) {
  return new op(t);
}
function PA(t, e, n) {
  let r = n.path.split("/");
  if (
    r.length > t.length ||
    (n.pathMatch === "full" && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let s = 0; s < r.length; s++) {
    let o = r[s],
      a = t[s];
    if (o.startsWith(":")) i[o.substring(1)] = a;
    else if (o !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function FA(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!Sn(t[n], e[n])) return !1;
  return !0;
}
function Sn(t, e) {
  let n = t ? ap(t) : void 0,
    r = e ? ap(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let s = 0; s < n.length; s++)
    if (((i = n[s]), !f0(t[i], e[i]))) return !1;
  return !0;
}
function ap(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function f0(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, s) => r[s] === i);
  } else return t === e;
}
function h0(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Ir(t) {
  return ku(t) ? t : so(t) ? Ge(Promise.resolve(t)) : ue(t);
}
var jA = { exact: m0, subset: g0 },
  p0 = { exact: BA, subset: HA, ignored: () => !0 };
function i0(t, e, n) {
  return (
    jA[n.paths](t.root, e.root, n.matrixParams) &&
    p0[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function BA(t, e) {
  return Sn(t, e);
}
function m0(t, e, n) {
  if (
    !ai(t.segments, e.segments) ||
    !jl(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !m0(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function HA(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => f0(t[n], e[n]))
  );
}
function g0(t, e, n) {
  return y0(t, e, e.segments, n);
}
function y0(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!ai(i, n) || e.hasChildren() || !jl(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!ai(t.segments, n) || !jl(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !g0(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      s = n.slice(t.segments.length);
    return !ai(t.segments, i) || !jl(t.segments, i, r) || !t.children[ye]
      ? !1
      : y0(t.children[ye], e, s, r);
  }
}
function jl(t, e, n) {
  return e.every((r, i) => p0[n](t[i].parameters, r.parameters));
}
var Tr = class {
    constructor(e = new je([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= rs(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return qA.serialize(this);
    }
  },
  je = class {
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
      return Bl(this);
    }
  },
  oi = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= rs(this.parameters)), this._parameterMap;
    }
    toString() {
      return E0(this);
    }
  };
function UA(t, e) {
  return ai(t, e) && t.every((n, r) => Sn(n.parameters, e[r].parameters));
}
function ai(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function VA(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === ye && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== ye && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var Vo = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => new Oo(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Oo = class {
    parse(e) {
      let n = new lp(e);
      return new Tr(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(e) {
      let n = `/${Io(e.root, !0)}`,
        r = GA(e.queryParams),
        i = typeof e.fragment == "string" ? `#${$A(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  qA = new Oo();
function Bl(t) {
  return t.segments.map((e) => E0(e)).join("/");
}
function Io(t, e) {
  if (!t.hasChildren()) return Bl(t);
  if (e) {
    let n = t.children[ye] ? Io(t.children[ye], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, s]) => {
        i !== ye && r.push(`${i}:${Io(s, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = VA(t, (r, i) =>
      i === ye ? [Io(t.children[ye], !1)] : [`${i}:${Io(r, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[ye] != null
      ? `${Bl(t)}/${n[0]}`
      : `${Bl(t)}/(${n.join("//")})`;
  }
}
function v0(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Pl(t) {
  return v0(t).replace(/%3B/gi, ";");
}
function $A(t) {
  return encodeURI(t);
}
function cp(t) {
  return v0(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Hl(t) {
  return decodeURIComponent(t);
}
function s0(t) {
  return Hl(t.replace(/\+/g, "%20"));
}
function E0(t) {
  return `${cp(t.path)}${zA(t.parameters)}`;
}
function zA(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${cp(e)}=${cp(n)}`)
    .join("");
}
function GA(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${Pl(n)}=${Pl(i)}`).join("&")
        : `${Pl(n)}=${Pl(r)}`
    )
    .filter((n) => n);
  return e.length ? `?${e.join("&")}` : "";
}
var WA = /^[^\/()?;#]+/;
function np(t) {
  let e = t.match(WA);
  return e ? e[0] : "";
}
var QA = /^[^\/()?;=#]+/;
function KA(t) {
  let e = t.match(QA);
  return e ? e[0] : "";
}
var YA = /^[^=?&#]+/;
function ZA(t) {
  let e = t.match(YA);
  return e ? e[0] : "";
}
var XA = /^[^&#]+/;
function JA(t) {
  let e = t.match(XA);
  return e ? e[0] : "";
}
var lp = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new je([], {})
        : new je([], this.parseChildren())
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
      (e.length > 0 || Object.keys(n).length > 0) && (r[ye] = new je(e, n)),
      r
    );
  }
  parseSegment() {
    let e = np(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new G(4009, !1);
    return this.capture(e), new oi(Hl(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = KA(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = np(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Hl(n)] = Hl(r);
  }
  parseQueryParam(e) {
    let n = ZA(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = JA(this.remaining);
      o && ((r = o), this.capture(r));
    }
    let i = s0(n),
      s = s0(r);
    if (e.hasOwnProperty(i)) {
      let o = e[i];
      Array.isArray(o) || ((o = [o]), (e[i] = o)), o.push(s);
    } else e[i] = s;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = np(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new G(4010, !1);
      let s;
      r.indexOf(":") > -1
        ? ((s = r.slice(0, r.indexOf(":"))), this.capture(s), this.capture(":"))
        : e && (s = ye);
      let o = this.parseChildren();
      (n[s] = Object.keys(o).length === 1 ? o[ye] : new je([], o)),
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
    if (!this.consumeOptional(e)) throw new G(4011, !1);
  }
};
function b0(t) {
  return t.segments.length > 0 ? new je([], { [ye]: t }) : t;
}
function w0(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let s = w0(i);
    if (r === ye && s.segments.length === 0 && s.hasChildren())
      for (let [o, a] of Object.entries(s.children)) e[o] = a;
    else (s.segments.length > 0 || s.hasChildren()) && (e[r] = s);
  }
  let n = new je(t.segments, e);
  return ex(n);
}
function ex(t) {
  if (t.numberOfChildren === 1 && t.children[ye]) {
    let e = t.children[ye];
    return new je(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function is(t) {
  return t instanceof Tr;
}
function tx(t, e, n = null, r = null) {
  let i = D0(t);
  return _0(i, e, n, r);
}
function D0(t) {
  let e;
  function n(s) {
    let o = {};
    for (let c of s.children) {
      let l = n(c);
      o[c.outlet] = l;
    }
    let a = new je(s.url, o);
    return s === t && (e = a), a;
  }
  let r = n(t.root),
    i = b0(r);
  return e ?? i;
}
function _0(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return rp(i, i, i, n, r);
  let s = nx(e);
  if (s.toRoot()) return rp(i, i, new je([], {}), n, r);
  let o = rx(s, i, t),
    a = o.processChildren
      ? Ao(o.segmentGroup, o.index, s.commands)
      : S0(o.segmentGroup, o.index, s.commands);
  return rp(i, o.segmentGroup, a, n, r);
}
function Ul(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function ko(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function rp(t, e, n, r, i) {
  let s = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      s[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let o;
  t === e ? (o = n) : (o = T0(t, e, n));
  let a = b0(w0(o));
  return new Tr(a, s, i);
}
function T0(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, s]) => {
      s === e ? (r[i] = n) : (r[i] = T0(s, e, n));
    }),
    new je(t.segments, r)
  );
}
var Vl = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && Ul(r[0]))
    )
      throw new G(4003, !1);
    let i = r.find(ko);
    if (i && i !== h0(r)) throw new G(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function nx(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Vl(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, s, o) => {
      if (typeof s == "object" && s != null) {
        if (s.outlets) {
          let a = {};
          return (
            Object.entries(s.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (s.segmentPath) return [...i, s.segmentPath];
      }
      return typeof s != "string"
        ? [...i, s]
        : o === 0
        ? (s.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (n = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, s];
    }, []);
  return new Vl(n, e, r);
}
var ts = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function rx(t, e, n) {
  if (t.isAbsolute) return new ts(e, !0, 0);
  if (!n) return new ts(e, !1, NaN);
  if (n.parent === null) return new ts(n, !0, 0);
  let r = Ul(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return ix(n, i, t.numberOfDoubleDots);
}
function ix(t, e, n) {
  let r = t,
    i = e,
    s = n;
  for (; s > i; ) {
    if (((s -= i), (r = r.parent), !r)) throw new G(4005, !1);
    i = r.segments.length;
  }
  return new ts(r, !1, i - s);
}
function sx(t) {
  return ko(t[0]) ? t[0].outlets : { [ye]: t };
}
function S0(t, e, n) {
  if (((t ??= new je([], {})), t.segments.length === 0 && t.hasChildren()))
    return Ao(t, e, n);
  let r = ox(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let s = new je(t.segments.slice(0, r.pathIndex), {});
    return (
      (s.children[ye] = new je(t.segments.slice(r.pathIndex), t.children)),
      Ao(s, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new je(t.segments, {})
      : r.match && !t.hasChildren()
      ? up(t, e, n)
      : r.match
      ? Ao(t, 0, i)
      : up(t, e, n);
}
function Ao(t, e, n) {
  if (n.length === 0) return new je(t.segments, {});
  {
    let r = sx(n),
      i = {};
    if (
      Object.keys(r).some((s) => s !== ye) &&
      t.children[ye] &&
      t.numberOfChildren === 1 &&
      t.children[ye].segments.length === 0
    ) {
      let s = Ao(t.children[ye], e, n);
      return new je(t.segments, s.children);
    }
    return (
      Object.entries(r).forEach(([s, o]) => {
        typeof o == "string" && (o = [o]),
          o !== null && (i[s] = S0(t.children[s], e, o));
      }),
      Object.entries(t.children).forEach(([s, o]) => {
        r[s] === void 0 && (i[s] = o);
      }),
      new je(t.segments, i)
    );
  }
}
function ox(t, e, n) {
  let r = 0,
    i = e,
    s = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return s;
    let o = t.segments[i],
      a = n[r];
    if (ko(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!a0(c, l, o)) return s;
      r += 2;
    } else {
      if (!a0(c, {}, o)) return s;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function up(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (ko(s)) {
      let c = ax(s.outlets);
      return new je(r, c);
    }
    if (i === 0 && Ul(n[0])) {
      let c = t.segments[e];
      r.push(new oi(c.path, o0(n[0]))), i++;
      continue;
    }
    let o = ko(s) ? s.outlets[ye] : `${s}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    o && a && Ul(a)
      ? (r.push(new oi(o, o0(a))), (i += 2))
      : (r.push(new oi(o, {})), i++);
  }
  return new je(r, {});
}
function ax(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = up(new je([], {}), 0, r));
    }),
    e
  );
}
function o0(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function a0(t, e, n) {
  return t == n.path && Sn(e, n.parameters);
}
var xo = "imperative",
  lt = (function (t) {
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
  })(lt || {}),
  Kt = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  ss = class extends Kt {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = lt.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Gn = class extends Kt {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = lt.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ut = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Ut || {}),
  ql = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(ql || {}),
  Sr = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = lt.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Cr = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = lt.NavigationSkipped);
    }
  },
  Lo = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = lt.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  $l = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = lt.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  dp = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = lt.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  fp = class extends Kt {
    constructor(e, n, r, i, s) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = s),
        (this.type = lt.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  hp = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = lt.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  pp = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = lt.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  mp = class {
    constructor(e) {
      (this.route = e), (this.type = lt.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  gp = class {
    constructor(e) {
      (this.route = e), (this.type = lt.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  yp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = lt.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  vp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = lt.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ep = class {
    constructor(e) {
      (this.snapshot = e), (this.type = lt.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  bp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = lt.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  zl = class {
    constructor(e, n, r) {
      (this.routerEvent = e),
        (this.position = n),
        (this.anchor = r),
        (this.type = lt.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  Po = class {},
  Fo = class {
    constructor(e) {
      this.url = e;
    }
  };
var wp = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new qo()),
        (this.attachRef = null);
    }
  },
  qo = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let s = this.getOrCreateContext(r);
        (s.outlet = i), this.contexts.set(r, s);
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
        return i || ((i = new wp()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Gl = class {
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
      let n = Dp(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = Dp(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = _p(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return _p(e, this._root).map((n) => n.value);
    }
  };
function Dp(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = Dp(t, n);
    if (r) return r;
  }
  return null;
}
function _p(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = _p(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var Ht = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function es(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var Wl = class extends Gl {
  constructor(e, n) {
    super(e), (this.snapshot = n), Op(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function C0(t) {
  let e = cx(t),
    n = new ft([new oi("", {})]),
    r = new ft({}),
    i = new ft({}),
    s = new ft({}),
    o = new ft(""),
    a = new os(n, r, s, o, i, ye, t, e.root);
  return (a.snapshot = e.root), new Wl(new Ht(a, []), e);
}
function cx(t) {
  let e = {},
    n = {},
    r = {},
    i = "",
    s = new jo([], e, r, i, n, ye, t, null, {});
  return new Ql("", new Ht(s, []));
}
var os = class {
  constructor(e, n, r, i, s, o, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = s),
      (this.outlet = o),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(Ee((l) => l[Uo])) ?? ue(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = s);
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
      (this._paramMap ??= this.params.pipe(Ee((e) => rs(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(Ee((e) => rs(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Rp(t, e, n = "emptyOnly") {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: Z(Z({}, e.params), t.params),
          data: Z(Z({}, e.data), t.data),
          resolve: Z(Z(Z(Z({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: Z({}, t.params),
          data: Z({}, t.data),
          resolve: Z(Z({}, t.data), t._resolvedData ?? {}),
        }),
    i && N0(i) && (r.resolve[Uo] = i.title),
    r
  );
}
var jo = class {
    get title() {
      return this.data?.[Uo];
    }
    constructor(e, n, r, i, s, o, a, c, l) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = s),
        (this.outlet = o),
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
      return (this._paramMap ??= rs(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= rs(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  Ql = class extends Gl {
    constructor(e, n) {
      super(n), (this.url = e), Op(this, n);
    }
    toString() {
      return I0(this._root);
    }
  };
function Op(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => Op(t, n));
}
function I0(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(I0).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function ip(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      Sn(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      Sn(e.params, n.params) || t.paramsSubject.next(n.params),
      FA(e.url, n.url) || t.urlSubject.next(n.url),
      Sn(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Tp(t, e) {
  let n = Sn(t.params, e.params) && UA(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || Tp(t.parent, e.parent));
}
function N0(t) {
  return typeof t.title == "string" || t.title === null;
}
var lx = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = ye),
          (this.activateEvents = new vt()),
          (this.deactivateEvents = new vt()),
          (this.attachEvents = new vt()),
          (this.detachEvents = new vt()),
          (this.parentContexts = q(qo)),
          (this.location = q(eo)),
          (this.changeDetector = q(ao)),
          (this.environmentInjector = q(pt)),
          (this.inputBinder = q(Jl, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: s } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(s) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(s)),
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
        if (!this.activated) throw new G(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new G(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new G(4012, !1);
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
        if (this.isActivated) throw new G(4013, !1);
        this._activatedRoute = r;
        let s = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Sp(r, c, s.injector);
        (this.activated = s.createComponent(a, {
          index: s.length,
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
      (e.ɵdir = Qs({
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
        features: [Mc],
      }));
    let t = e;
    return t;
  })(),
  Sp = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === os
        ? this.route
        : e === qo
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  Jl = new ie(""),
  c0 = (() => {
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
          s = Ds([i.queryParams, i.params, i.data])
            .pipe(
              Tt(
                ([o, a, c], l) => (
                  (c = Z(Z(Z({}, o), a), c)),
                  l === 0 ? ue(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((o) => {
              if (
                !r.isActivated ||
                !r.activatedComponentRef ||
                r.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              let a = vE(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              for (let { templateName: c } of a.inputs)
                r.activatedComponentRef.setInput(c, o[c]);
            });
        this.outletDataSubscriptions.set(r, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function ux(t, e, n) {
  let r = Bo(t, e._root, n ? n._root : void 0);
  return new Wl(r, e);
}
function Bo(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = dx(t, e, n);
    return new Ht(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let s = t.retrieve(e.value);
      if (s !== null) {
        let o = s.route;
        return (
          (o.value._futureSnapshot = e.value),
          (o.children = e.children.map((a) => Bo(t, a))),
          o
        );
      }
    }
    let r = fx(e.value),
      i = e.children.map((s) => Bo(t, s));
    return new Ht(r, i);
  }
}
function dx(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return Bo(t, r, i);
    return Bo(t, r);
  });
}
function fx(t) {
  return new os(
    new ft(t.url),
    new ft(t.params),
    new ft(t.queryParams),
    new ft(t.fragment),
    new ft(t.data),
    t.outlet,
    t.component,
    t
  );
}
var M0 = "ngNavigationCancelingError";
function A0(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = is(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = x0(!1, Ut.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function x0(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ""}`);
  return (n[M0] = !0), (n.cancellationCode = e), n;
}
function hx(t) {
  return R0(t) && is(t.url);
}
function R0(t) {
  return !!t && t[M0];
}
var px = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Zg({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [nE],
      decls: 1,
      vars: 0,
      template: function (i, s) {
        i & 1 && Uf(0, "router-outlet");
      },
      dependencies: [lx],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function mx(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = zc(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function kp(t) {
  let e = t.children && t.children.map(kp),
    n = e ? et(Z({}, t), { children: e }) : Z({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== ye &&
      (n.component = px),
    n
  );
}
function Cn(t) {
  return t.outlet || ye;
}
function gx(t, e) {
  let n = t.filter((r) => Cn(r) === e);
  return n.push(...t.filter((r) => Cn(r) !== e)), n;
}
function $o(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var yx = (t, e, n, r) =>
    Ee(
      (i) => (
        new Cp(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      )
    ),
  Cp = class {
    constructor(e, n, r, i, s) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = s);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        ip(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = es(n);
      e.children.forEach((s) => {
        let o = s.value.outlet;
        this.deactivateRoutes(s, i[o], r), delete i[o];
      }),
        Object.values(i).forEach((s) => {
          this.deactivateRouteAndItsChildren(s, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if (i === s)
        if (i.component) {
          let o = r.getContext(i.outlet);
          o && this.deactivateChildRoutes(e, n, o.children);
        } else this.deactivateChildRoutes(e, n, r);
      else s && this.deactivateRouteAndItsChildren(n, r);
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
        s = es(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      if (r && r.outlet) {
        let o = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: o,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        s = es(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = es(n);
      e.children.forEach((s) => {
        this.activateRoutes(s, i[s.value.outlet], r),
          this.forwardEvent(new bp(s.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new vp(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if ((ip(i), i === s))
        if (i.component) {
          let o = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, o.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let o = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            o.children.onOutletReAttached(a.contexts),
            (o.attachRef = a.componentRef),
            (o.route = a.route.value),
            o.outlet && o.outlet.attach(a.componentRef, a.route.value),
            ip(a.route.value),
            this.activateChildRoutes(e, null, o.children);
        } else {
          let a = $o(i.snapshot);
          (o.attachRef = null),
            (o.route = i),
            (o.injector = a),
            o.outlet && o.outlet.activateWith(i, o.injector),
            this.activateChildRoutes(e, null, o.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  Kl = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  ns = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function vx(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return No(r, i, n, [r.value]);
}
function Ex(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function cs(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !Bg(t) ? t : e.get(t)) : r;
}
function No(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let s = es(e);
  return (
    t.children.forEach((o) => {
      bx(o, s[o.value.outlet], n, r.concat([o.value]), i),
        delete s[o.value.outlet];
    }),
    Object.entries(s).forEach(([o, a]) => Ro(a, n.getContext(o), i)),
    i
  );
}
function bx(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let s = t.value,
    o = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (o && s.routeConfig === o.routeConfig) {
    let c = wx(o, s, s.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Kl(r))
      : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
      s.component ? No(t, e, a ? a.children : null, r, i) : No(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new ns(a.outlet.component, o));
  } else
    o && Ro(e, a, i),
      i.canActivateChecks.push(new Kl(r)),
      s.component
        ? No(t, null, a ? a.children : null, r, i)
        : No(t, null, n, r, i);
  return i;
}
function wx(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !ai(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !ai(t.url, e.url) || !Sn(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Tp(t, e) || !Sn(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Tp(t, e);
  }
}
function Ro(t, e, n) {
  let r = es(t),
    i = t.value;
  Object.entries(r).forEach(([s, o]) => {
    i.component
      ? e
        ? Ro(o, e.children.getContext(s), n)
        : Ro(o, null, n)
      : Ro(o, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new ns(e.outlet.component, i))
        : n.canDeactivateChecks.push(new ns(null, i))
      : n.canDeactivateChecks.push(new ns(null, i));
}
function zo(t) {
  return typeof t == "function";
}
function Dx(t) {
  return typeof t == "boolean";
}
function _x(t) {
  return t && zo(t.canLoad);
}
function Tx(t) {
  return t && zo(t.canActivate);
}
function Sx(t) {
  return t && zo(t.canActivateChild);
}
function Cx(t) {
  return t && zo(t.canDeactivate);
}
function Ix(t) {
  return t && zo(t.canMatch);
}
function O0(t) {
  return t instanceof Pn || t?.name === "EmptyError";
}
var Fl = Symbol("INITIAL_VALUE");
function as() {
  return Tt((t) =>
    Ds(t.map((e) => e.pipe(jn(1), ju(Fl)))).pipe(
      Ee((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === Fl) return Fl;
            if (n === !1 || n instanceof Tr) return n;
          }
        return !0;
      }),
      _t((e) => e !== Fl),
      jn(1)
    )
  );
}
function Nx(t, e) {
  return tt((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: s, canDeactivateChecks: o },
    } = n;
    return o.length === 0 && s.length === 0
      ? ue(et(Z({}, n), { guardsResult: !0 }))
      : Mx(o, r, i, t).pipe(
          tt((a) => (a && Dx(a) ? Ax(r, s, t, e) : ue(a))),
          Ee((a) => et(Z({}, n), { guardsResult: a }))
        );
  });
}
function Mx(t, e, n, r) {
  return Ge(t).pipe(
    tt((i) => Lx(i.component, i.route, n, e, r)),
    Jt((i) => i !== !0, !0)
  );
}
function Ax(t, e, n, r) {
  return Ge(e).pipe(
    Fn((i) =>
      Di(
        Rx(i.route.parent, r),
        xx(i.route, r),
        kx(t, i.path, n),
        Ox(t, i.route, n)
      )
    ),
    Jt((i) => i !== !0, !0)
  );
}
function xx(t, e) {
  return t !== null && e && e(new Ep(t)), ue(!0);
}
function Rx(t, e) {
  return t !== null && e && e(new yp(t)), ue(!0);
}
function Ox(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return ue(!0);
  let i = r.map((s) =>
    Ba(() => {
      let o = $o(e) ?? n,
        a = cs(s, o),
        c = Tx(a) ? a.canActivate(e, t) : on(o, () => a(e, t));
      return Ir(c).pipe(Jt());
    })
  );
  return ue(i).pipe(as());
}
function kx(t, e, n) {
  let r = e[e.length - 1],
    s = e
      .slice(0, e.length - 1)
      .reverse()
      .map((o) => Ex(o))
      .filter((o) => o !== null)
      .map((o) =>
        Ba(() => {
          let a = o.guards.map((c) => {
            let l = $o(o.node) ?? n,
              u = cs(c, l),
              d = Sx(u) ? u.canActivateChild(r, t) : on(l, () => u(r, t));
            return Ir(d).pipe(Jt());
          });
          return ue(a).pipe(as());
        })
      );
  return ue(s).pipe(as());
}
function Lx(t, e, n, r, i) {
  let s = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!s || s.length === 0) return ue(!0);
  let o = s.map((a) => {
    let c = $o(e) ?? i,
      l = cs(a, c),
      u = Cx(l) ? l.canDeactivate(t, e, n, r) : on(c, () => l(t, e, n, r));
    return Ir(u).pipe(Jt());
  });
  return ue(o).pipe(as());
}
function Px(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return ue(!0);
  let s = i.map((o) => {
    let a = cs(o, t),
      c = _x(a) ? a.canLoad(e, n) : on(t, () => a(e, n));
    return Ir(c);
  });
  return ue(s).pipe(as(), k0(r));
}
function k0(t) {
  return Au(
    rt((e) => {
      if (is(e)) throw A0(t, e);
    }),
    Ee((e) => e === !0)
  );
}
function Fx(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return ue(!0);
  let s = i.map((o) => {
    let a = cs(o, t),
      c = Ix(a) ? a.canMatch(e, n) : on(t, () => a(e, n));
    return Ir(c);
  });
  return ue(s).pipe(as(), k0(r));
}
var Ho = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Yl = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Ji(t) {
  return bi(new Ho(t));
}
function jx(t) {
  return bi(new G(4e3, !1));
}
function Bx(t) {
  return bi(x0(!1, Ut.GuardRejected));
}
var Ip = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0))
          return ue(r);
        if (i.numberOfChildren > 1 || !i.children[ye]) return jx(e.redirectTo);
        i = i.children[ye];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r
      );
      if (n.startsWith("/")) throw new Yl(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let s = this.createSegmentGroup(e, n.root, r, i);
      return new Tr(
        s,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, s]) => {
          if (typeof s == "string" && s.startsWith(":")) {
            let a = s.substring(1);
            r[i] = n[a];
          } else r[i] = s;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let s = this.createSegments(e, n.segments, r, i),
        o = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          o[a] = this.createSegmentGroup(e, c, r, i);
        }),
        new je(s, o)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((s) =>
        s.path.startsWith(":")
          ? this.findPosParam(e, s, i)
          : this.findOrReturn(s, r)
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new G(4001, !1);
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
  Np = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function Hx(t, e, n, r, i) {
  let s = Lp(t, e, n);
  return s.matched
    ? ((r = mx(e, r)),
      Fx(r, e, n, i).pipe(Ee((o) => (o === !0 ? s : Z({}, Np)))))
    : ue(s);
}
function Lp(t, e, n) {
  if (e.path === "**") return Ux(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? Z({}, Np)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || PA)(n, t, e);
  if (!i) return Z({}, Np);
  let s = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    s[a] = c.path;
  });
  let o =
    i.consumed.length > 0
      ? Z(Z({}, s), i.consumed[i.consumed.length - 1].parameters)
      : s;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: o,
    positionalParamSegments: i.posParams ?? {},
  };
}
function Ux(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? h0(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function l0(t, e, n, r) {
  return n.length > 0 && $x(t, n, r)
    ? {
        segmentGroup: new je(e, qx(r, new je(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && zx(t, n, r)
    ? {
        segmentGroup: new je(t.segments, Vx(t, n, r, t.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new je(t.segments, t.children), slicedSegments: n };
}
function Vx(t, e, n, r) {
  let i = {};
  for (let s of n)
    if (eu(t, e, s) && !r[Cn(s)]) {
      let o = new je([], {});
      i[Cn(s)] = o;
    }
  return Z(Z({}, r), i);
}
function qx(t, e) {
  let n = {};
  n[ye] = e;
  for (let r of t)
    if (r.path === "" && Cn(r) !== ye) {
      let i = new je([], {});
      n[Cn(r)] = i;
    }
  return n;
}
function $x(t, e, n) {
  return n.some((r) => eu(t, e, r) && Cn(r) !== ye);
}
function zx(t, e, n) {
  return n.some((r) => eu(t, e, r));
}
function eu(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function Gx(t, e, n, r) {
  return Cn(t) !== r && (r === ye || !eu(e, n, t)) ? !1 : Lp(e, t, n).matched;
}
function Wx(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var Mp = class {};
function Qx(t, e, n, r, i, s, o = "emptyOnly") {
  return new Ap(t, e, n, r, i, o, s).recognize();
}
var Kx = 31,
  Ap = class {
    constructor(e, n, r, i, s, o, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = s),
        (this.paramsInheritanceStrategy = o),
        (this.urlSerializer = a),
        (this.applyRedirects = new Ip(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new G(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = l0(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        Ee((n) => {
          let r = new jo(
              [],
              Object.freeze({}),
              Object.freeze(Z({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              ye,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Ht(r, n),
            s = new Ql("", i),
            o = tx(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (o.queryParams = this.urlTree.queryParams),
            (s.url = this.urlSerializer.serialize(o)),
            this.inheritParamsAndData(s._root, null),
            { state: s, tree: o }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, ye).pipe(
        lr((r) => {
          if (r instanceof Yl)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Ho ? this.noMatchError(r) : r;
        })
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = Rp(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((s) => this.inheritParamsAndData(s, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            Ee((s) => (s instanceof Ht ? [s] : []))
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return Ge(i).pipe(
        Fn((s) => {
          let o = r.children[s],
            a = gx(n, s);
          return this.processSegmentGroup(e, a, o, s);
        }),
        Fu((s, o) => (s.push(...o), s)),
        ur(null),
        Pu(),
        tt((s) => {
          if (s === null) return Ji(r);
          let o = L0(s);
          return Yx(o), ue(o);
        })
      );
    }
    processSegment(e, n, r, i, s, o) {
      return Ge(n).pipe(
        Fn((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            s,
            o
          ).pipe(
            lr((c) => {
              if (c instanceof Ho) return ue(null);
              throw c;
            })
          )
        ),
        Jt((a) => !!a),
        lr((a) => {
          if (O0(a)) return Wx(r, i, s) ? ue(new Mp()) : Ji(r);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, n, r, i, s, o, a) {
      return Gx(r, i, s, o)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, s, o)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, s, o)
          : Ji(i)
        : Ji(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, s, o) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = Lp(n, i, s);
      if (!a) return Ji(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Kx && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(tt((g) => this.processSegment(e, r, n, g.concat(u), o, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, s) {
      let o = Hx(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        o.pipe(
          Tt((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  Tt(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: g,
                      } = a,
                      b = new jo(
                        u,
                        g,
                        Object.freeze(Z({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Xx(r),
                        Cn(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Jx(r)
                      ),
                      { segmentGroup: I, slicedSegments: M } = l0(n, u, d, c);
                    if (M.length === 0 && I.hasChildren())
                      return this.processChildren(l, c, I).pipe(
                        Ee((R) => (R === null ? null : new Ht(b, R)))
                      );
                    if (c.length === 0 && M.length === 0)
                      return ue(new Ht(b, []));
                    let F = Cn(r) === s;
                    return this.processSegment(l, c, I, M, F ? ye : s, !0).pipe(
                      Ee((R) => new Ht(b, R instanceof Ht ? [R] : []))
                    );
                  })
                ))
              : Ji(n)
          )
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? ue({ routes: n.children, injector: e })
        : n.loadChildren
        ? n._loadedRoutes !== void 0
          ? ue({ routes: n._loadedRoutes, injector: n._loadedInjector })
          : Px(e, n, r, this.urlSerializer).pipe(
              tt((i) =>
                i
                  ? this.configLoader.loadChildren(e, n).pipe(
                      rt((s) => {
                        (n._loadedRoutes = s.routes),
                          (n._loadedInjector = s.injector);
                      })
                    )
                  : Bx(n)
              )
            )
        : ue({ routes: [], injector: e });
    }
  };
function Yx(t) {
  t.sort((e, n) =>
    e.value.outlet === ye
      ? -1
      : n.value.outlet === ye
      ? 1
      : e.value.outlet.localeCompare(n.value.outlet)
  );
}
function Zx(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function L0(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!Zx(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((s) => r.value.routeConfig === s.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = L0(r.children);
    e.push(new Ht(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function Xx(t) {
  return t.data || {};
}
function Jx(t) {
  return t.resolve || {};
}
function eR(t, e, n, r, i, s) {
  return tt((o) =>
    Qx(t, e, n, r, o.extractedUrl, i, s).pipe(
      Ee(({ state: a, tree: c }) =>
        et(Z({}, o), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function tR(t, e) {
  return tt((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return ue(n);
    let s = new Set(i.map((c) => c.route)),
      o = new Set();
    for (let c of s) if (!o.has(c)) for (let l of P0(c)) o.add(l);
    let a = 0;
    return Ge(o).pipe(
      Fn((c) =>
        s.has(c)
          ? nR(c, r, t, e)
          : ((c.data = Rp(c, c.parent, t).resolve), ue(void 0))
      ),
      rt(() => a++),
      _i(1),
      tt((c) => (a === o.size ? ue(n) : Mt))
    );
  });
}
function P0(t) {
  let e = t.children.map((n) => P0(n)).flat();
  return [t, ...e];
}
function nR(t, e, n, r) {
  let i = t.routeConfig,
    s = t._resolve;
  return (
    i?.title !== void 0 && !N0(i) && (s[Uo] = i.title),
    rR(s, t, e, r).pipe(
      Ee(
        (o) => (
          (t._resolvedData = o), (t.data = Rp(t, t.parent, n).resolve), null
        )
      )
    )
  );
}
function rR(t, e, n, r) {
  let i = ap(t);
  if (i.length === 0) return ue({});
  let s = {};
  return Ge(i).pipe(
    tt((o) =>
      iR(t[o], e, n, r).pipe(
        Jt(),
        rt((a) => {
          s[o] = a;
        })
      )
    ),
    _i(1),
    Lu(s),
    lr((o) => (O0(o) ? Mt : bi(o)))
  );
}
function iR(t, e, n, r) {
  let i = $o(e) ?? r,
    s = cs(t, i),
    o = s.resolve ? s.resolve(e, n) : on(i, () => s(e, n));
  return Ir(o);
}
function sp(t) {
  return Tt((e) => {
    let n = t(e);
    return n ? Ge(n).pipe(Ee(() => e)) : ue(e);
  });
}
var F0 = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          s = r.root;
        for (; s !== void 0; )
          (i = this.getResolvedTitleForRoute(s) ?? i),
            (s = s.children.find((o) => o.outlet === ye));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[Uo];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(sR), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  sR = (() => {
    let e = class e extends F0 {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(eb));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Go = new ie("", { providedIn: "root", factory: () => ({}) }),
  Zl = new ie(""),
  Pp = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = q(Kc));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return ue(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Ir(r.loadComponent()).pipe(
            Ee(j0),
            rt((o) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = o);
            }),
            dr(() => {
              this.componentLoaders.delete(r);
            })
          ),
          s = new Ei(i, () => new dt()).pipe(vi());
        return this.componentLoaders.set(r, s), s;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return ue({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = oR(i, this.compiler, r, this.onLoadEndListener).pipe(
            dr(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new Ei(o, () => new dt()).pipe(vi());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function oR(t, e, n, r) {
  return Ir(t.loadChildren()).pipe(
    Ee(j0),
    tt((i) =>
      i instanceof qs || Array.isArray(i) ? ue(i) : Ge(e.compileModuleAsync(i))
    ),
    Ee((i) => {
      r && r(t);
      let s,
        o,
        a = !1;
      return (
        Array.isArray(i)
          ? ((o = i), (a = !0))
          : ((s = i.create(n).injector),
            (o = s.get(Zl, [], { optional: !0, self: !0 }).flat())),
        { routes: o.map(kp), injector: s }
      );
    })
  );
}
function aR(t) {
  return t && typeof t == "object" && "default" in t;
}
function j0(t) {
  return aR(t) ? t.default : t;
}
var Fp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(cR), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  cR = (() => {
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
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  B0 = new ie(""),
  H0 = new ie("");
function lR(t, e, n) {
  let r = t.get(H0),
    i = t.get($e);
  return t.get(Be).runOutsideAngular(() => {
    if (!i.startViewTransition || r.skipNextTransition)
      return (r.skipNextTransition = !1), new Promise((l) => setTimeout(l));
    let s,
      o = new Promise((l) => {
        s = l;
      }),
      a = i.startViewTransition(() => (s(), uR(t))),
      { onViewTransitionCreated: c } = r;
    return c && on(t, () => c({ transition: a, from: e, to: n })), o;
  });
}
function uR(t) {
  return new Promise((e) => {
    $c(e, { injector: t });
  });
}
var jp = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new dt()),
        (this.transitionAbortSubject = new dt()),
        (this.configLoader = q(Pp)),
        (this.environmentInjector = q(pt)),
        (this.urlSerializer = q(Vo)),
        (this.rootContexts = q(qo)),
        (this.location = q(zi)),
        (this.inputBindingEnabled = q(Jl, { optional: !0 }) !== null),
        (this.titleStrategy = q(F0)),
        (this.options = q(Go, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = q(Fp)),
        (this.createViewTransition = q(B0, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => ue(void 0)),
        (this.rootComponentType = null);
      let r = (s) => this.events.next(new mp(s)),
        i = (s) => this.events.next(new gp(s));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(
        et(Z(Z({}, this.transitions.value), r), { id: i })
      );
    }
    setupNavigations(r, i, s) {
      return (
        (this.transitions = new ft({
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
          source: xo,
          restoredState: null,
          currentSnapshot: s.snapshot,
          targetSnapshot: null,
          currentRouterState: s,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          _t((o) => o.id !== 0),
          Ee((o) =>
            et(Z({}, o), {
              extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
            })
          ),
          Tt((o) => {
            let a = !1,
              c = !1;
            return ue(o).pipe(
              Tt((l) => {
                if (this.navigationId > o.id)
                  return (
                    this.cancelNavigationTransition(
                      o,
                      "",
                      Ut.SupersededByNewNavigation
                    ),
                    Mt
                  );
                (this.currentTransition = o),
                  (this.currentNavigation = {
                    id: l.id,
                    initialUrl: l.rawUrl,
                    extractedUrl: l.extractedUrl,
                    trigger: l.source,
                    extras: l.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? et(Z({}, this.lastSuccessfulNavigation), {
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
                  let g = "";
                  return (
                    this.events.next(
                      new Cr(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        g,
                        ql.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    Mt
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return ue(l).pipe(
                    Tt((g) => {
                      let b = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new ss(
                            g.id,
                            this.urlSerializer.serialize(g.extractedUrl),
                            g.source,
                            g.restoredState
                          )
                        ),
                        b !== this.transitions?.getValue()
                          ? Mt
                          : Promise.resolve(g)
                      );
                    }),
                    eR(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    rt((g) => {
                      (o.targetSnapshot = g.targetSnapshot),
                        (o.urlAfterRedirects = g.urlAfterRedirects),
                        (this.currentNavigation = et(
                          Z({}, this.currentNavigation),
                          { finalUrl: g.urlAfterRedirects }
                        ));
                      let b = new $l(
                        g.id,
                        this.urlSerializer.serialize(g.extractedUrl),
                        this.urlSerializer.serialize(g.urlAfterRedirects),
                        g.targetSnapshot
                      );
                      this.events.next(b);
                    })
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: g,
                      extractedUrl: b,
                      source: I,
                      restoredState: M,
                      extras: F,
                    } = l,
                    R = new ss(g, this.urlSerializer.serialize(b), I, M);
                  this.events.next(R);
                  let _ = C0(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = o =
                      et(Z({}, l), {
                        targetSnapshot: _,
                        urlAfterRedirects: b,
                        extras: et(Z({}, F), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = b),
                    ue(o)
                  );
                } else {
                  let g = "";
                  return (
                    this.events.next(
                      new Cr(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        g,
                        ql.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    Mt
                  );
                }
              }),
              rt((l) => {
                let u = new dp(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(u);
              }),
              Ee(
                (l) => (
                  (this.currentTransition = o =
                    et(Z({}, l), {
                      guards: vx(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  o
                )
              ),
              Nx(this.environmentInjector, (l) => this.events.next(l)),
              rt((l) => {
                if (((o.guardsResult = l.guardsResult), is(l.guardsResult)))
                  throw A0(this.urlSerializer, l.guardsResult);
                let u = new fp(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(u);
              }),
              _t((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Ut.GuardRejected),
                    !1)
              ),
              sp((l) => {
                if (l.guards.canActivateChecks.length)
                  return ue(l).pipe(
                    rt((u) => {
                      let d = new hp(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Tt((u) => {
                      let d = !1;
                      return ue(u).pipe(
                        tR(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        rt({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                "",
                                Ut.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    rt((u) => {
                      let d = new pp(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              sp((l) => {
                let u = (d) => {
                  let g = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    g.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        rt((b) => {
                          d.component = b;
                        }),
                        Ee(() => {})
                      )
                    );
                  for (let b of d.children) g.push(...u(b));
                  return g;
                };
                return Ds(u(l.targetSnapshot.root)).pipe(ur(null), jn(1));
              }),
              sp(() => this.afterPreactivation()),
              Tt(() => {
                let { currentSnapshot: l, targetSnapshot: u } = o,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root
                  );
                return d ? Ge(d).pipe(Ee(() => o)) : ue(o);
              }),
              Ee((l) => {
                let u = ux(
                  r.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = o =
                    et(Z({}, l), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  o
                );
              }),
              rt(() => {
                this.events.next(new Po());
              }),
              yx(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              jn(1),
              rt({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Gn(
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
              Bu(
                this.transitionAbortSubject.pipe(
                  rt((l) => {
                    throw l;
                  })
                )
              ),
              dr(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    o,
                    "",
                    Ut.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === o.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              lr((l) => {
                if (((c = !0), R0(l)))
                  this.events.next(
                    new Sr(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    hx(l) ? this.events.next(new Fo(l.url)) : o.resolve(!1);
                else {
                  this.events.next(
                    new Lo(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l,
                      o.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    o.resolve(r.errorHandler(l));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? o.resolve(!1)
                      : o.reject(u);
                  }
                }
                return Mt;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(r, i, s) {
      let o = new Sr(r.id, this.urlSerializer.serialize(r.extractedUrl), i, s);
      this.events.next(o), r.resolve(!1);
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
    (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function dR(t) {
  return t !== xo;
}
var fR = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(hR), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  xp = class {
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
  hR = (() => {
    let e = class e extends xp {};
    (e.ɵfac = (() => {
      let r;
      return function (s) {
        return (r || (r = pf(e)))(s || e);
      };
    })()),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  U0 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: () => q(pR), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  pR = (() => {
    let e = class e extends U0 {
      constructor() {
        super(...arguments),
          (this.location = q(zi)),
          (this.urlSerializer = q(Vo)),
          (this.options = q(Go, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = q(Fp)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Tr()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = C0(null)),
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
        if (r instanceof ss) this.stateMemento = this.createStateMemento();
        else if (r instanceof Cr) this.rawUrlTree = i.initialUrl;
        else if (r instanceof $l) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let s = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(s, i);
          }
        } else
          r instanceof Po
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Sr &&
              (r.code === Ut.GuardRejected || r.code === Ut.NoDataFromResolver)
            ? this.restoreHistory(i)
            : r instanceof Lo
            ? this.restoreHistory(i, !0)
            : r instanceof Gn &&
              ((this.lastSuccessfulId = r.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let s = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(s) || i.extras.replaceUrl) {
          let o = this.browserPageId,
            a = Z(Z({}, i.extras.state), this.generateNgRouterState(i.id, o));
          this.location.replaceState(s, "", a);
        } else {
          let o = Z(
            Z({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(s, "", o);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let s = this.browserPageId,
            o = this.currentPageId - s;
          o !== 0
            ? this.location.historyGo(o)
            : this.currentUrlTree === r.finalUrl &&
              o === 0 &&
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
      return function (s) {
        return (r || (r = pf(e)))(s || e);
      };
    })()),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Mo = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(Mo || {});
function V0(t, e) {
  t.events
    .pipe(
      _t(
        (n) =>
          n instanceof Gn ||
          n instanceof Sr ||
          n instanceof Lo ||
          n instanceof Cr
      ),
      Ee((n) =>
        n instanceof Gn || n instanceof Cr
          ? Mo.COMPLETE
          : (
              n instanceof Sr
                ? n.code === Ut.Redirect ||
                  n.code === Ut.SupersededByNewNavigation
                : !1
            )
          ? Mo.REDIRECTING
          : Mo.FAILED
      ),
      _t((n) => n !== Mo.REDIRECTING),
      jn(1)
    )
    .subscribe(() => {
      e();
    });
}
function mR(t) {
  throw t;
}
var gR = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  yR = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  ci = (() => {
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
          (this.console = q(Gc)),
          (this.stateManager = q(U0)),
          (this.options = q(Go, { optional: !0 }) || {}),
          (this.pendingTasks = q(Xr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = q(jp)),
          (this.urlSerializer = q(Vo)),
          (this.location = q(zi)),
          (this.urlHandlingStrategy = q(Fp)),
          (this._events = new dt()),
          (this.errorHandler = this.options.errorHandler || mR),
          (this.navigated = !1),
          (this.routeReuseStrategy = q(fR)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = q(Zl, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!q(Jl, { optional: !0 })),
          (this.eventsSubscription = new nt()),
          (this.isNgZoneEnabled = q(Be) instanceof Be && Be.isInAngularZone()),
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
            let s = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (s !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof Sr &&
                  i.code !== Ut.Redirect &&
                  i.code !== Ut.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Gn) this.navigated = !0;
              else if (i instanceof Fo) {
                let a = this.urlHandlingStrategy.merge(i.url, s.currentRawUrl),
                  c = {
                    info: s.extras.info,
                    skipLocationChange: s.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || dR(s.source),
                  };
                this.scheduleNavigation(a, xo, null, c, {
                  resolve: s.resolve,
                  reject: s.reject,
                  promise: s.promise,
                });
              }
            }
            ER(i) && this._events.next(i);
          } catch (s) {
            this.navigationTransitions.transitionAbortSubject.next(s);
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
              xo,
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
      navigateToSyncWithBrowser(r, i, s) {
        let o = { replaceUrl: !0 },
          a = s?.navigationId ? s : null;
        if (s) {
          let l = Z({}, s);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (o.state = l);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, i, a, o);
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
        (this.config = r.map(kp)), (this.navigated = !1);
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
            relativeTo: s,
            queryParams: o,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = Z(Z({}, this.currentUrlTree.queryParams), o);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = o || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let g;
        try {
          let b = s ? s.snapshot : this.routerState.snapshot.root;
          g = D0(b);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (g = this.currentUrlTree.root);
        }
        return _0(g, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let s = is(r) ? r : this.parseUrl(r),
          o = this.urlHandlingStrategy.merge(s, this.rawUrlTree);
        return this.scheduleNavigation(o, xo, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return vR(r), this.navigateByUrl(this.createUrlTree(r, i), i);
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
        let s;
        if (
          (i === !0 ? (s = Z({}, gR)) : i === !1 ? (s = Z({}, yR)) : (s = i),
          is(r))
        )
          return i0(this.currentUrlTree, r, s);
        let o = this.parseUrl(r);
        return i0(this.currentUrlTree, o, s);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [s, o]) => (o != null && (i[s] = o), i),
          {}
        );
      }
      scheduleNavigation(r, i, s, o, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((g, b) => {
              (c = g), (l = b);
            }));
        let d = this.pendingTasks.add();
        return (
          V0(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: s,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: o,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((g) => Promise.reject(g))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function vR(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new G(4008, !1);
}
function ER(t) {
  return !(t instanceof Po) && !(t instanceof Fo);
}
var Xl = class {};
var bR = (() => {
    let e = class e {
      constructor(r, i, s, o, a) {
        (this.router = r),
          (this.injector = s),
          (this.preloadingStrategy = o),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            _t((r) => r instanceof Gn),
            Fn(() => this.preload())
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
        let s = [];
        for (let o of i) {
          o.providers &&
            !o._injector &&
            (o._injector = zc(o.providers, r, `Route: ${o.path}`));
          let a = o._injector ?? r,
            c = o._loadedInjector ?? a;
          ((o.loadChildren && !o._loadedRoutes && o.canLoad === void 0) ||
            (o.loadComponent && !o._loadedComponent)) &&
            s.push(this.preloadConfig(a, o)),
            (o.children || o._loadedRoutes) &&
              s.push(this.processRoutes(c, o.children ?? o._loadedRoutes));
        }
        return Ge(s).pipe(wi());
      }
      preloadConfig(r, i) {
        return this.preloadingStrategy.preload(i, () => {
          let s;
          i.loadChildren && i.canLoad === void 0
            ? (s = this.loader.loadChildren(r, i))
            : (s = ue(null));
          let o = s.pipe(
            tt((a) =>
              a === null
                ? ue(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? r, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return Ge([o, a]).pipe(wi());
          } else return o;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(ci), X(Kc), X(pt), X(Xl), X(Pp));
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  q0 = new ie(""),
  wR = (() => {
    let e = class e {
      constructor(r, i, s, o, a = {}) {
        (this.urlSerializer = r),
          (this.transitions = i),
          (this.viewportScroller = s),
          (this.zone = o),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (this.environmentInjector = q(pt)),
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
          r instanceof ss
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = r.navigationTrigger),
              (this.restoredId = r.restoredState
                ? r.restoredState.navigationId
                : 0))
            : r instanceof Gn
            ? ((this.lastId = r.id),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.urlAfterRedirects).fragment
              ))
            : r instanceof Cr &&
              r.code === ql.IgnoredSameUrlNavigation &&
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
          r instanceof zl &&
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
          Ln(this, null, function* () {
            yield new Promise((s) => {
              setTimeout(() => {
                s();
              }),
                $c(
                  () => {
                    s();
                  },
                  { injector: this.environmentInjector }
                );
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new zl(
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
      hv();
    }),
      (e.ɵprov = J({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function DR(t) {
  return t.routerState.root;
}
function Wo(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function _R() {
  let t = q(Pt);
  return (e) => {
    let n = t.get(ln);
    if (e !== n.components[0]) return;
    let r = t.get(ci),
      i = t.get($0);
    t.get(Bp) === 1 && r.initialNavigation(),
      t.get(z0, null, we.Optional)?.setUpPreloading(),
      t.get(q0, null, we.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var $0 = new ie("", { factory: () => new dt() }),
  Bp = new ie("", { providedIn: "root", factory: () => 1 });
function TR() {
  return Wo(2, [
    { provide: Bp, useValue: 0 },
    {
      provide: Qc,
      multi: !0,
      deps: [Pt],
      useFactory: (e) => {
        let n = e.get(TE, Promise.resolve());
        return () =>
          n.then(
            () =>
              new Promise((r) => {
                let i = e.get(ci),
                  s = e.get($0);
                V0(i, () => {
                  r(!0);
                }),
                  (e.get(jp).afterPreactivation = () => (
                    r(!0), s.closed ? ue(void 0) : s
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function SR() {
  return Wo(3, [
    {
      provide: Qc,
      multi: !0,
      useFactory: () => {
        let e = q(ci);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Bp, useValue: 2 },
  ]);
}
var z0 = new ie("");
function CR(t) {
  return Wo(0, [
    { provide: z0, useExisting: bR },
    { provide: Xl, useExisting: t },
  ]);
}
function IR() {
  return Wo(8, [c0, { provide: Jl, useExisting: c0 }]);
}
function NR(t) {
  let e = [
    { provide: B0, useValue: lR },
    {
      provide: H0,
      useValue: Z({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return Wo(9, e);
}
var u0 = new ie("ROUTER_FORROOT_GUARD"),
  MR = [
    zi,
    { provide: Vo, useClass: Oo },
    ci,
    qo,
    { provide: os, useFactory: DR, deps: [ci] },
    Pp,
    [],
  ],
  C5 = (() => {
    let e = class e {
      constructor(r) {}
      static forRoot(r, i) {
        return {
          ngModule: e,
          providers: [
            MR,
            [],
            { provide: Zl, multi: !0, useValue: r },
            { provide: u0, useFactory: OR, deps: [[ci, new ji(), new Qd()]] },
            { provide: Go, useValue: i || {} },
            i?.useHash ? xR() : RR(),
            AR(),
            i?.preloadingStrategy ? CR(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? kR(i) : [],
            i?.bindToComponentInputs ? IR().ɵproviders : [],
            i?.enableViewTransitions ? NR().ɵproviders : [],
            LR(),
          ],
        };
      }
      static forChild(r) {
        return {
          ngModule: e,
          providers: [{ provide: Zl, multi: !0, useValue: r }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(X(u0, 8));
    }),
      (e.ɵmod = Ot({ type: e })),
      (e.ɵinj = Rt({}));
    let t = e;
    return t;
  })();
function AR() {
  return {
    provide: q0,
    useFactory: () => {
      let t = q(tl),
        e = q(Be),
        n = q(Go),
        r = q(jp),
        i = q(Vo);
      return (
        n.scrollOffset && t.setOffset(n.scrollOffset), new wR(i, r, t, e, n)
      );
    },
  };
}
function xR() {
  return { provide: ei, useClass: CE };
}
function RR() {
  return { provide: ei, useClass: Zf };
}
function OR(t) {
  return "guarded";
}
function kR(t) {
  return [
    t.initialNavigation === "disabled" ? SR().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? TR().ɵproviders : [],
  ];
}
var d0 = new ie("");
function LR() {
  return [
    { provide: d0, useFactory: _R },
    { provide: qi, multi: !0, useExisting: d0 },
  ];
}
export {
  ke as a,
  J as b,
  Rt as c,
  X as d,
  Zg as e,
  Ot as f,
  Qs as g,
  Js as h,
  vt as i,
  Ft as j,
  DF as k,
  _F as l,
  yr as m,
  Be as n,
  aI as o,
  zv as p,
  gI as q,
  Wv as r,
  Qv as s,
  Kv as t,
  Uf as u,
  Xv as v,
  HI as w,
  Jv as x,
  CF as y,
  qI as z,
  tE as A,
  IF as B,
  Gc as C,
  ln as D,
  oo as E,
  Kc as F,
  Zc as G,
  ao as H,
  zf as I,
  SE as J,
  XF as K,
  JF as L,
  O1 as M,
  fl as N,
  N2 as O,
  V2 as P,
  Ll as Q,
  CA as R,
  t5 as S,
  kA as T,
  n5 as U,
  r5 as V,
  oR as W,
  ci as X,
  C5 as Y,
};

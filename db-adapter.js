// ------------------------------------------------------------------
// Data layer for the registrar dashboard.
//
// If firebase-config.js has real project keys, this connects to your
// live Cloud Firestore database — every write is a real DB write,
// synced in real time to anyone else viewing the page.
//
// If it still has the placeholder keys, this automatically falls back
// to a browser-local database (IndexedDB-backed via localStorage) so
// the dashboard is fully functional the moment you open it — no setup
// required. Nothing else in the app needs to know which one is active.
// ------------------------------------------------------------------

const Store = (() => {
  const hasRealConfig =
    typeof firebaseConfig !== 'undefined' &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith('YOUR_');

  // ---------------- Live mode: Cloud Firestore ----------------
  if (hasRealConfig) {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const col = db.collection('students');

    return {
      mode: 'firestore',
      label: 'Live · Firestore',

      subscribe(onChange, onError) {
        return col.orderBy('createdAt', 'desc').onSnapshot(
          (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
          onError
        );
      },
      async add(data) {
        await col.add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      },
      async update(id, data) {
        await col.doc(id).update(data);
      },
      async remove(id) {
        await col.doc(id).delete();
      },
      async findByRoll(rollNo) {
        const snap = await col.where('rollNo', '==', rollNo).get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      },
      toDate(createdAt) {
        return createdAt && createdAt.toDate ? createdAt.toDate() : null;
      }
    };
  }

  // ---------------- Demo mode: local database ----------------
  const KEY = 'osrs_students_v1';
  const listeners = new Set();

  const uid = () =>
    (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function write(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows));
    const sorted = [...rows].sort((a, b) => b.createdAt - a.createdAt);
    listeners.forEach((fn) => fn(sorted));
  }

  return {
    mode: 'local',
    label: 'Demo · Local database',

    subscribe(onChange) {
      listeners.add(onChange);
      onChange([...read()].sort((a, b) => b.createdAt - a.createdAt));
      return () => listeners.delete(onChange);
    },
    async add(data) {
      const rows = read();
      rows.push({ id: uid(), ...data, createdAt: Date.now() });
      write(rows);
    },
    async update(id, data) {
      write(read().map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    async remove(id) {
      write(read().filter((r) => r.id !== id));
    },
    async findByRoll(rollNo) {
      return read().filter((r) => r.rollNo === rollNo);
    },
    toDate(createdAt) {
      return typeof createdAt === 'number' ? new Date(createdAt) : null;
    }
  };
})();

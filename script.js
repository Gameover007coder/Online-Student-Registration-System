// ------------------------------------------------------------------
// Online Student Registration — app logic
// Reads/writes the "students" collection in Firestore (see firebase-config.js)
// ------------------------------------------------------------------

const form = document.getElementById('reg-form');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('form-status');
const ledgerBody = document.getElementById('ledger-body');
const emptyState = document.getElementById('empty-state');
const countTag = document.getElementById('student-count');
const connectionNote = document.getElementById('connection-note');

const studentsRef = db.collection('students');

// ---- Handle new registration ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('', '');

  const fullName = document.getElementById('fullName').value.trim();
  const rollNo = document.getElementById('rollNo').value.trim();
  const course = document.getElementById('course').value;
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!fullName || !rollNo || !course || !email) {
    setStatus('Please fill in every required field.', 'err');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-label').textContent = 'Enrolling…';

  try {
    // Guard against duplicate roll numbers
    const existing = await studentsRef.where('rollNo', '==', rollNo).get();
    if (!existing.empty) {
      setStatus(`Roll number "${rollNo}" is already registered.`, 'err');
      return;
    }

    await studentsRef.add({
      fullName,
      rollNo,
      course,
      email,
      phone: phone || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    form.reset();
    setStatus(`${fullName} was added to the register.`, 'ok');
  } catch (err) {
    console.error(err);
    setStatus('Could not save — check your Firebase setup (see README).', 'err');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-label').textContent = 'Enroll student';
  }
});

// ---- Live-render the register, ordered by newest first ----
studentsRef.orderBy('createdAt', 'desc').onSnapshot(
  (snapshot) => {
    connectionNote.textContent = 'Connected to Firestore — updates sync live.';
    renderRows(snapshot.docs);
  },
  (err) => {
    console.error(err);
    connectionNote.textContent =
      'Not connected yet — add your Firebase config in firebase-config.js (see README.md).';
  }
);

function renderRows(docs) {
  ledgerBody.innerHTML = '';
  countTag.textContent = `${docs.length} enrolled`;
  emptyState.classList.toggle('visible', docs.length === 0);

  docs.forEach((doc, i) => {
    const s = doc.data();
    const tr = document.createElement('tr');

    const date = s.createdAt && s.createdAt.toDate
      ? s.createdAt.toDate().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

    tr.innerHTML = `
      <td class="col-num">${docs.length - i}</td>
      <td class="student-name">${escapeHtml(s.fullName)}</td>
      <td class="student-roll">${escapeHtml(s.rollNo)}</td>
      <td>${escapeHtml(s.course)}</td>
      <td class="student-date">${date}</td>
      <td class="col-action">
        <button class="row-delete" title="Remove ${escapeHtml(s.fullName)}" data-id="${doc.id}">✕</button>
      </td>
    `;
    ledgerBody.appendChild(tr);
  });

  ledgerBody.querySelectorAll('.row-delete').forEach((btn) => {
    btn.addEventListener('click', () => studentsRef.doc(btn.dataset.id).delete());
  });
}

function setStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${kind}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ------------------------------------------------------------------
// Registrar dashboard — app logic. Talks only to `Store` (db-adapter.js),
// so it works identically whether Store is backed by Firestore or the
// local fallback database.
// ------------------------------------------------------------------

let allStudents = [];
let sortKey = 'createdAt';
let sortDir = 'desc';
let searchTerm = '';

// ---- DOM refs ----
const form = document.getElementById('reg-form');
const submitBtn = document.getElementById('submit-btn');

const ledgerBody = document.getElementById('ledger-body');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-state-title');
const emptySub = document.getElementById('empty-state-sub');
const searchInput = document.getElementById('search-input');
const exportBtn = document.getElementById('export-btn');

const modePill = document.getElementById('mode-pill');
const modePillLabel = document.getElementById('mode-pill-label');
const footerNote = document.getElementById('footer-note');

const chartBody = document.getElementById('chart-body');
const chartEmpty = document.getElementById('chart-empty');

const statTotal = document.getElementById('stat-total');
const statCourses = document.getElementById('stat-courses');
const statCoursesMeta = document.getElementById('stat-courses-meta');
const statWeek = document.getElementById('stat-week');
const statLatest = document.getElementById('stat-latest');
const statLatestMeta = document.getElementById('stat-latest-meta');

const editOverlay = document.getElementById('edit-overlay');
const editForm = document.getElementById('edit-form');
const editCancel = document.getElementById('edit-cancel');

const toastStack = document.getElementById('toast-stack');

// ---- Mode indicator ----
if (Store.mode === 'firestore') {
  modePill.className = 'pill pill--live';
  modePillLabel.textContent = 'Live · Firestore';
  footerNote.textContent = 'Connected to your Firestore project — writes are saved to the cloud.';
} else {
  modePill.className = 'pill pill--demo';
  modePillLabel.textContent = 'Demo · Local database';
  footerNote.textContent =
    'Running on a local browser database — add real Firebase keys in firebase-config.js to switch to a shared cloud database (see README.md).';
}

// ---- Subscribe to data ----
Store.subscribe(
  (rows) => {
    allStudents = rows;
    render();
  },
  () => {
    showToast('Lost connection to the database.', 'error');
  }
);

// ---- Enroll a student ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const rollNo = document.getElementById('rollNo').value.trim();
  const course = document.getElementById('course').value;
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!fullName || !rollNo || !course || !email) {
    showToast('Fill in every required field.', 'error');
    return;
  }

  setBusy(submitBtn, true, 'Enrolling…');
  try {
    const existing = await Store.findByRoll(rollNo);
    if (existing.length) {
      showToast(`Roll number "${rollNo}" is already registered.`, 'error');
      return;
    }
    await Store.add({ fullName, rollNo, course, email, phone: phone || null });
    form.reset();
    showToast(`${fullName} was added to the register.`, 'success');
  } catch (err) {
    console.error(err);
    showToast('Could not save that record. See console for details.', 'error');
  } finally {
    setBusy(submitBtn, false, 'Enroll student');
  }
});

// ---- Search ----
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  render();
});

// ---- Sort ----
document.querySelectorAll('.sortable').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = key === 'createdAt' ? 'desc' : 'asc';
    }
    render();
  });
});

// ---- CSV export ----
exportBtn.addEventListener('click', () => {
  const rows = getVisibleRows();
  if (!rows.length) {
    showToast('Nothing to export yet.', 'error');
    return;
  }
  const header = ['Full Name', 'Roll No', 'Course', 'Email', 'Phone', 'Enrolled'];
  const lines = rows.map((s) => {
    const date = Store.toDate(s.createdAt);
    return [s.fullName, s.rollNo, s.course, s.email, s.phone || '', date ? date.toISOString() : '']
      .map(csvEscape)
      .join(',');
  });
  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student-register.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Exported ${rows.length} record${rows.length === 1 ? '' : 's'}.`, 'success');
});

function csvEscape(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// ---- Edit modal ----
function openEdit(student) {
  document.getElementById('edit-id').value = student.id;
  document.getElementById('edit-fullName').value = student.fullName;
  document.getElementById('edit-rollNo').value = student.rollNo;
  document.getElementById('edit-course').value = student.course;
  document.getElementById('edit-email').value = student.email;
  document.getElementById('edit-phone').value = student.phone || '';
  editOverlay.hidden = false;
}
function closeEdit() { editOverlay.hidden = true; }

editCancel.addEventListener('click', closeEdit);
editOverlay.addEventListener('click', (e) => { if (e.target === editOverlay) closeEdit(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !editOverlay.hidden) closeEdit(); });

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const data = {
    fullName: document.getElementById('edit-fullName').value.trim(),
    rollNo: document.getElementById('edit-rollNo').value.trim(),
    course: document.getElementById('edit-course').value,
    email: document.getElementById('edit-email').value.trim(),
    phone: document.getElementById('edit-phone').value.trim() || null
  };
  try {
    await Store.update(id, data);
    showToast('Changes saved.', 'success');
    closeEdit();
  } catch (err) {
    console.error(err);
    showToast('Could not save changes.', 'error');
  }
});

// ---- Course identity (color + initials helpers) ----
function courseColorVar(course) {
  const key = (course || 'Other').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  return `var(--c-${key}, var(--text-faint))`;
}
function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

// ---- Rendering ----
function getVisibleRows() {
  let rows = [...allStudents];

  if (searchTerm) {
    rows = rows.filter((s) =>
      [s.fullName, s.rollNo, s.course, s.email].some((v) => (v || '').toLowerCase().includes(searchTerm))
    );
  }

  rows.sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (sortKey === 'createdAt') {
      av = Store.toDate(av)?.getTime() ?? 0;
      bv = Store.toDate(bv)?.getTime() ?? 0;
    } else {
      av = (av || '').toLowerCase();
      bv = (bv || '').toLowerCase();
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return rows;
}

function render() {
  renderStats();
  renderChart();
  renderTable();
  renderSortArrows();
}

function renderStats() {
  const total = allStudents.length;
  const courseSet = new Set(allStudents.map((s) => s.course));
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = allStudents.filter((s) => {
    const d = Store.toDate(s.createdAt);
    return d && d.getTime() >= weekAgo;
  }).length;

  statTotal.textContent = total;
  statCourses.textContent = courseSet.size;
  statCoursesMeta.textContent = total ? `${courseSet.size} distinct course${courseSet.size === 1 ? '' : 's'}` : 'no enrollments yet';
  statWeek.textContent = thisWeek;

  if (total) {
    const latest = allStudents[0]; // already sorted desc by createdAt from Store
    statLatest.textContent = latest.fullName;
    statLatestMeta.innerHTML = `<span class="course-badge" style="--course-color:${courseColorVar(latest.course)}"><span class="course-badge__dot"></span>${escapeHtml(latest.course)}</span>`;
  } else {
    statLatest.textContent = '—';
    statLatestMeta.textContent = 'no students yet';
  }
}

function renderChart() {
  if (!allStudents.length) {
    chartBody.innerHTML = '';
    chartBody.appendChild(chartEmpty);
    return;
  }

  const counts = {};
  allStudents.forEach((s) => { counts[s.course] = (counts[s.course] || 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = entries[0][1];

  chartBody.innerHTML = entries
    .map(([course, count]) => {
      const pct = Math.round((count / max) * 100);
      const color = courseColorVar(course);
      return `
        <div class="chart-row" style="--course-color:${color}">
          <div class="chart-row__labels">
            <span class="chart-row__name">${escapeHtml(course)}</span>
            <span class="chart-row__count">${count}</span>
          </div>
          <div class="chart-row__track">
            <div class="chart-row__fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    })
    .join('');
}

function renderTable() {
  const rows = getVisibleRows();
  ledgerBody.innerHTML = '';

  const noneAtAll = allStudents.length === 0;
  const noneMatching = !noneAtAll && rows.length === 0;

  emptyState.classList.toggle('visible', noneAtAll || noneMatching);
  if (noneAtAll) {
    emptyTitle.textContent = 'No students enrolled yet.';
    emptySub.textContent = 'Use the form to add the first record.';
  } else if (noneMatching) {
    emptyTitle.textContent = 'No matches.';
    emptySub.textContent = 'Try a different search term.';
  }

  rows.forEach((s, i) => {
    const tr = document.createElement('tr');
    const date = Store.toDate(s.createdAt);
    const dateLabel = date
      ? date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

    const color = courseColorVar(s.course);
    tr.innerHTML = `
      <td class="col-num">${i + 1}</td>
      <td class="student-name">
        <div class="student-cell">
          <span class="avatar" style="--course-color:${color}">${initials(s.fullName)}</span>
          <span>${escapeHtml(s.fullName)}</span>
        </div>
      </td>
      <td class="student-roll">${escapeHtml(s.rollNo)}</td>
      <td><span class="course-badge" style="--course-color:${color}"><span class="course-badge__dot"></span>${escapeHtml(s.course)}</span></td>
      <td class="student-email">${escapeHtml(s.email)}</td>
      <td class="student-date">${dateLabel}</td>
      <td class="col-action">
        <div class="row-actions">
          <button class="icon-btn icon-btn--edit" title="Edit ${escapeHtml(s.fullName)}" data-id="${s.id}">${pencilIcon}</button>
          <button class="icon-btn icon-btn--danger" title="Remove ${escapeHtml(s.fullName)}" data-id="${s.id}">${trashIcon}</button>
        </div>
      </td>
    `;
    ledgerBody.appendChild(tr);
  });

  ledgerBody.querySelectorAll('.icon-btn--edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const student = allStudents.find((s) => s.id === btn.dataset.id);
      if (student) openEdit(student);
    });
  });

  ledgerBody.querySelectorAll('.icon-btn--danger').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const student = allStudents.find((s) => s.id === btn.dataset.id);
      if (!student) return;
      if (!confirm(`Remove ${student.fullName} from the register?`)) return;
      try {
        await Store.remove(student.id);
        showToast(`${student.fullName} was removed.`, 'success');
      } catch (err) {
        console.error(err);
        showToast('Could not remove that record.', 'error');
      }
    });
  });
}

function renderSortArrows() {
  document.querySelectorAll('.sortable').forEach((th) => {
    const arrow = th.querySelector('.sort-arrow');
    if (th.dataset.sort === sortKey) {
      arrow.textContent = sortDir === 'asc' ? '↑' : '↓';
    } else {
      arrow.textContent = '';
    }
  });
}

// ---- Helpers ----
function setBusy(btn, busy, label) {
  btn.disabled = busy;
  btn.querySelector('.btn-label').textContent = label;
}

function showToast(message, kind = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.textContent = message;
  toastStack.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  }, 3200);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

const pencilIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`;
const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;

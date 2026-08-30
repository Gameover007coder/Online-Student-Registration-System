# Student Enrollment — Registrar Dashboard

A GitHub Pages–hosted registration dashboard with a real database behind it,
live stats, a course-distribution chart, search/sort, inline editing, and CSV
export.

## It works immediately — no setup required

Open `index.html` and it's fully functional right away. It automatically
detects whether you've added real Firebase credentials:

- **No credentials yet →** runs on a local database in your browser
  (`localStorage`). Everything works — add, edit, delete, search, export —
  it just isn't shared between visitors or devices. The top-right pill shows
  **"Demo · Local database."**
- **Real credentials added →** automatically switches to **Cloud Firestore**,
  a real shared database that syncs live to everyone viewing the page. The
  pill shows **"Live · Firestore."**

Nothing else changes when you switch — same UI, same features, same code.

## Why not MySQL / a traditional DBMS directly?

GitHub Pages only serves static files — there's no server behind it, so it
can't run PHP/Node/Python or hold a connection to MySQL/PostgreSQL directly.
Firestore is a serverless database built for exactly this: your static page
talks to it securely over Google's JS SDK, no backend server needed. That's
the standard way to get a real, shared database on a static site.

## Files

```
index.html          dashboard structure
style.css            visual design
db-adapter.js        chooses local DB vs. Firestore automatically
script.js             all dashboard logic (stats, chart, table, modal, toasts)
firebase-config.js    <- put your Firebase project keys here to go live
```

## Going live with a real shared database

1. Go to https://console.firebase.google.com → **Add project** → finish the
   wizard.
2. **Build → Firestore Database → Create database** → start in **test mode**.
3. **Project settings** (gear icon) → **Your apps** → **</>** (web) → register
   an app. Firebase shows you a `firebaseConfig` object — copy it.
4. Paste those values into `firebase-config.js`, replacing the `YOUR_...`
   placeholders. Reload the page — the pill should switch to "Live · Firestore."

### Lock it down before sharing the link publicly

Test mode lets anyone read and write your database. In **Firestore Database →
Rules**, tighten this before going public:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['fullName','rollNo','course','email']);
      allow update, delete: if false; // add Firebase Auth for an admin role to allow these safely
    }
  }
}
```

For real edit/delete permissions in production, add Firebase Authentication
and scope `update, delete` to signed-in admins instead of `false`.

## Host it on GitHub Pages

1. Push all five files to the root of a GitHub repo (or a `/docs` folder).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick `main` / `/ (root)`, save.
3. Your dashboard is live at `https://your-username.github.io/your-repo/`
   within a minute or two.

## Dashboard features

- **Stat cards** — total students, distinct courses, enrolled this week, most
  recent enrollment — update live as data changes.
- **Course distribution chart** — bar per course, sized by share of students.
- **Search** — filters the table live across name, roll no., course, email.
- **Sortable columns** — click any column header to sort; click again to
  reverse.
- **Edit** — pencil icon opens a modal to update any field in place.
- **Delete** — trash icon, with a confirmation prompt.
- **CSV export** — downloads the currently filtered/sorted view.
- **Toasts** — confirm every action instead of a static status line.

## Customizing

- Add/remove form fields in `index.html` (`#reg-form` and the matching
  `#edit-form`), then read/write them in `script.js`.
- Course options live in both `<select id="course">` and
  `<select id="edit-course">` — keep them in sync.
- All colors and fonts are CSS variables at the top of `style.css`.

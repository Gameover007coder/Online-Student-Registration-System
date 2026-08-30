# Online Student Registration System

A static, GitHub Pages–hosted registration page that stores student records in a
real database (Cloud Firestore) and shows them live in a "Class Register" table.

## Why Firebase, and not MySQL/etc.?

GitHub Pages only serves static files (HTML/CSS/JS) — there's no server behind it,
so it can't run PHP/Node/Python or hold an open connection to a traditional DBMS
like MySQL or PostgreSQL. **Firestore** is Google's serverless database: your
static page talks to it directly and securely over its JavaScript SDK, no backend
server required. That's the standard way to get real database storage on a
GitHub Pages (or any static) site.

## Files

```
index.html          the page structure
style.css            chalkboard/ledger theme
firebase-config.js   <- put your Firebase project keys here
script.js            registration + live table logic
```

## 1. Create a Firebase project (free)

1. Go to https://console.firebase.google.com and click **Add project**.
2. Give it a name, finish the wizard (Analytics is optional).
3. In the left sidebar, open **Build → Firestore Database → Create database**.
   Start in **test mode** for now (see the security note below).
4. Go to **Project settings** (gear icon) → scroll to **Your apps** → click the
   **</>** (web) icon → register the app (nickname can be anything).
5. Firebase will show you a `firebaseConfig` object. Copy it.

## 2. Add your config

Open `firebase-config.js` and paste your values in place of the placeholders:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

## 3. Secure your database before going live

Test mode leaves Firestore open to anyone. Before sharing the site publicly, go to
**Firestore Database → Rules** and tighten them, for example to only allow writes
that look like a valid registration and block arbitrary reads/deletes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['fullName','rollNo','course','email']);
      allow update, delete: if false; // lock this down further, or add Firebase Auth for an admin
    }
  }
}
```

For a real admin "delete student" capability, add Firebase Authentication and
restrict `update, delete` to signed-in admins instead of `false`.

## 4. Host it on GitHub Pages

1. Create a new GitHub repo (or use your existing one) and push these four files
   to the root (or a `/docs` folder).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**, pick the
   `main` branch and `/ (root)` folder, then **Save**.
4. GitHub gives you a URL like `https://your-username.github.io/your-repo/` —
   that's your live registration page, usually within a minute or two.

## Customizing

- Add/remove fields in `index.html` (`<form id="reg-form">`), then read/write
  them in `script.js`.
- Course options are in the `<select id="course">` element.
- Colors and fonts are all CSS variables at the top of `style.css`.

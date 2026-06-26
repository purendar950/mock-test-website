# Mock Test Complete Website

A complete mock test website with:

- Student test portal
- Admin control panel
- JSON quiz file import/export
- Timer, answer saving, scoring, review screen
- Firebase Firestore adapter
- Supabase adapter
- GitHub Pages-ready static hosting

## Files

```txt
index.html          Student test page
admin.html          Admin dashboard
styles.css          Responsive styling
app.js              Student quiz engine
admin.js            Admin panel logic
firebase.js         Firebase Firestore adapter
supabase.js         Supabase adapter
data/sample-quiz.json
.env.example
docs/schema.sql     Supabase schema
```

## Quiz JSON format

```json
{
  "id": "sample-quiz",
  "title": "General Knowledge Mock Test",
  "description": "Short description",
  "durationMinutes": 15,
  "passingScore": 50,
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Explanation shown after submission."
    }
  ]
}
```

## Run locally

```bash
npx serve .
```

Open:

- `index.html` for students
- `admin.html` for admins

## GitHub setup

1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Go to repository **Settings → Pages**.
4. Set source to your main branch root.
5. Open the generated GitHub Pages URL.

## Firebase setup

1. Create a Firebase project.
2. Enable Firestore Database.
3. Add a web app in Firebase settings.
4. Copy the Firebase config into `firebase.js`, replacing the `YOUR_...` placeholders.
5. Firestore collections used:
   - `quizzes/{quizId}`
   - `attempts/{autoId}`
6. From the admin panel, choose **Publish to Firebase**.

Example Firestore quiz path:

```txt
quizzes/sample-quiz
```

## Supabase setup

1. Create a Supabase project.
2. Open SQL editor.
3. Run `docs/schema.sql`.
4. Copy your Supabase URL and anon key into `supabase.js`.
5. From the admin panel, choose **Publish to Supabase**.

## Important production notes

This is a frontend-ready complete starter. Before using publicly:

- Add real authentication for admin access.
- Tighten Firebase Security Rules and Supabase RLS policies.
- Do not expose service role keys in frontend code.
- Use only public anon keys in browser code.
- Consider storing admin-only publishing functions on a backend/cloud function.

## Firebase rule starter

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quizzes/{quizId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /attempts/{attemptId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

# StudyPlanner Architecture

Based on the uploaded MockMatrixHub analysis.

## Stack
- Static hosting: Cloudflare Pages / GitHub Pages / Firebase Hosting
- Firebase Auth: Google and email login
- Firebase Firestore: exams, tests, questions, users, attempts
- Supabase optional adapter: quizzes and attempts
- PWA: manifest + service worker
- Payment-ready: Razorpay/Cashfree can set `users/{uid}.isPremium=true` through a secure Cloud Function

## Firestore collections
```txt
exams/{examId}
  title, slug, icon, order
exams/{examId}/tests/{testId}
  title, durationMinutes, free, premium, type, questionCount
exams/{examId}/tests/{testId}/questions/{questionId}
  text, options[], correctIndex, subject, explanation
users/{uid}
  name, email, isPremium, role, createdAt
users/{uid}/attempts/{attemptId}
  examId, testId, score, answers, createdAt
quizzes/{quizId}
  legacy/simple quiz JSON for admin import
attempts/{attemptId}
  public/simple attempts for non-auth demo mode
```

## Premium guard
Free tests can be opened by anyone. Premium tests should check `users/{uid}.isPremium === true` before loading questions. Do not trust frontend-only premium checks for paid production content; enforce Firestore rules too.

## Cost note
Firebase Spark allows roughly 50k reads/day. Large question-by-question reads can hit this quickly, so batch questions per test document or paginate for scale.
```
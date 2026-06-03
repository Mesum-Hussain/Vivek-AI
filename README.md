# Vivek AI

This repo is a working front-end code bundle for **Vivek AI**, originally designed in Figma:
https://www.figma.com/design/mDylqyhYhEOySEtsKrOXBQ/Vivek-AI

It implements a classroom-style experience with:
- **Student Portal**: dashboard → subjects → chat/assignments → submit → profile
- **Teacher Portal**: analytics → student stats → assignments manager → AI review/audit & grade publish

> **No backend:** all data is currently **in-memory mock data**. “AI” responses and BERT-based grading are simulated in the UI.

---

## Demo logins (try these first)

### Student demo
- Email: `nobita.nobi@school.edu`
- Password: `nobita123`

Other student identities are inferred by the email containing:
- `shizuka` → Shizuka
- `dekisugi` → Dekisugi
- `suneo` → Suneo
- `gian` or `takeshi` → Takeshi

### Teacher demo
- Email: `teacher.math@school.edu`
- Password: `teacher123`
- Subject: selected by the demo login (defaults to **Mathematics** / `math`)

---

## Running the code

```bash
npm i
npm run dev
```

Open the local Vite URL (usually `http://localhost:5173`).

---

## Build outputs

### Regular production build

```bash
npm run build
```

### Build a single static HTML file

This repo includes `build:static`, which inlines the built JS/CSS into a single file:

```bash
npm run build:static
```

Output:
- `Vivek_AI.html`

---

## Project layout (what each folder/file does)

- `src/main.tsx`
  - Mounts the React app into `#root` and imports global styles.

- `src/app/App.tsx`
  - **Single root** for the app.
  - Holds the in-memory “databases”:
    - `assignments` (mock seed data)
    - `students` (mock seed data)
    - `submissions` (mock seed data)
  - Implements the student navigation state:
    - `dashboard | assignments | subject | chat | profile`
  - Renders:
    - `LoginPage` when logged out
    - `TeacherPortal` when session role is `teacher`
    - Student portal otherwise

- `src/app/data/subjects.ts`
  - Subject catalog used by both portals (icon + Tailwind color class).

- `src/app/components/*` (core UI)
  - `login-page.tsx` – student/teacher role selection + demo credential flow
  - `sidebar-nav.tsx` – student navigation shell
  - `dashboard.tsx` – student progress overview + charts + teacher guidance carousel
  - `assignments-page.tsx` – student assignment list
  - `subject-view.tsx` – per-subject overview + chart + pending/completed lists
  - `chat-interface.tsx` – AI Study Buddy chat + timer + simulated “BERT” grading
  - `student-profile.tsx` – student profile/preferences UI
  - `teacher-portal.tsx` – teacher tabs + analytics + assignment creation + review/audit
  - `teacher-profile.tsx` – teacher profile card
  - `src/app/components/ui/*` – shared UI primitives (buttons, cards, dialogs, inputs, etc.)

---

## Core user flows

### 1) Student flow
1. **Login** on `LoginPage` (choose Student Portal).
2. **Dashboard**
   - Shows **Subject Performance** pie chart from graded assignments.
   - Shows **Top Performing Subjects**.
   - Shows teacher guidance carousel (if teacher notes exist).
3. **Subjects** (via sidebar)
   - `SubjectView` shows completed vs pending assignments.
4. **Chat / Assignment** (`ChatInterface`)
   - Timer starts when the student sends the first message for an assignment.
   - AI replies are simulated per subject.
   - When time ends (or the student submits early), the app computes a simulated
     “BERT-based” percentage and maps it to a letter grade.
   - Calls `App.handleCompleteStudentAssignment(...)`:
     - updates assignment status to `completed`
     - creates a `Submission` with `chatHistory` + AI feedback
5. **Teacher review** appears in the Teacher Portal’s **Reviews** tab.

### 2) Teacher flow
1. **Login** on `LoginPage` (choose Teacher Portal) and select the subject you teach.
2. `TeacherPortal` tabs:
   - `dashboard` – class-wide analytics and charts
   - `students` – student stats + searchable roster
   - `assignments` – create/manage assignments
   - `reviews` – audit submissions + publish grades
   - `profile` – teacher profile
3. **Assignments manager**
   - Create assignment (title/description/duration/due date).
   - Optional “AI-suggested assignment” generator (mock logic).
4. **Reviews / Audit & Grade publish**
   - Opens a submission audit view.
   - Teacher can override:
     - percentage score
     - letter grade
     - feedback text
   - Publishing calls `App.handleGradeSubmission(...)`, which updates in-memory
     assignment + student analytics.

---

## Implementation notes (important details)

- All state is centralized in `src/app/App.tsx` as in-memory arrays.
- “AI Study Buddy” is simulated in `src/app/components/chat-interface.tsx`.
- Teacher subject scoping is supported:
  - `TeacherPortal` filters assignments/submissions/stats by `teacherSubjectId`.
- `npm run build:static` produces `Vivek_AI.html` using `scripts/build-static-html.mjs`.

---

## Tech stack

- **React + TypeScript**
- **Vite** (dev/build)
- **TailwindCSS** (styling)
- **Radix UI** + **Lucide** icons (UI building blocks)
- **Recharts** (charts)
- **canvas-confetti** (celebration effects)


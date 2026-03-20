# RAGA Health Care

A React + TypeScript healthcare platform prototype with:

- Firebase-backed authentication wiring with a demo fallback
- Dashboard, analytics, and patient management modules
- Zustand state management with persisted session/view preferences
- Service worker registration and local notification support
- Responsive grid/list patient views

## Run locally

```bash
npm install
npm run dev
```

## Firebase setup

Copy `.env.example` to `.env` and provide your Firebase web app credentials. When Firebase variables are missing, the app still supports a demo login:

- Email: `clinician@ragahealthcare.com`
- Password: `CarePulse!2026`

## Notifications

The dashboard includes a "Dispatch ward alert" action that requests notification permission and shows a local notification through the registered service worker.
# raga-hemant

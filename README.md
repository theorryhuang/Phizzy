# Phizzy

Phizzy is a physical therapy app for kids. A therapist assigns a home exercise program, and the app turns it into a superhero story. Each week is a stop on a "Hero Journey" map. Each day lists the exercises to do. Kids record videos of themselves doing the exercises so their therapist can check their form.

Built with **React Native + Expo** and **Firebase** (Auth, Firestore, Storage).

## Features

- **Mission Control (Home)**: today's exercises, overall program progress, and an encouraging message from the child's chosen hero avatar.
- **Program view**: every week of the program with its dates, progress, and a preview of each day.
- **Week and exercise pages**: exercises for each day, with sets/reps, a description, and the child's past recordings.
- **Video recording**: record a new video or upload one from the camera roll. A parent code gate keeps kids from doing this alone. Videos go to Firebase Storage with a progress bar.
- **Hero Journey map**: a story-style map built from the program's weeks.
- **Avatar selection**: pick a hero avatar, loaded from Firebase Storage.

## Tech stack

| Area | Tools |
| --- | --- |
| App | React Native 0.76, Expo SDK 52, Expo Router (file-based routing), TypeScript |
| Backend | Firebase Authentication, Cloud Firestore, Firebase Storage |
| Media | `expo-image-picker` (record/select), `expo-av` (playback) |
| UI | `react-native-progress`, `@expo/vector-icons`, `react-native-reanimated` |

## Getting started

### Prerequisites

- Node.js 18 or newer, and npm
- Xcode (iOS simulator) and/or Android Studio (Android emulator)
- A Firebase project

### 1. Install

```bash
git clone https://github.com/theorryhuang/Phizzy.git
cd Phizzy
npm install
```

### 2. Configure Firebase

Copy the example env file and fill in your Firebase web app settings. You can find them in the Firebase console under **Project settings → General → Your apps**.

```bash
cp .env.example .env
```

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

`.env` is gitignored. Restart the Expo dev server after you change it.

In the Firebase console:

1. **Authentication**: enable the **Email/Password** provider, then add a user for each patient.
2. **Firestore**: create a `programs` collection (see [Data model](#data-model)).
3. **Storage**: create an `avatars/` folder with hero images. Recorded videos go to `videos/`.

### 3. Run

The app uses native modules (`@react-native-firebase`, `expo-dev-client`), so run it as a development build instead of in Expo Go:

```bash
npm run ios       # build and launch on the iOS simulator
npm run android   # build and launch on an Android emulator
npm start         # start the dev server for an existing dev build
```

## Configuration

All paths and settings that used to be hard-coded are now in [`constants/Config.ts`](constants/Config.ts). Most of them can be overridden in `.env`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_STORAGE_VIDEOS_PATH` | `videos` | Storage folder for exercise recordings |
| `EXPO_PUBLIC_STORAGE_AVATARS_PATH` | `avatars` | Storage folder for hero avatar images |
| `EXPO_PUBLIC_PROGRAMS_COLLECTION` | `programs` | Firestore collection that holds programs |
| `EXPO_PUBLIC_DEFAULT_USER_ID` | `default-user` | Program ID to load when nobody is signed in |
| `EXPO_PUBLIC_USE_DEMO_PROGRAM` | `true` | Show a generated 4-week demo program when the user has none |

Story titles for the map (`WEEK_TITLES`), the parent code length, and the default theme color are also set in `Config.ts`.

## Data model

Each document in `programs/{userId}` is keyed by the patient's Firebase Auth UID:

```jsonc
{
  "patientId": "abc123",
  "patientName": "Andrew",
  "therapistId": "t-1",
  "therapistName": "Dr. Smith",
  "totalWeeks": 4,
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2025-01-06",
      "endDate": "2025-01-12",
      "progress": 0,            // 0–100
      "days": {
        "Monday": {
          "exercises": [
            { "name": "Squats", "sets": "3 sets of 8", "description": "Feet shoulder-width apart..." }
          ]
        }
      }
    }
  ],
  "createdAt": "<Timestamp>",
  "updatedAt": "<Timestamp>"
}
```

Videos are stored as `videos/<exercise-slug>-exercise-<timestamp>.<ext>`, for example `videos/calf-raises-exercise-1736200000000.mov`. The exercise page lists the videos whose names start with that exercise's slug.

## Project structure

```
.
├── app/                      # Screens (Expo Router)
│   ├── index.tsx             # Entry: goes to Login or Home
│   ├── login.tsx             # Email/password sign-in (Firebase Auth)
│   ├── avatar-selection.tsx  # Pick a hero avatar
│   ├── (tabs)/               # Bottom tabs: Home, Program, Map
│   ├── program-weeks.tsx     # Full program list
│   ├── week/[weekNumber].tsx
│   ├── exercise/[exerciseName].tsx
│   ├── parent-code.tsx       # Parent gate before recording
│   ├── play.tsx              # Record or upload a video
│   └── upload-complete.tsx
├── firebase/                 # Firestore and Storage helpers
├── constants/Config.ts       # App configuration
├── components/               # Shared UI components
├── hooks/
├── firebaseConfig.js         # Firebase init (reads .env)
└── .env.example
```

## Known limitations

- The parent code is **not verified**. Any 4-digit code is accepted.
- Week `progress` is read from Firestore, but the app never updates it.
- Video metadata comes from Storage. Nothing is written to Firestore, so therapists have no review screen yet.
- `app/(tabs)/explore.tsx` is leftover Expo starter content and is hidden from the tab bar.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` / `npm run android` | Build and run a native dev build |
| `npm run web` | Run in the browser |
| `npm test` | Run Jest in watch mode |
| `npm run lint` | Lint with ESLint (`expo lint`) |

## License

MIT

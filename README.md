# 🎵 Music Track Management App (Next.js)

A modern **Next.js** frontend for managing music tracks via a clean and interactive UI. This project supports full **CRUD operations**, **audio upload**, and **inline playback**, designed as a submission for the _Front-End School 3.0_ challenge. It emphasizes **modular architecture**, **clean code**, and **testability** with `data-testid` attributes.

---

## 🖼️ App Gallery

| Track List View | Track Form |
|------------------|------------|
| ![Track List](https://github.com/user-attachments/assets/aaab84f1-d9e4-4e17-a98a-302eb29cf4d1) | ![Track Form](https://github.com/user-attachments/assets/884d9529-3101-4087-bad4-4e3884afa461) |

---

## ✅ Core Features

### 🎼 Create a Track (Without Audio)

- Modal form to input:
- Optional cover image with format validation and fallback.
- Save metadata independently of the audio file.

### ✏️ Edit Track Metadata

- Edit modal pre-filled with existing info.
- Auto-updates the list on save.

### 🎧 Upload Track Audio

- Supports `.mp3` and `.wav` files.
- File type & size validation.
- Replace/remove existing audio files.

### ❌ Delete a Track

- Deletes from both frontend and backend.
- Includes confirmation dialog.

### 📜 Track List View

- Paginated with sorting (title, artist, genre).
- Filter by metadata with debounce-based search.
- Inline audio playback - only one track plays at a time.

---

## 🌟 Extra Features

- Bulk delete multiple tracks at once.
- Optimistic UI updates for faster UX.
- Waveform visualization for currently playing track.

---

## 🚀 Getting Started

Install dependencies and run the development server:

```bash
npm install

npm run dev
# or
yarn install && yarn dev
# or
pnpm install && pnpm dev
# or
bun install && bun dev


Then open [http://localhost:3000](http://localhost:3000) in your browser.
```

## ⚙️ Building Setup and Bundle Optimization

To improve performance and reduce the initial load time, we optimized the `/tracks` route by **lazy-loading** heavy libraries and components using Next.js `dynamic()` imports.

### 📊 Bundle Comparison

| Route         | Size                | First Load JS       | Notes                                   |
| ------------- | ------------------- | ------------------- | --------------------------------------- |
| `/`           | 175 B               | 105 kB              | No significant change                   |
| `/_not-found` | 136 B               | 101 kB              | No significant change                   |
| `/tracks`     | **138 kB → 103 kB** | **255 kB → 210 kB** | 🚀 Optimized by lazy loading components |

---

### 📦 What Was Optimized?

On the `/tracks` page, the following large components and libraries were dynamically imported:

```ts
const AudioPlayer = dynamic(() =>
  import('@/features/tracks/components/audio-player').then(mod => mod.AudioPlayer)
);
const TrackModal = dynamic(() =>
  import('@/features/tracks/components/track-modal').then(mod => mod.TrackModal)
);
const DeleteTrackDialog = dynamic(() =>
  import('@/features/tracks/components/delete-track-dialog').then(mod => mod.DeleteTrackDialog)
);
const UploadTrackModal = dynamic(() =>
  import('@/features/tracks/components/upload-track-modal').then(mod => mod.UploadTrackModal)
);
```

### ✅ Result

* Reduced `/tracks` route size by **35 kB**
* Reduced first load JS by **45 kB**
* Improved performance and time to interactive for users visiting the `/tracks` route

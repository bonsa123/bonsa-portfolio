# Setup Instructions

## 1. Portrait

The fallback portrait is already in `src/assets/bonsa.jpg`. Replace that file if
you want to use a different portrait.

## 2. Install dependencies

Open a terminal in this folder and run:

```
npm install
```

## 3. Start the portfolio (frontend only)

```
npm run dev
```

Open http://localhost:5173

## 4. Start with admin panel (both frontend + backend)

Open **two terminals**:

**Terminal 1 — Backend API:**
```
npm run server
```

**Terminal 2 — Frontend:**
```
npm run dev
```

Or run both together:
```
npm run dev:all
```

## 5. Access admin panel

Go to: http://localhost:5173/admin

The dashboard lets you manage your profile and social links, page copy and navigation labels, profile and project images, projects, skills, education, and contact messages.

Default password: `bonsa@admin2024`

**Change the password** in `server/index.js` → `ADMIN_PASSWORD`

## 6. Build for production

```
npm run build
```

Output goes to the `dist/` folder.

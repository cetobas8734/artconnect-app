# ArtConnect

**ArtConnect** adalah platform CRM (Customer Relationship Management) yang dirancang khusus untuk seniman visual Indonesia, membantu mengelola karya seni, kontak pelanggan, pipeline penjualan, dan analitik bisnis.

---

## 🎨 Tentang Proyek

ArtConnect membantu seniman visual untuk:
- 📦 **Mengelola Portfolio:** Upload, edit, dan organize karya seni dengan metadata lengkap
- 👥 **Manajemen Kontak:** Track potential buyers, collectors, dan gallery contacts
- 📊 **Sales Pipeline:** Visualisasi sales opportunities dalam Kanban board
- 📈 **Analytics:** Insights tentang revenue, artwork performance, dan conversion rates

**Target Users:** Seniman visual profesional dan semi-profesional yang ingin mengelola bisnis seni mereka secara efisien.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | Vue 3 (Composition API) |
| **Build Tool** | Vite 7.1.7 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Authentication** | Firebase Auth (Google Sign-In - Free Tier) |
| **Backend API** | Node.js + Express + Prisma (separate project) |
| **Database** | MySQL (managed by backend) |
| **Testing** | Vitest + Vue Test Utils + happy-dom |

### Architecture Overview

**Hybrid Approach:**
- **Firebase Auth** handles authentication (Google OAuth) - Free tier
- **Custom REST API** (Node.js backend - separate repo) handles business logic & data
- **Frontend** calls Firebase for auth, then uses JWT tokens to call backend API

---

## 📋 Prerequisites

Sebelum memulai, pastikan installed:

- **Node.js:** v18+ ([Download](https://nodejs.org/))
- **npm:** v9+ (included dengan Node.js)
- **Git:** ([Download](https://git-scm.com/))
- **VS Code:** Recommended ([Download](https://code.visualstudio.com/))

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```powershell
git clone https://github.com/your-org/artconnect-frontend.git
cd artconnect-frontend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan credentials:

```powershell
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Firebase Auth (Google Sign-In only)
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Backend API
VITE_API_BASE_URL=http://localhost:3000/api
```

**Get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project (Free Spark Plan)
3. Enable Google Sign-In: Authentication → Sign-in method → Google → Enable
4. Go to Project Settings → General → Your apps → Copy config values

**Backend API:**
- Backend project (artconnect-backend) runs separately
- Default dev: `http://localhost:3000/api`
- Production: Update dengan backend production URL

### 4. Start Development Server

```powershell
npm run dev
```

Open browser → http://localhost:5173

---

## 📜 Available Scripts

```powershell
# Development
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run all tests (single run)
npm run test:watch   # Watch mode (auto re-run)
npm run coverage     # Generate coverage report

# Utilities
npm run extract:pdf  # Extract SKPL PDF to text (dev utility)
```

---

## 📂 Project Structure

```
artconnect-frontend/
├── public/                # Static assets
├── src/
│   ├── main.js            # App entry point
│   ├── App.vue            # Root component
│   ├── assets/            # Images, styles
│   ├── components/        # Vue components
│   ├── modules/           # Feature modules (future)
│   │   ├── auth/          # Authentication
│   │   ├── artworks/      # Artwork management
│   │   ├── contacts/      # Contact management
│   │   ├── pipeline/      # Sales pipeline
│   │   └── analytics/     # Analytics & reporting
│   ├── router/            # Vue Router (future)
│   ├── composables/       # Composable functions
│   ├── services/          # API services (Firebase)
│   └── utils/             # Utility functions
├── tests/                 # Test files (Vitest)
├── docs/                  # Project documentation
├── scripts/               # Build/dev scripts
├── .env.example           # Environment variables template
├── vite.config.js         # Vite configuration
├── jsconfig.json          # JavaScript project config
└── package.json           # Dependencies & scripts
```

**See detailed structure:** [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

---

## 📚 Documentation

Comprehensive documentation available dalam folder `docs/`:

### Development Guides

- **[GIT_STRATEGY.md](docs/GIT_STRATEGY.md)** - Git workflow, branching strategy, commit conventions
- **[DEVELOPMENT_CHECKLIST.md](docs/DEVELOPMENT_CHECKLIST.md)** - Daily developer checklist (pre-commit, PR, testing)
- **[PATH_ALIASES.md](docs/PATH_ALIASES.md)** - Path alias setup (@/...) dan usage examples
- **[TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)** - Vitest setup, test patterns, mocking Firebase
- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Cheat sheet (commands, snippets, utilities)

### Project Management

- **[AGILE_SCRUM_PLAN.md](docs/AGILE_SCRUM_PLAN.md)** - Scrum implementation plan (roles, ceremonies, estimation)
- **[SPRINT_CEREMONIES.md](docs/SPRINT_CEREMONIES.md)** - Detailed ceremony guides (stand-up, planning, review, retro)
- **[SPRINT_TRACKING.md](docs/SPRINT_TRACKING.md)** - Sprint board structure, WIP limits, metrics
- **[DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)** - DoR/DoD criteria per task type
- **[BACKLOG_MAPPING.md](docs/BACKLOG_MAPPING.md)** - SKPL requirements → user stories mapping
- **[SPRINT_ROADMAP.md](docs/SPRINT_ROADMAP.md)** - 16-week sprint plan with milestones

### Architecture

- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Folder structure, naming conventions, patterns

---

## 🎯 Key Features (Planned)

### MVP (Sprint 1-9)

- ✅ **Authentication:** Register, login, logout, profile management
- 🔄 **Artwork CRUD:** Create, read, update, delete artworks dengan image upload
- 🔄 **Contact Management:** Manage potential buyers dan collectors
- 🔄 **Sales Pipeline:** Kanban board untuk track sales opportunities

### Post-MVP (Sprint 10+)

- 📊 **Analytics Dashboard:** Revenue metrics, artwork performance
- 🔍 **Search & Filter:** Advanced search across artworks dan contacts
- 📄 **Export Reports:** PDF/CSV export untuk analytics
- 📱 **Mobile Responsive:** Optimized untuk tablet dan mobile

**Full roadmap:** [docs/SPRINT_ROADMAP.md](docs/SPRINT_ROADMAP.md)

---

## 🧪 Testing

ArtConnect menggunakan **Vitest** untuk unit dan component testing.

```powershell
# Run all tests
npm run test

# Watch mode (during development)
npm run test:watch

# Coverage report
npm run coverage
```

**Coverage targets:**
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+

**Test organization:**
```
tests/
├── unit/              # Pure function tests (utils, services)
├── components/        # Vue component tests
└── integration/       # Multi-component integration tests
```

**More details:** [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build tool configuration + Vitest setup |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.node.json` | TypeScript config for Node.js (Vite config) |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration (for Tailwind) |
| `.env.example` | Environment variables template (Firebase config) |
| `.env.local` | Local environment variables (**gitignored**) |
| `package.json` | Dependencies, scripts, project metadata |

---

## 🔐 Environment Variables

**Required variables** (dalam `.env.local`):

```bash
# Firebase Auth (Google Sign-In)
VITE_FIREBASE_API_KEY          # Firebase API key (public, safe to expose)
VITE_FIREBASE_AUTH_DOMAIN      # Firebase auth domain
VITE_FIREBASE_PROJECT_ID       # Firebase project ID
VITE_FIREBASE_APP_ID           # Firebase app ID

# Backend REST API
VITE_API_BASE_URL              # Backend API base URL (e.g., http://localhost:3000/api)
```

**Important:**
- Never commit `.env.local` (contains sensitive data)
- Use `.env.example` as template
- All variables must be prefixed dengan `VITE_` to be exposed to client
- Firebase config is public-safe (protected by Firebase Security Rules)
- Backend handles sensitive operations (database queries, business logic)

---

## 🚀 Deployment

### Build for Production

```powershell
npm run build
```

Output: `dist/` folder (ready untuk deployment)

### Preview Production Build Locally

```powershell
npm run preview
```

Open browser → http://localhost:4173

### Deploy to Firebase Hosting (Future)

```powershell
firebase deploy --only hosting
```

**Deployment targets:**
- Firebase Hosting (recommended)
- Vercel
- Netlify
- Any static hosting provider

---

## 🤝 Contributing

### Development Workflow

1. **Pick task** dari sprint board
2. **Create feature branch:** `git checkout -b feature/artwork-upload`
3. **Develop & test:** Write code + tests
4. **Commit:** Follow conventional commits (`feat:`, `fix:`, etc.)
5. **Push & open PR:** `git push origin feature/artwork-upload`
6. **Code review:** Address feedback
7. **Merge:** Squash and merge to `develop`

**Full workflow:** [docs/GIT_STRATEGY.md](docs/GIT_STRATEGY.md)

### Code Standards

- **Vue 3 Composition API** (not Options API)
- **TypeScript** for type safety
- **Tailwind CSS** for styling (utility-first approach)
- **Conventional commits** for commit messages
- **Path alias `@`** for imports (`@/modules/...`)
- **Test coverage** >80% for new code
- **Code review** required before merge

### Branching Strategy

```
main          # Production-ready code
  ↑
develop       # Integration branch
  ↑
feature/*     # Feature development
fix/*         # Bug fixes
hotfix/*      # Critical production fixes
```

---

## 📞 Support & Contact

**Project Documentation:** [docs/](docs/)  
**Issue Tracker:** GitHub Issues (coming soon)  
**Team Communication:** [Specify your communication channel]

**Key Contacts:**
- Product Owner: [Name]
- Scrum Master: [Name]
- Tech Lead: [Name]

---

## 📄 License

[Specify license here - e.g., MIT, Apache 2.0, or Proprietary]

---

## 🙏 Acknowledgments

- **Vue.js Team** for amazing framework
- **Vite Team** for blazing fast build tool
- **Firebase** for backend infrastructure
- **Vitest Team** for modern testing solution

---

## 📊 Project Status

**Current Sprint:** Sprint 1 (Foundation & Auth)  
**MVP Target:** Week 18 (Sprint 9)  
**Production Launch:** Week 24 (Sprint 12)

**Progress:**
- ✅ Project setup complete
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Testing infrastructure configured
- ✅ Path aliases configured
- 🔄 Authentication module (in progress)

**Next Up:**
- User registration flow
- Firebase Authentication integration
- Profile management

---

**Last Updated:** [Date]  
**Version:** 1.0.0  
**Maintained by:** ArtConnect Development Team

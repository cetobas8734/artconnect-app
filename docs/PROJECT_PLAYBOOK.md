# ArtConnect – Agile Scrum & Engineering Playbook

Audience: Tim pengembang ArtConnect (frontend Vue + Vite) dan anggota kelompok non-teknis yang terlibat dalam proses Scrum. Dokumen ini menjadi panduan praktis harian untuk bekerja konsisten, cepat, dan rapi.

---

## 1) Branch Summary & Strategy

- Protected branches:
  - main (atau Queen di repo default) – production-ready; rilis hanya via PR.
  - develop – integrasi sprint (opsional jika tim >3 orang). Jika tim kecil, bisa skip dan PR langsung ke main dengan aturan ketat.
- Working branches:
  - feature/<short-name> – fitur baru. Contoh: `feature/auth-login`.
  - fix/<short-name> – bug fix. Contoh: `fix/kanban-dnd`.
  - chore/<short-name> – tugas non-fitur. Contoh: `chore/ci-lint`.
  - docs/<short-name> – dokumentasi. Contoh: `docs/playbook`.
- Rules:
  - 1 task = 1 branch = 1 PR. Ukuran PR < 300 LOC efektif.
  - Rebase kecil diperbolehkan; hindari merge commit berlapis.
  - Nama branch kebab-case, deskriptif, tanpa spasi.

### Commit Convention (Conventional Commits)
- Format: `type(scope): summary`
- type: feat, fix, chore, docs, refactor, test, perf, build, ci.
- Contoh: `feat(auth): email/password login via Firebase`.

---

## 2) Definition of Ready (DoR) & Definition of Done (DoD)

- DoR – sebuah item siap dikerjakan jika:
  - Tujuan jelas, acceptance criteria tertulis, dan terhubung ke SKPL (ID SRS bila ada).
  - Scope disepakati, dependency/blocked tercatat, estimasi SP tersedia.
  - UI mock/wireframe atau UX note tersedia jika menyangkut UI.
- DoD – sebuah item dinyatakan selesai jika:
  - Kriteria penerimaan (AC) terpenuhi; fitur dapat didemo.
  - Unit/component test minimal 1 happy-path + 1 edge-case; test lulus.
  - Build PASS, tidak mematahkan lint (jika ada) dan coverage tidak turun signifikan.
  - Code reviewed dan di-approve minimal 1 orang.
  - Dokumentasi singkat: README/notes, komentar penting, atau Story.
  - Feature flag/guard (jika perlu) dan tidak mengganggu fitur lain.

---

## 3) Agile Scrum Plan (Singkat & Praktis)

- Roles:
  - Product Owner (PO): memelihara backlog, prioritas, acceptance.
  - Scrum Master (SM): fasilitasi seremonial, hilangkan blocker.
  - Dev Team: implementasi, testing, demo.
- Cadence:
  - Sprint 1–2 minggu (rekomendasi 2 minggu untuk ritme stabil).
  - Harian: 15 menit daily stand-up.
- Estimasi: Story Points (1, 2, 3, 5, 8, 13). Kecilkan scope bila >8.
- Backlog hygiene:
  - Tema MVP High Priority (auth, CRUD artworks/contacts, dashboard dasar) dikerjakan lebih dulu.
  - Medium (pipeline Kanban, activity logging, search/filter) menyusul.
  - Low (export lanjutan, notifikasi real-time) masuk sprint berikutnya.

---

## 4) Sprint Ceremonies

- Sprint Planning (1–2 jam):
  - Tentukan Sprint Goal dari prioritas tertinggi SKPL.
  - Breakdown user story → tugas konkrit (dev/test/docs).
  - Estimasi SP dan tetapkan WIP limit per kolom board.
- Daily Stand-up (15 menit):
  - Apa yang dikerjakan kemarin, rencana hari ini, blocker.
  - Fokus outcome, bukan activity report panjang.
- Backlog Refinement (60–90 menit/minggu):
  - Rapikan AC, estimasi awal, pecah cerita terlalu besar.
- Sprint Review (30–60 menit):
  - Demo fitur ke PO/stakeholders; catat feedback & acceptance.
- Sprint Retrospective (30–60 menit):
  - Lanjutkan hal baik; hentikan yang tidak efektif; action items 1–3 hal.

---

## 5) Sprint Tracking

- Board kolom minimal: Backlog → Ready → In Progress → In Review → Testing → Done.
- WIP limit: In Progress (≤ 2 per dev), In Review (≤ 4 total).
- Metrics: burndown chart, throughput, lead time, review time.
- Definition per kolom:
  - Ready: DoR terpenuhi; desain/AC jelas.
  - In Progress: branch dibuat; pekerjaan aktif.
  - In Review: PR dibuka; build/test PASS.
  - Testing: QA/UAT atau pairing verifikasi.
  - Done: DoD terpenuhi; PR merged.

---

## 6) Development Checklist (per task)

- [ ] Sinkron dengan main; buat branch feature/…
- [ ] Implementasi minimal, fokus AC; tambahkan test.
- [ ] Jalankan local build/test; pastikan PASS.
- [ ] Commit konvensional; push; buka PR singkat.
- [ ] Self-review: komentar bagian tricky; screenshot/vid hasil.
- [ ] Minta review; perbaiki feedback; merge via squash.

---

## 7) Project Structure (usulan bertahap)

Struktur saat ini (ringkas):
- `src/` – App.vue, main.js, components/HelloWorld.vue

Target struktur bertahap (tetap sederhana)：
- `src/assets/` – ikon, gambar statis.
- `src/components/` – komponen reusable (UI form, table, modal).
- `src/modules/` – domain feature (artworks, contacts, auth, pipeline, analytics).
- `src/modules/<feature>/components|pages|stores|services`
- `src/router/` – definisi rute (opsional saat mulai routing).
- `src/styles/` – global styles.
- `src/utils/` – helper/mappers/formatters.
- `tests/` – unit & component tests (Vitest).

Catatan: gunakan alias `@` → `src` (sudah dikonfigurasi).

---

## 8) Path Aliases Setup (sudah diatur)

- Alias: `@` → `src`
- Implementasi:
  - `vite.config.js` → `resolve.alias['@'] = fileURLToPath(new URL('./src', import.meta.url))`
  - `jsconfig.json` → paths `"@/*": ["src/*"]`
- Cara pakai: `import Hello from '@/components/HelloWorld.vue'`

---

## 9) Quick Reference (scripts & run)

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build prod: `npm run build`
- Preview prod: `npm run preview`
- Test (Vitest): `npm run test` | watch: `npm run test:watch` | coverage: `npm run coverage`
- Ekstrak SKPL PDF ke teks: `npm run extract:pdf`

---

## 10) Testing Strategy (Vite + Vitest)

- Framework: Vitest + @vue/test-utils + happy-dom.
- Konfigurasi: sudah ditambahkan di `vite.config.js` bagian `test`.
- Lokasi test: `tests/**/*.spec.{js,ts}`.
- Jenis test:
  - Unit: util, composables, mappers.
  - Component: komponen Vue (render, props, interaksi, event).
  - Integration ringan: page-level dengan mocking service.
- Pedoman:
  - Minimal 1 happy-path + 1 edge-case per fitur.
  - Gunakan `data-test="..."` untuk selektor stabil.
  - Mock Firebase SDK pada unit/component test (hindari panggilan jaringan).
- Target awal: cakupan bertahap; fokus stabilitas vs angka besar.

---

## 11) Code Review & Quality Gates

- Wajib PR; minimal 1 approval.
- Checklist reviewer:
  - Kode mudah dibaca, modular, tanpa duplikasi besar.
  - Test ada dan lulus; tidak menurunkan kualitas.
  - Tidak ada secret/credential di repo; gunakan `.env.local`.
  - Kesesuaian DoD & AC; UI konsisten.
- Quality gates per PR: Build PASS, Test PASS. (Lint dapat ditambahkan kemudian.)

---

## 12) Environments & Secrets

- File contoh: `.env.example` (sudah ada). Copy ke `.env.local`.
- Vite mewajibkan prefix `VITE_` agar tersedia di client code.
- Simpan nilai Firebase (API key, domain, project id, dll) di `.env.local`.
- Jangan commit `.env.local`. Pastikan `.gitignore` mengabaikannya (tambahkan jika belum).

---

## 13) Release & Versioning (sederhana)

- Rilis dilakukan dari main (atau Queen jika itu default).
- Tag: `vX.Y.Z` (contoh: v0.1.0). Changelog ringkas di PR merge.
- Deployment: otomatis via platform (Vercel/Netlify) atau manual sesuai kebutuhan.

---

## 14) Mapping SKPL → Backlog (contoh ringkas)

- High Priority MVP:
  - Auth & Profil (SRS-F-001..006)
  - CRUD Artworks (SRS-F-007..011)
  - CRUD Contacts (SRS-F-012..015)
  - Dashboard dasar (SRS-F-005, F-020 ringkas)
- Medium:
  - Pipeline Kanban (SRS-F-018..019)
  - Activity logging (SRS-F-016..017)
  - Search & Filter (SRS-F-022..023)
- Low:
  - Export/Backup (SRS-F-021, F-024..025)

---

## 15) Roadmap Sprint (template 4–6 minggu)

- Sprint 1: Setup proyek (alias, testing), Auth basic, struktur modul, halaman daftar artworks (read-only).
- Sprint 2: CRUD Artworks + upload gambar + pencarian dasar; Dashboard ringkas.
- Sprint 3: Contacts CRUD + activity logging; Kanban dasar (drag & drop status karya).
- Sprint 4: Analytics ringan (counter/trend), export minimal, polishing & hardening.

---

## 16) Referensi Teknis

- Vue 3 docs: https://vuejs.org/
- Vite config: https://vite.dev/config/
- Vitest: https://vitest.dev/
- Vue Test Utils: https://test-utils.vuejs.org/
- Firebase docs: https://firebase.google.com/docs
- WCAG 2.1: https://www.w3.org/TR/WCAG21/

---

## 17) Appendix – Tips Implementasi

- Performansi: gunakan lazy-loading route, compress gambar (client/server), dan caching daftar.
- A11y: pastikan keyboard navigable; gunakan aria-attributes pada komponen interaktif (Kanban, modal).
- Firestore: rencanakan index (array-contains, composite) untuk query filter/sort; batasi dokumen <1MB.
- Error UX: selalu tampilkan feedback yang actionable; jangan tampilkan pesan teknis mentah ke user.

Selamat bekerja! Simpan hal-hal yang “tetap” di dokumen ini, dan tambahkan catatan sprint-ke-sprint di alat tracking (Trello/Jira) agar tidak bengkak di README.

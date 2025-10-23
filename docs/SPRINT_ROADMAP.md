# Sprint Roadmap – ArtConnect

## Overview

16-week sprint roadmap untuk **ArtConnect Frontend** development, covering MVP (9 sprints) dan post-MVP enhancements (3+ sprints).

**Sprint Duration:** 2 weeks  
**Team Size:** 5 developers  
**Target Velocity:** 30-40 story points/sprint

**Architecture Note:**
- **Frontend (this project):** Vue 3 + Vite, Firebase Auth (Google Sign-In only)
- **Backend (separate project):** Node.js + Express + Prisma + MySQL (artconnect-backend)
- Backend development happens **in parallel** - separate repo, separate sprint planning
- Frontend communicates dengan backend via REST API

---

## Roadmap Timeline

```
Sprint 1-2:   Foundation (Auth, Setup, Navigation)
Sprint 3-5:   Artwork Management (CRUD + Image Upload)
Sprint 6-7:   Contact Management (CRM)
Sprint 8-9:   Sales Pipeline (Kanban)
Sprint 10-11: Analytics & Dashboard
Sprint 12:    Polish, Testing, Bug Fixes
Sprint 13+:   Future Enhancements
```

---

## Sprint 1: Foundation & Authentication

**Duration:** Week 1-2  
**Goal:** Setup project infrastructure dan implement authentication.  
**Theme:** "First Login"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-1.1 | User Registration (Google Sign-In) | 3 | 001 |
| US-1.2 | User Login (Google Sign-In) | 2 | 002 |
| US-1.3 | User Logout | 2 | 003 |
| US-6.2 | Quick Access Menu (Navbar) | 3 | 006 |
| TECH | Firebase Auth setup (Google OAuth) | 3 | - |
| TECH | Vue Router setup | 2 | - |
| TECH | Testing infrastructure (Vitest) | 2 | - |
| TECH | Axios setup for API calls | 2 | - |

**Total:** 19 points (conservative first sprint)

### Key Deliverables

- ✅ Firebase Authentication integration (Google Sign-In only)
- ✅ Register, Login, Logout flows working
- ✅ ID Token obtained from Firebase
- ✅ Navigation bar dengan auth state
- ✅ Route guards (protect authenticated routes)
- ✅ Testing setup complete
- ✅ Axios configured untuk backend API calls
- ✅ Project structure established

### Success Metrics

- Users can sign in dengan Google successfully
- Firebase ID Token retrieved dan stored
- Auth state persists across page refreshes
- Protected routes redirect unauthenticated users
- All tests passing (>80% coverage)

### Backend Dependency

**Backend must provide:**
- `POST /api/auth/verify` - Verify Firebase ID token, return JWT
- User JWT used untuk subsequent API calls

**Backend sprint:** Parallel Sprint 1 (Auth endpoints)

---

## Sprint 2: Profile & Layout Foundation

**Duration:** Week 3-4  
**Goal:** Complete user management dan establish layout patterns.  
**Theme:** "My Profile"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-1.4 | Profile Management | 5 | 004 |
| TECH | Shared component library (BaseButton, BaseInput, etc.) | 5 | - |
| TECH | Layout components (DefaultLayout, AuthLayout) | 3 | - |
| TECH | Global styles & CSS variables | 3 | - |
| TECH | Error handling & toast notifications | 5 | - |

**Total:** 21 points

### Key Deliverables

- ✅ View & edit profile functionality
- ✅ Reusable base components (buttons, inputs, modals)
- ✅ Consistent layout structure
- ✅ Toast notification system
- ✅ Error boundary implementation

### Success Metrics

- Profile data stored dan retrieved from Firestore
- Base components reusable across features
- Consistent UI/UX patterns established

---

## Sprint 3: Artwork Creation & Upload

**Duration:** Week 5-6  
**Goal:** Enable users to create artworks dan upload images.  
**Theme:** "First Artwork"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-2.1 | Add New Artwork | 5 | 007 |
| US-2.2 | Upload Artwork Image | 8 | 011 |
| TECH | Firebase Storage integration | 3 | - |
| TECH | Image compression & thumbnail generation | 5 | - |

**Total:** 21 points

### Key Deliverables

- ✅ Artwork creation form dengan validation
- ✅ Image upload UI (file picker, preview)
- ✅ API integration: POST /api/artworks (dengan multipart/form-data)
- ✅ Progress indicators during upload
- ✅ Artwork data displayed after creation
- ✅ Error handling untuk failed uploads

### Success Metrics

- Users can create artwork dengan complete metadata
- Images uploaded successfully (frontend handles file selection)
- Form validation prevents invalid data
- API integration working (backend handles storage)

### Backend Dependency

**Backend must provide:**
- `POST /api/artworks` - Create artwork + upload image (multipart/form-data)
- Backend handles image storage (local/AWS S3)
- Backend generates thumbnails (4 sizes: 150px, 400px, 800px, original)
- Returns artwork object dengan image URLs

**Backend sprint:** Parallel Sprint 3 (Artwork CRUD endpoints + file upload)

### Risks & Mitigations

**Risk:** Large image upload performance  
**Mitigation:** Client-side compression before upload, progress indicators

**Risk:** Storage quota limits  
**Mitigation:** Monitor Firebase Storage usage, implement file size limits

---

## Sprint 4: Artwork Viewing & Editing

**Duration:** Week 7-8  
**Goal:** Complete artwork CRUD operations.  
**Theme:** "Manage My Collection"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-2.3 | View Artwork List | 5 | 008 |
| US-2.4 | View Artwork Detail | 3 | 008 |
| US-2.5 | Edit Artwork | 5 | 009 |
| US-2.6 | Delete Artwork | 3 | 010 |
| TECH | Firestore queries optimization | 3 | - |

**Total:** 19 points

### Key Deliverables

- ✅ Artwork grid layout (responsive)
- ✅ Artwork detail page dengan full metadata
- ✅ Edit artwork form (pre-filled)
- ✅ Delete artwork dengan confirmation
- ✅ Empty states & loading states

### Success Metrics

- Artwork list loads <2s
- Grid responsive pada mobile/tablet/desktop
- Edit/delete operations successful
- Optimistic UI updates untuk better UX

---

## Sprint 5: Artwork Search & Filtering

**Duration:** Week 9-10  
**Goal:** Enhance artwork discovery dengan search dan filters.  
**Theme:** "Find My Art"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-2.7 | Search Artworks | 3 | 012 |
| US-2.8 | Filter Artworks | 5 | 013 |
| TECH | Firestore indexing untuk queries | 2 | - |
| TECH | Debounced search implementation | 2 | - |

**Total:** 12 points (lighter sprint, catch up on tech debt)

### Key Deliverables

- ✅ Real-time search functionality
- ✅ Filter by category, status
- ✅ Combined filters working
- ✅ Clear filters option
- ✅ Performance optimization

### Success Metrics

- Search results appear instantly (<200ms)
- Filters combine correctly (AND logic)
- No unnecessary Firestore reads

### Buffer Time

- Code refactoring
- Test coverage improvements
- Documentation updates
- Bug fixes from previous sprints

---

## Sprint 6: Contact Management (Part 1)

**Duration:** Week 11-12  
**Goal:** Enable contact creation dan viewing.  
**Theme:** "My Network"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-3.1 | Add New Contact | 5 | 014 |
| US-3.2 | View Contact List | 3 | 015 |
| US-3.3 | View Contact Detail | 2 | 015 |
| TECH | Contact module structure setup | 2 | - |

**Total:** 12 points

### Key Deliverables

- ✅ Contact creation form
- ✅ Contact list view
- ✅ Contact detail page
- ✅ Email & phone validation

### Success Metrics

- Contact data stored dalam Firestore
- Validation prevents invalid emails/phones
- List sortable by name, date

---

## Sprint 7: Contact Management (Part 2)

**Duration:** Week 13-14  
**Goal:** Complete contact CRUD operations.  
**Theme:** "Update My Network"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-3.4 | Edit Contact | 3 | 016 |
| US-3.5 | Delete Contact | 2 | 017 |
| TECH | Contact search & filter | 3 | - |

**Total:** 8 points (light sprint, prepare for pipeline complexity)

### Key Deliverables

- ✅ Edit contact functionality
- ✅ Delete contact dengan confirmation
- ✅ Contact search (optional)

### Buffer Time

- Sprint 8 preparation (pipeline design review)
- Technical spike: drag-and-drop libraries
- Performance testing
- Security audit

---

## Sprint 8: Sales Pipeline (Part 1)

**Duration:** Week 15-16  
**Goal:** Implement Kanban board visualization.  
**Theme:** "Track My Deals"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-4.1 | View Pipeline Kanban Board | 8 | 018 |
| US-4.2 | Add Sales Opportunity | 5 | 019 |
| TECH | Kanban board component | 5 | - |
| TECH | Opportunity model design | 2 | - |

**Total:** 20 points

### Key Deliverables

- ✅ Kanban board dengan 4 columns (Inquiry, Negotiation, Won, Lost)
- ✅ Opportunity cards dengan key info
- ✅ Add opportunity form
- ✅ Firestore structure untuk opportunities

### Success Metrics

- Board renders all opportunities correctly
- Cards display: contact, artwork, value, date
- Empty states per column
- Performance: <2s load time

### Risks & Mitigations

**Risk:** Drag-and-drop complexity  
**Mitigation:** Use proven library (vue-draggable), technical spike dalam Sprint 7

**Risk:** Firestore query complexity  
**Mitigation:** Design data model carefully, test queries early

---

## Sprint 9: Sales Pipeline (Part 2)

**Duration:** Week 17-18  
**Goal:** Complete pipeline interactions (drag-and-drop, editing).  
**Theme:** "Move My Deals"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-4.3 | Update Opportunity Stage (Drag-and-Drop) | 8 | 020 |
| US-4.4 | Edit Opportunity | 3 | 020 |
| TECH | Drag-and-drop integration | 5 | - |

**Total:** 16 points

### Key Deliverables

- ✅ Drag-and-drop cards antar columns
- ✅ Firestore updates on stage change
- ✅ Edit opportunity modal/form
- ✅ Optimistic UI updates

### Success Metrics

- Drag-and-drop smooth dan intuitive
- Stage updates reflect immediately
- No data loss during drag operations

### MVP Completion

🎉 **End of Sprint 9 = MVP Complete!**

---

## Sprint 10: Analytics Foundation

**Duration:** Week 19-20  
**Goal:** Implement revenue analytics dan dashboard.  
**Theme:** "See My Success"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-5.1 | Revenue Analytics Dashboard | 8 | 021 |
| US-6.1 | Dashboard Overview | 5 | 005 |
| TECH | Chart library integration (Chart.js) | 3 | - |

**Total:** 16 points

### Key Deliverables

- ✅ Revenue line chart (monthly)
- ✅ Revenue bar chart (by category)
- ✅ Summary stats (total revenue, avg sale price, count)
- ✅ Dashboard dengan quick access cards

### Success Metrics

- Charts render correctly dengan real data
- Dashboard loads <3s
- Data aggregation accurate

---

## Sprint 11: Advanced Analytics

**Duration:** Week 21-22  
**Goal:** Add artwork performance dan date filtering.  
**Theme:** "Deep Insights"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-5.2 | Artwork Performance Metrics | 5 | 022 |
| US-5.3 | Date Range Filtering | 3 | 023 |
| TECH | Analytics data aggregation | 3 | - |

**Total:** 11 points

### Key Deliverables

- ✅ Artwork performance table (sortable)
- ✅ Date range picker
- ✅ Filter updates all charts
- ✅ Performance optimization

### Buffer Time

- Polish UI/UX
- Fix minor bugs
- Documentation updates
- Prepare for Sprint 12 testing focus

---

## Sprint 12: Polish, Testing & Bug Fixes

**Duration:** Week 23-24  
**Goal:** Stabilize application, improve test coverage, fix bugs.  
**Theme:** "Ready to Launch"

### Committed Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| TECH | Comprehensive testing (unit + component) | 8 | - |
| TECH | Bug fixes from backlog | 5 | - |
| TECH | Performance optimization | 3 | - |
| TECH | Accessibility improvements | 3 | - |
| DOCS | User documentation | 3 | - |

**Total:** 22 points

### Key Deliverables

- ✅ Test coverage >80%
- ✅ All high-priority bugs fixed
- ✅ Performance audit completed
- ✅ Accessibility compliance (WCAG AA basics)
- ✅ User guide documentation

### Success Metrics

- Zero critical bugs
- Page load <3s (SRS-NF-001)
- API response <2s (SRS-NF-002)
- Cross-browser compatibility (SRS-NF-006)

### Launch Readiness Checklist

- [ ] All MVP features complete dan tested
- [ ] Firebase production setup
- [ ] Domain configured
- [ ] Analytics tracking (Google Analytics)
- [ ] Error tracking (Sentry) configured
- [ ] Backup strategy implemented
- [ ] User documentation available
- [ ] Team trained pada support procedures

---

## Sprint 13+: Future Enhancements

**Duration:** Week 25+  
**Goal:** Implement stretch goals dan user feedback.

### Potential Stories

| ID | Story | Points | SRS-F |
|----|-------|--------|-------|
| US-5.4 | Export Analytics Report | 5 | 024 |
| US-5.5 | Sales Conversion Funnel | 5 | 025 |
| - | Batch operations (multi-select artworks) | 5 | - |
| - | Advanced search (full-text search) | 8 | - |
| - | Email notifications | 8 | - |
| - | Mobile app (React Native) | 21+ | - |
| - | Multi-language support (i18n) | 8 | - |
| - | Dark mode | 3 | - |

**Prioritize based on:**
- User feedback
- Analytics insights
- Business value
- Technical complexity

---

## Milestone Summary

### Milestone 1: MVP Foundation (Sprint 1-2)

**Target Date:** Week 4  
**Deliverables:** Auth, Navigation, Profile  
**Success Criteria:** Users can register, login, manage profile

### Milestone 2: Core CRM (Sprint 3-7)

**Target Date:** Week 14  
**Deliverables:** Artwork CRUD, Contact CRUD  
**Success Criteria:** Users can manage artworks dan contacts

### Milestone 3: Sales Pipeline (Sprint 8-9)

**Target Date:** Week 18  
**Deliverables:** Kanban board, Opportunities  
**Success Criteria:** Users can track sales dalam pipeline

### Milestone 4: MVP Launch (Sprint 9)

**Target Date:** Week 18  
**Deliverables:** Full MVP ready for production  
**Success Criteria:** All MVP features complete, tested, documented

### Milestone 5: Analytics & Insights (Sprint 10-11)

**Target Date:** Week 22  
**Deliverables:** Revenue analytics, Artwork performance  
**Success Criteria:** Users can view insights and metrics

### Milestone 6: Production Ready (Sprint 12)

**Target Date:** Week 24  
**Deliverables:** Polished, tested, production-ready app  
**Success Criteria:** Launch checklist complete, zero critical bugs

---

## Capacity Planning

### Team Composition

| Role | Count | Hours/Sprint |
|------|-------|--------------|
| Full-stack Developer | 5 | 60 hours each |
| **Total Capacity** | - | **300 hours** |

### Story Point Velocity

**Initial Estimate:** 30-40 points/sprint  
**After Sprint 2:** Adjust based on actual velocity

**Velocity Tracking:**

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 | 20 | TBD | - |
| Sprint 2 | 21 | TBD | - |
| Sprint 3 | 21 | TBD | - |
| ... | ... | ... | ... |

### Capacity Adjustments

**Holidays/PTO:** Reduce capacity by affected hours  
**Onboarding:** New members ~50% velocity first sprint  
**Technical Debt:** Reserve 10-20% capacity per sprint

---

## Risk Management

### Sprint-Level Risks

#### Sprint 1-2 Risks

**Risk:** Firebase setup delays  
**Impact:** Medium  
**Mitigation:** Early setup, documentation, pair programming

**Risk:** Vue 3 learning curve  
**Impact:** Medium  
**Mitigation:** Training resources, code reviews, pair programming

#### Sprint 3-5 Risks

**Risk:** Image upload complexity (compression, thumbnails)  
**Impact:** High  
**Mitigation:** Technical spike, use proven libraries, early testing

**Risk:** Storage quota exceeded  
**Impact:** Medium  
**Mitigation:** Monitor usage, implement limits, upgrade plan jika needed

#### Sprint 8-9 Risks

**Risk:** Drag-and-drop bugs/complexity  
**Impact:** High  
**Mitigation:** Use battle-tested library (vue-draggable), extensive testing

**Risk:** Firestore query performance  
**Impact:** Medium  
**Mitigation:** Proper indexing, pagination, query optimization

#### Sprint 10-11 Risks

**Risk:** Chart rendering performance  
**Impact:** Low  
**Mitigation:** Use lightweight library, lazy loading, data aggregation

---

## Definition of Done (Sprint-Level)

For each sprint to be considered "Done":

- [ ] All committed stories completed (AC met)
- [ ] Code reviewed dan merged ke develop
- [ ] Tests written dan passing (>80% coverage)
- [ ] Documentation updated (jika needed)
- [ ] Demo prepared untuk Sprint Review
- [ ] Sprint Retrospective completed
- [ ] Backlog refined untuk next sprint
- [ ] No critical bugs outstanding

---

## Communication Plan

### Daily Stand-up (15 mins)

**Time:** 9:00 AM daily  
**Participants:** All developers  
**Format:** What completed yesterday? What working on today? Any blockers?

### Sprint Planning (3 hours)

**Time:** Monday, start of sprint  
**Participants:** Full team + Product Owner  
**Outcomes:** Sprint goal, committed stories, task breakdown

### Sprint Review (1 hour)

**Time:** Friday, end of sprint  
**Participants:** Full team + stakeholders  
**Outcomes:** Demo completed work, gather feedback

### Sprint Retrospective (1 hour)

**Time:** Friday, after review  
**Participants:** Full team  
**Outcomes:** What went well? What to improve? Action items

### Backlog Refinement (1.5 hours)

**Time:** Wednesday, mid-sprint  
**Participants:** Full team + Product Owner  
**Outcomes:** Next sprint stories estimated dan prioritized

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  ArtConnect Sprint Roadmap Summary                  │
├─────────────────────────────────────────────────────┤
│  SPRINT 1-2:   Auth & Foundation                    │
│  SPRINT 3-5:   Artwork Management                   │
│  SPRINT 6-7:   Contact Management                   │
│  SPRINT 8-9:   Sales Pipeline (MVP DONE! 🎉)        │
│  SPRINT 10-11: Analytics & Dashboard                │
│  SPRINT 12:    Polish & Testing                     │
│  SPRINT 13+:   Future Enhancements                  │
│                                                     │
│  MILESTONES:                                        │
│  Week 4:  MVP Foundation                            │
│  Week 14: Core CRM                                  │
│  Week 18: MVP Launch 🚀                             │
│  Week 22: Analytics Complete                        │
│  Week 24: Production Ready                          │
│                                                     │
│  VELOCITY TARGET:                                   │
│  30-40 story points per sprint                      │
│  (Adjust after Sprint 2 based on actuals)          │
│                                                     │
│  TEAM CAPACITY:                                     │
│  5 developers × 60 hours = 300 hours/sprint         │
└─────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Product Owner + Scrum Master  
**Next Review:** After each sprint retrospective (adjust roadmap based on velocity dan feedback)

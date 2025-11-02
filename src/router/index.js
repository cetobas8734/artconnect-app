import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import authRoutes from "@/modules/auth/auth.routes.js";
import dashboardRoutes from "@/modules/dashboard/dashboard.routes.js";
import artworksRoutes from "@/modules/artworks/artworks.routes.js";
import contactsRoutes from "@/modules/contacts/contacts.routes.js";
import pipelineRoutes from "@/modules/pipeline/pipeline.routes.js";
import reportsRoutes from "@/modules/reports/reports..routes";

const routes = [
  { path: "/", redirect: "/app/dashboard", meta: { requiresAuth: true } },
  ...authRoutes,
  {
    path: "/app",
    name: "AppRoot",
    meta: { requiresAuth: true, layout: "DefaultLayout" },
    children: [
      { path: "", redirect: { name: "Dashboard" } },
      ...dashboardRoutes,
      ...artworksRoutes,
      ...contactsRoutes,
      ...pipelineRoutes,
      ...reportsRoutes,
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { layout: "DefaultLayout", requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.loading) {
    await new Promise((resolve) => {
      const unsub = authStore.$subscribe((m, s) => {
        if (!s.loading) {
          unsub();
          resolve();
        }
      });
    });
  }
  checkAuth(to, from, next, authStore);
});
function checkAuth(to, from, next, store) {
  const isAuth = store.isAuthenticated;
  if (isAuth) {
    if (
      to.name === "Login" ||
      to.name === "Register" ||
      to.name === "ForgotPassword"
    ) {
      next({ name: "Dashboard" });
      return;
    }
  }
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  if (requiresAuth && !isAuth) {
    next({ name: "Login" });
    return;
  }
  next();
}
export default router;

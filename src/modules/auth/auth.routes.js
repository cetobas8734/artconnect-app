const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/modules/auth/views/LoginView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/modules/auth/views/RegisterView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/modules/auth/views/ForgotPasswordView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false },
  },
];
export default routes;

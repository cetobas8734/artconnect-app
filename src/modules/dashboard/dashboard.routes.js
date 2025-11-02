const routes = [
  {
    path: "dashboard",
    name: "Dashboard",
    component: () => import("@/modules/dashboard/views/DashboardView.vue"),
  },
];
export default routes;

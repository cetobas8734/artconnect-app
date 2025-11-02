const routes = [
  {
    path: "reports",
    name: "Reports",
    component: () => import("@/modules/reports/views/ReportsView.vue"),
  },
];
export default routes;

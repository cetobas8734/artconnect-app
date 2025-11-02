const routes = [
  {
    path: "pipeline",
    name: "Pipeline",
    component: () => import("@/modules/pipeline/views/PipelineView.vue"),
  },
];
export default routes;

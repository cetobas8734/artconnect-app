const routes = [
  {
    path: "artworks",
    name: "ArtworksList",
    component: () => import("@/modules/artworks/views/ArtworksListView.vue"),
  },
  {
    path: "artworks/new",
    name: "ArtworkCreate",
    component: () => import("@/modules/artworks/views/ArtworksCreateView.vue"),
  },
  {
    path: "artworks/:id",
    name: "ArtworkDetail",
    component: () => import("@/modules/artworks/views/ArtworksDetailView.vue"),
    props: true,
  },
];
export default routes;

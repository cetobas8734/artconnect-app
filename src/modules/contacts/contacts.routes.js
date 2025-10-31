const routes = [
  {
    path: "contacts",
    name: "ContactsList",
    component: () => import("@/modules/contacts/views/ContactsListView.vue"),
  },
  {
    path: "contacts/new",
    name: "ContactCreate",
    component: () => import("@/modules/contacts/views/ContactCreateView.vue"),
  },
  {
    path: "contacts/:id",
    name: "ContactDetail",
    component: () => import("@/modules/contacts/views/ContactDetailView.vue"),
    props: true,
  },
];
export default routes;

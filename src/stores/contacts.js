import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuthStore } from "./auth";
import avatarFathir from "@/assets/images/dark fathir.jpg";
import avatarAkbar from "@/assets/images/auth-hero.png";
import avatarSechan from "@/assets/images/auth-hero.png";
import avatarSinar from "@/assets/images/auth-hero.png";
import avatarGhibran from "@/assets/images/auth-hero.png";

const dummyContacts = [
  {
    contact_id: "c1",
    name: "Moch. Sechan Alfarisi",
    category: "curator",
    organization: "Kurator",
    last_contact_date: {
      toDate: () => new Date(Date.now() - 90 * 24 * 3600 * 1000),
    },
    avatar_url: avatarSechan,
  },
  {
    contact_id: "c2",
    name: "M. Akbar Rizky S.",
    category: "collector",
    organization: "Kolektor",
    last_contact_date: {
      toDate: () => new Date(Date.now() - 60 * 24 * 3600 * 1000),
    },
    avatar_url: avatarAkbar,
  },
  {
    contact_id: "c3",
    name: "M. Fathir Bagas ( Dev )",
    category: "curator",
    organization: "Kurator",
    last_contact_date: {
      toDate: () => new Date(Date.now() - 90 * 24 * 3600 * 1000),
    },
    avatar_url: avatarFathir,
  },
  {
    contact_id: "c4",
    name: "M. Sinar Agusta Salabintana",
    category: "gallery",
    organization: "Galeri",
    last_contact_date: {
      toDate: () => new Date(Date.now() - 10 * 24 * 3600 * 1000),
    },
    avatar_url: avatarSinar,
  },
  {
    contact_id: "c5",
    name: "M. Ghibran Muslih",
    category: "collector",
    organization: "Kolektor",
    last_contact_date: {
      toDate: () => new Date(Date.now() - 30 * 24 * 3600 * 1000),
    },
    avatar_url: avatarGhibran,
  },
];

const fetchContactAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyContacts);
    }, 500);
  });
};

export const useContactsStore = defineStore("contacts", {
  state: () => ({
    contactsList: [],
    currentContact: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchContacts() {
      const auth = useAuthStore();
      if (!auth.user) {
        this.error = "No user";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchContactAPI();
        this.contactsList = data.map((item) => ({
          contact_id: item.contact_id,
          ...item,
        }));
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchContactById(id) {
      console.warn("Backend Job: Implementasikan GET /contacts/:id");
    },
    async addContact(data) {
      console.warn("Backend Job: Implementasikan POST /contacts");
    },
    async updateContact(id, data) {
      console.warn("Backend Job: Implementasikan PUT/PATCH /contacts/:id");
    },
    async deleteContact(id) {
      console.warn("Backend Job: Implementasikan DELETE /contacts/:id");
    },
  },
  getters: {
    contactsByCategory: (state) => (cat) => {
      if (!cat || cat === "Semua") return state.contactsList;
      const map = {
        Kolektor: "collector",
        Galeri: "gallery",
        Kurator: "curator",
      };
      const target = map[cat] || cat.toLowerCase();
      return state.contactsList.filter(
        (c) => c.category?.toLowerCase() === target
      );
    },
  },
});

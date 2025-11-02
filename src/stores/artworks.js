import { defineStore } from "pinia";
// Hapus impor Firebase SDK yang tidak terpakai jika Anda beralih ke API
// import { collection, getDocs, ... } from 'firebase/firestore';
import { useAuthStore } from "./auth";

// --- DATA SIMULASI (AKAN DIGANTI OLEH API BACKEND NYATA) ---
// 📢 TIM BACKEND: API Anda (misal: GET /api/artworks) harus mengembalikan data
// dalam format JSON yang mirip dengan array 'dummyArtworks' di bawah ini.
const dummyArtworks = [
  {
    id: "1",
    title: "Urban Dreams",
    medium: "Oil on Canvas",
    price: 20000000,
    status: "for_sale", // 'Tersedia'
    dimensions: { width: 120, height: 90, unit: "cm" },
    primary_image_url:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    status_history: [
      { status: "for_sale", timestamp: { toDate: () => new Date() } },
    ], // Dibutuhkan untuk Detail View
  },
  {
    id: "2",
    title: "Abstract Sketch",
    medium: "Digital",
    price: 10000000,
    status: "wip", // Sesuai desain 'image_05fc00.png'
    dimensions: { width: 50, height: 50, unit: "cm" },
    primary_image_url:
      "https://images.unsplash.com/photo-1536924940846-3c73eb5a93c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFic3RyYWN0JTIwYXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    status_history: [
      { status: "wip", timestamp: { toDate: () => new Date() } },
    ],
  },
  {
    id: "3",
    title: "City Landscape",
    medium: "Watercolor",
    price: 15000000,
    status: "sold",
    dimensions: { width: 80, height: 60, unit: "cm" },
    primary_image_url:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status_history: [
      { status: "sold", timestamp: { toDate: () => new Date() } },
    ],
  },
  {
    id: "4",
    title: "New Concept",
    medium: "Pencil",
    price: 5000000,
    status: "concept",
    dimensions: { width: 30, height: 40, unit: "cm" },
    primary_image_url:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFic3RyYWN0JTIwYXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    status_history: [
      { status: "concept", timestamp: { toDate: () => new Date() } },
    ],
  },
  {
    id: "5",
    title: "Exhibition Piece",
    medium: "Installation",
    price: 50000000,
    status: "exhibition",
    dimensions: { width: 200, height: 200, unit: "cm" },
    primary_image_url:
      "https://images.unsplash.com/photo-1506806732259-39c2d02a0463?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNjdWxwdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status_history: [
      { status: "exhibition", timestamp: { toDate: () => new Date() } },
    ],
  },
];
const fetchAPI = async (endpoint, method = "GET", data = null) => {
  console.log(`Frontend: Simulating API Call: ${method} ${endpoint}`);
  await new Promise((r) => setTimeout(r, 500));
  if (endpoint.includes("/artworks")) {
    return dummyArtworks;
  }
  if (endpoint.includes("/artworks/")) {
    return dummyArtworks[0];
  }
  return [];
};

export const useArtworksStore = defineStore("artworks", {
  state: () => ({
    artworksList: [],
    currentArtwork: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchArtworks() {
      const auth = useAuthStore();
      if (!auth.user) {
        this.error = "No user";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchAPI("/artworks", "GET");
        this.artworksList = data.map((item) => ({
          artwork_id: item.id,
          ...item,
        }));
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchArtworkById(id) {
      this.loading = true;
      this.error = null;
      this.currentArtwork = null;
      try {
        const data = await fetchAPI(`/artworks/${id}`, "GET"); // Simulasi
        this.currentArtwork = { artwork_id: data.id, ...data };
        return this.currentArtwork;
      } catch (e) {
        this.error = e.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addArtwork(data, file) {
      this.loading = true;
      this.error = null;
      try {
        const newId = Date.now().toString();
        const newArtwork = {
          artwork_id: newId,
          ...data,
          price: data.price || 0,
          status: "concept",
        };

        this.artworksList.unshift(newArtwork);
        return newId;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateArtworkStatus(id, status) {
      console.warn(
        "Backend Job: Implementasikan PATCH /api/artworks/:id/status"
      );
      const index = this.artworksList.findIndex((a) => a.artwork_id === id);
      if (index !== -1) this.artworksList[index].status = status;
    },
    async updateArtwork(id, data, newFile = null) {
      console.warn("Backend Job: Implementasikan PUT/PATCH /api/artworks/:id");
    },
    async deleteArtwork(id) {
      console.warn("Backend Job: Implementasikan DELETE /api/artworks/:id");
      // Simulasi di frontend:
      this.artworksList = this.artworksList.filter((a) => a.artwork_id !== id);
    },
  },
});

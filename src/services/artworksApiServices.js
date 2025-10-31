import { defineStore } from "pinia";

const dummyArtworks = [
  {
    artwork_id: "a1",
    title: "Abstract Landscape",
    artist: "Self",
    price: 12000,
    primary_image_url:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    status: "Sold",
  },
  {
    artwork_id: "a2",
    title: "Urban Sketch",
    artist: "Self",
    price: 8500,
    primary_image_url:
      "https://images.unsplash.com/photo-1620869151838-b78f8303e91b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    status: "Available",
  },
  {
    artwork_id: "a3",
    title: "Portrait of Jane",
    artist: "Self",
    price: 9200,
    primary_image_url:
      "https://images.unsplash.com/photo-1510005753069-424a15993700?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    status: "Available",
  },
  {
    artwork_id: "a4",
    title: "Still Life with Apples",
    artist: "Self",
    price: 7000,
    primary_image_url:
      "https://images.unsplash.com/photo-1596706077309-8d765b217032?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    status: "Available",
  },
];
const fetchArtworksAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyArtworks);
    }, 500);
  });
};

export const useArtworksStore = defineStore("artworks", {
  state: () => ({
    artworksList: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchArtworks() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchArtworksAPI();
        this.artworksList = data;
      } catch (err) {
        this.error = "Failed to fetch artworks.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {},
});

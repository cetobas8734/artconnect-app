import { defineStore } from "pinia";
import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null, loading: true, error: null, jwtToken: null }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    userId: (s) => s.user?.uid || null,
    jwtToken: (s) => s.jwtToken,
  },
  actions: {
    async registerUser(creds) {
      this.loading = true;
      this.error = null;
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        );
        this.user = cred.user;
        if (creds.displayName)
          await updateProfile(cred.user, { displayName: creds.displayName });
        const ref = doc(db, "users", this.user.uid);
        await setDoc(ref, {
          uid: this.user.uid,
          email: this.user.email,
          displayName: creds.displayName || this.user.email.split("@")[0],
          created_at: serverTimestamp(),
          subscription_plan: "free",
        });
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async loginWithEmail(creds) {
      this.loading = true;
      this.error = null;
      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        );
        this.user = cred.user;
        if (this.user) {
          const token = await this.user.getIdToken();
          this.jwtToken = token;
          localStorage.setItem("jwtToken", token);
        }
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await signOut(auth);
        this.user = null;
        this.jwtToken = null;
        localStorage.removeItem("jwtToken");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(email) {
      this.error = null;
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },
    monitorAuthState() {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          this.user = currentUser;
          if (!this.jwtToken) {
            this.jwtToken = await currentUser.getIdToken();
            localStorage.setItem("jwtToken", this.jwtToken);
          }
        } else {
          this.user = {
            uid: "DUMMY_FRONTEND_TEST_ID",
            email: "fathir@artconnect.dev",
            displayName: "Fathir",
            photoURL:
              "https://images.unsplash.com/photo-1511367461989-ee796e0824bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc5MzF8MHwxfGFsbHwxfHx8fHx8fHwxNjcxMDQ5NjAw&ixlib=rb-4.0.3&q=80&w=200",
          };
          this.jwtToken = "dummy-jwt-token-for-axios";
        }
        this.loading = false;
      });
    },
  },
});

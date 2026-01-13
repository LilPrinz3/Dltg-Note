function updateNoteCount() {
    const text = contentInput.value;

    const charCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    noteCount.textContent = `Words: ${wordCount} | Characters: ${charCount}`;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import {
    doc,
    getFirestore,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* ===== Firebase Config ===== */
const firebaseConfig = {
    apiKey: "AIzaSyC3U4MJVx1Bd-bHRymdY4ufC0gqNAcss-o",
    authDomain: "note-b74de.firebaseapp.com",
    projectId: "note-b74de",
    storageBucket: "note-b74de.firebasestorage.app",
    messagingSenderId: "1088136489466",
    appId: "1:1088136489466:web:9ad709b0f778f69610dc43"
};

// Initialize Firebase
      const app = initializeApp(firebaseConfig);
      //   intialize Firestore
      const db = getFirestore(app);

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      const docRef = doc(db, "notes", id);
// ==== DOM selections ======
const form = document.getElementById("editNoteForm");
const updateNoteBtn = document.getElementById("updateNoteBtn");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

// // --- Real-time word & character count ---
const noteCount = document.getElementById("noteCount");

contentInput.addEventListener("input", updateNoteCount);


async function getSingleBlog() {
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const note = docSnap.data();

            titleInput.value = note.title || "";
            contentInput.value = note.content || "";

            // update counter immediately after setting content
            updateNoteCount();
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error);
    }
}

getSingleBlog();


 form.addEventListener("submit", async function (e) {
        e.preventDefault();
        updateNoteBtn.disabled = true;
        updateNoteBtn.textContent = "updating...";
         try {
        await updateDoc(docRef, {
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            updatedAt: serverTimestamp()
        });
          alert("Note updated successfully!");
          window.location.href = `./note.html?id=${id}`;
        } catch (error) {
          console.error("Error updating document: ", error);
          alert("Error updating note. Please try again.");
          return;
        }
      });

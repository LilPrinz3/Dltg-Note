import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    doc,
    getFirestore,
    getDoc,
    deleteDoc,
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

async function getSingleBlog() {
        try {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            displayBlog(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }

      getSingleBlog();
const singleNote = document.getElementById("singleNote");

function displayBlog(note) {
    const createdDate = note.createdAt?.toDate
        ? note.createdAt.toDate().toLocaleDateString()
        : "";

    const bgColor = note.color || "#ffffff";

    singleNote.innerHTML = `
        <div class="note note-enter" style="background:${bgColor}">
            <h4 class="fade-item">${note.title}</h4>
            <p class="note-content fade-item">${note.content}</p>
            <div class="date fade-item">${createdDate}</div>
        </div>
    `;
}

 editBtn.addEventListener("click", () => {
        window.location.href = `./editnote.html?id=${id}`;
});

    deleteDocBtn.addEventListener("click", handleDelete);

      async function handleDelete() {
        const confirmDelete = confirm("Are you sure you want to delete this blog post?" );
        if (confirmDelete) {
          // Add deletion logic here
          await deleteDoc(docRef);
          alert("Note deleted successfully.");
          window.location.href = "./note.html";
        }
      }

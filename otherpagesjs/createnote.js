import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

/* ===== Firebase Config ===== */
const firebaseConfig = {
    apiKey: "AIzaSyC3U4MJVx1Bd-bHRymdY4ufC0gqNAcss-o",
    authDomain: "note-b74de.firebaseapp.com",
    projectId: "note-b74de",
    storageBucket: "note-b74de.firebasestorage.app",
    messagingSenderId: "1088136489466",
    appId: "1:1088136489466:web:9ad709b0f778f69610dc43"
};

/* ===== Initialize Firebase ===== */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");
const auth = getAuth(app);

/* ===== Hold logged-in user ===== */
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        // No user → kick back to login
        window.location.href = "../index.html";
    }
});



/* ===== Generate Color ===== */
function generateColor() {
    const colors = [
        "#FEF3C7",
        "#DBEAFE",
        "#DCFCE7",
        "#FCE7F3",
        "#EDE9FE"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==== DOM selections ======
const form = document.getElementById("note-form");
const createNoteBtn = document.getElementById("createNoteBtn");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

// --- Real-time word & character count ---
const noteCount = document.getElementById("noteCount");

contentInput.addEventListener("input", () => {
    const text = contentInput.value;

    const charCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    noteCount.textContent = `Words: ${wordCount} | Characters: ${charCount}`;
});
// ==== form submit ======
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    createNoteBtn.disabled = true;
    createNoteBtn.textContent = "Creating...";

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    try {
        await addDoc(notesCollection, {
            title,
            content,
            color: generateColor(),
            uid: auth.currentUser.uid, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        alert("Note created successfully!");
        window.location.href = "./note.html";

    // } catch (error) {
    //     console.error("Error creating note:", error);
    //     alert("Failed to create note. Try again.");
    } catch (error) {
    console.error("Error creating note:", error.code, error.message);
    alert(`Failed to create note: ${error.message}`)

    } finally {
        createNoteBtn.disabled = false;
        createNoteBtn.textContent = "Create Note";
    }
});

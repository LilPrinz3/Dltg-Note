// ==== Firebase SDK Imports ====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import {
    collection,
    getFirestore,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// ==== Firebase Config ====
const firebaseConfig = {
    apiKey: "AIzaSyC3U4MJVx1Bd-bHRymdY4ufC0gqNAcss-o",
    authDomain: "note-b74de.firebaseapp.com",
    projectId: "note-b74de",
    storageBucket: "note-b74de.firebasestorage.app",
    messagingSenderId: "1088136489466",
    appId: "1:1088136489466:web:9ad709b0f778f69610dc43"
};

// ==== Initialize Firebase ====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const notesCol = collection(db, "notes");

// ==== DOM ELEMENTS ====
const display = document.getElementById("display");
const userStatus = document.getElementById("userStatus");
const logoutBtn = document.getElementById("logoutbtn");
const noResultsDiv = document.getElementById("noResults");
const page = document.getElementById("page");

// ==== FETCH NOTES (AUTH SAFE) ====
async function getAllNotes(uid) {
    try {
        const q = query(notesCol, where("uid", "==", uid));
        const snapshot = await getDocs(q);

        display.innerHTML = "";
        noResultsDiv.classList.remove("show");

        if (snapshot.empty) {
            noResultsDiv.innerHTML = `
                <div class="suggestion">You have no notes yet.</div>
            `;
            noResultsDiv.classList.add("show");
            return;
        }

        snapshot.forEach(doc => {
            const note = { ...doc.data(), id: doc.id };
            displayNote(note);
        });

    } catch (error) {
        console.error("Error fetching notes:", error);
    }
}

// ==== DISPLAY NOTE ====
function displayNote(note) {
    const createdDate = note.createdAt?.toDate
        ? note.createdAt.toDate().toLocaleDateString()
        : "";

    const updatedDate = note.updatedAt?.toDate
        ? note.updatedAt.toDate().toLocaleDateString()
        : null;

    const noteEl = document.createElement("div");
    noteEl.className = "note";
    noteEl.style.background = note.color || "#fff";
    noteEl.setAttribute("role", "button");
    noteEl.tabIndex = 0;

    noteEl.innerHTML = `
        <h4>${note.title}</h4>
        <p class="note-content">${note.content}</p>
        <span class="read-more">Read more…</span>

        <div class="note-dates">
            <span>Created: ${createdDate}</span>
            ${updatedDate ? `<span>Last edited: ${updatedDate}</span>` : ""}
        </div>
    `;

    display.appendChild(noteEl);

    const contentEl = noteEl.querySelector(".note-content");
    const readMore = noteEl.querySelector(".read-more");

    requestAnimationFrame(() => {
        if (contentEl.scrollHeight > contentEl.clientHeight) {
            readMore.style.display = "inline";
        }
    });

    const openNote = () => {
        noteEl.classList.add("note-opening");
        page.classList.add("page-blur");

        setTimeout(() => {
            window.location.href =
                `../otherpageshtml/singlenote.html?id=${note.id}`;
        }, 220);
    };

    noteEl.addEventListener("click", openNote);
    noteEl.addEventListener("keydown", e => e.key === "Enter" && openNote());
}

// ==== AUTH STATE ====
onAuthStateChanged(auth, (user) => {
    if (user) {
        userStatus.textContent = `Welcome ${user.email}`;
        getAllNotes(user.uid);
    } else {
        window.location.href = "../index.html";
    }
});

// ==== LOGOUT (DESKTOP) ====
logoutBtn.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    await signOut(auth);
    window.location.href = "../index.html";
});

// ==== SEARCH (DESKTOP) ====
document.getElementById("searchNote").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const notes = document.querySelectorAll(".note");
    let hasResults = false;

    notes.forEach(note => {
        const title = note.querySelector("h4").textContent.toLowerCase();
        const content = note.querySelector(".note-content").textContent.toLowerCase();

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            note.style.display = "block";
            hasResults = true;
        } else {
            note.style.display = "none";
        }
    });

    document.getElementById("searchClose").style.display =
        searchTerm ? "block" : "none";

    if (searchTerm && !hasResults) {
        noResultsDiv.innerHTML = `
            <div class="search-term">No results for "<strong>${searchTerm}</strong>"</div>
            <div class="suggestion">Check spelling or try another word.</div>
        `;
        noResultsDiv.classList.add("show");
    } else {
        noResultsDiv.classList.remove("show");
    }
});

document.getElementById("searchClose").addEventListener("click", () => {
    document.getElementById("searchNote").value = "";
    document.querySelectorAll(".note").forEach(n => n.style.display = "block");
    noResultsDiv.classList.remove("show");
});

// ==== MOBILE SEARCH ====
const searchNoteMobile = document.getElementById("searchNoteMobile");
const searchCloseMobile = document.getElementById("searchCloseMobile");
const searchIconMobile = document.getElementById("searchIconMobile");

searchIconMobile.addEventListener("click", () => searchNoteMobile.focus());

searchNoteMobile.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    let hasResults = false;

    searchCloseMobile.style.display = value ? "flex" : "none";

    document.querySelectorAll(".note").forEach(note => {
        const title = note.querySelector("h4").textContent.toLowerCase();
        const content = note.querySelector(".note-content").textContent.toLowerCase();

        if (title.includes(value) || content.includes(value)) {
            note.style.display = "block";
            hasResults = true;
        } else {
            note.style.display = "none";
        }
    });

    if (value && !hasResults) {
        noResultsDiv.innerHTML = `
            <div class="search-term">No results for "<strong>${value}</strong>"</div>
            <div class="suggestion">Try another search.</div>
        `;
        noResultsDiv.classList.add("show");
    } else {
        noResultsDiv.classList.remove("show");
    }
});

searchCloseMobile.addEventListener("click", () => {
    searchNoteMobile.value = "";
    document.querySelectorAll(".note").forEach(n => n.style.display = "block");
    searchCloseMobile.style.display = "none";
    noResultsDiv.classList.remove("show");
});

// ==== HAMBURGER MENU ====
const hamburgerBtn = document.getElementById("hamburgerBtn");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const closeBtn = document.getElementById("closeBtn");

hamburgerBtn.addEventListener("click", () => hamburgerMenu.classList.add("active"));
closeBtn.addEventListener("click", () => hamburgerMenu.classList.remove("active"));

document.addEventListener("click", (e) => {
    if (!hamburgerMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)) {
        hamburgerMenu.classList.remove("active");
    }
});

// ==== MOBILE LOGOUT ====
document.getElementById("logoutMobile").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    await signOut(auth);
    window.location.href = "../index.html";
});




// =================== FORM ELEMENTS ===================
let inps = document.querySelectorAll('.inputs .inp')
let display = document.getElementById('display')
let showError = document.getElementById('show-error')

const signUpForm = document.getElementById("sign-up");
const loginForm = document.getElementById("log-in");
const signupError = document.getElementById('signup-error-message')
const loginError = document.getElementById('login-error-message')

// =======password toggle ==========
let toggle = document.getElementById('togglePassword');
let passwordField = document.querySelector('.passwordField');
 toggle.addEventListener('click', function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggle.classList.remove("fa-eye");
        toggle.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggle.classList.remove("fa-eye-slash");
        toggle.classList.add("fa-eye");
    }
});

// =================== CLEAR ERROR ON INPUT ===================
const emailInput = document.getElementById("email-space");
const passwordInput = document.getElementById("password-space");

[emailInput, passwordInput].forEach(input => {
  input.addEventListener("input", () => {
    loginError.textContent = "";
  });
});


// =================== VALIDATE LOGIN ===================
function validateLoginForm(){
     let emailSpace = document.getElementById('email-space').value.trim();
    let passwordSpace = document.getElementById('password-space').value.trim();

    loginError.textContent = ''

    if (!emailSpace || !passwordSpace){
        // alert('please fill out all fields')
        loginError.textContent = 'please fill all fields'
        return;
    }

    return {
        email: emailSpace,
        password: passwordSpace
    };
}

// =================== FIREBASE SETUP ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import {
        getAuth,
        signInWithEmailAndPassword,
        onAuthStateChanged,
    } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

    import {
      getFirestore,
      collection,
      query,
      where,
      getDocs,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"
    // Your web app's Firebase configuration
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
      const auth = getAuth(app);
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");

// =================== LOGIN FUNCTION ===================
async function firebaseLogin(userData) {

    document.getElementById('login-error-message').innerText = '';
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.innerText = "logging in...";


    try {
          const cred = await signInWithEmailAndPassword(auth, userData.email, userData.password);

            // fetch profile & cache locally
    const q = query(usersCollection, where("uid", "==", cred.user.uid));
    const snap = await getDocs(q);

    if (!snap.empty) {
      localStorage.setItem(
        "userProfile",
        JSON.stringify(snap.docs[0].data())
      );
    }
          alert("Login successful");
          // window.location.href = "./otherpageshtml/createnote.html";
        } catch (error) {
          console.error("Error logging in:", error);
          document.getElementById('login-error-message').innerHTML = error.message;
          alert("Login failed");
        } finally {
          loginBtn.disabled = false;
          loginBtn.innerText = "Login";
        };
}

        onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = "./otherpageshtml/createnote.html";
        } else {
          localStorage.removeItem("userProfile");
        }
      });

// =================== LOGIN FORM SUBMIT ===================
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = validateLoginForm()
    if (!userData) return;
    
    firebaseLogin(userData);
})
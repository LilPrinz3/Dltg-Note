// =================== FORM ELEMENTS ===================
let inps = document.querySelectorAll('.inputs .inp')
let firstName = document.getElementById('inp1');
let lastName = document.getElementById('inp2');
let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
let email = document.getElementById('inp3');
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
let password = document.getElementById('inp4');
let confirmPassword = document.getElementById('inp5');
let display = document.getElementById('display')
let checkbox= document.getElementById('check-box')
let showError = document.getElementById('show-error')

const signUpForm = document.getElementById("sign-up");
const loginForm = document.getElementById("log-in");
const signupError = document.getElementById('signup-error-message')
const loginError = document.getElementById('login-error-message')

// =======password toggle if using same id ==========
document.querySelectorAll('.togglePassword').forEach(icon => {
    icon.addEventListener('click', function () {
        const inputId = this.getAttribute('data-target');
        const input = document.getElementById(inputId);

        if (input.type === "password") {
            input.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
});

// =================== CLEAR SIGNUP ERROR ON INPUT ===================
[
  firstName,
  lastName,
  email,
  password,
  confirmPassword
].forEach(input => {
  input.addEventListener("input", () => {
    signupError.textContent = "";
  });
});

checkbox.addEventListener("change", () => {
  signupError.textContent = "";
});


// =================== PAGE TOGGLE ===================
document.getElementById("show-login").addEventListener("click", () => {
  signUpForm.style.display = "none";
  loginForm.style.display = "block";
});

document.getElementById("show-signup").addEventListener("click", () => {
  loginForm.style.display = "none";
  signUpForm.style.display = "block";
});

// =================== VALIDATE SIGNUP ===================
function validateSignupForm(){
    const first = firstName.value.trim();
    const last = lastName.value.trim();
    const mail = email.value.trim();
    const pass = password.value.trim();
    const confirmPass = confirmPassword.value.trim();

    signupError.textContent = ''

    if (!first || !last || !mail || !pass || !confirmPass){
        // alert('please fill all fields')
        signupError.textContent = 'please fill all fields'
        return
    }

    if (pass != confirmPass){
        // alert('password does not match')
        signupError.textContent = 'password does not match'
        return
    }

    if(!checkbox.checked){
        // alert('please agree to policy')
        signupError.textContent = 'please agree to policy'
        return
    }

    if(!emailRegex.test(mail)){
        // alert('input valid mail')
        signupError.textContent = 'input valid mail'
        return;
    }
    if(!passwordRegex.test(pass)){
        // alert('password must include at least one capital letter, one lower-case letter,')
        signupError.textContent = 'password must include uppercase, smallcase, number, special character and must be at least 8 '
        return;
    }
    
    let userObj = {
        firstName: first,
        lastName: last,
        email : mail,
        password : pass,
        };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userObj);
    localStorage.setItem('users', JSON.stringify(users));

   return {
    firstName: first,
    lastName: last,
    email: mail,
    password: pass,
};

}
// =================== FIREBASE SETUP ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
     import {
        getAuth,
        createUserWithEmailAndPassword,
      } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

      import {
        collection,
        getFirestore,
        addDoc,
      } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

  // web app's Firebase configuration
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
  
// =================== SIGNUP FUNCTION ===================
        async function firebaseSignup(userData) {
          const signupBtn = document.getElementById("signupBtn");

          signupBtn.disabled = true;
          signupBtn.innerText = "Signing up...";

          // Registration logic goes here
        //   const firstName = document.getElementById("inp1").value;
        //   const lastName = document.getElementById("inp2").value;
        //   const email = document.getElementById("inp3").value;
        //   const password = document.getElementById("inp4").value;
        //   const confirmPassword = document.getElementById("inp5").value;

          try {
            // const userCr

            // after we sign use up on auth
            const userCred = await createUserWithEmailAndPassword(
              auth,
              userData.email,
              userData.password
            );
            // we get there uid from auth
            const id = userCred.user.uid;
            // we  save user user info into our firestore database (username, email, uid)
            const userDocRef = await addDoc(usersCollection, {
              email: userData.email,
              uid: id,
            });
            alert("Sign-up successfull!");
            document.getElementById("sign-up").reset();
          } catch (error) {
            document.getElementById("signup-error-message").innerHTML = error.message;
            console.log(error);
          } finally {
            signupBtn.disabled = false;
            signupBtn.innerText = "Sign up";
          }
        };
     
// =================== SIGNUP FORM SUBMIT ===================
// document
//   .getElementById("sign-up")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();
signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
    const userData = validateSignupForm();
    if (!userData) return;

    firebaseSignup(userData);
  });

document.addEventListener("DOMContentLoaded", event => {
    firebase.initializeApp({
        apiKey: "AIzaSyD052QaAfvdf9sdLExCn3d7ijdGNROPUAc",
        authDomain: "movie-app-full-stack-1.firebaseapp.com",
        projectId: "movie-app-full-stack-1",
        storageBucket: "movie-app-full-stack-1.appspot.com",
        messagingSenderId: "732289375022",
        appId: "1:732289375022:web:de388fa799e9021c4c38bf",
        measurementId: "G-GK807470HK"
    });
    const app = firebase.app();
    console.log(app);
});
function showGoogleLogin() {
  document.getElementById("google-login").style.display = "block";
  document.getElementById("email-signup").style.display = "none";
  document.getElementById("email-login").style.display = "none";
}
function showEmailSignUp() {
  document.getElementById("google-login").style.display = "none";
  document.getElementById("email-signup").style.display = "block";
  document.getElementById("email-login").style.display = "none";
}

function showEmailLogin() {
  document.getElementById("google-login").style.display = "none";
  document.getElementById("email-signup").style.display = "none";
  document.getElementById("email-login").style.display = "block";
}
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
        const user = result.user;
        let displayName=user.displayName;
        window.location.href = `welcome.html?name=${displayName}`;
        console.log(user);
    })
    .catch(console.log);
}
function emailSignUp() {
  const fullName = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(result => {
    const user = result.user;
    let displayName = user.displayName;
    displayName = fullName;
    window.location.href = `welcome.html?name=${displayName}`;

})
.catch(console.log);
}

function emailLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
        const user = result.user;
        document.write(`Hello ${user.displayName}`);
        console.log(user);
    })
    .catch(console.log);
}


function showEmailSignUp() {
  document.getElementById("email-signup").style.display = "block";
  document.getElementById("email-login").style.display = "none";
}


function showEmailLogin() {
  document.getElementById("email-signup").style.display = "none";
  document.getElementById("email-login").style.display = "block";
}

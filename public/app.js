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

function showEmailSignUp() {
  document.getElementById("email-signup").style.display = "block";
  document.getElementById("email-login").style.display = "none";
}


function showEmailLogin() {
  document.getElementById("email-signup").style.display = "none";
  document.getElementById("email-login").style.display = "block";
}

document.addEventListener("DOMContentLoaded", event => {
  firebase.initializeApp({
    apiKey: "AIzaSyD052QaAfvdf9sdLExCn3d7ijdGNROPUAc",
    authDomain: "movie-app-full-stack-1.firebaseapp.com",
    databaseURL: "https://movie-app-full-stack-1-default-rtdb.firebaseio.com",
    projectId: "movie-app-full-stack-1",
    storageBucket: "movie-app-full-stack-1.appspot.com",
    messagingSenderId: "732289375022",
    appId: "1:732289375022:web:de388fa799e9021c4c38bf",
    measurementId: "G-GK807470HK"
  });
  const app = firebase.app();
  console.log(app);
});

async function getIdToken() {
  const user = firebase.auth().currentUser;
  if (user) {
    user.getIdToken(true).then((idToken) => {
      console.log('ID token:', idToken);
    }).catch((error) => {
      console.error('Error getting ID token:', error);
    });
  } else {
    console.log('No user is currently signed in.');
  }
}

async function validateToken(token) {
  console.log("Token in validateToken function:", token);
  try {
    const response = await fetch("http://localhost:3000/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.message === "Access granted to protected route") {
      console.log("Token validated successfully");
    } else {
      console.log("Token validation failed");
    }
  } catch (error) {
    console.error("Error during token validation:", error);
  }
}

async function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .then(async (result) => {
    const user = result.user;
    document.write(`Hello ${user.displayName}`);
    console.log(user);
    const idToken = await user.getIdToken();
    await validateToken(idToken);
  })
  .catch(console.log);
}

async function emailSignUp() {
  const fullName = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(async (result) => {
    const user = result.user;
    const idToken = await user.getIdToken();
    await validateToken(idToken);
    await user.updateProfile({
      displayName: fullName,
      
    });
    window.location.href = `welcome.html?name=${fullName}`;
})
.catch(console.log);
}

async function emailLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(async (result) => {
    
      const user = result.user;
      const idToken = await user.getIdToken();
      await validateToken(idToken);
      const fullName = user.displayName;
      window.location.href = `welcome.html?name=${fullName}`;
    })
    .catch(console.log);
  }
# final-project-Team-9
* Marven Cesar
final-project-created by GitHub Classroom


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
    apiKey: 
    authDomain: 
    databaseURL:
    projectId: 
    storageBucket: 
    messagingSenderId:
    appId: 
    measurementId: 
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
    // document.write(`Hello ${user.displayName}`);
    console.log(user);
    const idToken = await user.getIdToken();
    await validateToken(idToken);
    window.location.href = `home.html`;
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
    window.location.href = `home.html`;
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
      //const fullName = user.displayName;
      window.location.href = `home.html`;
    })
    .catch(console.log);
  }


  async function signOut() {
    document.getElementById("sign-out").addEventListener("click", async () => {
      try {
        // Sign out the current user.
        await firebase.auth().signOut();
  
        // Redirect the user to the homepage.
        window.location.href = "home.html";
        console.log("Successfully Signed Out");
      } catch (error) {
        console.error(error);
      }
    });
  }


//   document.addEventListener("DOMContentLoaded",event =>{

//     const app=firebase.app();

//     const db= firebase.firestore();

//     const myFav=db.collection('favoriteList').doc('favorite');
//     // retirve it
//     myFav.get()
//           .then(doc =>{
//             const data =doc.data();
//             const container = document.getElementById('favorites-container');
//             container.innerHTML += data.title;
//           })

//   }) 

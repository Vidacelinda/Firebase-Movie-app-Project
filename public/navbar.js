window.onload = function() {
    const signOutBtn = document.getElementById("sign-out-btn");
  
    if (signOutBtn) {
      signOutBtn.addEventListener("click", async (event) => {
        // Prevent the default navigation behavior
        event.preventDefault();
        
        // Call the signOut function
        await signOut();
      });
    }
  };
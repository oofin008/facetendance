firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      console.log(user);
  } else {
      window.location.replace('../login.html')
  }
  });

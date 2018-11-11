function signOut(){
  firebase.auth().signOut().then(function() {
    window.location.replace('../index.html');
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
    window.location.replace('index.html');
  });
}

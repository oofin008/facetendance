firebase.auth().onAuthStateChanged((user) => {
if (user) {

  var rootRef = firebase.database().ref().child("users");

    rootRef.on("child_added", snap =>{

    var firstname = snap.child("user_info").child("firstname").val();
    var surname = snap.child("user_info").child("surname").val();
    var email = snap.child("user_info").child("email").val();

    document.getElementById("pname").innerHTML = firstname +'&nbsp;&nbsp;'+ surname;
    document.getElementById("mname").innerHTML = firstname +'&nbsp;&nbsp;'+ surname;
    document.getElementById("reademail").innerHTML = email;

    });
} else {
  window.location.replace('../index.html')
  console.log("Not logged in");
}
});

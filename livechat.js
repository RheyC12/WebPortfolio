// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSU-k8Jq1xToWcB1ziTkbRIRsdP-ZQaQM",
    authDomain: "dbmsfinalproject-bf251.firebaseapp.com",
    projectId: "dbmsfinalproject-bf251",
    storageBucket: "dbmsfinalproject-bf251.appspot.com",
    messagingSenderId: "90588500114",
    appId: "1:90588500114:web:6c043a1f9f7337ac8a964b",
    measurementId: "G-LX32VZK2ZM"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var myName = "";
  
  // Function to handle Google Sign-In
  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        var user = result.user;
        myName = user.displayName;
        alert(`Hello, ${myName}! Welcome to the chat.`);
        $('.messages-content').mCustomScrollbar();
        loadMessages();
      })
      .catch(function(error) {
        console.log("Error signing in: ", error.message);
      });
  }
  
  // Load messages from Firebase
  function loadMessages() {
    firebase.database().ref("messages").on("child_added", function(snapshot) {
      if (snapshot.val().sender === myName) {
        $('<div class="message message-personal"><figure class="avatar"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdX6tPX96Zk00S47LcCYAdoFK8INeCElPeJrVDrh8phAGqUZP_g" /></figure><div id="message-' + snapshot.key + '">' + snapshot.val().message + '<button class="btn-delete" data-id="' + snapshot.key + '" onclick="deleteMessage(this);">Delete</button></div></div>').appendTo($('.mCSB_container')).addClass('new');
        $('.message-input').val(null);
      } else {
        $('<div class="message new"><figure class="avatar"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdX6tPX96Zk00S47LcCYAdoFK8INeCElPeJrVDrh8phAGqUZP_g" /></figure><div id="message-' + snapshot.key + '">' + snapshot.val().sender + ': ' + snapshot.val().message + '</div></div>').appendTo($('.mCSB_container')).addClass('new');
      }
      setDate();
      updateScrollbar();
    });
  
    firebase.database().ref("messages").on("child_removed", function(snapshot) {
      document.getElementById("message-" + snapshot.key).innerHTML = "This message has been deleted";
    });
  }
  
  // Event listener for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        myName = user.displayName;
        alert(`Welcome back, ${myName}!`);
        $('.messages-content').mCustomScrollbar();
        loadMessages();
      } else {
        signInWithGoogle();
      }
    });
  });
  
  // Functions for message handling
  function updateScrollbar() {
    $('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }
  
  function setDate() {
    var d = new Date();
    var m = d.getMinutes();
    m = (m < 10) ? "0" + m : m; // Add leading zero if minutes is less than 10
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
  
  function deleteMessage(self) {
    var messageId = self.getAttribute("data-id");
    firebase.database().ref("messages").child(messageId).remove();
  }
  
  function sendMessage() {
    var message = document.getElementById("message").value;
    if (message.trim() === "") return;
  
    firebase.database().ref("messages").push().set({
      "message": message,
      "sender": myName
    });
    document.getElementById("message").value = ""; // Clear input field after sending message
  }
  
  function insertMessage() {
    var msg = $('.message-input').val();
    if ($.trim(msg) == '') return false;
    sendMessage();
  }
  
  $('.message-submit').click(function() {
    insertMessage();
  });
  
  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  });
  
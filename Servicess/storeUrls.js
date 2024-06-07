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
  const storage = firebase.storage();
  const database = firebase.database();
  
  // Retrieve and store items from Firebase Storage to Realtime Database
  const dataEntryRef = storage.ref('portfolio/DataEntry');
  dataEntryRef.listAll()
    .then((res) => {
      const promises = res.items.map((itemRef) =>
        itemRef.getDownloadURL()
          .then((url) => {
            const newImageRef = database.ref('portfolio/DataEntry').push();
            return newImageRef.set(url);
          })
          .catch((error) => {
            console.error('Error fetching URL:', error);
          })
      );
  
      return Promise.all(promises);
    })
    .then(() => {
      console.log('All URLs have been stored in the Realtime Database.');
    })
    .catch((error) => {
      console.error('Error listing items:', error);
    });
  
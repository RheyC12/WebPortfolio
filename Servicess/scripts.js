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
  
  // Function to display slides
  function displaySlides(urls) {
    const slidesDiv = document.getElementById('slides');
    slidesDiv.innerHTML = ''; // Clear any existing slides
  
    urls.forEach((url, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';
      if (index === 0) {
        slideDiv.classList.add('active');
      }
  
      const img = document.createElement('img');
      img.src = url;
      slideDiv.appendChild(img);
  
      slidesDiv.appendChild(slideDiv);
    });
  
    startSlideshow();
  }
  
  // Function to start the slideshow
  function startSlideshow() {
    let currentIndex = 0;
    const slides = document.getElementsByClassName('slide');
  
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 3000); // Change slide every 3 seconds
  }
  
  // Retrieve and display items from Firebase Storage
  const dataEntryRef = storage.ref('portfolio/DataEntry');
  dataEntryRef.listAll()
    .then((res) => {
      console.log('List All Response:', res); // Log response
      const urls = [];
      const promises = res.items.map((itemRef) =>
        itemRef.getDownloadURL()
          .then((url) => {
            console.log('Download URL:', url); // Log URL
            urls.push(url);
          })
          .catch((error) => {
            console.error('Error fetching URL:', error); // Log error fetching individual URL
          })
      );
  
      Promise.all(promises)
        .then(() => {
          if (urls.length === 0) {
            console.error('No URLs retrieved.');
          }
          displaySlides(urls);
        })
        .catch((error) => {
          console.error('Error retrieving URLs:', error); // Log error when resolving promises
        });
    })
    .catch((error) => {
      console.error('Error listing items:', error); // Log error listing items
    });
  
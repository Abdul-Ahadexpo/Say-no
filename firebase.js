// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuKeS4djQ-b8Lpj3Hr_92Qu2kUugeeR4c",
  authDomain: "spinstrike-bd.firebaseapp.com",
  databaseURL: "https://spinstrike-bd-default-rtdb.firebaseio.com",
  projectId: "spinstrike-bd",
  storageBucket: "spinstrike-bd.firebasestorage.app",
  messagingSenderId: "178535326334",
  appId: "1:178535326334:web:f4bbc2afa6b5b1ac9b6e2f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to save location to Firebase
export function saveLocationToFirebase(lat, long) {
  const locationRef = ref(database, "locations");
  push(locationRef, {
    latitude: lat,
    longitude: long,
    timestamp: new Date().toLocaleString(),
  });
}

// Function to fetch and display locations
export function displayLocationsFromFirebase() {
  const locationRef = ref(database, "locations");
  onValue(locationRef, (snapshot) => {
    const locations = snapshot.val();
    const list = document.getElementById("locationList");
    list.innerHTML = "";

    if (locations) {
      let index = 1;
      Object.values(locations).forEach((user) => {
        let row = `<tr class="border-b">
                    <td class="p-2">${index++}</td>
                    <td class="p-2">${user.latitude}</td>
                    <td class="p-2">${user.longitude}</td>
                    <td class="p-2">${user.timestamp}</td>
                  </tr>`;
        list.innerHTML += row;
      });

      // Hide the "Allow Location" button since data exists
      document.getElementById("allowLocationBtn").classList.add("hidden");
    }
  });
}

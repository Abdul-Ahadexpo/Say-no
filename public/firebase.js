// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  get,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtg0_cjf-ZXgmgjIOA8VTHULuRDorcUlE",
  authDomain: "mrbd-88689.firebaseapp.com",
  databaseURL: "https://mrbd-88689-default-rtdb.firebaseio.com",
  projectId: "mrbd-88689",
  storageBucket: "mrbd-88689.firebasestorage.app",
  messagingSenderId: "471198609260",
  appId: "1:471198609260:web:38e006fbbc7886c9c7cd49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to check if the location already exists
async function locationExists(lat, long) {
  const locationRef = ref(database, "locations");
  const snapshot = await get(locationRef);

  if (snapshot.exists()) {
    const locations = snapshot.val();
    return Object.values(locations).some(
      (loc) => loc.latitude === lat && loc.longitude === long
    );
  }
  return false;
}

// Function to save location to Firebase (only if it does not already exist)
export async function saveLocationToFirebase(lat, long) {
  try {
    const exists = await locationExists(lat, long);
    if (!exists) {
      const locationRef = ref(database, "locations");
      await push(locationRef, {
        latitude: lat,
        longitude: long,
        timestamp: new Date().toLocaleString(),
      });
      console.log("✅ Location saved:", lat, long);
    } else {
      console.log("❌ Location already exists:", lat, long);
    }
  } catch (error) {
    console.error("🔥 Error saving location:", error);
  }
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

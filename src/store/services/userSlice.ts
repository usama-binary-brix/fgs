import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
}

// Function to check if cookies have expired (24 hours)
const checkCookieExpiration = () => {
  const accessToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  
  const role = document.cookie
    .split('; ')
    .find(row => row.startsWith('role='))
    ?.split('=')[1];

  if (accessToken && role) {
    // Check if cookies are older than 24 hours
    const cookieCreationTime = localStorage.getItem('cookieCreationTime');
    if (cookieCreationTime) {
      const creationTime = parseInt(cookieCreationTime);
      const currentTime = Date.now();
      // const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      // const twentyFourHours = 0.5 * 60 * 1000; // Half a minute in milliseconds
      const twentyFourHours = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

      if (currentTime - creationTime > twentyFourHours) {
        // Cookies have expired, clear them
        const expireCookie = (name: string) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
        
        expireCookie("accessToken");
        expireCookie("role");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("cookieCreationTime");
        
        return true; // Cookies were expired and cleared
      }
    }
  }
  
  return false; // Cookies are still valid
};

// Function to show session expiration alert
const showSessionExpiredAlert = () => {
  // Create and show a custom alert modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;

  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 400px;
    width: 90%;
  `;

  alertBox.innerHTML = `
 
    <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Session Expired</h2>
    <p style="color: #666; margin: 0 0 20px 0; line-height: 1.5;">
      Your session has expired due to inactivity. Please log in again to continue.
    </p>
    <button id="loginBtn" style="
      background: #D18428;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    ">Login</button>
  `;

  modal.appendChild(alertBox);
  document.body.appendChild(modal);

  // Add click handler for login button - ONLY redirect when clicked
  const loginBtn = alertBox.querySelector('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      handleAutomaticLogout();
    });
  }
};

// Function to track user activity and reset session timer
let activityTimeout: NodeJS.Timeout;

const resetActivityTimer = () => {
  // Clear existing timeout
  if (activityTimeout) {
    clearTimeout(activityTimeout);
  }
  
  // Set new timeout for session expiration
  activityTimeout = setTimeout(() => {
    const expired = checkCookieExpiration();
    if (expired) {
      showSessionExpiredAlert();
    }
  }, 0.5 * 60 * 1000); // 30 seconds (your test setting)
};

// Function to handle automatic logout
const handleAutomaticLogout = () => {
  // Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("cookieCreationTime");
  
  // Clear cookies
  const expireCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  
  expireCookie("accessToken");
  expireCookie("role");
  
  // Redirect to login
  window.location.href = '/signin';
};

// Check cookie expiration on load and set up activity tracking
if (typeof window !== 'undefined') {
  const cookiesExpired = checkCookieExpiration();
  
  if (cookiesExpired) {
    showSessionExpiredAlert();
  } else {
    // Set up user activity tracking
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetActivityTimer, true);
    });
    
    // Initialize the activity timer
    resetActivityTimer();
  }
}

const loadState = (): UserState => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (error) {
    console.error("Error loading user state:", error);
    return { user: null, token: null };
  }
};

const initialState: UserState = loadState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      // Store the time when cookies were created
      localStorage.setItem("cookieCreationTime", Date.now().toString());
    },
   
updateUserData: (state, action: PayloadAction<{ user: User }>) => {
  state.user = action.payload.user;
  localStorage.setItem("user", JSON.stringify(action.payload.user));
  
},
      clearUser: (state) => {
        state.user = null;
        state.token = null;

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("cookieCreationTime");
        const expireCookie = (name:any) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
      
        expireCookie("accessToken");
        expireCookie("role");

      },
  },
});

export const { setUser,updateUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
export const userReducer = userSlice.reducer; 

// Simple admin authentication
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'allync2025';
const AUTH_KEY = 'allync_admin_auth';

export function isAuthenticated() {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  
  try {
    const { timestamp, authenticated } = JSON.parse(auth);
    // Auth expires after 24 hours
    const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
    return authenticated && !isExpired;
  } catch {
    return false;
  }
}

export function login(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      authenticated: true,
      timestamp: Date.now()
    }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
const token_key = "token";
const user_key = "user";
 
export function saveAuth(token, user) {
  localStorage.setItem(token_key, token);
  localStorage.setItem(user_key, JSON.stringify(user));
}
 
export function getToken() {
  return localStorage.getItem(token_key);
}
 
export function getUser() {
  const raw = localStorage.getItem(user_key);
  return raw ? JSON.parse(raw) : null;
}
 
export function clearAuth() {
  localStorage.removeItem(token_key);
  localStorage.removeItem(user_key);
}
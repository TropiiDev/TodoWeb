import { app } from './firebase.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
export const createUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredentials) => {
    return userCredentials.user;
  })
  .catch((error) => {
    console.error(error.message);
  })
}
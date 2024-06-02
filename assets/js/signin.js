import { app } from './components/firebase.js';
import { 
  getAuth,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  onAuthStateChanged
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// get auth from firebase
const auth = getAuth();
const recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  "size": "invisible",
  "callback": () => {
      console.log('ABC');
  }
});

const signInBtn = document.querySelector('.submit-button');

const resetPassword = document.querySelector('.reset-password');
const resetPassModal = document.getElementById('resetModal');

// when the resetPassword button is clicked show the modal
resetPassword.addEventListener('click', () => {
  resetPassModal.style.display = 'block';
})

// if the user is signed in redirect them to the home page
onAuthStateChanged(auth, (user) => {
  if (user) {
    // redirect them
    window.location.href = '../index.html';
  } else {
    // when the signInBtn sign the user in
    signInBtn.addEventListener('click', (e) => {
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        window.location.href = '../index.html';
        return;
      })
      .catch((error) => {
        if (error.code == "auth/multi-factor-auth-required") {
          const resolver = getMultiFactorResolver(auth, error);

          if (resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
            const phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
            .then(function (verificationId) {
                const mfaModal = document.getElementById('mfaModal');
                const mfaModalBtn = document.querySelector('#mfaModalSubmit');
                mfaModal.style.display = 'block';

                mfaModalBtn.addEventListener('click', () => {
                  const mfaModalCode = document.querySelector('#code').value;
                  
                  if (mfaModalCode == "") {
                    alert('Please enter a valid code');
                  } else {
                    const cred = PhoneAuthProvider.credential(verificationId, mfaModalCode);

                    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                    resolver.resolveSignIn(multiFactorAssertion)
                    .then((userCredential) => {
                      window.location.href = '../index.html';
                    })
                  }
                })
            });
          }
        }
      })

      e.preventDefault();
    })
  }
})
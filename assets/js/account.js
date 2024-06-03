import { app, storage } from './components/firebase.js';
import { 
  getAuth,
  onAuthStateChanged,
  RecaptchaVerifier,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  signOut,
  updateProfile,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const auth = getAuth();

// check if the user is signed in. if not, redirect them to the home page
onAuthStateChanged(auth, (user) => {
  if (user) {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    let activePage = document.querySelector('.sidebar-active');

    const logoutBtn = document.querySelector('.logout');

    // if the logoutBtn is clicked, sign the user out
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = './signin.html';
      }).catch((error) => {
        console.error(error.message);
      })
    })

    // if someone clicks on the sidebarToggle, show the sidebar
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
        sidebarToggle.style.display = 'block';
      } else {
        sidebar.style.display = 'block';
        sidebarToggle.style.display = 'block';
      }
    })
    
    // if someone clicks on a sidebarLink set that to be the active page
    sidebarLinks.forEach((sidebarLink) => {
      sidebarLink.addEventListener('click', () => {
        activePage = document.querySelector('.sidebar-active');

        // remove the sidebar-active class from the activePage
        activePage.classList.remove('sidebar-active');
        sidebarLink.classList.add('sidebar-active');

        // load that page

        // get the old names
        const oldPageName = activePage.querySelector('.name').innerHTML;
        const newPageName = sidebarLink.querySelector('.name').innerHTML;
        
        // find the pages
        const oldPage = document.querySelector(`.${oldPageName.toLowerCase()}-section`);
        const newPage = document.querySelector(`.${newPageName.toLowerCase()}-section`);

        oldPage.style.display = 'none';
        newPage.style.display = 'flex';

        if (user.emailVerified === false && newPage.querySelector('.title').innerHTML === 'Account') {
          const emailVerificationPromt = document.querySelector('.verify-email');
          const accountDiv = document.querySelector('.account-div');
          const accountButtonHolder = document.querySelector('.account-button-holder');

          emailVerificationPromt.style.display = 'flex';
          accountDiv.style.display = 'none';
          accountButtonHolder.style.display = 'none';
        }

        // check if the user doesn't have a verified email, if not send them home.
        if (newPage.querySelector('.title').innerHTML === 'Security' && user.emailVerified === false) {
          alert('You cannot add MFA without verifying your email!');
          window.location.reload();
        }
      })
    })

    const personalBtn = document.querySelector('.personal-btn');
    const verifyEmailBtn = document.querySelector('.verify-btn');
    const accountBtn = document.querySelector('.update-account-btn');
    const changePasswordModalBtn = document.querySelector('.change-password-btn');
    const securityBtn = document.querySelector('.security-btn');

    // when the personalBtn is clicked, add the name or photoURL
    personalBtn.addEventListener('click', () => {
      const nameInputField = document.querySelector('#name');
      const pictureInputField = document.querySelector('#pfp');

      if (nameInputField.value !== "" && pictureInputField.files[0] !== undefined) {
        // update the user.displayName and append the pictureInputField to firebase storage
        const storageRef = ref(storage, `images/${user.uid}`);

        // set the displayName
        updateProfile(user, {
          displayName: nameInputField.value
        })
        .then(() => {
          console.log('Set user.displayName');
        }).catch((error) => {
          console.error(error.message);
          alert('There was an error');
        })

        // upload the image
        uploadBytes(storageRef, pictureInputField.files[0]).then(() => {
          // get the image url
          getDownloadURL(storageRef)
          .then((url) => {
            // set the users photoURL as the url
            updateProfile(user, {
              photoURL: url
            })
          })
          alert('Please refresh the page for changes to take effect');
          //window.location.reload();
        })

      } else if (nameInputField.value !== "") {
        // update the user.displayName
        
        updateProfile(user, {
          displayName: nameInputField.value
        })
        .then(() => {
          alert("username has been updated");
          window.location.reload();
        }).catch((error) => {
          console.error(error.message);
        })

        // if no value for the nameInputField was entered but an image was, add the image and update photoURL
      } else if (pictureInputField.files[0] !== undefined) {
        // get the storage ref
        const storageRef = ref(storage, `images/${user.uid}`);
        //upload the image
        uploadBytes(storageRef, pictureInputField.files[0]).then(() => {
          // get the downloadURL
          getDownloadURL(storageRef)
          .then((url) => {
            // update the photoURL to be set with url
            updateProfile(user, {
              photoURL: url
            })
          })
          console.log(user.photoURL);
          alert('Please refresh the page for changes to take effect');
          //window.location.reload();
        })

      } else {
        // if no values were entered, reload the page
        window.location.reload();
      }
    })

    // if the verification button is clicked, send that email!!!
    verifyEmailBtn.addEventListener('click', () => {
      sendEmailVerification(user)
      .then(() => {
        alert('Verification email sent');
      })
    })

    accountBtn.addEventListener('click', () => {
      // change the email
      const emailInputField = document.querySelector('#emailInput');
      if (emailInputField.value !== "") {
        verifyBeforeUpdateEmail(user, emailInputField.value)
        .then(() => {
          alert('Please verify new email before using it');
          signOut(auth)
          .then(() => {
            console.log('Signing Out');
          }).catch((error) => {
            console.error(error.message);
          })
        }).catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            alert('Please sign in again before changing the email');
          } else {
            console.error(error.message);
          }
        })
      } else {
        alert("Please enter an email address");
      }
    })

    changePasswordModalBtn.addEventListener('click', () => {
      const changePasswordModal = document.querySelector('#changePasswordModal');
      const changePasswordBtn = document.querySelector('#changePass');
      changePasswordModal.style.display = 'block';

      changePasswordBtn.addEventListener('click', () => {
        const passwordInputField = document.querySelector("#newPasswordModal");

        console.log(passwordInputField.value);
        
        if (passwordInputField.value !== "") {
          updatePassword(user, passwordInputField.value)
          .then(() => {
            alert("Password has been changed");
            signOut(auth)
            .then(() => {
              console.log('Signing Out');
            }).catch((error) => {
              console.error(error.message);
            })
          }).catch((error) => {
            console.error(error.message);
          })
        } else {
          alert('Please input a new password');
        }
      })
    })

    // when the securityBtn is clicked, start MFA process
    securityBtn.addEventListener('click', () => {
      // get the captcha
      const recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        "size": "invisible"
      });
      // create a session
      multiFactor(user).getSession().then(function (multiFactorSession) {
        // get the phoneNumber input value and the verificationCodeField
        const phoneNumber = document.querySelector('#number').value;
        const verificationCodeField = document.querySelector('.verification-code');
        // set the country code to America
        const phoneInfoOptions = {
          phoneNumber: `+1${phoneNumber}`,
          session: multiFactorSession
        };

        // send the verification code
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
        .then(function (verificationId) {

          // enable the verificationCodeField
          const verifyBtn = document.querySelector('#verify');
          verificationCodeField.style.display = 'block';

          // when the verifyBtn is clicked, enable MFS
          verifyBtn.addEventListener('click', () => {
            const verificationInputField = document.querySelector('#verification-code');

            // if the verificationInputField is empty, alert the user to enter a code
            if (verificationInputField === "") {
              alert('Please enter a valid code');
            } else {
              // enable MFA
              const cred = PhoneAuthProvider.credential(verificationId, verificationInputField.value);

              const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

              multiFactor(user).enroll(multiFactorAssertion, "My personal phone number");

              alert('MFA Finished');
            }
          })
        });
      });
    })
  } else {
    // redirect to home page
    window.location.href = '../index.html';
  }
})
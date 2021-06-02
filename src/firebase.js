import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBFj4pb1ElziJiAZRXJoV5po9wSKpS0jdc",
  authDomain: "react-test-project-9a8eb.firebaseapp.com",
  projectId: "react-test-project-9a8eb",
  storageBucket: "react-test-project-9a8eb.appspot.com",
  messagingSenderId: "672880677428",
  appId: "1:672880677428:web:173689af2af87a2d6bf061"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
const db = firebaseApp.firestore();

export default db;
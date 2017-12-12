import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCY8LBUJhpAq6Ub7khieMl9fbifWBo2G8s",
    authDomain: "sweetheart-27dca.firebaseapp.com",
    databaseURL: "https://sweetheart-27dca.firebaseio.com",
    projectId: "sweetheart-27dca",
    storageBucket: "sweetheart-27dca.appspot.com",
    messagingSenderId: "495007479922"
  };
  
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp;
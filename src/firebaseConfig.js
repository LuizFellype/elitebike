import Firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    // databaseURL: process.env.REACT_APP_databaseURL,
    // measurementId: process.env.REACT_APP_measurementId,
};

Firebase.initializeApp(firebaseConfig);
Firebase.firestore().enablePersistence()

export const FB = Firebase
export const FBDatabase = Firebase.firestore()
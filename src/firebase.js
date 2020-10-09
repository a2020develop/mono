import * as firebase from 'firebase/app'
import 'firebase/database'

let firebaseConfig = {
    apiKey: "AIzaSyD1090HR4qhxYSqINo-xbBW7uwKn-8XNxE",
    authDomain: "monopoly-addition.firebaseapp.com",
    databaseURL: "https://monopoly-addition.firebaseio.com",
    projectId: "monopoly-addition",
    storageBucket: "monopoly-addition.appspot.com",
    messagingSenderId: "691640256338",
    appId: "1:691640256338:web:c4f6f35d8eb89be0dedc8b"
}
  
export default firebase.initializeApp(firebaseConfig) 
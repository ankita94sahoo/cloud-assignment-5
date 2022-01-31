import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import {signOut} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore, doc, setDoc, getDoc  } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAi35S-fhb9f_a4B_uXYFZXETV_aaOAF3I",
  authDomain: "cloudassignment-ankita.firebaseapp.com",
  databaseURL: "https://cloudassignment-ankita-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloudassignment-ankita",
  storageBucket: "cloudassignment-ankita.appspot.com",
  messagingSenderId: "392869209086",
  appId: "1:392869209086:web:3687bbe6154c35520c96af",
  measurementId: "G-MH4DRLFQ65"
};

const logOut = () => {
    signOut(auth);
  };

function refreshPage() {
  window.location.reload(false);
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const db2 = getFirestore(app);
const auth = getAuth(app);

function writeUserData(user) {
    set(ref(db, 'users/' + user.uid), {
    uid : user.uid,
    username: user.displayName,
    email: user.email,
  });
}


class User {
  constructor (uid, username, email, wishlist ) {
      this.uid = uid;
      this.username = username;
      this.email = email;
      this.wishlist = wishlist;

      
  }
  toString() {
      return this.uid + ', ' + this.username + ', ' + this.email + ',' + this.wishlist;
  }
}

// Firestore data converter
const userConverter = {
  toFirestore: (user) => {
      return {
          uid: user.uid,
          username: user.username,
          email: user.email,
          wishlist: user.wishlist
          };
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      if (data === undefined){
        return undefined
      }
      return new User(data.uid, data.username, data.email, data.wishlist);
  }
};

async function addToWishList(user,movieId) {
    
    try{
      const docRef = doc(db2, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const row = userConverter.fromFirestore(docSnap);
      var myIndex = row.wishlist.indexOf(movieId-1);
      if (myIndex === -1) {
        row.wishlist.push(movieId-1);
      }      
      const ref = doc(db2, "users", row.uid).withConverter(userConverter);
      await setDoc(ref, row, {merge: true});
    }
    catch (err){
      console.error(err);
      alert("Can't add movie to wishlist");
    }

  }

  async function deleteFromWishList(user,movieId) {
    
    try{
      const docRef = doc(db2, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const row = userConverter.fromFirestore(docSnap);
      var myIndex = row.wishlist.indexOf(movieId-1);
      if (myIndex !== -1) {
        row.wishlist.splice(myIndex, 1);
      }
      const ref = doc(db2, "users", row.uid).withConverter(userConverter);
      await setDoc(ref, row, {merge: false});
    }
    catch (err){
      console.error(err);
      alert("Can't delete movie from wishlist");
    }

  }


  export {
      auth,
      db,
      db2,
    logOut,
    writeUserData,
    User,
    userConverter,
    addToWishList,
    deleteFromWishList,
    refreshPage
  };



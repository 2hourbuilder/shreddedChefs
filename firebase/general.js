import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from "./config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const initializeFirebase = () => {};

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { initializeFirebase, firebase, auth, firestore, storage };

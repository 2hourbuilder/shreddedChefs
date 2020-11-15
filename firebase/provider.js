import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, firestore } from "./general";

export const UserContext = createContext({
  user: null,
  authReady: false,
  profile: {},
  snapshotListeners: [],
  addSnapshotListener: () => {},
});

export const useProfile = () => useContext(UserContext);

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState({});
  const [snapshotListeners, setSnapshotListeners] = useState([]);

  const addSnapshotListener = (listener) => {
    setSnapshotListeners((previousState) => [...previousState, listener]);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        console.log("Auth happened, user:", userAuth.displayName);
        setUser(userAuth);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Load Profile for user:", user.displayName);
      const unsubscribe = firestore
        .collection("users")
        .doc(user.uid)
        .onSnapshot(
          function (snapshot) {
            setProfile(snapshot.data());
          },
          function (error) {
            console.log("Error", error);
          }
        );
      return unsubscribe;
    }
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        user: user,
        authReady: authReady,
        profile: profile,
        snapshotListeners: snapshotListeners,
        addSnapshotListener: addSnapshotListener,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;

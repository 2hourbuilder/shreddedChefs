import { auth, firestore, firebase } from "./general";

export const doCreateUserWithEmailAndPassword = async (
  username,
  email,
  password
) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await auth.currentUser.updateProfile({
      displayName: username,
    });
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .set({
        username: username,
        settings: {
          pushNotifications: true,
          preferredTheme: "automatic",
        },
      });
  } catch (error) {
    throw new Error("Registration could not be completed.", error);
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error("Login Error:", error);
  }
};

export const doChangeUsername = async (username) => {
  try {
    await auth.currentUser.updateProfile({
      displayName: username,
    });
    await firestore.collection("users").doc(auth.currentUser.uid).set(
      {
        username: username,
      },
      { merge: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const doChangePreferredTheme = async (preferredTheme) => {
  try {
    await firestore.collection("users").doc(auth.currentUser.uid).update({
      "settings.preferredTheme": preferredTheme,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const doGetPreferredTheme = async (user) => {
  try {
    let result = null;
    const querySnapshot = await firestore
      .collection("users")
      .doc(user.uid)
      .get();
    result = querySnapshot.data();
    return result.settings.preferredTheme;
  } catch (error) {
    throw new Error(error);
  }
};

export const doChangePushNotifications = async (value) => {
  try {
    await firestore.collection("users").doc(auth.currentUser.uid).update({
      "settings.pushNotifications": value,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const doAddPushNotificationsToken = async (token) => {
  try {
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        "settings.pushNotificationsToken": firebase.firestore.FieldValue.arrayUnion(
          token
        ),
      });
  } catch (error) {
    throw new Error(error);
  }
};

export const doRemovePushNotificationsToken = async (token) => {
  try {
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        "settings.pushNotificationsToken": firebase.firestore.FieldValue.arrayRemove(
          token
        ),
      });
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = (snapshotListeners) => {
  snapshotListeners.forEach((listener) => {
    listener();
  });
  return auth.signOut();
};

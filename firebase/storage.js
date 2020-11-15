import { storage, firebase, firestore } from "./general";
import { createId } from "../helpers/helpers";
import * as ImageManipulator from "expo-image-manipulator";

export const uploadProfileImage = async (imageURI, setProgress, uid) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(imageURI, [
      { resize: { width: 500, height: 500 } },
    ]);
    const fetchResponse = await fetch(resizedImage.uri);
    const blob = await fetchResponse.blob();
    const fileId = await createId();
    const storageRef = storage.ref().child(`profilePictures/${fileId}`);
    const uploadTask = storageRef.put(blob);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      function (error) {
        throw new Error(error);
      }
    );
    await uploadTask.then(async (snapshot) => {
      const downloadURL = await snapshot.ref.getDownloadURL();
      await firestore.collection("users").doc(uid).set(
        {
          profilePicture: downloadURL,
        },
        { merge: true }
      );
    });
  } catch (error) {
    throw new Error(`Error in File Upload: ${error}`);
  }
};

export const generateThumbnail = async (imageURI, setProgress, uid) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(imageURI, [
      { resize: { width: 50, height: 50 } },
    ]);
    const fetchResponse = await fetch(resizedImage.uri);
    const blob = await fetchResponse.blob();
    const fileId = await createId();
    const storageRef = storage.ref().child(`profilePictures/${fileId}`);
    const uploadTask = storageRef.put(blob);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      function (error) {
        throw new Error(error);
      }
    );
    await uploadTask.then(async (snapshot) => {
      const downloadURL = await snapshot.ref.getDownloadURL();
      await firestore.collection("users").doc(uid).set(
        {
          thumbnail: downloadURL,
        },
        { merge: true }
      );
    });
  } catch (error) {
    throw new Error(`Error in File Upload: ${error}`);
  }
};

export const uploadPostImage = async (imageURI, setProgress) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(imageURI, [
      { resize: { width: 640 } },
    ]);
    const fetchResponse = await fetch(resizedImage.uri);
    const blob = await fetchResponse.blob();
    const fileId = await createId();
    const storageRef = storage.ref().child(`postPictures/${fileId}`);
    const uploadTask = storageRef.put(blob);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      function (error) {
        throw new Error(error);
      }
    );
    return await uploadTask.then(async (snapshot) => {
      return await snapshot.ref.getDownloadURL();
    });
  } catch (error) {
    throw new Error(`Error in File Upload: ${error}`);
  }
};

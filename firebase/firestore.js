import { firebase, firestore } from "./general";
import { createId } from "../helpers/helpers";
import { doSendPushNotificationNewPost } from "../helpers/pushNotifications";

export const addPost = async (
  thumbnailURI,
  username,
  uid,
  type,
  details,
  text
) => {
  try {
    await firestore.collection("posts").add({
      thumbnailURI: thumbnailURI,
      author: username,
      type: type,
      text: text,
      details: details,
      comments: [],
      likes: [],
      createdBy: uid,
      createdAt: Date.now(),
    });
    // await doSendPushNotificationNewPost(uid, username);
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchPosts = async () => {
  const results = [];
  try {
    const querySnapshot = await firestore.collection("posts").get();
    querySnapshot.forEach(function (doc) {
      results.push({ ...doc.data(), id: doc.id });
    });
    return results;
  } catch (err) {
    throw new Error("Error in fetching Posts: ", err);
  }
};

export const addComment = async (postID, user, text) => {
  try {
    const commentId = await createId();
    await firestore
      .collection("posts")
      .doc(postID)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          id: commentId,
          author: user.displayName,
          text: text,
          createdBy: user.uid,
          createdAt: Date.now(),
        }),
      });
  } catch (err) {
    throw new Error(err);
  }
};

export const toggleLike = async (postID, user, remove) => {
  try {
    remove
      ? await firestore
          .collection("posts")
          .doc(postID)
          .update({
            likes: firebase.firestore.FieldValue.arrayRemove(user.displayName),
          })
      : await firestore
          .collection("posts")
          .doc(postID)
          .update({
            likes: firebase.firestore.FieldValue.arrayUnion(user.displayName),
          });
  } catch (err) {
    throw new Error(err);
  }
};

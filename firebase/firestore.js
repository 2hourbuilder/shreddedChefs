import { auth, firebase, firestore } from "./general";
import { createId } from "../helpers/helpers";
import { doSendPushNotificationNewPost } from "../helpers/pushNotifications";

export const addPost = async (
  thumbnailURI = "",
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

export const deletePostById = async (postId) => {
  try {
    await firestore.collection("posts").doc(postId).delete();
  } catch (error) {
    throw new Error(error);
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

export const addGoal = async (
  title,
  typeId,
  statId,
  startDate,
  targetDate,
  startValue,
  targetValue
) => {
  try {
    const progressDataId = await createId();
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .add({
        title: title,
        typeId: typeId,
        statId: statId,
        startDate: startDate,
        targetDate: targetDate,
        startValue: startValue,
        targetValue: targetValue,
        settings: {
          showChartCategories: false,
          showChartBounds: false,
        },
        progressData: firebase.firestore.FieldValue.arrayUnion({
          id: progressDataId,
          dataDate: startDate,
          value: startValue,
        }),
      });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteGoalById = async (deleteId) => {
  try {
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .doc(deleteId)
      .delete();
  } catch (err) {
    throw new Error(err);
  }
};

export const addProgressData = async (goalId, progressDataObj) => {
  try {
    const progressDataId = await createId();
    await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .doc(goalId)
      .update({
        progressData: firebase.firestore.FieldValue.arrayUnion({
          id: progressDataId,
          ...progressDataObj,
        }),
      });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteProgressData = async (goalId, progressDataId) => {
  try {
    const ref = firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .doc(goalId);
    const oldProgress = await ref.get();
    const newProgress = oldProgress
      .data()
      .progressData.filter((entry) => entry.id != progressDataId);
    await ref.set(
      {
        progressData: newProgress,
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const changeGoalSettings = async (
  goalId,
  showChartBounds,
  showChartCategories
) => {
  try {
    const newSettings = {
      showChartCategories: showChartCategories,
      showChartBounds: showChartBounds,
    };
    const ref = firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .doc(goalId);
    await ref.update({
      settings: newSettings,
    });
  } catch (error) {
    throw new Error(error);
  }
};

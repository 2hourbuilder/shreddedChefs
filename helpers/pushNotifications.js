import { firestore } from "../firebase/general";

export const doSendPushNotificationNewPost = async (uid, username) => {
  try {
    const pushTokens = [];
    const querySnapshot = await firestore.collection("users").get();
    querySnapshot.forEach((doc) => {
      if (doc.id != uid) {
        doc
          .data()
          .settings.pushNotificationsToken.forEach((token) =>
            pushTokens.push(token)
          );
      }
    });
    const message = {
      to: pushTokens,
      sound: "default",
      title: "New post added!",
      body: `${username} has added a new Post!`,
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.log("Error in sending push notification", error);
  }
};

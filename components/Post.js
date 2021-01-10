import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IMG_NO_PROFILE_PICTURE } from "../assets/images";
import { useTheme } from "../themes/provider";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useProfile } from "../firebase/provider";
import CommentTextInput from "./CommentTextInput";
import WorkoutCard from "./WorkoutCard";
import FoodCard from "./FoodCard";
import { deletePostById, toggleLike } from "../firebase/firestore";
import GoalChart from "./GoalChart";

const Post = ({ item }) => {
  const { theme, dimensions } = useTheme();
  const styles = getStyles(theme);
  const [addComment, setAddComment] = useState(false);
  const { user } = useProfile();
  const OptionDropdown = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownPosition, setDropDownPosition] = useState(null);

  const timeAgo = (timestamp) => {
    const timeDiffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    const localDate = new Date(timestamp);
    if (timeDiffSeconds < 120) {
      return `just now`;
    } else if (timeDiffSeconds < 3600) {
      return `${Math.floor(timeDiffSeconds / 60)} minutes ago`;
    } else if (timeDiffSeconds < 7200) {
      return `1 hour ago`;
    } else if (timeDiffSeconds < 86400) {
      return `${Math.floor(timeDiffSeconds / 3600)} hours ago`;
    } else
      return localDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  };

  const onPressHandler = async () => {
    try {
      setShowDropDown(false);
      await deletePostById(item.id);
    } catch (error) {
      alert("Server error");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View>
      {showDropDown ? (
        <View
          style={{
            position: "absolute",
            right: 26,
            top: 45,
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: 160,
              height: 48,
              backgroundColor: theme.SecondaryBackgroundColor,
              opacity: 0.9,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderColor: theme.PrimaryBorderColor,
              borderWidth: 1,
              overflow: "hidden",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
            onPress={onPressHandler}
          >
            <MaterialIcons name="delete" size={18} color={theme.DangerColor} />
            <Text
              style={{ color: theme.DangerColor, fontSize: 16, marginLeft: 6 }}
            >
              Delete post
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.profilePictureContainer}>
          <Image
            style={styles.profilePicture}
            source={
              item.thumbnailURI === "" || item.thumbnailURI === undefined
                ? IMG_NO_PROFILE_PICTURE
                : { uri: item.thumbnailURI }
            }
          />
        </TouchableOpacity>
        <View style={styles.postTitle}>
          <View style={styles.postAuthorContainer}>
            <Text style={styles.postAuthorText}>{item.author}</Text>
          </View>
          <View style={styles.postAuthorContainer}>
            <Text style={styles.postSubHeadingText}>
              {item.type} // {timeAgo(item.createdAt)}
            </Text>
          </View>
        </View>
        {item.createdBy === user.uid ? (
          <View ref={OptionDropdown}>
            <TouchableOpacity
              style={{
                paddingVertical: 3,
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: 30,
              }}
              onPress={() => {
                OptionDropdown.current.measureInWindow(
                  (x, y, width, height) => {
                    setDropDownPosition({ x: x, y: y });
                    setShowDropDown((prevState) => !prevState);
                    console.log(showDropDown, dropDownPosition);
                  }
                );
              }}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={theme.PrimaryTextColor}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View style={styles.postBody}>
        {item.type === "Workout" ? (
          item.details != undefined ? (
            <WorkoutCard
              duration={item.details.duration}
              sportsId={item.details.sportsId}
              text={item.text}
            />
          ) : (
            <Text style={styles.postBodyText}>{item.text}</Text>
          )
        ) : null}
        {item.type === "Food" ? (
          item.details != undefined ? (
            <FoodCard
              imageURL={item.details.imageURL}
              foodId={item.details.foodId}
              text={item.text}
            />
          ) : (
            <Text style={styles.postBodyText}>{item.text}</Text>
          )
        ) : null}
        {item.type === "Progress" ? (
          item.details != undefined ? (
            <View style={{ paddingHorizontal: 8 }}>
              <GoalChart
                actualData={item.details.progressData.map((d) => ({
                  x: d.dataDate,
                  y: d.value,
                }))}
                endDate={item.details.targetDate}
                endValue={item.details.targetValue}
                height={item.details.height}
                male={item.details.gender === "m" ? true : false}
                startDate={item.details.startDate}
                startValue={item.details.startValue}
                statId={item.details.statId}
                key={item.details.id}
                showChartBounds={item.details.settings.showChartBounds}
                showChartCategories={item.details.settings.showChartCategories}
              />
              <Text style={styles.postBodyText}>{item.text}</Text>
            </View>
          ) : (
            <Text style={styles.postBodyText}>{item.text}</Text>
          )
        ) : null}
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            toggleLike(item.id, user, item.likes.includes(user.displayName))
          }
        >
          {item.likes.includes(user.displayName) ? (
            <FontAwesome name="heart" size={24} color={theme.DangerColor} />
          ) : (
            <FontAwesome name="heart-o" size={24} color={theme.ShadowColor} />
          )}
        </TouchableOpacity>
        {item.likes.length > 0 ? (
          <View style={styles.counter}>
            <Text
              style={{
                color: theme.SecondaryTextColor,
              }}
            >
              {item.likes.length}
            </Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={[styles.buttonContainer, { paddingBottom: 4 }]}
          onPress={() => setAddComment(true)}
        >
          <FontAwesome name="comment-o" size={24} color={theme.ShadowColor} />
        </TouchableOpacity>
        {item.comments.length > 0 ? (
          <View style={styles.counter}>
            <Text
              style={{
                color: theme.SecondaryTextColor,
              }}
            >
              {item.comments.length}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.commentsContainer}>
        {addComment ? (
          <CommentTextInput
            postID={item.id}
            user={user}
            setAddComment={setAddComment}
          />
        ) : null}
        {item.comments === undefined
          ? null
          : item.comments
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((comment, index) => (
                <View style={styles.commentRow} key={index}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text
                    style={styles.commentText}
                    ellipsizeMode="tail"
                    numberOfLines={3}
                  >
                    {comment.text}
                  </Text>
                </View>
              ))}
      </View>
    </View>
  );
};

export default Post;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    postContainer: {},
    postHeader: {
      height: 56,
      width: "100%",
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.PrimaryBorderColor,
      backgroundColor: theme.SecondaryBackgroundColor,
    },
    profilePictureContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: "hidden",
      margin: 8,
    },
    profilePicture: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },
    postTitle: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-around",
      paddingVertical: 3,
      marginLeft: 5,
    },
    postAuthorContainer: {
      height: 25,
      width: "100%",
      justifyContent: "center",
    },
    postAuthorText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.PrimaryTextColor,
    },
    postSubHeadingText: {
      color: theme.PrimaryTextColor,
    },
    postBody: {
      width: "100%",
      padding: 0,
      justifyContent: "center",
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    postBodyText: {
      color: theme.PrimaryTextColor,
    },
    footerContainer: {
      height: 40,
      width: "100%",
      flexDirection: "row",
      backgroundColor: theme.PrimaryBackgroundColor,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.PrimaryBorderColor,
    },
    counter: {
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 2,
    },
    buttonContainer: {
      height: 40,
      width: 40,
      marginLeft: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    commentsContainer: {
      paddingHorizontal: 8,
      width: "100%",
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    commentRow: {
      width: "100%",
      flexDirection: "row",
      marginVertical: 6,
      alignItems: "center",
    },
    commentAuthor: {
      fontWeight: "bold",
      color: theme.PrimaryTextColor,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    commentText: {
      color: theme.PrimaryTextColor,
      marginLeft: 8,
      marginRight: 8,
    },
  });
  return styles;
};

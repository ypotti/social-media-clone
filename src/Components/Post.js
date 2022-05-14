import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db, auth } from "../../src/Database";

const Post = (props) => {
  const { imageUrl, username, caption, postId } = props;
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = onSnapshot(
        collection(doc(db, "posts", postId), "comments"),
        (snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        }
      );
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src="#" />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
};

export default Post;

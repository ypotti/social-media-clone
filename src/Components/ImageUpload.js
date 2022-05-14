import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "../Database";
import { collection, addDoc } from "firebase/firestore/lite";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "./image-upload.css";

const ImageUpload = ({ loggedInUser }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress
        const uploadProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        //   completes...
        getDownloadURL(ref(storage, `images/${image.name}`)).then(
          async (url) => {
            await addDoc(collection(db, "posts"), {
              timestamp: new Date(),
              caption: caption,
              imageUrl: url,
              username: loggedInUser.email.split("@")[0],
            });
            setProgress(0);
            setImage(null);
            setCaption("");
          }
        );
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        value={caption}
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;

import { useEffect, useState } from "react";
import "./App.css";
import headerLogo from "./assets/insta-logo.png";
import Post from "./Components/Post";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "./Database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import ImageUpload from "./Components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // console.log(authUser);
        setLoggedInUser(authUser);
      } else {
        setLoggedInUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loggedInUser]);

  useEffect(() => {
    const getPosts = async () => {
      // const postsCol = collection(db, "posts");
      // const postsQuery = query(postsCol, orderBy("timestamp", "desc"));
      // const postSnapshot = await getDocs(postsQuery);
      // const postsList = postSnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   post: doc.data(),
      // }));

      onSnapshot(collection(db, "posts"), (querySnapshot) => {
        const postsList = [];
        console.log(querySnapshot);
        querySnapshot.docs.forEach((doc) => {
          console.log(doc.data());
          postsList.push({
            id: doc.id,
            post: doc.data(),
          });
        });
        setPosts(postsList);
      });

      // setPosts(postsList);
    };

    return () => {
      getPosts();
    };
  }, []);

  const registerUser = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCred) => {
        return (userCred.user.displayName = user.username);
      })
      .catch((error) => {
        alert(error.message);
      });

    setOpen(false);
  };

  const logInUser = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, user.email, user.password).catch((error) =>
      alert(error.message)
    );

    setOpenLogIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
            <img src={headerLogo} alt="instagram" className="signup__logo" />
            <input
              className="app__form__input"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="password"
              className="app__form__input"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Button
              type="submit"
              className="app__form__button"
              onClick={registerUser}
            >
              Register
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openLogIn} onClose={() => setOpenLogIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
            <img src={headerLogo} alt="instagram" className="signup__logo" />
            <input
              className="app__form__input"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="password"
              className="app__form__input"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Button
              type="submit"
              className="app__form__button"
              onClick={logInUser}
            >
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img src={headerLogo} alt="instagram" className="header-logo" />
        {loggedInUser ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenLogIn(true)}>Login</Button>
            <Button onClick={() => setOpen(true)}>Register</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post key={id} postId={id} {...post} />
        ))}
      </div>

      {loggedInUser ? (
        <ImageUpload loggedInUser={loggedInUser} />
      ) : (
        <h2>Login to Upload</h2>
      )}
    </div>
  );
};

export default App;

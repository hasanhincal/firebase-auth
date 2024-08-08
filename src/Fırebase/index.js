import { initializeApp } from "firebase/app";
// auth kurulumu için importlar
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import store from "../store/index";
import { loginHandle, logoutHandle } from "../store/auth";
import { openModal } from "../store/modal";
import { setTodos } from "../store/todos";
import { setUserData } from "../utils";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAvL2KE0tePcFT2hPHXi7zA81fkSyOLq4",
  authDomain: "auth-8a9dc.firebaseapp.com",
  projectId: "auth-8a9dc",
  storageBucket: "auth-8a9dc.appspot.com",
  messagingSenderId: "330990393454",
  appId: "1:330990393454:web:027bd10aaa2217f05b2e7f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Kimlik doğrulama hizmetinin referansını al:
export const auth = getAuth();

// veritabanı kurulumu
export const db = getFirestore(app);

// google sağlayıcısının kurulumu
export const provider = new GoogleAuthProvider();

export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return user;
  } catch (error) {
    toast.error(`${error.message}`);
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    toast.error(`${error.message}`);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

export const update = async (data) => {
  try {
    await updateProfile(auth.currentUser, data);
    toast.success("Profil Güncellendi");
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(
      `Doğrulama maili ${auth.currentUser.email} adresine gönderildi.Lütfen Kontrol edin!`
    );
  } catch (error) {
    toast.error(error.message);
  }
};

export const resetPassword = async (password) => {
  try {
    await updatePassword(auth.currentUser, password);
    toast.success("Password updated");
    return true;
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      store.dispatch(
        openModal({
          name: "re-auth-modal",
        })
      );
    }
    toast.error(error.message);
  }
};

export const reAuth = async (password) => {
  try {
    const credential = await EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    const { user } = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );
    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    setUserData();

    onSnapshot(
      query(
        collection(db, "todos"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      ),
      (doc) => {
        store.dispatch(
          setTodos(
            doc.docs.reduce(
              (todos, todo) => [...todos, { ...todo.data(), id: todo.id }],
              []
            )
          )
        );
      }
    );
  } else {
    store.dispatch(logoutHandle());
  }
});

export const addTodo = async (data) => {
  try {
    data.createdAt = serverTimestamp();
    const result = await addDoc(collection(db, "todos"), data);
    return result.id;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, "todos", id));
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateTodo = async (id, data) => {
  try {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, data);
    toast.success("Todo güncellendi.");
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

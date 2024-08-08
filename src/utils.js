import { auth } from "./Fırebase";
import store from "./store";
import { loginHandle } from "./store/auth";
import { closeModal, openModal } from "./store/modal";

export const modalClose = () => {
  store.dispatch(closeModal());
};
export const modal = (name, data = false) => {
  store.dispatch(
    openModal({
      name,
      data,
    })
  );
};
export const setUserData = () => {
  store.dispatch(
    loginHandle({
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      emailVerified: auth.currentUser.emailVerified,
      photoURL: auth.currentUser.photoURL,
      uid: auth.currentUser.uid,
    })
  );
};

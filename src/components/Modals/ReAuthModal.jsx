import React from "react";
import LoginForm from "../LoginForm";
import { reAuth, login } from "../../Fırebase/index";

const ReAuthModal = ({ close }) => {
  const handleSubmit = async (e, password) => {
    e.preventDefault();

    await reAuth(password);

    close();
  };

  return <LoginForm handleSubmit={handleSubmit} noEmail={true} />;
};

export default ReAuthModal;

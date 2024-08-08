import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Modal from "./components/Modal";
import { useSelector } from "react-redux";
import Settings from "./pages/Settings";

const App = () => {
  const { open, data } = useSelector((state) => state.modal);
  return (
    <>
      {open && <Modal name={open} data={data} />}
      <div className="mx-auto max-w-2xl w-full mt-5 flex flex-col gap-4 p-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

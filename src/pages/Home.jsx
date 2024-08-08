import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addTodo,
  auth,
  deleteTodo,
  emailVerification,
  logout,
} from "../Fırebase";
import { logoutHandle } from "../store/auth";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { modal } from "../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/tr";

dayjs.extend(relativeTime);
dayjs.locale("tr");

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { todos } = useSelector((state) => state.todos);
  const [todo, setTodo] = useState("");
  const [done, setDone] = useState(true);
  const [animationParent] = useAutoAnimate();
  console.log(todo);
  const submitHandle = async (e) => {
    e.preventDefault();

    await addTodo({
      todo,
      uid: user.uid,
      done,
    });
    setTodo("");
  };
  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  const handleLogout = async () => {
    await logout();
    dispatch(logoutHandle());
    navigate("/login", {
      replace: true,
    });
  };

  const handleVerification = async () => {
    await emailVerification();
  };

  if (user) {
    return (
      <>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-5">
          <div className="flex items-center gap-5">
            <img
              src={user.photoURL && user.photoURL}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="font-semibold pe-3">
              Welcome {user.displayName}
              <span className="font-light ps-2">"{user.email}"</span>
            </h1>
          </div>
          <div className="flex gap-3 items-center ">
            <Link
              to={"/settings"}
              className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
            >
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
            >
              Sign Out
            </button>

            {!user.emailVerified && (
              <button
                type="button"
                onClick={handleVerification}
                className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
              >
                E-posta onayla
              </button>
            )}
          </div>
        </div>
        <form
          onSubmit={submitHandle}
          className="   flex items-center gap-4 p-2"
        >
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            type="text"
            placeholder="todo write..."
            className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label htmlFor="check" className="select-none">
            <input
              className="outline-none mr-2"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
              type="checkbox"
              name="check"
              id="check"
            />
            Tamamlandı olarak işaretle
          </label>
          <button
            disabled={!todo}
            type="submit"
            className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
          >
            ADD
          </button>
        </form>
        <ul ref={animationParent} className="mt-4 flex flex-col gap-y-2 p-2">
          {todos.length > 0 &&
            todos.map((todo) => (
              <li
                key={todo.id}
                className="bg-indigo-50 text-sm  text-indigo-700 p-4 rounded flex items-center justify-between gap-3"
              >
                <span className={`${todo.done ? "line-through" : ""}`}>
                  {todo.todo}
                </span>
                <span>
                  {todo.createdAt &&
                    dayjs.unix(todo.createdAt.seconds).fromNow()}
                </span>
                <div className="flex gap-x-2">
                  <button
                    onClick={() => modal("edit-todo-modal", todo)}
                    className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
                  >
                    DELETE
                  </button>
                </div>
              </li>
            ))}
          {todos.length === 0 && (
            <li className="bg-orange-100 text-sm  text-orange-700 p-4 rounded flex items-center justify-between gap-3">
              Hiç todo eklemedin!
            </li>
          )}
        </ul>
      </>
    );
  }

  return (
    <>
      <div className="flex gap-5 mx-auto mt-5 w-full">
        <Link to={"/register"}>Register</Link>
        <Link to={"/login"}>Login</Link>
      </div>
      <ul ref={animationParent} className="mt-4 flex flex-col gap-y-2 p-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-indigo-50 text-sm  text-indigo-700 p-4 rounded flex items-center justify-between gap-3"
          >
            {todo.todo}
            <button
              onClick={() => handleDelete(todo.id)}
              className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
            >
              DELETE
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="bg-orange-100 text-sm  text-orange-700 p-4 rounded flex items-center justify-between gap-3">
            Hiç todo eklemedin!
          </li>
        )}
      </ul>
    </>
  );
};

export default Home;

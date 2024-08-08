import { useState } from "react";
import { updateTodo } from "../../Fırebase";

const EditTodoModal = ({ close, data }) => {
  console.log(data);
  const [todo, setTodo] = useState(data.todo);
  const [done, setDone] = useState(data.done);
  console.log(data.todo);
  const clickHandle = async () => {
    await updateTodo(data.id, { todo, done });
    close();
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="edit"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        EDIT TODO
      </label>
      <input
        className="block w-full rounded-md text-sm font-medium leading-6 text-gray-900"
        type="text"
        id="edit"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <label htmlFor="check">
        <input
          type="checkbox"
          id="check"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
        Tamamlandı olarak işaretle
      </label>
      <button
        onClick={clickHandle}
        className="flex justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-70"
      >
        SAVE
      </button>
    </div>
  );
};

export default EditTodoModal;

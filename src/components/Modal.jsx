import React, { useState } from "react";
import modals from "../modals";
import { Dialog, DialogPanel } from "@headlessui/react";
import { modalClose } from "../utils";

const Modal = ({ name, data }) => {
  console.log(name, data);
  const currentModal = modals.find((m) => m.name === name);
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(modalClose, 300);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50 ">
        <div className="fixed inset-0  flex w-screen items-center bg-black bg-opacity-50 justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border  bg-white shadow-lg rounded-lg p-12">
            <currentModal.element close={closeModal} data={data} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;

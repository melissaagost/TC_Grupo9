"use client";

import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info"; // 🔥 ahora también aceptamos "info"
    onClose: () => void;
  }

  const Toast = ({ message, type, onClose }: ToastProps) => {
    return (
      <div
        className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg font-raleway text-white
        ${
          type === "success"
            ? "bg-toast-green"
            : type === "error"
            ? "bg-toast-red"
            : "bg-toast-blue" // 🔥 INFO -> color celeste
        }
        `}
      >
        {message}
        <button onClick={onClose} className="ml-4 font-bold">X</button>
      </div>
    );
  };

  export default Toast;



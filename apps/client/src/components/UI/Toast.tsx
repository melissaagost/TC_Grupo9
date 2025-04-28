"use client";



import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
  }


  const Toast = ({ message, type, onClose }: ToastProps) => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false); //
      }, 2500); // Mostrar 2.5 segundos

      return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
      if (!isVisible) {
        const timeout = setTimeout(() => {
          onClose();
        }, 300);

        return () => clearTimeout(timeout);
      }
    }, [isVisible, onClose]);


    return (
      <div
        className={`fixed bottom-4 right-4 px-10 py-6  rounded-tl-xl shadow-lg font-urbanist text-xl text-white
           inline-flex items-center
           animate-slide-in
           transition-all duration-300 hover:-translate-y-1
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${
          type === "success"
            ? "bg-toast-green shadow-green-700"
            : type === "error"
            ? "bg-toast-red shadow-red-950"
            : "bg-toast-blue shadow-blue-800" // 🔥 INFO -> color celeste
        }
        `}
      >
        {message}
        <button onClick={onClose} className="ml-4 hover:bg-white hover:text-black hover:rounded-4xl font-bold"><CircleX size={'30'}/></button>
      </div>
    );
  };

  export default Toast;



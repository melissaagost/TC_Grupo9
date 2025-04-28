"use client";

import { Dialog as HeadlessDialog, Transition, CloseButton } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Dialog = ({ open, onClose, children }: DialogProps) => {
  return (
<Transition show={open} as={Fragment}>
  <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>

    {/* Fondo oscuro */}
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black/25 backdrop-blur-lg" />
    </Transition.Child>

    {/* Contenedor del modal */}
    <div className="fixed inset-0 flex items-center justify-center p-4">

      <div className="relative w-full max-w-md">

        {/* Botón de Cerrar SIEMPRE VISIBLE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-700 transition-colors z-50"
        >
          <span className="sr-only">Cerrar</span>
          ✕
        </button>

        {/* Panel que hace animación */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <HeadlessDialog.Panel className="bg-eggshell-400 p-6 rounded-xl shadow-2xl w-full">
            {children}
          </HeadlessDialog.Panel>
        </Transition.Child>

      </div>

    </div>

  </HeadlessDialog>
</Transition>

  );
};

export const DialogContent = ({ children }: { children: ReactNode }) => (
  <div className="font-urbanist">{children}</div>
);

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="mb-4 ">{children}</div>
);

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <HeadlessDialog.Title className="text-3xl font-raleway text-blood-100 font-semibold">{children}</HeadlessDialog.Title>
);

export const DialogTrigger = ({ children, ...props }: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

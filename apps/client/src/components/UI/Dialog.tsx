"use client";

import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel className="bg-eggshell-400 p-6 rounded-xl shadow-2xl w-full max-w-md">
              {children}
            </HeadlessDialog.Panel>

          </Transition.Child>
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

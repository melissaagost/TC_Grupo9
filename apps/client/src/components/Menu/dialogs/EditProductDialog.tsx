// src/components/Menu/dialogs/EditProductDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../UI/Dialog";
import { ItemGuardarDTO, ItemRowDTO } from "../../../types/itemTypes";
import { ItemForm } from "./ItemForm";

interface EditItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedItem: ItemGuardarDTO) => Promise<void>;
  initialData: ItemRowDTO | null;
  categorias: { id: number; nombre: string }[];
  menus: { id: number; nombre: string }[];
  setToastType: (type: "success" | "error" | "info") => void;
  setToastMessage: (msg: string) => void;
}

export const EditItemDialog = ({
  open,
  onClose,
  onSave,
  initialData,
  categorias,
  menus,
  setToastMessage,
  setToastType,
}: EditItemDialogProps) => {
  if (!initialData) return null; // opcional: evitar render si no hay data

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        <ItemForm
          mode="edit"
          initialValues={initialData}
          id_menu={initialData.id_menu}
          categorias={categorias}
          menus={menus}
          onSubmit={onSave}
          onCancel={onClose}
          setToastType={setToastType}
          setToastMessage={setToastMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

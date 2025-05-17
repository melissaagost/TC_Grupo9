import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../UI/Dialog";
import { ItemGuardarDTO } from "../../../types/itemTypes";
import { ItemForm } from "./ItemForm";

interface CreateItemDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (item: ItemGuardarDTO) => Promise<void>;
  categorias: { id: number; nombre: string }[];
  id_menu: number;
  setToastType: (type: "success" | "error" | "info") => void;
  setToastMessage: (msg: string) => void;
}

export const CreateItemDialog = ({
  open,
  onClose,
  onCreate,
  categorias,
  id_menu,
  setToastMessage,
  setToastType,
}: CreateItemDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>

        <ItemForm
          mode="create"
          initialValues={undefined}
          id_menu={id_menu}
          categorias={categorias}
          onSubmit={onCreate}
          onCancel={onClose}
          setToastType={setToastType}
          setToastMessage={setToastMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

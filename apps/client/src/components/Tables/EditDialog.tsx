// components/EditDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import TableForm from "./TableForm";

interface EditDialogProps {
  open: boolean;
  editNumero: number;
  editCapacidad: number;
  editDescripcion: string;
  setEditNumero: (value: number) => void;
  setEditCapacidad: (value: number) => void;
  setEditDescripcion: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditDialog = ({
  open,
  editNumero,
  editCapacidad,
  editDescripcion,
  setEditNumero,
  setEditCapacidad,
  setEditDescripcion,
  onClose,
  onSubmit,
}: EditDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Mesa</DialogTitle>
      </DialogHeader>
      <TableForm
        numero={editNumero}
        capacidad={editCapacidad}
        descripcion={editDescripcion}
        onNumeroChange={setEditNumero}
        onCapacidadChange={setEditCapacidad}
        onDescripcionChange={setEditDescripcion}
        onCancel={onClose}
        onSubmit={onSubmit}
        submitLabel="Guardar Cambios"
      />
    </DialogContent>
  </Dialog>
);

export default EditDialog;

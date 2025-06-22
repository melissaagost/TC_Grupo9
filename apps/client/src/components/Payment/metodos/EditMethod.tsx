import {Dialog, DialogHeader, DialogTitle} from "../../../components/UI/Dialog";
import MethodsForm from "./MethodsForm";
import { MetodoPagoGuardarDTO } from "../../../types/paymentTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: MetodoPagoGuardarDTO) => void;
  initialData: MetodoPagoGuardarDTO | null;
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

const EditMethod = ({ open, onClose, onSave, initialData, onToast }: Props) => (
  <Dialog open={open} onClose={onClose}>
    <DialogHeader>
      <DialogTitle>Editar Método de Pago</DialogTitle>
    </DialogHeader>
    {initialData && <MethodsForm mode="edit" onSubmit={onSave} initialValues={initialData} onToast={onToast}/>}
  </Dialog>
);

export default EditMethod;

import NewOrderModal from "./NewOrder/NewOrderModal";
import { useState } from "react";
const OrderTable = () => {
     const [open, setOpen] = useState(true);
    return (

        <>


        <NewOrderModal isOpen={open} onClose={() => setOpen(false)} ></NewOrderModal>
        </>
    );
};

export default OrderTable;
import OrderTable from "../components/Order/OrderTable";
const Orders = () => {
    return(
        <div className="w-full bg-eggshell-whitedove min-h-screen py-8 px-4">
            <div className="max-w-screen-2xl mx-auto">
                <OrderTable/>
            </div>
        </div>
    );
};

export default Orders;
import OrderTable from "../components/Order/OrderTable";
import FadeEffect from "../components/UI/FadeEffect";

const Orders = () => {
    return(
        <FadeEffect duration={1}>
            <div className="w-full bg-eggshell-whitedove min-h-screen py-8 px-4">
                <div className="max-w-screen-2xl mx-auto">
                    <OrderTable/>
                </div>
            </div>
        </FadeEffect>
    );
};

export default Orders;
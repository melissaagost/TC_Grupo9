//vista de gestion de metodos de pagos
import FadeEffect from "../components/UI/FadeEffect";
import MethodsTable from "../components/Payment/metodos/MethodsTable";
const PaymentMethods = () => {
    return(

        <FadeEffect duration={1}>

            <div className="w-full bg-blood-100/5 min-h-screen py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                   <MethodsTable/>

                </div>

            </div>

        </FadeEffect>
    );
};

export default PaymentMethods;


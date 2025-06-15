//vista de gestion de pagos
import FadeEffect from "../components/UI/FadeEffect";
import PaymentsTable from '../components/Payment/pagos/PaymentsTable'
const Payments = () => {
    return(
        <FadeEffect duration={1}>

            <div className="w-full bg-blood-100/5 min-h-screen py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                    <PaymentsTable/>

                </div>

            </div>

        </FadeEffect>
    );
};

export default Payments;
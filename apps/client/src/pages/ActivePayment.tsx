import FadeEffect from "../components/UI/FadeEffect";
import ActivePaymentCard from '../components/Payment/activePayment/ActivePaymentCard'
const ActivePayment = () => {

    return(

         <FadeEffect duration={1}>

            <div className="w-full bg-white min-h-screen py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                    <ActivePaymentCard/>

                </div>

            </div>

        </FadeEffect>
    );

};

export default ActivePayment;
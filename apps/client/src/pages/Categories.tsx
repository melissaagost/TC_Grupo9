import FadeEffect from "../components/UI/FadeEffect";
import Title from "../components/ItemCategory/Title";
import CategoryTable from "../components/ItemCategory/CategoryTable";

const Categories = () => {
    return(

        <FadeEffect duration={1}>

            <div className="w-full bg-eggshell-whitedove min-h-screen py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                    <Title/>

                    <CategoryTable/>

                </div>

            </div>

        </FadeEffect>

    );
};

export default Categories;
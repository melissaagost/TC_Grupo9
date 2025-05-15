import Title from "../components/Menu/Title";
import MenuTable from "../components/Menu/MenuTable";
import FadeEffect from "../components/UI/FadeEffect";
import Subtitle from "../components/Menu/Subtitle";
import MenuItemTable from "../components/Menu/MenuItemTable";

const Menu = () => {
    return(

        <FadeEffect duration={1}>

            <div className="w-full bg-eggshell-whitedove min-h-screen py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                    <Title/>

                    <MenuTable/>

                    <Subtitle/>

                    <MenuItemTable/>

                </div>

            </div>

        </FadeEffect>
    );
};

export default Menu;
import Header from "../components/MenuAdmin/Header";
import FadeEffect from "../components/UI/FadeEffect";

const Menu = () => {
    return(
        <FadeEffect duration={1}>
            <div>
                <Header/>
            </div>
        </FadeEffect>
    );
};

export default Menu;
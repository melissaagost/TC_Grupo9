import AuthForms from './AuthForms'
import AuthPic from './AuthPic'
import { Card } from "../UI/Card";

const AuthBox = () => {
    return(

        <div className="min-h-screen flex items-center justify-center bg-eggshell-whitedove 0 p-4">

            <Card className="w-full max-w-4xl overflow-hidden animate-slide-in">

                <div className="flex flex-col md:flex-row">
                    {/* Left side - Image */}
                    <AuthPic />

                    {/* Right side - Forms */}
                    <AuthForms />
                </div>

            </Card>

        </div>

    );
};

export default AuthBox;
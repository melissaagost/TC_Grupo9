const AuthPic = () =>{

    return(

        <div className="md:w-1/2 relative">

            <img
                src="./assets/img/authpic.jpg"
                alt="Restaurant"
                className="object-cover w-full h-full min-h-[300px] md:min-h-[600px]"
            />

            <div className="absolute inset-0 bg-blood-100/60 backdrop-blur-xs"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">

                <h1 className="text-4xl font-playfair mb-4">FoodTable Pro</h1>

                <p className="text-cream-100 font-raleway text-center max-w-xs">
                    Optimiza la gestión de tu restaurante con nuestra plataforma integral.
                </p>

            </div>

        </div>
    );

};

export default AuthPic;
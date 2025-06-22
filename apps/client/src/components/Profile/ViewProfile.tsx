import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Mail, User} from "lucide-react";
import { Button } from "../UI/Button";
import ProfileCard from "../UI/ProfileCard";
import userService from '../../services/userService';
import pfp from '../../assets/pfp.svg'



const ViewProfile = () => {

     const [user, setUser] = useState<any>(null);
     const token = localStorage.getItem("token") || "";

        useEffect(() => {
            const fetchProfile = async () => {
            try {

                const data = await userService.getProfile(token);
                setUser(data);

            } catch (error) {

                console.error("Error al obtener el perfil del usuario:", error);

            }
            };

            fetchProfile();

        }, [token]);

        if (!user) return <p className="text-center font-urbanist mt-10">Cargando perfil...</p>;

    return(

        <section className="bg-eggshell-whitedove font-raleway">

            <div className="container mx-auto py-8">

                <div className="max-w-2xl  mx-auto ">

                    <ProfileCard>

                        <ProfileCard.Header>
                            <div className="flex items-center justify-between">
                                <ProfileCard.Title>Perfil</ProfileCard.Title>
                                <Button>
                                <Link to="/profile/edit" className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar Perfil
                                </Link>
                                </Button>
                            </div>
                        </ProfileCard.Header>

                        <ProfileCard.Content>

                            <div className="flex flex-col items-center gap-3">
                                <div className="h-30 w-30 overflow-hidden rounded-full">
                                      <img
                                            src={pfp}
                                            alt="Imagen de perfil"
                                            className="h-full w-full object-cover"
                                        />
                                </div>

                                <h2 className="text-2xl font-semibold">{user.nombre}</h2>
                            </div>

                            <div className="grid gap-4 mt-6 text-gray-600">
                                <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5" />
                                <span>{user.correo}</span>
                                </div>
                            </div>

                            <div className="grid gap-4 mt-6 text-gray-600">
                                <div className="flex items-center gap-3">
                                <User className="h-5 w-5" />
                                <span>Tipo de Usuario: {user.tipo_usuario || "No especificado"}</span>
                                </div>
                            </div>

                        </ProfileCard.Content>

                    </ProfileCard>

                </div>

            </div>

        </section>

    );
};

export default ViewProfile;
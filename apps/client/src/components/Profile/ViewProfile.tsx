import { Link } from "react-router-dom";
import { Edit, Mail, User } from "lucide-react";
import { Button } from "../UI/Button";
import ProfileCard from "../UI/ProfileCard";

// Mock user data (remplazarás luego con contexto o llamada a API)
const mockUserData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    joinDate: "2024-01-14",
    profileType: "Admin",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };


const ViewProfile = () => {
    return(

        <section className="bg-eggshell-whitedove font-raleway">

            <div className="container  mx-auto py-8">

                <div className="max-w-2xl mx-auto">

                    <ProfileCard>

                        <ProfileCard.Header>
                            <div className="flex items-center justify-between">

                                <ProfileCard.Title>Perfil</ProfileCard.Title>

                                <Button  >
                                    <Link to="/profile/edit" className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                        Editar Perfil
                                    </Link>
                                </Button>

                            </div>
                        </ProfileCard.Header>

                        <ProfileCard.Content>

                            <div className="flex flex-col items-center gap-4">

                                <div className="h-24 w-24 overflow-hidden rounded-full">
                                    <img
                                    src={mockUserData.profileImage}
                                    alt={mockUserData.name}
                                    className="h-full w-full object-cover"
                                    />
                                </div>

                                <h2 className="text-2xl font-semibold">{mockUserData.name}</h2>
                            </div>

                            <div className="grid gap-4 mt-6 text-gray-600">

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5" />
                                    <span>{mockUserData.email}</span>
                                </div>

                            </div>

                            <div className="grid gap-4 mt-6 text-gray-600">

                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5" />
                                    <span>Tipo de Usuario: {mockUserData.profileType}</span>
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
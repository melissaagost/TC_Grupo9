import UserTable from '../components/UsersMgt/UserTable';
import UserStats from '../components/UsersMgt/UserStats';
import Header from '../components/UsersMgt/Header';
import FadeEffect from '../components/UI/FadeEffect';

const Users = () => {

  return (

    <FadeEffect duration={1}>
        <div className="w-full bg-eggshell-whitedove min-h-screen py-8 px-4">

            <div className="max-w-screen-2xl mx-auto">

                <Header/>

                {/* contenido */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Quick Stats */}
                    <div className="lg:col-span-1">
                        <UserStats />
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="lg:col-span-3">
                        <UserTable />
                    </div>

                </div>

            </div>

        </div>
    </FadeEffect>

  );

};

export default Users;


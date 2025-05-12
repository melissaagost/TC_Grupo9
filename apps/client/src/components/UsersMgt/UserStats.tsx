import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import userService from "../../services/userService";

const UserStats = () => {

  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    inactive: 0,
  });

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers(token);

        const total = data.length;
        const admins = data.filter((u: any) => u.tipo_usuario === "administrador").length;
        const users = data.filter((u: any) => u.tipo_usuario === "usuario").length;
        const inactive = data.filter((u: any) => u.estado === 0).length;

        setStats({ total, admins, users, inactive });
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    fetchUsers();
  }, []);

  return (

    <div className="bg-white rounded-lg shadow-md p-6 w-85">

      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="font-playfair font-semibold text-xl text-gray-700">
          Quick Overview
        </h3>
        <User2 className="text-blood-100" />
      </div>

        <div className="text-center font-urbanist">
          <p className="text-3xl font-semibold text-blood-100">{stats.total}</p>
          <p className="text-gray-600">Total de Usuarios</p>
        </div>

        <div className="grid grid-cols-2 font-urbanist gap-4 mt-6 text-center">
          <div>
            <p className="text-xl text-blood-100 font-semibold">{stats.admins}</p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>

          <div>
            <p className="text-xl text-yellow-600 font-semibold">{stats.users}</p>
            <p className="text-sm text-gray-600">Empleados</p>
          </div>

          <div>
            <p className="text-xl text-gray-500 font-semibold">{stats.inactive}</p>
            <p className="text-sm text-gray-600">Inactivos</p>
          </div>

        </div>

      </div>



  );
};

export default UserStats;

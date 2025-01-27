import Sidebar from "./sidebar";
import CardTransaction from "./cardTransaction";
import CardUser from "./cardUser";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Bienvenido al Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
            
          <CardTransaction 
            title="Gestión de ingresos y egresos"
            href="/tableTransaction"
         />

          <CardUser 
            title="Gestión de usuarios"
            href="/tableUser"
          />   
          
          {/* Aquí se agregarán más tarjetas en el futuro */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

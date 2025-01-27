import Link from "next/link";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-200 flex flex-col shadow-md">
            <nav className="mt-8">

                <ul>
                    <li>
                        <Link
                            href="/dashboard"
                            className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/tableTransaction"
                            className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
                        >
                            Ingresos y egresos
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/tableUser"
                            className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
                        >
                            Usuarios
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/reportes"
                            className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
                        >
                            Reportes
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

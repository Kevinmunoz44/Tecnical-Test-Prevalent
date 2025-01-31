import Link from "next/link";

/*
 * Componente de tarjeta para enlaces de usuario.
 *
 * - `title`: Texto que se mostrará en la tarjeta.
 * - `href`: Ruta a la que redirigirá la tarjeta al hacer clic.
 */

type CardUserProps = {
  title: string;
  href: string;
};

const CardUser = ({ title, href }: CardUserProps) => {
  return (
    <Link href={href} passHref>
      <div className="cursor-pointer bg-gray-100 p-6 rounded-lg shadow-md 
                      hover:shadow-lg transition-shadow duration-300 hover:bg-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 text-center">{title}</h2>
      </div>
    </Link>
  );
};

export default CardUser;

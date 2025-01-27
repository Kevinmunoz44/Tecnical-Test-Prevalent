import Link from "next/link";

type cardTransactionprop = {
  title: string;
  href: string;
};

const CardTransaction = ({ title, href }: cardTransactionprop) => {
  return (
    <Link href={href}>
      <div className="cursor-pointer bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 text-center">{title}</h2>
      </div>
    </Link>
  );
};

export default CardTransaction;

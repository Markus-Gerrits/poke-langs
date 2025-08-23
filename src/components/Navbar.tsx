import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="text-2x1 font-bold text-yellow-400">
                        PokeLangs
                    </div>
                    <ul className="flex space-x-6">
                        <li>
                            <Link 
                                to="/"
                                className="hover:text-yellow-300 transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/langdex"
                                className="hover:text-yellow-300 transition-colors duration-200"
                            >
                                Langdex
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/battle"
                                className="hover:text-yellow-300 transition-colors duration-200"
                            >
                                Battle
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
import { Link } from "react-router-dom";
import { useAuthState } from "../controllers/AuthState";
import api from "../utils/axios";

const Navbar = () => {
    const { state, setState } = useAuthState();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            setState("logged_out");
        } catch (err) {
            console.error("Logout error:", err);
            alert("Logout failed");
        }
    };

    let centerLinks;
    let endButton = null;

    if (state === "logged_in") {
        centerLinks = (
            <div className="flex flex-wrap gap-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/planner" className="text-gray-700 hover:text-blue-600">Planner</Link>
            </div>
        );
        endButton = (
            <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
                Logout
            </button>
        );
    } else {
        centerLinks = (
            <div className="flex flex-wrap gap-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/auth" className="text-gray-700 hover:text-blue-600">Login</Link>
            </div>
        );
    }

    return (
        <nav className="flex justify-between items-center px-6 py-6 z-100 bg-white shadow-md sticky top-0">
            <h1 className="text-xl font-bold text-blue-600">TravelPlanner</h1>
            {centerLinks}
            {endButton && (
                <div className="flex items-center">
                    {endButton}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
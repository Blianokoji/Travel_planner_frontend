import { useAuthState } from "../controllers/AuthState";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { state } = useAuthState();
    const navigate = useNavigate();

    const handleClick = () => {
        if (state === "logged_in") {
            navigate("/planner");
        } else {
            navigate("/auth");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0,0,0,0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHM0AmJJOVgVKi2qt8kbTmnrIV6zZQlLglGuXeaRr8mBtZJcIqV4C4lHIr8WGP5VaZYSbcyobye05fple_TBBmHAlPCn5M1soutEiRtqDhzfryGWCm1bE5VOqfOusxEweSHmvZs66_DONZKs6WTY9h3k20mfaLSgoGMOMNP9kgT4PdFq0ZJaMvJlHnRJZGF_3UhX-UxJ_SJOqnXjYIc5AfU6ydKjzOzO1w8fIFdnrzBCQ8eFVZnfOdQFLvpx_30bL16IbvHXYM828")`,
                fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
            }}
        >
            <div className="text-center px-4">
                <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_3px_8px_rgba(255,255,255,0.3)]">
                    Plan your next adventure
                </h1>
                <p className="text-white mt-4 text-base md:text-lg font-medium drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]">
                    Discover new destinations and create unforgettable travel experiences.
                </p>
                <button
                    onClick={handleClick}
                    className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Home;

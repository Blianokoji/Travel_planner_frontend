import { useState } from "react";
import { useAuthState } from "../controllers/AuthState";
import { useAuthView } from "../controllers/AuthView";
import api from "../utils/axios";

export const Login = () => {
    const { setState } = useAuthState();
    const { setView } = useAuthView();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("auth/login", { username, password }, { withCredentials: true });
            // console.log("Login response:", res.data);
            if (res.status === 200) {
                setState("logged_in");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed");
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="flex flex-col items-center gap-5 justify-center h-120 w-100 shadow-black shadow-lg rounded-xl bg-transparent backdrop-blur-sm px-10"
            >
                <div className="font-bold text-4xl">Login</div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-40">Login</button>
                <div className="text-sm text-black mt-2">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setView("register")} className="text-blue-600 hover:underline">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export const Register = () => {
    const { setView } = useAuthView();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await api.post("auth/register", { username, email, password }, { withCredentials: true });
            console.log("Register response:", res.data);
            if (res.status === 201) {
                setMessage(res.data.message); // Show "Registration successful"
            }

        } catch (err) {
            console.error("Registration error:", err);
            alert("Registration failed");
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
                className="flex flex-col items-center gap-5 justify-center h-130 w-110 shadow-black shadow-lg rounded-xl bg-transparent backdrop-blur-sm px-10"
            >
                <div className="font-bold text-4xl">Register</div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-b border-gray-300 p-1 w-full px-4"
                />
                <div className="text-red-500 text-sm">{error}</div>
                {(message === "Registration successful")?(
                    <div className="text-green-600 text-sm">{message}</div>
                ):(

                    <div className="text-red-500 text-sm">{message}</div>
                )
                }
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-40">Register</button>
                <div className="text-sm text-black mt-2">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setView("login")} className="text-blue-600 hover:underline">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};
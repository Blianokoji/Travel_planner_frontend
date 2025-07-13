import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import { useAuthState } from "./controllers/AuthState";
import {AuthViewProvider, useAuthView} from "./controllers/AuthView";
import { Login, Register } from "./components/Auth";
import Navbar from "./components/Navbar";
function AuthDisplay(){
    const {view} = useAuthView();
    return (
        <>
            {view === "login" ? <Login /> : <Register />}
        </>
    );

}

function App() {
  const { state } = useAuthState();
  return (
      <Router>
        <Navbar />
        <Routes>
          {state === "logged_in" ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
          ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthViewProvider><AuthDisplay/></AuthViewProvider>} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
          )}
        </Routes>
      </Router>
  );
}

export default App;

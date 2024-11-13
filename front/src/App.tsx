import { Route, Routes } from "react-router-dom";
import Register from "./pages/register/RegisterPage";
import Login from "./pages/login/LoginPage";
import ProtectedRoute from "./components/privetRoute";
import DefencePage from "./pages/defence/DefencePage";
import AttackPage from "./pages/attack/AttackPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/defence" element={<DefencePage />} />
        <Route path="/attack" element={<AttackPage />} />
      </Routes>
    </div>
  );
};
export default App;

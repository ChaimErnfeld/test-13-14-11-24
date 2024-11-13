import { Route, Routes } from "react-router-dom";
import Register from "./pages/register/RegisterPage";
import Login from "./pages/login/LoginPage";
import ProtectedRoute from "./components/privetRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};
export default App;

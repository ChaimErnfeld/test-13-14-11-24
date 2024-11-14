import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { loginUser } from "../../store/fetchers/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import "./LoginPage.css";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
    const token = sessionStorage.getItem("token");
    const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);
    if (decoded.organization === "IDF") {
      navigate("/defence");
    }
    if (decoded.organization !== "IDF") {
      navigate("/attack");
    }
  };

  return (
    <form className="Login" onSubmit={handleForm}>
      <h2>Login page</h2>
      <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>
        עוד לא רשום? <a href="/register">הירשם עכשיו</a>
      </p>
    </form>
  );
};

export default Login;

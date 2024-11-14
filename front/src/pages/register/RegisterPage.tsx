import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { registerUser } from "../../store/fetchers/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import "./RegisterPage.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [district, setDistrict] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleForm = (e: FormEvent) => {
    e.preventDefault();
    if (organization === "IDF") {
      dispatch(registerUser({ username, password, organization, district }));
      return;
    } else {
      dispatch(registerUser({ username, password, organization }));
      return;
    }
  };

  return (
    <form className="Register" onSubmit={handleForm}>
      <h2>register page</h2>
      <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select
        name="organization"
        id="organization"
        defaultValue="select"
        onChange={(e) => setOrganization(e.target.value)}
      >
        <option value="select" disabled>
          Select
        </option>
        <option value="IDF">IDF</option>
        <option value="Hezbollah">Hezbollah</option>
        <option value="Hamas">Hamas</option>
        <option value="IRGC">IRGC</option>
        <option value="Houthis">Houthis</option>
      </select>
      {organization === "IDF" && (
        <select name="district" id="district" defaultValue="select" onChange={(e) => setDistrict(e.target.value)}>
          <option value="select" disabled>
            Select
          </option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Center">Center</option>
          <option value="WestBank">West Bank</option>
        </select>
      )}
      <button type="submit">Register</button>
      <p>
        רשום כבר? <a href="/login">התחבר</a>
      </p>
    </form>
  );
};

export default Register;

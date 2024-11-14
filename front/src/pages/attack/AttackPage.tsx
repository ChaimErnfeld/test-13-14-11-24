import { useEffect, useState } from "react";
import "./AttackPage.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { Ammo, AmmoDetails, x } from "../../types";
import { getAmmos, updateAmountAmmo } from "../../store/fetchers/ammo/ammoSlice";
import socket from "../../socket";
import { getDetails, updateAttackList } from "../../store/fetchers/attack/attackSlice";
import { useNavigate } from "react-router-dom";

const AttackPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  //מקבל מערך עם מלאי הטילים שברשותו
  const ammos: Ammo[] = useSelector((state: any) => state.ammo.ammos);

  //מקבך את מערך האיומים שמשוגרים מהסלייס
  const attacks: x[] = useSelector((state: any) => state.attack.attacks);

  const attacksDetails: AmmoDetails = useSelector((state: any) => state.attack.details);
  const [attacksCountdown, setAttacksCountdown] = useState(attacks);

  const [district, setDistrict] = useState("");

  const [tableRows, setTableRows] = useState<x[]>([]);
  const [selectedAmmo, setSelectedAmmo] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAmmos({ organization: decoded.organization, district: decoded.district }));

    socket.on("updateMissile", (ammo) => {
      dispatch(updateAmountAmmo(ammo));
    });
    return () => {
      socket.off("updateMissile");
    };
  }, [ammos]);

  const handleAmmoClick = (ammoName: string) => {
    dispatch(getDetails(ammoName!));
    setSelectedAmmo(ammoName);

    socket.emit("updateMissile", { organization: decoded.organization, name: ammoName });
    console.log("speed:" + attacksDetails.speed);

    socket.emit("sendAttack", district, {
      name: ammoName,
      organization: decoded.organization,
      speed: 14,
    });

    setTableRows((prevRows) => [
      ...prevRows,
      {
        name: ammoName,
        organization: decoded.organization,
        speed: attacksDetails.speed,
      },
    ]);
  };

  return (
    <div className="AttackPage">
      <button
        onClick={() => {
          sessionStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      <div className="card-header">
        <h2>Organization: {decoded.organization}</h2>
        {decoded.district && <p>District: {decoded.district}</p>}
      </div>
      <div>
        <select name="district" id="district" defaultValue="select" onChange={(e) => setDistrict(e.target.value)}>
          <option value="select" disabled>
            Select
          </option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Center">Center</option>
          <option value="WestBank">West Bank</option>
        </select>
      </div>

      <div className="ammo-list">
        {ammos.map((ammo) => {
          return (
            <div key={ammo.name} className="ammo-item" onClick={() => handleAmmoClick(ammo.name)}>
              {ammo.name} X {ammo.amount}
            </div>
          );
        })}
      </div>

      <table>
        <tr>
          <th>Rocket</th>
          <th>Time To Hite</th>
          <th>Status</th>
        </tr>
        {tableRows && tableRows.length > 0 ? (
          tableRows.map((attack, index) => (
            <tr key={index}>
              <td>{attack.name}</td>
              <td>{attack.speed}</td>
              <td>{attack.organization}</td>
            </tr>
          ))
        ) : (
          <p>No attacks available</p>
        )}
      </table>
    </div>
  );
};

export default AttackPage;

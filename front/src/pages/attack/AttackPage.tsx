import React, { useEffect, useState } from "react";
import "./AttackPage.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { Ammo } from "../../types";
import { getAmmos } from "../../store/fetchers/ammo/ammoSlice";

const AttackPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  const ammos: Ammo[] = useSelector((state: any) => state.ammo.ammos);

  const [tableRows, setTableRows] = useState<{ rocket: string; time: string; status: string }[]>([]);

  useEffect(() => {
    dispatch(getAmmos({ organization: decoded.organization, district: decoded.district }));
  }, []);

  const handleAmmoClick = (ammoName: string) => {
    const currentTime = new Date().toLocaleString();
    const newRow = { rocket: ammoName, time: currentTime, status: "Pending" };

    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  return (
    <div className="AttackPage">
      <div className="card-header">
        <h2>Organization: {decoded.organization}</h2>
        {decoded.district && <p>District: {decoded.district}</p>}
      </div>
      <div>
        <select name="" id="">
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Center">Center</option>
          <option value="WestBank">West Bank</option>
        </select>
      </div>

      <div className="ammo-list">
        {ammos.map((ammo) => {
          return (
            <div key={Date.now()} className="ammo-item" onClick={() => handleAmmoClick(ammo.name)}>
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
        {tableRows.map((row, index) => (
          <tr key={index}>
            <td>{row.rocket}</td>
            <td>{row.time}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default AttackPage;

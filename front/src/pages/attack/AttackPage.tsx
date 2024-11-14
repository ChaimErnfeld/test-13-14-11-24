import React, { useEffect, useState } from "react";
import "./AttackPage.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { Ammo, AmmoDetails } from "../../types";
import { getAmmos, updateAmountAmmo } from "../../store/fetchers/ammo/ammoSlice";
import { getDetails } from "../../store/fetchers/attack/attackSlice";
import socket from "../../socket";

const AttackPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  const ammos: Ammo[] = useSelector((state: any) => state.ammo.ammos);
  //מקבך את מערך האיומים שמשוגרים מהסלייס
  const attacks: AmmoDetails[] = useSelector((state: any) => state.attack.attack);

  // const attackStatus = useSelector((state: any) => state.attack.status);

  const [tableRows, setTableRows] = useState<{ rocket: string; time: number; status: string }[]>([]);
  const [selectedAmmo, setSelectedAmmo] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAmmos({ organization: decoded.organization, district: decoded.district }));
    socket.on("updateMissile", (ammo) => {
      dispatch(updateAmountAmmo(ammo));
    });
    return () => {
      socket.off("updateMissile");
    };
  });

  // useEffect(() => {
  //   if (attackStatus === "succeeded" && ammosDetails && selectedAmmo) {
  //     const newRow = { rocket: selectedAmmo, time: ammosDetails.speed, status: "Pending" };
  //     setTableRows((prevRows) => [...prevRows, newRow]);
  //     setSelectedAmmo(null);
  //   }
  // }, [attackStatus, ammosDetails, selectedAmmo]);

  const handleAmmoClick = (ammoName: string) => {
    setSelectedAmmo(ammoName);
    dispatch(getDetails(ammoName));
    socket.emit("updateMissile", { organization: decoded.organization, name: ammoName });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTableRows((prevRows) =>
        prevRows.map((row) => {
          if (row.time > 0) {
            return { ...row, time: row.time - 1 };
          } else if (row.time === 0 && row.status === "Pending") {
            return { ...row, status: "Hit" };
          }
          return row;
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

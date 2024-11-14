import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAmmos } from "../../store/fetchers/ammo/ammoSlice";
import { jwtDecode } from "jwt-decode";
import { Ammo } from "../../types";
import "./DefencePage.css";

const DefencePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  //משתנה שמקבל מערך עם כל האיומים שמשוגרים
  const attacks = useSelector((state: any) => state.attack.attacks);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  const ammos: Ammo[] = useSelector((state: any) => state.ammo.ammos);

  useEffect(() => {
    dispatch(getAmmos({ organization: decoded.organization, district: decoded.district }));
  }, [dispatch, decoded.organization, decoded.district]);

  return (
    <div className="DefencePage">
      <div className="card-header">
        <h2>Organization: {decoded.organization}</h2>
        {decoded.district && <p>District: {decoded.district}</p>}
      </div>

      <div className="ammo-list">
        {ammos.map((ammo) => {
          return (
            <div key={Date.now()} className="ammo-item">
              {ammo.name} X {ammo.amount}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DefencePage;

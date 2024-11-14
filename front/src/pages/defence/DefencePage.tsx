import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAmmos, updateAmountAmmo } from "../../store/fetchers/ammo/ammoSlice";
import { jwtDecode } from "jwt-decode";
import { Ammo, AmmoDetails, x } from "../../types";
import "./DefencePage.css";
import socket from "../../socket";
import { updateAttackList } from "../../store/fetchers/attack/attackSlice";

const DefencePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  //משתנה שמקבל מערך עם כל האיומים שמשוגרים
  const attacks: x[] = useSelector((state: any) => state.attack.attacks);

  //מחלץ מהטוקן את שם הארגון ואזור הארגון(אם קיים) כדי לשלח בגוף הבקשה
  const token = localStorage.getItem("token");
  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  //מקבל את רשימת הטילים שיש לארגון הנוכחי
  const ammos: Ammo[] = useSelector((state: any) => state.ammo.ammos);

  //שולח בקשה דרך הסלייס לקבל את כל הטילים של הארגון הנוכחי ושלוח לה באדי של שם הארגון ואזור הארגון
  useEffect(() => {
    dispatch(getAmmos({ organization: "IDF", district: "West Bank" }));
    socket.on("updateMissile", (ammo) => {
      dispatch(updateAmountAmmo(ammo));
    });
    return () => {
      socket.off("updateMissile");
    };
  });

  useEffect(() => {
    socket.on("sendAttack", (attack) => {
      console.log("Attack received:", attack);
      console.log("list:", attacks);

      dispatch(updateAttackList(attack));
    });
    return () => {
      socket.off("sendAttack");
    };
  }, []);

  return (
    <div className="DefencePage">
      <div className="card-header">
        {/* מחזיר את שם הארגון מהטוקן */}
        <h2>Organization: {decoded.organization}</h2>
        {decoded.district && <p>District: {decoded.district}</p>}
      </div>

      {/* רץ על רשימת הטילים של הארגון ומדפיס אותם */}
      <div className="ammo-list">
        {ammos.map((ammo) => {
          return (
            <div key={ammo.name} className="ammo-item">
              {ammo.name} X {ammo.amount}
            </div>
          );
        })}
      </div>
      {/* {attacks.length > 0 && (
        <div className="attack-list">
          {attacks.map((attack) => {
            return (
              <div key={attack.name} className="attack-item">
                {attack.name} X {attack.speed}
              </div>
            );
          })}
        </div>
        
      )} */}
      <table>
        <tr>
          <th>Rocket</th>
          <th>Time To Hite</th>
          <th>Status</th>
        </tr>
        {attacks && attacks.length > 0 ? (
          attacks.map((attack, index) => (
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

export default DefencePage;

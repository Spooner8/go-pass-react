import { PasswortList } from "../components/passwortList";
import { useLocation } from "react-router-dom";
import { SafeProfile } from "../models/safeProfile";

export function MainPage() {
  const location = useLocation();
  const safeProfile = location.state as SafeProfile;

  return (
    <div className="container">
        <div className="row">
            <div className="col">
                <h4 className="mb-4">Tresor: {safeProfile.name}</h4>
                <PasswortList safeProfile={safeProfile} />
            </div>
        </div>
    </div>
  );
}
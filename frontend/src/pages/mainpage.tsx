import { PasswortList } from "../components/passwortList";
import { useLocation } from "react-router-dom";
import { SafeProfile } from "../models/safeProfile";

/**
 * @author Spooner8 and SyntaxWizardBB - 2024
 * 
 * @description
 * This is the main page of the application. It displays the passwords of the selected and unlocked safe profile.
 * 
 * @returns {JSX.Element} The main page of the application.
 */
export function MainPage(): JSX.Element {
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
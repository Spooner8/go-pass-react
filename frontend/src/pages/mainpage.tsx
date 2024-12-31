import { PasswortList } from "../components/passwortList";
import { useLocation, useNavigate } from "react-router-dom";
import { SafeProfile } from "../models/safeProfile";
import { useImmer } from "use-immer";
import { ChangeMasterPassword } from "../components/changeMasterpassword";
import { ReactNode, useEffect } from "react";

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
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useImmer(false);

  const settingsIcon: ReactNode = (
    <i className="bi bi-sliders settings-icon"></i>
  );

  const settingsCloseIcon: ReactNode = (
    <i className="bi bi-x-lg settings-icon"></i>
  );
  
  return (
    <div className="container">
        <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-4">Tresor: {safeProfile.name}</h4>
                <button className="settings" id="settings" title="Masterpasswort ändern" onClick={() => setShowSettings(!showSettings)}>
                  {showSettings ? settingsCloseIcon : settingsIcon}
                </button>
              </div>
              {showSettings ? <ChangeMasterPassword safeProfile={safeProfile} /> : <PasswortList safeProfile={safeProfile} />}
            </div>
        </div>
    </div>
  );
}
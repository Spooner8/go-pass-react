import { useEffect, useMemo } from "react";
import { SafeProfile } from "../models/safeProfile";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GetEnv, CreateProfile } from "../../wailsjs/go/main/App";

export function UnlockForm() {
  const [ safePath, setSafePath ] = useImmer<string>("");
  const [ password, setPassword ] = useImmer<string>("");
  const [ newPath, setNewPath ] = useImmer<string>("");
  const [ newSafeName, setNewSafeName ] = useImmer<string>("");
  const [ createNew, setCreateNew ] = useImmer<boolean>(false);
  const [ open, setOpen ] = useImmer<boolean>(false);
  const [ newMasterPassword, setNewMasterPassword ] = useImmer<string>("");
  const [ confirmNewMasterPassword, setConfirmNewMasterPassword ] = useImmer<string>("");
  const [ validateNewMasterPassword, setValidateNewMasterPassword ] = useImmer<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useImmer<string>("");
  
  const navigate = useNavigate();

  useEffect(() => {
    GetEnv('LAST_PATH').then(setSafePath);
    safePath ? console.log(safePath) : console.log("No safe path found");
  },[]);


  const handleUnlock = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO unlock safe
    navigate("/mainpage");
  }

  const handleCreateNewSafe = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO create new safe
    const newSafeProfile: SafeProfile = {
      id: "",
      name: newSafeName,
      storagPath: newPath,
      masterKey: newMasterPassword,
      passwords: [],
      createdAt: new Date()
    }
    try {
      await CreateProfile(newSafeProfile).then((response) => {
        response !== "created" && setErrorMessage(response);
        setCreateNew(false);
        setConfirmNewMasterPassword("");
        setNewMasterPassword("");
        setValidateNewMasterPassword(false);
        setOpen(false);
      });
    } catch (error: any) {
      setErrorMessage("Error creating safe");
    }
  }

  const chooseFolder = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO choose folder
    const directoryHandle = await (window as any).showDirectoryPicker();
    setNewPath(directoryHandle[0].name);
  }

  return (
    <>
      <div className="card">
          <div className="card-body">
            <h5 className="card-title">GoPass Tresor entsperren</h5>
            {<small className="card-text">{safePath}</small>}
            <input className="form-control mb-4"
                  id="password"
                  type="password"
                  placeholder="Masterpasswort"
                  aria-label="Masterpasswort"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!safePath}/>
            { safePath ? 
              <button className="btn btn-primary"
                      id="btn-unlock"
                      disabled={!password}
                      onClick={handleUnlock}>Entsperren
              </button>
              :
              <>
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <button className="btn btn-primary w-100 mb-4"
                            id="btn-new"
                            onClick={(e) => setCreateNew(true)}><i className="bi bi-plus-circle me-2"></i>Neuer Tresor</button>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <button className="btn btn-primary w-100" id="btn-open" type="button"><i className="bi bi-folder2-open me-2"></i>Tresor Öffnen</button>
                  </div>
                </div>
                { createNew &&
                  <div className="row">
                    <div className="col">
                      <input type="text" value={newSafeName} onChange={(e) => setNewSafeName(e.target.value)} className="form-control mb-4" placeholder="Tresorname" />
                      <div className="input-group mb-4">
                        <button className="btn btn-primary"
                                type="button" onClick={chooseFolder}
                                id="btn-chooseFolder">Ordner wählen</button>
                        <input type="text"
                                id="newPath"
                                aria-describedby="btn-chooseFolder"
                                aria-label="Speicherort"
                                className="form-control"
                                placeholder="Speicherort"
                                readOnly
                                value={newPath} />
                      </div>
                      <input type="password" id="newPassword" placeholder="Neuws Passwort" onChange={(e) => setNewMasterPassword(e.target.value)} className="form-control mb-4"/>
                      <input type="password" id="confirmNewPassword" placeholder="Neues Passwort bestätigen" onChange={(e) => setConfirmNewMasterPassword(e.target.value)} className="form-control mb-4"/>
                      { validateNewMasterPassword && <small className="text-danger">Passwörter stimmen nicht überein</small> }
                      <button className="btn btn-primary"
                              type="button"
                              onClick={handleCreateNewSafe}>
                        Anlegen
                      </button>
                    </div>
                  </div>
                }
                { open &&
                  <div className="row">
                    <input type="file" value={newPath} onChange={(e) => setSafePath(e.target.value)} className="form-control mb-4" placeholder="Tresorpfad" />
                    <button className="btn btn-primary" type="button">
                      Öffnen
                    </button>
                  </div>
                }
              </>
            }
          </div>
      </div> 
    </>
  );
}
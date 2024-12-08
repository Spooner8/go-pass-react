import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GetEnv } from "../../wailsjs/go/main/App";

export function UnlockForm() {
  const [ safePath, setSafePath ] = useImmer<string>("");
  const [ password, setPassword ] = useImmer<string>("");
  
  useEffect(() => {
    GetEnv('LAST_PATH').then(setSafePath);
    safePath ? console.log(safePath) : console.log("No safe path found");
  },[]);

  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch(event.currentTarget.id) {
      case "btn-submit":
        // TODO handle unlock safe
        navigate("/mainpage");
        break;
      case "btn-new":
        // TODO handle new safe
        break;
      case "btn-open":
        // TODO handle open safe
        break;
      default:
        break;
    }
  };

  return (
    <>
      <form className="card" onSubmit={handleSubmit}>
          <div className="card-body">
            <h5 className="card-title">GoPass Datenbank entsperren</h5>
            {<small className="card-text">Safe: {safePath}</small>}
            <input className="form-control mb-4"
                  id="password"
                  type="password"
                  placeholder="Masterpasswort"
                  aria-label="Masterpasswort"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!safePath}/>
            { safePath ? 
              <button className="btn btn-primary" id="btn-submit" disabled={!password}>Entsperren</button>
              :
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <button className="btn btn-primary w-100 mb-4" id="btn-new"><i className="bi bi-plus-circle me-2"></i>Neuer Speicher</button>
                </div>
                <div className="col-sm-12 col-md-6">
                  <button className="btn btn-primary w-100" id="btn-open"><i className="bi bi-folder2-open me-2"></i>Speicher Öffnen</button>
                </div>
              </div>
            }
          </div>
      </form> 
    </>
  );
}
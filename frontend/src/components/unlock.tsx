import { useMemo } from "react";
import { Link } from "react-router-dom";

export function Unlock() {
  const unlock = useMemo(() => {
    return async () => {
      
    };
  }, []);

  return (
    <>
        <h1>Unlock</h1>
        <input className="form-control" type="password" />
        <Link to="/passwords" onClick={unlock} className="btn btn-primary">Unlock</Link>
    </>
  );
}
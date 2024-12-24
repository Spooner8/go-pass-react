import logo from "../assets/images/GoPass.png";
import { UnlockForm } from "../components/unlockForm";

export function Unlock() {

  return (
    <div id="unlock" className="container d-flex justify-content-center align-items-center flex-column">
      <img id="unlock-logo"src={logo} alt="Logo" className="my-5"/>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <UnlockForm />
        </div>
    </div>
  );
}
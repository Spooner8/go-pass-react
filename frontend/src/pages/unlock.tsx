import logo from "../assets/images/GoPass.png";
import { UnlockForm } from "../components/unlockForm";

export function Unlock() {

  return (
    <div id="unlock" className="container">
      <img id="unlock-logo"src={logo} alt="Logo" className="mb-5"/>
      <div className="row justify-content-center mx-auto w-100">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <UnlockForm />
        </div>
      </div>
    </div>
  );
}
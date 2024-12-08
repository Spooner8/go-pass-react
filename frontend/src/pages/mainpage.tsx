import { PasswortList } from "../components/passwortList";

export function MainPage() {
  return (
    <div className="container">
        <div className="row">
            <div className="col">
                <h1>Passwörter</h1>
                <PasswortList />
            </div>
        </div>
    </div>
  );
}
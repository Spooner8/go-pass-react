import { Divider } from 'primereact/divider';

/**
 * @description
 * This component displays the password footer with the requirements for a password.
 * 
 * @param {string} password The password to check.
 * @returns {JSX.Element} The password footer.
 */
export function PasswortFooter(password: string): JSX.Element {
    const pw8Chars: Boolean = password.length >= 8 ? true : false;
    const pwUpper: Boolean = /[A-Z]/.test(password) ? true : false;
    const pwNumber: Boolean = /[0-9]/.test(password) ? true : false;
    const pwSpecial: Boolean = /[(){}\[\]\\?~<>+!@#$%^&*._\-\/]/.test(password) ? true : false;

    const pwSuccess = <i className="bi bi-check2-circle text-success"></i>;
    const pwFail = <i className="bi bi-x-circle text-danger"></i>;

    return (
        <>
            <Divider/>
            <p className="mt-2">Vorgaben</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
            <li style={{ listStyleType: 'none' }}>
                {pw8Chars ? pwSuccess : pwFail} 8 Zeichen
            </li>
            <li style={{ listStyleType: 'none' }}>
                {pwUpper ? pwSuccess : pwFail} Ein Grossbuchstabe
            </li>
            <li style={{ listStyleType: 'none' }}>
                {pwNumber ? pwSuccess : pwFail} Eine Zahl
            </li>
            <li style={{ listStyleType: 'none' }}>
                {pwSpecial ? pwSuccess : pwFail} Ein Sonderzeichen
            </li>
        </ul>
        </>
    )
}
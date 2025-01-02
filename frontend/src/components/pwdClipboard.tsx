import { useEffect, useRef, useState } from 'react';
import { AddToClipboard } from '../../wailsjs/go/main/App';

interface props {
    pwd: string;
    show: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * @author Spooner8 and SyntaxWizardBB - 2024
 * 
 * @description
 * Containes the password clipboard component that is used to copy the password to the clipboard and show a progress bar to indicate the time left to copy the password.
 * 
 * @param {props} props The properties of the component. It contains the password to copy and a function to hide the component.
 * @returns {JSX.Element} The password clipboard component.
 */
export function PwdClipboard(props: props): JSX.Element {

    const secondsToCopy = 15;
    const [timer, setTimer] = useState(100);
    const hasCopied = useRef(false);

    useEffect(() => {
        if (!hasCopied.current) {
            copyToClipboard();
            hasCopied.current = true;
        }
    }, []);
    
    const copyToClipboard = () => {
        AddToClipboard(props.pwd);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    AddToClipboard('');
                    setTimeout(() => props.show(false), 0);
                    return 0;
                }
                return prev - (100 / (secondsToCopy * 10));
            });
        }, 100);
    };

    return (
        <div className='hstack gap-3'>
            <small>Kopiert</small>
            <div className="progress w-100" role="progressbar" aria-label="Basic example" aria-valuenow={timer} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" style={{width: `${timer}%`}}></div>
            </div>
        </div>
    );
}
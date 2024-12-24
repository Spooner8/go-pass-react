import { useEffect, useRef, useState } from 'react';
import { AddToClipboard } from '../../wailsjs/go/main/App';

interface props {
    pwd: string;
    show: React.Dispatch<React.SetStateAction<boolean>>
}

export function PwdClipboard(props: props) {

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
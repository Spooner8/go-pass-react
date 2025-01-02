import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { SafeProfile } from '../models/safeProfile';
import { UpdateMasterPassword, VerifyPassword, UpdateProfile } from '../../wailsjs/go/main/App';
import { Password } from 'primereact/password';
import { PasswortFooter } from './pwFooter';

interface Props {
    safeProfile: SafeProfile;
}

/**
 * @description
 * This component allows the user to change the master password of a safe profile.
 * 
 * @param {SafeProfile} safeProfile The safe profile to change the master password of.
 * @returns {JSX.Element} The change master password component.
 */
export function ChangeMasterPassword( {safeProfile} : Props ): JSX.Element {

    const [profile, setProfile] = useState(safeProfile);
    const [oldPassword, setOldPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!verifyPassword) {
            setError('Altes Passwort ist falsch');
            setLoading(false);
            return;
        }
    
        try {
            const res = await UpdateMasterPassword(newPassword);
            if (res) {
                setProfile((prevProfile) => ({ ...prevProfile, masterpassword: res }));
            } else {
                setError('Fehler beim Ändern des Passworts');
            }
        } catch (error: any) {
            setError(error.message || 'Fehler beim Ändern des Passworts');
            setSuccess('');
        } finally {
            setLoading(false);
            setVerifyPassword(false);
        }
    };
    
    useEffect(() => {
        if (profile.masterpassword !== safeProfile.masterpassword) {
            UpdateProfile(profile);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setSuccess('Passwort erfolgreich geändert');
        }
    }, [profile]);

    useEffect(() => {
        const verify = async () => {
            setVerifyPassword(await VerifyPassword(profile.masterpassword, oldPassword));
        };
        verify();
    }, [oldPassword]);

    return (
        <>
            <div className="row change-password-form">
                <div className="col">
                    <h3>Masterpasswort ändern</h3>
                    <p>Ändern Sie das Masterpasswort für das aktuelle Profil.</p>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                    {loading && 
                        <div className="d-flex justify-content-center mb-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    <form onSubmit={handleSubmit}>
                    <div className='d-flex w-100'>
                        <Password id="oldPassword" className='password-field flex-grow-1' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} feedback={false} toggleMask />
                    </div>
                    <div className='d-flex w-100 mt-3'>
                        <Password id="newPassword" className='password-field flex-grow-1' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} footer={PasswortFooter(newPassword)} toggleMask/>                        
                    </div>
                    <div className='d-flex w-100 mt-3'>
                        <Password id="newPasswordRepeat" className='password-field flex-grow-1' value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} feedback={false} toggleMask />
                    </div>
                    {confirmNewPassword && newPassword !== confirmNewPassword && (
                        <div className='row'>
                            <small className='text-info col-sm-12'>
                                Passwörter stimmen nicht
                                überein
                            </small>
                        </div>
                    )}
                        <button type="submit" className="btn btn-primary mt-3" disabled={!oldPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}>Passwort ändern</button>
                    </form>
                </div>
            </div>
        </>
    );
}
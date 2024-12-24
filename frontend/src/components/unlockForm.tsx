import { useEffect } from 'react';
import { SafeProfile } from '../models/safeProfile';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import {
    CreateProfile,
    SelectDir,
    GetProfile,
    VerifyPassword,
} from '../../wailsjs/go/main/App';

export function UnlockForm() {
    const [safeProfile, setSafeProfile] = useImmer<SafeProfile>(
        {} as SafeProfile
    );

    const [safePath, setSafePath] = useImmer<string>('');
    const [password, setPassword] = useImmer<string>('');
    const [newSafePath, setNewSafePath] = useImmer<string>('');
    const [newSafeName, setNewSafeName] = useImmer<string>('');
    const [createNew, setCreateNew] = useImmer<boolean>(false);
    const [newMasterPassword, setNewMasterPassword] = useImmer<string>('');
    const [confirmNewMasterPassword, setConfirmNewMasterPassword] =
        useImmer<string>('');
    const [validateNewMasterPassword, setValidateNewMasterPassword] =
        useImmer<boolean>(false);
    const [errorMessage, setErrorMessage] = useImmer<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        safePath ? console.log(safePath) : console.log('No safe path found');
    }, []);

    const handleUnlock = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const response = await VerifyPassword(safeProfile.masterpassword, password);
        response ? navigate('/mainpage', { state: safeProfile }) : setErrorMessage('Wrong password');
    };

    useEffect(() => {
        if (newMasterPassword !== confirmNewMasterPassword) {
            setValidateNewMasterPassword(false);
        } else {
            setValidateNewMasterPassword(true);
        }
    }, [newMasterPassword, confirmNewMasterPassword]);

    const handleCreateNewSafe = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        const newSafeProfile: SafeProfile = {
            id: '',
            name: newSafeName,
            filepath: `${newSafePath}\\${newSafeName}.gopass`,
            masterpassword: newMasterPassword,
            passwords: [],
            createdAt: new Date(),
        };
        try {
            await CreateProfile(newSafeProfile).then((response) => {
                response !== 'created' && setErrorMessage(response);
                setCreateNew(false);
                setConfirmNewMasterPassword('');
                setNewMasterPassword('');
                setValidateNewMasterPassword(false);
            });
        } catch (error: any) {
            setErrorMessage('Error creating safe');
        }
    };

    const chooseFolder = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const filePath = await SelectDir();
        filePath && setNewSafePath(filePath);
    };

    const handleOpenSafe = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        setCreateNew(false);
        await GetProfile().then((response) => {
            setSafeProfile(response);
            setSafePath(response.filepath);
        });
    };

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    {!createNew && (
                        <>
                            <h5 className='card-title'>GoPass Tresor entsperren</h5>
                            <small className='card-text'>{safePath}</small>
                            <input
                                className='form-control mb-4'
                                id='password'
                                type='password'
                                placeholder='Masterpasswort'
                                aria-label='Masterpasswort'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={!safePath}
                            />
                        </>
                    )}
                    {safePath ? (
                        <div className='row'>
                            <div className='col-sm-12 col-md-6'>
                                <button
                                    className='btn btn-primary w-100'
                                    id='btn-unlock'
                                    disabled={!password}
                                    onClick={handleUnlock}
                                    >
                                    Entsperren
                                </button>
                            </div>
                            <div className='col-sm-12 col-md-6'>
                                <button
                                    className='btn btn-primary w-100'
                                    id='btn-open'
                                    type='button'
                                    onClick={handleOpenSafe}
                                    >
                                    <i className='bi bi-folder2-open me-2'></i>
                                    Tresor Öffnen
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='row'>
                                <div className='col-sm-12 col-md-6 mb-2'>
                                    <button
                                        className='btn btn-primary w-100'
                                        id='btn-new'
                                        onClick={() => {
                                            setCreateNew(!createNew);
                                        }}
                                    >
                                        <i className='bi bi-plus-circle me-2'></i>
                                        Neuer Tresor
                                    </button>
                                </div>
                                <div className='col-sm-12 col-md-6 mb-2'>
                                    <button
                                        className='btn btn-primary w-100'
                                        id='btn-open'
                                        type='button'
                                        onClick={handleOpenSafe}
                                        >
                                        <i className='bi bi-folder2-open me-2'></i>
                                        Tresor Öffnen
                                    </button>
                                </div>                                
                            </div>
                            {createNew && (
                                <div className='row mt-4'>
                                    <div className='col-sm-12'></div>
                                    <div className='col-sm-12'>
                                        <input
                                            type='text'
                                            value={newSafeName}
                                            onChange={(e) =>
                                                setNewSafeName(e.target.value)
                                            }
                                            className='form-control mb-4'
                                            placeholder='Tresorname'
                                        />
                                        <div className='input-group mb-4'>
                                            <button
                                                className='btn btn-primary'
                                                type='button'
                                                onClick={chooseFolder}
                                                id='btn-chooseFolder'
                                            >
                                                Ordner wählen
                                            </button>
                                            <input
                                                type='text'
                                                id='newPath'
                                                aria-describedby='btn-chooseFolder'
                                                aria-label='Speicherort'
                                                className='form-control'
                                                placeholder='Speicherort'
                                                readOnly
                                                value={newSafePath}
                                            />
                                        </div>
                                        <input
                                            type='password'
                                            id='newPassword'
                                            placeholder='Neuws Passwort'
                                            onChange={(e) =>
                                                setNewMasterPassword(
                                                    e.target.value
                                                )
                                            }
                                            className='form-control mb-4'
                                        />
                                        <input
                                            type='password'
                                            id='confirmNewPassword'
                                            placeholder='Neues Passwort bestätigen'
                                            onChange={(e) =>
                                                setConfirmNewMasterPassword(
                                                    e.target.value
                                                )
                                            }
                                            className='form-control'
                                        />
                                        {!validateNewMasterPassword && (
                                            <div className='row'>
                                                <small className='text-danger col-sm-12'>
                                                    Passwörter stimmen nicht
                                                    überein
                                                </small>
                                            </div>
                                        )}
                                        <button
                                            className='btn btn-primary mt-4 w-100'
                                            type='button'
                                            disabled={
                                                !newSafeName ||
                                                !newSafePath ||
                                                !newMasterPassword ||
                                                !confirmNewMasterPassword ||
                                                !validateNewMasterPassword
                                            }
                                            onClick={handleCreateNewSafe}
                                        >
                                            Anlegen
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {errorMessage && (
                        <div className='row'>
                            <small className='text-danger col-sm-12'>
                                {errorMessage}
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

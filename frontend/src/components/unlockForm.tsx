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
import * as REGEX from '../utils/regex';

const PASSWORD_REGEX: RegExp = REGEX.PASSWORD;
const SAFE_NAME_REGEX: RegExp = REGEX.SAFE_NAME;

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
    const [compareNewMasterPassword, setCompareNewMasterPassword] =
        useImmer<boolean>(false);
    const [errorMessage, setErrorMessage] = useImmer<string>('');
    const [validateNewMasterPassword, setValidateNewMasterPassword] = useImmer<boolean>(false);

    const [validateSafeName, setValidateSafeName] = useImmer<boolean>(false);

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
            setCompareNewMasterPassword(false);
        } else {
            setCompareNewMasterPassword(true);
        }
    }, [newMasterPassword, confirmNewMasterPassword]);

    useEffect(() => {
        if (PASSWORD_REGEX.test(newMasterPassword)) {
            setValidateNewMasterPassword(true);
        } else {
            setValidateNewMasterPassword(false);
        }
    },[newMasterPassword]);

    useEffect(() => {
        if (SAFE_NAME_REGEX.test(newSafeName)) {
            setValidateSafeName(true);
        } else {
            setValidateSafeName(false);
            console.log('Invalid safe name');
        }
    }, [newSafeName]);

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
                setCompareNewMasterPassword(false);
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
                                            className={`form-control ${!newSafeName || !validateSafeName ? 'is-invalid' : ''}`}
                                            placeholder='Tresorname'
                                        />
                                        <small className='text-info'>
                                            {!validateSafeName && '2-50 Zeichen | Erlaubt: a-z, A-Z, 0-9, Leerzeichen _ - .'}
                                        </small>
                                        <div className='input-group mt-3'>
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
                                                className={`form-control ${!newSafePath ? 'is-invalid' : ''}`}
                                                placeholder='Speicherort'
                                                readOnly
                                                value={newSafePath}
                                            />
                                        </div>
                                        <input
                                            type='password'
                                            id='newPassword'
                                            placeholder='Neues Passwort'
                                            onChange={(e) =>
                                                setNewMasterPassword(
                                                    e.target.value
                                                )
                                            }
                                            className={`form-control mt-3 ${!newMasterPassword || !validateNewMasterPassword ? 'is-invalid' : ''}`}
                                        />
                                        <small className='text-info mt-1'>
                                            {!validateNewMasterPassword && 'Min. 8 Zeichen und min. einen Großbuchstaben, eine Zahl und ein Sonderzeichen'}
                                        </small>
                                        <input
                                            type='password'
                                            id='confirmNewPassword'
                                            placeholder='Neues Passwort bestätigen'
                                            onChange={(e) =>
                                                setConfirmNewMasterPassword(
                                                    e.target.value
                                                )
                                            }
                                            className={`form-control mt-3 ${!confirmNewMasterPassword || !compareNewMasterPassword ? 'is-invalid' : ''}`}
                                        />
                                        {!compareNewMasterPassword && (
                                            <div className='row'>
                                                <small className='text-info col-sm-12'>
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
                                                !compareNewMasterPassword ||
                                                !validateSafeName ||
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

import React, { useState, useEffect, ReactNode } from 'react';
import { PasswordEntry } from '../models/passwordEntry';
import { SafeProfile } from '../models/safeProfile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { UpdateProfile, GetProfileFromPath, GenerateNewPassword } from '../../wailsjs/go/main/App';

interface Props {
    safeProfile: SafeProfile;
}

export function PasswortList({ safeProfile }: Props) {
    const [profile, setProfile] = useState<SafeProfile>(safeProfile);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [selectedPassword, setSelectedPassword] =
        useState<PasswordEntry | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        setShowPassword(false);
        setSelectedPassword(prev => {
            return prev ? profile.passwords.find(p => p.id === prev.id) || null : null
        });
    }, [editing]);

    const handleAddPassword = () => {
        setErrorMessage('');
        if (editing && !selectedPassword?.id) return;
        profile.passwords.push({
            id: '',
            title: '',
            url: '',
            username: '',
            password: '',
            notes: '',
            createdAt: new Date(),
        });

        setSelectedPassword(profile.passwords[profile.passwords.length - 1]);
        setEditing(true);
    }

    const copyToClipboardMessage = (text: string) => {
        setErrorMessage('');
        navigator.clipboard.writeText(text).then(() => {
            setNotificationVisible(true);
            setTimeout(() => {
                setNotificationVisible(false);
            }, 2000);
        }).catch(err => {
            setErrorMessage(`Fehler beim Kopieren: ${err}`);
        });
    };

    const updateSafeProfile = async () => {
        setErrorMessage('');
        const updatedPasswords = profile.passwords.map((p) =>
            p.id === selectedPassword!.id ? { ...selectedPassword, updatedAt: new Date() } as PasswordEntry : p
        );

        const updatedProfile = { ...profile, passwords: updatedPasswords };
        setProfile(updatedProfile);

        await UpdateProfile(updatedProfile).then(async () => {
            await GetProfileFromPath(updatedProfile.filepath).then((response) => {
                setProfile(response);
                setEditing(false);
                setSelectedPassword(null);
            });
        });
    };


    const dateBodyTemplate = (rowData: PasswordEntry) => {
        const date = rowData.updatedAt && new Date(rowData.updatedAt || '');
        return date ? date?.toLocaleDateString() : '';
    }

    const editBtn: ReactNode = <i className="bi bi-pencil-square"></i>;
    const abortBtn: ReactNode = <i className="bi bi-x-lg"></i>;

    return (
        <>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <div className='row mb-2'>
                <div className='col-md-6'>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='bi bi-search'></i>
                        </span>
                        <InputText
                            className='form-control'
                            type='search'
                            value={globalFilter || ''}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setGlobalFilter(e.target.value)
                            }
                            placeholder='Titel, URL, Benutzername'
                        />
                    </div>
                </div>
                <div className='col-md-1'>
                    <button className='btn btn-primary' onClick={handleAddPassword} title='Neues Passwort hinzufügen'>
                        <i className="bi bi-plus-circle"></i>
                    </button>
                </div>
                <div className='col-md-5'>
                    <div className='col-sm-12 mt-2 d-flex justify-content-end'>
                        <small>Anzahl Passwörter: {profile.passwords.length}</small>
                    </div>
                </div>
            </div>
            <DataTable
                value={profile.passwords}
                dataKey={'id'}
                selectionMode={'single'}
                selection={selectedPassword}
                onSelectionChange={(e) =>
                    setSelectedPassword(e.value as PasswordEntry)
                }
                rows={3}
                scrollable
                scrollHeight='300px'
                globalFilter={globalFilter}
                emptyMessage='Keine Passwörter gefunden'
                resizableColumns
                showGridlines
            >
                <Column
                    className='p-1 ps-2'
                    field='title'
                    header='Title'
                    sortable
                />
                <Column field='url' header='URL' sortable />
                <Column field='username' header='Benutzername' sortable />
                <Column field='notes' header='Notes' sortable />
                <Column 
                    field='updatedAt' 
                    header='Bearbeitet' 
                    sortable 
                    body={dateBodyTemplate}
                />
            </DataTable>

            <div className='row mt-4'>
                <div className='col-sm-12'>
                    <div className='card'>
                        <div className='card-header d-flex justify-content-end'>
                        {editing && (
                                <button
                                    className='btn btn-success me-2 save-entry'
                                    title='Speichern'
                                    onClick={updateSafeProfile}
                                >
                                    <i className="bi bi-floppy"></i>
                                </button>
                            )}
                            <button
                                className='btn btn-primary'
                                title={editing ? 'Abbrechen' : 'Bearbeiten'}
                                onClick={() => {
                                    !selectedPassword?.id && safeProfile.passwords.pop();
                                    setEditing(!editing)
                                }}
                                disabled={!selectedPassword}
                            >
                                {editing ? abortBtn : editBtn}
                            </button>
                        </div>

                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-sm-12 col-md-6'>
                                    <div className='hstack gap-3 mb-2'>
                                        <label
                                            htmlFor='title'
                                            className='col-sm-4'
                                        >
                                            Titel
                                        </label>
                                        <input
                                            type='text'
                                            className={`form-control ${
                                                !editing ? 'editDetail' : ''
                                            }`}
                                            id='title'
                                            value={selectedPassword?.title || ''}
                                            onChange={(e) => setSelectedPassword({
                                                ...selectedPassword,
                                                title: e.target.value
                                            } as PasswordEntry)}
                                            readOnly={!editing}
                                        />
                                    </div>
                                    <div className='hstack gap-3 mb-2'>
                                        <label
                                            htmlFor='username'
                                            className='col-sm-4'
                                        >
                                            Benutzername
                                        </label>
                                        <input
                                            type='text'
                                            className={`form-control ${
                                                !editing ? 'editDetail' : ''
                                            }`}
                                            id='username'
                                            value={selectedPassword?.username || ''}
                                            onChange={(e) => setSelectedPassword({
                                                ...selectedPassword,
                                                username: e.target.value
                                            } as PasswordEntry)}
                                            readOnly={!editing}
                                            required
                                        />
                                    </div>
                                    <div className='hstack gap-3 mb-2'>
                                        <label
                                            htmlFor='url'
                                            className='col-sm-4'
                                        >
                                            URL
                                        </label>
                                        <input
                                            type='text'
                                            className={`form-control ${
                                                !editing ? 'editDetail' : ''
                                            }`}
                                            id='url'
                                            value={selectedPassword?.url || ''}
                                            onChange={(e) => setSelectedPassword({
                                                ...selectedPassword,
                                                url: e.target.value
                                            } as PasswordEntry)}
                                            readOnly={!editing}
                                        />
                                    </div>
                                    {/* Benachrichtigung anzeigen */}
                                    {notificationVisible && (
                                        <div className="notification-container">
                                            <div className="notification">
                                                Passwort kopiert!
                                            </div>
                                        </div>
                                    )}
                                    <div className='hstack gap-3'>
                                        <label
                                            htmlFor='password'
                                            className='col-sm-4'
                                        >
                                            Passwort
                                        </label>
                                        <div className='input-group'>
                                            <input
                                                type={`${
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }`}
                                                className={`form-control ${
                                                    !editing ? 'editDetail' : ''
                                                }`}
                                                id='password'
                                                value={selectedPassword?.password || ''}
                                                onChange={(e) => setSelectedPassword({
                                                    ...selectedPassword,
                                                    password: e.target.value
                                                } as PasswordEntry)}
                                                readOnly={!editing}
                                                required
                                            />
                                            <span className='input-group-text password-toggle'>
                                                <i
                                                    className={`bi bi-dice-3`}
                                                    onClick={async () => {
                                                        if (editing && selectedPassword) {
                                                            setSelectedPassword({
                                                                ...selectedPassword,
                                                                password: await GenerateNewPassword() || selectedPassword?.password || ''
                                                            } as PasswordEntry);
                                                        }
                                                    }}
                                                ></i>
                                            </span>
                                            <span className='input-group-text password-toggle'>
                                                <i
                                                    className={`bi bi-clipboard`}
                                                    onClick={() => { selectedPassword && copyToClipboardMessage(selectedPassword.password); }}
                                                ></i>
                                            </span>
                                            <span className='input-group-text password-toggle'>
                                                <i
                                                    className={`bi bi-eye${
                                                        showPassword
                                                            ? ''
                                                            : '-slash'
                                                    }`}
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-12 col-md-6 d-flex flex-column'>
                                    <label htmlFor='notes' className='col-sm-4'>
                                        Notizen
                                    </label>
                                    <textarea
                                        className={`form-control ${
                                            !editing ? 'editDetail' : ''
                                        } flex-grow-1`}
                                        id='notes'
                                        value={selectedPassword?.notes || ''}
                                        onChange={(e) => setSelectedPassword({
                                            ...selectedPassword,
                                            notes: e.target.value
                                        } as PasswordEntry)}
                                        readOnly={!editing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

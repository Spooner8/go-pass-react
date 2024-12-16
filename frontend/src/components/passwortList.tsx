import React, { useState, useEffect } from 'react';
import { PasswordEntry, mockPasswords } from '../models/passwordEntry';
import { SafeProfile } from '../models/safeProfile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

interface Props {
    safeProfile: SafeProfile;
}

export function PasswortList({ safeProfile }: Props) {
    const [passwords, setPasswords] = useState<PasswordEntry[]>(mockPasswords);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [selectedPassword, setSelectedPassword] =
        useState<PasswordEntry | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [editTitle, setEditTitle] = useState<string>('');
    const [editUsername, setEditUsername] = useState<string>('');
    const [editUrl, setEditUrl] = useState<string>('');
    const [editPassword, setEditPassword] = useState<string>('');
    const [editNotes, setEditNotes] = useState<string>('');

    useEffect(() => {
        if (selectedPassword) {
            setEditTitle(selectedPassword?.title || '');
            setEditUsername(selectedPassword?.username || '');
            setEditUrl(selectedPassword?.url || '');
            setEditPassword(selectedPassword?.password || '');
            setEditNotes(selectedPassword?.notes || '');
        }
        setEditing(false);
        setShowPassword(false);
    }, [selectedPassword]);

    const handleEdit = () => {
        setEditing(true);
    };

    return (
        <>
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
                <div className='col-md-6'>
                    <div className='col-sm-12 mt-2 d-flex justify-content-end'>
                        <small>Anzahl Passwörter: {passwords.length}</small>
                    </div>
                </div>
            </div>
            <DataTable
                className=''
                value={passwords}
                dataKey={'id'}
                selectionMode={'single'}
                selection={selectedPassword}
                onSelectionChange={(e) =>
                    setSelectedPassword(e.value as PasswordEntry)
                }
                rows={10}
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
            </DataTable>

            <div className='row mt-4'>
                <div className='col-sm-12'>
                    <div className='card'>
                        <div className='card-header d-flex justify-content-end'>
                            <button
                                className='btn btn-primary'
                                onClick={() => handleEdit()}
                            >
                                Bearbeiten
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
                                            value={
                                                editing
                                                    ? editTitle
                                                    : selectedPassword?.title ||
                                                      ''
                                            }
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
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
                                            value={
                                                editing
                                                    ? editUsername
                                                    : selectedPassword?.username ||
                                                      ''
                                            }
                                            onChange={(e) =>
                                                setEditUsername(e.target.value)
                                            }
                                            readOnly={!editing}
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
                                            value={
                                                editing
                                                    ? editUrl
                                                    : selectedPassword?.url ||
                                                      ''
                                            }
                                            onChange={(e) =>
                                                setEditUrl(e.target.value)
                                            }
                                            readOnly={!editing}
                                        />
                                    </div>
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
                                                value={
                                                    editing
                                                        ? editPassword
                                                        : selectedPassword?.password ||
                                                          ''
                                                }
                                                onChange={(e) =>
                                                    setEditPassword(
                                                        e.target.value
                                                    )
                                                }
                                                readOnly={!editing}
                                            />
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
                                        value={
                                            editing
                                                ? editNotes
                                                : selectedPassword?.notes || ''
                                        }
                                        onChange={(e) =>
                                            setEditNotes(e.target.value)
                                        }
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

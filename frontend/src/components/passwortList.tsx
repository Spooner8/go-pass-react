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

    const footer = (
        <div className='col-sm-12 mt-2'>
            Anzahl Passwörter: {passwords.length}
        </div>
    );

    return (
        <>
            <InputText
                className='form-control mb-2'
                type='search'
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGlobalFilter(e.target.value)
                }
                placeholder='Titel, URL, Benutzername'
            />

            <DataTable
                className='table table-dark'
                value={passwords}
                dataKey={'id'}
                selectionMode={'single'}
                selection={selectedPassword}
                onSelectionChange={(e) =>
                    setSelectedPassword(e.value as PasswordEntry)
                }
                rows={10}
                scrollable
                scrollHeight='250px'
                globalFilter={globalFilter}
                emptyMessage='Keine Passwörter gefunden'
                resizableColumns
                showGridlines
                footer={footer}
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
                        <div className='card-header d-flex justify-content-between'>
                            <h5>{selectedPassword?.title}</h5>
                            {selectedPassword && (
                                <button className='btn btn-primary'>
                                    Bearbeiten
                                </button>
                            )}
                        </div>
                        <div className='card-body'>
                            <p className='card-text'>{selectedPassword?.url}</p>
                            <p className='card-text'>
                                {selectedPassword?.username}
                            </p>
                            <p className='card-text'>
                                {selectedPassword?.notes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

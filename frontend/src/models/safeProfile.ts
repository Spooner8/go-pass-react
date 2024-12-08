import { PasswordEntry } from './passwordEntry';

export interface SafeProfile {
    id: string;
    name: string;
    storagPath: string;
    masterKey: string;
    passwords: PasswordEntry[];
    createdAt: Date;
}
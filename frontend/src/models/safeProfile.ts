import { PasswordEntry } from './passwordEntry';

export interface SafeProfile {
    name: string;
    storagPath: string;
    masterKey: string;
    passwords: PasswordEntry[];
    createdAt: Date;
}
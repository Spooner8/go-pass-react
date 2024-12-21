import { PasswordEntry } from './passwordEntry';

export interface SafeProfile {
    id: string;
    name: string;
    filepath: string;
    masterpassword: string;
    passwords: PasswordEntry[];
    createdAt: Date;
    updatedAt?: Date;
}

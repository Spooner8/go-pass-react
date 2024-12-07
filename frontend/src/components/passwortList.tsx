import { useState } from "react"

interface PasswordEntry {
    // Define the properties of PasswordEntry here

}

export function PasswortList() {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([])

    return (
        <div>
            <h1>Passwords</h1>
        </div>
    )
}
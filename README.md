# README

## About

GoPass is a password manager that allows you to store and retrieve passwords securely. It uses AES encryption to encrypt the passwords and stores them in a json-file. The file is encrypted using a master password that you provide. The master password is stored as e hash-value in a settings file. If you forget it, you will not be able to decrypt the file and retrieve your passwords.

This is the official Wails React-TS template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

### Environment variables

Add the .env file to the root directory of the project and add the following environment variables:

```bash
  SECRET_KEY=5l5RKuJpfZYDK9WyMtuYNMEOyREbAnCK # Don't use this key for productive builds!
```

The Secret-Key is a 32-byte key for the AES encryption.\
You can generate a new key by running te following code in a separate project:

```golang
package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
)

func main() {
	key := make([]byte, 16)
	_, err := rand.Read(key)
	if err != nil {
		log.Fatalf("Error while generating the key: %v", err)
	}

	fmt.Println("Your new Key is:", hex.EncodeToString(key))
}
```

Or visit [this website](https://acte.ltd/utils/randomkeygen) to generate a random key.
Copy the 'Encryption key 256'

### Requirements / Installation

**Install wails**
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```
**Install go-bindata for loading enviroment variables into the build**
```bash
go install github.com/go-bindata/go-bindata/v3/...@latest
```
**Add GOPATH/bin to system path's if not exists**
```bash
$env:Path += ";$(go env GOPATH)\bin"
```
**Generate the env.go file**
```bash
go-bindata -o env.go .env
```


## Live Development

To run in live development mode, run

```bash
wails dev
```

in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use

```bash
wails build
```

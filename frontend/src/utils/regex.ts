const SAFE_NAME = /^[a-zA-Z0-9\s_\-\.]{2,50}$/;
const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[+!@#\$%\^&\*\{\};:'",.<>?\/\\|`~])(?=.{8,40})/;

export { SAFE_NAME, PASSWORD };
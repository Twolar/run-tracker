class User {
    id;
    email;
    username;
    hashedPassword;
    salt;

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.hashedPassword = password;
    }

    SetSalt(salt) {
        this.salt = salt
    }
}

module.exports = User;
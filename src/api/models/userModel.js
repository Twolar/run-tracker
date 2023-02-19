class User {
    id;
    email;
    username;
    password;

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

module.exports = User;
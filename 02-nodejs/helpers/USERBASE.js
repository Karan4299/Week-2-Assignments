const _ = require('lodash');
const { v4: uuid } = require("uuid");

class USERS {
    #USERSDATABASE = [];

    #checkUserExists(username) {
        try {
            const containsUser = _.some(this.#USERSDATABASE, (obj) => obj.username === username);
            if (!containsUser) return false;
            return true
        } catch (err) {
            throw err;
        }
    }

    #addUniqueId(userData) {
        try {
            const uid = uuid();
            return {
                uid,
                ...userData
            }
        } catch (err) {
            throw new Error("Something went wrong while adding unique id");
        }
    }

    #addToUserBase(userData) {
        try {
            this.#USERSDATABASE = [...this.#USERSDATABASE, this.#addUniqueId(userData)];
        } catch (err) {
            throw new Error("Something went wrong while adding data to USER base");
        }
    }

    #checkUserDataCredibility(userData) {
        try {
            if ([undefined, null].includes(userData)) {
                throw new Error("Please send correct user data")
            }
        } catch (err) {
            throw err;
        }
    }

    #checkIfPasswordIsCorrectForUserName(username, password) {
        try {

            const userExists = this.#checkUserExists(username);
            
            if (!userExists) {
                throw new Error("Invalid Username")
            }

            const user = _.find(this.#USERSDATABASE, (obj) => obj.username === username && obj.password === password);
            
            if (!user) {
                throw new Error("Invalid Credentials")
            }

            return user;
        } catch (err) {
            throw (err);
        }
    }

    #fetchUserDataFromHeaders(header) {
        try {
            if (!header || !header.username || !header.password ) {
                throw new Error("Invalid credentials");
            } 

            return [header.username , header.password]
        } catch (err) {
            throw err;
        }
    }

    addUser(userData) {
        try {
            this.#checkUserDataCredibility(userData);
            const userExists = this.#checkUserExists(userData.username);
            if (userExists) throw new Error("User already exists")
            this.#addToUserBase(userData);
            return 200;
        } catch (err) {
            throw err;
        }
    }

    login(userData) {
        try {
            this.#checkUserDataCredibility(userData);

            const {username, password} = userData;
            const user = this.#checkIfPasswordIsCorrectForUserName(username, password);
            return (user);
        } catch (err) {
            throw err;
        }
    }

    #loginWithUserIDPassword(username, password) {
        try {
            return this.login({username, password})
        } catch (err) {
            throw err;
        }
    }

    getUsers(request) {
        try {
            const [username, password] = this.#fetchUserDataFromHeaders(request.headers);
            this.#checkUserDataCredibility(username);

            const user = this.#loginWithUserIDPassword(username, password);

            if (user) {
                return {
                    users: this.#USERSDATABASE
                } 
            }
            
        } catch (e) {
            throw new Error("401 Unauthorized")
        }
    }
}

module.exports = USERS
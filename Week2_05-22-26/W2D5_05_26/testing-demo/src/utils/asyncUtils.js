function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "Kamal",
                role: "student"
            });
        }, 1000);
    });
}




function getUserById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 1) {
                resolve({
                    id: 1,
                    name: "Kamal",
                    role: "student"
                });
            } else {
                reject(new Error("User not found"));
            }
        }, 500);
    });
}





module.exports = {
    getUser,
    getUserById
};
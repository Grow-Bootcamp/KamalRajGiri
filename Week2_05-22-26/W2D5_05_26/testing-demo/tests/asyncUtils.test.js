const { getUser, getUserById } = require("../src/utils/asyncUtils");

describe("Async Utils", () => {

    test("getUser returns user data", async () => {
        const user = await getUser();

        expect(user).toEqual({
            name: "Kamal",
            role: "student"
        });
    });

    test("getUser returns user data using Promise", () => {
        return getUser().then((user) => {
            expect(user).toEqual({
                name: "Kamal",
                role: "student"
            });
        });
    });

    test("getUserById returns user for valid ID", async () => {
        const user = await getUserById(1);

        expect(user).toEqual({
            id: 1,
            name: "Kamal",
            role: "student"
        });
    });

    test("getUserById rejects for invalid ID", async () => {
        await expect(getUserById(999))
            .rejects
            .toThrow("User not found");
    });

});
export const authConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.token) {
        throw new Error("Admin token missing. Please login again.");
    }

    return {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
        },
    };
};
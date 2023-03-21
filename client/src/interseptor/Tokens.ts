
export const checkIfLoggedIn = async () => {
    // const token = localStorage.getItem("JAT")
    // if (!token)
    //     return null;
    // return token
}
export const isTokenExpired = (expiry: number) => {
    return (expiry - Date.now() / 1000) < 0;
}
export const refreshToken = async () => {
    try {
        let resul = await fetch("http://localhost:8000/refresh", {
            credentials: "include",
            keepalive: true,
            method: "GET",
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Content-Type": "application/json",
                "Host": "localhost:8000"
            }
        })
        let data = await resul.json()
        localStorage.setItem("JAT", data.token)
        // console.log(data);

    } catch (error) {
        console.error(error);

    }

    // localStorage.setItem("JAT", body.token)
}
export const checkIfLoggedIn = async () => {
    // const token = localStorage.getItem("JAT")
    // if (!token)
    //     return null;
    // return token
}
export const isTokenExpired = (expiry: number) => {
    return (expiry - Date.now() / 1000) < 0;
}
let AccessToken = "";

export const setAccessToken = (data:string)=>{
 AccessToken = data;
}

export const getAccessToken = ()=>{
    return AccessToken
}

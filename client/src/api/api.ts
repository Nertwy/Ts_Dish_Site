import { Comment, Dish } from "../../../interfaces/Ingridient";
import axios from "axios";
import { getAccessToken } from "../AccessToken";
import { User, UserTokenData } from "../../../interfaces/user";
import { isTokenExpired } from "../interseptor/Tokens";
import jwtDecode from "jwt-decode";

// export const fetchCard = async (id: number): Promise<Dish> => {
//     let responce = await fetch(`http://localhost:8000/data?id=${id}`);
//     let data: Dish = await responce.json();
//     let cardInfo: Dish = {
//         id: data.id,
//         name: data.name,
//         cuisine: data.cuisine,
//         url: data.url,
//         ingredients: data.ingredients,
//         slug: data.slug,
//         recipes: data.recipes,
//         // transport: prop.func,
//     };
//     // localStorage.setItem("food", JSON.stringify(cardInfo));
//     return cardInfo;
// };

export const apiFetchCard = async (id: number): Promise<Dish> => {
  let response = await axios.get(`http://localhost:8000/data?id=${id}`);
  let data: Dish = response.data;
  let cardInfo: Dish = {
    id: data.id,
    name: data.name,
    cuisine: data.cuisine,
    url: data.url,
    ingredients: data.ingredients,
    slug: data.slug,
    recipes: data.recipes,
    likes: data.likes,
  };
  return cardInfo;
};

export const apiLogin = async (title: User) => {
  const token = getAccessToken();
  const result = await axios({
    method: "post",
    url: "http://localhost:8000/login",
    data: JSON.stringify(title),
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `bearer ${token}` : "",
      Accept: "application/json",
    },
  });
  return result;
};
export const apiRefreshToken = async () => {
  try {
    let resul = await fetch("http://localhost:8000/refresh", {
      credentials: "include",
      keepalive: true,
      method: "GET",
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
        Host: "localhost:8000",
      },
    });
    let data = await resul.json();
    localStorage.setItem("JAT", data.token);
    // console.log(data);
  } catch (error) {
    console.error(error);
  }

  // localStorage.setItem("JAT", body.token)
};
export const apiLike = async (id: number) => {
  const token = localStorage.getItem("JAT");
  // If 0 token provided
  if (!token) {
    //handle if no Access token provided so basicly show message that you should register
    return;
  }
  const decode: any = jwtDecode(token);
  if (isTokenExpired(decode.exp!)) {
    await apiRefreshToken();
    await apiLike(id);
    return;
  }
  const resul = await fetch("http://localhost:8000/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ dish_id: id, user_id: decode.id }),
  });
  //if there is token but expired
  if (resul.status !== 200) {
    await apiRefreshToken();
    await apiLike(id);
  }
};
export const apiGetUserLike = async () => {
  const resul = await axios({
    withCredentials: true,
    method: "GET",
    url: "http://localhost:8000/get-user-dish",
  });
  return resul;
};
export const apiPostComment = async (comment: Comment) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/post-comment",
      comment,
      { withCredentials: true }
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

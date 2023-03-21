import jwtDecode, { JwtPayload } from "jwt-decode";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { apiLike } from "../../api/api";
import { modifyDishLike } from "../../app/CardListSlice";
import { useAppSelector } from "../../app/store";
import { isTokenExpired } from "../../interseptor/Tokens";

export interface UserTokenData extends JwtPayload {
  name: string,
  role: string,
  email: string,
  id: number
}
interface Like {
  id: number,
  isLiked: boolean | undefined
  numberOfLikes: number
}
const HeartButton: FC<Like> = ({ id, isLiked, numberOfLikes }) => {
  const [likes, setLikes] = useState(numberOfLikes)
  const notify = () => toast("Login required!");
  const userLogged = useAppSelector((state) => state.user.logged)
  const dispatch = useDispatch()
  const handleLike = async () => {
    if (!userLogged) {
      notify()
      //handle not logged user with TOAST 
      return
    }
    try {
      if (isLiked) {
        setLikes(likes - 1)
      } else {
        setLikes(likes + 1)
      }
      await apiLike(id)
      dispatch(modifyDishLike(id))
    } catch (error) {
      console.error(error);
    }
    return
  }
  return (
    <div>

      <button className="right-3 bottom-0" onClick={handleLike} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-auto fill-current ${isLiked ? "text-red-400" : "text-gray-400"
            }`}
          viewBox="0 0 512 512"
        >
          <path
            d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"
            style={{ outline: isLiked ? "none" : "1px solid gray" }} // add outline when not liked
          />
        </svg>
        {likes}
      </button>

    </div>
  );
};

export default HeartButton;

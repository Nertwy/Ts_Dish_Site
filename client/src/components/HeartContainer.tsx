import { FC } from "react";

interface Props {
    isLiked: boolean;
    handleClick: () => void;
    className?: string;
  }
  
  const HeartButton: FC<Props> = ({ isLiked, handleClick, className }) => {
    return (
      <button className="absolute right-3 bottom-0" onClick={handleClick} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-auto fill-current ${
            isLiked ? "text-red-400" : "text-gray-400"
          }`}
          viewBox="0 0 512 512"
        >
          <path
            d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"
            style={{ outline: isLiked ? "none" : "1px solid gray" }} // add outline when not liked
          />
        </svg>
      </button>
    );
  };
  
  export default HeartButton;
  
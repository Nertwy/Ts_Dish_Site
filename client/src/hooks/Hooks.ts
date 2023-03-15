import React, { useState, useEffect } from "react";
const useInfiniteScroll = (callback: any) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
      console.log("Calling back");
    });
  }, [isFetching]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setIsFetching(true);
  }
  return [isFetching, setIsFetching] as const;
};
export const useInput = (inputVal: string) => {
  const [value, setValue] = useState(inputVal);
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    let a = e.currentTarget.value;
    setValue(a);
  };
  return {
    value,
    onChange: handleChange
  }
};
export default useInfiniteScroll;

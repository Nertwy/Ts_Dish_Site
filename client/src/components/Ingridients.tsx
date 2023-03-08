import { FC, useEffect } from "react";
import { Dish } from "../../../interfaces/Ingridient";
import Card from "./Card";
//nn in eda ru react props
const Ingridients: FC<Dish> = (props: Dish) => {
  useEffect(() => {
    // console.log(props);
  }, []);
  return (
    <div className='w-24 h-2/4'>
      <Card {...props}></Card>
    </div>
  );
};
export default Ingridients;

import { FC, useEffect } from "react";
import { FoodAll } from "../../../interfaces/FoodsAll";
import Card from "./Card";
import Ingridiences from "./IngridienceFile.json";
//nn in eda ru react props
const Ingridients: FC<FoodAll> = (props: FoodAll) => {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <div className='w-24 h-2/4'>
      <Card {...props}></Card>
    </div>
  );
};
export default Ingridients;

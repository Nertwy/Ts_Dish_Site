interface Measures {
    id: number,
    name: string,

}
interface Ingredient{
    id?:number,
    name:string
}
export interface Ingredients {
    id: number,
    amount: number,
    name: string
    measureUnit: Measures
    ingredient:Ingredient
}

export interface FoodAll {
    id: number,
    name?: string,
    cuisine: string,
    url: string
    Ingridiences: Ingredients[]
    slug:string
    transport?:Function
}
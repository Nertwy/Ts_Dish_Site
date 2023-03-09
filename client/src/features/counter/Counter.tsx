import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, reset, incrementByAmount } from "./CounterSlice";
const Counter: FC = () => {
    const [incrementAmount, setIncrementAmount] = useState(0)
    const addValue = Number(incrementAmount) || 0
    const count = useSelector((state: any) => state.counter.count)
    const dispatch = useDispatch()
    const resetAll = () => {
        setIncrementAmount(0)
        dispatch(reset())
    }
    return (
        <section>
            <p>{count}</p>
            <div>
                <button onClick={() => dispatch(increment())}>+</button>
                <button onClick={() => dispatch(decrement())}>-</button>
            </div>
            <input type={"text"}
                value={incrementAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncrementAmount(Number(e.target.value))} />
            <div>
                <button onClick={() => dispatch(incrementByAmount(addValue))}>Add Amount</button>

                <button onClick={resetAll}>Reset</button>
            </div>
        </section >
    )
}
export default Counter
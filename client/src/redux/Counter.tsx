import { useAppSelector, useAppDispatch } from "./hooks";
import { decrement, increment, incrementByAmount } from "./counterSlice";

export default function Counter() {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <div>{count}</div>
            <button onClick={() => dispatch(decrement())}>Decrement</button>

            <button onClick={() => dispatch(incrementByAmount(2))}>
                inc by am#
            </button>
            <button onClick={() => dispatch(incrementByAmount(-42))}>
                inc by am#
            </button>
        </div>
    );
}

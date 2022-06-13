import Counter from "./redux/Counter";
import { useAppDispatch } from "./redux/hooks";

export default function Bruh() {
    const dispatch = useAppDispatch();

    return (
        <div>
            <Counter />
        </div>
    );
}

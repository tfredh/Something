import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function StartTopEveryRouteChange(): null {
    /**
     * Scroll to the top every time a route change is detected.
     */

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

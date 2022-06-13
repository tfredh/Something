// server --------------------------------------------------
export const PORT = process.env["REACT_APP_PORT"] || "8080";

// client --------------------------------------------------

// transitions ---------------
export const transitionInitiator = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // console.log("intersecting");

                entry.target.classList.add("start-transition");
                transitionInitiator.unobserve(entry.target);
            } else {
                // console.log("not intersecting");
            }
        });
    },
    {
        threshold: 0.5,
    }
);

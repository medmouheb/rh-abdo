"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the component has mounted on the client.
 * Useful for avoiding hydration mismatches when rendering client-side only content.
 */
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}

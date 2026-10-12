// FAMZI FILE GUIDE: Hook that asks the cart provider to refresh menu data when mounted.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function useCartMenuSync() {
  const { refreshCartFromMenu } = useCart();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);

  const checkMenu = useCallback(async () => {
    setIsChecking(true);
    setError("");
    try {
      await refreshCartFromMenu();
    } catch (checkError) {
      if (mountedRef.current) {
        setError(
          checkError instanceof Error
            ? checkError.message
            : "Failed to check the current menu.",
        );
      }
    } finally {
      if (mountedRef.current) setIsChecking(false);
    }
  }, [refreshCartFromMenu]);

  useEffect(() => {
    mountedRef.current = true;
    void checkMenu();
    return () => {
      mountedRef.current = false;
    };
  }, [checkMenu]);

  return { isChecking, error, checkMenu };
}

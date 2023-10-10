import { useEffect } from "react";

export function useKeydown(keys: Array<string>, callback: Function) {
  useEffect(() => {
    document.addEventListener("keydown", callback);

    return () => {};
  }, []);
}

import { useState } from "react";

export default function useStorageState<T>(defaultValue: T, name: string) {
  const loadValue = (name: string) => {
    const strValue = window.sessionStorage.getItem(name);
    return strValue ? JSON.parse(strValue) : null;
  };

  const [value, setValue] = useState(() => {
    const saved = loadValue(name);

    // Nothing stored, return the default value
    if (!saved) {
      return defaultValue;
    }

    // Both values are arrays, check their lenght
    if (Array.isArray(saved) && Array.isArray(defaultValue)) {
      if (saved.length === defaultValue.length) {
        return saved;
      } else {
        return defaultValue;
      }
    }

    // Both values are dicts, check their keys
    if (
      typeof saved === "object" &&
      typeof defaultValue === "object" &&
      Object.keys(defaultValue as object).length > 0
    ) {
      if (
        Object.keys(saved).sort().toString() ===
        Object.keys(defaultValue as object)
          .sort()
          .toString()
      ) {
        return saved;
      } else {
        return defaultValue;
      }
    }

    return saved;
  });

  const storeValue = (name: string, value: T) => {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  };

  const setValueAndSave = (newValue: T) => {
    if (newValue instanceof Function) {
      setValue((preValue: T) => {
        const val = newValue(preValue);
        storeValue(name, val);
        return val;
      });
    } else {
      storeValue(name, newValue);
      setValue(newValue);
    }
  };

  return [value, setValueAndSave];
}

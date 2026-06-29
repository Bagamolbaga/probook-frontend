export function removeEmptyFields<T extends object>(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      return (
        value !== null && value !== undefined && value !== "" && !Number.isNaN(value)
      );
    })
  ) as T;
}

type WithID<TObj extends object, TID extends string, TIDKey extends string> = TObj & { [key in TIDKey]: TID };

const makeKeyedData =
  <TObj extends Record<string, any>>() =>
  <TID extends string, TIDKey extends string = 'id'>(
    map: Record<TID, TObj>,
    options?: { idKey?: TIDKey }
  ): Record<TID, WithID<TObj, TID, TIDKey>> => {
    const idKey = (options?.idKey ?? 'id') as TIDKey;
    return Object.fromEntries(
      Object.entries(map).map(([key, value]) => [
        key,
        { ...(value as TObj), [idKey]: key },
      ])
    ) as WithID<TObj, TID, TIDKey>;
  };

export default makeKeyedData;

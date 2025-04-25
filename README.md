# Overview

This is a simple function to make the creation and typing of static data in code more consistent, DRY, and repeatable. You would turn something like this:

```typescript
export type ThingID = "foo" | "bar";

export type Thing = {
  id: ThingID;
  name: string;
};

export const THINGS: Record<ThingID, Thing> = {
  foo: { id: "foo", name: "Foo" },
  bar: { id: "bar", name: "Bar" },
}
```

Into this:

```ts
export const THINGS = makeKeyedData<{
  name: string;
}>()({
  foo: { name: "Foo" },
  bar: { name: "Bar" },
});

export type ThingID = keyof typeof THINGS;
export type Thing = typeof THINGS[ThingID];
```

It might not look like much, but it provides several benefits:
- You no longer have to repeat your IDs three times.
- You no longer have to update both the `ThingID` type _and_ the `THINGS` object to add a new thing.
- You could refactor the original example, but it's tricky to do while staying DRY and maintaining strong typing.

# Motivation

I would often find myself defining static data like this:

```typescript
export type ThingID = "foo" | "bar";

export type Thing = {
  id: ThingID;
  name: string;
};

export const THINGS: Record<ThingID, Thing> = {
  foo: { id: "foo", name: "Foo" },
  bar: { id: "bar", name: "Bar" },
};
```

And then I'd get annoyed that I had to repeat the IDs _three times_, so I'd change it to something like this:

```typescript
const THING_VALUES = {
  foo: { name: "Foo" },
  bar: { name: "Bar" },
} as const;

export type ThingID = keyof typeof THING_VALUES;

export type Thing = {
  id: ThingID;
} & (typeof THING_VALUES)[ThingID];

export const THINGS: Record<ThingID, Thing> = Object.fromEntries(
  Object.entries(THING_VALUES).map(([key, value]) => [
    key,
    { id: key, ...value },
  ])
) as Record<ThingID, Thing>;
```

More DRY, but then I'd realize I'd lost strong typing on the `THINGS` object.

Third try:

```typescript
type ThingBase = {
  name: string;
};

// Define your data once, strongly typed
const thingValues = {
  foo: { name: "Foo" },
  bar: { name: "Bar" },
} satisfies Record<string, ThingBase>;

// Derive types from the object
export type ThingID = keyof typeof thingValues;
export type Thing = { id: ThingID } & ThingBase;

// Build final THINGS map with `id` injected
export const THINGS: Record<ThingID, Thing> = Object.fromEntries(
  Object.entries(thingValues).map(([key, value]) => [
    key,
    { id: key, ...value },
  ])
) as Record<ThingID, Thing>;
```

Success! I finally had a single source of truth for my keys and data, all with strong typing. The problem is that I'd have to copy and paste all of this boilerplate for every data type. And I'd inevitably have to go through this whole iterative process on my next project, because I have the memory of a goldfish.

So, instead, I made this simple package to keep myself from constantly reinventing the wheel, turning all of the above into:

```ts
export const THINGS = makeKeyedData<{
  name: string;
}>()({
  foo: { name: "Foo" },
  bar: { name: "Bar" },
});

export type ThingID = keyof typeof THINGS;
export type Thing = typeof THINGS[ThingID];
```

# Examples

### Basic usage

```typescript
export const DOGS = makeKeyedData<{
  name: string;
  breed: "poodle" | "rottweiler";
}>()({
  tiny: { name: "Tiny", breed: "rottweiler" },
  godzilla: { name: "Godzilla", breed: "poodle" },
});
/* {
  tiny: { id: "tiny", name: "Tiny", breed: "rottweiler" },
  godzilla: { id: "godzilla", name: "Godzilla", breed: "poodle" },
} */

export type DogID = keyof typeof DOGS;  // "tiny" | "godzilla"
export type Dog = typeof DOGS[DogID];   // { id: DogID, name: string, breed: "poodle" | "rottweiler" }
```

### Customizing the ID key

```ts
export const USERS = makeKeyedData<{ name: string, home: string }>()({
  willq: { name: "Will Q.", home: "/home/willq" },
  chrism: { name: "Chris M.", home: "/home/chrism" },
}, { idKey: "username" });
/* {
  willq: { username: "willq", name: "Will Q.", home: "/home/wills" },
  chrism: { username: "chrism", name: "Chris M.", home: "/home/chrism" },
} */
```

# FAQ

- Why do I have to type `makeKeyedData()({...})`? Why not just `makeKeyedData({...})`?
  - This is a well-known workaround to a limitation of TypeScript's generics. There's a [StackOverflow answer](https://stackoverflow.com/a/63678777) that provides a good summary of the issue.
- Can I use this without TypeScript?
  - Yes, although most of its value comes from the types it provides.

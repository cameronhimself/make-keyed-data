import makeKeyedData from "./makeKeyedData";

it("works", () => {
  const out = makeKeyedData<{ name: string }>()({
    foo: { name: "Foo" },
    bar: { name: "Bar" },
  });
  expect(out).toMatchObject({
    foo: { id: "foo", name: "Foo" },
    bar: { id: "bar", name: "Bar" },
  });
});

it("works with a custom ID key", () => {
  const out = makeKeyedData<{ name: string }>()({
    foo: { name: "Foo" },
    bar: { name: "Bar" },
  }, { idKey: "baz" });
  expect(out).toMatchObject({
    foo: { baz: "foo", name: "Foo" },
    bar: { baz: "bar", name: "Bar" },
  });
});


import { effect } from "../src/effect";
import { isRef, proxyRefs, ref, unRef } from "../src/ref";

describe("ref", () => {
  it("ref fn", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const obj = {
      count: 1,
    };
    const a = ref(obj);
    expect(isRef(1)).toBe(false);
    expect(isRef(a)).toBe(true);
    expect(isRef(obj)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(1)).toBe(1);
    expect(unRef(a)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };

    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);
    
    proxyUser.age = ref(15);
    expect(proxyUser.age).toBe(15);
    expect(user.age.value).toBe(15);
  });
});

import { JsonProperty } from "../src/annotations/jsonProperty";
import { Tyson } from "../src/tyson";

describe("Testing Tyson against huge datasets", () => {
  it("should convert thousands of objects starting from a generated json", () => {
    class Child {
      @JsonProperty("p1")
      p111: string = undefined;
    }

    class Base {
      @JsonProperty()
      str: string = undefined;
      @JsonProperty()
      num: number = undefined;
      @JsonProperty("bol")
      bolll: boolean = undefined;
      @JsonProperty({ type: Date })
      date: Date = undefined;
      @JsonProperty("obj")
      objjj: Child = undefined;
      @JsonProperty({ type: [String] })
      astr: string[] = undefined;
      @JsonProperty({ type: [Number] })
      anum: number[] = undefined;
      @JsonProperty({ type: [Boolean] })
      abol: boolean[] = undefined;
      @JsonProperty({ name: "aobj", type: [Child] })
      aobjjj: Child[] = undefined;
    }

    class Root {
      @JsonProperty({ type: [Base] })
      a: Base[] = undefined;
      @JsonProperty({ type: [Base] })
      b: Base[] = undefined;
      @JsonProperty({ name: "c", type: [Base] })
      cC: Base[] = undefined;
    }

    const json = {};
    for (let c of ["a", "b", "c", "d"]) {
      json[c] = [];
      for (let i = 0; i < 1000; i++) {
        json[c].push(
          {
            str: c + i,
            num: i,
            bol: i % 2 === 0,
            date: "03/29/2018",
            obj: { p1: "poiuyt" },
            astr: ["qwerty", "asdfgh", "zxcvbn"],
            anum: [2, 3, 5, 7, 11, 13, 17, 19],
            abol: [true, false, false, true],
            aobj: [
              { p1: "lkjhgf" },
              { p1: "mnbvcx" }
            ]
          }
        );
      }
    }

    const tyson = new Tyson();

    const xroot = tyson.fromJson(json, Root);
    expect(xroot.a).toHaveLength(1000);
    expect(xroot.b).toHaveLength(1000);
    expect(xroot.cC).toHaveLength(1000);
    expect(xroot.a[150].str).toBe("a150");
    expect(xroot.b[500].bolll).toBe(true);
    expect(xroot.b[750].date.getTime()).toBe(new Date("03/29/2018").getTime());
    expect(xroot.b[999].objjj.p111).toBe("poiuyt");
    expect(xroot.cC[42].astr[2]).toBe("zxcvbn");
    expect(xroot.cC[99].aobjjj[0].p111).toBe("lkjhgf");
  });
});
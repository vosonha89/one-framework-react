import { describe, expect, it } from "vitest";
import { ObjectHelper } from "../objectHelper";

/**
 * Sample holder used by the prototype tests.
 */
class Holder {
    public name = "original";
}

describe("ObjectHelper", () => {
    it("deepCopy chains the source as the copy prototype", () => {
        const source = new Holder();
        const copy = ObjectHelper.deepCopy(source);
        expect(copy).toBeInstanceOf(Holder);
        expect(copy.name).toBe("original");
    });

    it("hasApiError detects a non-zero code", () => {
        expect(ObjectHelper.hasApiError({ code: 500 })).toBe(true);
        expect(ObjectHelper.hasApiError({ code: 0 })).toBe(false);
    });

    it("hasApiError returns false for payloads without a code", () => {
        expect(ObjectHelper.hasApiError({})).toBe(false);
    });

    it("getValue reads an own property", () => {
        const object: { [s: string]: string } = { key: "value" };
        expect(ObjectHelper.getValue(object, "key")).toBe("value");
    });
});

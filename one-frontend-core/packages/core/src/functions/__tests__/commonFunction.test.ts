import { describe, expect, it } from "vitest";
import { CommonFunction } from "../commonFunction";

describe("CommonFunction", () => {
    it("createUUID returns a UUID v4 style string", () => {
        expect(CommonFunction.createUUID()).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );
    });

    it("formatCurrency formats a value with the given locale", () => {
        expect(CommonFunction.formatCurrency(1234.5, "en-US", "USD")).toBe("$1,234.50");
    });

    it("randomNumber stays within the half-open range", () => {
        for (let index = 0; index < 200; index += 1) {
            const value = CommonFunction.randomNumber(3, 7);
            expect(value).toBeGreaterThanOrEqual(3);
            expect(value).toBeLessThan(7);
        }
    });

    it("sleep resolves after the delay", async () => {
        await CommonFunction.sleep(1);
        expect(true).toBe(true);
    });
});

import { describe, expect, it } from "vitest";
import { UIHelper } from "../uiHelper";

describe("UIHelper", () => {
    it("wraps text for dangerouslySetInnerHTML consumers", () => {
        expect(UIHelper.createElementFromString("<b>bold</b>")).toEqual({
            __html: "<b>bold</b>",
        });
    });
});

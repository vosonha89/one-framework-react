import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { RealTimeSharingDataService } from "../realtimeSharingDataService";
import { SharingDataService } from "../sharingDataService";

describe("SharingDataService", () => {
    it("saves and reads back a serialized value", () => {
        const service = new SharingDataService();
        service.saveObject("key", { token: "abc" });
        expect(service.getObject<{ token: string }>("key")).toEqual({
            token: "abc",
        });
    });

    it("deletes a stored value", () => {
        const service = new SharingDataService();
        service.saveObject("key", 1);
        expect(service.deleteObject("key")).toBe(true);
        expect(service.getObject("key")).toBeUndefined();
    });
});

describe("RealTimeSharingDataService", () => {
    it("emits saved values through the listener", () => {
        const service = new RealTimeSharingDataService();
        const received: string[] = [];
        service.saveObject("session", "first");
        service.getObject<string>("session")?.listener.subscribe((value) => {
            received.push(value);
        });
        service.saveObject("session", "second");
        expect(received).toEqual(["first", "second"]);
    });

    it("deletes a stored listener entry", () => {
        const service = new RealTimeSharingDataService();
        service.saveObject("session", "first");
        expect(service.deleteObject("session")).toBe(true);
        expect(service.getObject<string>("session")).toBeUndefined();
    });
});

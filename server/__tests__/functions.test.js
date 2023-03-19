"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../src/functions");
test("check if one or more properties null or undefined", () => {
    const user = {
        name: "gdj",
        password: "dtkhj"
    };
    expect((0, functions_1.checkPropertiesNull)(user)).toBe(true);
});
test("check if extension is right", () => {
    expect((0, functions_1.fileIsImage)("abc.png")).toBe(true);
    expect((0, functions_1.fileIsImage)("nrtul.jpeg")).toBe(true);
    expect((0, functions_1.fileIsImage)("nrtul.gif.test")).toBe(false);
    expect((0, functions_1.fileIsImage)(undefined)).toBe(false);
});

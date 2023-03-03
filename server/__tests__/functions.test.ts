import { checkPropertiesNull, fileIsImage } from "../src/functions";
test("check if one or more properties null or undefined", () => {
  const user = {
    name: "gdj",
    password: "dtkhj"
  };
  expect(checkPropertiesNull(user)).toBe(true);
});
test("check if extension is right", () => {
  expect(fileIsImage("abc.png")).toBe(true);
  expect(fileIsImage("nrtul.jpeg")).toBe(true);
  expect(fileIsImage("nrtul.gif.test")).toBe(false);
  expect(fileIsImage(undefined)).toBe(false);
});

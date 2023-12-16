export function throwRandomString(length: number) {
  const chars = [
    "#",
    "?",
    "@",
    "+",
    "*",
    "§",
    "$",
    "£",
    "!",
    "&",
    "/",
    "_",
    "{",
    "]",
  ];
  let charArr: string[] = [];
  while (charArr.length !== length) {
    charArr.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return charArr.join("");
}

export function throwRandomChar() {
  const chars = [
    "#",
    "?",
    "@",
    "+",
    "*",
    "§",
    "$",
    "£",
    "!",
    "&",
    "/",
    "_",
    "{",
    "]",
  ];
  return chars[Math.floor(Math.random() * chars.length)];
}

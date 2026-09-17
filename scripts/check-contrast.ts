const colors = {
  white: "#FFFFFF",
  mist: "#F8FBF5",
  pale: "#F5FCE4",
  ink: "#17211B",
  panel: "#303B34",
  brand: "#018069",
  lime: "#79C82D",
  deep: "#135026",
  body: "#59645D",
  muted: "#7D8981",
  success: "#16713A",
  info: "#1769AA",
  warning: "#F5A623",
  danger: "#C93420",
  highlight: "#F06418",
};
type Token = keyof typeof colors;
function luminance(hex: string) {
  const c = hex
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const pairs: [Token, Token][] = [
  ...(["white", "mist", "pale"] as Token[]).flatMap((bg) =>
    (["ink", "panel", "body", "brand"] as Token[]).map(
      (fg) => [fg, bg] as [Token, Token],
    ),
  ),
  ["white", "brand"],
  ["white", "deep"],
  ["white", "ink"],
  ["mist", "ink"],
  ["muted", "ink"],
  ["white", "panel"],
  ["ink", "lime"],
  ["ink", "highlight"],
  ["success", "white"],
  ["danger", "white"],
  ["info", "white"],
  ["deep", "pale"],
];
let failed = false;
for (const [fg, bg] of pairs) {
  const a = luminance(colors[fg]),
    b = luminance(colors[bg]);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const pass = ratio >= 4.5;
  console.log(`${pass ? "PASS" : "FAIL"} ${fg} / ${bg}: ${ratio.toFixed(2)}:1`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;

const uiPairs: [Token, Token][] = [
  ["info", "white"],
  ["info", "mist"],
  ["info", "pale"],
  ["white", "ink"],
  ["white", "deep"],
  ["brand", "white"],
  ["body", "white"],
  ["muted", "ink"],
];
for (const [fg, bg] of uiPairs) {
  const a = luminance(colors[fg]),
    b = luminance(colors[bg]);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const pass = ratio >= 3;
  console.log(
    `${pass ? "PASS" : "FAIL"} UI/focus ${fg} / ${bg}: ${ratio.toFixed(2)}:1`,
  );
  if (!pass) process.exitCode = 1;
}

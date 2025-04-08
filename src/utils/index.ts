const bubbleColors = ["bg-[#FCEED3]", "bg-[#D2F2EA]", "bg-[#F8F8F8]"];

export function getRandomColor(excludeColor: string) {
  const filtered = bubbleColors.filter((c) => c !== excludeColor);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

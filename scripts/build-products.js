const fs = require("fs");
const path = require("path");

/**
 * INPUT:  src/data/raw-products.txt
 * OUTPUT: src/data/products.generated.json
 *
 * Dəstəklənən format:
 * 1) Qrup başlayan sətir (indent yoxdur):
 *    STAR SUPER  STAR SUPER PARLAQ 3.75 LT  34,00
 *
 * 2) Alt sətir (indent var):
 *      STAR SUPER POL 3.75LT  34,00
 */

const inputPath = path.join(process.cwd(), "src", "data", "raw-products.txt");
const outPath = path.join(process.cwd(), "src", "data", "products.generated.json");

function splitParts(line) {
  // 2+ boşluq və ya tab separator
  return line.trim().split(/\s{2,}|\t+/).filter(Boolean);
}

function parsePriceToNumber(priceRaw) {
  // "34,00" -> 34,  "8,30" -> 8.3
  // bəzən "116,00 " kimi ola bilər
  const cleaned = String(priceRaw).trim().replace("₼", "").trim();
  const num = Number(cleaned.replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function addVariant(map, group, title, priceNumber) {
  if (!map.has(group)) map.set(group, []);
  map.get(group).push({ title: title.trim(), price: priceNumber });
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("❌ raw-products.txt tapılmadı:", inputPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf-8").replace(/\r/g, "");

  const lines = raw
    .split("\n")
    .map((l) => l.replace(/\s+$/g, "")) // sağ boşluqları sil
    .filter((l) => l.trim().length > 0);

  const map = new Map(); // groupName -> variants[]
  let currentGroup = null;

  for (const line of lines) {
    const isIndented = /^\s+/.test(line);

    // Qrup sətri (indent yox)
    if (!isIndented) {
      const parts = splitParts(line);
      // gözlənən: [GROUP, ...variantTitle, PRICE]
      if (parts.length < 3) continue;

      const group = parts[0];
      currentGroup = group;

      const priceRaw = parts[parts.length - 1];
      const priceNumber = parsePriceToNumber(priceRaw);
      if (priceNumber === null) continue;

      const variantTitle = parts.slice(1, parts.length - 1).join(" ");
      addVariant(map, group, variantTitle, priceNumber);
      continue;
    }

    // Alt sətir (indent var) -> currentGroup-a əlavə
    if (!currentGroup) continue;

    const parts = splitParts(line);
    // gözlənən: [...variantTitle, PRICE]
    if (parts.length < 2) continue;

    const priceRaw = parts[parts.length - 1];
    const priceNumber = parsePriceToNumber(priceRaw);
    if (priceNumber === null) continue;

    const variantTitle = parts.slice(0, parts.length - 1).join(" ");
    addVariant(map, currentGroup, variantTitle, priceNumber);
  }

  const items = Array.from(map.entries()).map(([name, variants]) => ({
    name,
    image: "/images/products/default.jpg",
    variants,
  }));

  const result = {
    productsSection: {
      title: "Məhsullar",
      items,
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");

  const totalVariants = items.reduce((sum, x) => sum + x.variants.length, 0);
  console.log("✅ Generated:", outPath);
  console.log("✅ Groups:", items.length);
  console.log("✅ Total variants:", totalVariants);
}

main();

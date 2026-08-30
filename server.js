import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

function getPrice(destination, index) {
  const basePrices = {
    TYO: 5980,
    OSA: 6280,
    FUK: 4980,
    OKA: 4280,
    SEL: 4680,
    PUS: 4380
  };

  const base = basePrices[destination] || 5500;
  return Math.max(3280, base + ((index * 317) % 1300) - 500);
}

app.post("/api/deals", (req, res) => {
  const { destination = "ALL" } = req.body || {};

  const destinations =
    destination === "ALL"
      ? ["OKA", "PUS", "FUK", "SEL", "TYO", "OSA"]
      : [destination];

  const names = {
    TYO: "東京",
    OSA: "大阪",
    FUK: "福岡",
    OKA: "沖繩",
    SEL: "首爾",
    PUS: "釜山"
  };

  const deals = destinations
    .map((code, index) => ({
      destination: code,
      name: names[code],
      depart: `2026-12-${String(5 + index * 2).padStart(2, "0")}`,
      return: `2026-12-${String(10 + index * 2).padStart(2, "0")}`,
      price: getPrice(code, index),
      grade: index < 2 ? "超級便宜" : "很便宜",
      drop: 41 - index * 3
    }))
    .sort((a, b) => a.price - b.price);

  res.json({
    source: "demo",
    deals
  });
});

app.listen(PORT, () => {
  console.log(`日韓機票雷達已啟動：${PORT}`);
});

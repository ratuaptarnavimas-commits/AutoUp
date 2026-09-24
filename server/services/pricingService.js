const markupRules = [{ maximum: 20, rate: 0.4 }, { maximum: 50, rate: 0.3 }, { maximum: 100, rate: 0.25 }, { maximum: 250, rate: 0.2 }, { maximum: Infinity, rate: 0.15 }];

export function calculateRetailPrice(costPrice) {
  const rule = markupRules.find(({ maximum }) => costPrice <= maximum);
  return Number((Math.ceil(costPrice * (1 + rule.rate)) - 0.1).toFixed(2));
}

module.exports = {
  1: { provide: 300, upgrade: 500, reward: 0 },
  2: { provide: 500, upgrade: 1000, reward: 0 },
  3: { provide: 1000, upgrade: 2000, reward: 0 },
  4: { provide: 2000, upgrade: 4000, reward: 0 },
  5: { provide: 4000, upgrade: 8000, reward: 10000 },
  6: { provide: 8000, upgrade: 16000, reward: 51000 },
  7: { provide: 16000, upgrade: 32000, reward: 100000 }, // 1 Lakh
  8: { provide: 32000, upgrade: 64000, reward: 500000 }, // 5 Lakh
  9: { provide: 64000, upgrade: 128000, reward: 2500000 }, // 25 Lakh
  10: { provide: 128000, upgrade: 256000, reward: 5100000 }, // 51 Lakh
  11: { provide: 256000, upgrade: 0, reward: 10000000 }, // 1 Crore, 'Coming Soon' implies no further upgrade
};
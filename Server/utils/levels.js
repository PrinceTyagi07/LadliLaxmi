module.exports = {
1: { provide: 500, upgrade: 800 },
2: { provide: 800, upgrade: 1500 },
3: { provide: 1500, upgrade: 3000 },
4: { provide: 3000, upgrade: 5000 },
5: { provide: 5000, upgrade: 0 }, // Final level, no upgrade
};
const hash = await Bun.password.hash('secret123', {
  algorithm: 'argon2id',
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
});

console.log('Hash:', hash);
console.log('Parts:', hash.split('$'));

const parts = hash.split('$');
if (parts.length >= 5) {
  const params = parts[3];
  console.log('Params:', params);
  const match = params.match(/m=(\d+),t=(\d+),p=(\d+)/);
  console.log('Match:', match);
  if (match) {
    const [, memory, time, parallelism] = match.map(Number);
    console.log('Memory:', memory, 'Time:', time, 'Parallelism:', parallelism);
  }
}

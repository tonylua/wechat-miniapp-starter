const _split = ver=>ver.split('.').map(n=>parseInt(n));
const _comp = (a, b)=>{
  if (a === b) return 0;
  else if (a > b) return 1;
  return -1;
}

//比较软件版本 x.x.x
exports.compare = (a, b)=>{
  let va = _split(a);
  let vb = _split(b);
  let temp = va.map((ia, idx) => _comp(ia, vb[idx]));
  while (temp[0] === 0) temp.shift();
  if (!temp.length) return 0;
  return temp[0];
};
export const calcChartWidth = (a: number, b: number) => {
  // a, b => numbers to be compared and have their width calculated.
  // considering absolute numbers
  a = Math.abs(a);
  b = Math.abs(b);

  let aWidth, bWidth;
  if (a >= Math.abs(b)) {
    aWidth = '100%';
    bWidth = (100 * b / a).toString() + '%';
  } 
  else { // a < b
    aWidth = (100 * a / b).toString() + '%';
    bWidth = '100%';
  }

  return [aWidth, bWidth];
};
/**
 * 坐标串转多边形
 * @param coors 坐标串
 * @returns {string} bound
 */
export function coors2Boundary(coors: number[][]) {
  if (!coors || coors.length < 3) return undefined;
  const bound = 'POLYGON((' + coors.map(coor => coor.join(' ')).join(',') + '))';
  return bound;
}

/**
 * 输入一串经纬度,计算四至
 */
 export function calculateRange(coors: number[][]) {
  return {
    minx: Math.min(...coors.map(item => item[0])),
    miny: Math.min(...coors.map(item => item[1])),
    maxx: Math.max(...coors.map(item => item[0])),
    maxy: Math.max(...coors.map(item => item[1]))
  }
}
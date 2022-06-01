/**
 * 获取geojson对象
 * @param url geojson url
 * @returns geojson对象
 */
export const fetchGeoJSON = async (url: string): Promise<GeoJSON.GeoJSON> => {
  const res = await fetch(url, {
    mode: 'cors'
  });
  const GeoJSON = await res.json();
  return GeoJSON
}
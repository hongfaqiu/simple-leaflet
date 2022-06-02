import { Tag } from 'antd';
import L, { LeafletEventHandlerFn } from 'leaflet';
import { useEffect, useState } from 'react';

import { MapObj } from '../../Utils/Map';
import './RectDrawer.css';

interface RectDrawerProps {
  boundary?: string
  onChange?: (coors: [number, number][] | null) => void
}
const RectDrawer: React.FC<RectDrawerProps> = props => {
  const { boundary, onChange } = props;

  const [working, setWorking] = useState(false);

  const callback: LeafletEventHandlerFn = (e) => {
    const coors: [number, number][] = e.layer._latlngs[0].map((item: L.LatLng) => [item.lng, item.lat])
    if (onChange) {
      onChange(coors)
    }
    MapObj?.map.off(L.Draw.Event.CREATED, callback)
    setWorking(false)
  }

  useEffect(() => {
    if (working) {
      MapObj?.map.on(L.Draw.Event.CREATED, callback)
      MapObj?.drawRectangle()
    } else {
      MapObj?.stopDrawRectangle()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [working])

  return (
    <div className="rect-drawer">
      <Tag
        onClick={() => setWorking(val => !val)}
        className={`bbox ${working && 'working'}`}>
        {working ? '绘制中' : (boundary ? '重绘' : '绘制')}
      </Tag>
    </div>
  )
}

export default RectDrawer;

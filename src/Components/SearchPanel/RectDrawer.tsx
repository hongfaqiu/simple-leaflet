import { Tag } from 'antd';
import L, { LeafletEventHandlerFn } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapObj } from '../../Utils/Map';

import './RectDrawer.css';

interface RectDrawerProps {
  onChange?: (bound: {
    minx: number
    maxx: number
    miny: number
    maxy: number
  } | null) => void;
}
const RectDrawer: React.FC<RectDrawerProps> = props => {
  const { onChange } = props;

  const [working, setWorking] = useState(false);

  const callback: LeafletEventHandlerFn = (e) => {
    const bounds = (e.layer as any)._bounds
    if (onChange) {
      onChange({
        minx: bounds._southWest.lng,
        maxx: bounds._northEast.lng,
        miny: bounds._southWest.lat,
        maxy: bounds._northEast.lat,
      })
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
        {working ? '绘制中' : '绘制'}
      </Tag>
    </div>
  )
}

export default RectDrawer;

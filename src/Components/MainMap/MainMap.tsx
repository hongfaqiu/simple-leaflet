import { useEffect } from "react"

import LeafletMap, { setMapObj } from "../../Utils/Map"
import './MapMap.css'

interface MainMapProps {
  children?: React.ReactNode
}
const MainMap = (props: MainMapProps) => {

  useEffect(() => {
    const obj = new LeafletMap('map')
    setMapObj(obj)
  
    return () => {
      obj?.destory()
      setMapObj(undefined)
    }
  }, [])
  
  return (
    <div id="map">
      {props.children}
    </div>
  )
}

export default MainMap
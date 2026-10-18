import PhotoCard from './PhotoCard'
import { getPoint } from '../utils/spherePoints'

export default function PhotoSphere({ photos, radius, sphereRef, onSelect }) {
  const size = radius * 0.27

  return (
    <div className="sphere" ref={sphereRef}>
      {photos.map((photo, i) => {
        const { lat, lon } = getPoint(i, photos.length)
        return (
          <PhotoCard
            key={photo.id}
            photo={photo}
            radius={radius}
            size={size}
            lat={lat}
            lon={lon}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}
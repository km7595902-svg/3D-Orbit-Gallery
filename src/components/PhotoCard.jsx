export default function PhotoCard({ photo, lat, lon, radius, size, onSelect }) {
  const style = {
    width: size,
    height: size,
    backgroundImage: `url("${photo.src}")`,
    transform: `rotateY(${lon}deg) rotateX(${lat}deg) translateZ(${radius}px) translate(-50%, -50%)`,
  }
  return (
    <div
      className="photo-card"
      style={style}
      role="button"
      aria-label={photo.title}
      onClick={() => onSelect(photo)}
    />
  )
}
function Badge({ items, className = 'flex gap-1' }) {
  return (
    items.length > 0 && (
      <div className={className}>
        {items.splice(0, 2).map((item) => (
          <span className={`badge whitespace-nowrap border-2 border-white text-center ${item.customClass}`}>{item.text}</span>
        ))}
      </div>
    )
  )
}

export default Badge

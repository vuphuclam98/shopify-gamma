function PlpInlineBanner({ content, index, className, key }) {
  return content && <div key={key} dangerouslySetInnerHTML={{ __html: content }} className={className} index={index}></div>
}

export default PlpInlineBanner

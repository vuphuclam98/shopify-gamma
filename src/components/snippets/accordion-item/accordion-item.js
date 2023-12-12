import { useState, useRef, useEffect } from 'preact/hooks'
import Icon from 'snippets/icon/icon'

function AccordionItem({ defaultActive, heading, content, subContent, wrapperClass, titleClass, isOverflow = true, isMaxHeight = true }) {
  const contentRef = useRef(null)
  const [active, setActive] = useState(false)
  const [style, setStyle] = useState('max-height: 0')

  useEffect(() => {
    if (defaultActive && !active) {
      onToggle()
    } else if (!defaultActive && active) {
      setActive(false)
      setStyle('max-height: 0')
    }
  }, [defaultActive])

  const onToggle = () => {
    const maxHeight = !isMaxHeight || contentRef.current.scrollHeight < 300 ? contentRef.current.scrollHeight : 300
    if (!active) {
      setStyle(`max-height: ${maxHeight}px`)
    } else {
      setStyle('max-height: 0')
    }
    setActive(!active)
  }

  useEffect(() => {
    if (active && defaultActive) {
      const maxHeight = !isMaxHeight || contentRef.current.scrollHeight < 300 ? contentRef.current.scrollHeight : 300
      setStyle(`max-height: ${maxHeight}px`)
    }
  }, [content, defaultActive])

  return (
    <div className={`accordion-item ${wrapperClass}`} open={active}>
      <button className={`accordion-item-title ${titleClass}`} onClick={onToggle}>
        <div class="mr-8 flex-1">
          <span>{heading}</span>
          {subContent}
        </div>
        <span class="accordion-item-icon">
          <Icon viewBox="0 0 20 20" name="icon-plus" className="accordion-item-icon-open text-grey-500" />
          <Icon viewBox="0 0 20 20" name="icon-minus" className="accordion-item-icon-close text-grey-500" />
        </span>
      </button>
      <div ref={contentRef} className={`${isOverflow ? 'scrollbar-custom max-h-[300px] overflow-y-auto ' : ''} accordion-item-description`} style={style}>
        {content}
      </div>
    </div>
  )
}

export default AccordionItem

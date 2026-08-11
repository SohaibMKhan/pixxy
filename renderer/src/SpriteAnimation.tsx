import { useEffect, useRef } from 'react'

type SpriteAnimationProps = {
  src: string
  columns: number
  rows: number
  fps?: number
  loop?: boolean
  width?: number
  height?: number
  onComplete?: () => void
}

function removeCheckerboard(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) return

  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = image.data

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index]
    const green = pixels[index + 1]
    const blue = pixels[index + 2]
    const maximum = Math.max(red, green, blue)
    const minimum = Math.min(red, green, blue)
    const brightness = (red + green + blue) / 3

    // The supplied PNG sheets contain a baked light-gray checkerboard rather
    // than an alpha channel. Pixxy's colored artwork remains above this
    // threshold, so key only the low-saturation light background pixels.
    if (maximum - minimum < 22 && brightness > 145) {
      pixels[index + 3] = 0
    }
  }

  context.putImageData(image, 0, 0)
}

export default function SpriteAnimation({
  src,
  columns,
  rows,
  fps = 6,
  loop = true,
  width = 240,
  height = 300,
  onComplete,
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const completionRef = useRef(onComplete)
  completionRef.current = onComplete

  useEffect(() => {
    let cancelled = false
    let timer: number | undefined

    const image = new Image()
    image.decoding = 'async'
    image.src = src

    image.onload = () => {
      if (cancelled) return

      const sourceWidth = image.naturalWidth / columns
      const sourceHeight = image.naturalHeight / rows
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      canvas.width = Math.round(width)
      canvas.height = Math.round(height)

      let frame = 0
      const totalFrames = columns * rows
      const frameDelay = Math.max(30, 1000 / fps)

      const drawFrame = () => {
        if (cancelled) return

        context.clearRect(0, 0, canvas.width, canvas.height)
        const scale = Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight)
        const destinationWidth = sourceWidth * scale
        const destinationHeight = sourceHeight * scale
        const destinationX = (canvas.width - destinationWidth) / 2
        const destinationY = (canvas.height - destinationHeight) / 2

        context.drawImage(
          image,
          (frame % columns) * sourceWidth,
          Math.floor(frame / columns) * sourceHeight,
          sourceWidth,
          sourceHeight,
          destinationX,
          destinationY,
          destinationWidth,
          destinationHeight,
        )
        removeCheckerboard(canvas)

        frame += 1
        if (frame >= totalFrames) {
          if (!loop) {
            completionRef.current?.()
            return
          }
          frame = 0
        }

        timer = window.setTimeout(drawFrame, frameDelay)
      }

      drawFrame()
    }

    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [src, columns, rows, fps, loop, width, height])

  return <canvas ref={canvasRef} className="pixxy-sprite" aria-hidden="true" />
}

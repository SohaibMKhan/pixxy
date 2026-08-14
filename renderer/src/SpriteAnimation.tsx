import { useEffect, useRef } from 'react'

type SpriteAnimationProps = {
  src: string
  columns: number
  rows: number
  fps?: number
  loop?: boolean
  width?: number
  height?: number
  freezeFrame?: number
  onComplete?: () => void
  onFrame?: (frame: number, totalFrames: number) => void
}

type FrameBounds = {
  x: number
  y: number
  width: number
  height: number
  bottom: number
}

function findFrameBounds(context: CanvasRenderingContext2D, width: number, height: number): FrameBounds | null {
  const pixels = context.getImageData(0, 0, width, height).data
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = pixels[(y * width + x) * 4 + 3]
      if (alpha > 8) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < 0 || maxY < 0) return null

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    bottom: maxY + 1,
  }
}

export default function SpriteAnimation({
  src,
  columns,
  rows,
  fps = 6,
  loop = true,
  width = 110,
  height = 150,
  freezeFrame,
  onComplete,
  onFrame,
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const completionRef = useRef(onComplete)
  const frameCallbackRef = useRef(onFrame)
  completionRef.current = onComplete
  frameCallbackRef.current = onFrame

  useEffect(() => {
    let cancelled = false
    let timer: number | undefined

    const image = new Image()
    image.decoding = 'async'
    image.src = src

    image.onload = () => {
      if (cancelled) return

      const sourceWidth = Math.floor(image.naturalWidth / columns)
      const sourceHeight = Math.floor(image.naturalHeight / rows)
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      context.imageSmoothingEnabled = false

      const frameCanvas = document.createElement('canvas')
      frameCanvas.width = sourceWidth
      frameCanvas.height = sourceHeight
      const frameContext = frameCanvas.getContext('2d', { willReadFrequently: true })
      if (!frameContext) return
      frameContext.imageSmoothingEnabled = false

      const totalFrames = columns * rows
      const frames: FrameBounds[] = []

      for (let index = 0; index < totalFrames; index += 1) {
        frameContext.clearRect(0, 0, sourceWidth, sourceHeight)
        frameContext.drawImage(
          image,
          (index % columns) * sourceWidth,
          Math.floor(index / columns) * sourceHeight,
          sourceWidth,
          sourceHeight,
          0,
          0,
          sourceWidth,
          sourceHeight,
        )
        frames.push(findFrameBounds(frameContext, sourceWidth, sourceHeight) ?? {
          x: 0,
          y: 0,
          width: sourceWidth,
          height: sourceHeight,
          bottom: sourceHeight,
        })
      }

      const maxFrameWidth = Math.max(...frames.map((frame) => frame.width))
      const maxFrameHeight = Math.max(...frames.map((frame) => frame.height))
      const targetScale = Math.min(
        (canvas.width - 4) / maxFrameWidth,
        (canvas.height - 4) / maxFrameHeight,
      )
      const baseline = Math.max(...frames.map((frame) => frame.bottom))
      const frameDelay = Math.max(60, 1000 / fps)
      let frame = Math.max(0, Math.min(freezeFrame ?? 0, totalFrames - 1))

      const drawFrame = () => {
        if (cancelled) return

        const bounds = frames[frame]
        frameContext.clearRect(0, 0, sourceWidth, sourceHeight)
        frameContext.drawImage(
          image,
          (frame % columns) * sourceWidth,
          Math.floor(frame / columns) * sourceHeight,
          sourceWidth,
          sourceHeight,
          0,
          0,
          sourceWidth,
          sourceHeight,
        )

        // Clear and replace the entire displayed frame. Nothing from the previous
        // sprite frame is allowed to remain behind the new frame.
        context.clearRect(0, 0, canvas.width, canvas.height)

        const destinationWidth = bounds.width * targetScale
        const destinationHeight = bounds.height * targetScale
        const destinationX = (canvas.width - destinationWidth) / 2
        const destinationY = canvas.height - (baseline * targetScale) + ((baseline - bounds.bottom) * targetScale)

        context.drawImage(
          frameCanvas,
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          Math.round(destinationX),
          Math.round(destinationY),
          Math.round(destinationWidth),
          Math.round(destinationHeight),
        )

        frameCallbackRef.current?.(frame, totalFrames)

        if (freezeFrame !== undefined) return

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
  }, [src, columns, rows, fps, loop, width, height, freezeFrame])

  return <canvas ref={canvasRef} className="pixxy-sprite" aria-hidden="true" />
}

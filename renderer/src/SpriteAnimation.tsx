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

type Component = {
  x: number
  y: number
  width: number
  height: number
  area: number
}

function findComponents(context: CanvasRenderingContext2D, width: number, height: number): Component[] {
  const pixels = context.getImageData(0, 0, width, height).data
  const visited = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  const components: Component[] = []

  const alphaAt = (x: number, y: number) => pixels[(y * width + x) * 4 + 3] > 8

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      if (visited[index] || !alphaAt(x, y)) continue

      let head = 0
      let tail = 0
      queue[tail] = index
      tail += 1
      visited[index] = 1

      let minX = x
      let minY = y
      let maxX = x
      let maxY = y
      let area = 0

      while (head < tail) {
        const currentIndex = queue[head]
        const currentX = currentIndex % width
        const currentY = Math.floor(currentIndex / width)
        head += 1
        area += 1

        if (currentX < minX) minX = currentX
        if (currentY < minY) minY = currentY
        if (currentX > maxX) maxX = currentX
        if (currentY > maxY) maxY = currentY

        const neighbors = [
          [currentX - 1, currentY],
          [currentX + 1, currentY],
          [currentX, currentY - 1],
          [currentX, currentY + 1],
        ]

        for (const [nextX, nextY] of neighbors) {
          if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue
          const nextIndex = nextY * width + nextX
          if (visited[nextIndex] || !alphaAt(nextX, nextY)) continue

          visited[nextIndex] = 1
          queue[tail] = nextIndex
          tail += 1
        }
      }

      components.push({
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        area,
      })
    }
  }

  return components.sort((a, b) => b.area - a.area)
}

function findFrameBounds(context: CanvasRenderingContext2D, width: number, height: number): FrameBounds | null {
  const components = findComponents(context, width, height)
  const main = components[0]
  if (!main) return null

  // The old bounds calculation treated every non-transparent pixel in a frame
  // as one sprite. If the source sheet has a neighbouring pose touching a cell,
  // that pulls the neighbour into Pixxy and creates the visible half-character.
  // Start from the largest component and only keep nearby disconnected details.
  const padding = 18
  const left = main.x - padding
  const top = main.y - padding
  const right = main.x + main.width + padding
  const bottom = main.y + main.height + padding

  const selected = components.filter((component) => {
    const componentRight = component.x + component.width
    const componentBottom = component.y + component.height
    return component.x <= right
      && componentRight >= left
      && component.y <= bottom
      && componentBottom >= top
  })

  const minX = Math.min(...selected.map((component) => component.x))
  const minY = Math.min(...selected.map((component) => component.y))
  const maxX = Math.max(...selected.map((component) => component.x + component.width))
  const maxY = Math.max(...selected.map((component) => component.y + component.height))

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    bottom: maxY,
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

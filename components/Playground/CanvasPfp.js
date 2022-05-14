import React from "react"

const CanvasPfp = props => {
  const canvasRef = React.useRef(null)

  const draw = ctx => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height)
    const randomColor = () => {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      const a = Math.random()
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
    gradient.addColorStop(0, `${randomColor()}`)
    gradient.addColorStop(1, `${randomColor()}`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 160, 160)
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    draw(ctx)
  }, [draw])

  return <canvas ref={canvasRef} {...props} width={160} height={160} />
}

export default CanvasPfp

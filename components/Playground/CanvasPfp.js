import React from "react"

const CanvasPfp = props => {
  const canvasRef = React.useRef(null)

  const draw = ctx => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height)
    gradient.addColorStop(0, "#0DB2AC")
    gradient.addColorStop(0.6, "#FC8D4D")
    gradient.addColorStop(1, "#FABA32")
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
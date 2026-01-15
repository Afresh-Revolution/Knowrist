import { useState, useRef, useEffect } from 'react'

interface HoverTransform {
  rotateX: number
  rotateY: number
  scale: number
}

/**
 * Custom hook that creates a 3D bending effect on dialog hover
 * When hovering on one side, the opposite side scales up, creating a weight/bending effect
 */
export const useDialogHover = () => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState<HoverTransform>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate mouse position relative to center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2)
      const mouseY = (e.clientY - centerY) / (rect.height / 2)

      // Create bending effect: when hovering on one side, opposite side lifts up
      // When mouse is on left side (negative mouseX), rotate around left edge (positive rotateY)
      // This makes the right side appear to lift up
      const rotateY = -mouseX * 5 // Max 5 degrees - negative because we want opposite side to lift
      const rotateX = mouseY * 3 // Max 3 degrees for vertical tilt
      
      // Scale effect: opposite side scales up to enhance the lift effect
      // The scale creates a "weight" effect where the hovered area appears pressed down
      const scale = 1 + Math.abs(mouseX) * 0.02 + Math.abs(mouseY) * 0.015 // More noticeable scale increase

      setTransform({
        rotateX,
        rotateY,
        scale,
      })
    }

    const handleMouseLeave = () => {
      setTransform({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
      })
    }

    dialog.addEventListener('mousemove', handleMouseMove)
    dialog.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      dialog.removeEventListener('mousemove', handleMouseMove)
      dialog.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const style: React.CSSProperties = {
    transform: `perspective(1200px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
    willChange: 'transform',
  }

  return { dialogRef, style }
}

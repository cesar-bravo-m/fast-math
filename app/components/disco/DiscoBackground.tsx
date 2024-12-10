'use client'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectCombo } from '@/lib/features/combo/comboSlice'
import './DiscoBackground.css'

export const DiscoBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const combo = useSelector(selectCombo)
    const particlesRef = useRef<Particle[]>([])

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        // Establecer tamaño del canvas
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Sistema de partículas
        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number
            color: string
            targetColor: string
            hue: number
            saturation: number
            lightness: number
            alpha: number
            targetSpeed: number
            currentSpeed: number
            baseSpeed: number

            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.currentSpeed = 0.5
                this.updateTargetSpeed()
                this.vx = (Math.random() - 0.5) * this.currentSpeed
                this.vy = (Math.random() - 0.5) * this.currentSpeed
                this.size = Math.random() * (2 + Math.min(combo * 0.05, 3)) + 1
                this.hue = 200 + Math.random() * 40 // Start with blue
                this.saturation = 75
                this.lightness = 50
                this.alpha = 0.6
                this.updateTargetColor()
                this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
                this.baseSpeed = Math.min(2 + (combo * 0.1), 8)
            }

            updateTargetSpeed() {
                this.targetSpeed = Math.min(0.5 + (combo * 0.08), 5)
            }

            updateTargetColor() {
                if (combo >= 100) {
                    this.hue = Math.random() * 360 // Rainbow
                    this.saturation = 90
                    this.lightness = 65
                    this.alpha = 0.7
                } else if (combo >= 50) {
                    this.hue = 270 + Math.random() * 60 // Purple
                    this.saturation = 85
                    this.lightness = 60
                    this.alpha = 0.6
                } else if (combo >= 20) {
                    this.hue = Math.random() * 20 // Red
                    this.saturation = 85
                    this.lightness = 55
                    this.alpha = 0.6
                } else if (combo >= 10) {
                    this.hue = 20 + Math.random() * 40 // Orange
                    this.saturation = 80
                    this.lightness = 55
                    this.alpha = 0.6
                } else {
                    this.hue = 200 + Math.random() * 40 // Blue
                    this.saturation = 75
                    this.lightness = 50
                    this.alpha = 0.6
                }
            }

            update() {
                // Smooth speed transition
                this.updateTargetSpeed()
                this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.1

                // Update velocity with new speed
                const currentMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
                if (currentMagnitude !== 0) {
                    this.vx = (this.vx / currentMagnitude) * this.currentSpeed
                    this.vy = (this.vy / currentMagnitude) * this.currentSpeed
                }

                // Impulso adicional basado en el combo
                const comboBoost = 1 + (combo * 0.02)
                
                // Agregar turbulencia leve en combos altos
                if (combo >= 50) {
                    this.vx += (Math.random() - 0.5) * 0.2
                    this.vy += (Math.random() - 0.5) * 0.2
                    
                    // Limitar velocidad máxima
                    const maxVel = this.baseSpeed * 1.5
                    this.vx = Math.max(Math.min(this.vx, maxVel), -maxVel)
                    this.vy = Math.max(Math.min(this.vy, maxVel), -maxVel)
                }

                this.x += this.vx
                this.y += this.vy

                if (this.x < -this.size) this.x = canvas.width + this.size
                if (this.x > canvas.width + this.size) this.x = -this.size
                if (this.y < -this.size) this.y = canvas.height + this.size
                if (this.y > canvas.height + this.size) this.y = -this.size

                this.updateTargetColor()
                this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.fill()

                const glowIntensity = Math.max(0, Math.min((combo - 20) / 30, 1)) * 10
                if (glowIntensity > 0) {
                    ctx.shadowBlur = glowIntensity
                    ctx.shadowColor = this.color
                    ctx.fill()
                    ctx.shadowBlur = 0
                }
            }
        }

        const particles: Particle[] = []
        const baseCount = 50
        const comboBonus = Math.min(combo * 3, 250)
        const particleCount = baseCount + comboBonus

        const targetCount = Math.min(50 + combo * 2, 200)
        while (particlesRef.current.length < targetCount) {
            particlesRef.current.push(new Particle())
        }
        while (particlesRef.current.length > targetCount) {
            particlesRef.current.pop()
        }

        let animationFrameId: number
        const animate = () => {
            // Efecto de desvanecimiento suave
            const fadeAlpha = Math.max(0.2 - (combo * 0.001), 0.05)
            const r = 10
            const g = 10
            const b = 10
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeAlpha})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach(particle => {
                particle.update()
                particle.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [combo])

    return <canvas ref={canvasRef} className="disco-background" />
} 
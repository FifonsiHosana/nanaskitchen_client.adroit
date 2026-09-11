import { useEffect } from "react"
import Antigravity from "./antigravity"

export function WelcomePage() {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Antigravity fills the entire background */}
      <div
        className="overflow-hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
      <Antigravity
        count={1500}
        magnetRadius={5}
        ringRadius={19}
        waveSpeed={3.4}
        waveAmplitude={1.6}
        particleSize={2}
        lerpSpeed={0.05}
        color="#ec3326"
        autoAnimate
        particleVariance={1}
        rotationSpeed={0}
        depthFactor={5}
        pulseSpeed={3}
        particleShape="capsule"
        fieldStrength={14.8}
        style={{ width: "100%", height: "100%" }}
      />
      </div>


      {/* Welcome content on top */}
      <div className="relative z-1 space-y-7 text-center align-text-top">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to Nana's Innovations
        </h1>
        <p className="text-lg text-muted-foreground">
          Your admin portal is ready.
        </p>
      </div>
    </div>
  )
}

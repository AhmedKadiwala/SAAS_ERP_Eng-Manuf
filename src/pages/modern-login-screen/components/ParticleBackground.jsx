import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    const particles = particlesRef?.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas?.width,
      y: Math.random() * canvas?.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${Math.random() * 60 + 220}, 70%, 70%)`
    });

    const initParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(50, Math.floor(canvas?.width * canvas?.height / 15000));
      for (let i = 0; i < particleCount; i++) {
        particles?.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles?.forEach(particle => {
        particle.x += particle?.speedX;
        particle.y += particle?.speedY;

        if (particle?.x < 0 || particle?.x > canvas?.width) particle.speedX *= -1;
        if (particle?.y < 0 || particle?.y > canvas?.height) particle.speedY *= -1;

        particle.opacity += (Math.random() - 0.5) * 0.02;
        particle.opacity = Math.max(0.1, Math.min(0.7, particle?.opacity));
      });
    };

    const drawParticles = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      particles?.forEach(particle => {
        ctx?.beginPath();
        ctx?.arc(particle?.x, particle?.y, particle?.size, 0, Math.PI * 2);
        ctx.fillStyle = particle?.color?.replace(')', `, ${particle?.opacity})`)?.replace('hsl', 'hsla');
        ctx?.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle?.color;
        ctx?.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections
      particles?.forEach((particle, i) => {
        particles?.slice(i + 1)?.forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle?.x - otherParticle?.x, 2) + 
            Math.pow(particle?.y - otherParticle?.y, 2)
          );

          if (distance < 100) {
            ctx?.beginPath();
            ctx?.moveTo(particle?.x, particle?.y);
            ctx?.lineTo(otherParticle?.x, otherParticle?.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx?.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    />
  );
};

export default ParticleBackground;
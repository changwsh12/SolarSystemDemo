import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  nameEn: string;
  color: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // visual orbit radius in pixels
  actualRadius: number; // actual radius in km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  speed: number; // relative speed factor
  description: string;
  ringColor?: string;
}

const planets: Planet[] = [
  {
    name: '水星',
    nameEn: 'Mercury',
    color: '#b5b5b5',
    radius: 4,
    orbitRadius: 60,
    actualRadius: 2439,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    speed: 4.15,
    description: '太陽系中最小的行星，也是距離太陽最近的行星。表面溫度變化極大。',
  },
  {
    name: '金星',
    nameEn: 'Venus',
    color: '#e8cda0',
    radius: 7,
    orbitRadius: 95,
    actualRadius: 6052,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    speed: 1.62,
    description: '太陽系中最熱的行星，擁有濃密的大氣層。大小與地球相近，被稱為地球的「姊妹星」。',
  },
  {
    name: '地球',
    nameEn: 'Earth',
    color: '#4da6ff',
    radius: 7,
    orbitRadius: 130,
    actualRadius: 6371,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    speed: 1.0,
    description: '我們的家園，太陽系中唯一已知存在生命的行星。擁有液態水和適宜的大氣層。',
  },
  {
    name: '火星',
    nameEn: 'Mars',
    color: '#e04040',
    radius: 5,
    orbitRadius: 170,
    actualRadius: 3390,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    speed: 0.53,
    description: '被稱為「紅色星球」，表面富含氧化鐵。擁有太陽系最高的山峰——奧林帕斯山。',
  },
  {
    name: '木星',
    nameEn: 'Jupiter',
    color: '#c88b3a',
    radius: 16,
    orbitRadius: 230,
    actualRadius: 69911,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    speed: 0.084,
    description: '太陽系中最大的行星，是一顆氣態巨行星。著名的大紅斑是一個持續數百年的巨大風暴。',
  },
  {
    name: '土星',
    nameEn: 'Saturn',
    color: '#e8d082',
    radius: 14,
    orbitRadius: 290,
    actualRadius: 58232,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    speed: 0.034,
    description: '以壯觀的環系統聞名，主要由冰和岩石碎片組成。密度低於水。',
    ringColor: '#d4b86a',
  },
  {
    name: '天王星',
    nameEn: 'Uranus',
    color: '#7de8e8',
    radius: 10,
    orbitRadius: 345,
    actualRadius: 25362,
    distanceFromSun: 2871,
    orbitalPeriod: 30687,
    speed: 0.012,
    description: '一顆冰巨行星，自轉軸幾乎平躺在軌道面上。擁有淡藍色的外觀。',
  },
  {
    name: '海王星',
    nameEn: 'Neptune',
    color: '#4466ff',
    radius: 10,
    orbitRadius: 395,
    actualRadius: 24622,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    speed: 0.006,
    description: '太陽系中距離太陽最遠的行星。擁有太陽系中最強的風，風速可達每小時2100公里。',
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const lastTimeRef = useRef<number>(0);
  const planetPositionsRef = useRef<{ name: string; x: number; y: number; radius: number }[]>([]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    drawStars(ctx, width, height);

    // Draw orbit paths
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hoveredPlanet === planet.name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = hoveredPlanet === planet.name ? 1.5 : 0.5;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, '#ff660044');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 25, centerX, centerY, 55);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    const positions: { name: string; x: number; y: number; radius: number }[] = [];
    planets.forEach((planet) => {
      const angle = timeRef.current * planet.speed * 0.01;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;

      positions.push({ name: planet.name, x, y, radius: planet.radius });

      // Planet glow
      const planetGlow = ctx.createRadialGradient(x, y, planet.radius * 0.5, x, y, planet.radius * 2);
      planetGlow.addColorStop(0, planet.color + '44');
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      const bodyGradient = ctx.createRadialGradient(x - planet.radius * 0.3, y - planet.radius * 0.3, 0, x, y, planet.radius);
      bodyGradient.addColorStop(0, lightenColor(planet.color, 40));
      bodyGradient.addColorStop(0.7, planet.color);
      bodyGradient.addColorStop(1, darkenColor(planet.color, 40));
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      // Saturn's ring
      if (planet.ringColor) {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2, planet.radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = planet.ringColor + 'aa';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Planet name label (show on hover or always for larger planets)
      if (hoveredPlanet === planet.name || planet.radius >= 10) {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.radius - 8);
      }
    });

    planetPositionsRef.current = positions;
  }, [hoveredPlanet]);

  const drawStars = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Use a seeded approach for consistent stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const seed = i * 9301 + 49297;
      const x = (seed % 233280) / 233280 * width;
      const y = ((seed * 7) % 233280) / 233280 * height;
      const size = ((seed * 13) % 100) / 100 * 1.5 + 0.3;
      const alpha = ((seed * 17) % 100) / 100 * 0.5 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    if (isPlaying) {
      const delta = (timestamp - lastTimeRef.current) * speed;
      timeRef.current += delta * 0.06;
    }
    lastTimeRef.current = timestamp;

    draw(ctx, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw, isPlaying, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clicked = false;
    for (const pos of planetPositionsRef.current) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist <= pos.radius + 5) {
        const planet = planets.find(p => p.name === pos.name);
        if (planet) {
          setSelectedPlanet(planet);
          clicked = true;
          break;
        }
      }
    }

    if (!clicked) {
      setSelectedPlanet(null);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/solar-system.html');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'solar-system.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open('/solar-system.html', '_blank');
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const pos of planetPositionsRef.current) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist <= pos.radius + 5) {
        setHoveredPlanet(pos.name);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }
    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-[#0d1b3e] to-[#1a0d3e] border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            🌌 互動式太陽系學習演示
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">點擊行星查看詳細資訊 | 使用控制項調整速度</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 text-sm transition-colors"
          title="下載獨立 HTML 檔案"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden md:inline">下載獨立 HTML</span>
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />
          
          {/* Speed controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isPlaying ? '暫停' : '播放'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">速度</span>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 md:w-32 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-lg"
              />
              <span className="text-white text-xs font-mono w-10 text-center">{speed.toFixed(1)}x</span>
            </div>

            <button
              onClick={() => setSpeed(1)}
              className="text-xs text-white/60 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              title="重置速度"
            >
              重置
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full md:w-80 flex-shrink-0 bg-[#0d1025]/95 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
          {selectedPlanet ? (
            <div className="p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full shadow-lg"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color}, ${darkenColor(selectedPlanet.color, 40)})`,
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
                    <p className="text-xs text-gray-400">{selectedPlanet.nameEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                {selectedPlanet.description}
              </p>

              <div className="space-y-3">
                <InfoCard
                  icon="📏"
                  label="半徑"
                  value={`${selectedPlanet.actualRadius.toLocaleString()} 公里`}
                />
                <InfoCard
                  icon="☀️"
                  label="與太陽的距離"
                  value={`${selectedPlanet.distanceFromSun.toLocaleString()} 百萬公里`}
                />
                <InfoCard
                  icon="🔄"
                  label="公轉週期"
                  value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                />
                <InfoCard
                  icon="⚡"
                  label="相對速度"
                  value={`${selectedPlanet.speed.toFixed(3)}x (地球 = 1x)`}
                />
              </div>
            </div>
          ) : (
            <div className="p-5">
              <h2 className="text-lg font-bold text-white mb-4">🪐 太陽系行星</h2>
              <p className="text-sm text-gray-400 mb-4">點擊畫布上的行星查看詳細資訊</p>
              <div className="space-y-2">
                {planets.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => setSelectedPlanet(planet)}
                    onMouseEnter={() => setHoveredPlanet(planet.name)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      hoveredPlanet === planet.name
                        ? 'bg-white/10 border border-white/20'
                        : 'bg-white/5 border border-transparent hover:bg-white/8'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 30)}, ${planet.color})`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{planet.name}</div>
                      <div className="text-xs text-gray-500">{planet.nameEn}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {planet.distanceFromSun < 1000 ? `${planet.distanceFromSun} 百萬km` : `${(planet.distanceFromSun / 1000).toFixed(1)} 十億km`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-white mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} 地球日`;
  }
  const years = days / 365.25;
  if (years < 2) {
    return `${days.toLocaleString()} 地球日 (${years.toFixed(2)} 年)`;
  }
  return `${years.toFixed(1)} 地球年 (${days.toLocaleString()} 日)`;
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

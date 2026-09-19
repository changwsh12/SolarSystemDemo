import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  nameEn: string;
  color: string;
  radius: number;
  orbitRadius: number;
  actualRadius: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  speed: number;
  description: string;
  ringColor?: string;
}

const planets: Planet[] = [
  { name: '水星', nameEn: 'Mercury', color: '#b5b5b5', radius: 4, orbitRadius: 60, actualRadius: 2439, distanceFromSun: 57.9, orbitalPeriod: 88, speed: 4.15, description: '太陽系中最小的行星，也是距離太陽最近的行星。表面溫度變化極大，白天可達430°C，夜晚降至-180°C。' },
  { name: '金星', nameEn: 'Venus', color: '#e8cda0', radius: 7, orbitRadius: 95, actualRadius: 6052, distanceFromSun: 108.2, orbitalPeriod: 225, speed: 1.62, description: '太陽系中最熱的行星，擁有濃密的二氧化碳大氣層。大小與地球相近，被稱為地球的「姊妹星」。' },
  { name: '地球', nameEn: 'Earth', color: '#4da6ff', radius: 7, orbitRadius: 130, actualRadius: 6371, distanceFromSun: 149.6, orbitalPeriod: 365, speed: 1.0, description: '我們的家園，太陽系中唯一已知存在生命的行星。擁有液態水和適宜的大氣層，表面71%被水覆蓋。' },
  { name: '火星', nameEn: 'Mars', color: '#e04040', radius: 5, orbitRadius: 170, actualRadius: 3390, distanceFromSun: 227.9, orbitalPeriod: 687, speed: 0.53, description: '被稱為「紅色星球」，表面富含氧化鐵。擁有太陽系最高的山峰——奧林帕斯山，高達21.9公里。' },
  { name: '木星', nameEn: 'Jupiter', color: '#c88b3a', radius: 16, orbitRadius: 230, actualRadius: 69911, distanceFromSun: 778.5, orbitalPeriod: 4333, speed: 0.084, description: '太陽系中最大的行星，是一顆氣態巨行星。著名的大紅斑是一個持續數百年的巨大風暴系統。' },
  { name: '土星', nameEn: 'Saturn', color: '#e8d082', radius: 14, orbitRadius: 290, actualRadius: 58232, distanceFromSun: 1434, orbitalPeriod: 10759, speed: 0.034, description: '以壯觀的環系統聞名，主要由冰和岩石碎片組成。密度低於水，是太陽系密度最低的行星。', ringColor: '#d4b86a' },
  { name: '天王星', nameEn: 'Uranus', color: '#7de8e8', radius: 10, orbitRadius: 345, actualRadius: 25362, distanceFromSun: 2871, orbitalPeriod: 30687, speed: 0.012, description: '一顆冰巨行星，自轉軸幾乎平躺在軌道面上，像是「躺著」公轉。擁有淡藍色的外觀。' },
  { name: '海王星', nameEn: 'Neptune', color: '#4466ff', radius: 10, orbitRadius: 395, actualRadius: 24622, distanceFromSun: 4495, orbitalPeriod: 60190, speed: 0.006, description: '太陽系中距離太陽最遠的行星。擁有太陽系中最強的風，風速可達每小時2,100公里。' },
];

// 完整的獨立 HTML 內容（用於複製/下載）
function getStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>互動式太陽系學習演示</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#app{width:100%;height:100%;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei","PingFang TC",sans-serif}
body{background:#0a0a1a;color:#fff}
#app{display:flex;flex-direction:column}
.hdr{flex-shrink:0;padding:12px 24px;background:linear-gradient(to right,#0d1b3e,#1a0d3e);border-bottom:1px solid rgba(255,255,255,.1)}
.hdr h1{font-size:1.3rem;font-weight:700;letter-spacing:1px}
.hdr p{font-size:.75rem;color:#9ca3af;margin-top:2px}
.main{display:flex;flex:1;overflow:hidden}
.cw{flex:1;position:relative;min-width:0}
.cw canvas{display:block;width:100%;height:100%}
.ctrl{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background:rgba(0,0,0,.6);backdrop-filter:blur(12px);border-radius:9999px;padding:8px 20px;border:1px solid rgba(255,255,255,.1)}
.bp{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;transition:background .2s}
.bp:hover{background:rgba(255,255,255,.2)}
.bp svg{width:16px;height:16px;fill:currentColor}
.sg{display:flex;align-items:center;gap:8px}
.sl{font-size:.7rem;color:rgba(255,255,255,.6)}
.sv{font-size:.7rem;color:#fff;font-family:monospace;width:36px;text-align:center}
input[type=range]{-webkit-appearance:none;appearance:none;width:120px;height:6px;background:rgba(255,255,255,.2);border-radius:3px;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#60a5fa;border:none}
input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#60a5fa;border:none;cursor:pointer}
.br{font-size:.7rem;color:rgba(255,255,255,.6);padding:4px 8px;border-radius:4px;background:rgba(255,255,255,.05);border:none;cursor:pointer;transition:all .2s}
.br:hover{color:#fff;background:rgba(255,255,255,.1)}
.pnl{width:320px;flex-shrink:0;background:rgba(13,16,37,.95);border-left:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px}
.pnl h2{font-size:1.1rem;font-weight:700;margin-bottom:16px}
.dsc{font-size:.85rem;color:#d1d5db;line-height:1.6;margin-bottom:20px}
.ph{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.pd{width:40px;height:40px;border-radius:50%;flex-shrink:0}
.ph h2{margin-bottom:0;font-size:1.25rem}
.ph .sub{font-size:.7rem;color:#9ca3af}
.bc{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;padding:4px;transition:color .2s}
.bc:hover{color:#fff}
.ic{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.05);margin-bottom:10px}
.ic .ii{font-size:1.1rem}
.ic .il{font-size:.7rem;color:#9ca3af}
.ic .iv{font-size:.85rem;font-weight:500;margin-top:2px}
.pl{display:flex;flex-direction:column;gap:6px}
.pi{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid transparent;cursor:pointer;transition:all .2s;text-align:left;width:100%;color:#fff;font-family:inherit}
.pi:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15)}
.pi .dt{width:24px;height:24px;border-radius:50%;flex-shrink:0}
.pi .inf{flex:1;min-width:0}
.pi .nm{font-size:.85rem;font-weight:500}
.pi .en{font-size:.7rem;color:#6b7280}
.pi .ds{font-size:.7rem;color:#9ca3af}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:rgba(255,255,255,.05)}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fi .3s ease-out}
@media(max-width:768px){.main{flex-direction:column}.pnl{width:100%;max-height:45vh;border-left:none;border-top:1px solid rgba(255,255,255,.1)}.hdr h1{font-size:1.1rem}input[type=range]{width:80px}}
</style>
</head>
<body>
<div id="app">
<header class="hdr"><h1>🌌 互動式太陽系學習演示</h1><p>點擊行星查看詳細資訊 | 使用控制項調整速度</p></header>
<div class="main">
<div class="cw"><canvas id="c"></canvas>
<div class="ctrl">
<button class="bp" id="bP"><svg id="iPa" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><svg id="iPl" viewBox="0 0 24 24" style="display:none"><polygon points="5,3 19,12 5,21"/></svg></button>
<div class="sg"><span class="sl">速度</span><input type="range" id="sS" min="0.1" max="10" step="0.1" value="1"/><span class="sv" id="sV">1.0x</span></div>
<button class="br" id="bR">重置</button>
</div></div>
<div class="pnl" id="pnl"></div>
</div></div>
<script>
var P=[
{name:"水星",nameEn:"Mercury",color:"#b5b5b5",radius:4,orbitRadius:60,actualRadius:2439,distanceFromSun:57.9,orbitalPeriod:88,speed:4.15,desc:"太陽系中最小的行星，也是距離太陽最近的行星。表面溫度變化極大，白天可達430°C，夜晚降至-180°C。"},
{name:"金星",nameEn:"Venus",color:"#e8cda0",radius:7,orbitRadius:95,actualRadius:6052,distanceFromSun:108.2,orbitalPeriod:225,speed:1.62,desc:"太陽系中最熱的行星，擁有濃密的二氧化碳大氣層。大小與地球相近，被稱為地球的「姊妹星」。"},
{name:"地球",nameEn:"Earth",color:"#4da6ff",radius:7,orbitRadius:130,actualRadius:6371,distanceFromSun:149.6,orbitalPeriod:365,speed:1,desc:"我們的家園，太陽系中唯一已知存在生命的行星。擁有液態水和適宜的大氣層，表面71%被水覆蓋。"},
{name:"火星",nameEn:"Mars",color:"#e04040",radius:5,orbitRadius:170,actualRadius:3390,distanceFromSun:227.9,orbitalPeriod:687,speed:.53,desc:"被稱為「紅色星球」，表面富含氧化鐵。擁有太陽系最高的山峰——奧林帕斯山，高達21.9公里。"},
{name:"木星",nameEn:"Jupiter",color:"#c88b3a",radius:16,orbitRadius:230,actualRadius:69911,distanceFromSun:778.5,orbitalPeriod:4333,speed:.084,desc:"太陽系中最大的行星，是一顆氣態巨行星。著名的大紅斑是一個持續數百年的巨大風暴系統。"},
{name:"土星",nameEn:"Saturn",color:"#e8d082",radius:14,orbitRadius:290,actualRadius:58232,distanceFromSun:1434,orbitalPeriod:10759,speed:.034,desc:"以壯觀的環系統聞名，主要由冰和岩石碎片組成。密度低於水，是太陽系密度最低的行星。",ringColor:"#d4b86a"},
{name:"天王星",nameEn:"Uranus",color:"#7de8e8",radius:10,orbitRadius:345,actualRadius:25362,distanceFromSun:2871,orbitalPeriod:30687,speed:.012,desc:"一顆冰巨行星，自轉軸幾乎平躺在軌道面上，像是「躺著」公轉。擁有淡藍色的外觀。"},
{name:"海王星",nameEn:"Neptune",color:"#4466ff",radius:10,orbitRadius:395,actualRadius:24622,distanceFromSun:4495,orbitalPeriod:60190,speed:.006,desc:"太陽系中距離太陽最遠的行星。擁有太陽系中最強的風，風速可達每小時2,100公里。"}
];
var ip=true,sp=1,t=0,lt=0,sel=null,hov=null,pp=[];
var cv=document.getElementById("c"),cx=cv.getContext("2d");
function rs(){var w=cv.parentElement;cv.width=w.clientWidth;cv.height=w.clientHeight}
rs();window.addEventListener("resize",rs);
var st=[];for(var i=0;i<200;i++){var sd=i*9301+49297;st.push({x:(sd%233280)/233280,y:((sd*7)%233280)/233280,sz:((sd*13)%100)/100*1.5+.3,a:((sd*17)%100)/100*.5+.3})}
function lc(h,a){var n=parseInt(h.replace("#",""),16),r=Math.min(255,(n>>16)+a),g=Math.min(255,((n>>8)&255)+a),b=Math.min(255,(n&255)+a);return"#"+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function dc(h,a){var n=parseInt(h.replace("#",""),16),r=Math.max(0,(n>>16)-a),g=Math.max(0,((n>>8)&255)-a),b=Math.max(0,(n&255)-a);return"#"+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function fp(d){if(d<365)return d+" 地球日";var y=d/365.25;if(y<2)return d.toLocaleString()+" 地球日 ("+y.toFixed(2)+" 年)";return y.toFixed(1)+" 地球年 ("+d.toLocaleString()+" 日)"}
function draw(){var w=cv.width,h=cv.height,mx=w/2,my=h/2;
cx.fillStyle="#0a0a1a";cx.fillRect(0,0,w,h);
st.forEach(function(s){cx.beginPath();cx.arc(s.x*w,s.y*h,s.sz,0,Math.PI*2);cx.fillStyle="rgba(255,255,255,"+s.a+")";cx.fill()});
P.forEach(function(p){cx.beginPath();cx.arc(mx,my,p.orbitRadius,0,Math.PI*2);cx.strokeStyle=hov===p.name?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.08)";cx.lineWidth=hov===p.name?1.5:.5;cx.stroke()});
var sg=cx.createRadialGradient(mx,my,0,mx,my,30);sg.addColorStop(0,"#fff7a0");sg.addColorStop(.3,"#ffdd44");sg.addColorStop(.7,"#ff9900");sg.addColorStop(1,"rgba(255,102,0,.27)");cx.beginPath();cx.arc(mx,my,30,0,Math.PI*2);cx.fillStyle=sg;cx.fill();
var gg=cx.createRadialGradient(mx,my,25,mx,my,55);gg.addColorStop(0,"rgba(255,200,50,.3)");gg.addColorStop(1,"rgba(255,200,50,0)");cx.beginPath();cx.arc(mx,my,55,0,Math.PI*2);cx.fillStyle=gg;cx.fill();
pp=[];P.forEach(function(p){var a=t*p.speed*.01,x=mx+Math.cos(a)*p.orbitRadius,y=my+Math.sin(a)*p.orbitRadius;pp.push({name:p.name,x:x,y:y,r:p.radius});
var pg=cx.createRadialGradient(x,y,p.radius*.5,x,y,p.radius*2);pg.addColorStop(0,p.color+"44");pg.addColorStop(1,"transparent");cx.beginPath();cx.arc(x,y,p.radius*2,0,Math.PI*2);cx.fillStyle=pg;cx.fill();
var bg=cx.createRadialGradient(x-p.radius*.3,y-p.radius*.3,0,x,y,p.radius);bg.addColorStop(0,lc(p.color,40));bg.addColorStop(.7,p.color);bg.addColorStop(1,dc(p.color,40));cx.beginPath();cx.arc(x,y,p.radius,0,Math.PI*2);cx.fillStyle=bg;cx.fill();
if(p.ringColor){cx.beginPath();cx.ellipse(x,y,p.radius*2,p.radius*.5,.3,0,Math.PI*2);cx.strokeStyle=p.ringColor+"aa";cx.lineWidth=2.5;cx.stroke()}
if(hov===p.name||p.radius>=10){cx.font="11px sans-serif";cx.fillStyle="rgba(255,255,255,.8)";cx.textAlign="center";cx.fillText(p.name,x,y-p.radius-8)}})}
function anim(ts){if(lt===0)lt=ts;if(ip)t+=(ts-lt)*sp*.06;lt=ts;draw();requestAnimationFrame(anim)}
requestAnimationFrame(anim);
cv.addEventListener("click",function(e){var r=cv.getBoundingClientRect(),ex=e.clientX-r.left,ey=e.clientY-r.top;var f=null;for(var i=0;i<pp.length;i++){var p=pp[i];if(Math.sqrt((ex-p.x)*(ex-p.x)+(ey-p.y)*(ey-p.y))<=p.r+8){f=null;for(var j=0;j<P.length;j++){if(P[j].name===p.name){f=P[j];break}}break}}sel=f;rp()});
cv.addEventListener("mousemove",function(e){var r=cv.getBoundingClientRect(),ex=e.clientX-r.left,ey=e.clientY-r.top;var f=null;for(var i=0;i<pp.length;i++){var p=pp[i];if(Math.sqrt((ex-p.x)*(ex-p.x)+(ey-p.y)*(ey-p.y))<=p.r+8){f=p.name;cv.style.cursor="pointer";break}}if(!f)cv.style.cursor="default";hov=f});
document.getElementById("bP").addEventListener("click",function(){ip=!ip;document.getElementById("iPa").style.display=ip?"block":"none";document.getElementById("iPl").style.display=ip?"none":"block"});
document.getElementById("sS").addEventListener("input",function(){sp=parseFloat(this.value);document.getElementById("sV").textContent=sp.toFixed(1)+"x"});
document.getElementById("bR").addEventListener("click",function(){sp=1;document.getElementById("sS").value=1;document.getElementById("sV").textContent="1.0x"});
function rp(){var el=document.getElementById("pnl");if(sel){var p=sel,ds=p.distanceFromSun<1000?p.distanceFromSun+" 百萬公里":(p.distanceFromSun/1000).toFixed(1)+" 十億公里";
el.innerHTML='<div class="fi"><div class="ph"><div class="pd" style="background:radial-gradient(circle at 35% 35%,'+lc(p.color,40)+","+p.color+","+dc(p.color,40)+')"></div><div><h2>'+p.name+"</h2>"+'<div class="sub">'+p.nameEn+'</div></div><button class="bc" id="bC"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div><p class="dsc">'+p.desc+'</p><div class="ic"><span class="ii">📏</span><div><div class="il">半徑</div><div class="iv">'+p.actualRadius.toLocaleString()+' 公里</div></div></div><div class="ic"><span class="ii">☀️</span><div><div class="il">與太陽的距離</div><div class="iv">'+ds+'</div></div></div><div class="ic"><span class="ii">🔄</span><div><div class="il">公轉週期</div><div class="iv">'+fp(p.orbitalPeriod)+'</div></div></div><div class="ic"><span class="ii">⚡</span><div><div class="il">相對速度</div><div class="iv">'+p.speed.toFixed(3)+"x (地球 = 1x)</div></div></div></div>";
document.getElementById("bC").addEventListener("click",function(){sel=null;rp()})}else{var h='<h2>🪐 太陽系行星</h2><p style="font-size:.8rem;color:#9ca3af;margin-bottom:16px">點擊畫布上的行星查看詳細資訊</p><div class="pl">';
P.forEach(function(p){var ds=p.distanceFromSun<1000?p.distanceFromSun+" 百萬km":(p.distanceFromSun/1000).toFixed(1)+" 十億km";h+='<button class="pi" data-n="'+p.name+'"><div class="dt" style="background:radial-gradient(circle at 35% 35%,'+lc(p.color,30)+","+p.color+')"></div><div class="inf"><div class="nm">'+p.name+'</div><div class="en">'+p.nameEn+'</div></div><div class="ds">'+ds+"</div></button>"});
h+="</div>";el.innerHTML=h;el.querySelectorAll(".pi").forEach(function(b){b.addEventListener("click",function(){var n=this.getAttribute("data-n");for(var i=0;i<P.length;i++){if(P[i].name===n){sel=P[i];break}}rp()});b.addEventListener("mouseenter",function(){hov=this.getAttribute("data-n")});b.addEventListener("mouseleave",function(){hov=null})})}}
rp();
</script>
</body>
</html>`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const planetPositionsRef = useRef<{ name: string; x: number; y: number; radius: number }[]>([]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 200; i++) {
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

    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hoveredPlanet === planet.name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = hoveredPlanet === planet.name ? 1.5 : 0.5;
      ctx.stroke();
    });

    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, '#ff660044');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    const glowGradient = ctx.createRadialGradient(centerX, centerY, 25, centerX, centerY, 55);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    const positions: { name: string; x: number; y: number; radius: number }[] = [];
    planets.forEach((planet) => {
      const angle = timeRef.current * planet.speed * 0.01;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;
      positions.push({ name: planet.name, x, y, radius: planet.radius });

      const planetGlow = ctx.createRadialGradient(x, y, planet.radius * 0.5, x, y, planet.radius * 2);
      planetGlow.addColorStop(0, planet.color + '44');
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      const bodyGradient = ctx.createRadialGradient(x - planet.radius * 0.3, y - planet.radius * 0.3, 0, x, y, planet.radius);
      bodyGradient.addColorStop(0, lightenColor(planet.color, 40));
      bodyGradient.addColorStop(0.7, planet.color);
      bodyGradient.addColorStop(1, darkenColor(planet.color, 40));
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      if (planet.ringColor) {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2, planet.radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = planet.ringColor + 'aa';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      if (hoveredPlanet === planet.name || planet.radius >= 10) {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.radius - 8);
      }
    });

    planetPositionsRef.current = positions;
  }, [hoveredPlanet]);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
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
      if (dist <= pos.radius + 8) {
        const planet = planets.find(p => p.name === pos.name);
        if (planet) {
          setSelectedPlanet(planet);
          clicked = true;
          break;
        }
      }
    }
    if (!clicked) setSelectedPlanet(null);
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
      if (dist <= pos.radius + 8) {
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

  // 複製 HTML 到剪貼簿
  const handleCopyHtml = async () => {
    const html = getStandaloneHtml();
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // 備用方案：用 textarea 複製
      const textarea = document.createElement('textarea');
      textarea.value = html;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // 用 data URI 開啟新分頁
  const handleOpenInNewTab = () => {
    const html = getStandaloneHtml();
    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    window.open(dataUri, '_blank');
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      <header className="flex-shrink-0 px-4 md:px-6 py-3 bg-gradient-to-r from-[#0d1b3e] to-[#1a0d3e] border-b border-white/10 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-white tracking-wide truncate">
            🌌 互動式太陽系學習演示
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 truncate">點擊行星查看詳細資訊 | 使用控制項調整速度</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopyHtml}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
              copied
                ? 'bg-green-500/30 border-green-400/50 text-green-200'
                : 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 text-blue-300'
            }`}
            title="複製完整 HTML 到剪貼簿，貼到記事本存成 .html"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden md:inline">已複製！</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="hidden md:inline">複製 HTML</span>
              </>
            )}
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 text-sm transition-colors"
            title="在新分頁開啟，按 Ctrl+S 儲存"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="hidden md:inline">新分頁開啟</span>
          </button>
        </div>
      </header>

      {/* 提示列 */}
      {copied && (
        <div className="flex-shrink-0 px-4 py-2 bg-green-900/50 border-b border-green-500/30 text-green-200 text-sm text-center animate-fade-in">
          ✅ 已複製到剪貼簿！請開啟記事本 → 貼上 → 另存新檔 → 檔名改為 <code className="bg-black/30 px-1.5 py-0.5 rounded">solar-system.html</code>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />

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
            >
              重置
            </button>
          </div>
        </div>

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
                <button onClick={() => setSelectedPlanet(null)} className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-5">{selectedPlanet.description}</p>

              <div className="space-y-3">
                <InfoCard icon="📏" label="半徑" value={`${selectedPlanet.actualRadius.toLocaleString()} 公里`} />
                <InfoCard icon="☀️" label="與太陽的距離" value={`${selectedPlanet.distanceFromSun.toLocaleString()} 百萬公里`} />
                <InfoCard icon="🔄" label="公轉週期" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
                <InfoCard icon="⚡" label="相對速度" value={`${selectedPlanet.speed.toFixed(3)}x (地球 = 1x)`} />
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

              {/* 取得單一 HTML 說明 */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <h3 className="text-sm font-bold text-blue-300 mb-2">💾 如何取得單一 HTML 檔案</h3>
                <div className="text-xs text-gray-300 space-y-2">
                  <p><strong className="text-white">方法一：複製 HTML</strong></p>
                  <p className="text-gray-400 pl-2">1. 點擊上方「複製 HTML」按鈕<br/>2. 開啟記事本<br/>3. 貼上內容<br/>4. 另存新檔 → 檔名改為 <code className="bg-black/30 px-1 rounded">solar-system.html</code></p>
                  <p className="mt-2"><strong className="text-white">方法二：新分頁開啟</strong></p>
                  <p className="text-gray-400 pl-2">1. 點擊上方「新分頁開啟」按鈕<br/>2. 在新分頁按 Ctrl+S (Cmd+S)<br/>3. 儲存類型選「網頁，全部」改為「所有檔案」<br/>4. 檔名改為 <code className="bg-black/30 px-1 rounded">solar-system.html</code></p>
                </div>
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
  if (days < 365) return `${days} 地球日`;
  const years = days / 365.25;
  if (years < 2) return `${days.toLocaleString()} 地球日 (${years.toFixed(2)} 年)`;
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

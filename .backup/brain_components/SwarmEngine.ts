import { Vector3D, Perlin } from './MathUtils';
import { narrativeData } from './NeuralData';

// --- 1. ORBITAL PARTICLES (The Cloud) ---
export class Particle {
  p: Vector3D; t: Vector3D; v: Vector3D; life = 0; maxLife = 0;
  constructor(public g: Perlin, public parent: Node) {
    this.p=new Vector3D(0,0,0); this.t=new Vector3D(0,0,0); this.v=new Vector3D(0,0,0); 
    this.respawn();
  }
  respawn() {
    const spread = this.parent.isCentral ? 60 : 35;
    this.p.set(this.parent.pos.x + (Math.random()-0.5)*spread, this.parent.pos.y + (Math.random()-0.5)*spread, 0);
    this.t.set(this.p.x, this.p.y, 0);
    this.v.set(0,0,0);
    this.life=0;
    this.maxLife=100+Math.random()*300;
  }
  step() {
    this.life++;
    const xx=this.p.x/200, yy=this.p.y/200, zz=Date.now()/5000;
    this.v.x += (Math.random()-0.5)*0.1 + this.g.simplex3d(xx,yy,-zz)*0.05;
    this.v.y += (Math.random()-0.5)*0.1 + this.g.simplex3d(xx,yy,zz)*0.05;
    
    // Gentle pull back to parent
    this.v.add(this.parent.pos.clone().sub(this.p).mul(0.002)).mul(0.95);
    
    if(this.life>this.maxLife) this.respawn();
    this.p.move(this.t).add(this.v);
  }
  render(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color; 
    ctx.beginPath(); 
    ctx.arc(this.p.x, this.p.y, 0.6, 0, Math.PI*2); 
    ctx.fill();
  }
}

// --- 2. DATA STREAM (Node to Card) ---
export class StreamParticle {
  p: Vector3D; pastP: Vector3D; v: Vector3D;
  life=0; maxLife=150; arrived=false; color: {h:number,s:number,l:number,a:number}; zoff:number;
  constructor(startPos: Vector3D, public targetX: number, public targetY: number, public generator: Perlin) {
    this.p = startPos.clone(); this.pastP = startPos.clone(); this.v = new Vector3D(0,0,0);
    this.p.x += (Math.random()-0.5)*10; this.p.y += (Math.random()-0.5)*10;
    this.color = { h: 170+Math.random()*40, s: 100, l: 70, a: 0 };
    this.zoff = Math.random()*100;
  }
  step() {
    if(this.arrived) return;
    this.pastP.set(this.p.x, this.p.y, 0);
    
    const dx=this.targetX-this.p.x, dy=this.targetY-this.p.y, dist=Math.sqrt(dx*dx+dy*dy);
    
    if(dist<15 || this.life > this.maxLife) { this.arrived=true; return; }
    
    const noiseVal = this.generator.simplex3d(this.p.x*0.005, this.p.y*0.005, this.zoff);
    const angle = noiseVal * Math.PI * 4;
    this.v = new Vector3D(dx,dy,0).div(dist).mul(8).add(new Vector3D(Math.cos(angle),Math.sin(angle),0).mul(2.5)).mul(0.6);
    this.p.add(this.v);
    if(this.life<10) this.color.a+=0.1;
    this.life++; this.zoff+=0.01;
  }
  render(ctx: CanvasRenderingContext2D) {
    if(this.arrived) return;
    ctx.beginPath(); ctx.strokeStyle=`hsla(${this.color.h},${this.color.s}%,${this.color.l}%,${this.color.a})`;
    ctx.lineWidth=1.5; ctx.lineCap='round'; ctx.moveTo(this.pastP.x, this.pastP.y); ctx.lineTo(this.p.x, this.p.y); ctx.stroke();
  }
}

// --- 3. REVERSE PARTICLE (Explosion back to Node) ---
export class ReverseStreamParticle {
    p: Vector3D; pastP: Vector3D; v: Vector3D;
    life=0; maxLife=100; arrived=false; color: {h:number,s:number,l:number,a:number};
    constructor(startX: number, startY: number, public target: Vector3D) {
        this.p = new Vector3D(startX, startY, 0);
        this.pastP = this.p.clone();
        this.v = new Vector3D(0,0,0);
        this.color = { h: 140+Math.random()*40, s: 100, l: 70, a: 1 }; 
        this.v = new Vector3D((Math.random()-0.5)*15, (Math.random()-0.5)*15, 0);
    }
    step() {
        if(this.arrived) return;
        this.pastP.set(this.p.x, this.p.y, 0);
        const dx = this.target.x - this.p.x;
        const dy = this.target.y - this.p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 15) { this.arrived=true; return; }
        const dir = new Vector3D(dx, dy, 0).div(dist);
        this.v.add(dir.mul(1.5)); 
        this.v.mul(0.95); 
        this.p.add(this.v);
        this.color.a -= 0.02; 
    }
    render(ctx: CanvasRenderingContext2D) {
        if(this.arrived || this.color.a <= 0) return;
        ctx.beginPath(); ctx.strokeStyle=`hsla(${this.color.h},${this.color.s}%,${this.color.l}%,${this.color.a})`;
        ctx.lineWidth=1.5; ctx.lineCap='round'; 
        ctx.moveTo(this.pastP.x, this.pastP.y); ctx.lineTo(this.p.x, this.p.y); ctx.stroke();
    }
}

// --- 4. NODE ---
export class Node {
  pos: Vector3D; vel: Vector3D; particles: Particle[]=[]; neighbors: Node[]=[];
  isActive=false; colorHue: number; radiusBase: number; shapeOffsets: number[];
  isDragging = false; 

  constructor(x:number, y:number, public generator: Perlin, public isCentral: boolean=false) {
    this.pos=new Vector3D(x,y,0); this.vel=new Vector3D(0,0,0);
    this.colorHue=isCentral?45:170+Math.random()*50;
    this.radiusBase=isCentral?12:5+Math.random()*3;
    this.shapeOffsets=Array.from({length:8},()=>0.8+Math.random()*0.4);
    for(let i=0;i<(isCentral?100:60);i++) this.particles.push(new Particle(generator, this));
  }
  connect(nodes: Node[], maxDist: number) {
    this.neighbors = [];
    for(let other of nodes) {
      if(other===this) continue;
      if(this.isCentral || other.isCentral) { this.neighbors.push(other); continue; }
      if(this.pos.dist(other.pos)<maxDist) this.neighbors.push(other);
    }
  }
  update(width: number, height: number, allNodes: Node[]) {
    if (this.isDragging) {
         for(let p of this.particles) p.step();
         return;
    }
    const time=Date.now()*0.0005;
    const wf=this.isCentral?0.0005:0.003;
    this.vel.add(new Vector3D(this.generator.simplex3d(this.pos.x*0.002,this.pos.y*0.002,time)*wf, this.generator.simplex3d(this.pos.x*0.002,this.pos.y*0.002,time+100)*wf, 0));
    const minDist=this.isCentral?180:130;
    for(let o of allNodes) {
      if(o===this) continue;
      const d=this.pos.dist(o.pos);
      if(d<minDist && d>0) this.vel.add(this.pos.clone().sub(o.pos).div(d).mul(0.005));
      if(!this.isCentral && o.isCentral) this.vel.sub(this.pos.clone().sub(o.pos).div(d).mul(0.0005));
    }
    this.vel.mul(0.98); this.pos.add(this.vel);
    
    const safeX=560, margin=50;
    if(this.pos.x<safeX) this.vel.x+=0.08;
    if(this.pos.x>width-margin) this.vel.x-=0.05;
    if(this.pos.y<margin) this.vel.y+=0.05;
    if(this.pos.y>height-margin) this.vel.y-=0.05;
    
    for(let p of this.particles) p.step();
  }
  render(ctx: CanvasRenderingContext2D) {
    const a=0.2; 
    // Fixed alpha calculation logic here if needed, using pulseOffset if stored
    const col=this.isCentral?`hsla(${this.colorHue},90%,70%,${a})`: this.isActive ? `hsla(${this.colorHue}, 100%, 85%, ${a + 0.2})` : `hsla(${this.colorHue},80%,60%,${a})`;
    for(let p of this.particles) p.render(ctx, col);
    
    const r=this.radiusBase;
    let fill = this.isCentral ? `hsla(${this.colorHue}, 90%, 60%, 0.9)` : `hsla(${this.colorHue}, 90%, 55%, 0.9)`;
    let shadow = this.isCentral ? `hsla(${this.colorHue}, 90%, 60%, 0.7)` : `hsla(${this.colorHue}, 90%, 60%, 0.7)`;
    if (this.isActive) {
      fill = '#ffffff';
      shadow = `hsla(${this.colorHue}, 100%, 70%, 1.0)`;
      ctx.shadowBlur = 50;
    } else {
      ctx.shadowBlur = this.isCentral ? 35 : 25;
    }
    ctx.fillStyle=fill; ctx.shadowColor=shadow;
    ctx.beginPath();
    for(let i=0;i<=8;i++) {
      const ang=(i/8)*Math.PI*2, rad=r*this.shapeOffsets[i%8];
      const x=this.pos.x+Math.cos(ang)*rad, y=this.pos.y+Math.sin(ang)*rad;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.fill();
    if(!this.isActive) {
      ctx.fillStyle="#fff"; ctx.shadowBlur=10; ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, r*0.3, 0, Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur=0;
  }
  renderConnections(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth=this.isCentral?1.5:0.8;
    for(let n of this.neighbors) {
      const g=ctx.createLinearGradient(this.pos.x,this.pos.y,n.pos.x,n.pos.y);
      g.addColorStop(0,`hsla(${this.colorHue},60%,40%,0.1)`);
      g.addColorStop(0.5,`hsla(${this.colorHue},60%,40%,0.2)`);
      g.addColorStop(1,`hsla(${n.colorHue},60%,40%,0.1)`);
      ctx.strokeStyle=g; ctx.beginPath(); ctx.moveTo(this.pos.x,this.pos.y); ctx.lineTo(n.pos.x,n.pos.y); ctx.stroke();
    }
  }
  hitTest(mx:number, my:number) { return Math.sqrt((this.pos.x-mx)**2+(this.pos.y-my)**2)<(this.isCentral?50:35); }
}

// --- 5. SWARM ENGINE ---
export class SwarmEngine {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width=0; height=0;
  nodes: Node[]=[]; streamParticles: StreamParticle[]=[]; reverseParticles: ReverseStreamParticle[]=[];
  pGen=new Perlin(); activeNode: Node|null=null; 
  onNodeChange: (idx:number)=>void; 
  targetY = 0; targetX = 540; 
  isStreaming = false; linkProgress = 0;
  draggedNode: Node | null = null;
  dragStart: { x: number, y: number } | null = null;
  mouse = { x: 0, y: 0 };
  boundMouseMove: (e: MouseEvent) => void;
  boundMouseDown: (e: MouseEvent) => void;
  boundMouseUp: (e: MouseEvent) => void;
  reqId: number = 0;

  constructor(canvas: HTMLCanvasElement, onNodeChange: (idx:number)=>void) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d')!; this.onNodeChange=onNodeChange;
    this.resize();
    window.addEventListener('resize', ()=>this.resize());
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    canvas.addEventListener('mousemove', this.boundMouseMove);
    canvas.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mouseup', this.boundMouseUp);
    this.initNodes();
    this.activateNode(this.nodes[0]);
    this.animate();
  }

  dispose() {
      this.canvas.removeEventListener('mousemove', this.boundMouseMove);
      this.canvas.removeEventListener('mousedown', this.boundMouseDown);
      window.removeEventListener('mouseup', this.boundMouseUp);
      cancelAnimationFrame(this.reqId);
  }

  setStreamTarget(rect: DOMRect) {
    this.targetX = rect.right; 
    this.targetY = rect.top + rect.height / 2;
  }

  resize() {
    this.width=window.innerWidth; this.height=window.innerHeight;
    this.canvas.width=this.width; this.canvas.height=this.height;
    this.targetY = this.height / 2;
    if(this.nodes.length===0) this.initNodes();
    const dist=Math.sqrt(this.width*this.height)*0.25;
    for(let n of this.nodes) n.connect(this.nodes, dist);
  }

  initNodes() {
    this.nodes=[];
    const safeX=560; 
    this.nodes.push(new Node(safeX+(this.width-safeX)*0.4, this.height*0.5, this.pGen, true));
    for(let i=1;i<20;i++) {
      this.nodes.push(new Node(safeX+Math.random()*(this.width-safeX-50), this.height*0.1+Math.random()*(this.height*0.8), this.pGen));
    }
    this.resize(); 
  }

  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    if (this.draggedNode) {
        this.draggedNode.pos.x = this.mouse.x;
        this.draggedNode.pos.y = this.mouse.y;
        this.draggedNode.vel.set(0, 0, 0); 
        this.canvas.style.cursor = 'grabbing';
    } else {
        let hit = false;
        for (let n of this.nodes) {
            if (n.hitTest(this.mouse.x, this.mouse.y)) {
                hit = true;
                break;
            }
        }
        this.canvas.style.cursor = hit ? 'pointer' : 'default';
    }
  }

  handleMouseDown(e: MouseEvent) {
    const rect=this.canvas.getBoundingClientRect(); const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    for(let n of this.nodes) {
      if(n.hitTest(mx, my)) { 
          this.draggedNode = n;
          n.isDragging = true;
          this.dragStart = { x: mx, y: my };
          break; 
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
      if (this.draggedNode && this.dragStart) {
          const dx = this.mouse.x - this.dragStart.x;
          const dy = this.mouse.y - this.dragStart.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 5) {
              this.activateNode(this.draggedNode);
          }
          this.draggedNode.isDragging = false;
          this.draggedNode = null;
          this.dragStart = null;
          this.canvas.style.cursor = 'default';
      }
  }

  activateNode(node: Node) {
    if(this.activeNode) this.activeNode.isActive=false;
    this.activeNode=node; this.activeNode.isActive=true;
    this.isStreaming = true; 
    this.linkProgress = 0; 
    this.onNodeChange(this.nodes.indexOf(node)%narrativeData.length);
    for(let i=0; i<10; i++) {
        this.streamParticles.push(new StreamParticle(node.pos, this.targetX, this.targetY, this.pGen));
    }
  }
  
  stopStream() {
      this.isStreaming = false;
  }
  
  cycleNextNode() {
      if (this.nodes.length === 0) return;
      let currentIndex = 0;
      if (this.activeNode) {
        currentIndex = this.nodes.indexOf(this.activeNode);
      }
      const nextIndex = (currentIndex + 1) % this.nodes.length; 
      this.activateNode(this.nodes[nextIndex]);
  }

  departiclize() {
      if (this.activeNode) {
          for(let i=0; i<50; i++) {
             this.reverseParticles.push(new ReverseStreamParticle(this.targetX, this.targetY, this.activeNode.pos));
          }
      }
  }

  triggerReverseBurst() {
      if (this.activeNode) {
          for(let i=0; i<30; i++) {
             this.reverseParticles.push(new ReverseStreamParticle(this.targetX, this.targetY, this.activeNode.pos));
          }
      }
  }

  lerp(v1: Vector3D, v2: Vector3D, t: number): Vector3D {
      return new Vector3D(
          v1.x + (v2.x - v1.x) * t,
          v1.y + (v2.y - v1.y) * t,
          0
      );
  }

  animate = () => {
    this.reqId = requestAnimationFrame(this.animate);
    this.ctx.globalCompositeOperation='source-over';
    this.ctx.fillStyle='rgba(2,4,10,0.2)'; 
    this.ctx.fillRect(0,0,this.width,this.height);

    this.ctx.globalCompositeOperation='screen';
    for(let n of this.nodes) n.renderConnections(this.ctx);
    for(let n of this.nodes) { n.update(this.width, this.height, this.nodes); n.render(this.ctx); }

    if(this.activeNode) {
      if (this.isStreaming && this.linkProgress < 1) {
          this.linkProgress += 0.02; 
          if (this.linkProgress > 1) this.linkProgress = 1;
      }
      if (this.isStreaming && this.linkProgress > 0.2 && this.streamParticles.length < 300 && Math.random() < 0.8) {
         this.streamParticles.push(new StreamParticle(this.activeNode.pos, this.targetX, this.targetY, this.pGen));
      }
      if (this.linkProgress > 0) {
        const P0 = this.activeNode.pos;
        const P2 = new Vector3D(this.targetX, this.targetY, 0);
        const P1 = new Vector3D((P0.x + P2.x) / 2, P0.y, 0);
        const t = this.linkProgress;
        const Q0 = this.lerp(P0, P1, t);
        const Q1 = this.lerp(P1, P2, t);
        const R0 = this.lerp(Q0, Q1, t);

        this.ctx.beginPath();
        this.ctx.moveTo(P0.x, P0.y);
        this.ctx.quadraticCurveTo(Q0.x, Q0.y, R0.x, R0.y);
        const opacity = this.isStreaming ? 0.6 : Math.min(0.6, this.streamParticles.length / 50);
        this.ctx.shadowBlur = this.isStreaming ? 20 : 0; 
        this.ctx.shadowColor = '#4deeea';
        this.ctx.strokeStyle = `rgba(77, 238, 234, ${opacity})`;
        this.ctx.lineWidth = this.isStreaming ? 2 : 1;
        this.ctx.stroke(); 
        this.ctx.shadowBlur = 0;
        
        if (this.isStreaming && t < 1) {
              this.ctx.fillStyle = '#fff'; 
              this.ctx.shadowBlur = 10; 
              this.ctx.shadowColor = '#fff';
              this.ctx.beginPath(); 
              this.ctx.arc(R0.x, R0.y, 2, 0, Math.PI*2); 
              this.ctx.fill(); 
              this.ctx.shadowBlur = 0;
        }
      }
    }
    
    for(let i=this.streamParticles.length-1; i>=0; i--) {
      let p = this.streamParticles[i];
      p.step(); p.render(this.ctx);
      if(p.arrived) this.streamParticles.splice(i, 1);
    }

    for(let i=this.reverseParticles.length-1; i>=0; i--) {
        let p = this.reverseParticles[i];
        p.step(); p.render(this.ctx);
        if(p.arrived || p.color.a <= 0) this.reverseParticles.splice(i, 1);
    }
  }
}

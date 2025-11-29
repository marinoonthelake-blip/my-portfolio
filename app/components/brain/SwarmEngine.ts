import { Vector3D, Perlin } from './MathUtils';
import { narrativeData } from './NeuralData'; // Assuming narrativeData is correctly exported

// --- 1. PARTICLE SWARM ---
export class Particle {
  p: Vector3D; t: Vector3D; v: Vector3D; life = 0; maxLife = 0;
  constructor(public g: Perlin, public parent: Node) {
    this.p = new Vector3D(0,0,0); this.t = new Vector3D(0,0,0); this.v = new Vector3D(0,0,0);
    this.respawn();
  }
  respawn() {
    const spread = this.parent.isCentral ? 80 : (this.parent.isMinor ? 10 : 50);
    this.p.set(
        this.parent.pos.x + (Math.random()-0.5)*spread, 
        this.parent.pos.y + (Math.random()-0.5)*spread, 
        0
    );
    this.t.set(this.p.x, this.p.y, 0);
    this.v.set(0,0,0);
    this.life = 0; 
    this.maxLife = 50 + Math.random() * 150;
  }
  step() {
    this.life++;
    const xx = this.p.x / 120; 
    const yy = this.p.y / 120; 
    const zz = Date.now() / 3000;
    
    this.v.x += (Math.random()-0.5)*0.05 + this.g.simplex3d(xx, yy, -zz)*0.08;
    this.v.y += (Math.random()-0.5)*0.05 + this.g.simplex3d(xx, yy, zz)*0.08;
    this.v.add(this.parent.pos.clone().sub(this.p).mul(0.002)).mul(0.96);
    
    if (this.life > this.maxLife) this.respawn();
    this.p.move(this.t).add(this.v);
  }
  render(ctx: CanvasRenderingContext2D, color: string) {
    const alpha = this.parent.isMinor ? 0.2 : 0.6;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath(); 
    ctx.arc(this.p.x, this.p.y, this.parent.isMinor ? 0.4 : 0.8, 0, Math.PI*2); 
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

// --- 2. STREAM BEAMS ---
export class StreamParticle {
  p: Vector3D; pastP: Vector3D; v: Vector3D;
  life = 0; maxLife = 120; arrived = false; color: string;
  
  constructor(start: Vector3D, public target: Vector3D, colorType: number) {
      this.p = start.clone(); this.pastP = start.clone();
      this.v = new Vector3D(0,0,0);
      if (colorType === 2) this.color = 'rgba(239, 68, 68, 0.9)'; 
      else if (colorType === 1) this.color = 'rgba(16, 185, 129, 0.8)'; 
      else this.color = 'rgba(234, 179, 8, 0.8)'; 
  }
  step(generator: Perlin) {
      if (this.arrived) return;
      this.pastP.set(this.p.x, this.p.y, 0);
      const dx = this.target.x - this.p.x;
      const dy = this.target.y - this.p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 15) { this.arrived = true; return; }
      this.v.x = dx * 0.1 + (Math.random()-0.5);
      this.v.y = dy * 0.1 + (Math.random()-0.5);
      this.p.add(this.v);
      this.life++;
  }
  render(ctx: CanvasRenderingContext2D) {
      if (this.arrived) return;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(this.pastP.x, this.pastP.y); ctx.lineTo(this.p.x, this.p.y); ctx.stroke();
  }
}

// --- 3. NODES ---
export class Node {
  pos: Vector3D; vel: Vector3D; particles: Particle[]=[]; neighbors: Node[]=[];
  isActive = false; 
  colorHue: number; pulseOffset: number; radiusBase: number;
  shapeOffsets: number[];
  isDragging = false; 
  category: 'bio' | 'portfolio' | 'live' = 'portfolio';
  dataIndex: number = -1; 
  
  life: number = 0;
  maxLife: number = 0;

  constructor(x: number, y: number, public generator: Perlin, public isCentral: boolean = false, public isMinor: boolean = false) {
    this.pos = new Vector3D(x, y, 0);
    this.vel = new Vector3D(0, 0, 0);
    
    if (isCentral) this.colorHue = 45; 
    else if (isMinor) this.colorHue = 220; 
    else this.colorHue = 150; 

    this.pulseOffset = Math.random() * 100;
    this.radiusBase = isCentral ? 18 : (isMinor ? 2 : 10);
    this.shapeOffsets = Array.from({length: 8}, () => 0.7 + Math.random() * 0.6);
    
    if (isMinor) {
        this.life = Math.random() * 100;
        this.maxLife = 200 + Math.random() * 300;
    }
    
    const pCount = isCentral ? 100 : (this.isMinor ? 0 : 50);
    for(let i=0;i<pCount;i++) this.particles.push(new Particle(generator, this));
  }

  bindData(index: number, cat: 'bio' | 'portfolio' | 'live') {
      this.dataIndex = index;
      this.category = cat;
      if (cat === 'live') this.colorHue = 0; 
      else if (cat === 'portfolio') this.colorHue = 150; 
      else this.colorHue = 45; 
  }

  connect(nodes: Node[]) {
    this.neighbors = [];
    const maxDist = this.isMinor ? 120 : 350; 
    
    for (let other of nodes) {
      if (other === this) continue;
      const dist = this.pos.dist(other.pos);
      if (dist < maxDist) {
          this.neighbors.push(other);
          if (this.isMinor && this.neighbors.length > 5) break; 
      }
    }
  }

  update(width: number, height: number, allNodes: Node[]) {
    if (this.isDragging) {
         for(let p of this.particles) p.step();
         return;
    }

    if (this.isMinor) {
        this.life++;
        if (this.life > this.maxLife) {
            this.life = 0;
            this.maxLife = 200 + Math.random() * 300;
            const minX = 650;
            this.pos.x = minX + Math.random() * (width - minX - 50);
            this.pos.y = 50 + Math.random() * (height - 100);
            this.vel.set(0,0,0);
        }
    }

    const time = Date.now() * 0.0005;
    const noiseScale = this.isMinor ? 0.08 : 0.04;
    
    this.vel.add(new Vector3D(
        this.generator.simplex3d(this.pos.x*0.002, this.pos.y*0.002, time)*noiseScale, 
        this.generator.simplex3d(this.pos.x*0.002, this.pos.y*0.002, time+100)*noiseScale, 
        0
    ));
    
    if (!this.isMinor) {
        for (let o of allNodes) {
            if (o === this || o.isMinor) continue;
            const d = this.pos.dist(o.pos);
            if (d < 150 && d > 0) this.vel.add(this.pos.clone().sub(o.pos).div(d).mul(0.04));
        }
        
        const UI_WIDTH = 650; 
        if (this.pos.x < UI_WIDTH) { this.pos.x = UI_WIDTH; this.vel.x += 0.5; }
    }

    this.vel.mul(0.96); 
    this.pos.add(this.vel);
    
    const PADDING = 200;
    if (this.pos.x < -PADDING) this.vel.x += 0.2;
    if (this.pos.x > width + PADDING) this.vel.x -= 0.2;
    if (this.pos.y < -PADDING) this.vel.y += 0.2;
    if (this.pos.y > height + PADDING) this.vel.y -= 0.2;

    for(let p of this.particles) p.step();
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha: number) {
    const time = Date.now() / 1000;
    const pulse = Math.sin(time + this.pulseOffset) * 0.1 + 1;
    let hue = this.colorHue;
    if (this.category === 'live') hue = 0; 

    let alpha = this.isActive ? 1.0 : 0.6;
    
    if (this.isMinor) {
        const progress = this.life / this.maxLife;
        let lifeAlpha = 1;
        if (progress < 0.2) lifeAlpha = progress / 0.2;
        else if (progress > 0.8) lifeAlpha = (1 - progress) / 0.2;
        alpha = 0.3 * lifeAlpha;
    }

    const col = `hsla(${hue}, 80%, 60%, ${alpha * globalAlpha})`;
    
    for(let p of this.particles) p.render(ctx, col);
    
    ctx.fillStyle = this.isActive ? '#fff' : col;
    ctx.shadowBlur = this.isActive ? 30 : (this.isMinor ? 0 : 15);
    ctx.shadowColor = col;
    
    ctx.beginPath();
    if (this.isMinor) {
        ctx.arc(this.pos.x, this.pos.y, this.radiusBase, 0, Math.PI * 2);
    } else {
        const segments = 8;
        for(let i=0; i<=segments; i++) {
            const morph = Math.sin(time * 2 + i) * 0.15 + 1;
            const r = this.radiusBase * this.shapeOffsets[i%8] * morph * pulse;
            const ang = (i/segments) * Math.PI * 2;
            const x = this.pos.x + Math.cos(ang) * r;
            const y = this.pos.y + Math.sin(ang) * r;
            if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  renderConnections(ctx: CanvasRenderingContext2D, globalAlpha: number) {
    let nodeAlpha = 1;
    if (this.isMinor) {
        const progress = this.life / this.maxLife;
        if (progress < 0.2) nodeAlpha = progress / 0.2;
        else if (progress > 0.8) nodeAlpha = (1 - progress) / 0.2;
    }

    for (let n of this.neighbors) {
      const d = this.pos.dist(n.pos);
      const maxDist = (this.isMinor || n.isMinor) ? 120 : 350;
      const strength = Math.max(0, 1 - (d / maxDist));
      if (strength <= 0) continue;

      const baseAlpha = n.isMinor ? 0.15 : (this.isActive || n.isActive ? 0.5 : 0.15);
      const opacity = (0.05 + strength * baseAlpha) * globalAlpha;
      const width = (n.isMinor) ? 0.5 : (0.5 + strength);

      const g = ctx.createLinearGradient(this.pos.x, this.pos.y, n.pos.x, n.pos.y);
g.addColorStop(0, "hsla(" + this.colorHue + ", 60%, 60%, " + opacity + ")");
g.addColorStop(1, "hsla(" + n.colorHue + ", 60%, 60%, " + opacity + ")");
      
      ctx.lineWidth = width;
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(n.pos.x, n.pos.y);
      ctx.stroke();
    }
  }

  hitTest(mx: number, my: number) { 
      if (this.isMinor) return false; 
      return Math.sqrt((this.pos.x - mx)**2 + (this.pos.y - my)**2) < 60; 
  }
}

export class SwarmEngine {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;
  width = 0; height = 0;
  nodes: Node[] = [];
  particles: StreamParticle[] = [];
  pGen = new Perlin();
  activeNode: Node | null = null;
  
  targets: {x: number, y: number}[] = [];
  onNodeChange: (idx: number) => void;
  reqId: number = 0;
  startTime: number;
  
  streamActive = false;
  linkProgress = [0, 0, 0, 0]; 
  streamPhases = [false, false, false, false];
  streamTimers: NodeJS.Timeout[] = [];

  camera = { x: 0, y: 0, zoom: 1 };
  isDragging = false;
  lastMouse = { x: 0, y: 0 };
  draggedNode: Node | null = null;
  dragStartPos: {x: number, y: number} | null = null;

  boundMouseMove: (e: MouseEvent) => void;
  boundMouseDown: (e: MouseEvent) => void;
  boundMouseUp: (e: MouseEvent) => void;
  boundWheel: (e: WheelEvent) => void;

  constructor(canvas: HTMLCanvasElement, onNodeChange: (idx: number) => void, initialData: any[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onNodeChange = onNodeChange;
    
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundWheel = this.handleWheel.bind(this);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', this.boundMouseMove);
    canvas.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mouseup', this.boundMouseUp);
    canvas.addEventListener('wheel', this.boundWheel, { passive: false });
    
    this.initNodes(initialData);
    this.startTime = Date.now();
    
    setTimeout(() => { if (this.nodes.length > 0) this.activateNode(this.nodes[0]); }, 3500); 

    this.animate();
  }

  screenToWorld(sx: number, sy: number) {
      return {
          x: (sx - this.width / 2 - this.camera.x) / this.camera.zoom + this.width / 2,
          y: (sy - this.height / 2 - this.camera.y) / this.camera.zoom + this.height / 2
      };
  }

  worldToScreen(wx: number, wy: number) {
      return {
          x: (wx - this.width / 2) * this.camera.zoom + this.width / 2 + this.camera.x,
          y: (wy - this.height / 2) * this.camera.zoom + this.height / 2 + this.camera.y
      };
  }
  
  handleWheel(e: WheelEvent) {
      e.preventDefault();
      const zoomIntensity = 0.001;
      const newZoom = Math.min(Math.max(0.2, this.camera.zoom - e.deltaY * zoomIntensity), 4);
      this.camera.zoom = newZoom;
  }

  setTargets(rects: DOMRect[]) {
      this.targets = rects.map(r => ({ x: r.right, y: r.top + r.height / 2 }));
  }

  resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      if (this.nodes.length === 0) this.initNodes([]);
  }

  initNodes(initialData: any[]) {
      this.nodes = [];
      const cx = this.width / 2;
      const cy = this.height / 2;
      
      const central = new Node(cx, cy, this.pGen, true);
      central.bindData(0, 'bio');
      this.nodes.push(central);
      
      const totalActiveNodes = 20;
      for(let i=0; i<totalActiveNodes; i++) {
          const n = new Node(cx, cy, this.pGen);
          const category = i < 10 ? 'live' : 'portfolio';
          n.bindData(i + 1, category); 
          this.nodes.push(n);
      }
      
      for(let i=0; i<200; i++) {
          const n = new Node(Math.random() * this.width, Math.random() * this.height, this.pGen, false, true);
          this.nodes.push(n);
      }
      
      if (initialData.length > 0) this.updateData(initialData);
  }

  updateData(newData: any[]) {
      let dataIdx = 1; 
      for(let i=1; i<this.nodes.length; i++) {
          if (this.nodes[i].isMinor) continue;
          if (dataIdx < newData.length) {
              this.nodes[i].bindData(dataIdx, newData[dataIdx].category);
              dataIdx++;
          } else {
              const wrappedIdx = 1 + ((dataIdx - 1) % (newData.length - 1));
              this.nodes[i].bindData(wrappedIdx, newData[wrappedIdx].category);
              dataIdx++;
          }
      }
  }

  handleMouseDown(e: MouseEvent) {
      const mx = e.clientX - this.canvas.getBoundingClientRect().left;
      const my = e.clientY - this.canvas.getBoundingClientRect().top;
      const world = this.screenToWorld(mx, my);

      let hit = false;
      for (let i = this.nodes.length - 1; i >= 0; i--) {
          const n = this.nodes[i];
          if (!n.isMinor && n.hitTest(world.x, world.y)) {
              this.draggedNode = n;
              n.isDragging = true;
              hit = true;
              break;
          }
      }
      this.dragStartPos = { x: mx, y: my };
      this.isDragging = true;
      this.lastMouse = { x: mx, y: my };
      this.canvas.style.cursor = hit ? 'grabbing' : 'grabbing';
  }

  handleMouseMove(e: MouseEvent) {
      const mx = e.clientX - this.canvas.getBoundingClientRect().left;
      const my = e.clientY - this.canvas.getBoundingClientRect().top;
      const world = this.screenToWorld(mx, my);

      if (this.draggedNode) {
          this.draggedNode.pos.x = world.x;
          this.draggedNode.pos.y = world.y;
          this.draggedNode.vel.set(0,0,0); 
      } else if (this.isDragging && !this.draggedNode) {
          const dx = mx - this.lastMouse.x;
          const dy = my - this.lastMouse.y;
          this.camera.x += dx;
          this.camera.y += dy;
          this.lastMouse = { x: mx, y: my };
      } else {
          let hit = false;
          for (let n of this.nodes) {
              if (!n.isMinor && n.hitTest(world.x, world.y)) { hit = true; break; }
          }
          this.canvas.style.cursor = hit ? 'pointer' : 'default';
      }
  }

  handleMouseUp(e: MouseEvent) {
      const mx = e.clientX - this.canvas.getBoundingClientRect().left;
      const my = e.clientY - this.canvas.getBoundingClientRect().top;
      if (this.dragStartPos && this.draggedNode) {
          const dist = Math.sqrt((mx - this.dragStartPos.x)**2 + (my - this.dragStartPos.y)**2);
          if (dist < 5) this.activateNode(this.draggedNode);
      }
      if (this.draggedNode) { this.draggedNode.isDragging = false; this.draggedNode = null; }
      this.isDragging = false;
      this.dragStartPos = null;
      this.canvas.style.cursor = 'default';
  }

  activateNode(node: Node) {
      if (this.activeNode) this.activeNode.isActive = false;
      this.streamTimers.forEach(id => clearTimeout(id));
      this.streamTimers = [];
      this.particles = [];
      this.activeNode = node;
      this.activeNode.isActive = true;
      this.onNodeChange(node.dataIndex);
      this.startStreamSequence();
  }

  startStreamSequence() {
      this.streamActive = true;
      this.streamPhases = [false, false, false, false];
      this.linkProgress = [0, 0, 0, 0];
      const t1 = setTimeout(() => this.streamPhases[0] = true, 0);
      const t2 = setTimeout(() => this.streamPhases[1] = true, 600); 
      const t3 = setTimeout(() => this.streamPhases[2] = true, 1200);
      const t4 = setTimeout(() => this.streamPhases[3] = true, 1800);
      this.streamTimers.push(t1, t2, t3, t4);
  }

  cycleNextNode() {
      if (this.nodes.length === 0) return;
      let currentIndex = this.nodes.indexOf(this.activeNode!);
      let nextIdx = (currentIndex + 1) % this.nodes.length;
      while (this.nodes[nextIdx].isMinor) nextIdx = (nextIdx + 1) % this.nodes.length;
      this.activateNode(this.nodes[nextIdx]);
  }

  spawnStreams() {
      if (!this.activeNode || this.targets.length !== 4) return;
      if (!this.streamActive) return; 
      
      let cType = 1; 
      if (this.activeNode.category === 'live') cType = 2; 
      if (this.activeNode.category === 'bio') cType = 0; 

      const screenNode = this.worldToScreen(this.activeNode.pos.x, this.activeNode.pos.y);
      const startPos = new Vector3D(screenNode.x, screenNode.y, 0);

      const spawnRate = 0.4;
      if (this.streamPhases[0] && Math.random() > 1 - spawnRate) this.particles.push(new StreamParticle(startPos, new Vector3D(this.targets[0].x, this.targets[0].y, 0), cType));
      if (this.streamPhases[1] && Math.random() > 1 - spawnRate) this.particles.push(new StreamParticle(startPos, new Vector3D(this.targets[1].x, this.targets[1].y, 0), cType));
      if (this.streamPhases[2] && Math.random() > 1 - spawnRate) this.particles.push(new StreamParticle(startPos, new Vector3D(this.targets[2].x, this.targets[2].y, 0), cType));
      if (this.streamPhases[3] && Math.random() > 1 - spawnRate) this.particles.push(new StreamParticle(startPos, new Vector3D(this.targets[3].x, this.targets[3].y, 0), cType));
  }

  lerp(v1: Vector3D, v2: Vector3D, t: number): Vector3D {
      return new Vector3D(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t, 0);
  }

  animate = () => {
    this.reqId = requestAnimationFrame(this.animate);
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'rgba(2,4,10,0.2)';
    this.ctx.fillRect(0,0,this.width,this.height);
    
    this.ctx.save();
    this.ctx.translate(this.width/2 + this.camera.x, this.height/2 + this.camera.y);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.width/2, -this.height/2);

    this.ctx.globalCompositeOperation = 'screen';
    for (let n of this.nodes) n.connect(this.nodes);

    for (let n of this.nodes) {
        n.update(this.width, this.height, this.nodes);
        n.render(this.ctx, 1); 
        n.renderConnections(this.ctx, 1);
    }
    this.ctx.restore();

    if (this.activeNode && this.targets.length === 4) {
        this.spawnStreams();
        const screenNode = this.worldToScreen(this.activeNode.pos.x, this.activeNode.pos.y);
        const P0 = new Vector3D(screenNode.x, screenNode.y, 0);
        
        for (let i = 0; i < 4; i++) {
            if (this.streamPhases[i]) {
                 this.linkProgress[i] += 0.03;
                 if (this.linkProgress[i] > 1) this.linkProgress[i] = 1;
            }
            if (this.linkProgress[i] > 0) {
                const P2 = new Vector3D(this.targets[i].x, this.targets[i].y, 0);
                const P1 = new Vector3D((P0.x + P2.x) / 2, P0.y, 0);
                const t = this.linkProgress[i];
                const Q0 = this.lerp(P0, P1, t); const Q1 = this.lerp(P1, P2, t); const R0 = this.lerp(Q0, Q1, t);
                
                let color = 'rgba(16, 185, 129, 0.4)'; 
                if (this.activeNode.category === 'live') color = 'rgba(239, 68, 68, 0.5)'; 
                if (this.activeNode.category === 'bio') color = 'rgba(234, 179, 8, 0.4)'; 

                this.ctx.beginPath(); this.ctx.moveTo(P0.x, P0.y); this.ctx.quadraticCurveTo(Q0.x, Q0.y, R0.x, R0.y);
                this.ctx.strokeStyle = color; this.ctx.lineWidth = 3; this.ctx.stroke();

                if (t < 1) {
                    this.ctx.fillStyle = '#fff'; this.ctx.beginPath(); this.ctx.arc(R0.x, R0.y, 4, 0, Math.PI*2); this.ctx.fill();
                }
            }
        }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i]; p.step(this.pGen); p.render(this.ctx);
        if (p.arrived) this.particles.splice(i, 1);
    }
  }

  dispose() {
      this.canvas.removeEventListener('mousemove', this.boundMouseMove);
      this.canvas.removeEventListener('mousedown', this.boundMouseDown);
      window.removeEventListener('mouseup', this.boundMouseUp);
      this.canvas.removeEventListener('wheel', this.boundWheel); 
      cancelAnimationFrame(this.reqId);
      this.streamTimers.forEach(clearTimeout);
  }
}

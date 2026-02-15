import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Box, Rotate3D } from 'lucide-react';

export const ConceptVisualizer: React.FC = () => {
  const { lowBandwidthMode } = useApp();
  const [concept, setConcept] = useState<'quadratic' | 'array' | 'recursion'>('quadratic');
  const [paramA, setParamA] = useState(1);
  const [paramB, setParamB] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || lowBandwidthMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;

    const drawQuadratic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Setup
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 30;

      // Draw grid
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = -10; i <= 10; i++) {
        const x = centerX + i * scale;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let i = -10; i <= 10; i++) {
        const y = centerY + i * scale;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw axes
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Draw parabola: y = ax² + b
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let x = -10; x <= 10; x += 0.1) {
        const y = paramA * x * x + paramB;
        const canvasX = centerX + x * scale;
        const canvasY = centerY - y * scale;
        
        if (canvasY >= 0 && canvasY <= canvas.height) {
          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        }
      }
      ctx.stroke();

      // Draw point at vertex
      const vertexX = 0;
      const vertexY = paramB;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(centerX + vertexX * scale, centerY - vertexY * scale, 8, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#60a5fa';
      ctx.font = '16px monospace';
      ctx.fillText(`y = ${paramA.toFixed(1)}x² + ${paramB.toFixed(1)}`, 20, 30);
    };

    const drawArray = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const size = Math.round(paramA);
      const heights = Array.from({ length: size }, (_, i) => 
        Math.sin(i / size * Math.PI * 2) * paramB + paramB + 1
      );

      const barWidth = Math.min((canvas.width - 100) / size, 60);
      const maxHeight = Math.max(...heights, 1);
      const scale = (canvas.height - 100) / maxHeight;

      heights.forEach((height, i) => {
        const x = 50 + i * (barWidth + 10);
        const barHeight = height * scale;
        const y = canvas.height - 50 - barHeight;

        // Draw bar with 3D effect
        const hue = (i / size) * 360;
        
        // Front face
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Top face (lighter)
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + barWidth + 10, y - 10);
        ctx.lineTo(x + barWidth, y);
        ctx.closePath();
        ctx.fill();
        
        // Side face (darker)
        ctx.fillStyle = `hsl(${hue}, 70%, 40%)`;
        ctx.beginPath();
        ctx.moveTo(x + barWidth, y);
        ctx.lineTo(x + barWidth + 10, y - 10);
        ctx.lineTo(x + barWidth + 10, y + barHeight - 10);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.closePath();
        ctx.fill();

        // Value label
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(height.toFixed(1), x + barWidth / 2, y - 5);

        // Index label
        ctx.fillText(`[${i}]`, x + barWidth / 2, canvas.height - 30);
      });

      // Title
      ctx.fillStyle = '#60a5fa';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Array[${size}] - Scale: ${paramB.toFixed(1)}`, 20, 30);
    };

    const animate = () => {
      rotation += 0.01;

      if (concept === 'quadratic') {
        drawQuadratic();
      } else if (concept === 'array') {
        drawArray();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [concept, paramA, paramB, lowBandwidthMode]);

  if (lowBandwidthMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8 text-center">
            <Eye className="size-16 mx-auto mb-4 text-blue-400 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-4">Visualization Disabled</h2>
            <p className="text-gray-400">
              Low bandwidth mode is enabled. Visualizations are disabled to save resources.
            </p>
            <p className="text-gray-400 mt-2">
              Disable low bandwidth mode from the navbar to view interactive concepts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
          <Rotate3D className="size-10 text-blue-400" />
          Concept Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          Don't memorize formulas. See how they interact visually
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select Concept</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setConcept('quadratic')}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    concept === 'quadratic'
                      ? 'bg-blue-500/30 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-blue-500/30 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Quadratic Function
                </button>
                <button
                  onClick={() => setConcept('array')}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    concept === 'array'
                      ? 'bg-blue-500/30 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-blue-500/30 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Array Visualization
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Parameters</h3>
              
              {concept === 'quadratic' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Coefficient a: {paramA.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={paramA}
                      onChange={(e) => setParamA(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Constant b: {paramB.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={paramB}
                      onChange={(e) => setParamB(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-400 font-mono text-sm">
                      y = {paramA.toFixed(1)}x² + {paramB.toFixed(1)}
                    </p>
                  </div>
                </>
              )}

              {concept === 'array' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Array Size: {Math.round(paramA)}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="1"
                      value={paramA}
                      onChange={(e) => setParamA(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Value Scale: {paramB.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={paramB}
                      onChange={(e) => setParamB(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6">
              <h4 className="text-white font-semibold mb-2">Interactive Controls:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Adjust parameters to see changes</li>
                <li>• Watch visualization update in real-time</li>
                <li>• Yellow dot shows vertex (quadratic)</li>
                <li>• 3D bars show array values</li>
              </ul>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="lg:col-span-2 rounded-xl bg-black border border-blue-500/20 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Understanding the Visualization</h3>
          {concept === 'quadratic' && (
            <div className="text-gray-300 space-y-2">
              <p>The graph shows the quadratic function y = ax² + b</p>
              <p>• Change 'a' to see how it affects the parabola's width (steepness)</p>
              <p>• Change 'b' to see vertical shifts</p>
              <p>• Positive 'a' opens upward, negative 'a' opens downward</p>
              <p>• Yellow dot marks the vertex of the parabola</p>
            </div>
          )}
          {concept === 'array' && (
            <div className="text-gray-300 space-y-2">
              <p>Each 3D bar represents an element in the array</p>
              <p>• Height shows the value</p>
              <p>• Color represents position in array (hue rotation)</p>
              <p>• Index shown below each bar</p>
              <p>• Visualizes data structures in an intuitive way</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

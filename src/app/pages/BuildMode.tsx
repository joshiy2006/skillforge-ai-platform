import React, { useState, useCallback } from 'react';
import { Code, GitBranch, Lightbulb, ChevronRight, ArrowRight } from 'lucide-react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

export const BuildMode: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [flowchartType, setFlowchartType] = useState<'flowchart' | 'mindmap'>('flowchart');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const exampleCode = `function findMax(arr) {
  if (arr.length === 0) return null;
  
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    } else if (arr[i] === max) {
      continue;
    } else {
      console.log("smaller");
    }
  }
  return max;
}`;

  // Node styles matching Figma design
  const nodeStyles = {
    start: {
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: 'auto',
    },
    process: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: 'white',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '10px 20px',
      backdropFilter: 'blur(8px)',
      width: 'auto',
    },
    decision: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: 'white',
      border: '2px solid #f59e0b',
      borderRadius: '4px',
      padding: '10px 20px',
      backdropFilter: 'blur(8px)',
      width: 'auto',
    },
    end: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      width: 'auto',
    },
  };

  const parseCodeToFlowchart = useCallback((inputCode: string) => {
    const lines = inputCode.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    let nodeId = 0;
    let yPos = 50;
    const xPos = 250;
    const nodeHeight = 80;
    const nodeSpacing = 100;

    // Keep track of condition nodes for else/else-if connections
    const conditionStack: { id: string; yPos: number }[] = [];
    let lastConditionNode: string | null = null;
    let inIfBlock = false;

    // Start node
    const startId = `node-${nodeId++}`;
    newNodes.push({
      id: startId,
      type: 'default',
      position: { x: xPos, y: yPos },
      data: { label: 'Start' },
      style: nodeStyles.start,
    });
    
    let lastNodeId = startId;
    yPos += nodeHeight + nodeSpacing;

    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '{' || line === '}') continue;

      // Function declaration
      if (line.includes('function ')) {
        const funcName = line.match(/function\s+(\w+)/)?.[1] || 'Function';
        const currentNodeId = `node-${nodeId++}`;
        
        newNodes.push({
          id: currentNodeId,
          type: 'default',
          position: { x: xPos, y: yPos },
          data: { label: `📦 ${funcName}` },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${lastNodeId}-${currentNodeId}`,
          source: lastNodeId,
          target: currentNodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        lastNodeId = currentNodeId;
        yPos += nodeHeight + nodeSpacing;
      }
      
      // If statement
      else if (line.startsWith('if ')) {
        const condition = line.match(/if\s*\((.*?)\)/)?.[1] || 'condition';
        const currentNodeId = `node-${nodeId++}`;
        
        newNodes.push({
          id: currentNodeId,
          type: 'default',
          position: { x: xPos, y: yPos },
          data: { label: `❓ if ${condition}` },
          style: nodeStyles.decision,
        });
        
        newEdges.push({
          id: `edge-${lastNodeId}-${currentNodeId}`,
          source: lastNodeId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        conditionStack.push({ id: currentNodeId, yPos });
        lastConditionNode = currentNodeId;
        inIfBlock = true;
        lastNodeId = currentNodeId;
        yPos += nodeHeight + nodeSpacing;
      }
      
      // Else if
      else if (line.startsWith('else if')) {
        if (conditionStack.length > 0) {
          const prevCond = conditionStack[conditionStack.length - 1];
          const condition = line.match(/else\s+if\s*\((.*?)\)/)?.[1] || 'condition';
          const currentNodeId = `node-${nodeId++}`;
          
          // Position else-if to the right at same level as previous condition
          newNodes.push({
            id: currentNodeId,
            type: 'default',
            position: { x: xPos + 250, y: prevCond.yPos },
            data: { label: `❓ else if ${condition}` },
            style: nodeStyles.decision,
          });
          
          // Connect from previous condition's false path
          newEdges.push({
            id: `edge-${prevCond.id}-false-${currentNodeId}`,
            source: prevCond.id,
            target: currentNodeId,
            type: 'smoothstep',
            label: 'No',
            labelStyle: { fill: '#ef4444', fontWeight: 'bold' },
            style: { stroke: '#ef4444', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
          });
          
          conditionStack.pop();
          conditionStack.push({ id: currentNodeId, yPos: prevCond.yPos });
          lastConditionNode = currentNodeId;
          lastNodeId = currentNodeId;
        }
      }
      
      // Else
      else if (line.startsWith('else') && !line.startsWith('else if')) {
        if (conditionStack.length > 0) {
          const prevCond = conditionStack[conditionStack.length - 1];
          const currentNodeId = `node-${nodeId++}`;
          
          // Position else to the right and below the condition chain
          newNodes.push({
            id: currentNodeId,
            type: 'default',
            position: { x: xPos + 250, y: prevCond.yPos + 80 },
            data: { label: '📌 else' },
            style: nodeStyles.process,
          });
          
          // Connect from previous condition's false path
          newEdges.push({
            id: `edge-${prevCond.id}-false-${currentNodeId}`,
            source: prevCond.id,
            target: currentNodeId,
            type: 'smoothstep',
            label: 'No',
            labelStyle: { fill: '#ef4444', fontWeight: 'bold' },
            style: { stroke: '#ef4444', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
          });
          
          conditionStack.pop();
          lastNodeId = currentNodeId;
          inIfBlock = false;
          yPos = prevCond.yPos + nodeHeight + nodeSpacing + 80;
        }
      }
      
      // For/While loops
      else if (line.startsWith('for ') || line.startsWith('while ')) {
        const loopType = line.startsWith('for') ? '🔄 For' : '🔄 While';
        const condition = line.match(/\((.*?)\)/)?.[1] || '';
        const loopNodeId = `node-${nodeId++}`;
        
        newNodes.push({
          id: loopNodeId,
          type: 'default',
          position: { x: xPos, y: yPos },
          data: { label: `${loopType}${condition ? ': ' + condition : ''}` },
          style: nodeStyles.decision,
        });
        
        newEdges.push({
          id: `edge-${lastNodeId}-${loopNodeId}`,
          source: lastNodeId,
          target: loopNodeId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        // Loop body
        const bodyId = `node-${nodeId++}`;
        newNodes.push({
          id: bodyId,
          type: 'default',
          position: { x: xPos + 200, y: yPos + nodeHeight },
          data: { label: '📋 Loop Body' },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${loopNodeId}-true-${bodyId}`,
          source: loopNodeId,
          target: bodyId,
          type: 'smoothstep',
          label: 'Yes',
          labelStyle: { fill: '#10b981', fontWeight: 'bold' },
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
        
        // Back to condition
        newEdges.push({
          id: `edge-${bodyId}-back-${loopNodeId}`,
          source: bodyId,
          target: loopNodeId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        // Exit loop
        const exitId = `node-${nodeId++}`;
        newNodes.push({
          id: exitId,
          type: 'default',
          position: { x: xPos - 200, y: yPos + nodeHeight * 2 },
          data: { label: '⬇️ After Loop' },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${loopNodeId}-false-${exitId}`,
          source: loopNodeId,
          target: exitId,
          type: 'smoothstep',
          label: 'No',
          labelStyle: { fill: '#ef4444', fontWeight: 'bold' },
          style: { stroke: '#ef4444', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        });
        
        lastNodeId = exitId;
        yPos += nodeHeight * 3 + nodeSpacing * 2;
      }
      
      // Return statement
      else if (line.startsWith('return')) {
        const returnValue = line.replace('return', '').replace(';', '').trim();
        const currentNodeId = `node-${nodeId++}`;
        
        newNodes.push({
          id: currentNodeId,
          type: 'default',
          position: { x: xPos, y: yPos },
          data: { label: `📤 Return ${returnValue || 'void'}` },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${lastNodeId}-${currentNodeId}`,
          source: lastNodeId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        lastNodeId = currentNodeId;
        yPos += nodeHeight + nodeSpacing;
      }
      
      // Regular statement (true path of if)
      else if (inIfBlock && lastConditionNode) {
        const currentNodeId = `node-${nodeId++}`;
        const conditionNode = conditionStack.find(c => c.id === lastConditionNode);
        
        newNodes.push({
          id: currentNodeId,
          type: 'default',
          position: { x: xPos + 250, y: conditionNode ? conditionNode.yPos + 50 : yPos },
          data: { label: `📋 ${line.substring(0, 25)}${line.length > 25 ? '...' : ''}` },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${lastConditionNode}-true-${currentNodeId}`,
          source: lastConditionNode,
          target: currentNodeId,
          type: 'smoothstep',
          label: 'Yes',
          labelStyle: { fill: '#10b981', fontWeight: 'bold' },
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
        
        lastNodeId = currentNodeId;
        yPos = (conditionNode ? conditionNode.yPos : yPos) + nodeHeight + nodeSpacing + 50;
        inIfBlock = false;
      }
      
      // Regular statement
      else if (!line.startsWith('//')) {
        const currentNodeId = `node-${nodeId++}`;
        
        newNodes.push({
          id: currentNodeId,
          type: 'default',
          position: { x: xPos, y: yPos },
          data: { label: `📋 ${line.substring(0, 25)}${line.length > 25 ? '...' : ''}` },
          style: nodeStyles.process,
        });
        
        newEdges.push({
          id: `edge-${lastNodeId}-${currentNodeId}`,
          source: lastNodeId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
        
        lastNodeId = currentNodeId;
        yPos += nodeHeight + nodeSpacing;
      }
    }

    // End node
    const endId = `node-${nodeId++}`;
    newNodes.push({
      id: endId,
      type: 'default',
      position: { x: xPos, y: yPos },
      data: { label: 'End' },
      style: nodeStyles.end,
    });
    
    newEdges.push({
      id: `edge-${lastNodeId}-${endId}`,
      source: lastNodeId,
      target: endId,
      type: 'smoothstep',
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  const parseCodeToMindmap = useCallback((inputCode: string) => {
    const lines = inputCode.split('\n');
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    const hasFunctions = lines.some(line => line.includes('function '));
    const hasLoops = lines.some(line => line.includes('for ') || line.includes('while '));
    const hasIfs = lines.some(line => line.includes('if '));
    const hasElse = lines.some(line => line.includes('else'));
    const hasReturns = lines.some(line => line.includes('return'));

    // Root node
    newNodes.push({
      id: 'root',
      type: 'default',
      position: { x: 400, y: 50 },
      data: { label: '📊 Program Analysis' },
      style: { ...nodeStyles.start, padding: '16px 32px' },
    });

    let currentY = 150;
    const xStart = 200;
    const xStep = 250;

    if (hasFunctions) {
      const funcId = 'functions';
      newNodes.push({
        id: funcId,
        type: 'default',
        position: { x: xStart, y: currentY },
        data: { label: '📦 Functions' },
        style: nodeStyles.process,
      });
      newEdges.push({
        id: 'edge-root-func',
        source: 'root',
        target: funcId,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });
      currentY += 100;
    }

    if (hasLoops) {
      const loopId = 'loops';
      newNodes.push({
        id: loopId,
        type: 'default',
        position: { x: xStart + xStep, y: 150 },
        data: { label: '🔄 Loops' },
        style: nodeStyles.process,
      });
      newEdges.push({
        id: 'edge-root-loop',
        source: 'root',
        target: loopId,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });
      
      // Sub-nodes for loops
      newNodes.push({
        id: 'for-loop',
        type: 'default',
        position: { x: xStart + xStep - 80, y: 250 },
        data: { label: 'For Loop' },
        style: { ...nodeStyles.process, background: 'rgba(59, 130, 246, 0.05)' },
      });
      newNodes.push({
        id: 'while-loop',
        type: 'default',
        position: { x: xStart + xStep + 80, y: 250 },
        data: { label: 'While Loop' },
        style: { ...nodeStyles.process, background: 'rgba(59, 130, 246, 0.05)' },
      });
      
      newEdges.push({
        id: 'edge-loop-for',
        source: loopId,
        target: 'for-loop',
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 1 },
      });
      newEdges.push({
        id: 'edge-loop-while',
        source: loopId,
        target: 'while-loop',
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 1 },
      });
    }

    if (hasIfs || hasElse) {
      const ifId = 'conditionals';
      newNodes.push({
        id: ifId,
        type: 'default',
        position: { x: xStart + xStep * 2, y: 150 },
        data: { label: '❓ Conditionals' },
        style: nodeStyles.process,
      });
      newEdges.push({
        id: 'edge-root-if',
        source: 'root',
        target: ifId,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });
      
      // Sub-nodes for conditionals
      let conditionalY = 250;
      if (hasIfs) {
        newNodes.push({
          id: 'if-stmt',
          type: 'default',
          position: { x: xStart + xStep * 2 - 100, y: conditionalY },
          data: { label: 'If Statements' },
          style: { ...nodeStyles.process, background: 'rgba(245, 158, 11, 0.05)' },
        });
        newEdges.push({
          id: 'edge-if-ifstmt',
          source: ifId,
          target: 'if-stmt',
          type: 'smoothstep',
          style: { stroke: '#f59e0b', strokeWidth: 1 },
        });
      }
      
      if (hasElse) {
        newNodes.push({
          id: 'else-stmt',
          type: 'default',
          position: { x: xStart + xStep * 2 + 100, y: conditionalY },
          data: { label: 'Else Clauses' },
          style: { ...nodeStyles.process, background: 'rgba(245, 158, 11, 0.05)' },
        });
        newEdges.push({
          id: 'edge-if-else',
          source: ifId,
          target: 'else-stmt',
          type: 'smoothstep',
          style: { stroke: '#f59e0b', strokeWidth: 1 },
        });
      }
    }

    if (hasReturns) {
      const returnId = 'returns';
      newNodes.push({
        id: returnId,
        type: 'default',
        position: { x: xStart + xStep * 3, y: 150 },
        data: { label: '📤 Returns' },
        style: nodeStyles.process,
      });
      newEdges.push({
        id: 'edge-root-return',
        source: 'root',
        target: returnId,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  const generateDiagram = () => {
    if (!code.trim()) return;

    if (flowchartType === 'flowchart') {
      parseCodeToFlowchart(code);
    } else {
      parseCodeToMindmap(code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
              <Code className="size-10 text-blue-400" />
              Build Mode
            </h1>
            <p className="text-gray-400">
              From Code to Logic Structure – Convert your code into interactive flowcharts
            </p>
          </div>
          <div className="flex gap-2 bg-white/5 rounded-lg p-1 border border-blue-500/20">
            <button
              onClick={() => setFlowchartType('flowchart')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                flowchartType === 'flowchart'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GitBranch className="size-5" />
              Flowchart
            </button>
            <button
              onClick={() => setFlowchartType('mindmap')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                flowchartType === 'mindmap'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Lightbulb className="size-5" />
              Mindmap
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Code Input</h2>
                <button
                  onClick={() => setCode(exampleCode)}
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="size-4" />
                  Load Example
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-96 px-4 py-3 rounded-lg bg-black/50 border border-blue-500/30 text-white font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              onClick={generateDiagram}
              disabled={!code.trim()}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium flex items-center justify-center gap-2"
            >
              <ArrowRight className="size-5" />
              Generate {flowchartType === 'flowchart' ? 'Flowchart' : 'Mindmap'}
            </button>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {flowchartType === 'flowchart' ? 'Interactive Flowchart' : 'Code Mindmap'}
            </h2>
            <div className="bg-black/30 rounded-lg h-[500px] overflow-hidden">
              {nodes.length > 0 ? (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  attributionPosition="bottom-left"
                >
                  <Controls />
                  <Background color="#3b82f6" gap={16} size={1} />
                </ReactFlow>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Code className="size-16 mx-auto mb-4 opacity-50" />
                    <p>Paste code and generate diagram to see visualization</p>
                  </div>
                </div>
              )}
            </div>

            {nodes.length > 0 && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <GitBranch className="size-4" />
                  Flow Structure:
                </h3>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Start → Function declarations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Diamond nodes show decisions (if/else/loops)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Green edges = True/Yes path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Red edges = False/No path</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-blue-500/10 border border-blue-500/30 p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <Lightbulb className="size-4" />
            How it works:
          </h3>
          <p className="text-xs text-gray-400">
            The parser analyzes your code and generates a flowchart showing the control flow.
            It handles if-else chains, loops, and sequential statements. 
            <span className="block mt-1 text-blue-400/70">
              ✓ Blue nodes: Processes/statements • Yellow nodes: Decisions • Green: True path • Red: False path
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

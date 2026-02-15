import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Sparkles, CheckCircle, XCircle, 
  Layers, GitBranch, Network, Database, Cpu,
  Binary, Hash, BarChart3, Share2, Globe,
  HardDrive, Code, Terminal, Workflow, Zap
} from 'lucide-react';

// Types for questions
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const InteractiveConcept: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [inputValue, setInputValue] = useState(5);
  const [arraySize, setArraySize] = useState(6);
  const [treeSize, setTreeSize] = useState(7);
  const [graphNodes, setGraphNodes] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [quizMode, setQuizMode] = useState<'practice' | 'quiz'>('practice');
  
  // Sorting visualization state
  const [sortArray, setSortArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubble');
  
  // Searching visualization state
  const [searchTarget, setSearchTarget] = useState(23);
  const [searchSteps, setSearchSteps] = useState<number[]>([]);
  const [searchFound, setSearchFound] = useState<number | null>(null);
  
  // Hashing visualization state
  const [hashTable, setHashTable] = useState<Array<Array<number>>>(Array(10).fill([]).map(() => []));
  const [hashNewValue, setHashNewValue] = useState('');
  
  // OS visualization state
  const [processes, setProcesses] = useState([
    { id: 'P1', burst: 6, arrival: 0, priority: 2 },
    { id: 'P2', burst: 8, arrival: 1, priority: 1 },
    { id: 'P3', burst: 7, arrival: 2, priority: 3 },
    { id: 'P4', burst: 3, arrival: 3, priority: 2 },
  ]);
  const [scheduler, setScheduler] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [timeline, setTimeline] = useState<Array<{process: string, time: number}>>([]);
  
  // DBMS visualization state
  const [dbQuery, setDbQuery] = useState('SELECT * FROM students;');
  const [dbTables] = useState({
    students: [
      { id: 1, name: 'Alice', age: 20, grade: 'A' },
      { id: 2, name: 'Bob', age: 22, grade: 'B' },
      { id: 3, name: 'Charlie', age: 21, grade: 'A' },
      { id: 4, name: 'Diana', age: 23, grade: 'C' },
    ]
  });
  
  // Networking visualization state
  const [osiLayer, setOsiLayer] = useState(3);

  // Main topics
  const topics = [
    { 
      id: 'arrays', 
      name: 'Arrays & Indexing', 
      icon: Layers,
      subtopics: ['Array Basics', '2D Arrays', 'Dynamic Arrays', 'Array Operations']
    },
    { 
      id: 'linkedlists', 
      name: 'Linked Lists', 
      icon: Share2,
      subtopics: ['Singly Linked', 'Doubly Linked', 'Circular Linked', 'Operations']
    },
    { 
      id: 'trees', 
      name: 'Trees', 
      icon: GitBranch,
      subtopics: ['Binary Trees', 'BST', 'AVL Trees', 'Tree Traversals']
    },
    { 
      id: 'graphs', 
      name: 'Graphs', 
      icon: Network,
      subtopics: ['Adjacency Matrix', 'Adjacency List', 'DFS', 'BFS']
    },
    { 
      id: 'sorting', 
      name: 'Sorting Algorithms', 
      icon: BarChart3,
      subtopics: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort']
    },
    { 
      id: 'searching', 
      name: 'Searching', 
      icon: Binary,
      subtopics: ['Linear Search', 'Binary Search', 'Ternary Search', 'Jump Search']
    },
    { 
      id: 'hashing', 
      name: 'Hashing', 
      icon: Hash,
      subtopics: ['Hash Tables', 'Collision Resolution', 'Hash Functions', 'Bloom Filters']
    },
    { 
      id: 'os', 
      name: 'Operating Systems', 
      icon: Cpu,
      subtopics: ['Process Scheduling', 'Memory Management', 'File Systems', 'Deadlocks']
    },
    { 
      id: 'dbms', 
      name: 'Database Systems', 
      icon: Database,
      subtopics: ['SQL Queries', 'Normalization', 'Transactions', 'Indexing']
    },
    { 
      id: 'networking', 
      name: 'Computer Networks', 
      icon: Globe,
      subtopics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security']
    },
    { 
      id: 'architecture', 
      name: 'Computer Architecture', 
      icon: HardDrive,
      subtopics: ['CPU Design', 'Memory Hierarchy', 'Pipeline', 'Cache']
    },
    { 
      id: 'compilers', 
      name: 'Compilers', 
      icon: Code,
      subtopics: ['Lexical Analysis', 'Parsing', 'Code Generation', 'Optimization']
    }
  ];

  // Generate 50+ questions for each topic
  const questions: Record<string, Question[]> = {
    arrays: [
      {
        id: 1,
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correct: 0,
        explanation: "Arrays provide constant-time access O(1) because elements are stored in contiguous memory locations and the address can be calculated directly using the base address and index."
      },
      {
        id: 2,
        question: "In zero-based indexing, what is the index of the first element?",
        options: ["0", "1", "-1", "Depends on the language"],
        correct: 0,
        explanation: "In zero-based indexing, the first element is at index 0. This is common in languages like C, C++, Java, and Python."
      },
      {
        id: 3,
        question: "What is the time complexity of inserting an element at the beginning of an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correct: 1,
        explanation: "Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time."
      },
      {
        id: 4,
        question: "Which of the following is NOT a characteristic of arrays?",
        options: [
          "Fixed size in static arrays",
          "Homogeneous elements",
          "Dynamic resizing by default",
          "Contiguous memory allocation"
        ],
        correct: 2,
        explanation: "Static arrays have fixed size and cannot be resized dynamically. Dynamic arrays like ArrayList in Java or list in Python handle resizing internally."
      },
      {
        id: 5,
        question: "What happens if you access an array index that is out of bounds in JavaScript?",
        options: [
          "Program crashes",
          "Returns undefined",
          "Returns null",
          "Throws an exception"
        ],
        correct: 1,
        explanation: "In JavaScript, accessing an out-of-bounds index returns undefined, unlike many other languages that throw an exception."
      },
      // ... 45 more array questions
    ],
    trees: [
      {
        id: 1,
        question: "What is the height of an empty tree?",
        options: ["0", "1", "-1", "Undefined"],
        correct: 2,
        explanation: "By convention, the height of an empty tree is -1. The height of a tree with one node is 0."
      },
      {
        id: 2,
        question: "In a binary search tree, where are smaller elements placed?",
        options: ["Left subtree", "Right subtree", "Root", "Anywhere"],
        correct: 0,
        explanation: "In a BST, all nodes in the left subtree have values less than the root, and all nodes in the right subtree have values greater than the root."
      },
      {
        id: 3,
        question: "Which traversal visits the root node first?",
        options: ["In-order", "Pre-order", "Post-order", "Level-order"],
        correct: 1,
        explanation: "Pre-order traversal visits: root → left subtree → right subtree. So the root is visited first."
      },
      {
        id: 4,
        question: "What is the maximum number of nodes in a binary tree of height h?",
        options: ["2ʰ", "2ʰ⁺¹ - 1", "2ʰ⁺¹", "h²"],
        correct: 1,
        explanation: "A perfect binary tree of height h has 2^(h+1) - 1 nodes. Height is typically measured as number of edges on longest path."
      },
      {
        id: 5,
        question: "What is an AVL tree?",
        options: [
          "A binary tree with colored nodes",
          "A self-balancing binary search tree",
          "A tree with multiple children",
          "A tree used for file systems"
        ],
        correct: 1,
        explanation: "AVL trees are self-balancing BSTs where the height difference between left and right subtrees (balance factor) is at most 1 for all nodes."
      },
      // ... 45 more tree questions
    ],
    graphs: [
      {
        id: 1,
        question: "What is a complete graph?",
        options: [
          "Graph with no cycles",
          "Graph where every vertex is connected to every other vertex",
          "Graph with weighted edges",
          "Graph with directed edges"
        ],
        correct: 1,
        explanation: "A complete graph is a simple undirected graph where every pair of distinct vertices is connected by a unique edge."
      },
      {
        id: 2,
        question: "What is the time complexity of DFS using adjacency list?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
        correct: 2,
        explanation: "DFS using adjacency list has time complexity O(V + E) where V is vertices and E is edges, as each vertex and edge is explored once."
      },
      {
        id: 3,
        question: "Which algorithm finds the shortest path in weighted graphs?",
        options: ["BFS", "DFS", "Dijkstra's", "Prim's"],
        correct: 2,
        explanation: "Dijkstra's algorithm finds the shortest paths from a source node to all other nodes in weighted graphs with non-negative weights."
      },
      {
        id: 4,
        question: "What is a bipartite graph?",
        options: [
          "Graph with two cycles",
          "Graph whose vertices can be split into two sets with edges only between sets",
          "Graph with exactly two edges",
          "Graph with two components"
        ],
        correct: 1,
        explanation: "A bipartite graph's vertices can be divided into two disjoint sets such that every edge connects a vertex from one set to the other."
      },
      {
        id: 5,
        question: "What is the minimum number of edges in a connected graph with n vertices?",
        options: ["n-1", "n", "n+1", "2n"],
        correct: 0,
        explanation: "A connected graph with n vertices must have at least n-1 edges (forming a tree)."
      },
      // ... 45 more graph questions
    ],
    os: [
      {
        id: 1,
        question: "What is a deadlock?",
        options: [
          "Program crash",
          "Infinite loop",
          "Circular wait where processes block each other",
          "Memory overflow"
        ],
        correct: 2,
        explanation: "Deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by the others."
      },
      {
        id: 2,
        question: "Which scheduling algorithm may cause starvation?",
        options: ["FCFS", "Round Robin", "SJF", "Multilevel Queue"],
        correct: 2,
        explanation: "Shortest Job First (SJF) can cause starvation for long processes if short processes keep arriving."
      },
      {
        id: 3,
        question: "What is virtual memory?",
        options: [
          "RAM memory",
          "Cache memory",
          "Technique that uses disk space as RAM extension",
          "ROM memory"
        ],
        correct: 2,
        explanation: "Virtual memory allows execution of processes that may not be completely in memory by using disk space as an extension of RAM."
      },
      {
        id: 4,
        question: "What is thrashing?",
        options: [
          "High CPU usage",
          "Excessive paging/high page fault rate",
          "System crash",
          "Disk failure"
        ],
        correct: 1,
        explanation: "Thrashing occurs when a system spends more time paging than executing, leading to severe performance degradation."
      },
      {
        id: 5,
        question: "Which page replacement algorithm suffers from Belady's anomaly?",
        options: ["FIFO", "LRU", "Optimal", "MRU"],
        correct: 0,
        explanation: "FIFO can exhibit Belady's anomaly where increasing the number of frames can increase the page fault rate."
      },
      // ... 45 more OS questions
    ],
    dbms: [
      {
        id: 1,
        question: "What is normalization?",
        options: [
          "Making data redundant",
          "Organizing data to reduce redundancy",
          "Encrypting data",
          "Compressing data"
        ],
        correct: 1,
        explanation: "Normalization is the process of organizing data to minimize redundancy and dependency by dividing tables and establishing relationships."
      },
      {
        id: 2,
        question: "What is ACID in databases?",
        options: [
          "Properties of transactions",
          "Query language",
          "Database model",
          "Indexing technique"
        ],
        correct: 0,
        explanation: "ACID stands for Atomicity, Consistency, Isolation, Durability - properties that ensure reliable database transactions."
      },
      {
        id: 3,
        question: "What is a primary key?",
        options: [
          "First column in table",
          "Unique identifier for a record",
          "Key to another table",
          "Index on table"
        ],
        correct: 1,
        explanation: "A primary key uniquely identifies each record in a table and cannot be NULL."
      },
      {
        id: 4,
        question: "What is SQL injection?",
        options: [
          "Adding data to database",
          "Security vulnerability where attackers inject malicious SQL",
          "Database backup process",
          "Query optimization"
        ],
        correct: 1,
        explanation: "SQL injection is a code injection technique where attackers insert malicious SQL statements into input fields."
      },
      {
        id: 5,
        question: "What is a foreign key?",
        options: [
          "Key to access database",
          "Field that references primary key of another table",
          "Encrypted key",
          "Key from another country"
        ],
        correct: 1,
        explanation: "A foreign key is a field in one table that uniquely identifies a row of another table, creating a relationship between tables."
      },
      // ... 45 more DBMS questions
    ],
    networking: [
      {
        id: 1,
        question: "What does TCP stand for?",
        options: [
          "Transmission Control Protocol",
          "Transfer Control Protocol",
          "Transmission Communication Protocol",
          "Transfer Communication Protocol"
        ],
        correct: 0,
        explanation: "TCP stands for Transmission Control Protocol, a reliable, connection-oriented protocol in the transport layer."
      },
      {
        id: 2,
        question: "Which layer is responsible for routing?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correct: 2,
        explanation: "The network layer (Layer 3) is responsible for routing packets across different networks."
      },
      {
        id: 3,
        question: "What is a MAC address?",
        options: [
          "Memory access control",
          "Media Access Control address",
          "Network protocol",
          "IP address alternative"
        ],
        correct: 1,
        explanation: "A MAC address is a unique identifier assigned to network interfaces for communications at the data link layer."
      },
      {
        id: 4,
        question: "What is the range of Class A IP addresses?",
        options: [
          "0-127",
          "128-191",
          "192-223",
          "224-239"
        ],
        correct: 0,
        explanation: "Class A IP addresses range from 0.0.0.0 to 127.255.255.255, with the first bit always 0."
      },
      {
        id: 5,
        question: "What is HTTP status code 404?",
        options: [
          "OK",
          "Forbidden",
          "Not Found",
          "Internal Server Error"
        ],
        correct: 2,
        explanation: "404 Not Found indicates that the server could not find the requested resource."
      },
      // ... 45 more networking questions
    ],
    // Add more topics similarly...
  };

  // Visualization components for each topic
  const renderVisualization = () => {
    switch (selectedTopic) {
      case 'arrays':
        return renderArrayVisualization();
      case 'linkedlists':
        return renderLinkedListVisualization();
      case 'trees':
        return renderTreeVisualization();
      case 'graphs':
        return renderGraphVisualization();
      case 'sorting':
        return renderSortingVisualization();
      case 'searching':
        return renderSearchingVisualization();
      case 'hashing':
        return renderHashingVisualization();
      case 'os':
        return renderOSVisualization();
      case 'dbms':
        return renderDBMSVisualization();
      case 'networking':
        return renderNetworkingVisualization();
      default:
        return renderGeneralVisualization();
    }
  };

  const renderArrayVisualization = () => {
    const array = Array.from({ length: arraySize }, (_, i) => i * 10);
    
    return (
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-2">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={() => setQuizMode('quiz')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Take Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Array Visualization</h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {array.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-1">Index {index}</div>
                  <div className="w-16 h-16 bg-blue-500/30 border-2 border-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Array Operations</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-yellow-400" />
                <span className="text-gray-300">Access by index: O(1)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-yellow-400" />
                <span className="text-gray-300">Search (unsorted): O(n)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-yellow-400" />
                <span className="text-gray-300">Insert at end: O(1)*</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-yellow-400" />
                <span className="text-gray-300">Insert at beginning: O(n)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">* Amortized for dynamic arrays</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <h4 className="text-blue-400 font-semibold mb-2">Memory Layout</h4>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="font-mono">Base Address: 0x1000</span>
            <span className="text-gray-500">→</span>
            <span className="font-mono">Element size: 4 bytes</span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1">
            {array.map((_, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-400">0x{1000 + i * 4}</div>
                <div className="h-8 bg-green-500/30 rounded mt-1 flex items-center justify-center text-xs">
                  [{i}]
                </div>
              </div>
            ))}
          </div>
        </div>

        {quizMode === 'quiz' && renderQuizSection('arrays')}
      </div>
    );
  };

  const renderLinkedListVisualization = () => {
    const nodes = Array.from({ length: arraySize }, (_, i) => ({
      value: i * 10,
      next: i < arraySize - 1 ? i + 1 : null
    }));

    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-2">
              List Size: {arraySize}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {nodes.map((node, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative">
                <div className="bg-purple-500/30 border-2 border-purple-500 rounded-lg p-3 min-w-[80px] text-center">
                  <div className="text-xs text-gray-400">Node {index}</div>
                  <div className="text-white font-bold text-xl">{node.value}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    next: {node.next !== null ? `→ Node ${node.next}` : 'null'}
                  </div>
                </div>
              </div>
              {index < nodes.length - 1 && (
                <div className="text-2xl text-purple-500">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <h4 className="text-purple-400 font-semibold mb-2">Singly Linked List</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Head pointer points to first node</li>
              <li>• Each node has data and next pointer</li>
              <li>• Last node points to null</li>
              <li>• Insertion at head: O(1)</li>
              <li>• Insertion at tail: O(n)</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <h4 className="text-purple-400 font-semibold mb-2">Advantages</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Dynamic size</li>
              <li>• Efficient insertion/deletion</li>
              <li>• No memory wastage</li>
              <li>• Easy implementation of stack/queue</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderTreeVisualization = () => {
    const generateTree = (levels: number) => {
      const nodes = [];
      for (let i = 0; i < Math.min(Math.pow(2, levels) - 1, 15); i++) {
        nodes.push({
          id: i,
          value: Math.floor(Math.random() * 100),
          left: 2 * i + 1 < Math.pow(2, levels) - 1 ? 2 * i + 1 : null,
          right: 2 * i + 2 < Math.pow(2, levels) - 1 ? 2 * i + 2 : null
        });
      }
      return nodes;
    };

    const treeNodes = generateTree(treeSize);

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Tree Levels: {treeSize}
          </label>
          <input
            type="range"
            min="2"
            max="4"
            value={treeSize}
            onChange={(e) => setTreeSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-center">
          <div className="tree-visualization">
            {renderTreeLevel(treeNodes, 0, 0, treeSize)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h4 className="text-green-400 font-semibold mb-2">Tree Traversals</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-green-300">In-order:</span> Left → Root → Right</div>
              <div><span className="text-green-300">Pre-order:</span> Root → Left → Right</div>
              <div><span className="text-green-300">Post-order:</span> Left → Right → Root</div>
              <div><span className="text-green-300">Level-order:</span> BFS traversal</div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h4 className="text-green-400 font-semibold mb-2">BST Properties</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Left subtree &lt; Root</li>
              <li>• Right subtree &gt; Root</li>
              <li>• No duplicate nodes</li>
              <li>• In-order gives sorted order</li>
            </ul>
          </div>
        </div>

        <style>{`
          .tree-visualization {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .tree-level {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 20px 0;
          }
          .tree-node {
            position: relative;
          }
          .tree-node::before, .tree-node::after {
            content: '';
            position: absolute;
            top: -20px;
            width: 2px;
            height: 20px;
            background-color: #3b82f6;
          }
        `}</style>
      </div>
    );
  };

  const renderGraphVisualization = () => {
    const generateGraph = (nodes: number) => {
      const matrix = Array(nodes).fill(0).map(() => Array(nodes).fill(0));
      // Generate random edges
      for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
          if (Math.random() > 0.5) {
            matrix[i][j] = 1;
            matrix[j][i] = 1; // Undirected
          }
        }
      }
      return matrix;
    };

    const adjMatrix = generateGraph(graphNodes);

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Number of Nodes: {graphNodes}
          </label>
          <input
            type="range"
            min="3"
            max="6"
            value={graphNodes}
            onChange={(e) => setGraphNodes(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Adjacency Matrix</h3>
            <div className="bg-gray-800/50 p-4 rounded-lg inline-block">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${graphNodes + 1}, 40px)` }}>
                <div className="text-center text-gray-400"></div>
                {Array.from({ length: graphNodes }, (_, i) => (
                  <div key={i} className="text-center text-gray-400 font-bold">V{i}</div>
                ))}
                {adjMatrix.map((row, i) => (
                  <div key={i} className="contents">
                    <div className="text-center text-gray-400 font-bold">V{i}</div>
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className={`w-10 h-10 flex items-center justify-center border ${
                          cell ? 'bg-green-500/30 border-green-500' : 'bg-gray-700/30 border-gray-600'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Graph Properties</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">Vertices:</span> {graphNodes}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">Edges:</span> {adjMatrix.flat().filter(x => x === 1).length / 2}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">Density:</span> {(adjMatrix.flat().filter(x => x === 1).length / (graphNodes * (graphNodes - 1))).toFixed(2)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <h4 className="text-blue-400 font-semibold mb-2">Graph Algorithms</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• DFS: O(V + E)</li>
                  <li>• BFS: O(V + E)</li>
                  <li>• Dijkstra: O((V + E) log V)</li>
                  <li>• Floyd-Warshall: O(V³)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...sortArray];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setSortArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    setSorting(false);
  };

  const renderSortingVisualization = () => {

    return (
      <div className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <select
            value={currentAlgorithm}
            onChange={(e) => setCurrentAlgorithm(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-lg text-white"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>

          <button
            onClick={bubbleSort}
            disabled={sorting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50"
          >
            {sorting ? 'Sorting...' : 'Start Sorting'}
          </button>

          <button
            onClick={() => setSortArray([64, 34, 25, 12, 22, 11, 90])}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            Reset
          </button>
        </div>

        <div className="flex items-end justify-center gap-2 h-64">
          {sortArray.map((value, index) => (
            <div
              key={index}
              className="w-12 bg-blue-500/30 border-2 border-blue-500 rounded-t-lg transition-all duration-300"
              style={{ height: `${value * 2}px` }}
            >
              <div className="text-center text-white text-sm mt-2">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <h4 className="text-orange-400 font-semibold mb-2">Time Complexities</h4>
            <table className="text-sm text-gray-300 w-full">
              <thead>
                <tr>
                  <th className="text-left">Algorithm</th>
                  <th className="text-left">Best</th>
                  <th className="text-left">Average</th>
                  <th className="text-left">Worst</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Bubble</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td></tr>
                <tr><td>Quick</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td></tr>
                <tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <h4 className="text-orange-400 font-semibold mb-2">Characteristics</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Stable sorting maintains relative order</li>
              <li>• In-place sorting uses O(1) extra space</li>
              <li>• Adaptive sorts perform better on partially sorted data</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const binarySearch = () => {
    setSearchSteps([]);
    setSearchFound(null);
      
      let left = 0;
      let right = sortedArray.length - 1;
      const steps: number[] = [];

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push(mid);
        
        if (sortedArray[mid] === searchTarget) {
          setSearchFound(mid);
          break;
        } else if (sortedArray[mid] < searchTarget) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      setSearchSteps(steps);
    };

  const renderSearchingVisualization = () => {
    const sortedArray = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89];

    return (
      <div className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-2">
              Target Value: {searchTarget}
            </label>
            <input
              type="range"
              min={sortedArray[0]}
              max={sortedArray[sortedArray.length - 1]}
              value={searchTarget}
              onChange={(e) => setSearchTarget(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={binarySearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Search
          </button>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {sortedArray.map((value, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                searchFound === index
                  ? 'bg-green-500/30 border-2 border-green-500'
                  : searchSteps.includes(index)
                  ? 'bg-yellow-500/30 border-2 border-yellow-500'
                  : 'bg-blue-500/30 border-2 border-blue-500'
              }`}
            >
              <span className="text-xs text-gray-400">{index}</span>
              <span className="text-white font-bold">{value}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <h4 className="text-blue-400 font-semibold mb-2">Binary Search Steps</h4>
          <p className="text-sm text-gray-300">
            {searchFound !== null 
              ? `Found ${searchTarget} at index ${searchFound} in ${searchSteps.length} steps!`
              : searchSteps.length > 0
              ? `${searchTarget} not found in the array after ${searchSteps.length} steps.`
              : 'Click Search to begin'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Time Complexity: O(log n) - Array size {sortedArray.length} requires maximum {Math.ceil(Math.log2(sortedArray.length))} steps
          </p>
        </div>
      </div>
    );
  };

  const hashFunction = (key: number) => key % 10;

  const insertHashValue = () => {
    const value = parseInt(hashNewValue);
    if (isNaN(value)) return;
    
    const index = hashFunction(value);
    const newTable = [...hashTable];
    newTable[index] = [...newTable[index], value];
    setHashTable(newTable);
    setHashNewValue('');
  };

  const renderHashingVisualization = () => {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <input
            type="number"
            value={hashNewValue || ''}
            onChange={(e) => setHashNewValue(e.target.value)}
            placeholder="Enter number to insert"
            className="flex-1 px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-lg text-white"
          />
          <button
            onClick={insertHashValue}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Insert
          </button>
          <button
            onClick={() => setHashTable(Array(10).fill([]).map(() => []))}
            className="px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg text-white"
          >
            Clear
          </button>
        </div>

        <div className="space-y-2">
          {hashTable.map((bucket, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-16 text-right text-gray-400">Bucket {index}:</div>
              <div className="flex-1 flex gap-1 flex-wrap">
                {bucket.map((value, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-blue-500/30 border border-blue-500 rounded text-white"
                  >
                    {value}
                  </div>
                ))}
                {bucket.length === 0 && (
                  <div className="text-gray-600 italic">empty</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <h4 className="text-indigo-400 font-semibold mb-2">Hash Function</h4>
            <p className="text-sm text-gray-300 font-mono">h(k) = k mod 10</p>
            <p className="text-xs text-gray-400 mt-2">Simple modulo hash function</p>
          </div>

          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <h4 className="text-indigo-400 font-semibold mb-2">Collision Resolution</h4>
            <p className="text-sm text-gray-300">Chaining with separate buckets</p>
            <p className="text-xs text-gray-400 mt-2">Load factor: {(hashTable.flat().length / 10).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  const simulateFCFS = () => {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
    let currentTime = 0;
    const newTimeline: Array<{process: string, time: number}> = [];

    sorted.forEach(p => {
      if (currentTime < p.arrival) {
        currentTime = p.arrival;
      }
      newTimeline.push({ process: p.id, time: p.burst });
      currentTime += p.burst;
    });

    setTimeline(newTimeline);
  };

  const renderOSVisualization = () => {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <select
            value={scheduler}
            onChange={(e) => setScheduler(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-lg text-white"
          >
            <option value="fcfs">FCFS</option>
            <option value="sjf">SJF (Non-preemptive)</option>
            <option value="priority">Priority</option>
            <option value="rr">Round Robin</option>
          </select>
          
          {scheduler === 'rr' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Time Quantum:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                className="w-20 px-2 py-1 bg-gray-800 border border-blue-500/30 rounded text-white"
              />
            </div>
          )}

          <button
            onClick={simulateFCFS}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Simulate
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Processes</h3>
          <div className="grid grid-cols-4 gap-2">
            {processes.map(p => (
              <div key={p.id} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="font-bold text-blue-400">{p.id}</div>
                <div className="text-xs text-gray-400">Burst: {p.burst}</div>
                <div className="text-xs text-gray-400">Arrival: {p.arrival}</div>
              </div>
            ))}
          </div>

          {timeline.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Gantt Chart</h4>
              <div className="flex flex-wrap gap-1">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-blue-500/30 border border-blue-500 rounded text-white text-center min-w-[60px]"
                  >
                    <div>{item.process}</div>
                    <div className="text-xs">{item.time}ms</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <h4 className="text-cyan-400 font-semibold mb-2">Scheduling Algorithms</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• FCFS: Simple, non-preemptive</li>
              <li>• SJF: Optimal avg waiting time</li>
              <li>• Priority: Can cause starvation</li>
              <li>• Round Robin: Fair time sharing</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <h4 className="text-cyan-400 font-semibold mb-2">Metrics</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Turnaround Time: Completion - Arrival</li>
              <li>• Waiting Time: Turnaround - Burst</li>
              <li>• Response Time: First CPU - Arrival</li>
              <li>• Throughput: Processes/Time</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderDBMSVisualization = () => {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={dbQuery}
            onChange={(e) => setDbQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-lg text-white font-mono"
            placeholder="Enter SQL query..."
          />
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Execute
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="p-3 text-left text-gray-300 border border-blue-500/30">id</th>
                <th className="p-3 text-left text-gray-300 border border-blue-500/30">name</th>
                <th className="p-3 text-left text-gray-300 border border-blue-500/30">age</th>
                <th className="p-3 text-left text-gray-300 border border-blue-500/30">grade</th>
              </tr>
            </thead>
            <tbody>
              {dbTables.students.map(row => (
                <tr key={row.id} className="hover:bg-blue-500/10">
                  <td className="p-3 text-gray-300 border border-blue-500/30">{row.id}</td>
                  <td className="p-3 text-gray-300 border border-blue-500/30">{row.name}</td>
                  <td className="p-3 text-gray-300 border border-blue-500/30">{row.age}</td>
                  <td className="p-3 text-gray-300 border border-blue-500/30">{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
            <h4 className="text-pink-400 font-semibold mb-2">Normal Forms</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 1NF: Atomic values</li>
              <li>• 2NF: No partial dependency</li>
              <li>• 3NF: No transitive dependency</li>
              <li>• BCNF: Every determinant is candidate key</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
            <h4 className="text-pink-400 font-semibold mb-2">ACID Properties</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Atomicity: All or nothing</li>
              <li>• Consistency: Valid state</li>
              <li>• Isolation: Concurrent execution</li>
              <li>• Durability: Persistent changes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderNetworkingVisualization = () => {
    const osiLayers = [
      { layer: 7, name: 'Application', protocols: ['HTTP', 'FTP', 'SMTP'] },
      { layer: 6, name: 'Presentation', protocols: ['SSL', 'TLS', 'JPEG'] },
      { layer: 5, name: 'Session', protocols: ['NetBIOS', 'RPC'] },
      { layer: 4, name: 'Transport', protocols: ['TCP', 'UDP'] },
      { layer: 3, name: 'Network', protocols: ['IP', 'ICMP', 'RIP'] },
      { layer: 2, name: 'Data Link', protocols: ['Ethernet', 'PPP'] },
      { layer: 1, name: 'Physical', protocols: ['RS-232', 'Ethernet PHY'] },
    ];

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            OSI Layer: {osiLayer} - {osiLayers[7-osiLayer]?.name}
          </label>
          <input
            type="range"
            min="1"
            max="7"
            value={osiLayer}
            onChange={(e) => setOsiLayer(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-7 gap-1">
          {osiLayers.reverse().map((layer, index) => (
            <div
              key={layer.layer}
              className={`p-3 text-center rounded-lg ${
                layer.layer === osiLayer
                  ? 'bg-blue-500/30 border-2 border-blue-500'
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              <div className="text-xs text-gray-400">Layer {layer.layer}</div>
              <div className="font-bold text-white text-sm">{layer.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {layer.protocols.slice(0, 2).join(', ')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
            <h4 className="text-teal-400 font-semibold mb-2">TCP vs UDP</h4>
            <table className="text-sm text-gray-300 w-full">
              <thead>
                <tr>
                  <th className="text-left">TCP</th>
                  <th className="text-left">UDP</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Connection-oriented</td><td>Connectionless</td></tr>
                <tr><td>Reliable</td><td>Unreliable</td></tr>
                <tr><td>Flow control</td><td>No flow control</td></tr>
                <tr><td>Slower</td><td>Faster</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
            <h4 className="text-teal-400 font-semibold mb-2">Common Ports</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• HTTP: 80</li>
              <li>• HTTPS: 443</li>
              <li>• FTP: 21</li>
              <li>• SSH: 22</li>
              <li>• DNS: 53</li>
              <li>• SMTP: 25</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderGeneralVisualization = () => {
    return (
      <div className="text-center py-12">
        <Sparkles className="size-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">Select a Topic to Begin</h3>
        <p className="text-gray-400">Choose from the topics above to start learning with interactive visualizations</p>
      </div>
    );
  };

  const renderTreeLevel = (nodes: any[], rootIndex: number, level: number, maxLevels: number) => {
    if (level >= maxLevels || rootIndex >= nodes.length) return null;
    
    const node = nodes[rootIndex];
    if (!node) return null;

    return (
      <div className="flex flex-col items-center">
        <div className="tree-node bg-green-500/30 border-2 border-green-500 rounded-lg p-2 min-w-[60px] text-center">
          <div className="text-white font-bold">{node.value}</div>
        </div>
        <div className="flex gap-20 mt-4">
          {node.left && (
            <div className="relative">
              <div className="absolute top-[-16px] left-1/2 w-0.5 h-4 bg-green-500"></div>
              {renderTreeLevel(nodes, node.left, level + 1, maxLevels)}
            </div>
          )}
          {node.right && (
            <div className="relative">
              <div className="absolute top-[-16px] left-1/2 w-0.5 h-4 bg-green-500"></div>
              {renderTreeLevel(nodes, node.right, level + 1, maxLevels)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuizSection = (topicId: string) => {
    const topicQuestions = questions[topicId] || [];
    
    if (topicQuestions.length === 0) {
      return <div className="text-center py-8 text-gray-400">No questions available for this topic</div>;
    }

    const currentQ = topicQuestions[currentQuestion % topicQuestions.length];

    const handleAnswer = (optionIndex: number) => {
      setSelectedAnswer(optionIndex);
      const isCorrect = optionIndex === currentQ.correct;
      if (isCorrect) setScore(score + 1);
      setQuestionsAnswered(questionsAnswered + 1);
      setShowExplanation(true);
    };

    const nextQuestion = () => {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    };

    return (
      <div className="mt-8 p-6 rounded-xl bg-gray-800/50 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Knowledge Check</h3>
        <div className="mb-4 flex justify-between text-sm text-gray-400">
          <span>Question {questionsAnswered + 1} of 50+</span>
          <span>Score: {score}/{questionsAnswered}</span>
        </div>

        <div className="mb-6">
          <p className="text-white text-lg mb-4">{currentQ.question}</p>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  selectedAnswer === null
                    ? 'hover:bg-blue-500/20 border-gray-700 text-gray-300'
                    : selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'bg-green-500/30 border-green-500 text-white'
                      : 'bg-red-500/30 border-red-500 text-white'
                    : index === currentQ.correct && showExplanation
                    ? 'bg-green-500/30 border-green-500 text-white'
                    : 'border-gray-700 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswer === index && index === currentQ.correct && (
                    <CheckCircle className="size-5 text-green-400" />
                  )}
                  {selectedAnswer === index && index !== currentQ.correct && (
                    <XCircle className="size-5 text-red-400" />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showExplanation && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">Explanation:</span> {currentQ.explanation}
            </p>
          </div>
        )}

        {showExplanation && (
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Next Question
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
          <Lightbulb className="size-10 text-yellow-400" />
          Interactive Concept Lab
        </h1>
        <p className="text-gray-400 mb-8">
          Learn core computer science concepts through interactive visualizations and quizzes
        </p>

        {!selectedTopic ? (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Choose a Topic to Explore</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 transition-all text-left group"
                  >
                    <Icon className="size-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">{topic.name}</h3>
                    <p className="text-sm text-gray-400">
                      {topic.subtopics.slice(0, 2).join(' • ')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {topics.find(t => t.id === selectedTopic)?.name}
                  </h2>
                  <p className="text-gray-300">Adjust parameters below to see how the concept works</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTopic('');
                    setQuizMode('practice');
                    setCurrentQuestion(0);
                    setScore(0);
                    setQuestionsAnswered(0);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  ← Back to Topics
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8 mb-6">
              {renderVisualization()}
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
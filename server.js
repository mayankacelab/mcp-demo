const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));  // Serve static files from current directory

// MCP Server Implementation
class MCPServer {
  constructor() {
    this.tools = new Map();
    this.resources = new Map();
    this.prompts = new Map();
    
    // Initialize with sample tools
    this.initializeSampleTools();
  }

  initializeSampleTools() {
    // Sample tool: Calculator
    this.tools.set('calculator', {
      name: 'calculator',
      description: 'Perform basic mathematical calculations',
      inputSchema: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description: 'The mathematical operation to perform'
          },
          a: {
            type: 'number',
            description: 'First number'
          },
          b: {
            type: 'number',
            description: 'Second number'
          }
        },
        required: ['operation', 'a', 'b']
      }
    });

    // Sample tool: Text processor
    this.tools.set('text_processor', {
      name: 'text_processor',
      description: 'Process text with various operations',
      inputSchema: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['uppercase', 'lowercase', 'reverse', 'length'],
            description: 'The text operation to perform'
          },
          text: {
            type: 'string',
            description: 'The text to process'
          }
        },
        required: ['operation', 'text']
      }
    });

    // Sample resource
    this.resources.set('demo_data', {
      uri: 'demo://sample-data',
      name: 'Sample Data',
      description: 'Sample data resource for demonstration',
      mimeType: 'application/json'
    });
  }

  // MCP Protocol Methods
  async listTools() {
    return {
      tools: Array.from(this.tools.values())
    };
  }

  async callTool(name, args) {
    if (!this.tools.has(name)) {
      throw new Error(`Tool "${name}" not found`);
    }

    switch (name) {
      case 'calculator':
        return this.executeCalculator(args);
      case 'text_processor':
        return this.executeTextProcessor(args);
      default:
        throw new Error(`Tool "${name}" not implemented`);
    }
  }

  async executeCalculator({ operation, a, b }) {
    let result;
    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          throw new Error('Division by zero is not allowed');
        }
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Result: ${result}`
        }
      ]
    };
  }

  async executeTextProcessor({ operation, text }) {
    let result;
    switch (operation) {
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      case 'length':
        result = text.length.toString();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Result: ${result}`
        }
      ]
    };
  }

  async listResources() {
    return {
      resources: Array.from(this.resources.values())
    };
  }

  async readResource(uri) {
    if (uri === 'demo://sample-data') {
      return {
        contents: [
          {
            uri: uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              message: 'Hello from MCP server!',
              timestamp: new Date().toISOString(),
              data: {
                users: ['Alice', 'Bob', 'Charlie'],
                version: '1.0.0'
              }
            }, null, 2)
          }
        ]
      };
    }
    
    throw new Error(`Resource not found: ${uri}`);
  }

  async initialize() {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {
          listChanged: false
        },
        resources: {
          subscribe: false,
          listChanged: false
        },
        prompts: {
          listChanged: false
        }
      },
      serverInfo: {
        name: 'MCP Demo Server',
        version: '1.0.0'
      }
    };
  }
}

// Create MCP server instance
const mcpServer = new MCPServer();

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'MCP Demo Server',
    version: '1.0.0',
    description: 'A basic MCP server with HTTP endpoints',
    endpoints: {
      initialize: 'POST /mcp/initialize',
      listTools: 'POST /mcp/tools/list',
      callTool: 'POST /mcp/tools/call',
      listResources: 'POST /mcp/resources/list',
      readResource: 'POST /mcp/resources/read'
    }
  });
});

// MCP Protocol Endpoints
app.post('/mcp/initialize', async (req, res) => {
  try {
    const result = await mcpServer.initialize();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mcp/tools/list', async (req, res) => {
  try {
    const result = await mcpServer.listTools();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Tool name is required' });
    }
    const result = await mcpServer.callTool(name, args || {});
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/mcp/resources/list', async (req, res) => {
  try {
    const result = await mcpServer.listResources();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mcp/resources/read', async (req, res) => {
  try {
    const { uri } = req.body;
    if (!uri) {
      return res.status(400).json({ error: 'Resource URI is required' });
    }
    const result = await mcpServer.readResource(uri);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Demo Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;
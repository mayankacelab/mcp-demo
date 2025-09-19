# MCP Demo Server

A basic implementation of the Model Context Protocol (MCP) server with HTTP support. This project demonstrates how to create and consume an MCP server that can be hosted locally and accessed via HTTP endpoints.

## Features

- ✅ HTTP-based MCP server implementation
- 🔧 Sample tools (calculator, text processor)
- 📚 Resource management
- 🚀 Simple client library for consumption
- 🌐 CORS enabled for browser usage
- 💚 Health monitoring

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-demo
```

2. Install dependencies:
```bash
npm install
```

### Running the Server

Start the MCP server:
```bash
npm start
```

The server will be available at `http://localhost:3000`

For development with auto-reload:
```bash
npm run dev
```

### Testing the Client

In a separate terminal, run the demo client:
```bash
npm run client
```

This will demonstrate:
- Server initialization
- Tool listing and execution
- Resource reading
- Error handling

## API Endpoints

### Core MCP Protocol

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/initialize` | POST | Initialize connection with server |
| `/mcp/tools/list` | POST | List available tools |
| `/mcp/tools/call` | POST | Execute a specific tool |
| `/mcp/resources/list` | POST | List available resources |
| `/mcp/resources/read` | POST | Read a specific resource |

### Utility Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Server information and API documentation |
| `/health` | GET | Health check endpoint |

## Available Tools

### Calculator
Perform basic mathematical operations.

**Usage:**
```bash
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "calculator",
    "arguments": {
      "operation": "add",
      "a": 10,
      "b": 5
    }
  }'
```

**Operations:** `add`, `subtract`, `multiply`, `divide`

### Text Processor
Process text with various operations.

**Usage:**
```bash
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "text_processor",
    "arguments": {
      "operation": "uppercase",
      "text": "hello world"
    }
  }'
```

**Operations:** `uppercase`, `lowercase`, `reverse`, `length`

## Using the Client Library

```javascript
const { MCPClient } = require('./client');

const client = new MCPClient('http://localhost:3000');

// Initialize connection
await client.initialize();

// List available tools
const tools = await client.listTools();

// Call a tool
const result = await client.callTool('calculator', {
  operation: 'multiply',
  a: 6,
  b: 7
});

// Read a resource
const data = await client.readResource('demo://sample-data');
```

## Browser Usage

Since the server includes CORS support, you can also use it from the browser:

### Option 1: Interactive HTML Demo

Open `demo.html` in your browser while the server is running. This provides a user-friendly interface to:
- Check server health and initialize connection
- List and call available tools
- Test calculator and text processor tools
- Browse and read resources

### Option 2: JavaScript Fetch API

```javascript
// Fetch available tools
fetch('http://localhost:3000/mcp/tools/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => console.log(data));

// Call a tool
fetch('http://localhost:3000/mcp/tools/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'calculator',
    arguments: { operation: 'add', a: 5, b: 3 }
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Project Structure

```
mcp-demo/
├── server.js          # Main MCP server implementation
├── client.js          # Client library and demo
├── demo.html          # Interactive browser demo
├── package.json       # Project configuration
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

## Configuration

The server can be configured using environment variables:

- `PORT`: Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Error Handling

The server provides detailed error messages for:
- Invalid tool names
- Missing required parameters
- Invalid operations
- Resource not found errors
- Server initialization issues

## Development

### Adding New Tools

To add a new tool:

1. Add the tool definition in `initializeSampleTools()`:
```javascript
this.tools.set('my_tool', {
  name: 'my_tool',
  description: 'My custom tool',
  inputSchema: {
    // Define your schema here
  }
});
```

2. Implement the tool logic in `callTool()`:
```javascript
case 'my_tool':
  return this.executeMyTool(arguments);
```

3. Create the execution method:
```javascript
async executeMyTool(args) {
  // Your tool implementation
  return {
    content: [{ type: 'text', text: 'Result' }]
  };
}
```

### Adding New Resources

Add resources in `initializeSampleTools()` and handle them in `readResource()`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
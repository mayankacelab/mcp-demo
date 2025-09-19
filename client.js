const axios = require('axios');

class MCPClient {
  constructor(serverUrl = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
    this.axios = axios.create({
      baseURL: serverUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async initialize() {
    try {
      const response = await this.axios.post('/mcp/initialize');
      console.log('✅ Server initialized:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      throw error;
    }
  }

  async listTools() {
    try {
      const response = await this.axios.post('/mcp/tools/list');
      console.log('🔧 Available tools:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to list tools:', error.message);
      throw error;
    }
  }

  async callTool(name, args) {
    try {
      const response = await this.axios.post('/mcp/tools/call', {
        name,
        arguments: args
      });
      console.log(`🚀 Tool "${name}" result:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to call tool "${name}":`, error.response?.data?.error || error.message);
      throw error;
    }
  }

  async listResources() {
    try {
      const response = await this.axios.post('/mcp/resources/list');
      console.log('📚 Available resources:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to list resources:', error.message);
      throw error;
    }
  }

  async readResource(uri) {
    try {
      const response = await this.axios.post('/mcp/resources/read', { uri });
      console.log(`📖 Resource "${uri}" content:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to read resource "${uri}":`, error.response?.data?.error || error.message);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await this.axios.get('/health');
      console.log('💚 Server health:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      throw error;
    }
  }
}

// Demo function to showcase the client
async function runDemo() {
  console.log('🎯 Starting MCP Client Demo\n');
  
  const client = new MCPClient();

  try {
    // Check server health
    await client.checkHealth();
    console.log('\n' + '='.repeat(50) + '\n');

    // Initialize connection
    await client.initialize();
    console.log('\n' + '='.repeat(50) + '\n');

    // List available tools
    await client.listTools();
    console.log('\n' + '='.repeat(50) + '\n');

    // Test calculator tool
    console.log('🧮 Testing Calculator Tool:');
    await client.callTool('calculator', {
      operation: 'add',
      a: 15,
      b: 25
    });

    await client.callTool('calculator', {
      operation: 'multiply',
      a: 7,
      b: 8
    });
    console.log('\n' + '='.repeat(50) + '\n');

    // Test text processor tool
    console.log('📝 Testing Text Processor Tool:');
    await client.callTool('text_processor', {
      operation: 'uppercase',
      text: 'hello world'
    });

    await client.callTool('text_processor', {
      operation: 'reverse',
      text: 'MCP Demo'
    });
    console.log('\n' + '='.repeat(50) + '\n');

    // List and read resources
    await client.listResources();
    console.log('\n' + '-'.repeat(30) + '\n');
    
    await client.readResource('demo://sample-data');

    console.log('\n🎉 Demo completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Demo failed:', error.message);
    process.exit(1);
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  console.log('Make sure the MCP server is running on http://localhost:3000');
  console.log('You can start it with: npm start\n');
  
  setTimeout(() => {
    runDemo().catch(console.error);
  }, 1000); // Give server a moment to start if needed
}

module.exports = { MCPClient, runDemo };
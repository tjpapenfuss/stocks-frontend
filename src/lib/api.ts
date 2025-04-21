import axios from 'axios';

// Base URL for your API
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create an axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to execute GraphQL queries
export async function executeGraphQL(query: string, variables = {}) {
  try {
    const response = await api.post('/graphql', {
      query,
      variables,
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

// Stock-related API calls
export const stocksApi = {
  // Get a list of symbols
  getSymbols: async () => {
    const query = `
      query {
        symbols {
          symbol
        }
      }
    `;
    
    const data = await executeGraphQL(query);
    return data.symbols;
  },
  
  // Get positions with pagination
  getPositions: async (first = 10, after: string | null = null) => {
    const query = `
      query GetPositions($first: Int, $after: String) {
        positions(first: $first, after: $after) {
          edges {
            cursor
            node {
              symbol
              buy_price
              original_quantity
              remaining_quantity
              buy_datetime
              buy_order_id
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;
    
    const variables = { first, after };
    const data = await executeGraphQL(query, variables);
    return data.positions;
  },
  
  // Get a single position by symbol
  getPosition: async (symbol: string) => {
    const query = `
      query GetPosition($symbol: String!) {
        position(symbol: $symbol) {
          symbol
          buy_price
          original_quantity
          remaining_quantity
          buy_datetime
          buy_order_id
        }
      }
    `;
    
    const variables = { symbol };
    const data = await executeGraphQL(query, variables);
    return data.position;
  },
  
  // Get loss leaders with pagination
  getLossLeaders: async (
    first = 10, 
    after: string | null = null, 
    daysBack = 1, 
    dropThreshold = 10.0
  ) => {
    const query = `
      query GetLossLeaders($first: Int, $after: String, $daysBack: Int, $dropThreshold: Float) {
        lossLeaders(first: $first, after: $after, daysBack: $daysBack, dropThreshold: $dropThreshold) {
          edges {
            cursor
            node {
              symbol
              percentageDrop
              buyPrice
              currentPrice
              quantity
              dollarLoss
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;
    
    const variables = { first, after, daysBack, dropThreshold };
    const data = await executeGraphQL(query, variables);
    return data.lossLeaders;
  }
  
};

// Helper to format date for API requests
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export default api;
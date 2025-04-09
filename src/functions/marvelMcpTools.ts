import { app, InvocationContext } from '@azure/functions';
import { config } from 'dotenv';
import { convertZodSchema } from './zodUtils.js';
import { z } from 'zod';
import { marvelTools } from '../tools/tools.js';

config();

/**
 * Convert a value to the appropriate type based on a Zod schema
 */
function convertValueToSchemaType(value: any, schema: z.ZodTypeAny): any {
    // Handle undefined/null
    if (value === undefined || value === null) {
        return value;
    }
    
    // Unwrap optional type to get the base type
    let unwrappedSchema = schema instanceof z.ZodOptional ? schema.unwrap() : schema;
    
    // Convert based on schema type
    if (unwrappedSchema instanceof z.ZodNumber) {
        return Number(value);
    } else if (unwrappedSchema instanceof z.ZodBoolean) {
        return value === 'true' || value === true;
    }
    
    // Default: return as is (string, etc.)
    return value;
}

// Register each tool with the MCP system
Object.entries(marvelTools).forEach(([name, tool]) => {
    app.mcpTool(name, {
        toolName: name,
        description: tool.description,
        toolProperties: convertZodSchema(tool.schema),
        handler: async (_toolArguments: unknown, context: InvocationContext): Promise<any> => {
            context.log(`Executing Marvel API tool: ${name}`);
            
            try {
                // Get and log the raw arguments
                const rawArgs = context.triggerMetadata?.mcptoolargs || {};
                context.log(`Raw args for ${name}:`, rawArgs);
                
                // Get the schema shape for type checking
                const schemaShape = tool.schema.shape as Record<string, z.ZodTypeAny>;
                
                // Process all arguments with type conversion
                const processedArgs = Object.fromEntries(
                    Object.entries(rawArgs)
                        .filter(([_, value]) => value !== undefined && value !== null)
                        .map(([key, value]) => [
                            key, 
                            schemaShape[key] 
                                ? convertValueToSchemaType(value, schemaShape[key])
                                : value
                        ])
                );
                
                // Call the handler with processed arguments
                return await tool.handler(processedArgs);
            } catch (error) {
                context.error(`Error executing Marvel tool ${name}:`, error);
                throw error;
            }
        }
    });
});
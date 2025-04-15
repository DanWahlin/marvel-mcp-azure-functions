import { app, InvocationContext } from '@azure/functions';
import { config } from 'dotenv';
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

import { get_character_by_id } from '../tools/get_character_by_id/index.js';
import { get_characters } from '../tools/get_characters/index.js';

// app.mcpTool('get_character_by_id', {
//     toolName: 'get_character_by_id',
//     description: get_character_by_id.description,
//     toolProperties: get_character_by_id.schema,
//     handler: async (_toolArguments: unknown, context: InvocationContext): Promise<any> => {

//     }
// });

app.mcpTool('get_characters', {
    toolName: 'get_characters',
    description: get_characters.description,
    toolProperties: get_characters.schema,
    handler: async (_toolArguments: unknown, context: InvocationContext): Promise<any> => {
            context.log(`Executing Marvel API tool: get_characters`);
            
            try {
                // Get and log the raw arguments
                const rawArgs = context.triggerMetadata?.mcptoolargs || {};
                context.log(`Raw args for get_characters`, rawArgs);
                
                // Get the schema shape for type checking
                const schemaShape = get_characters.schema.shape as Record<string, z.ZodTypeAny>;
                
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
                return await get_characters.handler(processedArgs);
            } catch (error) {
                context.error(`Error executing Marvel tool ${name}:`, error);
                throw error;
            }
        }
    });

// Register each tool with the MCP system
// Object.entries(marvelTools).forEach(([name, tool]) => {
//     app.mcpTool(name, {
//         toolName: name,
//         description: tool.description,
//         toolProperties: tool.schema,
//         handler: async (_toolArguments: unknown, context: InvocationContext): Promise<any> => {
//             context.log(`Executing Marvel API tool: ${name}`);
            
//             try {
//                 // Get and log the raw arguments
//                 const rawArgs = context.triggerMetadata?.mcptoolargs || {};
//                 context.log(`Raw args for ${name}:`, rawArgs);
                
//                 // Get the schema shape for type checking
//                 const schemaShape = tool.schema.shape as Record<string, z.ZodTypeAny>;
                
//                 // Process all arguments with type conversion
//                 const processedArgs = Object.fromEntries(
//                     Object.entries(rawArgs)
//                         .filter(([_, value]) => value !== undefined && value !== null)
//                         .map(([key, value]) => [
//                             key, 
//                             schemaShape[key] 
//                                 ? convertValueToSchemaType(value, schemaShape[key])
//                                 : value
//                         ])
//                 );
                
//                 // Call the handler with processed arguments
//                 return await tool.handler(processedArgs);
//             } catch (error) {
//                 context.error(`Error executing Marvel tool ${name}:`, error);
//                 throw error;
//             }
//         }
//     });
// });
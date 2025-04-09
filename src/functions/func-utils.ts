import { z } from "zod";

/**
 * Converts a Zod schema object to a format compatible with Azure Functions toolProperties
 * 
 * @param schema The Zod schema to convert
 * @returns An object with the same shape but with Zod validators that include descriptions
 */
export function convertZodSchema(schema: z.ZodObject<any>): Record<string, z.ZodTypeAny> {
    return Object.fromEntries(
      Object.entries(schema.shape || {}).map(([key, value]) => {
        // Determine the underlying type of the Zod schema
        let zodType = "string"; // Default to string
        
        // Map Zod types to valid JSON schema types
        if (value instanceof z.ZodString) {
          zodType = "string";
        } else if (value instanceof z.ZodNumber || value instanceof z.ZodBigInt) {
          zodType = "number";
        } else if (value instanceof z.ZodBoolean) {
          zodType = "boolean";
        } else if (value instanceof z.ZodArray) {
          zodType = "array";
        } else if (value instanceof z.ZodObject) {
          zodType = "object";
        } else if (value instanceof z.ZodNull) {
          zodType = "null";
        } else if (value instanceof z.ZodOptional || value instanceof z.ZodNullable) {
          // Extract the inner type for Optional and Nullable types
          const innerType = (value as any)._def.innerType;
          // Make sure innerType is a valid ZodTypeAny before calling the helper function
          if (innerType && typeof innerType === 'object') {
            return [key, convertZodTypeWithDescription(innerType as z.ZodTypeAny, (value as any)._def.description)];
          }
        }
        
        // Preserve any descriptions from the original schema if available
        // Make sure value is a valid ZodTypeAny
        if (value && typeof value === 'object') {
          return [key, convertZodTypeWithDescription(value as z.ZodTypeAny, (value as any)._def?.description, zodType)];
        }
        
        // Fallback for any unrecognized type
        return [key, z.string()];
      })
    );
  }
  
  /**
   * Helper function to create a Zod type with proper description and JSON Schema type
   */
  function convertZodTypeWithDescription(
    zodValue: z.ZodTypeAny, 
    description?: string, 
    type: string = "string"
  ): z.ZodTypeAny {
    // Create the appropriate Zod type based on the determined type
    let result: z.ZodTypeAny;
    
    switch (type) {
      case "number":
        result = z.number();
        break;
      case "boolean":
        result = z.boolean();
        break;
      case "array":
        result = z.array(z.any());
        break;
      case "object":
        result = z.object({});
        break;
      case "null":
        result = z.null();
        break;
      case "string":
      default:
        result = z.string();
        break;
    }
    
    // Add description if available
    if (description) {
      return result.describe(description);
    }
    
    return result;
  }
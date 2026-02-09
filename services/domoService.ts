
import domo from 'ryuu.js';
import { Fileset, SearchResponse, AiResponse, FilesetSearchResponse } from '../types';

export const DEFAULT_FILESET_ID = '5c4b7115-1d86-4e81-b865-4f17339090ae';

/**
 * Lists all AI-enabled filesets available in the Domo instance.
 */
export const getFilesets = async (): Promise<Fileset[]> => {
  try {
    const body = {
      fieldSort: [{ field: 'name', order: 'ASC' }],
      filters: [{ field: 'ai_enabled', value: [true], operator: 'EQUALS' }],
    };

    const response: FilesetSearchResponse = await domo.post('/domo/files/v1/filesets/search', body);
    
    // Ensure the default fileset is in the list if it's not already returned
    const fileSets = response.fileSets || [];
    const hasDefault = fileSets.some(f => f.id === DEFAULT_FILESET_ID);
    
    if (!hasDefault) {
      return [{ id: DEFAULT_FILESET_ID, name: 'Default Privacy Knowledge Base' }, ...fileSets];
    }
    
    return fileSets;
  } catch (error) {
    console.error('Error fetching filesets:', error);
    return [{ id: DEFAULT_FILESET_ID, name: 'Default Privacy Knowledge Base' }];
  }
};

/**
 * Performs a RAG chat flow: searches a fileset and generates an AI response.
 */
export const handleRagChat = async (
  userQuery: string,
  fileSetId: string
): Promise<{ text: string; sources: string[] }> => {
  try {
    // 1. Search the fileset
    const searchResult: SearchResponse = await domo.post(`/domo/files/v1/filesets/${fileSetId}/query`, {
      query: userQuery,
      directoryPath: "",
      topK: 3,
    });

    // 2. Extract document context and sources
    const matches = searchResult.matches || [];
    const sources = Array.from(new Set(matches.map((m) => m.metadata.path)));
    
    const documentContext = matches
      .map((m) => `[Source: ${m.metadata.path}]\n${m.content.text}`)
      .join('\n\n---\n\n');

    // 3. Build the augmented prompt with an International Data Privacy persona
    const prompt = `You are "PrivacyGuard AI", a world-class expert in International Data Privacy regulations (GDPR, CCPA, LGPD, etc.). 
Use the following retrieved documentation from the organization's knowledge base to answer the user's question accurately. 
If the information is not in the documentation, use your general knowledge but specify that it is general advice.
Keep the tone professional, helpful, and focused on compliance.

DOCUMENTATION:
${documentContext || "No specific documents found in the knowledge base."}

USER QUESTION:
${userQuery}`;

    // 4. Generate AI response
    const aiResponse: AiResponse = await domo.post(`/domo/ai/v1/text/generation`, { input: prompt });
    const aiText = aiResponse.choices?.[0]?.output || "I'm sorry, I couldn't generate a response at this time.";

    return { text: aiText, sources };
  } catch (error) {
    console.error('Error in RAG workflow:', error);
    return { 
      text: "I encountered an error while processing your request. Please ensure the fileset is correctly configured for AI.", 
      sources: [] 
    };
  }
};

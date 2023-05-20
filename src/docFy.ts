import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';
import { prompt } from './prompt';
import { message } from './utils/message';

const main = async (code: any, fileName: string, languageId: string, apiKey: string) => {

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'user',
        content: `
          # File Name:
          ${fileName}
          # Language ID: (se não constar, analise o código e entenda qual a linguagem)
          ${languageId}
          # Code: 
          ${code}
        `,
      },
    ],
  });

  const newCode = `${completion.data.choices[0].message?.content}`;

  return newCode;
};

export const docFy = async (code: any, fileName: string, languageId: string) => {

  let newCode: string = code;

  const apiKey = vscode.workspace.getConfiguration().get('extension.apiKey') as string;
  if(!apiKey || apiKey === ''){
    message('ApiKey not found');
    return;
  }

  try{
    newCode = await main(code, fileName, languageId, apiKey);
  }
  catch(e){
    message("Error, Is ApiKey defined or valid?");
    return {error: true};
  }

  message('Loaded!👨‍💻');
  return newCode;

};
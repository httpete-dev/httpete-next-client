import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { baseUrl } from '~/model';
import axios from 'axios';
import os from 'os';

function getDbDirectory(): string {
    const platform = process.platform;
    
    if (platform === 'win32') {
        // Windows: %LOCALAPPDATA%/httpete/db/
        const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
        return path.join(localAppData, 'httpete', 'db');
    } else {
        // Mac/Linux: ~/.httpete/db/
        return path.join(os.homedir(), '.httpete', 'db');
    }
}

function minify(str: string) {
    let result = "";

    for (let i = 0; i < str.length; i++) {
        let element = str[i];
        
        if (element === '\r' || element === '\n' || element === ' ' || element === '\t')
            element = '';

        result += element;
    }

    return result;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${baseUrl}/workspace/get-for-user?userId=${userId}`);
        const workspaces = response.data;
        
        searchParams.set('userId', userId);
        searchParams.set('ws', workspaces[0]?.id);
        searchParams.set('oId', workspaces[0].organizationId);
        

        // Get the appropriate directory based on OS
        const dbDir = getDbDirectory();
        
        // Create all necessary directories recursively
        await fs.mkdir(dbDir, { recursive: true });
        
        // Save workspaces data to JSON file
        const filePath = path.join(dbDir, `workspaces_${userId}.json`);
        const fileContents = minify(JSON.stringify(workspaces, null, 2));
        
        await fs.writeFile(
            filePath, 
            fileContents,
            'utf-8'
        );
        console.info('Successfully got workspaces')
        return NextResponse.json(workspaces);
    } catch (error) {
        console.error('Error fetching or saving workspaces:', error);
        return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
    }
} 
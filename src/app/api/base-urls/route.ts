import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { baseUrl } from '~/model';
import axios from 'axios';
import os from 'os';



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
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
        return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${baseUrl}/workspace/get-base-urls?workspaceId=${workspaceId}`);
        const urls = response.data;
        
        return NextResponse.json(urls);
    } catch (error) {
        console.error('Error fetching or saving workspaces:', error);
        return NextResponse.json({ error: 'Failed to fetch workspaces - ' }, { status: 500 });
    }
} 
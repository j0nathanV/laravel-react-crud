#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'resources', 'js', 'routes', 'password', 'index.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(
        "import confirm from './confirm'",
        "import confirmRoutes from './confirm'"
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed import conflict in password/index.ts');
} catch (error) {
    console.error('❌ Error fixing import conflict:', error.message);
}

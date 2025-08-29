#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'resources', 'js', 'routes', 'password', 'index.ts');

const applyFix = () => {
    try {
        if (!fs.existsSync(filePath)) {
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes("import confirm from './confirm'")) {
            content = content.replace(
                "import confirm from './confirm'",
                "import confirmRoutes from './confirm'"
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('✅ Fixed import conflict in password/index.ts');
        }
    } catch (error) {
        console.error('❌ Error applying fix:', error.message);
    }
};

const watchFile = () => {
    if (!fs.existsSync(filePath)) {
        console.log('⏳ Waiting for password/index.ts to be generated...');
        setTimeout(watchFile, 1000);
        return;
    }

    fs.watchFile(filePath, { interval: 500 }, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
            console.log('📁 File changed, applying fix...');
            setTimeout(applyFix, 100); 
        }
    });

    console.log('👀 Monitoring password/index.ts for changes...');
    
    applyFix();
};

if (process.argv[2] === '--once') {
    applyFix();
} else {
    watchFile();
}

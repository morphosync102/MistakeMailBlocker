import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// マニフェストをコピー
fs.copyFileSync(
    path.join(projectRoot, 'manifest.json'),
    path.join(distDir, 'manifest.json')
);

// アイコンディレクトリを作成（存在しない場合）
// アイコンディレクトリを作成（存在しない場合）
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// アイコンファイルをコピー
const srcIconsDir = path.join(projectRoot, 'icons');
if (fs.existsSync(srcIconsDir)) {
    const iconFiles = fs.readdirSync(srcIconsDir);
    for (const file of iconFiles) {
        fs.copyFileSync(
            path.join(srcIconsDir, file),
            path.join(iconsDir, file)
        );
    }
}

console.log('✓ Files copied to dist/');

//node 匹配hls文件
import { writeFileSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

const inDir = './m3u';
const list = await readdir(inDir, { encoding: 'utf8' });

list.forEach(async (file_name, idx) => {
    const m3uContent = await readFile(inDir.concat('/', file_name), { encoding: 'utf8' });
    const m3uRegex = /#EXTINF:-1\s*(?:,?\s*(tvg-id="[^"]*"))?\s*(?:,?\s*(tvg-name="[^"]*"))?\s*(?:,?\s*(tvg-logo="[^"]*"))?\s*(?:,?\s*(group-title="[^"]*"))?\s*,([^\n]+)\n([^\n#]+)/g;
    const channels = [];
    let match;
    while ((match = m3uRegex.exec(m3uContent)) !== null) {
        const [
            _, // 完整匹配（忽略）
            tvgId,
            tvgName,
            tvgLogo,
            groupTitle,
            channelName,
            url
        ] = match;

        channels.push({
            tvgId: tvgId ? tvgId.replace(/^tvg-id="/, '').replace(/"$/, '') : null,
            tvgName: tvgName ? tvgName.replace(/^tvg-name="/, '').replace(/"$/, '') : null,
            tvgLogo: tvgLogo ? tvgLogo.replace(/^tvg-logo="/, '').replace(/"$/, '') : null,
            groupTitle: groupTitle ? groupTitle.replace(/^group-title="/, '').replace(/"$/, '') : null,
            channelName: channelName.trim(),
            url: url.trim(),
        });
    }
    writeFileSync(String('./out/').concat(file_name.replaceAll('.m3u', '.json')), JSON.stringify(channels), { encoding: 'utf8' });
})
console.log(list);
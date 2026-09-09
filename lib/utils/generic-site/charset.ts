import iconv from 'iconv-lite';

import ofetch from '@/utils/ofetch';

/**
 * 编码感知的页面抓取。
 * ofetch 默认按 UTF-8 解码文本，遇到 GBK/GB2312 的老站会得到乱码，
 * 因此对指定编码的站点改取 arrayBuffer，再用 iconv-lite 解码。
 */
export async function fetchPage(url: string, encoding?: string): Promise<string> {
    if (!encoding || encoding.toLowerCase().replaceAll('-', '') === 'utf8') {
        return await ofetch(url);
    }
    const buffer = await ofetch(url, { responseType: 'arrayBuffer' });
    return iconv.decode(Buffer.from(buffer), encoding);
}

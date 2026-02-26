const COZE_API_KEY = process.env.COZE_API_KEY;
const APP_ID = process.env.APP_ID;
const SEARCH_WORKFLOW_ID = '7518324696002347071';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Search key is required' });
        }

        console.log('=== 搜索API调用 ===');
        console.log('搜索关键词:', key);

        const cozeResponse = await fetch('https://api.coze.cn/v1/workflow/run', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                app_id: APP_ID,
                workflow_id: SEARCH_WORKFLOW_ID,
                parameters: {
                    key: key
                }
            })
        });

        if (!cozeResponse.ok) {
            const errorText = await cozeResponse.text();
            console.error('Coze API错误:', cozeResponse.status, errorText);
            throw new Error(`Coze API请求失败: ${cozeResponse.status}`);
        }

        const cozeData = await cozeResponse.json();
        console.log('Coze API响应:', cozeData);

        res.status(200).json(cozeData);
    } catch (error) {
        console.error('搜索API错误:', error);
        res.status(500).json({ error: '搜索失败', message: error.message });
    }
}

const COZE_API_KEY = process.env.COZE_API_KEY;
const APP_ID = process.env.APP_ID || '7493723704057675788';
const WORKFLOW_IDS = {
    category1: process.env.WORKFLOW_ID_CATEGORY1 || '7494575042313093157',
    category2: process.env.WORKFLOW_ID_CATEGORY2 || '7518324620240551962'
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, dateNum } = req.body;

        if (!category || !WORKFLOW_IDS[category]) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (!COZE_API_KEY) {
            return res.status(500).json({ error: 'COZE_API_KEY not configured' });
        }

        const workflowId = WORKFLOW_IDS[category];
        const days = dateNum !== undefined ? dateNum : 1;

        const cozeResponse = await fetch('https://api.coze.cn/v1/workflow/run', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                app_id: APP_ID,
                workflow_id: workflowId,
                parameters: {
                    date_num: days
                }
            })
        });

        const data = await cozeResponse.json();

        if (data.code === 0) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ 
                error: data.msg || 'Coze API error',
                code: data.code
            });
        }

    } catch (error) {
        console.error('Data API error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}

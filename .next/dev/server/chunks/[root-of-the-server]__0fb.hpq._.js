module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/chat.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
            error: 'Messages are required'
        });
    }
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'AI service not configured. Please add ANTHROPIC_API_KEY to your environment variables.'
        });
    }
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-opus-4-5',
                max_tokens: 1500,
                system: system || 'You are a helpful AI tutor for Planet Leads Academy.',
                messages: messages.map((m)=>({
                        role: m.role,
                        content: m.content
                    }))
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            console.error('Anthropic API error:', errorData);
            return res.status(response.status).json({
                error: errorData.error?.message || 'AI service error. Please try again.'
            });
        }
        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        return res.status(200).json({
            content
        });
    } catch (err) {
        console.error('Chat API error:', err);
        return res.status(500).json({
            error: 'Failed to connect to AI service. Please try again.'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fb.hpq._.js.map
import OpenAI from 'openai';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if(request.method !== 'POST') {
			return new Response(JSON.stringify({error: `${request.method} method not allowed`}), {status: 405, headers: corsHeaders})
		}

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/d3495effc03ee951330baba2b6c41b5a/stock-predictions/openai'
		});
		try {
			const messages = await request.json();
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages,
				temperature: 1,
				presence_penalty: 0,
				frequency_penalty: 0,
				max_tokens: 200,
			});
			const response = chatCompletion.choices[0].message;
			return new Response(JSON.stringify(response), { headers: corsHeaders });
			// return new Response(
			// 	JSON.stringify({
			// 		role: 'assistant',
			// 		content:
			// 			"When it comes to stock predictions, it's essential to evaluate the source of the information carefully. Here are some considerations to keep in mind before trusting tips from anyone, including \"Dodgey Dave\":\n\n1. **Reputation**: Research Dodgey Dave's history in stock predictions. Has he built a solid reputation, or do people generally view him as unreliable?\n\n2. **Track Record**: Look into his past predictions. How accurate have they been? A history of successful predictions might make his advice more credible.\n\n3. **Research and Analysis**: Does he provide a rationale for his predictions? Good predictions should be backed up with solid analysis rather than just hype or speculation.\n\n4. **Market Conditions**: Understand the current market conditions and how they could impact the predictions. The stock market can be volatile and influenced by many unpredictable factors.\n\n5. **Diversification**: Investing based solely on one source can be risky. Always consider multiple opinions and conduct your own research.\n\n6. **Professional Advice**: If you're serious about investing, consider consulting with a licensed financial advisor who can provide personalized advice tailored to your financial situation.\n\nIn general, be cautious and skeptical of stock predictions, especially from sources that may not have a reliable track record. ",
			// 		refusal: null,
			// 		annotations: [],
			// 	}),
			// 	{ headers: corsHeaders }
			// );
		} catch (e) {
			return new Response(JSON.stringify({error: e.message}), { status: 500, headers: corsHeaders });
		}
	},
};

const { groq } = require('../../../config/constants');

async function groqTextToText(messageData, isJson = false) {
	try {
		// Format messageData as required by GROQ
		const payload = {
			messages: messageData,
			model: 'llama-3.3-70b-versatile',
			// The language model which will generate the completion.

			//
			// Optional parameters
			//

			// Controls randomness: lowering results in less random completions.
			// As the temperature approaches zero, the model will become deterministic
			// and repetitive.

			temperature: 1,

			// The maximum number of tokens to generate. Requests can use up to
			// 2048 tokens shared between prompt and completion.
			max_tokens: 8096,

			// Controls diversity via nucleus sampling: 0.5 means half of all
			// likelihood-weighted options are considered.
			top_p: 1,
			stream: false,
		};

		if (isJson) payload.response_format = { type: 'json_object' };

		// Send request to GROQ API
		const response = await groq.chat.completions.create(payload);

		let keyword = response.choices[0].message.content;
		try {
			keyword = JSON.parse(keyword);
		} catch (e) {
			keyword = response.choices[0].message.content;
		}
		// Return the response
		return keyword;
	} catch (error) {
		throw error;
	}
}

module.exports = { groqTextToText };

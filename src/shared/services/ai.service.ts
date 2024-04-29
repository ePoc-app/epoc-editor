const options = {
    'model': 'llama2-chat-7b',
    'stream': false,
    'max_tokens': 2048,
    'stop': ['hello'],
    'frequency_penalty': 0,
    'presence_penalty': 0,
    'temperature': 0.7,
    'top_p': 0.95
};

export async function chat(messages) {
    console.log('chat service');
    const res = await fetch('http://localhost:1337/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...options, messages})
    });
    
    const json = await res.json();
    return json.choices[0].message;
}
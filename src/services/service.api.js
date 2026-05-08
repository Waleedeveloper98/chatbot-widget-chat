export const handleChat = async ({ userMessage, sessionId, webhookUrl }) => {
    const response = await fetch(webhookUrl,  // ✅ webhookUrl IS used here
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Widget-Token': 'slicenbite_xK9#mP2@vL7_2024', // ✅ token is here
        },
        body: JSON.stringify({
            sessionId: sessionId,
            action: 'sendMessage',
            chatInput: userMessage.text, // ✅ correct
        }),
    });

    if (!response.ok) {
        throw new Error('Network error');
    }

    const data = await response.json();
    return data.reply;
};
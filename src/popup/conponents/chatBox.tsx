

import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';
import { Box } from "@chakra-ui/react"

const ChatBox = () => {
    const { messages, appendMsg, setTyping } = useMessages([]);

    function handleSend(type, val) {
        if (type === 'text' && val.trim()) {
            appendMsg({
                type: 'text',
                content: { text: val },
                position: 'right',
            });

            setTyping(true);
            const extensionId = chrome.runtime.id
            chrome.runtime.sendMessage(extensionId, { type: "list" }, (resp) => {
                const keywords = resp?.data.map(item => item?.name)
                const result = keywords.filter(item => val.includes(item))
                appendMsg({
                    type: 'text',
                    content: { text: result.join('-') },
                });
            })

        }
    }

    function renderMessageContent(msg) {
        const { content } = msg;
        return <Bubble content={content.text} />;
    }

    return (
        <Box width="400px"
            height="600px">
            <Chat
                navbar={{ title: "许显" }}
                messages={messages}
                renderMessageContent={renderMessageContent}
                onSend={handleSend}
            />
        </Box>
    );
};

export default ChatBox
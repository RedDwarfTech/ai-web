import { useEffect, useState } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuid } from 'uuid';

const SseClient: React.FC = (props) => {
    const [data, setData] = useState('');
    const longText = "这是一段长文本...";

    useEffect(() => {
        const accessToken = localStorage.getItem("x-access-token");
        const eventSource = new EventSourcePolyfill('/ai/stream/chat/ask?q=hello', {
            headers: {
                'x-access-token': accessToken ?? "",
                'x-request-id': uuid(),
            }
        });
        let index = 0;
        while (index < longText.length) {
            const chunk = longText.substring(index, Math.min(index + 1024, longText.length));
            eventSource.dispatchEvent(new MessageEvent('message', { data: chunk }));
            index += chunk.length;
        }
        eventSource.onmessage = e => {
            alert(e.data);
            setData(e.data);
        };
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h2>SSE Client</h2>
            <p>{data}</p>
        </div>
    );
}


export default SseClient;

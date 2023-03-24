import { useEffect, useState } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuid } from 'uuid';

const SseClient: React.FC = (props) => {
    const [data, setData] = useState('');
    const longText = "long...";

    useEffect(() => {
        const accessToken = localStorage.getItem("x-access-token");
        // https://stackoverflow.com/questions/6623232/eventsource-and-basic-http-authentication
        const eventSource = new EventSourcePolyfill('/ai/stream/chat/ask?question=hello', {
            headers: {
                'x-access-token': accessToken ?? "",
                'x-request-id': uuid(),
            }
        });
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

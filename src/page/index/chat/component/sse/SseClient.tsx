import { useEffect, useState } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuid } from 'uuid';

const SseClient: React.FC = (props) => {
    const [data, setData] = useState('');

    useEffect(() => {
        doAsk();
    }, []);

    const doAsk = () => {
        
    }

    return (
        <div>
            <h2>SSE Client</h2>
            <p>{data}</p>
        </div>
    );
}


export default SseClient;

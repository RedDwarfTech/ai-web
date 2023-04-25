import { TablePaginationConfig } from 'antd';
import { openDB } from 'idb';
import { REST } from 'js-wheel';

interface GenieDB {
    prompt: {
        name: string;
        id: number;
    };
}

export interface Prompt {
    id: number;
    name: string;
}

const db = openDB<GenieDB>('genie', 1, {
    upgrade(db) {
        const promptStore = db.createObjectStore('prompt', {
            keyPath: 'id',
            autoIncrement: true,
        });
        promptStore.createIndex("promptIdIndex", "id", { unique: true });
    },
});

export async function insertToIdb(prompt: string) {
    let objectStore = (await db).transaction(["prompt"], "readwrite").objectStore("prompt");
    let request = objectStore.add({ name: prompt });
    return request;
}

export async function getToIdb<T>(key: number): Promise<T | undefined> {
    let objectStore = (await db).transaction(["prompt"], "readwrite").objectStore("prompt");
    let request = objectStore.get(key);
    return request;
}

export async function getNewestRecord<T>(): Promise<T | undefined> {
    var transaction = (await db).transaction(["prompt"], "readonly");
    var store = transaction.objectStore("prompt").index("promptIdIndex");
    const cursor = await store.openCursor(null, 'prev');
    const maxIdRecord = cursor?.value as T;
    await transaction.done;
    return maxIdRecord;
}

export async function getPage<T>(pagination?: TablePaginationConfig): Promise<REST.EntityList<T>> {
    const current = pagination!.current||1;
    const pageSize = pagination?.pageSize!||10;
    let transaction = (await db).transaction(["prompt"], "readonly");
    let store = transaction.objectStore("prompt");
    const totalCount = await store.count();
    let cursor = await store.index("promptIdIndex").openCursor(null,'next');
    let offset = (current - 1) * pageSize;
    const data: T[] = [];
    while (cursor && offset > 0) {
        cursor = await cursor.advance(offset);
        if(cursor){
            offset -= cursor.key as number;
        }
    }
    for (let i = 0; cursor && i < pageSize; i++) {
        if(cursor){
            data.push(cursor.value);
            cursor = await cursor.continue();
        }
    }
    await transaction.done;
    let resp: REST.EntityList<T> = {
        pagination: {
            total: totalCount,
            per_page: pageSize,
            page: current
        },
        data: data,
        total: totalCount,
        success: true
    };
    return resp;
}


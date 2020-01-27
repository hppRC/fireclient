import { firestore } from "firebase";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
export declare function getDocSnapshot(path: string, onGet: (doc: firestore.DocumentSnapshot) => void, onError: (err: any) => void, acceptOutdated?: boolean): void;
export declare function getDoc(path: string, onGet: (doc: DocData) => void, onError: (err: any) => void, acceptOutdated?: boolean): void;
export declare function subscribeDocSnapshot(uuid: HooksId, path: string, onChange: (doc: firestore.DocumentSnapshot) => void, onError: (err: any) => void, onListen?: () => void): () => void;
export declare function subscribeDoc(uuid: HooksId, path: string, onChange: (doc: DocData) => void, onError: (err: any) => void, onListen?: () => void): () => void;
export declare function getCollectionSnapshot(path: string, onGet: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: any) => void, options?: QueryOptions, acceptOutdated?: boolean): void;
export declare function getCollection(path: string, onGet: (collection: CollectionData) => void, onError: (err: any) => void, options?: QueryOptions, acceptOutdated?: boolean): void;
export declare function subscribeCollectionSnapshot(uuid: HooksId, path: string, onChange: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: any) => void, onListen?: () => void, options?: QueryOptions): () => void;
export declare function subscribeCollection(uuid: HooksId, path: string, onChange: (collection: CollectionData) => void, onError: (err: any) => void, onListen?: () => void, options?: QueryOptions): () => void;

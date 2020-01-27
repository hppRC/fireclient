import { firestore } from "firebase";
import "firebase/firestore";
import { CollectionData, DocData, HooksId, QueryOption } from ".";
export declare function generateHooksId(): HooksId;
export declare function useSubscribeDocBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void) => () => void, option?: {
    callback?: (snapshot: State) => void;
}): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, getFunction: (path: string, onGet: (data: State) => void, onError: (err: any) => void, option?: QueryOption, acceptOutdated?: boolean) => void, option?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
} & QueryOption): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void, option?: QueryOption) => () => void, option?: {
    callback?: (data: State) => void;
} & QueryOption): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare const initialDocData: DocData;
export declare const initialCollectionData: CollectionData;
export declare function useLazyGetDoc(path: string, option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useGetDoc(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useSubscribeDoc(path: string, option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useLazyGetCollection(path: string, option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
} & QueryOption): [CollectionData, boolean, any, () => void];
export declare function useGetCollection(path: string, option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
} & QueryOption): [CollectionData, boolean, any, () => void];
export declare function useSubscribeCollection(path: string, option?: {
    callback?: (collection: CollectionData) => void;
} & QueryOption): [CollectionData, boolean, any, () => void];

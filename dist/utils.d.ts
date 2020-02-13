/// <reference types="react" />
import { firestore } from "firebase";
import { List } from "immutable";
import { QueryOptions } from ".";
import { CollectionData, DocData, FireclientState } from "./";
import { Actions } from "./reducer";
export declare const generateHooksId: () => string;
export declare const getHashCode: (obj: any) => number;
export declare const getQueryId: (path: string, options?: QueryOptions) => string;
export declare const getCollectionPathFromId: (collectionId: string) => string;
export declare const searchCollectionId: (collectionPath: string, state: FireclientState) => string[];
export declare const isDocPath: (path: string) => boolean;
export declare const createData: (id: string, fields: {
    [fields: string]: any;
}) => DocData;
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export declare const createDataFromDoc: (doc: firestore.DocumentData) => DocData;
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export declare const createDataFromCollection: (collection: firestore.DocumentSnapshot<firestore.DocumentData>[]) => CollectionData;
export declare const saveDoc: (dispatch: import("react").Dispatch<Actions>, docPath: string, doc: DocData) => void;
export declare const saveCollection: (dispatch: import("react").Dispatch<Actions>, collectionPath: string, options: QueryOptions, collection: CollectionData) => void;
export declare const deleteDocFromState: (dispatch: import("react").Dispatch<Actions>, docPath: string) => void;
export declare const deleteCollectionFromState: (dispatch: import("react").Dispatch<Actions>, collectionPath: string) => void;
export declare const connectDocToState: (dispatch: import("react").Dispatch<Actions>, docId: string, uuid: string) => void;
export declare const connectCollectionToState: (dispatch: import("react").Dispatch<Actions>, collectionId: string, uuid: string, docIds: List<string>) => void;
export declare const disconnectDocFromState: (dispatch: import("react").Dispatch<Actions>, docId: string, uuid: string) => void;
export declare const disconnectCollectionFromState: (dispatch: import("react").Dispatch<Actions>, collectionId: string, uuid: string, docIds: List<string>) => void;
export declare function withOption(ref: firestore.CollectionReference, { where, limit, order, cursor }: QueryOptions): firestore.Query;

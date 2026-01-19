import { Node, Edge } from '@xyflow/react';

export type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void;
export type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;
export type KeyboardEventHandler<T = Element> = (event: React.KeyboardEvent<T>) => void;

export type ColorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type NumberChangeHandler = (value: number) => void;
export type StringChangeHandler = (value: string) => void;

export type VoidPromiseFunction = () => Promise<void>;
export type VoidFunction = () => void;

export type OptionalResult<T> = T | null;
export type SelectionState = string[];
export type LoadingState = boolean;

export type NodeSetStateAction = React.Dispatch<React.SetStateAction<Node[]>>;
export type EdgeSetStateAction = React.Dispatch<React.SetStateAction<Edge[]>>;

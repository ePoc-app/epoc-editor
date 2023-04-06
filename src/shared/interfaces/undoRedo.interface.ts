export interface UndoRedoAction {
    type: string;
}

export interface NodeMovedAction extends UndoRedoAction {
    type: 'nodeMoved';
    nodeId: string;
    deltaMovement: { x: number; y: number };
}

//? Is saving an entire node in this situation a good idea?
export interface NodeAddedAction extends UndoRedoAction {
    type: 'nodeAdded';
    //TODO: use the type defined by vue flow
    node: any;
    position: { x: number; y: number };
}

export interface NodeRemovedAction extends UndoRedoAction {
    type: 'nodeRemoved';
    node: any;
    position: { x: number; y: number }
}

export interface NodeUpdatedAction extends UndoRedoAction {
    type: 'nodeUpdated';
    node: any;
}

export interface EdgeConnectedAction extends UndoRedoAction {
    type: 'edgeConnected';
    edge: any;
}

export interface EdgeUpdatedAction extends UndoRedoAction {
    type: 'edgeUpdated';
    edge: any;
}

export interface EdgeRemovedAction extends UndoRedoAction {
    type: 'edgeRemoved';
    edge: any;
}
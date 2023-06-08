export interface UndoRedoAction {
    type: 'nodeMoved' | 'nodeAdded' | 'nodeRemoved' | 'nodeUpdated' |
        'edgeAdded' | 'edgeUpdated' | 'edgeRemoved' | 'formUpdated' | 
        'formRepeatUpdated' | 'formRepeatUpdated' | 'contentAdded' |
        'contentRemoved';
}

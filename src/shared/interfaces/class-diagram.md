
## Data structure in the menu bar
```mermaid
classDiagram
  Screen -- SideAction : 1..*
  SideAction -- Form: 1
```

---

## Data structure in the graph
```mermaid
classDiagram
  ePoc -- Screen: 0..*
  Screen -- NodeElement: 1..*
  NodeElement -- Form: 1
  NodeElement -- SideAction: 1
  Form -- Input: 1..*
```
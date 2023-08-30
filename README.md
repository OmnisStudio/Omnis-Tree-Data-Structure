# Omnis-Tree-Data-Structure
A Tree data structure, created using Omnis Object References.


## What Is A Tree?
When talking about data structures, a Tree is a hierarchical group of 'Nodes'. Each Node has a single parent (except the 'root' Node, which has none), but may have multiple children.
They are a good fit for data which can be represented in this way, and provide efficient mechanisms for searching and traversing the tree.


# Installation
To make use of this, you should use Omnis' **New Lib From JSON** option, under the **Libraries** view, to import the **TreeDataStructure** folder from this repo.

 - It is recommended that you keep this imported library as a separate library (and reference the objects in it from your library), so that you can eassily pull any updates from this repo.


# Usage

The default implementation of Tree Nodes have only a single, Character, **'value'**. 
For most situations, you will want your Nodes to hold more information than this, in which case you will want to create custom subclasses of TreeNode (As described shortly).

The `TreeTest` folder is an Omnis library (import it as JSON), which shows examples of how this may be used.

Nodes can be quickly accessed by their ID.


## Adding Nodes

There are multiple ways to add Nodes to the tree:

### Tree $insert() method:

The Tree's $insert method allows you to create a new TreeNode, by passing its unique ID and value, and optionally the id of the parent node.
If no parentNodeID is provided, it will be added to the root node. An Object ref to the newly created Node is returned.

```
  Do iTree.$insert("produce","All Produce","parentID") Returns lNewNode
```


### TreeNode's $appendChild() method:

Allows you to create a new TreeNode, by passing its unique ID and value, and it is added to the end of this TreeNode's children.
An Object ref to the newly created Node is returned.
```
  Do lParentNode.$appendChild("produce","All Produce") Returns lNewNode
```


### TreeNode's $appendChildNode() method:

Allows you to add a previously created TreeNode to the end of this TreeNode's children.
```
  Calculate lNewNode as $libs.TreeDataStructure.$objects.TreeNode.$newref("produce","All Produce")
  Do lParentNode.$appendChildNode(lNewNode)
```


### TreeNode's $appendChildNodeAfter() method:

Allows you to add a previously created TreeNode after the TreeNode's child with the specified index. Use an index of 0 to insert it before the first child.
```
  Calculate lNewNode as $libs.TreeDataStructure.$objects.TreeNode.$newref("produce","All Produce")
  Do lParentNode.$appendChildNodeAfter(lNewNode,2)
```


## Searching Nodes

The Tree exposes two ways to search for a particular node:


### $depthFirstSearchByID()

Searches through children, searching through full depth of each node before moving to the next level.
Can be passed a Node to use as the starting point.

Generally faster for finding Nodes at deeper depths.
See https://en.wikipedia.org/wiki/Depth-first_search

```
  Do iTree.$depthFirstSearchByID("banana") Returns lNode
```


### $breadthFirstSearchByID()

Searches through children, searching through all nodes at each level before moving down to the next level.
Can be passed a Node to use as the starting point.

Generally faster for finding Nodes closer to the starting point.
See https://en.wikipedia.org/wiki/Breadth-first_search

```
  Do iTree.$breadthFirstSearchByID("banana") returns lNode
```


## Saving & Restoring Trees

Trees and TreeNodes have `$toJSON()` and `$fromJSON()` methods, to allow you to export a Tree to JSON, and rebuild a Tree from such exported JSON.



# Subclassing TreeNodes

The default implementation of a TreeNode only stores 2 pieces of information - the unique 'id', and a Character 'value'.
It is expected that developers will create custom subclasses of the TreeNode to extend this with more information.

When doing so, there are a few specific things you may need to override:

## Class Variables

- `cValueKey` allows you to change the key used for the TreeNode's 'value' when writing to/from JSON.
- `cChildNodesKey` allows you to change the key used for the TreeNode's children when writing to/from JSON.


## Constructor

You may want to override $construct to change the parameters or add more.
You can do this, then call the default constructor, and then run any other logic you need.

E.g. supposing we change pValue to pName, and want a new 'price' instance variable:
```
  Do $cinst.$inherited.$construct(pID,pName)
  Calculate price as pPrice
  Calculate quantity as pQuantity
```


## JSON import/export

If you add extra information to your TreeNode in the form of instance variables, you will need to additionally write these to and read from JSON.

### $toJSON
```
Do inherited Returns lJSON

# Extend the default behaviour to additionally add our custom price and quantity members:
Do lJSON.$addmember("",cPriceKey,price)
Do lJSON.$addmember("",cQuantityKey,quantity)

Quit method lJSON
```

### $fromJSON
```
Do inherited

# Also set the price & quantity iVars from the passed JSON
Calculate price as pJSON.$getinteger(cPriceKey)
Calculate quantity as pJSON.$getinteger(cQuantityKey)
```




# Limitations
The Tree implementation uses recursion for depth-first searches and JSON conversion, and so is subject to Omnis' stack memory limit. 
Therefore, very 'deep' trees may hit a 'Stack Size Exceeded' error in Omnis when using these actions.

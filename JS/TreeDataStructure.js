
class TreeNode {

	childNodesKey = "childNodes";
	valueKey = "value";
	nodeLib = "TreeDataStructure";

	constructor(id, value, parent = null) {
		this.id = id;
		this.value = value;
		this.parent = parent;
		this.childNodes= [];
	}

	isLeaf() {
		return this.childNodes.length === 0
	}

	toJSON() {
		let json = {
			"nodeType": this.constructor.name,
			"id": this.id,
			"nodeLib": this.nodeLib
		}

		json[this.valueKey] = this.value;

		let childJSON = [];
		for (const returnValue of this.childNodes) {
			childJSON.push(returnValue.toJSON());
		}

		json[this.childNodesKey] = childJSON;

		return json;
	}
}

class Tree {

	constructor(rootID, rootValue) {
		if (rootID)
			this.rootNode = new TreeNode(rootID, rootValue);
	}

	/**
	 * Iterates through children, one level at a time.
	 * @param {TreeNode} fromNode 		The node to begin iterating from.
	 * @return {Generator<TreeNode>}	An iterator which can iterate over all tree nodes.
	 */
	*breadthFirstIterator(fromNode = this.rootNode) {

		let queue = [];
		queue.push(fromNode);

		while( queue.length) {
			const node = queue.shift();
			yield node;

			// Add any children to the end of the queue, to be searched when it reaches that point:
			if (!node.isLeaf()) {
				for (const child of node.childNodes) {
					queue.push(child);
				}
			}

		}
	}

	/**
	 * Iterates through children, searching through full depth of each node before moving to the next.
	 * @param {TreeNode} [fromNode]		The node to begin iterating from.
	 * @return {Generator<TreeNode>} 	An iterator which can iterate over all tree nodes.
	 */
	*depthFirstIterator(fromNode = this.rootNode) {
		yield fromNode;
		if (!fromNode.isLeaf()) {
			for (const childNode of fromNode.childNodes) {
				yield* this.depthFirstIterator(childNode);
			}
		}

	}

	insert(id, value, parentNodeID=this.rootNode.id) {
		for (let node of this.breadthFirstIterator()) {
			if (node.id === parentNodeID) {
				node.childNodes.push(new TreeNode(id, value, node));
				return true;
			}
		}
		return false;
	}

	insertNode(newNode, parentNodeID, nextNodeID) {
		for (let node of this.breadthFirstIterator()) {
			if (node.id === parentNodeID) {
				newNode.parent = node;
				if (nextNodeID) {
					const index = node.childNodes.findIndex((node) => node.id === nextNodeID);
					if (index === -1) {
						return false;
					}
					node.childNodes.splice(index, 0, newNode);
				} else {
					node.childNodes.push(newNode);
				}
				return true;
			}
		}
		return false;
	}

	updateNode(newNode) {
		const removal = this.remove(newNode.id);
		if (!removal)
			return false;

		const oldNode = removal.node;

		// Transplant the old node's parent and children to this node:
		newNode.parent = oldNode.parent;
		newNode.childNodes = oldNode.childNodes;

		// Re-add this node in the old Node's position in the parent's children:
		newNode.parent.childNodes.splice(removal.index, 0, newNode);

		return true;
	}
	
	moveNode(newNode, parentNode, nextNode) {
		const removal = this.remove(newNode.id);
		if (!removal)
			return false;
		
		const oldNode = removal.node;
		
		newNode.parent = parentNode;
		newNode.childNodes = oldNode.childNodes;
		
		// Add the node to the new position in the parent's children:
		if (nextNode) {
			const index = parentNode.childNodes.indexOf(nextNode);
			if (index === -1) {
				return false;
			}
			parentNode.childNodes.splice(index, 0, newNode);
		} else {
			parentNode.childNodes.push(newNode);
		}
		
		return true;
	}

	remove(id) {
		for (let node of this.breadthFirstIterator()) {
			if (node.id === id) {
				const nodeIndex = node.parent.childNodes.indexOf(node);
				return { node: node.parent.childNodes.splice(nodeIndex, 1)[0], index: nodeIndex};
				// return true;
			}
		}
		return null;
	}

	/**
	 * Find a node which satisfies a custom condition defined by 'callback'.
	 * @param {function(TreeNode)} callback		A callback function which is passed each node. It should return true if it finds a match.
	 * @param {TreeNode} [fromNode]				The node to begin iterating from.
	 * @return {TreeNode}									The matched node.
	 */
	find(callback, fromNode = this.rootNode) {
		for (let node of this.breadthFirstIterator(fromNode)) {
			if (callback(node))
				return node;
		}
	}

	findNodeByID(nodeID, fromNode = this.rootNode) {
		return this.find((node) => { return node.id === nodeID }, fromNode);
	}



}

export {
	TreeNode,
	Tree
}
(function (exports) {
  "use strict";
/*
 * Constructor. Takes capacity as optional argument.
*/

  function HistoryQueue(capacity) {
    // pointer to first item
    this._head = null;
    // pointer to the last item
    this._tail = null;
    // length of list
    this._length = 0;
	// used for easy back and forth traversal
	this._iterator = null;
	// used to avoid returning data twice in a row
	this._lastiterfunc = null;
	this._capacity = capacity ? capacity : -1;
  }

  HistoryQueue.prototype.is_full = function() {
	return this._length >= this._capacity
  }
  HistoryQueue.prototype.size_fixed = function() {
	return this._capacity != -1;
  }

  // Wraps data in a node object.
  HistoryQueue.prototype._createNewNode = function (data) {
    var node = {
      data: data,
      next: null,
      prev: null
    };
    return node;
  };

/*
 * Prepends a node to the end of the list.
*/
  HistoryQueue.prototype.push = function (data) {
    var node = this._createNewNode(data);


    if (this._length === 0) {

      // first node, so all pointers to this
      this._head = node;
      this._tail = node;
	  this._iterator = this._head;
    } else {

      // place before head
      this._head.prev = node;
      node.next = this._head;
      this._head = node;
    }

	this.reset_iterator();
	if (this.size_fixed() && this.is_full()) {
		this.pop();
	}
    // update count
    this._length++;

    return node;
  };

/*
 * Returns the node at the specified index. The index starts at 0.
*/
  HistoryQueue.prototype.item = function (index) {
    if (index >= 0 && index < this._length) {
      var node = this._head;
      while (index--) {
        node = node.next;
      }
      return node;
    }
  };

/*
 * Returns the node at the head of the list.
*/
  HistoryQueue.prototype.head = function () {
    return this._head;
  };

/*
 * Returns the node at the tail of the list.
*/
  HistoryQueue.prototype.tail = function () {
    return this._tail;
  };

/*
 * Returns the size of the list.
*/
  HistoryQueue.prototype.size = function () {
    return this._length;
  };

/*
 * Removes the item at the tail of the list and returns it.
*/
  HistoryQueue.prototype.pop = function () {
	var curr = this._tail;
	if (this._length == 0) {
		throw new RangeError("unable to remove item from empty list.");
	}
	if (!curr) {
		throw new RangeError("unable to remove item at index "+index);
	}
	if (this._length == 1) {
	  	this._head = null;
		this._tail = null;
		this._iterator = null;
	}
	else if (curr == this._head) {

		if (this._iterator == this._head)
			this._iterator = this._head.next;
	  	this._head = this._head.next;
		this._head.prev = null;
	}
	else if (curr == this._tail) {

	 	if (this._iterator == this._tail)
			this._iterator = this._tail.prev;

	  	this._tail = this._tail.prev;
		this._tail.next = null;
	}
	else {
	  	if (curr == this._iterator)
			this._iterator = curr.next;
	  	var prev = curr.prev;
	  	var next = curr.next;
		prev.next = curr.next;
		next.prev = curr.prev;
	}
	this._length--;
	return curr.data;
  };


/*
 * Reset the iterator
*/
  HistoryQueue.prototype.reset_iterator = function() {
	this._iterator = this.size() == 0 ? null : this._head;
	this._lastiterfunc = null;
  };

/*
 * Returns the next item in the queue (iterator traverses towards rear)
*/
  HistoryQueue.prototype.back = function () {

    if (!this._iterator){
	  return null;
	}

	var data = this._iterator.data;
	var tmp = this._iterator
	this._iterator = this._iterator.next;

	if (this._iterator == null) {
	  this._iterator = tmp;
	}
	else if (this._lastiterfunc == 'forward') {

	  if (this._iterator.prev != this._head) {
		this._iterator = this._iterator.next
	  }
	  
	  data = this._iterator.data;
	  if(this._iterator.next != null) {
		this._iterator = this._iterator.next
	  }
	}
	
	this._lastiterfunc = 'back';
	return data;
  };

/*
 * Returns the previous item in the queue (iterator traverses towards front)
*/
  HistoryQueue.prototype.forward = function () {
	
	
	if (!this._iterator)
	  return null;
	
	var data = this._iterator.data;
   	var tmp = this._iterator;
	this._iterator = this._iterator.prev;
	
	if (this._iterator == null)
	  this._iterator = tmp;
	else if (this._lastiterfunc == 'back') {
	  
	  if (this._iterator.next != this._tail) {
		this._iterator = this._iterator.prev
	  }
	  data = this._iterator.data;
	  if(this._iterator.prev != null) {
		this._iterator = this._iterator.prev
	  }
	}
	
	this._lastiterfunc = 'forward';
	return data;
  };
  
  exports.HistoryQueue = HistoryQueue;
})(typeof exports === 'undefined' ? this['HQ'] = {} : exports);

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 < 0.9.0;


contract TODO{
    string public name="Decentralized Todo App";
    uint public TodoCount=1;

    struct Todo{
        uint id;
        string text;
        uint date;
        address author;
        bool done;
    }

    mapping(uint=>Todo) public todos;

    event TodoCreated(
        uint id,
        string text,
        uint date,
        address author,
        bool done
    );
    event TodoDone(
        uint id,
        string text,
        uint date,
        address author,
        bool done
    );

    function createTodo(string memory _text)public{
        require(bytes(_text).length > 0);
        require(msg.sender != address(0x0));

        todos[TodoCount]=Todo(TodoCount,_text,block.timestamp,msg.sender,false);
        emit TodoCreated(TodoCount,_text,block.timestamp,msg.sender,false);
        TodoCount++;
    }

    function completeTask(uint _id) public{
        Todo memory todo=todos[_id];
        todo.done=true;
        todos[_id]=todo;
        emit TodoDone(_id,todo.text,block.timestamp,msg.sender,true);
    }

    function editTodo(uint _id,string memory _text) public {
        require(bytes(_text).length > 0);
        Todo memory todo=todos[_id];
        todo.text=_text;
        todos[_id]=todo;
    }
}
const TODO = artifacts.require("../contracts/TODO.sol");

contract("TODO", (accounts) => {
    let todo;
    before(async () => {
        todo = await TODO.deployed();
    })

    describe("deploys", async () => {
        it("has a name", async () => {
            let name = await todo.name();
            assert.equal(name, "Decentralized Todo App");
        })
    })

    describe("create todo function", () => {
        it("creates a todo", () => {
            todo.createTodo('').then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0, "text must be provided");
                return todo.createTodo("text", { from: '0x0' })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0, "should have any author");
                return todo.createTodo('Read Master Bitcoin Book', { from: accounts[1] });
            }).then((receipt) => {
                assert.equal(receipt.logs.length, 1, "should emit one event");
                assert.equal(receipt.logs[0].event, "TodoCreated", "should emit 'TodoCreated' event");
                assert.equal(receipt.logs[0].args.id, 1, "should log todo id");
                assert.equal(receipt.logs[0].args.text, "Read Master Bitcoin Book", "should log one todo text");
                assert.equal(receipt.logs[0].args.done, false, "should log if the todo was done");
                assert.equal(receipt.logs[0].args.author, accounts[1], "should log the author address");
                return todo.TodoCount();
            }).then(count => {
                assert.equal(count, 2);
            })
        })
    })

    describe("it helps to complete the task", () => {
        it("completes the task", () => {
            todo.completeTask(1).then(receipt => {
                return todo.todos(1);
            }).then(todo => {
                assert.equal(todo.done, true);
                return todo.completeTask(1)
            }).then(receipt => {
                assert.equal(receipt.logs.length, 1);
                assert.equal(receipt.logs[0].event, "TodoDone");
                assert.equal(receipt.logs[0].args.id, 1);
                assert.equal(receipt.logs[0].args.text, "Read Master Bitcoin Book");
                assert.equal(receipt.logs[0].args.done, true, "should log if the todo was done");
                assert.equal(receipt.logs[0].args.author, accounts[1], "should log the author address");
            })
        })
    })

    describe("it helps to update todo", () => {
        it("helps to update todo", () => {
            todo.editTodo(1, "Read Mastering Ethereum Book").then(receipt => {
                return todo.todos(1);
            }).then(todo => {
                assert.equal(todo.text, "Read Mastering Ethereum Book");
            })
        })
    })
})
import React, { useState, useEffect } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";

import TODO from "./contracts/TODO.json";
import Navbar from "./components/Navbar";

const baseUrl = "https://ipfs.infura.io/ipfs/";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    let connect = async () => {
      await connectToMetaMask();
    }
    connect()
  }, [])

  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contract.methods.createTodo(todo).send({ from: accounts })
      setTodo('');
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async () => {
    try {
      await contract.methods.editTodo(selectedTodo, todo).send({ from: accounts })
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDone = async (id) => {
    try {
      await contract.methods.completeTask(id).send({ from: accounts })

    } catch (error) {
      console.log(error);
    }
  }


  const connectToMetaMask = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        let accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3, TODO);
        let todoCount = await contract.contract.methods.TodoCount().call();
        for (let i = 1; i < todoCount; i++) {
          let td = await contract.contract.methods.todos(i).call();
          setTodos(prev => ([...prev, td]));
        }
        setWeb3(web3);
        setContract(contract.contract);
        setAccounts(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Please install Meta Mask")
    }
  }
  console.log(todos)
  return (
    <>
      {/* Modal starts here */}
      {open && <div style={{ width: "100vw", height: "100vh", background: "rgba(0,0,0,.7)", position: "absolute", top: 0, bottom: 0, zIndex: 10 }}>
        <div className="card  w-50 mx-auto" style={{ zIndex: 15, marginTop: 200 }}>
          <div className="card-header"><span onClick={() => setOpen(false)} className="lead" style={{ fontWeight: 500, cursor: "pointer" }}>X</span></div>
          <div className="card-body">

            <input type="text" placeholder="todo text" name='todo' className="form-control mb-3" todo={todo} onChange={handleChange} />
            <button className="btn btn-dark btn-block" onClick={() => handleEdit()}>Edit</button>
          </div>
        </div>
      </div>}
      {/* Modal Ends Here*/}
      <Navbar address={accounts} NavText="NavText" />
      <form className="card card-body bg-light w-50 mx-auto mt-5" onSubmit={handleSubmit}>
        <input type="text" placeholder="todo text" name='todo' className="form-control mb-3" todo={todo} onChange={handleChange} />
        <button className="btn btn-dark btn-block">ADD</button>
      </form>
      <div className="card card-body w-50 mx-auto mt-4 bg-light">
        <ul className="list-group">
          {
            todos.map(todo =>
              <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
                <p className="d-flex flex-column">
                  <span className="lead text-info" style={{ textDecoration: todo.done ? "line-through" : "" }}>{todo.text}</span>
                  <small className="text-muted"> {new Date(Number(todo.date)).toLocaleString()}  </small><small>Author : {todo.author}</small>
                </p>
                <div style={{ width: 100 }} className="d-flex justify-content-between align-items-center">
                  {
                    !todo.done && <><button className="btn btn-sm btn-dark" onClick={() => { setOpen(true); setSelectedTodo(todo.id) }}>Edit</button>
                      <button className="btn btn-sm btn-dark" onClick={() => handleDone(todo.id)}>Done</button></>
                  }
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </>
  );
}


export default App;


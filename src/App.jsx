import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTodo from "./component/AddBook";
import "./App.css";

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [todos, setTodos] = useState([]);

  const [colDefs] = useState([
    { field: "title", sortable: true, filter: true },
    { field: "author", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true },
    { field: "isbn", sortable: true, filter: true },
    { field: "price", sortable: true, filter: true },
    {
      headerName: "",
      field: "id",
      width: 90,
      cellRenderer: (params) => (
        <IconButton
          onClick={() => deleteTodo(params.value)}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch("https://bookstore-7b56b-default-rtdb.firebaseio.com/books/.json")
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setTodos(valueKeys);
  };

  const addTodo = (newTodo) => {
    fetch("https://bookstore-7b56b-default-rtdb.firebaseio.com/books/.json", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        console.log(response);
        fetchItems();
      })
      .catch((err) => console.error(err));
  };

  const deleteTodo = (id) => {
    fetch(
      `https://bookstore-7b56b-default-rtdb.firebaseio.com/books/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        console.log(response);
        fetchItems();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">TodoList</Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo} />
      <div style={{ height: 500, width: 1200 }}>
        <AgGridReact rowData={todos} columnDefs={colDefs} />
      </div>
    </>
  );
}

export default App;

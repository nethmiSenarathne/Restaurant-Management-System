import React, { useState, useEffect } from "react";
import axios from "axios";
import edititempic from "../images/inventorypic2.png";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from './Footer';

export default function Updateitem(props) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitprice, setUnitPrice] = useState("");
  const [totalprice, setTotalPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8070/inventories/get/${id}`)
      .then((res) => {
        if (res.data.success) {
          const post = res.data.post;
          setType(post.type);
          setName(post.name);
          setDate(post.date);
          setQuantity(post.quantity);
          setUnitPrice(post.unitprice);
          setTotalPrice(post.totalprice);
        } else {
          setErrorMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" || name === "unitprice") {
      calculateTotalPrice(value, name);
    }
    switch (name) {
      case "type":
        setType(value);
        break;
      case "name":
        setName(value);
        break;
      case "date":
        setDate(value);
        break;
      case "quantity":
        setQuantity(value);
        break;
      case "unitprice":
        setUnitPrice(value);
        break;
      default:
        break;
    }
  };

  const calculateTotalPrice = (value, name) => {
    let newQuantity = quantity;
    let newUnitPrice = unitprice;

    if (name === "quantity") {
      newQuantity = parseInt(value);
    } else if (name === "unitprice") {
      newUnitPrice = parseFloat(value);
    }

    const newTotalPrice = newQuantity * newUnitPrice;

    if (!isNaN(newTotalPrice)) {
      setTotalPrice(newTotalPrice.toFixed(2));
    } else {
      setTotalPrice("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      type,
      name,
      date,
      quantity,
      unitprice,
      totalprice,
    };

    axios
      .put(`http://localhost:8070/inventories/update/${id}`, updatedPost)
      .then((res) => {
        alert("stock updated");
        props.history.push("/inventories");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
      });
  };


  return (
    
      <div>
        <Header/>
        <div className="container" style={{ display: "flex" }}>
        <div>
          <img
            src={edititempic}
            alt="Logo"
            style={{ height: "400px", width: "600px", marginTop: "50px" }}
            class="d-inline-block align-text-top"
          ></img>
        </div>

        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h1 style={{ color: "#00BFFF" }}>Update Stock Record</h1>
              <label htmlFor="type" className="form-label">
                Inventory Type{" "}
              </label>
              <br></br>
              <select
                className="form-control"
                name="type"
                value={type}
                onChange={handleInputChange}
                
              >
                <option selected value="" disabled>
                  --Please choose an option--
                </option>
                <option value="Food">Food</option>
                <option value="Kitchen">Kitchen</option>
                <option  value="Vehicles">Vehicles</option>
                <option value="Farnichar">Farnichar</option>
            </select>
                </div>
          <div className="mb-3">
            <label for="name" className="form-label">Item Name</label>
            <input type="text" className="form-control" name="name"  placeholder="Enter Item Name" required  value={name} onChange={handleInputChange }></input>
            
          </div>
          <div className="mb-3">
            <label for="date" className="form-label">Date</label>
            <input type="date" className="form-control" name="date" placeholder="enter date"  value={date} required onChange={handleInputChange } min={type === "Food" ? new Date().toISOString().split("T")[0] : null}></input>
            
          </div>
          <div className="mb-3">
            <label for="quantity" className="form-label">Item Quantity</label>
            {type === "Food" && (
              <span className="input-group-text">kg</span>)}
            <input type="number" className="form-control" name="quantity" placeholder="Enter Number Of Item" required value={quantity} onChange={handleInputChange }></input>
            
          </div>
          <div className="mb-3">
            <label for="unitprice" className="form-label">Unit Price</label>
            <span className="input-group-text">LKR &nbsp;
            <input type="number" className="form-control" name="unitprice" placeholder="Enter Unit Cost" required value={unitprice} onChange={handleInputChange }></input></span>
            
          </div>
          <div className="mb-3">
            <label for="totalprice" className="form-label">Total Item Price</label>
            <span className="input-group-text">LKR &nbsp;
            <input type="number" className="form-control" name="totalprice"   value={totalprice} onChange={handleInputChange }disabled></input></span>
            
          </div>
          <button type="submit" className="btn btn-success"  style={{background: 'linear-gradient(#F7971E,#FFD200)'}}>update</button>&nbsp;
          <a className="btn btn-primary" href={"/viewinventory"} style={{background: 'linear-gradient(#F7971E,#FFD200)'}}>Back
          </a>&nbsp;
                </form>
                <br></br>
      <br></br>
                </div>
                </div>
                <Footer/>
      </div>
                
  )
}
import React from "react";
import Axios from "axios";
import { API_URL } from "../constant/API";
import "../assets/styles/admin.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Admin extends React.Component {
  state = {
    productList: [],

    addProductName: "",
    addPrice: 0,
    addProductImage: "",
    addDescription: "",
    addCategory: "",

    editId: 0,

    editProductName: "",
    editPrice: 0,
    editProductImage: "",
    editDescription: "",
    editCategory: "",
  };

  fetchProduct = () => {
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        this.setState({ productList: result.data });
      })
      .catch(() => {
        alert("Error on the server");
      });
  };

  inputHandler = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  addNewProduct = () => {
    Axios.post(`${API_URL}/products`, {
      productName: this.state.addProductName,
      price: Number(this.state.addPrice),
      productImage: this.state.addProductImage,
      description: this.state.addDescription,
      category: this.state.addCategory,
    })
      .then(() => {
        this.fetchProduct();
        this.setState({
          addProductName: "",
          addPrice: 0,
          addProductImage: "",
          addDescription: "",
          addCategory: "",
        });
      })
      .catch(() => {
        alert("Erro on the server");
      });
  };

  editToggle = (editData) => {
    this.setState({
      editId: editData.id,
      editProductName: editData.productName,
      editPrice: editData.price,
      editProductImage: editData.productImage,
      editDescription: editData.description,
      editCategory: editData.category,
    });
  };

  cancelEdit = () => {
    this.setState({ editId: 0 });
  };

  saveBtnHandler = () => {
    Axios.patch(`${API_URL}/products/${this.state.editId}`, {
      productName: this.state.editProductName,
      price: Number(this.state.editPrice),
      productImage: this.state.editProductImage,
      description: this.state.editDescription,
      category: this.state.editCategory,
    })
      .then(() => {
        this.fetchProduct();
        this.cancelEdit();
      })
      .catch(() => {
        alert("Error on the server");
      });
  };

  deleteBtnHandler = (deleteId) => {
    const confirmDel = window.confirm(
      "Are you sure you want delete the product?"
    );

    if (confirmDel) {
      Axios.delete(`${API_URL}/products/${deleteId}`)
        .then(() => {
          this.fetchProduct();
        })
        .catch(() => {
          alert("Error on the server");
        });
    }
  };

  renderProducts = () => {
    return this.state.productList.map((val) => {
      if (val.id === this.state.editId) {
        return (
          <tr>
            <td>{val.id}</td>
            <td>
              <input
                onChange={this.inputHandler}
                type="text"
                className="form-control"
                name="editProductName"
                value={this.state.editProductName}
              />
            </td>
            <td>
              <input
                onChange={this.inputHandler}
                type="number"
                className="form-control"
                name="editPrice"
                value={this.state.editPrice}
              />
            </td>
            <td>
              <input
                onChange={this.inputHandler}
                type="text"
                className="form-control"
                name="editProductImage"
                value={this.state.editProductImage}
              />
            </td>
            <td>
              <textarea
                onChange={this.inputHandler}
                className="form-control admin-product-description"
                name="editDescription"
                rows="5"
              >
                {this.state.editDescription}
              </textarea>
            </td>
            <td>
              <select
                onChange={this.inputHandler}
                name="editCategory"
                className="form-control"
                value={this.state.editCategory}
              >
                <option value="">All item</option>
                <option value="shirts">Shirts</option>
                <option value="pants">Pants</option>
                <option value="shoes">Shoes</option>
              </select>
            </td>
            <td>
              <button onClick={this.saveBtnHandler} className="btn btn-success">
                Save
              </button>
            </td>
            <td>
              <button onClick={this.cancelEdit} className="btn btn-danger">
                Cancel
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr>
          <td>{val.id}</td>
          <td>{val.productName}</td>
          <td>${val.price}</td>
          <td>
            <img
              className="admin-product-image"
              src={val.productImage}
              alt=""
            />
          </td>
          <td className="admin-product-description">{val.description}</td>
          <td>{val.category}</td>
          <td>
            <button
              onClick={() => this.editToggle(val)}
              className="btn btn-secondary"
            >
              Edit
            </button>
          </td>
          <td>
            <button
              onClick={() => this.deleteBtnHandler(val.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  componentDidMount() {
    this.fetchProduct();
  }

  render() {
    if (this.props.userGlobal.role !== "admin") {
      return <Redirect to="/" />;
    }
    return (
      <div className="p-5">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Manage Products</h1>
            <table className="table mt-4">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>{this.renderProducts()}</tbody>
              <tfoot className="bg-light">
                <tr>
                  <td></td>
                  <td>
                    <input
                      value={this.state.addProductName}
                      onChange={this.inputHandler}
                      name="addProductName"
                      placeholder="Product name"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addPrice}
                      onChange={this.inputHandler}
                      name="addPrice"
                      placeholder="Product price"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addProductImage}
                      onChange={this.inputHandler}
                      name="addProductImage"
                      placeholder="Product image link"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addDescription}
                      onChange={this.inputHandler}
                      name="addDescription"
                      placeholder="Product description"
                      type="text"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      onChange={this.inputHandler}
                      name="addCategory"
                      placeholder="Product category"
                      className="form-control"
                    >
                      <option value="">All item</option>
                      <option value="shirts">Shirts</option>
                      <option value="pants">Pants</option>
                      <option value="shoes">Shoes</option>
                    </select>
                  </td>
                  <td colSpan="2">
                    <button
                      onClick={this.addNewProduct}
                      className="btn btn-info"
                    >
                      Add Product
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

export default connect(mapStateToProps)(Admin);

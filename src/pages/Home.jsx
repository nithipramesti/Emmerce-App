import React from "react";
import ProductCard from "../components/ProductCasrd";
import Axios from "axios";
import { API_URL } from "../constant/API";

class Home extends React.Component {
  state = {
    productList: [],
    page: 1,
    maxPage: 0,
    itemPerPage: 6,
  };

  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        this.setState({
          productList: result.data,
          maxPage: Math.ceil(result.data.length / this.state.itemPerPage),
        });
      })
      .catch(() => {
        alert("There's an error in the server");
      });
  };

  renderProducts = () => {
    const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;
    const currentData = this.state.productList.slice(
      beginningIndex,
      beginningIndex + this.state.itemPerPage
    );
    return currentData.map((val) => {
      return <ProductCard productData={val} />;
    });
  };

  nextPageHandler = () => {
    if (this.state.page < this.state.maxPage) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  prevPageHandler = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  componentDidMount() {
    this.fetchProducts();
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-reader">
                <strong>Filter Products</strong>
              </div>
              <div className="card-body">
                <label htmlFor="searchProductName">Product Name</label>
                <input
                  name="searchProductName"
                  type="text"
                  className="form-control mb-3"
                />
                <label htmlFor="searchCategory">Product Category</label>
                <select name="searchCategory" className="form-control">
                  <option value="">All Item</option>
                  <option value="">Shirts</option>
                  <option value="">Shoes</option>
                  <option value="">Accessories</option>
                </select>
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-header">
                <strong>Sort Product</strong>
              </div>
              <div className="card-body">
                <label htmlFor="searchCategory">Sort by</label>
                <select name="searchCategory" className="form-control">
                  <option value="">Default</option>
                  <option value="">Lowest Price</option>
                  <option value="">Highest Price</option>
                  <option value="">A-Z</option>
                  <option value="">Z-A</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex flex-row justify-content-between align-items-center">
                {this.state.page === 1 ? (
                  <button
                    onClick={this.prevPageHandler}
                    className="btn btn-dark"
                    disabled
                  >
                    {"<"}
                  </button>
                ) : (
                  <button
                    onClick={this.prevPageHandler}
                    className="btn btn-dark"
                  >
                    {"<"}
                  </button>
                )}
                <div className="text-center">
                  Page {this.state.page} of {this.state.maxPage}
                </div>
                {this.state.page === this.state.maxPage ? (
                  <button
                    onClick={this.nextPageHandler}
                    className="btn btn-dark"
                    disabled
                  >
                    {">"}
                  </button>
                ) : (
                  <button
                    onClick={this.nextPageHandler}
                    className="btn btn-dark"
                  >
                    {">"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="d-flex flex-wrap flex-row">
              {/* Render products here */}
              {this.renderProducts()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

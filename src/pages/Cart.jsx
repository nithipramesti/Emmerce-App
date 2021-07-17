import React from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constant/API";
import { getCartData } from "../redux/actions/cart";

class Cart extends React.Component {
  state = {
    isCheckoutMode: false,
    recepientName: "",
    recepientAddress: "",
    payment: 0,
  };

  deleteBtnHandler = (cartId) => {
    Axios.delete(`${API_URL}/carts/${cartId}`)
      .then(() => {
        this.props.getCartData(this.props.userGlobal.cartId);
      })
      .catch(() => {
        alert("error");
      });
  };

  renderCart = () => {
    return this.props.cartGlobal.cartList.map((val) => {
      return (
        <tr>
          <td className="align-middle">{val.productName}</td>
          <td className="align-middle">${val.price}</td>
          <td className="align-middle">
            <img src={val.productImage} alt="" style={{ height: "150px" }} />
          </td>
          <td className="align-middle">{val.quantity}</td>
          <td className="align-middle">${val.price * val.quantity}</td>
          <td className="align-middle">
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

  renderSubtotalPrice = () => {
    let subtotal = 0;

    this.props.cartGlobal.cartList.forEach((val) => {
      subtotal += val.quantity * val.price;
    });

    return subtotal;
  };

  renderTaxFee = () => {
    return (5 / 100) * this.renderSubtotalPrice();
  };

  renderTotalPrice = () => {
    return this.renderSubtotalPrice() + this.renderTaxFee();
  };

  checkoutModeToggle = () => {
    this.setState({ isCheckoutMode: !this.state.isCheckoutMode });
  };

  inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  payBtnHandler = () => {
    const d = new Date();

    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.userGlobal.id,
      recepientName: this.state.recepientName,
      recepientAddress: this.state.recepientAddress,
      totalPrice: this.renderTotalPrice(),
      totalPayment: Number(this.state.payment),
      transactionDate: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
      transactionItems: this.props.cartGlobal.cartList,
    })
      .then((result) => {
        alert("Payment success!");

        result.data.transactionItems.forEach((val) => {
          this.deleteBtnHandler(val.id);
        });

        this.setState({ isCheckoutMode: false });
      })
      .catch(() => {
        alert("error");
      });
  };

  render() {
    return (
      <div className="p-5 text-center">
        <h1>Cart</h1>
        <div className="row mt-5">
          <div className="col-9 text-center">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
              <tfoot className="bg-light">
                <tr>
                  <td colSpan="6">
                    <button
                      onClick={this.checkoutModeToggle}
                      className="btn btn-success"
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {this.state.isCheckoutMode ? (
            <div className="col-3">
              {/* Form checkout */}
              <div className="card">
                <div className="card-header">
                  <strong>Order Summary</strong>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between align-items-center my-2">
                    <span className="fw-bold">Subtotal Price</span>
                    <span>${this.renderSubtotalPrice()}</span>
                  </div>
                  <div className="d-flex flex-row justify-content-between align-items-center my-2">
                    <span className="fw-bold">Tax Fee (5%)</span>
                    <span>${this.renderTaxFee()}</span>
                  </div>
                  <div className="d-flex flex-row justify-content-between align-items-center my-2">
                    <span className="fw-bold">Total Price</span>
                    <span>${this.renderTotalPrice()}</span>
                  </div>
                </div>
                <div className="card-body border-top text-start">
                  <label htmlFor="recepientName">Recepient Name</label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control mb-3"
                    name="recepientName"
                  />
                  <label htmlFor="recepientAddress">Recepient Address</label>
                  <textarea
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control"
                    name="recepientAddress"
                  />
                </div>
                <div className="card-footer">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <input
                      onChange={this.inputHandler}
                      name="payment"
                      type="number"
                      className="form-control mx-1"
                    />
                    <button
                      onClick={this.payBtnHandler}
                      className="btn btn-success mx-1"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart,
  };
};

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

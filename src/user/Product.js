import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { getCategories, getBrands, createProduct } from "./helper";
import { isAuthenticated } from "../auth/helper";

function Product(props) {
  const [values, setValues] = useState({
    name: "",
    description: "",
    marketPrice: "",
    dealerPrice: "",
    salesPrice: "",
    incentive: "",
    landingPrice: "",
    category: "",
    categories: [],
    brand: "",
    brands: [],
    error: "",
    createdProduct: "",
  });
  const {
    name,
    description,
    marketPrice,
    dealerPrice,
    salesPrice,
    incentive,
    landingPrice,
    category,
    categories,
    brand,
    brands,
    createdProduct,
    error,
  } = values;

  const { user, token } = isAuthenticated();

  const preload = async () => {
    let c = [];
    let b = [];
    await getCategories(token)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          c = data;
        }
      })
      .catch((err) => console.log(err));

    await getBrands(token)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          b = data;
        }
      })
      .catch((err) => console.log(err));
    setValues({ ...values, categories: c, brands: b });
  };
  useEffect(() => {
    preload();
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true, error: "" });
    createProduct(user._id, token, {
      name,
      description,
      marketPrice,
      dealerPrice,
      salesPrice,
      incentive,
      landingPrice,
      category,
      brand,
    })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            marketPrice: "",
            dealerPrice: "",
            salesPrice: "",
            incentive: "",
            landingPrice: "",
            createdProduct: data.name,
            loading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => (
    <div
      style={{ display: createdProduct ? "" : "none" }}
      className="alert alert-success mt-3"
    >
      {createdProduct} created Successfully.
    </div>
  );

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const createProductForm = () => {
    return (
      <form>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input
              onChange={handleChange("name")}
              type="text"
              className="form-control"
              value={name}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10">
            <input
              onChange={handleChange("description")}
              type="text"
              className="form-control"
              value={description}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group col-sm-4">
            <label>MRP</label>
            <input
              onChange={handleChange("marketPrice")}
              type="text"
              className="form-control"
              value={marketPrice}
            />
          </div>
          <div className="form-group col-sm-4">
            <label>Sales Price</label>
            <input
              onChange={handleChange("salesPrice")}
              type="text"
              className="form-control"
              value={salesPrice}
              required
            />
          </div>
          <div className="form-group col-sm-4">
            <label>Dealer Price</label>
            <input
              onChange={handleChange("dealerPrice")}
              type="text"
              className="form-control"
              value={dealerPrice}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group col-sm-6">
            <label>Incentive</label>
            <input
              onChange={handleChange("incentive")}
              type="text"
              className="form-control"
              value={incentive}
              required
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Landing Price</label>
            <input
              onChange={handleChange("landingPrice")}
              type="text"
              className="form-control"
              value={landingPrice}
              required
            />
          </div>
        </div>
        <div className=" row">
          <div className="form-group col-sm-6">
            <label>Category</label>
            <select
              onChange={handleChange("category")}
              className="form-control"
            >
              <option>Select</option>
              {categories &&
                categories.map((cate, index) => (
                  <option key={index} value={cate.name}>
                    {cate.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group col-sm-6">
            <label>Brand</label>
            <select onChange={handleChange("brand")} className="form-control">
              <option>Select</option>
              {brands &&
                brands.map((brand, index) => (
                  <option key={index} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-10">
            <button onClick={onSubmit} className="btn btn-dark">
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Products"
      description="Manage your Products here."
      sideOptionData={{ value: "All Products", to: "/allproducts" }}
    >
      {successMessage()}
      {errorMessage()}
      {createProductForm()}
    </Base>
  );
}

export default Product;

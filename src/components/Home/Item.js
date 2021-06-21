import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Css
import styles from "./home.module.css";

export default function Item({
    product = {},
    colors = {},
    originProduct = {},
    index = 0,
    handleChangeProduct,
    takeChangedProducts,
}) {
    // Flag to determine if the data can be submit to the parent component
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of errors when user don't obey the data format
    const [listErrors, setListErrors] = useState({});

    // The part of data of product that be fixed by user
    const [partFixed, setPartFixed] = useState({});

    // Function to validate the requirement "is required,
    // limit length" that return the errors when user don't obey the data format
    const validate = (values) => {
        let errors = {};

        // Validate the name of product
        if (values.name !== undefined) {
            if (!values.name) {
                errors.name = "Cannot be blank";
            } else if (values.name.length > 50) {
                errors.name = "Name have at most 50 characters";
            }
        };

        // Validate the sku of product
        if (values.sku !== undefined) {
            if (!values.sku) {
                errors.sku = "Cannot be blank";
            } else if (values.sku.length > 20) {
                errors.sku = "Sku have at most 20 characters";
            };
        };

        return errors;
    };

    // Handle the changed text on the screen
    const handleChange = (e) => {
        // Call the function update of parent component
        handleChangeProduct(e.target.name, e.target.value || null, index);
    };

    // When user don't focus the cell, the data of product entered by
    // user will determine if that can be submitted to parent component to popup the result
    const unFocus = (e) => {
        let temp = { [e.target.name]: e.target.value || null };

        setListErrors(validate(temp));

        setPartFixed(temp);

        setIsSubmitting(true);
    };

    useEffect(() => {
        isSubmitting && takeChangedProducts(originProduct, partFixed);
    }, [listErrors]);

    return (
        <tr className={styles.containerItem}>
            <td>{product.id}</td>
            <td>{product.errorDescription}</td>
            <td>
                <img src={product.image} alt="Failure" />
            </td>
            <td>
                <div className={styles.formRow}>
                    <input
                        type="text"
                        value={product.name}
                        name="name"
                        onChange={handleChange}
                        onBlur={unFocus}
                        className={
                            listErrors.name
                                ? styles.inputError
                                : styles.inputCorrect
                        }
                    />
                    {listErrors.name && (
                        <span className={styles.error}>{listErrors.name}</span>
                    )}
                </div>
            </td>
            <td style={{ width: "10%" }}>
                <div className={styles.formRow}>
                    <input
                        type="text"
                        value={product.sku}
                        name="sku"
                        onChange={handleChange}
                        onBlur={unFocus}
                        className={
                            listErrors.sku
                                ? styles.inputError
                                : styles.inputCorrect
                        }
                    />
                    {listErrors.sku && (
                        <span className={styles.error}>{listErrors.sku}</span>
                    )}
                </div>
            </td>
            <td>
                <select
                    // Convert null to string ""
                    value={product.color || ""}
                    name="color"
                    style={{ color: "black" }}
                    onChange={handleChange}
                    onBlur={unFocus}>
                    <option value=""></option>
                    {Object.keys(colors).map((key, index) => {
                        return (
                            <option key={"color" + index} value={key}>
                                {colors[key]}
                            </option>
                        );
                    })}
                </select>
            </td>
        </tr>
    );
}

// Type of props
// eslint-disable-next-line react/no-typos
Item.PropTypes = {
    product: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    originProduct: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleChangeProduct: PropTypes.func.isRequired,
    takeChangeProducts: PropTypes.func.isRequired,
};

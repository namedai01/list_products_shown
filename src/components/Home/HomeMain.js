import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { cloneDeep } from "lodash";

// My components
import Popup from "../Popup/Popup.js";
import Item from "./Item.js";

// Css
import styles from "./home.module.css";
import "antd/dist/antd.css";

// Get api
import * as api from "../../api/index.js";

// Get default image
import defaultImg from "../../assets/default.jpeg";

// Int page size
const pageSize = 10;

export default function HomeMain() {
    // State "products" can change elements
    const [products, setProducts] = useState([]);

    // State "originProducts" cannot change elements, that is origin products
    const [originProducts, setOriginProducts] = useState([]);

    // State for object colors
    const [colors, setColors] = useState({});

    // The products can be fixed by user can be save in Object "changedProducts"
    const [changedProducts, setChangeProducts] = useState({});

    // Determine the modal can be visible or not
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Object page to control the pagination
    const [page, setPage] = useState({
        totalPage: 0,
        current: 1,
        minIndex: 0,
        maxIndex: 0,
    });

    // Compare if the product fixed by the user is the same as the original product ?
    const compareProducts = (product1, product2) => {
        return (
            product1.name === product2.name &&
            product1.sku === product2.sku &&
            product1.color == product2.color
        );
    };

    // Function to push the changed product to the Dictionary "changedProducts"
    const takeChangedProducts = (proNeedFixed, partFixed) => {
        // Ex: changedProducts has format: {0: {id: 0, name: ...}, 1: {id: 1, name: ...}} with the key equal to "id of product"
        let temp = {
            ...changedProducts,
            ...{
                [proNeedFixed.id]: {
                    ...proNeedFixed,
                    ...changedProducts[proNeedFixed.id],
                    ...partFixed,
                },
            },
        };

        // Compare if the product fixed by the user is the same as the original product ?. If yes, remove from "changedProduct"
        compareProducts(proNeedFixed, temp[proNeedFixed.id]) &&
            delete temp[proNeedFixed.id];

        setChangeProducts(temp);
    };

    // Handle for close the modal (Popup)
    const handleOk = () => {
        setIsModalVisible(false);
    };

    // Validate that the condition "is required, limit length" is satisfied
    const validateChangedProducts = () => {
        for (const [key, product] of Object.entries(changedProducts)) {
            if (!product.name || !product.sku) return false;
            if (product.name.length > 50 || product.sku.length > 50)
                return false;
        }
        return true;
    };

    // Function to pop up a modal
    const showModal = () => {
        Object.keys(changedProducts).length > 0 &&
            validateChangedProducts() &&
            setIsModalVisible(true);
    };

    // Get data from api
    useEffect(() => {
        const fetchData = async () => {
            // Get the list of error products from api through function getProducts
            const productsData = await api.getProducts();

            // Set state for state "products" (may be changed) and "originProducts" (cannot be changed)
            setProducts(productsData);
            
            // Use cloneDeep to avoid reference to the same memory
            setOriginProducts(cloneDeep(productsData));

            // Set state to calc the total page, min and max index for each page
            setPage({
                totalPage: productsData.length / pageSize,
                minIndex: 0,
                maxIndex: pageSize,
            });

            // Get the list color from apu through function getColors
            const colorsData = await api.getColors();

            // Convert array of colors to object colors. Ex: {"1": "white", ...}
            var object = colorsData.reduce(
                (obj, item) => Object.assign(obj, { [item.id]: item.name }),
                {}
            );

            // Set state for object colors
            setColors(object);
        };
        fetchData();
    }, []);

    // Change page for pagination
    const handleChangePage = (curPage) => {
        setPage({
            current: curPage,
            minIndex: (curPage - 1) * pageSize,
            maxIndex: curPage * pageSize,
        });
    };

    // Handle the changed text on the screen, change the state "products"
    const handleChangeProduct = (key, value, index) => {
        let tmp = [...products];
        tmp[index][key] = value;
        setProducts(tmp);
    };

    return (
        <div className={styles.container}>
            <h1>List of error products</h1>

            <div>
                <button onClick={showModal}>Submit</button>
                <Popup
                    isModalVisible={isModalVisible}
                    handleOk={handleOk}
                    changedProducts={changedProducts}
                    colors={colors}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Error Description</th>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th>Color</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product, index) => {
                        if (page.minIndex <= index && index < page.maxIndex) {
                            if (product.image === "")
                                product.image = defaultImg;
                            // Each component "Item" is a row of the table
                            return (
                                <Item
                                    product={product}
                                    originProduct={originProducts[index]}
                                    colors={colors}
                                    key={"product" + index}
                                    takeChangedProducts={takeChangedProducts}
                                    handleChangeProduct={handleChangeProduct}
                                    index={index}
                                />
                            );
                        }
                    })}
                </tbody>
            </table>

            {/* Pagination component */}
            <Pagination
                pageSize={pageSize}
                current={page.current}
                total={products.length}
                onChange={handleChangePage}
                style={{ marginTop: "40px", marginBottom: "40px" }}
            />
        </div>
    );
}

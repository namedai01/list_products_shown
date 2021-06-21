import React, { useEffect, useState } from "react";
import { Pagination } from "antd";

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
    // State "products" can be changed elements
    const [products, setProducts] = useState([]);

    // State "originProducts" cannot be changed elements, that is origin products
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

    // Function to push the changed product to the Dictionary "changedProducts"
    const takeChangedProducts = (proNeedFixed, partFixed) => {
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
            if (product.name.length > 50 || product.sku.length > 50) return false;
        }
        return true;
    }

    // Function to pop up a modal
    const showModal = () => {
        Object.keys(changedProducts).length > 0 && validateChangedProducts() && setIsModalVisible(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Get the list of error products from api through function getProducts
            const productsData = await api.getProducts();

            // Set state for state "products" (may be changed) and "originProducts" (cannot be changed)
            setProducts(productsData);
            setOriginProducts(productsData);

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

    // Update product to display the screen
    const handleChangeProduct = (key, value, index) => {
        let temp = [...products];
        temp[index][key] = value;
        setProducts(temp);
    }

    return (
        <div className={styles.container}>
            <h1>List of error products</h1>
            <div>
                <button onClick={showModal}>Submit</button>
                <Popup isModalVisible={isModalVisible} handleOk={handleOk} changedProducts={changedProducts} colors={colors}/>
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
                            return (
                                <Item
                                    product={product}
                                    originProduct={originProducts[index]}
                                    colors={colors}
                                    key={"product" + index}
                                    takeChangedProducts={takeChangedProducts}
                                    handleChangeProduct={handleChangeProduct}
                                    index = {index}
                                />
                            );
                        }
                    })}
                </tbody>
            </table>

        <Pagination
            pageSize={pageSize}
            current={page.current}
            total={products.length}
            onChange={handleChangePage}
            style={{ marginTop: "15px" }}
        />
        </div>
    );
}

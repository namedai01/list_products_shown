import Modal from "antd/lib/modal/Modal";
import React from "react";
import PropTypes from "prop-types";

// Css
import styles from "./popup.module.css";

export default function Popup({
    isModalVisible = false,
    changedProducts = [],
    colors = [],
    handleOk,
}) {
    return (
        <Modal
            title="Re-Uploaded Products"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleOk}>
            <div className={styles.popupContainer}>
                {Object.keys(changedProducts).map((key, index) => (
                    <div key={"popup" + index} className={styles.div121}>
                        <div className={styles.image}>
                            <img
                                src={changedProducts[key].image}
                                alt="Failure"
                            />
                        </div>
                        <div className={styles.content}>
                            <span style={{ color: "black" }}>
                                {changedProducts[key].name}
                            </span>
                            <span>
                                ID: <span>{changedProducts[key].id}</span>
                            </span>
                            <span>
                                SKU:{" "}
                                <span style={{ color: "red" }}>
                                    {changedProducts[key].sku}
                                </span>
                            </span>
                            <span>
                                Color:{" "}
                                <span>
                                    {colors[changedProducts[key].color]}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

// Type of props
// eslint-disable-next-line react/no-typos
Popup.PropTypes = {
    isModalVisible: PropTypes.bool.isRequired,
    changedProducts: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
}
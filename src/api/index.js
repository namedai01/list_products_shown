import axios from "axios";

// The function to get data of products from api
export const getProducts = async () => {
    try {
        const response = await axios.get("https://60ae0d5e80a61f00173324bc.mockapi.io/products");
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

// The function to get data of colors from api
export const getColors = async () => {
    try {
        const response = await axios.get("https://60ae0d5e80a61f00173324bc.mockapi.io/colors");
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
const USDA_ENDPOINT = 'https://api.nal.usda.gov/fdc/v1/';
import {USDA_API_KEY} from "../values/Keys";

export const searchResultsEndpoint = `${USDA_ENDPOINT}search?api_key=${USDA_API_KEY}`;

export const getFoodDetailsEndpoint = (fdcId) => {
    return `${USDA_ENDPOINT}${fdcId}?api_key=${USDA_API_KEY}`
};

export const axiosConfig = {
    headers: {
        'content-type': 'application/json'
    }
};
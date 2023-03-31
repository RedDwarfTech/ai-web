
const initState = {
    image:{}
};

const ImageReducer = (state=initState, action) => {
    switch (action.type) {
        case "GEN_IMAGE":
            return {
                ...state,
                image: action.image 
            };
        default:
            break;
    }
    return state;
};

export default ImageReducer;



import { genImage } from "@/service/images/ImageService";
import React, { useState } from "react";
import "./GenImages.css";
import { toast, ToastContainer } from 'react-toastify';
import { withConnect } from "rd-component";
import { useSelector } from "react-redux";
import { IImageResp } from "@/models/images/IImageResp";

const GenImages: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const { image } = useSelector((state: any) => state.image);
    const [genImageResult, setGenImageResult] = useState<IImageResp>();

    React.useEffect(() => {
        if (image) {
            setGenImageResult(image);
        }
    }, [image]);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleEnterKey = (e: any) => {
        if (e.nativeEvent.keyCode === 13) {
            handleSend();
        }
    }

    const handleSend = async () => {
        if (!isLoggedIn) {
            toast.warning("请登录后再生成图片");
            return;
        }
        if (!inputValue) {
            return;
        }
        let params = {
            prompt: inputValue
        };
        genImage(params).then(() => {
        });
    };

    const renderImages = () => {
        if(!genImageResult) return;
        const tagList: JSX.Element[] = [];
        if (Object.keys(genImageResult).length > 0 && Object.keys(genImageResult).length > 0) {
            let imageList: [] = image.image;
            imageList.forEach((item) => {
                let url = item['url'];
                tagList.push(
                    <img className="img-item" src={url} alt="description" />
                );
            });
        }
        return tagList;
    };

    const renderSingleImages = () => {
        if(!genImageResult || Object.keys(genImageResult).length == 0) return;
        const baseUrl = 'data:image/png;base64,' + genImageResult.imageStr;
         return(<img className="img-item" src={baseUrl} alt="description" />);         
    };


    return (
        <div>
            <div className="image-input">
                <input id="talkInput"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyPress={handleEnterKey}
                    type="text" placeholder="输入描述，如: a beautiful cat" />
                <button onClick={handleSend}><span>生成</span></button>
            </div>
            <div className="appDivider"></div>
            {renderSingleImages()}
            <ToastContainer />
        </div>
    );
}

export default withConnect(GenImages);

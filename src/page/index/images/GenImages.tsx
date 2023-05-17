import { genImage } from "@/service/images/ImageService";
import { Button, Divider, Input, message } from "antd";
import React, { useState } from "react";
import "./GenImages.css"
import { withConnect } from "rd-component";
import { useSelector } from "react-redux";
import { IImageResp } from "@/models/images/IImageResp";

const GenImages: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const [loadings, setLoadings] = useState<boolean>(false);
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
            await message.warning("请登录后再生成图片");
            setLoadings(false);
            return;
        }
        if (!inputValue) {
            return;
        }
        setLoadings(true);
        let params = {
            prompt: inputValue
        };
        genImage(params).then(() => {
            setLoadings(false);
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
                <Input id="talkInput"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyPress={handleEnterKey}
                    type="text" placeholder="输入描述，如: a beautiful cat" />
                <Button type="primary" loading={loadings} onClick={handleSend}><span>生成</span></Button>
            </div>
            <Divider></Divider>
            {renderSingleImages()}
        </div>
    );
}

export default withConnect(GenImages);

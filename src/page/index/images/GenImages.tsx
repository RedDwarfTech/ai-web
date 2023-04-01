import { genImage } from "@/service/images/ImageService";
import { Button, Divider, Input, message } from "antd";
import React, { useState } from "react";
import "./GenImages.css"
import { IImageResp } from "@/models/images/IImageResp";
import { connect } from "react-redux";
import { genImageAction } from "@/action/images/ImageAction";

const GenImages: React.FC<IImageResp> = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const [loadings, setLoadings] = useState<boolean>(false);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleEnterKey = (e: any) => {
        if (e.nativeEvent.keyCode === 13) {
            handleSend();
        }
    }

    const handleSend = () => {
        if (!isLoggedIn) {
            message.warning("请登录后再生成图片");
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
        const tagList: JSX.Element[] = [];
        if(Object.keys(props.image).length>0 && Object.keys(props.image.image).length>0) {
            let imageList:[] = props.image.image;
            imageList.forEach((item) => {
                let url = item['url'];
                tagList.push(
                    <img className="img-item" src={url} alt="description" />
                );
            });
        }
        return tagList;
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
            {renderImages()}
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    image: state.image
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        genImage: (prompt: any) => {
            dispatch(genImageAction(prompt))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GenImages);

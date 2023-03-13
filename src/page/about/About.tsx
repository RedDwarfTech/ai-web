import React from "react";
import "./About.css"


const About: React.FC = (props) => {
  return (
    <div className="about-container">
      <div className="about-intro">
      欢迎来到我们的AI对话平台，这是一个能够与多个平台进行人工智能对话的网站。我们的平台使用最先进的自然语言处理技术和深度学习算法，为用户提供高质量、智能化的对话体验。

      我们的平台可以与多个平台进行对话，这使得用户可以轻松地在不同的平台上与AI进行对话，无需切换。

      我们的AI平台能够识别用户的意图并进行自然、流畅的对话，无论用户提出的问题是什么。

      相比于辗转各个平台，我们致力于为用户提供统一的、最好的对话体验，为此我们不断优化我们的技术和服务。我们相信，通过我们的AI对话平台，用户将能够轻松地与世界各地的人交流，获得更多的信息和知识。
      </div>
    </div>
  );
}

export default About;
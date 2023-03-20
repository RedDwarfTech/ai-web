import React from "react";
import { readConfig } from "../../../config/app/config-reader";
import { doLoginOut } from "../../../service/user/UserService";

const About: React.FC = (props) => {

    React.useEffect(() => {
           doLoginOut();
           window.location.href = readConfig("appHome");
    }, []);

  return (
    <div>
      Redirect......
    </div>
  );
}

export default About;
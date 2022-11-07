import React, {useEffect, useState, useMemo} from "react";
import './MyProfilePhoto.css';

function MyPhoto(props) {
    const [image, setImage] = useState()
    const [, setResponse] = useState()

    // Set Tokens & Bearers
    const token = props.mstoken;
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    headers.append("Content-type", 'image/jpeg');
    const options = {method: "GET", headers: headers,};

    const getProfilePhoto = () => {
        fetch("https://graph.microsoft.com/v1.0/me/photo/$value", options)
          .then(response => {
              response.blob().then((data) => {
                  const reader = new FileReader()
                  reader.readAsDataURL(data)
                  reader.onload = () => {
                      const base64data = reader.result;
                      setImage(base64data)
                      setResponse(response.ok)
                  }
              })
          })

        localStorage.setItem('UserPic', image);
    }

    useEffect(() => {
        getProfilePhoto();
    },[image, token]);


    return (
        <div>
            <img src={image} alt={'Your Profile Photo'} />
        </div>
    )
}

export default React.memo(MyPhoto);
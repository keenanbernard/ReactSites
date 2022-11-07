import React, {useEffect, useState, Fragment} from "react";
import {Card} from "react-bootstrap";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination, Navigation} from "swiper";
import "./RecentActivities.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PeerCard1 from "../../PeerCards/Digi RR brighten my day.webp";
import PeerCard2 from "../../PeerCards/Digi RR Finding creative solutions.webp";
import PeerCard3 from "../../PeerCards/Digi RR going above and beyond.webp";
import PeerCard4 from "../../PeerCards/Digi RR Making things happen.webp";
import PeerCard5 from "../../PeerCards/Digi RR Supportive Team Player.webp";
import PeerCard6 from "../../PeerCards/Digi RR Behind the scenes.webp";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";


export default function Activities(props) {
    const [recognitions, setRecognitions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecognitions, setTotalRecognitions] = useState();


  // Get recognitions from middleware
    const geTotalHighFives = async () => {
      const response = await fetch(`${props.host}/getTotalHighFives`);
      let data = await response.json();
      if (data[0].TOTALHIGHFIVES > 0) {
        setIsLoading(true);
        const response = await fetch(`${props.host}/RecentActivities`);
        let data = await response.json();
        setRecognitions(data);
        setTotalRecognitions(data.length);
        setIsLoading(false);
      } else {
        setTotalRecognitions(0);
      }
      setIsLoading(false);
    }

    useEffect(() => {
      geTotalHighFives();
    }, [props.history]);


    return (
        <Card className="cardBackground">
          {totalRecognitions > 0 ?
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              slidesPerGroup={3}
              loop={true}
              loopFillGroupWithBlank={false}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation, Autoplay]}
              className="mySwiper"
            >
              {isLoading ? <LoadingSpinner /> : <>
                {recognitions && recognitions.map((val, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img src={val.PEERCARDID === 1 ? PeerCard1 : ''
                      || val.PEERCARDID === 2 ? PeerCard2 : ''
                      || val.PEERCARDID === 3 ? PeerCard3 : ''
                      || val.PEERCARDID === 4 ? PeerCard4 : ''
                      || val.PEERCARDID === 5 ? PeerCard5 : ''
                      || val.PEERCARDID === 6 ? PeerCard6 : ''} alt={''}/>
                      <p className='swiperLabel'>{val.SENDERGIVENNAME} sent to {val.RECEIVERGIVENNAME} </p>
                    </SwiperSlide>
                  )
                })}</>
              }
            </Swiper> : <p className='noHighFives'>NO HIGH-FIVES HAVE BEEN SENT</p>
          }
        </Card>
    );
}

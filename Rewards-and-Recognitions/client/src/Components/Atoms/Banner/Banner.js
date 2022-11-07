import React from "react";
import {Carousel} from "react-bootstrap";
import bannerImage1 from "./LandingpageBanners/Digi RR portal landing page banner updated 2.jpg";
import bannerImage2 from "./LandingpageBanners/Digi RR portal landing page banner 2.jpg";
import bannerImage3 from "./LandingpageBanners/Digi RR portal landing page banner 3 edit.jpg";
import './Banner.css';

function Banner() {
  return (
    <>
      <Carousel>
        <Carousel.Item>
          <img className='bannerImage' src={bannerImage1} alt={'Banner 1'} style={{width: '100%', paddingTop: 16}}/>
          <div className='feedLabel pt-3'><p>"If everyone is moving together, then success takes care of itself" - Henry Ford</p></div>
        </Carousel.Item>
        <Carousel.Item>
            <img className='bannerImage' src={bannerImage2} alt={'Hi'} style={{width: '100%', paddingTop: 16}}/>
            <div className='feedLabel pt-3'><p>"Take a moment to appreciate how awesome you are."</p></div>
        </Carousel.Item>
        <Carousel.Item>
            <img className='bannerImage' src={bannerImage3} alt={'Hi'} style={{width: '100%', paddingTop: 16}}/>
            <div className='feedLabel pt-3'><p>"We are what we reportedly do. Excellence then, is not an act, but a habit." - Aristotle</p></div>
        </Carousel.Item>
      </Carousel>
    </>
  )
}

export default Banner;
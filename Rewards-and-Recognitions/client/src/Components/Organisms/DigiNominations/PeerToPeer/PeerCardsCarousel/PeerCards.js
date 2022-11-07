import React from "react";
import {Carousel, Modal} from "react-bootstrap";
import './PeerCards.css';
import PeerCard1 from '../../../../PeerCards/Brighten the day - WIDE.webp';
import PeerCard2 from '../../../../PeerCards/Finding Creative Solutions - WIDE.webp';
import PeerCard3 from '../../../../PeerCards/above and beyond gif1.webp';
import PeerCard4 from '../../../../PeerCards/Digi RR Making things happen - NEW.webp';
import PeerCard5 from '../../../../PeerCards/TEAM WORK.webp';
import PeerCard6 from '../../../../PeerCards/Behind the scenes.webp';

function PeerCards() {
    return (
        <Carousel>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Brightening the Day </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard1}
                    alt="First slide"
                />
                <p className='peerCardDesc'>You are a perfect reflection of the choices you have made.</p>
            </Carousel.Item>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Finding Creative Solutions </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard2}
                    alt="Second slide"
                />
                <p className='peerCardDesc'>There is no doubt that creativity is the most important human resource of all.</p>
            </Carousel.Item>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Going Above and Beyond </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard3}
                    alt="Third slide"
                />
                <p className='peerCardDesc'>Fearlessness is extending ourselves beyond our limited view.</p>
            </Carousel.Item>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Making it happen </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard4}
                    alt="Fourth slide"
                />
                <p className='peerCardDesc'>If you really are passionate about it, you're just going to find a way to make it happen.</p>
            </Carousel.Item>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Supportive Team Player </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard5}
                    alt="Fifth slide"
                />
                <p className='peerCardDesc'>It is literally true that you can succeed best and quickest by helping others to succeed.</p>
            </Carousel.Item>
            <Carousel.Item>
                <Modal.Title id="contained-modal-title-vcenter"> Working Behind the Scenes </Modal.Title>
                <img
                    className="d-block w-100 peerCardHeight"
                    src={PeerCard6}
                    alt="Sixth slide"
                />
                <p className='peerCardDesc'>Hard work doesn’t go unnoticed.</p>
            </Carousel.Item>
    </Carousel>
    )
}

export default React.memo(PeerCards);
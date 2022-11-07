import React from 'react';
import {Carousel, Modal} from "react-bootstrap";

function PhotoGallery(props) {

    const milestoneImages = [props.milestones]

    return (
        <div>
            <Modal {...props} fullscreen="true" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <p style={{textAlign: "center", fontWeight: "bold", color: "navy", marginBottom: 0}}>{props.title}</p>
                    <Carousel>
                        {milestoneImages[0]?.map((val, index) => {
                            return(
                            <Carousel.Item key={index}>
                                <img className='bannerImage' src={val} alt={'Milestone'}
                                     style={{width: '100%', paddingTop: 16}}/>
                            </Carousel.Item>
                            )})}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PhotoGallery;
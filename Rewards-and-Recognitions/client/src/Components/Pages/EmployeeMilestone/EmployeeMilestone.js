import React, {useState} from 'react';
import {Link} from "react-scroll";
import {motion} from "framer-motion";
import {Row} from 'react-bootstrap';
import PhotoGallery from "./PhotoGalleryModal/PhotoGalleryModal";
import {milestonestwentytwo} from "./Milestone2022";
import {milestonestwentyone} from "./Milestone2021";
import MileStoneBanner from "./Images/Digi RR MileStones.png";
import Folder1 from "./Images/2022.png";
import Folder2 from "./Images/2021.png";
import Folder3 from "./Images/2020.png";
import Folder4 from "./Images/PhotoGallery.png";
import YouTube1 from "./Images/2022YouTubeVideo.png";
import YouTube2 from "./Images/2021YouTubeVideo.png";
import YouTube3 from "./Images/2020YouTubeVideo.png";
import './EmployeeMilestone.css';

function EmployeeMilestone() {
    const [photo, setPhoto] = useState(YouTube1);
    const [link, setLink] = useState('https://www.youtube.com/watch?v=IXCbLcT0-Z8');
    const [hiddenValYoutube, setHiddenValYoutube] = useState(true);
    const [hiddenValGallery, setHiddenValGallery] = useState(true);
    const [photoGalShow, setPhotoGalShow] = useState(false);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('Employee Recognition Day 2022');

    const RecogOne = async () => {
        setPhoto(YouTube1);
        setHiddenValYoutube(false);
        setHiddenValGallery(false);
        setLink('https://www.youtube.com/watch?v=IXCbLcT0-Z8');
        setImages(milestonestwentytwo);
        setTitle('Employee Recognition Day 2022');
    }

    const RecogTwo = async () => {
        setPhoto(YouTube2);
        setHiddenValYoutube(false);
        setHiddenValGallery(false);
        setLink('https://www.youtube.com/watch?v=_e1QVkCQIBQ');
        setImages(milestonestwentyone);
        setTitle('Employee Recognition Day 2021');
    }

    const RecogThree = async () => {
        setPhoto(YouTube3);
        setHiddenValYoutube(false);
        setHiddenValGallery(true);
        setLink('https://www.youtube.com/watch?v=MMbeOsKr73M');
    }

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div className="container-fluid" id="milestoneDiv" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            <Row className='bannerImageRow'>
                <img className='milestoneImage' src={MileStoneBanner} alt={'Banner 1'} style={{width: '60%', paddingTop: 16}}/>

                <p className='firstParagraph'>Employees Years of Service are a true testimony of their <span>HARD WORK, LOYALTY</span> and <span>DEDICATION</span> to the organization.</p>
                <p className='secondParagraph'>Join us in recognizing and celebrating the service milestones of fellow peers. They are a significant part of our team, and we could</p>
                <p className='thirdParagraph'>not imagine our workplace without them.</p>
                <p className='fourthParagraph'>Congratulations on their work anniversary!</p>
            </Row>
            <Row>
                <div className="milestoneRow">
                    <div className="milestoneColumn" >
                        <Link to='smoothScroll' offset={300} duration={10} smooth={true} delay={90}>
                            <img className="milestoneOnHover" src={Folder1} style={{width: '50%', marginLeft: '50%'}} alt='Brightening the Day' onClick={RecogOne}/>
                        </Link>
                    </div>
                    <div className="milestoneColumn">
                        <Link to='smoothScroll' offset={300} duration={10} smooth={true} delay={90}>
                            <img className="milestoneOnHover" src={Folder2} style={{width: '50%', marginLeft: '25%'}} alt='Finding Creative Solutions' onClick={RecogTwo}/>
                        </Link>

                    </div>
                    <div className="milestoneColumn">
                        <Link to='smoothScroll' offset={300} duration={10} smooth={true} delay={90}>
                            <img className="milestoneOnHover" src={Folder3} style={{width: '50%'}} alt='Going Above & Beyond' onClick={RecogThree}/>
                        </Link>
                    </div>
                </div>
            </Row>
            <Row>
                <div className="milestoneRow">
                    <div className="milestoneColumn2">
                        <p className='youtubeText' hidden={hiddenValYoutube}>Watch this video!</p>
                        <img className="milestoneOnHover" id='smoothScroll' src={photo} hidden={hiddenValYoutube} style={{width: '50%', marginTop: '0%', marginLeft: '50%'}} alt='Youtube PNG' onClick={() => openInNewTab(link)}/>
                    </div>

                    <div className="milestoneColumn2">
                        <img className="milestoneOnHover" src={Folder4} hidden={hiddenValGallery} style={{width: '50%', marginTop: '4%', marginLeft: '25%'}} alt='Finding Creative Solutions' onClick={() => setPhotoGalShow(true)}/>
                    </div>

                    <PhotoGallery show={photoGalShow} milestones={images} title={title} onHide={() => setPhotoGalShow(false)} />

                    <div className="milestoneColumn2">
                    </div>
                </div>
            </Row>
        </motion.div>
    )
}

export default EmployeeMilestone;

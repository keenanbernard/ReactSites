import { AnimatePresence } from 'framer-motion';
import React from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import LandingPage from "../../Pages/LandingPage/LandingPage";
import RecognitionsBreakdown from "../../Pages/UserPages/RecognitionBreakdown/RecognitionsBreakdown";
import MyRecognitions from "../../Pages/UserPages/MyRecognitionsPage/MyRecognitions";
import NominationView from "../../Pages/UserPages/MyNominations/NominationView";
import MyQuarterlyNominations from "../../Pages/UserPages/MyNominations/MyQuarterlyNominations";
import MyYearlyNominations from "../../Pages/UserPages/MyNominations/MyYearlyNominations";
import EmployeeMilestone from "../../Pages/EmployeeMilestone/EmployeeMilestone";
import AboutTheProgram from "../../Pages/AboutTheProgram/AboutTheProgram";
import PeerToPeer from "../../Pages/AdminPages/PeerToPeer/PeerToPeer";
import OnTheSpot from "../../Pages/AdminPages/Spotlight/OnTheSpot";
import QuarterlyNominations from "../../Pages/AdminPages/Nominations/QuarterlyNominations";
import YearlyNominations from "../../Pages/AdminPages/Nominations/AnnualNominations";
import DetailedView from "../../Pages/AdminPages/Spotlight/DetailedView";
import IAMDIGI from "../../Pages/AdminPages/Nominations/IAMDIGI";
import QuarterlyDetailedView from "../../Pages/AdminPages/Nominations/QuarterlyDetailedView";
import YearlyDetailedView from "../../Pages/AdminPages/Nominations/AnnualDetailedView";
import SpotlightReview from "../../Pages/UserPages/Reviewals/SpotlightReview";
import QuarterlyReview from "../../Pages/UserPages/Reviewals/QuarterlyReview";
import AnnualReview from "../../Pages/UserPages/Reviewals/AnnualReview";
import SpotlightReviewDetail from "../../Pages/UserPages/Reviewals/SpotlightReviewDetail";
import QuarterlyRevisionPage from "../../Pages/UserPages/Reviewals/QuarterlyReviewDetails";
import AnnualRevisionPage from "../../Pages/UserPages/Reviewals/AnnualReviewDetails";

function Navigation (props){
    const location = useLocation();
    const host = props.host;

    return (
        <AnimatePresence exitBeforeEnter initial={false}>
            <Routes location={location} key={location.pathname} >
                <Route path='/' element={<LandingPage graphdata={props.graphdata} mstoken={props.mstoken} ymtoken={props.ymtoken} host={host}/>}/>
                <Route path='RecognitionBreakdown' element={<RecognitionsBreakdown userid={props.graphdata.id} host={host}/>}/>
                <Route path='MyRecognitions' element={<MyRecognitions userid={props.graphdata.id} host={host}/>}/>
                <Route path='NominationView' element={<NominationView />}/>
                <Route path='MyQuarterlyNominations' element={<MyQuarterlyNominations graphdata={props.graphdata} host={host}/>}/>
                <Route path='MyYearlyNominations' element={<MyYearlyNominations graphdata={props.graphdata} host={host}/>}/>
                <Route path='EmployeeMilestone' element={<EmployeeMilestone />}/>
                <Route path='AboutTheProgram' element={<AboutTheProgram />}/>
                <Route path='PeerToPeer' element={<PeerToPeer host={host}/>}/>
                <Route path='OnTheSpot' element={<OnTheSpot host={host}/>}/>
                <Route path='SpotlightReview' element={<SpotlightReview graphdata={props.graphdata} host={host}/>}/>
                <Route path='SpotlightReviewDetail' element={<SpotlightReviewDetail graphdata={props.graphdata} host={host}/>}/>
                <Route path='QuarterlyNominations' element={<QuarterlyNominations host={host}/>}/>
                <Route path='QuarterlyReview' element={<QuarterlyReview graphdata={props.graphdata} host={host}/>}/>
                <Route path='QuarterlyNomRevision' element={<QuarterlyRevisionPage graphdata={props.graphdata} host={host}/>}/>
                <Route path='AnnualRevision' element={<AnnualRevisionPage graphdata={props.graphdata} host={host}/>}/>
                <Route path='YearlyNominations' element={<YearlyNominations host={host}/>}/>
                <Route path='AnnualReview' element={<AnnualReview graphdata={props.graphdata} host={host}/>}/>
                <Route path='IAmDigi' element={<IAMDIGI />}/>
                <Route path="DetailedView" element={<DetailedView userid={props.graphdata.id} host={host}/>}/>
                <Route path="QuarterlyDetailedView" element={<QuarterlyDetailedView userid={props.graphdata.id} host={host}/>}/>
                <Route path="YearlyDetailedView" element={<YearlyDetailedView userid={props.graphdata.id} host={host}/>}/>
                <Route path="*" element={<LandingPage  to="/" replace/>}/>
            </Routes>
        </AnimatePresence>
    )
}

export default Navigation;
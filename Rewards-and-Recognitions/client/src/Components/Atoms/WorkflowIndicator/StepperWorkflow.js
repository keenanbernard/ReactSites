import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import React, { useState, useRef, useEffect} from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import './StepperWorkflow.css';

function StepperWorkflow(props) {
    const [activeIndex, setActiveIndex] = useState();
    useEffect(() => {
        setActiveIndex(props.index)
    }, [props.index]);

    const toast = useRef(null);
    const items = [{label: 'Received'}, {label: 'Reviewing'}, {label: 'Send Back'}, {label: 'Hold'}, {label: 'Not Approved'}, {label: 'Approved'}];


    return (
        <div className="steps-demo">
            <Toast ref={toast}></Toast>
            <div className="cardty">
                <h5 className="workflow">Workflow</h5>
                <Steps model={items} activeIndex={activeIndex} />
            </div>
        </div>
    );
}

export default StepperWorkflow;
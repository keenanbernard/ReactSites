import {Container, Nav, Navbar} from "react-bootstrap";
import { Link } from 'react-router-dom';
import { SignOutButton } from "../../Microsoft/SignOutButton";
import './NavigationBar.css';
import Logo from './Logo/I-Am-Digi-logo-web-horizontal.png'

function NavigationBar(props) {
    return (
        <div className="empty">
            <Navbar collapseOnSelect className='navColor ps-3 pe-3' expand="lg">
                <Container fluid>
                    <Navbar.Brand><Link to='/'><img src={Logo} className='navImage' alt={'Hi'}/></Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <SignOutButton mstoken={props.mstoken}  userid={props.userid} host={props.host}/>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavigationBar;
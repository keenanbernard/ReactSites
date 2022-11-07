import React, {useEffect, useState} from "react";
import {useMsal} from "@azure/msal-react";
import {Card, Table} from "react-bootstrap";
import teamSpacing from "../../MiscellaneousImages/HR-portal-divider.png";
import './MyTeam.css';
import Pagination from "../Pagination/Pagination";

function MyTeam(props) {

    const {accounts} = useMsal();
    const name = accounts[0] && accounts[0].name;

    // Set Tokens & Bearers
    const token = props.mstoken;
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    const options = { method: "GET", headers: headers};

    // Encode user dept & set users from GraphApi
    const userDept = encodeURIComponent(props.graphdata.department);
    const [myTeam, setMyTeam] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    // Get Users in Azure AD
    const getMyTeam = async () => {
        const response = await fetch(`https://graph.microsoft.com/v1.0/users?$count=true&$filter=Department eq '`+userDept+`'`, options);
        let data = await response.json();
        let myMembers = data.value.filter(val => {return val.displayName !== name})
        setMyTeam(myMembers.sort((a,b)=> (a.jobTitle > b.jobTitle ? 1 : -1)));
    }

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = myTeam.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    useEffect(() => {
        getMyTeam();
    }, [token]);

    return (
        <Card>
            <Card.Body>
                <Card.Title className='myTeamTitle'>My
                    <span className='myTeamTitleText'> Team Members</span>
                    <br></br>
                    <img className='teamDivider' src={teamSpacing} alt={'Hi'}/>
                </Card.Title>
                <Table>
                    <tbody>
                        {currentPost?.map((val, index) => (
                          <tr key={index}>
                              <th>{val.jobTitle}</th>
                              <td>{val.displayName}</td>
                          </tr>
                        ))}
                    </tbody>
                </Table>

                <Pagination postsPerPage={postsPerPage} totalPosts={myTeam.length} paginate={paginate} />

            </Card.Body>
        </Card>
    )
}

export default MyTeam;
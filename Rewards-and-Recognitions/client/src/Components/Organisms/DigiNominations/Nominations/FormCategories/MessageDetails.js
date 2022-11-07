import React from "react";


const MessageDetails = (props) => {
  let messageText = '';

  if (props.messageResults === 'Digi Champion') {
    messageText = <>
      <p className='nomCategory'>
      The Digi Champion Award recognizes employees who promote and demonstrate corporate behaviors that support individual, groups, divisions, and departments in achieving the Company’s mission, vision, and values.</p>

      <p className='nomCategory'>Briefly provide a description (and evidence if any) of what Digi Corporate Behaviors the employee exemplifies.</p>
      <p className='nomCategory'>Kindly consider the following Eligibility Criteria in the description (and evidence if any) you submit.</p>
      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <ol>
        <li className='nomCategory'>Exemplifies at least four of Digi's seven Corporate Behaviors.</li>
        <li className='nomCategory'>Held in high regards by their respective managers and fellow peers.</li>
        <li className='nomCategory'>Maintains a high degree of integrity and professionalism.</li>
      </ol>
    </>
  }

  if (props.messageResults === 'Digi Customer First') {
    messageText = <>
      <p className='nomCategory'>
        The Digi Customer First Award recognizes employees recognizes employees who exemplify a “customer first” mindset daily; demonstrating excellence in service and support provided to internal/external customers.</p>
      <p className='nomCategory'>Briefly provide a description and evidence of the employee consistently demonstrating stellar customer service through positive interactions with Digi's internal and/or external customers.</p>
      <p className='nomCategory'>Kindly consider the following Eligibility Criteria in the description and evidence you submit.</p>
      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Selection Criteria:</p>
      <ol>
        <li className='nomCategory'>Highly regarded by customers and colleagues.</li>
        <li className='nomCategory'>Provides an exceptional level of service to the customer, showing flexibility, timeliness, responsiveness, and follow-through.</li>
        <li className='nomCategory'>Exceeds the expectation of employees, clients, and others he/she interacts with daily.</li>
      </ol>
    </>
  }

  if (props.messageResults === 'Digi Innovation') {
    messageText = <>
      <p className='nomCategory'>
        The Digi Innovation Award recognizes employees who have applied valuable ideas/approaches/solutions to develop new or improved processes, methods, systems, programs or services which resulted in monetary savings or significant operational efficiencies</p>
      <p className='nomCategory'>Briefly provide a description (and evidence if any) of what the employee challenged, the innovative solution and the positive outcome that was achieved.</p>
      <p className='nomCategory'>Kindly consider the following Eligibility Criteria in the description (and evidence if any) you submit.</p>
      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <ol>
        <li>Identified/developed/revised and/or applied a system, tool, process, initiative and/or program that resulted in one or more of the following:</li>
      </ol>
      <ol type='a'>
        <li className='nomCategory'>significant and positive impact on the department/Company;</li>
        <li className='nomCategory'>enhanced service delivery;</li>
        <li className='nomCategory'>increased efficiencies;</li>
        <li className='nomCategory'>enhanced the work environment or the customer experience;</li>
        <li className='nomCategory'>decreased cost; and/or</li>
        <li className='nomCategory'>decreased organizational risks.</li>
      </ol>
    </>
  }

  if (props.messageResults === 'Digi Five Star Honors') {
    messageText = <>
      <p className='nomCategory'>
        The Digi Five Star Honors Award recognizes employees who exemplifies excellence in leadership involving people,
        events, programs, projects and/or teams. Significant leadership skills such as the ability to lead and guide
        staff, develop staff talents and successfully manage an efficient and effective department at the highest
        level.</p>

      <p className='nomCategory'>Briefly provide a description of what leadership qualities the employee
        exemplifies.</p>
      <p className='nomCategory'>Kindly consider the following Eligibility Criteria in the description (and evidence if
        any) you submit.</p>
      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <ol>
        <li className='nomCategory'>Demonstrates outstanding commitment and professionalism.</li>
        <li className='nomCategory'>Empowers, challenges, and inspires staff to reach their highest potential and
          motivates others through practice and values.
        </li>
        <li className='nomCategory'>Effectively leads to achieve results that align with the Mission and Vision of BTL
          in a fiscally responsible manner.
        </li>
        <li className='nomCategory'>Effectively leads to achieve results that align with the Mission and Vision of BTL
          in a fiscally responsible manner.
        </li>
        <li className='nomCategory'>Exhibits the ability to connect and develop relationships that support a high level
          of trust and credibility through clear and concise communication skills guided by compassion and empathy.
        </li>
        <li className='nomCategory'>Demonstrates systems thinking by effectively managing change through partnership,
          collaboration and positive communication.
        </li>
      </ol>
    </>
  }

  if (props.messageResults === 'Digi Sales Frontrunner') {
    messageText = <>
      <p className='nomCategory'>
        The Digi Sales Frontrunner Award recognizes employees in sales roles who have met and exceeded quarterly sales targets by the highest percentage.</p>

      <p className='nomCategory'>Kindly upload the Quarterly Sales Report for your respective department.</p>

      <p className='nomCategory'>Please consider the following criteria for the report you submit.</p>

      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <ol>
        <li className='nomCategory'>Reflection of Target Vs. Achieved Quarterly Sales for Nominee.</li>
      </ol>
    </>
  }

  if (props.messageResults === 'Digi Credit Excellence') {
    messageText = <>
      <p className='nomCategory'>
        The Digi Credit Excellence Award recognizes employees in Credit Management roles who have met and exceeded quarterly collection targets by the highest percentage.</p>
      <p className='nomCategory'>Kindly upload the Quarterly Collection Report for the Credit Management Department.</p>
      <p className='nomCategory'>Please consider the following criteria for the report you submit.</p>

      <p style={{fontWeight: "bold", textDecoration: "underline"}}>Eligibility Criteria:</p>
      <ol>
        <li className='nomCategory'>Reflection of Target Vs. Achieved Quarterly Collections for Nominee.</li>
      </ol>
    </>
  }

  return (
    <>
      {messageText}
    </>
  )
}

export default MessageDetails;
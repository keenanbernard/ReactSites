import React from "react";
import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsalAuthentication } from "@azure/msal-react";
import {InteractionType} from "@azure/msal-browser";
import ProfileContent from "./Components/Microsoft/ProfileContent";
import './App.css';

function App() {
    useMsalAuthentication(InteractionType.Redirect);

  return (
      <AuthenticatedTemplate>
          <div className="App">
              <ProfileContent />
          </div>
      </AuthenticatedTemplate>

  );
}

export default App;

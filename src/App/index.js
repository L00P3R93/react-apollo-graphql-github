import React, {Component} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Organization from "../Organization";
import Profile from "../Profile";
import Navigation from "./Navigation";
import Footer from "./Footer";

import * as routes from '../constants/routes'

class App extends Component {
    state = {
        organizationName: 'the-road-to-learn-react'
    };

    onOrganizationSearch = value => {
        this.setState({organizationName: value})
    };

    render() {
        const {organizationName} = this.props

        return (
            <Router>
                <div className="App">
                    <Navigation
                        organizationName={organizationName}
                        onOrganizationSearch={this.onOrganizationSearch}
                    />
                    <div className="App-main">
                        <Routes>
                            <Route
                                exact
                                path={routes.ORGANIZATION}
                                Component={() => (
                                    <div className="App-content_large-header">
                                        <Organization organizationName={organizationName}/>
                                    </div>
                                )}
                            />
                            <Route 
                                exact
                                path={routes.PROFILE}
                                Component={() => (
                                    <div className="App-content_small-header">
                                        <Profile/>
                                    </div>
                                )}
                            />
                        </Routes>
                    </div>

                    <Footer />
                </div>
            </Router>
        )
    }
}

export default App;
import React from "react";
import { Link, useLocation } from "react-router-dom";

import * as routes from '../../constants/routes'
import Button from "../../Button";
import Input from "../../Input";

import './style.css'

const Navigation = ({
    organizationName,
    onOrganizationSearch,
}) => {
    const location = useLocation();
    return (
        <header className="Navigation">
            <div className="Navigation-link">
                <Link to={routes.PROFILE}>Profile</Link>
            </div>
            <div className="Navigation-link">
                <Link to={routes.ORGANIZATION}>Organization</Link>
            </div>
    
            {location.pathname === routes.ORGANIZATION && (
                <OrganizationSearch 
                    organizationName={organizationName}
                    onOrganizationSearch={onOrganizationSearch}/>
            )}
        </header>
    )
}

class OrganizationSearch extends React.Component{
    state = {
        value: this.props.organizationName
    }

    onChange = e => {
        this.setState({value: e.target.value})
    };

    onSubmit = e => {
        this.props.onOrganizationSearch(this.state.value)
        e.preventDefault()
    }

    render(){
        const {value} = this.state;

        return (
            <div className="Navigation-search">
                <form onSubmit={this.onSubmit}>
                    <Input 
                        color={'white'}
                        type="text"
                        value={value}
                        onChange={this.onChange}
                        />{' '}
                    <Button color={'white'} type="submit">
                        Search
                    </Button>
                </form>
            </div>
        )
    }
}

export default Navigation
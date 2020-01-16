import React, { Profiler } from "react";
import { Router, Route, withRouter, Switch } from "react-router-dom"
import "./App.css";

import API from "./util/APIUtils";
import { ACCESS_TOKEN } from "./constants";

import AppHeader from "./components/AppHeader/AppHeader";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import Login from "./components/Login/Login";
import NewPoll from "./components/Poll/NewPoll";
import NotFound from "./components/NotFound/NotFound";
import PollList from "./components/Poll/PollList";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Profile from "./components/Profile/Profile";
import Signup from "./components/Signup/Signup";

import { Layout, notification } from "antd";
const { Content } = Layout;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  componentDidMount = () => {
    this.loadCurrentUser();
  }

  loadCurrentUser = () => {
    this.setState({
      isLoading: true
    });
    API.getCurrentUser()
    .then(res => {
      this.setState({
        currentUser: res,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(err => {
      this.setState({
        isLoading: false
      });
    });
  }

  handleLogin = () => {
    notification.success({
      message: "Polling App",
      description: "You're successfully logged in."
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Polling App",
      description: description
    });
  }

  render(){
    if(this.state.isLoading){
      return <LoadingIndicator />
    }
    return (
      <Layout className="app-container">
        <AppHeader 
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} 
        />

        <Content className="app-content">
          <div className="container">
            <Router>
              <Switch>
                <Route exact path="/"
                  render={(props) => 
                    <PollList 
                      isAuthenticated={this.state.isAuthenticated}
                      currentUser={this.state.currentUser}
                      handleLogout={this.handleLogout}
                      {...props} 
                    />
                }>
                </Route>
                <Route path="/login"
                  render={(props) => 
                  <Login 
                    onLogin={this.handleLogin}
                    {...props}
                  />
                }>
                </Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username"
                  render={(props) => 
                  <Profile
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                }>
                </Route>
                <PrivateRoute path="/poll/new"
                  authenticated={this.state.isAuthenticated}
                  component={NewPoll}
                  handleLogout={this.handleLogout}
                />
                <Route component={NotFound}></Route>
              </Switch>
            </Router>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);

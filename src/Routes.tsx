import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Bye } from './pages/Bye';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './pages/Header'

function Routes() {
return <BrowserRouter>
<div>
  <header>
  <Header />
  </header>

<Switch>
  <Route exact path="/" component = {Home}/>
  <Route exact path="/register" component = {Register}/>
  <Route exact path="/login" component = {Login}/>
  <Route exact path="/bye" component = {Bye}/>

</Switch>
</div>
</BrowserRouter>;
  
};

export default Routes;

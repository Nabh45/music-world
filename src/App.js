import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ArtistList from './component/ArtistList';
import ArtistDetails from './component/ArtistDetails';

export default () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ArtistList} />
            <Route path='/artist/:id' component={ArtistDetails} />
        </Switch>
    </BrowserRouter>
)

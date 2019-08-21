/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './Main';

export default function App(props) {
  return (
    <Router>
      <Route path="/" exact component={Main} />
    </Router>
  )
}

App.propTypes = {};

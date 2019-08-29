/**
 * Created by Arvids on 2019.08.28..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

function Header(props) {

  return (
    <div>
      <h2>Novuss Ref!</h2>
      <Link to="/">Home</Link>
      <Link to="/game">Game</Link>
    </div>
  )
}

Header.propTypes = {};

const enhance = compose();

export default enhance(Header);

/**
 * Created by Arvids on 2019.08.28..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import styles from './headerStyles.module.scss';

function Header(props) {

  return (
    <div className={styles.header}>
      <h2>Novuss Ref!</h2>
      <Link className={styles.link} to="/">Home</Link>
      <Link className={styles.link} to="/game">Game</Link>
    </div>
  )
}

Header.propTypes = {};

const enhance = compose();

export default enhance(Header);

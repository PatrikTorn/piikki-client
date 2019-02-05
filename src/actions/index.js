import * as appActions from './appActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

export const mdp = (dispatch) => (bindActionCreators({
  ...appActions,
}, dispatch));

export const msp = (state, props) => state

export const Connect = connect(msp, mdp);
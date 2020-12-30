import React from 'react';
import { withRouter } from 'react-router-dom';
import { CONSTS } from '../helpers/constants';
import OSForm from '../OSForm';

export const OSPresentation = withRouter((props) => {
    return <>
        {!props.selected && <img src={CONSTS.LOGOURL} width='85px' alt="Elite Bike logo" className='out-side-logo' />}
        <OSForm {...props} />
    </>
})
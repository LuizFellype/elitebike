import React from 'react';
import { withRouter } from 'react-router-dom';
import OSForm from '../OSForm';

export const OSPresentation = withRouter((props) => {
    return <>
        {!props.selected && <img src="https://scontent.fvix1-1.fna.fbcdn.net/v/t1.0-9/50549129_2462771803795299_8027391492240703488_o.jpg?_nc_cat=106&ccb=2&_nc_sid=09cbfe&_nc_ohc=gD1E9Bqu5TYAX8u2Cxu&_nc_ht=scontent.fvix1-1.fna&oh=0f4292a5cd4325eaa6446f5826080b66&oe=60101FE5" width='85px' alt="Elite Bike logo" className='out-side-logo' />}
        <OSForm {...props} />
    </>
})
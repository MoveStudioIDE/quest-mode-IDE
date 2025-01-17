import React from 'react';
import './pageLayout.css';


function PageLayout (props: {header: JSX.Element, innerSidebar: JSX.Element, canvas: JSX.Element}) {

  return (
    <div className="page-build"> 
      <div className='header '>
        {props.header}
      </div>
      <div className='inner-sidebar-section bg-base-300'>
        {props.innerSidebar}
      </div>
      <div className="canvas-section bg-base-100">
        {props.canvas}
      </div>
    </div>
  )
}

export default PageLayout;

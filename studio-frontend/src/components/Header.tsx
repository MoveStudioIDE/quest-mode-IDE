import React from "react";
import {ConnectButton} from '@suiet/wallet-kit';
import { Link } from "react-router-dom";
import studioIcon from "../icons/studio-62.png"
import studioIcon2Transparent from "../icons/moveIconTransparent1.png"
import studioIcon3Transparent from "../icons/studio10Transparent.png"
import studioIconGifTransparent from "../icons/studioTransparent.gif"
import daniel from "../icons/dan.jpeg"

import bugIcon from "../icons/insect-30.png"


// const daisyThemes = [
//   // 'light',
//   'dark',
//   // 'cupcake',
//   // 'bumblebee',
//   // 'emerald',
//   // 'corporate',
//   // 'synthwave',
//   // 'retro',
//   // 'cyberpunk',
//   // 'valentine',
//   // 'halloween',
//   // 'garden',
//   // 'forest',
//   // 'aqua',
//   // 'lofi',
//   // 'pastel',
//   // 'fantasy',
//   // 'wireframe',
//   // 'black',
//   // 'luxury',
//   'dracula',
//   // 'cmyk',
//   // 'autumn',
//   'business',
//   // 'acid',
//   // 'lemonade',
//   'night',
//   'coffee',
//   // 'winter'
// ];

function Header(
  props: {
    resetCache: () => void;
    resetDemo: () => void;
  }
) {

  

  return (
    <div className="navbar bg-base-300 step9">
      {/* <div className="flex-none">
        <div className="dropdown dropdown-bottom">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <a><li><Link to="/build"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>Build</Link></li></a>
            <a><li><Link to="/deployment"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>Deploy</Link></li></a>
          </ul>
        </div>
      </div> */}
      <div className="flex-1">
        <a><Link to="/" className="btn btn-ghost normal-case text-xl ml-1"> 
          <img src={studioIconGifTransparent} width="40px" style={{marginRight: "5px"}}/>
          Move Studio
        </Link></a>
      </div>
      <div className="flex-none">
        {/* <div className="dropdown dropdown-end ">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            Theme
            <svg className="ml-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><path d="M6 9l6 6 6-6"/></svg>
          </label>
          <ul tabIndex={0} className="menu dropdown-content menu-compact p-2 shadow bg-base-100 rounded-box w-52 mt-4 h-40" style={{display: "inline", overflow: "auto"}}>
          {
              daisyThemes.map((theme) => {
                // return <li><a className={`btn m-1 btn-secondary ${props.theme === 'winter' ? 'text-slate-400' : ''}`} onClick={() => {props.setTheme(theme)}}>{theme}</a></li> 
                return <li><a className={`btn m-1 btn-accent`} style={{color: "hsl(var(--ac))"}} onClick={() => {props.setTheme(theme)}}>{theme}</a></li> 
              })
            }
          </ul>
        </div> */}
        <div className="dropdown dropdown-end">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            {/* <div className="avatar btn btn-circle btn-ghost hover:ring hover:ring-primary">
              <div className="w-12 rounded-full">
                <img src={daniel} />
              </div>
            </div> */}
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            {/* <li>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Auto compile</span> 
                  <input type="checkbox" className="toggle toggle-info" onClick={() => {
                    console.log("toggle");
                    props.setAutoCompile(!props.autoCompile);
                  }} />
                </label>
              </div>
            </li> */}
            {/* <li><a onClick={props.startTutorial}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Run tutorial
            </a></li> */}
            <li><a onClick={props.resetDemo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
              Reset demo project
            </a></li>
            <li><a onClick={props.resetCache}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
              Reset IDE
            </a></li>
            <li><a href="https://discord.gg/ep2MXBf9wy" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Report a bug
            </a></li>

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
import { Link } from "react-router-dom";
import studioIconGifTransparent from "../icons/studioTransparent.gif"

function Header(
  props: {
    resetCache: () => void;
  }
) {

  return (
    <div className="navbar bg-base-300 step9">
      <div className="flex-1">
        <a><Link to="/" className="btn btn-ghost normal-case text-xl ml-1"> 
          <img src={studioIconGifTransparent} width="40px" style={{marginRight: "5px"}}/>
          Move Studio
        </Link></a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="arcs"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
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
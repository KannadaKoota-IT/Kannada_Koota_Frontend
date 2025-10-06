import React from "react";
import styled from "styled-components";

const Tooltip = () => {
  return (
    <StyledWrapper>
      <ul className="social-icons">
        {/* Gmail */}
        <li className="icon-content">
          <a
            data-social="email"
            aria-label="Email"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=kannadakoota.it@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="filled" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M1.5 4a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-17a2 2 0 0 1-2-2V4zm2 0v.217l8.5 5.65 8.5-5.65V4h-17zm17 2.783-8.223 5.466a1 1 0 0 1-1.055 0L3.5 6.783V20h17V6.783z" />
            </svg>
          </a>
          <div className="tooltip">Mail</div>
        </li>

        {/* Instagram */}
        <li className="icon-content">
          <a
            data-social="instagram"
            aria-label="Instagram"
            href="https://www.instagram.com/kannadakoota_pesu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="filled" />
            <svg
              xmlSpace="preserve"
              viewBox="0 0 16 16"
              className="bi bi-instagram"
              fill="currentColor"
              height={16}
              width={16}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
              />
            </svg>
          </a>
          <div className="tooltip">Instagram</div>
        </li>
      </ul>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 0;
  }

  .icon-content {
    position: relative;
  }

  .icon-content .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background-color: #111;
    padding: 6px 10px;
    border-radius: 5px;
    opacity: 0;
    visibility: hidden;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .icon-content:hover .tooltip {
    opacity: 1;
    visibility: visible;
    top: -50px;
  }

  .icon-content a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    background-color: #333;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }

  .icon-content a:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  .icon-content a svg {
    z-index: 1;
    width: 24px;
    height: 24px;
  }

  .icon-content a .filled {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: all 0.3s ease-in-out;
  }

  .icon-content a:hover .filled {
    height: 100%;
  }

  /* Colors */
  .icon-content a[data-social="email"] .filled {
    background-color: #d44638; /* Gmail red */
  }
  .icon-content a[data-social="instagram"] .filled {
    background: linear-gradient(
      45deg,
      #405de6,
      #5b51db,
      #b33ab4,
      #c135b4,
      #e1306c,
      #fd1f1f
    );
  }
`;

export default Tooltip;

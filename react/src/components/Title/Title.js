import React, {Component} from 'react';

export default class Title extends Component {
  render() {
    return (
      <div className="Title">
        <div className="flex stretch">
          <svg width="8px" height="100%" viewBox="0 0 5 20" version="1.1" preserveAspectRatio="none">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-24.000000, -32.000000)" fill="#338BF6">
                <g>
                  <g transform="translate(24.000000, 32.000000)">
                    <path
                      d="M1.18760135e-15,8.8817842e-16 L1.18760135e-15,8.8817842e-16 L-1.99840144e-15,8.8817842e-16 C2.90728684,0.581457369 5,3.13415704 5,6.09901951 L5,20 L5,20 L5,20 C2.09271316,19.4185426 4.37549802e-15,16.865843 5.32907052e-15,13.9009805 L1.18760135e-15,8.8817842e-16 Z"
                      />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <h1>FIRETEAM.GG</h1>
        </div>
      </div>
    );
  }
}
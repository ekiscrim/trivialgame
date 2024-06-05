const Logo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 500 500"
    width={props.width}
    height={props.height}
    {...props}
  >
    <defs>
      <linearGradient id="a">
        <stop
          offset={0.066}
          style={{
            stopColor: "#db49d6",
          }}
        />
        <stop
          offset={0.962}
          style={{
            stopColor: "#781375",
          }}
        />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="b"
        x1={136.708}
        x2={136.708}
        y1={19.906}
        y2={254.683}
        gradientTransform="translate(-11 -5)"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient
        xlinkHref="#a"
        id="c"
        x1={136.708}
        x2={136.708}
        y1={19.906}
        y2={254.683}
        gradientTransform="translate(236.17 -6.186)"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient
        xlinkHref="#a"
        id="d"
        x1={136.708}
        x2={136.708}
        y1={19.906}
        y2={254.683}
        gradientTransform="translate(-10.245 237.413)"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient
        xlinkHref="#a"
        id="e"
        x1={136.708}
        x2={136.708}
        y1={19.906}
        y2={254.683}
        gradientTransform="translate(236.144 236.584)"
        gradientUnits="userSpaceOnUse"
      />
    </defs>
    <rect

      style={{
        fillRule: "nonzero",
        fill: "url(#b)",
        strokeMiterlimit: 10.26,
        strokeLinecap: "round",
        stroke: "url(#gradient-1)",
        strokeLinejoin: "round",
        paintOrder: "stroke",
        strokeOpacity: 0,
        strokeWidth: 0,
      }}
    />
    {/*<rect
      width={234.777}
      height={234.777}
      x={255.49}
      y={13.72}
      rx={17}
      ry={17}
      style={{
        fillRule: "nonzero",
        strokeMiterlimit: 10.26,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        paintOrder: "stroke",
        strokeOpacity: 0,
        strokeWidth: 0,
        fill: "url(#c)",
        stroke: "url(#gradient-2)",
      }}
    /> */}
    <rect

      style={{
        fillRule: "nonzero",
        strokeMiterlimit: 10.26,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        paintOrder: "stroke",
        strokeOpacity: 0,
        strokeWidth: 0,
        fill: "url(#d)",
        stroke: "url(#gradient-3)",
      }}
    />
    <rect

      style={{
        fillRule: "nonzero",
        strokeMiterlimit: 10.26,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        paintOrder: "stroke",
        strokeOpacity: 0,
        strokeWidth: 0,
        fill: "url(#e)",
        stroke: "url(#gradient-4)",
      }}
    />
    <path
      
      d="M782.167 262h12.666l.08 35.96a10.68 10.68 0 0 1 2.128 2.128l35.959.079v12.666l-35.96.08a10.68 10.68 0 0 1-2.128 2.128L794.833 351h-12.666l-.08-35.96a10.68 10.68 0 0 1-2.128-2.128L744 312.833v-12.666l35.96-.08a10.68 10.68 0 0 1 2.128-2.128Zm6.333 44.5h0"
      style={{
        paintOrder: "fill",
        fill: "transparent",
        stroke: "#fff",
        strokeWidth: "15.5357px",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="matrix(1.3861 1.24804 -1.1639 1.29265 -612.164 -1244.16)"
    />
    <path
      
      d="M782.167 262h12.666l.08 35.96a10.68 10.68 0 0 1 2.128 2.128l35.959.079v12.666l-35.96.08a10.68 10.68 0 0 1-2.128 2.128L794.833 351h-12.666l-.08-35.96a10.68 10.68 0 0 1-2.128-2.128L744 312.833v-12.666l35.96-.08a10.68 10.68 0 0 1 2.128-2.128Zm6.333 44.5h0"
      style={{
        paintOrder: "fill",
        fill: "transparent",
        stroke: "#fff",
        strokeWidth: "15.5357px",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="matrix(1.3861 1.24804 -1.1639 1.29265 -605.624 -1008.729)"
    />
    <path
      
      d="M782.167 262h12.666l.08 35.96a10.68 10.68 0 0 1 2.128 2.128l35.959.079v12.666l-35.96.08a10.68 10.68 0 0 1-2.128 2.128L794.833 351h-12.666l-.08-35.96a10.68 10.68 0 0 1-2.128-2.128L744 312.833v-12.666l35.96-.08a10.68 10.68 0 0 1 2.128-2.128Zm6.333 44.5h0"
      style={{
        paintOrder: "fill",
        fill: "transparent",
        stroke: "#fff",
        strokeWidth: "15.5357px",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="matrix(1.3861 1.24804 -1.1639 1.29265 -359.219 -1007.208)"
    />
    <path
      d="m293.438 128.492 58.275 68.871L457.666 84.788l-18.543-14.569-83.437 88.737-52.977-46.355-9.271 15.891Z"
      style={{
        fill: "transparent",
        stroke: "#fff",
        strokeLinejoin: "round",
        paintOrder: "fill",
        strokeWidth: 31,
        strokeDashoffset: "-3px",
      }}
    />
  </svg>
)
export default Logo

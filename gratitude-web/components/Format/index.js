export default props => {
  return (
    <>
      {props.children}
      <style global jsx>{`
        /* https://philipwalton.github.io/solved-by-flexbox/demos/holy-grail/ */
        /* http://meyerweb.com/eric/tools/css/reset/
        v2.0 | 20110126
        License: none (public domain)
        */

        html,
        body,
        div,
        span,
        applet,
        object,
        iframe,
        p,
        blockquote,
        pre,
        a,
        abbr,
        acronym,
        address,
        big,
        cite,
        code,
        del,
        dfn,
        em,
        img,
        ins,
        kbd,
        q,
        s,
        samp,
        small,
        strike,
        strong,
        sub,
        sup,
        tt,
        var,
        b,
        u,
        i,
        center,
        dl,
        dt,
        dd,
        ol,
        ul,
        li,
        fieldset,
        form,
        label,
        legend,
        table,
        caption,
        tbody,
        tfoot,
        thead,
        tr,
        th,
        td,
        article,
        aside,
        canvas,
        details,
        embed,
        figure,
        figcaption,
        footer,
        header,
        hgroup,
        menu,
        nav,
        output,
        ruby,
        section,
        summary,
        time,
        audio,
        video {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          display: flex;
          flex-direction: column;
          vertical-align: baseline;
          box-sizing: border-box;
          font-size: 16px;
          font-family: "Inter UI", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          font-weight: 400;
        }
        mark {
          padding: 0 3px;
          margin-left: 5px;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          display: flex;
          flex-direction: column;
          vertical-align: baseline;
          box-sizing: border-box;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
          font-weight: 700;
        }
        a {
          color: #23535d;
        }
        body {
          line-height: 1;
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          height: 100%;
        }
        ol,
        ul {
          list-style: none;
        }
        blockquote,
        q {
          quotes: none;
        }
        blockquote:before,
        blockquote:after,
        q:before,
        q:after {
          content: "";
          content: none;
        }
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        .row {
          flex-direction: row;
        }
        .column {
          flex-direction: column;
        }
        #__next {
          display: flex;
          flex: 1;
          flex-direction: column;
        }
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          text-shadow: rgba(0, 0, 0, 0.01) 0 0 1px;
        }
        .navbar-brand img {
          max-height: 1.6rem;
        }
      `}</style>
    </>
  )
}

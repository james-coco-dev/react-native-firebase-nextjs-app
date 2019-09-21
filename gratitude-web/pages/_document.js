import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <html>
        <Head>
          <link
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,600'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
            integrity='sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO'
            crossOrigin='anonymous'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/all.min.css'
            crossOrigin='anonymous'
          />
          <link
            rel='preload'
            as='font'
            href='/static/fonts/Inter-UI-upright.var.woff2'
            type='font/woff2'
            crossOrigin='anonymous'
          />
          <link
            rel='preload'
            as='font'
            href='/static/fonts/Inter-UI.var.woff2'
            type='font/woff2'
            crossOrigin='anonymous'
          />
          <link
            src='https://code.jquery.com/jquery-3.3.1.slim.min.js'
            integrity='sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo'
            crossOrigin='anonymous'
          />
          <script
            src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js'
            integrity='sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49'
            crossOrigin='anonymous'
          />
          <script
            src='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
            integrity='sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy'
            crossOrigin='anonymous'
          />
          <script dangerouslySetInnerHTML={{ __html: `
            var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
              analytics.load("leA65W3AidR5D9T4JFHLFf7rKEKNw1lz");}
          ` }} />
        </Head>
        <body className='custom_class'>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

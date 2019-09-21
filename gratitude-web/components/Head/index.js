import Head from 'next/head'

export default props => (
  <Head>
    <title>{props.title || 'Gratitude'}</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    <meta
      property='og:url'
      content={props.ogUrl || 'https://givegratitude.co'}
    />
    <meta property='og:type' content={props.ogType || 'webpage'} />
    <meta property='og:title' content={props.ogTitle || 'Gratitude'} />
    <meta
      property='og:description'
      content={props.ogDescription || 'Help someone fulfill their dream.'}
    />
    <meta
      property='og:image'
      content={
        props.ogImage ||
        'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F248797%2Fpexels-photo-248797.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D1%26w%3D500&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fnature%2F&docid=ShwNVOdFBcmkxM&tbnid=8c_UAo3gH_220M%3A&vet=10ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg..i&w=500&h=200&bih=754&biw=1536&q=image&ved=0ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg&iact=mrc&uact=8'
      }
    />
    <meta
      property='og:image:secure_url'
      content={
        props.ogImage ||
        'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F248797%2Fpexels-photo-248797.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D1%26w%3D500&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fnature%2F&docid=ShwNVOdFBcmkxM&tbnid=8c_UAo3gH_220M%3A&vet=10ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg..i&w=500&h=200&bih=754&biw=1536&q=image&ved=0ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg&iact=mrc&uact=8'
      }
    />
    <meta property='og:image:width' content='1200' />
    <meta property='og:image:height' content='630' />
    <meta property='og:image:alt' content='Gratitude' />
    <meta name='twitter:card' content='summary' />
    <meta
      name='twitter:description'
      content={props.ogDescription || 'Help someone fulfill their dream.'}
    />
    <meta name='twitter:title' content={props.ogTitle || 'Gratitude'} />
    <meta
      name='twitter:site'
      content={props.ogUrl || 'https://givegratitude.co'}
    />
    <meta
      name='twitter:image'
      content={
        props.ogImage ||
        'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F248797%2Fpexels-photo-248797.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D1%26w%3D500&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fnature%2F&docid=ShwNVOdFBcmkxM&tbnid=8c_UAo3gH_220M%3A&vet=10ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg..i&w=500&h=200&bih=754&biw=1536&q=image&ved=0ahUKEwiD5Lqnm8bhAhUDEbwKHY_MDw0QMwhqKAIwAg&iact=mrc&uact=8'
      }
    />
    <meta name='twitter:creator' content='@armaan' />
  </Head>
)

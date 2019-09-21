/**
 * Validates the current content of a dream and redirects back to the page that
 * has the information that the user is lacking.
 */
const validateDreamAndRedirect = (dream, navigate) => {
  const path = window.location.pathname

  // if we're on the create a story page, check to make sure the dream has a title, otherwise
  // redirect to the /create route
  if (/\/create\/story/g.test(path)) {
    if (!dream.title) {
      navigate('/create')
    }
  }

  if (/\/create\/photo/g.test(path)) {
    if (!dream.title) {
      navigate('/create')
    }
    if (!dream.story) {
      navigate('/create/story')
    }
  }

  if (/\/create\/contribute/g.test(path)) {
    if (!dream.title) {
      navigate('/create')
    }
    if (!dream.story) {
      navigate('/create/story')
    }
    if (!dream.imageUrl) {
      navigate('/create/photo')
    }
  }
}

export default validateDreamAndRedirect

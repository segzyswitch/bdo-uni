export default defineEventHandler(async (event) => {
  try {
    const formData = new FormData()

    formData.append('_captcha', 'false')
    formData.append('_template', 'table')

    const response = await fetch(
      `https://formsubmit.co/ajax/${process.env.FORMSUBMIT_TOKEN}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      }
    )

    const result = await response.json()

    return result
  } catch (error) {
    console.error(error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to submit form'
    })
  }
})
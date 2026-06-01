export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const formData = new FormData()
    const config = useRuntimeConfig()

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    formData.append('apiKey', config.staticformsApiKey)
    formData.append('_captcha', 'false')


    const res = await fetch(
      `https://api.staticforms.dev/submit`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      }
    )

    const text = await res.text()

    return {
      status: res.status,
      response: text
    }

  } catch (err: any) {
    console.error('API ERROR:', err)

    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Server error'
    })
  }
})
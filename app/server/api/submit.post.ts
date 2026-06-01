export default defineEventHandler(async (event) => {
  try {
    const formData = new FormData()

    const config = useRuntimeConfig()

    const res = await fetch(
      `https://formsubmit.co/ajax/${config.formsubmitToken}`,
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
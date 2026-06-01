export default defineEventHandler(async (event) => {
  try {
    const parts:any = await readMultipartFormData(event)

    if (!parts) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      })
    }

    const formData = new FormData()

    for (const part of parts) {
      if (part.filename) {
        const blob = new Blob(
          [part.data],
          { type: part.type || 'application/octet-stream' }
        )

        formData.append(
          part.name!,
          blob,
          part.filename
        )
      } else {
        formData.append(
          part.name!,
          part.data.toString()
        )
      }
    }

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
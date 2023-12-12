const eventProps = {
  cart: {
    get: 'cart.get',
    add: 'cart.add',
    update: 'cart.update',
    clear: 'cart.clear',
    count: 'cart.count',
    change: 'cart.change',
    render: 'cart.render'
  },
  product: {
    updateVariant: 'product.update_variant'
  },
  notice: {
    global: 'notice.global'
  }
}

const fetchDateError = (error) => {
  console.log('error', error)
}

const fetchData = (endpoint, callback = null) => {
  return fetch(endpoint)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json()
      } else {
        callback ? callback() : fetchDateError(response.statusText)
        throw Error(response.statusText)
      }
    })
    .then((jsonResponse) => {
      return jsonResponse
    })
    .catch((error) => {
      callback ? callback() : fetchDateError(error)
    })
}

const postData = (endpoint, body, type = 'json', callback = null) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: type === 'json' ? JSON.stringify(body) : body
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json()
      } else {
        callback ? callback(response) : fetchDateError(response.statusText)
      }
    })
    .then((jsonResponse) => {
      return jsonResponse
    })
    .catch((error) => {
      fetchDateError(error)
    })
}

export { fetchData, postData, eventProps }

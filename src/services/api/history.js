import axios, { parseCursor } from '@/services/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/history/${id}/`)).data
  },

  async list (filter) {
    const response = (await axios.get('/api/history/', { params: filter })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convert(response.results),
    }
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const date = new Date(val.date)
    let payload = val.payload
    if (payload) {
      // convert some known payload dates
      let dates = {};
      ['date', 'startDate', 'invitedAt'].forEach(k => {
        if (payload[k]) {
          dates[k] = new Date(payload[k])
        }
      })
      payload = {
        ...payload,
        ...dates,
      }
    }
    return { ...val, date, payload }
  }
}

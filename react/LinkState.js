const resolvers = {
  Mutation: {
    setContentOpened: (_, { isContentOpened }, { cache: myCache }) => {
      myCache.writeData({ data: { isContentOpened } })
      return null
    }
  }
}

const initialState = { isContentOpened: false }

module.exports = { resolvers, initialState }
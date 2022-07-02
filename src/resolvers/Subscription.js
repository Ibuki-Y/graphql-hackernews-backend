function newLinkSubscribe(parent, args, context) {
  // asyncIterator: 非同期繰り返し処理
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

function newVoteSubscribe(parent, args, context) {
  // asyncIterator: 非同期繰り返し処理
  return context.pubsub.asyncIterator('NEW_VOTE');
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
  newVote,
};

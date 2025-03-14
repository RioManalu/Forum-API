const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.PostThreadHandler(request, h),
    options: {
      auth: 'forumapp_jwt',
    },
  },
]

module.exports = routes;
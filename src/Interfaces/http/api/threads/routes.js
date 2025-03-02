const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.PostThreadHandler(request, h),
  },
]

module.exports = routes;
import testController from '../controllers/testController'
/**
 * test API
 * @description {}
 */

exports = module.exports = [
  /**
   * getSignature
   * @path /api/test
   * @method get
   * @operationId
   * @success
   */
  {
    method: 'GET',
    route: '/api/test',
    handlers: [
      testController.test
    ]
  }
]

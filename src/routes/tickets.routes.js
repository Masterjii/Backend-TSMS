const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ticketsController = require('../controllers/tickets.controller');
const auditController = require('../controllers/audit.controller')

router.post('/', requireAuth, ticketsController.createTicket);
router.get('/', requireAuth, ticketsController.listTickets);
router.get('/:id', requireAuth, ticketsController.getTicket);
router.get('/:id/audit', requireAuth, auditController.getTicketAuditHistory);
router.post('/:id/reply', requireAuth, ticketsController.replyToTicket);
router.post('/:id/assign', requireAuth, ticketsController.assignTicket);
router.post('/:id/merge', requireAuth, ticketsController.mergeTicket);
router.post('/:id/close', requireAuth, ticketsController.closeTicket);
router.patch('/:id/status', requireAuth, ticketsController.updateTicketStatus);
router.post('/:id/dependency', requireAuth, ticketsController.addDependency);
router.patch('/:id/dependency', requireAuth, ticketsController.removeDependency);
router.patch('/:id/dependency/:depId', requireAuth, ticketsController.closeTicket);

module.exports = router;
